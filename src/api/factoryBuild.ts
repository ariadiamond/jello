import * as z from "zod";
import database from "./database";

const BaseSchemaValue = z.object({ id: z.number() });
type BaseSchema_zt = typeof BaseSchemaValue;

const UnaryOperators_zt = z.enum(["IS NULL", "IS NOT NULL"]);
const BinaryOperators_zt = z.enum(["=", "!=", "<>", ">", "<", ">=", "<=", "LIKE", "ILIKE"]);

type Model<T extends BaseSchema_zt> = {
  type: T;
  data: {
    select: string[];
    baseTable: string;
    where: {
      left: string | number;
      operator: z.infer<typeof UnaryOperators_zt> | z.infer<typeof BinaryOperators_zt>;
      right?: string | number;
    }[];
    limit: number | null;
  };
  select: (params: Model<T>["data"]["select"]) => Model<T>;
  where: (params: Model<T>["data"]["where"][number]) => Model<T>;
  limit: (params: Model<T>["data"]["limit"]) => Model<T>;
  get: () => z.infer<T> | undefined;
  all: () => z.infer<T>[];
  create: (params: Partial<Exclude<z.infer<T>, "id">>) => { id: number };
  update: (params: Partial<z.infer<T>> & { id: number }) => void;
};

// TODO: Before going to production + if this scales at all, this needs to be strengthened a lot
const escapeString = (str: string): string => `'${str.replace(/\\/g, "").replace(/'/g, "'")}'`;

function parseSelect<T extends BaseSchema_zt>(model: Model<T>) {
  const schemaKeys = Object.keys(model.type.keyof().enum);
  const parsed = model.data.select.map((s) => {
    const re = new RegExp(`^${s}$`, "i");
    const columnName = schemaKeys.find((sk) => re.test(sk));
    if (!columnName) {
      throw new Error(`Unknown column while parsing Select: ${model.data.baseTable}.${s}`);
    }
    return `${model.data.baseTable}.${columnName}`;
  });
  if (parsed.length === 0) {
    return `SELECT ${model.data.baseTable}.*`;
  }
  return `SELECT ${parsed.join(", ")}`;
}

function parseFrom<T extends BaseSchema_zt>(model: Model<T>) {
  return `FROM ${model.data.baseTable}`;
}

function parseExprOrLiteral<T extends BaseSchema_zt>(
  model: Model<T>,
  // biome-ignore lint/suspicious/noExplicitAny: This parses from an unspecified value, so the result is narrowly typed
  value: any,
): string | number | never {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value !== "string") {
    throw new Error(
      `Unknown type for expression or literal: expected string or number, got: ${value}`,
    );
  }

  const re = new RegExp(`^${value}$`, "i");
  const schemaKeys = Object.keys(model.type.keyof().enum);
  const col = schemaKeys.find((sk) => re.test(sk));
  if (col) {
    return `${model.data.baseTable}.${col}`;
  }
  return escapeString(value);
}

function parseOperator(
  // biome-ignore lint/suspicious/noExplicitAny: This parses from an unspecified value, so the result is narrowly typed
  operator: any,
): Model<BaseSchema_zt>["data"]["where"][number]["operator"] | never {
  return z.union([BinaryOperators_zt, UnaryOperators_zt]).parse(operator);
}

function parseWhere<T extends BaseSchema_zt>(model: Model<T>) {
  const whereClauses = model.data.where.map((clause) => {
    const left = parseExprOrLiteral(model, clause.left);
    const operator = parseOperator(clause.operator);
    const right = Object.keys(UnaryOperators_zt.enum).includes(operator)
      ? ""
      : parseExprOrLiteral(model, clause.right);
    return `${left} ${operator} ${right}`.trim();
  });
  if (whereClauses.length === 0) {
    return "";
  }
  return `WHERE ${whereClauses.join(" AND ")}`;
}

function parseLimit(limit: number | null) {
  if (typeof limit !== "number") {
    return "";
  }
  return `LIMIT ${limit}`;
}

/* My attempt to do class like work, without using classes because JavaScript is a functional
 * language :)
 */
type FactoryBuildArg<T extends BaseSchema_zt> = {
  type: T;
  baseTable: string;
};

