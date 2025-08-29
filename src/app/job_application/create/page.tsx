import { redirect } from "next/navigation";
import { string as zString } from "zod";
import { JobApplication, Company, STATUSES } from "@/api/Models";
import { ZodTypes } from "@/api/types";
import Select from "@/app/components/Select";
import TextInput from "@/app/components/TextInput";

export default function CreateJobApplication() {
  const onSubmit = async (formState: FormData) => {
    "use server";

    const data = ZodTypes.JobApplication_zt.omit({ id: true }).parse({
      title: formState.get("title"),
      company_id: parseInt(zString().parse(formState.get("company_id")), 10),
      status: formState.get("status"),
      applied_on: formState.get("applied_on"),
      notes: formState.get("notes"),
    });
    const { id } = JobApplication().create(data);
    redirect(`/job_application/${id}`);
  };

  const companies = Company().select(["id", "name"]).all();

  return (
    <>
      <h1>Create Job Application</h1>
      <form action={onSubmit}>
        <div>
          <TextInput type="text" formKey="title" label="Role" />
          <Select
            label="Company"
            formKey="company_id"
            options={companies.map((c) => ({ id: c.id, label: c.name }))}
          />
          <Select label="Status" formKey="status" options={STATUSES} />
          <TextInput type="datetime-local" formKey="applied_on" label="Application Submitted At:" />
          <div className="flex justify-center">
            <button type="submit">Create!</button>
          </div>
        </div>
      </form>
    </>
  );
}
