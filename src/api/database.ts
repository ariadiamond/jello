import { DatabaseSync } from 'node:sqlite';
import type { Company_t, JobApplication_t } from './types';

const database = new DatabaseSync('job_applications.sqlite3');

function genericFind<T>(tableName: string, key: keyof T) {
  const preparedStatement = database.prepare(`SELECT ? FROM ${tableName} WHERE ${key} = ? AND ? LIMIT 1`);
  return (value: T[typeof key], opts: { select?: string; where?: string; } = {}): T | undefined => {
    opts.select ||= '*';
    opts.where ||= 'TRUE';
    return preparedStatement.get(opts.select, value, opts.where);
  };
}

function genericFindOrCreate<T extends { id: number }>(tableName: string, key: keyof T, columns: string[]) {
  const find = genericFind<T>(tableName, key);
  const createStatement = database.prepare(`INSERT INTO ${tableName}(${columns.join(', ')} VALUES (${columns.map(() => '?').join(', ')}) RETURNING id`);

  return (model: T): number => {
    let id = find(model[key], { select: 'id' })?.id;
    if (!id) {
      id = createStatement.run(...columns.map((col) => model[col]));
    }
    return id;
  };
}

function genericList<T>(tableName: string) {
  const preparedStatement = database.prepare(`SELECT ? FROM ${tableName} WHERE ? ORDER BY ?`);
  return (opts: { select?: string; where?: string; order?: string; } = {}): T[] => {
    opts.select ||= '*';
    opts.where ||= 'TRUE';
    opts.order ||= 'id DESC';
    return preparedStatement.all(opts.select, opts.where, opts.order);
  };
}

export const Company = {
  findOrCreate: genericFindOrCreate<Company_t>('companies', 'name', ['name', 'url']),
  list: genericList<Company_t>('companies'),
  find: (key: keyof Company_t) => genericFind<Company_t>('companies', key),
};

export const JobApplication = {
  findOrCreate: genericFindOrCreate<JobApplication_t>('job_applications', 'title', ['title', 'company_id', 'status', 'applied_on']),
  list: genericList<JobApplication_t>('job_applications'),
  find: (key: keyof JobApplication_t) => genericFind<JobApplication_t>('job_applications', key),
};

const Models = {
  Company,
  JobApplication
};

export default Models;