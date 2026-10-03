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
    <section className="section">
      <div className="shell notfound">
        <p className="label label-accent">Error 404</p>
        <h1 className="display-2 notfound__title">This page does not exist.</h1>
        <p className="lead notfound__lead">
          The address may have changed, or the page may have been retired. The
          pages below cover everything currently published.
        </p>
        <div className="notfound__links">
          <Link href="/" className="btn btn-primary">Home</Link>
          <Link href="/what-we-do/" className="btn btn-ghost">What We Do</Link>
          <Link href="/companies/" className="btn btn-ghost">Companies</Link>
          <Link href="/approach/" className="btn btn-ghost">Approach</Link>
          <Link href="/partnership/" className="btn btn-ghost">Partnership</Link>
        </div>
      </div>
    </section>
  );
}
