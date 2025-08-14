import { redirect } from 'next/navigation';
import { JobApplication, Company, STATUSES } from '@/api/Models';
import Select from '@/app/components/Select';
import TextInput from '@/app/components/TextInput';

export default function CreateJobApplication() {
  const onSubmit = async (formState: FormData) => {
    'use server';
    const offset = (new Date()).getTimezoneOffset();
    const { id } = JobApplication().create({
      title: formState.get('title'),
      company_id: parseInt(formState.get('company_id'), 10),
      status: formState.get('status'),
      applied_on: `${
        formState.get('applied_on').toString()
      }${offset > 0 ? '+' : '-'}${offset < 600 ? '0' : ''}${offset / 60}:00`,
    });
    redirect(`/job_application/${id}`);
  }

  const companies = Company().select(['id', 'name']).toSql().all();

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
          <Select
            label="Status"
            formKey="status"
            options={STATUSES}
          />
          <TextInput
            type="datetime-local"
            formKey="applied_on"
            label="Application Submitted At:"
          />
          <div className="flex justify-center">
            <button type="submit">Create!</button>
          </div>
        </div>
      </form>
    </>
  );
}
