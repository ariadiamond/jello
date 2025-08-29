import factoryBuild from "./factoryBuild";
import { type Status_t, ZodTypes } from "./types";

export const Company = () => factoryBuild({ type: ZodTypes.Company_zt, baseTable: "companies" });
export const JobApplication = () =>
  factoryBuild({ type: ZodTypes.JobApplication_zt, baseTable: "job_applications" });
export const JobApplicationStatusUpdate = () =>
  factoryBuild({
    type: ZodTypes.JobApplicationStatusUpdate_zt,
    baseTable: "job_application_status_junctions",
  });

export const STATUSES: Status_t[] = [
  { id: "ap", label: "Applied" },
  { id: "i1", label: "Interview with Recruiter" },
  { id: "i2", label: "Coding Interview" },
  { id: "i3", label: "System Design Interview" },
  { id: "i4", label: "Final Interview" },
  { id: "wa", label: "Waiting for a response" },
  { id: "of", label: "Offer given" },
  { id: "re", label: "Rejected" },
];

const Models = {
  Company,
  JobApplication,
  JobApplicationStatusUpdate,
  STATUSES,
};

export default Models;
