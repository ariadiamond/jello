import * as z from "zod";

const Company_zt = z.object({
  id: z.number(),
  name: z.string(),
  url: z.string(),
  notes: z.string().optional().nullable(),
});
export type Company_t = z.infer<typeof Company_zt>;

const Statuses_zt = z.enum(["ap", "i1", "i2", "i3", "i4", "wa", "of", "re"]);
export type Statuses_t = z.infer<typeof Statuses_zt>;
export type Status_t = { id: Statuses_t[number]; label: string };

const datetime_z = z.transform((val, ctx) => {
  if (!["string", "number"].includes(typeof val)) {
    ctx.issues.push({
      code: "custom",
      input: val,
      message: "Can only parse dates that are strings or numbers",
    });
    return z.NEVER;
  }
  const date = new Date(val as string | number);
  if (date.toString() === "Invalid Date") {
    ctx.issues.push({
      code: "custom",
      input: val,
      message: "Unable to parse date input",
    });
    return z.NEVER;
  }
  return date.toISOString();
});

const JobApplication_zt = z.object({
  id: z.number(),
  title: z.string(),
  company_id: z.number(), // ref Company
  status: Statuses_zt, // ref Statuses
  applied_on: datetime_z,
  notes: z.string().optional().nullable(),
});
export type JobApplication_t = z.infer<typeof JobApplication_zt>;

const JobApplicationStatusUpdate_zt = z.object({
  id: z.number(),
  job_application_id: z.number(), // ref JobApplication
  status: Statuses_zt, // ref Statuses
  created_at: datetime_z,
  notes: z.string().optional().nullable(),
});
export type JobApplicationStatusUpdate_t = z.infer<typeof JobApplicationStatusUpdate_zt>;

export const ZodTypes = {
  Company_zt,
  JobApplication_zt,
  JobApplicationStatusUpdate_zt,
  Statuses_zt,
};
