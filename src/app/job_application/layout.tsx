import Link from 'next/link';
import type { PropsWithChildren } from 'react';

export default function JobApplicationLayout({ children }: PropsWithChildren) {
  return (
    <>
      <nav>
        <Link prefetch={false} href="/">
          /Home
        </Link>
        <Link prefetch={false} href="/job_application/">
          /Job Applications
        </Link>
      </nav>
      <main>
        <div>
          {children}
        </div>
      </main>
    </>
  );
}