import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion";
import { VENTURES, ventureHref } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Software We're Developing",
  description: `The software initiatives MAD Ventures Holdings LLC is developing: ${VENTURES.map((v) => v.name).join(", ")}. Each states its current stage plainly.`,
  alternates: { canonical: "/companies/" },
};

/**
 * Software index. The route stays /companies/ so existing links hold; the
 * navigation label is Software. Layout follows DESIGN.md: page title, count
 * line and lead, the cut, then the register with taller rows than on the
 * homepage.
 */
export default function CompaniesPage() {
  return (
    <>
      <section className="page-head">
        <div className="shell">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Software</span>
          </nav>

          <h1 className="t-page page-head__title">
            Software we&rsquo;re developing.
          </h1>

          <div className="page-head__foot">
            <div className="count-line page-head__aside">
              <span className="count-line__figure">0{VENTURES.length}</span>
              <span className="label">software initiatives</span>
            </div>
            <p className="lead page-head__lead">
              Four software initiatives, each built against a specific problem
              someone already has. Every one states its current stage plainly,
              including the one whose public scope is still being defined.
            </p>
          </div>

          <div className="cut" aria-hidden="true">
            <b />
            <i />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="portfolio-heading">
        <div className="shell">
          <h2 id="portfolio-heading" className="visually-hidden">
            Software initiatives we are developing
          </h2>

          <RevealGroup as="ul" className="register register--tall" stagger={0.06}>
            {VENTURES.map((venture) => (
              <RevealItem as="li" key={venture.slug}>
                <Link href={ventureHref(venture.slug)} className="register__row">
                  <span className="register__index">{venture.index}</span>
                  <span className="register__name">{venture.name}</span>
                  <span className="register__meta">
                    <span className="register__purpose">{venture.purpose}</span>
                    <span className="stage-tag">
                      <span className="stage-tag__dot" aria-hidden="true" />
                      {venture.stage}
                    </span>
                  </span>
                  <span className="register__arrow" aria-hidden="true">
                    &rarr;
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>

          <p className="note register__note">
            Stage labels describe each initiative&rsquo;s current public stage. They
            are not statements of availability, traction, or launch timing, and
            this page is not a signup or contact route for any individual
            product.
          </p>
        </div>
      </section>

      <section className="section section--rule" aria-labelledby="identity-heading">
        <div className="shell">
          <div className="split">
            <Reveal>
              <p className="label">Public identity</p>
              <h2 id="identity-heading" className="t-heading">
                Each product keeps its own name.
              </h2>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="prose">
                Every initiative carries its own name and its own public voice.
                The MAD Ventures mark is a quiet signal of the team standing
                behind it, without taking over how that product speaks.
              </p>
              <p className="prose">
                None of these products is available to use today. Each page states
                what is being worked on and, just as importantly, what has not
                been decided yet.
              </p>
              <p className="split__more">
                <Link href="/approach/" className="text-link">
                  How MAD Ventures develops this software{" "}
                  <span className="arrow" aria-hidden="true">&rarr;</span>
                </Link>
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
