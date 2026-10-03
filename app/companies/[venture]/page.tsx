import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion";
import { SITE, VENTURES, getVenture, ventureHref } from "@/lib/portfolio";
import { ConceptExample } from "@/components/concept-example";

export function generateStaticParams() {
  return VENTURES.map((v) => ({ venture: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ venture: string }>;
}): Promise<Metadata> {
  const { venture } = await params;
  const v = getVenture(venture);
  if (!v) return {};
  return {
    title: v.name,
    description: v.lede,
    alternates: { canonical: `/companies/${v.slug}/` },
    openGraph: { title: v.name, description: v.lede, url: `${SITE.origin}/companies/${v.slug}/` },
  };
}

export default async function VenturePage({
  params,
}: {
  params: Promise<{ venture: string }>;
}) {
  const { venture } = await params;
  const v = getVenture(venture);
  if (!v) notFound();

  const others = VENTURES.filter((o) => o.slug !== v.slug);

  return (
    <>
      <section className="page-head">
        <div className="shell page-head__inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/companies/">Companies</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{v.name}</span>
          </nav>
          <p className="label label-accent">MAD Ventures / Company</p>
          <h1 className="display-1 page-head__title page-head__title--company">
            {v.name}
          </h1>
          <p className="lead page-head__lead">{v.lede}</p>
          <div style={{ marginTop: "2rem" }}>
            <Link href="/companies/" className="text-link">
              <span aria-hidden="true">&larr;</span> Back to companies
            </Link>
          </div>
          <div className="page-head__cut" aria-hidden="true">
            <b />
            <i />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="focus-heading">
        <div className="shell detail-split">
          <div>
            <Reveal>
              <div className="detail-block">
                <p className="label">Current focus</p>
                <h2 id="focus-heading" className="display-3 detail-block__title">
                  Measured at its current stage.
                </h2>
                <ul className="focus-list-plain">
                  {v.focus.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="detail-block">
                {/*
                  The focus statements are already listed directly above under
                  "Current focus". This block used to render the same two strings
                  again as a table, so every reader saw them twice. It now carries
                  only the caveat that makes the list honest, which the table was
                  really there for.
                */}
                <h2 className="display-3 detail-block__title">What that list is not</h2>
                <p className="prose">
                  The focus above is the complete public scope of work for {v.name}. It is not a feature list, a release schedule, or a commitment to
                  deliver. Anything not stated there has not been decided, and
                  should not be inferred from it.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.05}>
            <aside className="fact-panel" aria-label={`${v.name} facts`}>
              <div className="fact-panel__row">
                <p className="label">Stage</p>
                <p>
                  <span className="stage-badge">
                    <span className="stage-badge__dot" aria-hidden="true" />
                    {v.stage}
                  </span>
                </p>
                <p className="fact-panel__note">
                  &ldquo;{v.stage}&rdquo; describes the company&rsquo;s current public
                  stage. It does not imply general availability or a committed launch
                  date.
                </p>
              </div>
              <div className="fact-panel__row">
                <p className="label">Parent company</p>
                <p>
                  Part of <Link href="/">MAD Ventures Holdings</Link>
                </p>
              </div>
              <div className="fact-panel__row">
                <p className="label">Operating model</p>
                <p>
                  A <Link href="/what-we-do/">MAD Ventures initiative</Link>, being
                  developed internally and not currently available.
                </p>
              </div>
            </aside>
          </Reveal>
        </div>
      </section>

      {v.concept ? (
        <section className="section section-tight" aria-label="Conceptual example">
          <div className="shell">
            <ConceptExample venture={v} />
          </div>
        </section>
      ) : null}

      <section className="section section-alt" aria-labelledby="next-heading">
        <div className="shell">
          <Reveal>
            <div className="closing">
              <div>
                <p className="label">Enquiries</p>
                <h2 id="next-heading" className="display-2 closing__title">
                  Where to go next.
                </h2>
              </div>
              <div className="closing__body">
                <p className="prose">
                  Product questions belong with {v.name}. Partnership and
                  collaboration conversations belong with MAD Ventures directly.
                </p>
                <div className="closing__actions">
                  <Link href="/companies/" className="btn btn-ghost">
                    <span aria-hidden="true">&larr;</span> All companies
                  </Link>
                  <Link href="/partnership/" className="btn btn-ghost">
                    Partnership <span className="arrow" aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
                <ul className="other-ventures">
                  {others.map((o) => (
                    <li key={o.slug}>
                      <Link href={ventureHref(o.slug)}>
                        <span className="mono-num">{o.index}</span>
                        {o.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
