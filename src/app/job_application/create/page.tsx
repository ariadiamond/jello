import { redirect } from 'next/navigation';
import { JobApplication, Company, STATUSES } from '@/api/Models';
import Select from '@/app/components/Select';
import TextInput from '@/app/components/TextInput';

export default function CreateJobApplication() {
  const onSubmit = async (formState: FormData) => {
    'use server';
    const { id } = JobApplication().create({
      title: formState.get('title'),
      company_id: formState.get('company_id'),
      status: formState.get('status'),
      applied_on: formState.get('applied_on'),
    });
    redirect(`/job_application/${id}`);
  }

  const companies = Company().select(['id', 'name']).toSql().all();

  return (
    <div className="">
      <main>
        <h1>Create Job Application</h1>
        <form action={onSubmit} className="flex justify-around flex-col items-center">
          <TextInput type="text" formKey="title" label="Role" />
          <Select label="Company" formKey="company_id" options={companies.map((c) => ({ id: c.id, label: c.name }))} />
          <Select label="Status" formKey="status" options={STATUSES} />
          <TextInput type="datetime-local" formKey="applied_on" label="Application Submitted At:" />
          <button type="submit">Create!</button>
        </form>
      </main>
    </div>
  );
}
