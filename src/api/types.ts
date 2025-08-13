import * as z from 'zod'

const Company_zt = z.object({
  type: z.literal('companies'),
  id: z.number(),
  name: z.string(),
  url: z.string(),
  notes: z.string().optional()
});
export type Company_t = z.infer<typeof Company_zt>;

const Statuses_zt = z.enum(['ap', 'i1', 'i2', 'i3', 'i4', 'wa', 'of', 're'])
export type Statuses_t = z.infer<typeof Statuses_zt>;
 
const JobApplication_zt = z.object({
  type: z.literal('job_applications'),
  id: z.number(),
  title: z.string(),
  company_id: z.number(), // ref Company
  status: Statuses_zt, // ref Statuses
  applied_on: z.iso.datetime(), // TODO: looser parsing using refinements and Date()
  notes: z.string().optional()
});
export type JobApplication_t = z.infer<typeof JobApplication_zt>;

const JobApplicationStatusUpdate_zt = z.object({
  type: z.literal('job_application_status_junctions'),
  id: z.number(),
  job_application_id: z.number(), // ref JobApplication
  status: Statuses_zt, // ref Statuses
  created_at: z.iso.datetime(),
  notes: z.string().optional()
});
export type JobApplicationStatusUpdate_t = z.infer<typeof JobApplicationStatusUpdate_zt>;


export const ZodTypes = {
  Company_zt,
  JobApplication_zt,
  JobApplicationStatusUpdate_zt,
  Statuses_zt
};