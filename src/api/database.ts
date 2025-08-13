// @ts-ignore
import { DatabaseSync } from 'node:sqlite';

declare class DatabaseSync_t {
  constructor(filePath: string);
  prepare: (sql: string) => {
    run: (...args: any[]) => void;
    get: (...args: any[]) => Record<string, number | string | null>;
    all: (...args: any[]) => Record<string, number | string |null>[];
  };

}

const database: DatabaseSync_t = new DatabaseSync('./job_applications.sqlite3');

export default database;
