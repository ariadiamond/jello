import factoryBuild from './factoryBuild';
import { Statuses_t, SuryTypes } from './types';

export const Company = () => factoryBuild({ type: SuryTypes.Company_st, baseTable: 'companies' });
export const JobApplication = () => factoryBuild({ type: SuryTypes.JobApplication_st, baseTable: 'job_applications' });
export const JobApplicationStatusUpdate = () => factoryBuild({ type: SuryTypes.JobApplicationStatusUpdate_st, baseTable: 'job_application_status_junctions' });

export const STATUSES: { id: Statuses_t; label: string; }[] = [
  { id: 'ap', label: 'Applied' },
  { id: 'i1', label: 'Interview with Recruiter' },
  { id: 'i2', label: 'Coding Interview' },
  { id: 'i3', label: 'System Design Interview' },
  { id: 'i4', label: 'Final Interview' },
  { id: 'wa', label: 'Waiting for a response' },
  { id: 'of', label: 'Offer given' },
  { id: 're', label: 'Rejected' }
];

const Models = {
  Company,
  JobApplication,
  JobApplicationStatusUpdate,
  STATUSES
};

export default Models;