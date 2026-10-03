import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion";
import { VENTURES, ventureHref } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Software We're Developing",
  description: `The software initiatives MAD Ventures Holdings LLC is developing: ${VENTURES.map((v) => v.name).join(", ")}. Each states its current stage plainly.`,
  alternates: { canonical: "/companies/" },
};

export default function CompaniesPage() {
  return (
    <>
      <section className="page-head">
        <div className="shell page-head__inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Software</span>
          </nav>
          <h1 className="display-1 page-head__title">
            Software we&rsquo;re developing.
          </h1>
          <p className="lead page-head__lead">
            Four software initiatives, each built against a specific problem
            someone already has. Every one states its current stage plainly,
            including the one whose public scope is still being defined.
          </p>
          <div className="count-line">
            <span className="count-line__figure">0{VENTURES.length}</span>
            <span className="label">software initiatives</span>
          </div>
          <div className="page-head__cut" aria-hidden="true">
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

          <RevealGroup as="ul" className="colo__list colo__list--tall" stagger={0.06}>
            {VENTURES.map((venture) => (
              <RevealItem as="li" key={venture.slug}>
                <Link href={ventureHref(venture.slug)} className="colo__item">
                  <span className="colo__index">{venture.index}</span>
                  <span className="colo__name">{venture.name}</span>
                  <span className="colo__purpose">{venture.purpose}</span>
                  <span className="colo__stage">
                    <span className="stage-badge">
                      <span className="stage-badge__dot" aria-hidden="true" />
                      {venture.stage}
                    </span>
                  </span>
                  <span className="colo__arrow" aria-hidden="true">
                    &rarr;
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>

          <p className="stage-note">
            Stage labels describe each initiative&rsquo;s current public stage. They
            are not statements of availability, traction, or launch timing, and
            this page is not a signup or contact route for any individual
            product.
          </p>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="identity-heading">
        <div className="shell detail-split">
          <Reveal>
            <div>
              <p className="label">Public identity</p>
              <h2 id="identity-heading" className="display-2 mados-title">
                Each product keeps its own name.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div>
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
              <p style={{ marginTop: "2rem" }}>
                <Link href="/approach/" className="text-link">
                  How MAD Ventures develops this software{" "}
                  <span className="arrow" aria-hidden="true">&rarr;</span>
                </Link>
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
