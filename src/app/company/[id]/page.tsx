import { use } from 'react';
import { JobApplication, Company } from '@/api/Models';

type CompaniesPage_t = {
  params: Promise<{ id: string }>;
}

export default function CompaniesPage({ params }: CompaniesPage_t) {
  const parsedParams = use(params);
  const id = parseInt(parsedParams.id, 10);
  const company = Company().where({ left: 'id', operator: '=', right: id }).toSql().get();
  const jobApplications = JobApplication().select(['status']).where({ left: 'company_id', operator: '=', right: id }).toSql().all();

  return (
    <>
      <h1>{company.name}</h1>
      <a href={company.url}>Link to Page</a>
      <h3>Applications Submitted: {jobApplications.length}</h3>
    </>
  );
}
