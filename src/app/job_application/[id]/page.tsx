import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { JobApplication, JobApplicationStatusUpdate, Company, STATUSES } from "@/api/Models";
import { ZodTypes } from "@/api/types";
import Select from "@/app/components/Select";
import TextInput from "@/app/components/TextInput";
import Status from "./Status";

type JobApplicationPage_t = {
  params: Promise<{ id: string }>;
};

export default function JobApplicationPage({ params }: JobApplicationPage_t) {
  const awaitedParams = use(params);
  const id = parseInt(awaitedParams.id, 10);
  const jobApplication = JobApplication().where({ left: "id", operator: "=", right: id }).get();
  if (!jobApplication) notFound();

  const company = Company()
    .where({ left: "id", operator: "=", right: jobApplication.company_id })
    .get();

  // This shouldn't be possible, as the model states that all job applications should have a company
  // but we include it here for TS completeness
  if (!company) notFound();

  return (
    <>
      <h1>{jobApplication.title}</h1>
      <Link prefetch={false} href={`/company/${company.id}`}>
        {company.name} Page
      </Link>
      <div className="flex h-max my-[0.25em]">
        <h3>Status:&nbsp;</h3>
        <span className={`text-sm status status-${jobApplication.status}`}>
          {STATUSES.find((st) => st.id === jobApplication.status)?.label}
        </span>
      </div>
      <Status StatusHistory={<StatusHistory id={id} />} StatusUpdate={<StatusUpdate id={id} />} />
    </>
  );
}

async function StatusUpdate(props: { id: number }) {
  "use server";
  const { id } = props;
  async function onUpdateStatus(formState: FormData) {
    "use server";
    const newStatus = ZodTypes.Statuses_zt.parse(formState.get("new_status"));
    const data = ZodTypes.JobApplicationStatusUpdate_zt.omit({ id: true }).parse({
      job_application_id: id,
      status: newStatus,
      created_at: formState.get("created_at"),
      notes: formState.get("notes"),
    });
    JobApplication().update({
      id,
      status: newStatus,
    });
    JobApplicationStatusUpdate().create(data);
  }

  return (
    <form action={onUpdateStatus}>
      <div>
        <Select formKey="new_status" options={STATUSES} label="New Status" />
        <TextInput formKey="created_at" type="datetime-local" label="Update Received At" />
        <TextInput formKey="notes" type="textarea" label="Notes" nullable />
        <div className="flex justify-center">
          <button type="submit">Update Status</button>
        </div>
      </div>
    </form>
  );
}

async function StatusHistory(props: { id: number }) {
  "use server";
  const { id } = props;
  const statusUpdates = JobApplicationStatusUpdate()
    .where({ left: "job_application_id", operator: "=", right: id })
    .all();
  return (
    <div>
      {statusUpdates.map((status) => (
        <div key={status.id} className="h-[2em]">
          <span className={`status status-${status.status}`}>
            {STATUSES.find((st) => st.id === status.status)?.label}
          </span>
        </div>
      ))}
    </div>
  );
}
