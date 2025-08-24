import { DatabaseSync } from 'node:sqlite';
import { existsSync } from 'node:fs';

const databaseLocation = process.env.DATABASE_LOCATION;

if (!existsSync(databaseLocation)) {
  throw new Error(`Database: ${databaseLocation} does not exist`);
} else if (process.env.NODE_ENV !== 'production') {
  console.log('Using Database:', databaseLocation);
  console.debug('Database exists, not going to reinit');
}
const database = new DatabaseSync(databaseLocation);

export default database;
