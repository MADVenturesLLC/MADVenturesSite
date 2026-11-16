import type { Metadata } from "next";
import Link from "next/link";
import { Tilt } from "@/components/tilt";
import { DrawRule, Reveal, RevealGroup, RevealItem } from "@/components/motion";
import { DEVELOPMENT_STAGES, FOCUS_AREAS } from "@/lib/portfolio";
import { ProblemField } from "@/components/problem-field";

export const metadata: Metadata = {
  title: "Our Approach",
  description:
    "How MAD Ventures develops software: from a real operational problem, to a product people can use, to the discipline required to expand it honestly.",
  alternates: { canonical: "/approach/" },
};

/**
 * Approach. Layout follows DESIGN.md: three stages as rows, the method figure
 * at full measure, infrastructure as a split, focus areas in ruled columns.
 */
export default function ApproachPage() {
  return (
    <>
      <section className="page-head">
        <div className="shell">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Approach</span>
          </nav>

          <h1 className="t-page page-head__title">
            Useful software is built around a real problem.
          </h1>

          <div className="page-head__foot">
            <p className="lead page-head__lead">
              MAD Ventures develops software that helps people understand what
              matters, make clearer decisions, and move work forward.
            </p>
          </div>

          <div className="cut" aria-hidden="true">
            <b />
            <i />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="model-heading">
        <div className="shell">
          <Reveal>
            <div className="section-intro">
              <p className="label">Operating model</p>
              <h2 id="model-heading" className="t-heading">
                Problem. Product. Discipline.
              </h2>
            </div>
          </Reveal>

          <RevealGroup as="ul" className="rows" stagger={0.06}>
            {DEVELOPMENT_STAGES.map((row) => (
              <RevealItem as="li" key={row.n}>
                <Tilt contentClassName="rows__row" max={2}>
                <span className="mono-num rows__n">{row.n}</span>
                <h3 className="t-row rows__title">{row.title}</h3>
                <p className="prose rows__body">{row.body}</p>
              </Tilt>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* The method figure. Conceptual, and labeled as such. */}
      <section className="section section--rule" aria-labelledby="field-heading">
        <div className="shell">
          <div className="split">
            <Reveal>
              <p className="label">The method, in one movement</p>
              <h2 id="field-heading" className="t-heading">
                From a large picture to something a person acts on.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="prose">
                This is the shape of the work, drawn once. It is a conceptual
                illustration of how we think about a problem, not a product
                interface and not a picture of software anyone can use today.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.08} className="below-split">
            <ProblemField />
          </Reveal>
        </div>
      </section>

      <section className="section section--rule" aria-labelledby="infra-heading">
        <div className="shell">
          <div className="split">
            <Reveal>
              <p className="label">Operating infrastructure</p>
              <h2 id="infra-heading" className="t-heading">
                Infrastructure turns judgment into repeatable action.
              </h2>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="prose">
                Software only earns its place when it changes what someone does
                next. Clear reasoning, honest scope, and a product people can
                actually rely on are what make that possible.
              </p>
              <p className="prose">
                That is the reason MAD Ventures builds internal technology at all.
                Build Room and MadOS exist to apply that discipline to our own
                software-building work, so the standard is something we run rather than
                something we recommend.
              </p>
              <p className="split__more">
                <Link href="/what-we-do/" className="text-link">
                  How that technology is organized{" "}
                  <span className="arrow" aria-hidden="true">&rarr;</span>
                </Link>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--rule" aria-labelledby="focus-heading">
        <div className="shell">
          <Reveal>
            <div className="section-intro">
              <p className="label">Where we focus</p>
              <h2 id="focus-heading" className="t-heading">
                Problems where clarity carries consequence.
              </h2>
            </div>
          </Reveal>

          <RevealGroup as="ul" className="cols cols--focus" stagger={0.05}>
            {FOCUS_AREAS.map((area) => (
              <RevealItem as="li" key={area.n}>
                <Tilt contentClassName="cols__item" max={2}>
                <span className="mono-num">{area.n}</span>
                <h3 className="cols__title cols__title--sm">{area.title}</h3>
                <p className="prose">{area.body}</p>
              </Tilt>
              </RevealItem>
            ))}
          </RevealGroup>

          <DrawRule className="rule below-split" />

          <Reveal>
            <p className="note" style={{ marginTop: "1.25rem" }}>
              We describe our focus areas as problems we choose to work on. They are
              not investment criteria, and nothing here is an offer, a term sheet, or a
              solicitation.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
