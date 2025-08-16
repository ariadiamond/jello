import { DatabaseSync } from 'node:sqlite';
import { existsSync } from 'node:fs';

const DEFAULT_LOCATION = './job_applications.sqlite3';
const databaseLocation = process.env.DATABASE_LOCATION || DEFAULT_LOCATION;

if (!existsSync(databaseLocation)) {
  console.log('Database does not exist');
} else {
  console.log('Using Database:', databaseLocation);
  console.log('Database exists, not going to reinit');
}
const database = new DatabaseSync(databaseLocation);

export default database;
