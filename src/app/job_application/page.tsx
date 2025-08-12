import Link from 'next/link';
import { Fragment } from 'react';
import { JobApplication } from '@/api/Models';

export default function JobApplications() {
  const jobs = JobApplication().toSql().all();

  return (
    <div className="">
      <main>
        <h1>Job Applications</h1>
        <Link prefetch={false} href="/job_application/create">Create</Link>
        {jobs.map((j) => (
          <Fragment key={j.id}>
            <span>{JSON.stringify(j)}</span>
          </Fragment>
        ))}
      </main>
    </div>
  );
}
