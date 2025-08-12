import { redirect } from 'next/navigation';
import database from '@/api/database';
import { Company, Status } from '@/api/Models';
import Select from '@/app/components/Select';
import TextInput from '@/app/components/TextInput';

export default function CreateCompany() {
  const onSubmit = async (formState) => {
    'use server';
    const statement = database.prepare('INSERT INTO job_applications(title, company_id, status, applied_on) VALUES (?, ?, ?, ?) RETURNING ID');
    const{ id } = statement.get(
      formState.get('title'),
      formState.get('company_id'),
      formState.get('status'),
      formState.get('applied_on')
    );
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
          <Select label="Status" formKey="status" options={Status.options} />
          <TextInput type="datetime-local" formKey="applied_on" label="Application Submitted At:" />
          <button type="submit">Create!</button>
        </form>
      </main>
    </div>
  );
}
