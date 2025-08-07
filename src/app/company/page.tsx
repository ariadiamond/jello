import { Company } from '@/api/Models';

export default function CompaniesPage() {
  const companies = Company().toSql().all();

  return (
    <div className="">
      <main>
        <h1>Companies</h1>
        <div className="grid grid-cols-4 gap-4">
          {companies.map((c) => (
            <div className="p-2 border rounded-sm border-sky-600" key={c.id}>
              <h4>{c.name}</h4>
              <a href={`/company/${c.id}`}>-&gt;</a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
