import Link from 'next/link';

export default function JobApplicationLayout({ children }) {
  return (
    <>
      <nav>
        <Link prefetch={false} href="/">
          Home
        </Link>
        <Link prefetch={false} href="/job_application/">
          Job Applications
        </Link>
      </nav>
      {children}
    </>
  );
}