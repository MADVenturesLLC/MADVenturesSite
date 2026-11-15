import type { CSSProperties } from "react";
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

/*
  Estimated set width of a name in em, at the title's weight and tracking.
  Deliberately a little generous, so the computed size never overflows the
  measure. Narrow, wide, and ordinary letters are counted separately because a
  plain character count overflowed all-caps names and wrapped wide ones.
*/
function setWidthEm(name: string): number {
  let em = 0;
  for (const ch of name) {
    if (ch === " ") em += 0.22;
    else if ("ilj".includes(ch)) em += 0.21;
    else if ("ftr".includes(ch)) em += 0.33;
    else if ("mw".includes(ch)) em += 0.8;
    else if (ch === "I") em += 0.26;
    else if ("MW".includes(ch)) em += 0.85;
    else if ("OQDGCHNU".includes(ch)) em += 0.7;
    else if (ch >= "A" && ch <= "Z") em += 0.56;
    else em += 0.5;
  }
  return em;
}

/**
 * Initiative page. Layout follows DESIGN.md: the initiative's name is the
 * composition, sized to fill the measure the way the wordmark does on the
 * homepage. The three facts sit beneath as ruled columns, never as a boxed
 * panel.
 */
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
        <div className="shell">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/companies/">Companies</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{v.name}</span>
          </nav>

          <p className="label label-accent">MAD Ventures / Company</p>
          <div className="venture-title-wrap">
            <h1
              className="venture-title"
              style={{ "--fit": (96 / setWidthEm(v.name)).toFixed(2) } as CSSProperties}
            >
              {v.name}
            </h1>
          </div>

          <div className="page-head__foot">
            <div className="page-head__aside">
              <Link href="/companies/" className="text-link">
                <span aria-hidden="true">&larr;</span> Back to companies
              </Link>
            </div>
            <p className="lead page-head__lead">{v.lede}</p>
          </div>

          <div className="cut" aria-hidden="true">
            <b />
            <i />
          </div>
        </div>
      </section>

      <section className="section section--tight" aria-label={`${v.name} facts`}>
        <div className="shell">
          <Reveal>
            <div className="cols cols--3">
              <div className="cols__item">
                <p className="label">Stage</p>
                <p>
                  <span className="stage-tag">
                    <span className="stage-tag__dot" aria-hidden="true" />
                    {v.stage}
                  </span>
                </p>
                <p className="note">
                  &ldquo;{v.stage}&rdquo; describes the company&rsquo;s current public
                  stage. It does not imply general availability or a committed launch
                  date.
                </p>
              </div>

              <div className="cols__item">
                <p className="label">Parent company</p>
                <p>
                  Part of <Link href="/">MAD Ventures Holdings</Link>
                </p>
              </div>

              <div className="cols__item">
                <p className="label">Operating model</p>
                <p>
                  A <Link href="/what-we-do/">MAD Ventures initiative</Link>, being
                  developed internally and not currently available.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--rule" aria-labelledby="focus-heading">
        <div className="shell">
          <div className="split">
            <Reveal>
              <p className="label">Current focus</p>
              <h2 id="focus-heading" className="t-heading">
                Measured at its current stage.
              </h2>
            </Reveal>

            <div>
              <Reveal>
                <div className="detail-block">
                  <ul className="focus-list-plain">
                    {v.focus.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={0.08} className="below-list">
                <div className="detail-block">
                  <h2 className="t-row">What that list is not</h2>
                  <p className="prose">
                    The focus above is the complete public scope of work for {v.name}. It is not a feature list, a release schedule, or a commitment to
                    deliver. Anything not stated there has not been decided, and
                    should not be inferred from it.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {v.concept ? (
        <section className="section section--flush-top" aria-label="Conceptual example">
          <div className="shell">
            <ConceptExample venture={v} />
          </div>
        </section>
      ) : null}

      <section className="section section--rule" aria-labelledby="next-heading">
        <div className="shell">
          <div className="split">
            <Reveal>
              <p className="label">Enquiries</p>
              <h2 id="next-heading" className="t-heading">
                Where to go next.
              </h2>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="closing__body">
                <p className="lead">
                  Product questions belong with {v.name}. Partnership and
                  collaboration conversations belong with MAD Ventures directly.
                </p>

                <div className="actions">
                  <Link href="/companies/" className="text-link">
                    <span aria-hidden="true">&larr;</span> All companies
                  </Link>
                  <Link href="/partnership/" className="text-link">
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
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
