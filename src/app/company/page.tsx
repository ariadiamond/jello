import Link from "next/link";
import { Company } from "@/api/Models";
import type { Company_t } from "@/api/types";
import CardGroup from "@/app/components/Card";

export default function CompaniesPage() {
  const companies = Company().all();

  return (
    <>
      <div className="flex justify-between items-center border-b mb-[1em]">
        <h1>Companies</h1>
        <Link prefetch={false} href="/company/create">
          Create
        </Link>
      </div>
      <CardGroup
        cards={companies.map((company: Company_t) => ({
          header: company.name,
          link: `/company/${company.id}`,
        }))}
      />
    </>
  );
}
