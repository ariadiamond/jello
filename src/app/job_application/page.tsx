import Link from 'next/link';
import { Fragment } from 'react';
import { JobApplication } from '@/api/Models';
import CardGroup from '@/app/components/Card';

export default function JobApplications() {
  const jobs = JobApplication().toSql().all();

  return (
    <>
      <div className="flex justify-between items-center border-b mb-[1em]">
        <h1>Job Applications</h1>
        <Link prefetch={false} href="/job_application/create">Create</Link>
      </div>
      <CardGroup
        cards={jobs.map((j) => ({ header: j.title, link: `/job_application/${j.id}` }))}
      />
    </>
  );
}
