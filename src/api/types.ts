// NOTE: BEFORE UPGRADING SURY, YOU MUST CHECK THAT 'fields' STILL EXISTS AS A PROPERTY. IT IS USED
// IN factoryBuild.ts EXTENSIVELY.
import * as S from 'sury';

const Company_st = S.schema({
  type: S.schema('companies'),
  id: S.number,
  name: S.string,
  url: S.string,
  notes: S.string
});
export type Company_t = S.Output<typeof Company_st>;

const Statuses_st = S.union(['ap', 'i1', 'i2', 'i3', 'i4', 'wa', 'of', 're'])
export type Statuses_t = S.Output<typeof Statuses_st>;
 
const JobApplication_st = S.schema({
  type: S.schema('job_applications'),
  id: S.number,
  title: S.string,
  company_id: S.number, // ref Company
  status: Statuses_st, // ref Statuses
  applied_on: S.datetime(S.string), // TODO: looser parsing using refinements and Date()
  notes: S.string
});
export type JobApplication_t = S.Output<typeof JobApplication_st>;

const JobApplicationStatusUpdate_st = S.schema({
  type: S.schema('job_application_status_junctions'),
  id: S.number,
  job_application_id: S.number, // ref JobApplication
  status: Statuses_st, // ref Statuses
  created_at: S.datetime(S.string),
  notes: S.string
});
export type JobApplicationStatusUpdate_t = S.Output<typeof JobApplicationStatusUpdate_st>;


export const SuryTypes = {
  Company_st,
  JobApplication_st,
  JobApplicationStatusUpdate_st,
  Statuses_st
};