import Link from 'next/link';

export default function Home() {
  return (
    <div className="">
      <main>
        <Link prefetch={false} href="/job_application">Job Applications</Link>
        <br />
        <Link prefetch={false} href="/company">Companies</Link>
      </main>
    </div>
  );
}
