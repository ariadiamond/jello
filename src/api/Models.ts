import factoryBuild from './factoryBuild';
import { Statuses_t } from './types';

export const Company = () => factoryBuild({ baseTable: 'companies' });
export const JobApplication = () => factoryBuild({ baseTable: 'job_applications' });

const STATUS_OPTIONS: { id: Statuses_t; label: string; }[] = [
  { id: 'ap', label: 'Applied' },
  { id: 'i1', label: 'Interview with Recruiter' },
  { id: 'i2', label: 'Coding Interview' },
  { id: 'i3', label: 'System Design Interview' },
  { id: 'i4', label: 'Final Interview' },
  { id: 'wa', label: 'Waiting for a response' },
  { id: 'of', label: 'Offer given' },
  { id: 're', label: 'Rejected' }
];
export const Status = () => factoryBuild({ baseTable: 'statuses' });
Status.options = STATUS_OPTIONS;

const Models = {
  Company,
  JobApplication,
  Status
};

export default Models;