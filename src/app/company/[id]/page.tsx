import Link from "next/link";
import { use, Suspense } from "react";
import { JobApplication, Company, STATUSES } from "@/api/Models";

type CompaniesPage_t = {
  params: Promise<{ id: string }>;
};

async function Applications(props) {
  const { companyId } = props;
  const jobApplications = JobApplication()
    .select(["id", "title", "status"])
    .where({ left: "company_id", operator: "=", right: companyId })
    .toSql()
    .all();

  return (
    <section>
      <h3>Applications Submitted: {jobApplications.length}</h3>
      <table>
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {jobApplications.map((j) => (
            <tr key={j.id}>
              <td>
                <Link prefetch={false} href={`/job_application/${j.id}`}>
                  {j.title}
                </Link>
              </td>
              <td>
                <span className={`status status-${j.status}`}>
                  {STATUSES.find((s) => s.id === j.status)?.label}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default function CompaniesPage({ params }: CompaniesPage_t) {
  const parsedParams = use(params);
  const id = parseInt(parsedParams.id, 10);
  const company = Company().where({ left: "id", operator: "=", right: id }).toSql().get();

  return (
    <>
      <h1>{company.name}</h1>
      <a href={company.url}>Link to Page</a>
      <Suspense>
        <Applications companyId={id} />
      </Suspense>
    </>
  );
}
