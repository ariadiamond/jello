import * as S from 'sury';
import database from './database';

const BaseSchemaValue = S.schema({ type: S.string, id: S.number });
type BaseSchema = S.Output<typeof BaseSchemaValue> & { fields: { [key: string]: any } };

const UnaryOperators_st = S.union(['IS NULL', 'IS NOT NULL']);
const BinaryOperators_st = S.union(['=', '!=', '<>', '>', '<', '>=', '<=', 'LIKE', 'ILIKE']);

type Model<T extends BaseSchema> = {
  type: T;
  data: {
    select: string[];
    baseTable: string;
    where: {
      left: string | number;
      operator: S.Output<typeof UnaryOperators_st> | S.Output<typeof BinaryOperators_st>;
      right?: string | number;
    }[];
    limit: number | null;
  };
  select: (params: Model<T>['data']['select']) => Model<T>;
  where: (params: Model<T>['data']['where'][number]) => Model<T>;
  limit: (params: Model<T>['data']['limit']) => Model<T>;
  toSql: () => any;
  create: (params: Exclude<T, 'id' | 'type'>) => { id: number };
  update: (params: T & { id: number }) => void;
};

// TODO: Before going to production + if this scales at all, this needs to be strengthened a lot
const escapeString = (str: string): string => `'${str.replace(/[^a-z0-9_]/ig, '')}'`;

function parseSelect<T extends BaseSchema>(model: Model<T>) {
  const schemaKeys = Object.keys(model.type.fields); // NOTE: this is undocumented!
  const parsed = model.data.select.map((s) => {
    const re = new RegExp(`^${s}$`, 'i');
    const columnName = schemaKeys.find((sk) => re.test(sk));
    if (!columnName) {
      throw new Error(`Unknown column while parsing Select: ${model.data.baseTable}.${s}`);
    }
    return `${model.data.baseTable}.${columnName}`;
  });
  if (parsed.length === 0) {
    return `SELECT ${model.data.baseTable}.*`;
  }
  return `SELECT ${parsed.join(', ')}`;
}

function parseFrom<T extends BaseSchema>(model: Model<T>) {
  return `FROM ${model.data.baseTable}`;
}

function parseExprOrLiteral<T extends BaseSchema>(model: Model<T>, value: any): string | number | never {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value !== 'string') {
    throw new Error(`Unknown type for expression or literal: expected string or number, got: ${value}`);
  }

  const re = new RegExp(`^${value}$`, 'i');
  const schemaKeys = Object.keys(model.type.fields);
  const col = schemaKeys.find((sk) => re.test(sk));
  if (col) {
    return `${model.data.baseTable}.${col}`;
  }
  return escapeString(value);
}

function parseOperator(operator: any): Model<any>['data']['where'][number]['operator'] | never {
    return S.parseOrThrow(
      operator,
      S.union([BinaryOperators_st, UnaryOperators_st])
    );
}

function parseWhere<T extends BaseSchema>(model: Model<T>) {
  const whereClauses = model.data.where.map((clause) => {
    const left = parseExprOrLiteral(model, clause.left);
    const operator = parseOperator(clause.operator);
    // @ts-ignore NOTE: this is not documented. Make sure Sury updates don't break this
    const right = UnaryOperators_st.anyOf.map((s) => s.const).includes(operator)
      ? ''
      : parseExprOrLiteral(model, clause.right);
    return `${left} ${operator} ${right}`.trim();
  });
  if (whereClauses.length === 0) {
    return '';
  }
  return `WHERE ${whereClauses.join(' AND ')}`;
}

function parseLimit(limit: number | null) {
  if (typeof limit !== 'number') {
    return '';
  }
  return `LIMIT ${limit}`;
}

function toSql<T extends BaseSchema>(this: Model<T>) {
  const query = `
    ${parseSelect(this)}
    ${parseFrom(this)}
    ${parseWhere(this)}
    ${parseLimit(this.data.limit)}
  `;
  console.info(query);
  return database.prepare(query);
}

/* My attempt to do class like work, without using classes because JavaScript is a functional 
 * language :)
 */
type FactoryBuildArg<T extends BaseSchema> = {
  type: T;
  baseTable: string;
};

function factoryBuild<T extends BaseSchema>(init: FactoryBuildArg<T>) {
  const model: Model<T> = {
    type: init.type,
    data: {
      select: [],
      baseTable: init.baseTable,
      where: [],
      limit: null,
    },
    select: function (this: Model<T>, params: Model<T>['data']['select']): Model<T> {
      this.data.select = this.data.select.concat(params);
      return this;
    },
    where: function(this: Model<T>, params: Model<T>['data']['where'][number]): Model<T> {
      this.data.where.push(params);
      return this;
    },
    limit: function(this: Model<T>, params: Model<T>['data']['limit']): Model<T> {
      this.data.limit = params;
      return this;
    },
    toSql: function() {
      return toSql.bind(this)();
    },
    create: function(this: Model<T>, params: Partial<Exclude<T, 'id' | 'type'>>) {
      const schema = params; // TODO: figure out partials S.parseOrThrow(params, this.type);
      if ('id' in schema || 'type' in schema) {
        throw new Error('Found id and/or type in query. Did you mean to do an update?');
      }

      const keysToCreate = Object.keys(schema)
        .filter((key) => !['id', 'type'].includes(key))
        .filter((key) => schema[key] != undefined);
      if (keysToCreate.length === 0) {
        throw new Error('No attributes where passed!');
      }
      const query = `
        INSERT INTO ${this.data.baseTable}(${keysToCreate.join(', ')})
        VALUES (${keysToCreate.map((key) => parseExprOrLiteral(this, schema[key])).join(', ')})
        RETURNING id
      `;
      console.info('[CREATE]', query);
      return database.prepare(query).get();
    },
    update: function(this: Model<T>, params: Partial<T> & { id: T['id'] }) {
      const schema = params; // TODO: figure out partials S.parseOrThrow(params, this.type);
      if (!('id' in schema)) {
        throw new Error('Missing id in query. Did you mean to create?');
      }

      const keysToCreate = Object.keys(schema)
        .filter((key) => !['type'].includes(key))
        .filter((key) => schema[key]);
      if (keysToCreate.length <= 1) {
        throw new Error('No attributes where passed!');
      }
      const query = `
        UPDATE ${this.data.baseTable}
        SET ${keysToCreate.map((key) => `${key} = ${parseExprOrLiteral(this, schema[key])}`).join(', ')}
        WHERE id = ${parseExprOrLiteral(this, schema.id)}
      `;
      console.info('[UPDATE]', query);
      return database.prepare(query).run();
    }
  };

  return model;
}

export default factoryBuild;