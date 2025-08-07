export type Company_t = {
  id: number;
  name: string;
  url: string;
};

export enum Statuses_t {
  'ap',
  'i1',
  'i2',
  'i3',
  'i4',
  'wa',
  'of',
  're',
}

export type JobApplication_t = {
  id: number;
  title: string;
  company_id: number; // ref Company
  status: Statuses_t; //ref Statuses
  applied_on: Date;
};

export type JobApplicationStatusUpdates_t = {
  id: number;
  job_application_id: number;
  status: Statuses_t;
  timestamp: Date;
};