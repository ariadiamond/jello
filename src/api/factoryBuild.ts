import database from './database';

function select(params: string[]) {
  this.data.select = this.data.select.concat(params);
  return this;
}

function reselect(params: string[]) {
  this.data.select = params;
  return this;
}

function where(params: { left: string; operator: string; right?: string; }) {
  this.data.where.push(params);
  return this;
}

function limit(params: number) {
  this.data.limit = params;
  return this;
}

// TODO: Before going to production + if this scales at all, this needs to be strengthened a lot
const escape = (str: string) => str.replace(/[^a-z0-9_]/ig, '');
const binaryOperators = ['=', '!=', '<>', '>', '<', '>=', '<=', 'LIKE', 'ILIKE'];
const unaryOperators = ['IS NULL', 'IS NOT NULL'];

function parseQueryParams(data) {
  let { select, from, where, limit } = data;

  select = select.map(escape).map((s) => s.trim()).filter((s) => s.length > 0);
  from = escape(from);
  where = where.map((clause) => {
    const left = escape(clause.left);
    const operatorRe = new RegExp(`^${clause.operator}$`, 'i');
    let isUnary = false;
    let operator;
    if (unaryOperators.find((c) => operatorRe.test(c))) {
      isUnary = true;
      operator = unaryOperators.find((c) => operatorRe.test(c));
    } else {
      operator = binaryOperators.find((c) => operatorRe.test(c));
    }
    if (!left || !operator) {
      console.error(`Unable to parse WHERE clause ${JSON.stringify(clause)}`);
      return null;
    }
    const right = escape(clause.right) || '';
    if (!isUnary && !right) {
      console.error(`Unable to parse WHERE clause: ${clause.right} is invalid`);
      return null;
    }
    return `${left} ${operator} ${right}`.trim();
  }).filter((s) => s);
  limit = parseInt(limit?.toString(), 10);
  if (limit === 0 || Number.isNaN(limit)) {
    limit = ''; 
  } else {
    limit = `LIMIT ${limit}`; 
  }
  return { select, from, where, limit };
}

function toSql() {
  const { select, from, where, limit } = parseQueryParams(this.data);
  const selectStatement = select.length === 0 ? '*' : select.map(escape).join(', ');
  const whereStatement = where.length === 0 ? '' : `WHERE ${where.join(' AND ')}`;

  const query = `
    SELECT ${selectStatement}
    FROM ${from}
    ${whereStatement}
    ${limit}
  `;
  console.info(query);
  return database.prepare(query);
}

/* My attempt to do class like work, without using classes because JavaScript is a functional 
 * language :)
 */
function factoryBuild(init: { baseTable: string }) {
  const model = {
    data: {
      select: [],
      from: init.baseTable,
      where: [],
      limit: undefined,
    },
  };
  [
    { name: 'select', fn: select },
    { name: 'reselect', fn: reselect },
    { name: 'where', fn: where },
    { name: 'limit', fn: limit },
    { name: 'toSql', fn: toSql }
  ].forEach(({ name, fn }) => {
    model[name] = fn.bind(model);
  });
  return model;
}

export default factoryBuild;