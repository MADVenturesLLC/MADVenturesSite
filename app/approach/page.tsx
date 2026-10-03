import type { Metadata } from "next";
import Link from "next/link";
import { DrawRule, Reveal, RevealGroup, RevealItem } from "@/components/motion";
import { DEVELOPMENT_STAGES, FOCUS_AREAS } from "@/lib/portfolio";
import { ProblemField } from "@/components/problem-field";

export const metadata: Metadata = {
  title: "Our Approach",
  description:
    "How MAD Ventures develops software: from a real operational problem, to a product people can use, to the discipline required to expand it honestly.",
  alternates: { canonical: "/approach/" },
};

export default function ApproachPage() {
  return (
    <>
      <section className="page-head">
        <div className="shell page-head__inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Approach</span>
          </nav>
          <h1 className="display-1 page-head__title">
            Useful software is built around a real problem.
          </h1>
          <p className="lead page-head__lead">
            MAD Ventures develops software that helps people understand what
            matters, make clearer decisions, and move work forward.
          </p>
          <div className="page-head__cut" aria-hidden="true">
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
              <h2 id="model-heading" className="display-2">
                Problem. Product. Discipline.
              </h2>
            </div>
          </Reveal>

          <RevealGroup as="ul" className="model-rows" stagger={0.06}>
            {DEVELOPMENT_STAGES.map((row) => (
              <RevealItem as="li" key={row.n} className="model-rows__row">
                <span className="mono-num model-rows__n">{row.n}</span>
                <h3 className="display-3 model-rows__title">{row.title}</h3>
                <p className="prose model-rows__body">{row.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="section" aria-labelledby="field-heading">
        <div className="shell">
          <Reveal>
            <div className="section-intro">
              <p className="label">The method, in one movement</p>
              <h2 id="field-heading" className="display-2">
                From a large picture to something a person acts on.
              </h2>
              <p className="prose" style={{ maxWidth: "46rem" }}>
                This is the shape of the work, drawn once. It is a conceptual
                illustration of how we think about a problem, not a product
                interface and not a picture of software anyone can use today.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <ProblemField />
          </Reveal>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="infra-heading">
        <div className="shell detail-split">
          <Reveal>
            <div>
              <p className="label">Operating infrastructure</p>
              <h2 id="infra-heading" className="display-2 mados-title">
                Infrastructure turns judgment into repeatable action.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div>
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
              <p style={{ marginTop: "2rem" }}>
                <Link href="/what-we-do/" className="text-link">
                  How that technology is organized{" "}
                  <span className="arrow" aria-hidden="true">&rarr;</span>
                </Link>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="focus-heading">
        <div className="shell">
          <Reveal>
            <div className="section-intro">
              <p className="label">Where we focus</p>
              <h2 id="focus-heading" className="display-2">
                Problems where clarity carries consequence.
              </h2>
            </div>
          </Reveal>

          <RevealGroup as="ul" className="focus-list" stagger={0.05}>
            {FOCUS_AREAS.map((area) => (
              <RevealItem as="li" key={area.n} className="focus-list__item">
                <span className="mono-num">{area.n}</span>
                <h3 className="focus-list__title">{area.title}</h3>
                <p className="prose focus-list__body">{area.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <DrawRule className="rule section-gap" />

          <Reveal>
            <p className="prose stage-note">
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
