import { redirect } from 'next/navigation';
import database from '@/api/database';
import { Company } from '@/api/Models';
import Select from '@/app/components/Select';
import TextInput from '@/app/components/TextInput';

const STATUS_OPTIONS = [
  { id: 'ap', label: 'Applied' },
  { id: 'i1', label: 'Interview with Recruiter' },
  { id: 'i2', label: 'Coding Interview' },
  { id: 'i3', label: 'System Design Interview' },
  { id: 'i4', label: 'Final Interview' },
  { id: 'wa', label: 'Waiting for a response' },
  { id: 'of', label: 'Offer given' },
  { id: 're', label: 'Rejected' }
];

export default function CreateCompany() {
  const onSubmit = async (formState) => {
    'use server';
    const statement = database.prepare('INSERT INTO job_applications(title, company_id, status) VALUES (?, ?, ?, ?) RETURNING ID');
    const{ id } = statement.get(
      formState.get('title'),
      formState.get('company_id'),
      formState.get('status')
    );
    redirect(`/job_appliction/${id}`);
  }
  
  const companies = Company().select(['id', 'name']).toSql().all();

  return (
    <div className="">
      <main>
        <h1>Create Job Application</h1>
        <form action={onSubmit} className="flex justify-around flex-col items-center">
          <TextInput type="text" formKey="title" label="Role" />
          <Select label="Company" formKey="company_id" options={companies.map((c) => ({ id: c.id, label: c.name }))} />
          <Select label="Status" formKey="status" options={STATUS_OPTIONS} />
          <button type="submit">Create!</button>
        </form>
      </main>
    </div>
  );
}
