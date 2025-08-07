import { use } from 'react';
import { JobApplication, Company } from '@/api/Models';

export default function CompaniesPage({ params }) {
  const { id } = use(params);
  const company = Company().where({ left: 'id', operator: '=', right: id }).toSql().get();
  const jobApplications = JobApplication().select(['status']).where({ left: 'company_id', operator: '=', right: id }).toSql().all();

  return (
    <div className="">
      <main>
        <h1>{company.name}</h1>
        <a href={company.url}>Link to Page</a>
        <h3>Applications Submitted: {jobApplications.length}</h3>
      </main>
    </div>
  );
}