function factoryBuild<T extends BaseSchema_zt>(init: FactoryBuildArg<T>) {
  const model: Model<T> = {
    type: init.type,
    data: {
      select: [],
      baseTable: init.baseTable,
      where: [],
      limit: null,
    },
    select: function (this: Model<T>, params: Model<T>["data"]["select"]): Model<T> {
      this.data.select = this.data.select.concat(params);
      return this;
    },
    where: function (this: Model<T>, params: Model<T>["data"]["where"][number]): Model<T> {
      this.data.where.push(params);
      return this;
    },
    limit: function (this: Model<T>, params: Model<T>["data"]["limit"]): Model<T> {
      this.data.limit = params;
      return this;
    },
    get: function (this: Model<T>): z.infer<T> | undefined {
      const query = `
        ${parseSelect(this)}
        ${parseFrom(this)}
        ${parseWhere(this)}
        ${parseLimit(this.data.limit)}
      `.trim();
      const parser = this.data.select.length
        ? this.type.pick(
            this.data.select.reduce(
              (acc, key) => {
                acc[key as keyof z.infer<T>] = true;
                return acc;
              },
              {} as Record<keyof z.infer<T>, true>,
            ),
          )
        : this.type;
      if (process.env.NODE_ENV === "development") {
        console.time(`[QUERY - one] ${query}`);
      }
      const data = database.prepare(query).get();
      if (process.env.NODE_ENV === "development") {
        console.timeEnd(`[QUERY - one] ${query}`);
      }
      if (!data) return;
      // @ts-expect-error TODO: this can be a partial, but currently, TS sees this as Record<string, never>
      return parser.parse(data);
    },
    all: function (this: Model<T>): z.infer<T>[] {
      const query = `
        ${parseSelect(this)}
        ${parseFrom(this)}
        ${parseWhere(this)}
        ${parseLimit(this.data.limit)}
      `.trim();

      const parser = this.data.select.length
        ? this.type.pick(
            this.data.select.reduce(
              (acc, key) => {
                acc[key as keyof z.infer<T>] = true;
                return acc;
              },
              {} as Record<keyof z.infer<T>, true>,
            ),
          )
        : this.type;
      if (process.env.NODE_ENV === "development") {
        console.time(`[QUERY - many] ${query}`);
      }
      const data = database.prepare(query).all();
      if (process.env.NODE_ENV === "development") {
        console.timeEnd(`[QUERY - many] ${query}`);
      }
      // @ts-expect-error TODO: TS parses this as Record<string, never>
      return parser.array().parse(data);
    },
    create: function (this: Model<T>, params: Partial<Exclude<z.infer<T>, "id">>) {
      const schema = this.type.omit({ id: true }).parse(params);

      const keysToCreate = Object.keys(schema).filter((key) => schema[key]);
      if (keysToCreate.length === 0) {
        throw new Error("No attributes where passed!");
      }
      const query = `
        INSERT INTO ${this.data.baseTable}(${keysToCreate.join(", ")})
        VALUES (${keysToCreate.map((key) => parseExprOrLiteral(this, schema[key])).join(", ")})
        RETURNING id
      `;
      console.info("[CREATE]", query);
      return this.type.pick({ id: true }).parse(database.prepare(query).get());
    },
    update: function (this: Model<T>, params: Partial<z.infer<T>> & { id: number }) {
      const schema = z
        .intersection(this.type.partial().omit({ id: true }), this.type.pick({ id: true }))
        .parse(params);

      const keysToUpdate = Object.keys(schema)
        .filter((key) => key !== "id")
        .filter((key) => key in schema);
      if (keysToUpdate.length < 1) {
        throw new Error("No attributes where passed!");
      }
      const query = `
        UPDATE ${this.data.baseTable}
        SET ${keysToUpdate.map((key) => `${key} = ${parseExprOrLiteral(this, schema[key])}`).join(", ")}
        WHERE id = ${parseExprOrLiteral(this, schema.id)}
      `.trim();
      console.info("[UPDATE]", query);
      database.prepare(query).run();
    },
  };

  return model;
}

export default factoryBuild;
