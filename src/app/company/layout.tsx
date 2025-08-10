import Link from 'next/link';

export default function CompanyLayout({ children }) {
  return (
    <>
      <nav>
        <Link prefetch={false} href="/">
          Home
        </Link>
        <Link prefetch={false} href="/company/">
          Companies
        </Link>
      </nav>
      {children}
    </>
  );
}
