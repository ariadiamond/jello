import Link from "next/link";
import type { PropsWithChildren } from "react";

export default function CompanyLayout({ children }: PropsWithChildren) {
  return (
    <>
      <nav>
        <Link prefetch={false} href="/">
          /Home
        </Link>
        <Link prefetch={false} href="/company/">
          /Companies
        </Link>
      </nav>
      <main>
        <div>{children}</div>
      </main>
    </>
  );
}
