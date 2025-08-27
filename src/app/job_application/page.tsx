import Link from "next/link";
import { JobApplication, STATUSES } from "@/api/Models";
import CardGroup from "@/app/components/Card";

export default function JobApplications() {
  const jobs = JobApplication().toSql().all();

  const cards = jobs.map((j) => ({
    header: j.title,
    link: `/job_application/${j.id}`,
    body: (
      <span className={`status status-${j.status}`}>
        {STATUSES.find((st) => st.id === j.status)?.label}
      </span>
    ),
  }));
  return (
    <>
      <div className="flex justify-between items-center border-b mb-[1em]">
        <h1>Job Applications</h1>
        <Link prefetch={false} href="/job_application/create">
          Create
        </Link>
      </div>
      <CardGroup cards={cards} />
    </>
  );
}
