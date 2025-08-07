import { DatabaseSync } from 'node:sqlite';
import factoryBuild from './Model';
import type { Company_t, JobApplication_t } from './types';

const database = new DatabaseSync('./job_applications.sqlite3');

export default database;