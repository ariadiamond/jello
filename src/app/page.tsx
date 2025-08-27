import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div>
        <h1>
          <Link prefetch={false} href="/job_application">
            Job Applications
          </Link>
        </h1>
        <br />
        <h1>
          <Link prefetch={false} href="/company">
            Companies
          </Link>
        </h1>
      </div>
    </main>
  );
}
