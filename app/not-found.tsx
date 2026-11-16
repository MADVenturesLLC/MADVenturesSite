import type { Metadata } from "next";
import Link from "next/link";

/**
 * A 404 must not be indexed, and must not inherit the homepage canonical —
 * that would tell search engines this is a duplicate of `/`.
 */
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <section className="page-head">
      <div className="shell notfound">
        <p className="label label-accent">Error 404</p>
        <h1 className="t-page page-head__title">This page does not exist.</h1>
        <p className="lead notfound__lead">
          The address may have changed, or the page may have been retired. The
          pages below cover everything currently published.
        </p>
        <div className="notfound__links">
          <Link href="/" className="text-link">Home</Link>
          <Link href="/what-we-do/" className="text-link">What We Do</Link>
          <Link href="/companies/" className="text-link">Companies</Link>
          <Link href="/approach/" className="text-link">Approach</Link>
          <Link href="/partnership/" className="text-link">Partnership</Link>
        </div>
      </div>
    </section>
  );
}
