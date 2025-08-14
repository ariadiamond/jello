import Link from 'next/link';
import { use } from 'react';
import { JobApplication, JobApplicationStatusUpdate, Company, STATUSES } from '@/api/Models';
import Select from '@/app/components/Select';
import TextInput from '@/app/components/TextInput';

function StatusUpdate(props: { id: number }) {
  const { id } = props;
  async function onUpdateStatus(formState: FormData) {
    'use server';
    const offset = (new Date()).getTimezoneOffset();

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
      created_at: `${
        formState.get('created_at').toString()
      }${offset > 0 ? '+' : '-'}${offset < 600 ? '0' : ''}${offset / 60}:00`,
      notes: formState.get('notes'),
    });
  }

  return (
    <section>
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
    <>
      <h1>{jobApplication.title}</h1>
      <Link prefetch={false} href={`/company/${company.id}`}>{company.name} Page</Link>
      <div className="flex h-max my-[0.25em]">
        <h3>
          Status:&nbsp;
        </h3>
        <span className={`text-sm status status-${jobApplication.status}`}>
          {STATUSES.find((st) => st.id === jobApplication.status)?.label}
        </span>
      </div>
      <StatusUpdate id={id} />
    </>
  );
}
