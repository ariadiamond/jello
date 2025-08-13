import Link from 'next/link';
import { use } from 'react';
import { JobApplication, JobApplicationStatusUpdate, Company, STATUSES } from '@/api/Models';
import Select from '@/app/components/Select';
import TextInput from '@/app/components/TextInput';

function StatusUpdate(props: { id: number }) {
  const { id } = props;
  async function onUpdateStatus(formState: FormData) {
    'use server';
    const newStatus = formState.get('new_status');
    if (!STATUSES.map((s) => s.id).includes(newStatus)) {
      throw new Error(`Unkown Status update: ${newStatus} is not known`);
    }
    JobApplication().update({
      id,
      status: newStatus
    });
    JobApplicationStatusUpdate().create({
      job_application_id: id,
      status: newStatus,
      created_at: formState.get('created_at'),
      notes: formState.get('notes'),
    });
  }

  return (
    <section>
      <form action={onUpdateStatus}>
        <Select formKey="new_status" options={STATUSES} label="New Status" />
        <TextInput formKey="created_at" type="datetime-local" label="Update Received At" />
        <TextInput formKey="notes" type="textarea" label="Notes" nullable />
        <button type="submit">Update Status</button>
      </form>
    </section>
  );
}

type JobApplicationPage_t = {
  params: Promise<{ id: string}>
};

export default function JobApplicationPage({ params }) {
  const awaitedParams = use(params);
  const id = parseInt(awaitedParams.id, 10);
  const jobApplication = JobApplication().where({ left: 'id', operator: '=', right: id }).toSql().get();
  const company = Company().where({ left: 'id', operator: '=', right: jobApplication.company_id }).toSql().get();

  return (
    <div className="">
      <main>
        <h1>{jobApplication.title}</h1>
        <Link prefetch={false} href={`/company/${company.id}`}>{company.name} Page</Link>
        <h3>Status: {jobApplication.status}</h3>
        
        <StatusUpdate id={id} />
      </main>
    </div>
  );
}
