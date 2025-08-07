import { Fragment } from 'react';
import { JobApplication } from '@/api/Models';

export default function JobApplications() {
  const jobs = JobApplication().toSql().all();

  return (
    <div className="">
      <main>
        {jobs.map((j) => {
          <Fragment key={j.id}>
            <span>{JSON.stringify(j)}</span>
          </Fragment>
        })}
      </main>
    </div>
  );
}
