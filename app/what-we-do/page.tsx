import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion";
import { INTERNAL_PLATFORMS, SITE, VENTURES } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "What We Do",
  description: SITE.mission,
  alternates: { canonical: "/what-we-do/" },
};

const AREAS = [
  {
    n: "01",
    title: "Understand",
    body: "Starting from the problem someone actually has. Most software fails here, not in the code. it answers a question nobody was asking.",
  },
  {
    n: "02",
    title: "Decide",
    body: "Building the product and the systems that make it genuinely useful rather than merely launched. This is where most of the real work happens, and where MAD Ventures differentiates.",
  },
  {
    n: "03",
    title: "Operate and hold",
    body: "Running and improving the software after launch, and being honest about what is proven, what is not, and what still needs work.",
  },
];

export default function WhatWeDoPage() {
  return (
    <>
      <section className="page-head">
        <div className="shell page-head__inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">What We Do</span>
          </nav>
          <p className="label label-accent">Our mission</p>
          <h1 className="display-1 page-head__title">{SITE.mission}</h1>
          <p className="lead page-head__lead">
            Everything else on this page exists to serve that sentence,
            including the internal technology we use to build our own software
            with.
          </p>
          <div className="page-head__cut" aria-hidden="true">
            <b />
            <i />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="areas-heading">
        <div className="shell">
          <Reveal>
            <div className="section-intro">
              <p className="label">How that works</p>
              <h2 id="areas-heading" className="display-2">
                Understand, decide, move.
              </h2>
            </div>
          </Reveal>

          <RevealGroup as="ul" className="area-list" stagger={0.07}>
            {AREAS.map((area) => (
              <RevealItem as="li" key={area.n} className="area-row">
                <span className="mono-num area-row__n">{area.n}</span>
                <h3 className="display-3 area-row__title">{area.title}</h3>
                <p className="prose area-row__body">{area.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Supporting detail. subordinate to the mission, not the brand center. */}
      <section className="section section-alt" aria-labelledby="build-room-heading">
        <div className="shell">
          <Reveal>
            <div className="section-intro">
              <p className="label">Supporting detail. internal initiative</p>
              <h2 id="build-room-heading" className="display-2">
                Build Room: coordinating software-building work.
              </h2>
            </div>
          </Reveal>

          <div className="detail-split">
            <Reveal>
              <div>
                <p className="prose">
                  Build Room is MAD Ventures&rsquo; internal initiative for
                  coordinating how software work actually moves: how a proposed change
                  is scoped and given an owner, how it is prepared, how it is
                  independently reviewed against evidence, how findings return to the
                  builder, and how a finished review reaches a person for a decision.
                </p>
                <p className="prose">
                  The point is accountability. Every change should have a named owner,
                  an independent check before anyone is asked to approve it, and a
                  decision that belongs to a person rather than to a pipeline.
                </p>
                <p className="prose">
                  Build Room is not a customer product. Its interfaces are private,
                  and nothing on this site is a screenshot of a live internal screen.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <figure className="figure">
                <div className="figure__frame">
                  <p className="label figure__label">Conceptual workflow</p>
                  <h3 className="display-3 figure__title">How accountable work moves</h3>
                  <WorkflowDiagram />
                </div>
                <figcaption className="figure__caption">
                  Conceptual Build Room workflow. Illustrates the operating
                  model; does not assert live automation, production readiness, or
                  deployment approval. Review passing is a separate step from founder
                  release or deployment authorisation.
                </figcaption>
              </figure>
            </Reveal>
          </div>

          <details className="text-equivalent">
            <summary>Text description of this diagram</summary>
            <ol>
              <li>
                <strong>Proposed change</strong>. Scope and owner. Work enters
                with a defined boundary and a named owner.
              </li>
              <li>
                <strong>Build</strong>. Prepare the change against the agreed
                scope.
              </li>
              <li>
                <strong>Independent review</strong>. Check evidence and
                behavior, by a reviewer who did not build it.
              </li>
              <li>
                <strong>Corrections</strong>. Return findings to the builder,
                looping back to Build.
              </li>
              <li>
                <strong>Founder decision</strong>. Approve, defer, or decline.
                A person decides; the workflow does not grant release or deployment
                authority on its own.
              </li>
            </ol>
          </details>
        </div>
      </section>

      <section className="section" aria-labelledby="mados-heading">
        <div className="shell detail-split">
          <Reveal>
            <div>
              <p className="label">Supporting detail. internal initiative</p>
              <h2 id="mados-heading" className="display-2 mados-title">
                MadOS: organizing the company&rsquo;s work and technology.
              </h2>
              <p className="prose">
                MadOS is MAD Ventures&rsquo; internal operating-system initiative: the
                layer where the company&rsquo;s own work, decisions, records, and
                technology are organized so they stay legible as the group gets more
                complex.
              </p>
              <p className="prose">
                Working across {VENTURES.length} software initiatives means the same
                context has to survive between them. MadOS is where we keep the
                reasoning behind decisions intact, and make the working standard
                repeatable rather than tribal.
              </p>
              <p className="prose">
                Like Build Room, MadOS is internal. Private interfaces, credentials,
                operational data, and administrative surfaces are deliberately not
                part of this public site.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="support support--tight">
              <div className="support__head">
                <p className="label">Internal tools, not products</p>
                <h3 className="display-3">Internal platforms</h3>
              </div>
              <div className="support__items">
                {INTERNAL_PLATFORMS.map((platform) => (
                  <div key={platform.name} className="support__item">
                    <p className="label label-accent">{platform.name}</p>
                    <p className="prose">{platform.body}</p>
                  </div>
                ))}
              </div>
              <p className="support__foot">
                Neither is a fifth or sixth venture, neither is offered to outside
                customers today, and no public availability, automation, or customer
                adoption is claimed for either.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="close-heading">
        <div className="shell closing">
          <Reveal>
            <div>
              <p className="label label-accent">Work with us</p>
              <h2 id="close-heading" className="display-2 closing__title">
                If this sounds like your problem, that is the point.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="closing__body">
              <p className="prose">
                Whether you are a team with a real software problem, a founder
                looking for a build partner, or an operator who wants to build
                something that lasts, the conversation starts the same way.
              </p>
              <a href={`mailto:${SITE.email}`} className="btn btn-primary">
                {SITE.email} <span className="arrow" aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/**
 * Build Room workflow, authored as native SVG/CSS.
 *
 * Desktop: a horizontal sequence. Below 768px the same five stages stack
 * vertically through `.workflow-stack`, because a horizontally scrolled diagram
 * cannot keep the correction loop legible on a phone.
 */
function WorkflowDiagram() {
  return (
    <>
      <div className="workflow-desktop">
        <svg
          viewBox="0 0 920 320"
          role="img"
          aria-labelledby="wf-title wf-desc"
          className="workflow-svg"
        >
          <title id="wf-title">How accountable work moves</title>
          <desc id="wf-desc">
            Proposed change with scope and owner goes to Build, then to independent
            review. If corrections are needed, findings return to Corrections and
            loop back to Build. If ready for a decision, it goes to a founder
            decision: approve, defer, or decline.
          </desc>
          <defs>
            <marker id="wf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill="#7c868f" />
            </marker>
            <marker id="wf-arrow-loop" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill="#146bff" />
            </marker>
          </defs>

          <path className="wf-flow" d="M175 94 L207 94" markerEnd="url(#wf-arrow)" />
          <path className="wf-flow" d="M377 94 L409 94" markerEnd="url(#wf-arrow)" />
          <path className="wf-flow" d="M579 94 L710 94" markerEnd="url(#wf-arrow)" />
          <path className="wf-loop" d="M496 130 C 496 172, 400 178, 340 206" markerEnd="url(#wf-arrow-loop)" />
          <path className="wf-loop" d="M294 210 L294 135" markerEnd="url(#wf-arrow-loop)" />

          <text className="wf-loop-label" x="470" y="196" textAnchor="start">Corrections needed</text>
          <text className="wf-loop-label" x="647" y="44" textAnchor="middle">Ready for a decision</text>
          <text className="wf-loop-label" x="306" y="176" textAnchor="start">Return to builder</text>

          <g>
            <rect className="wf-stage" x="10" y="58" width="165" height="72" rx="3" />
            <text className="wf-title" x="92" y="88" textAnchor="middle">Proposed change</text>
            <text className="wf-sub" x="92" y="106" textAnchor="middle">Scope and owner</text>
          </g>
          <g>
            <rect className="wf-stage" x="212" y="58" width="165" height="72" rx="3" />
            <text className="wf-title" x="294" y="88" textAnchor="middle">Build</text>
            <text className="wf-sub" x="294" y="106" textAnchor="middle">Prepare the change</text>
          </g>
          <g>
            <rect className="wf-stage" x="414" y="58" width="165" height="72" rx="3" />
            <text className="wf-title" x="496" y="88" textAnchor="middle">Independent review</text>
            <text className="wf-sub" x="496" y="106" textAnchor="middle">Check evidence and behavior</text>
          </g>
          <g>
            <rect className="wf-stage" x="212" y="210" width="165" height="72" rx="3" />
            <text className="wf-title" x="294" y="240" textAnchor="middle">Corrections</text>
            <text className="wf-sub" x="294" y="258" textAnchor="middle">Return findings to the builder</text>
          </g>
          <g>
            <rect className="wf-decision" x="715" y="58" width="165" height="72" rx="3" />
            <text className="wf-title" x="797" y="88" textAnchor="middle">Founder decision</text>
            <text className="wf-sub" x="797" y="106" textAnchor="middle">Approve, defer, or decline</text>
          </g>
        </svg>
      </div>

      <ol className="workflow-stack">
        {[
          ["01", "Proposed change", "Scope and owner"],
          ["02", "Build", "Prepare the change"],
          ["03", "Independent review", "Check evidence and behavior"],
        ].map(([n, title, sub]) => (
          <li key={n} className="workflow-step">
            <span className="mono-num">{n}</span>
            <div className="workflow-step__card">
              <p className="workflow-step__title">{title}</p>
              <p className="workflow-step__sub">{sub}</p>
            </div>
          </li>
        ))}
        <li className="workflow-step workflow-step--branch">
          <div className="workflow-branch">
            <span className="workflow-branch__label">Corrections needed</span>
            <div className="workflow-step__card">
              <p className="workflow-step__title">Corrections</p>
              <p className="workflow-step__sub">Return findings to the builder</p>
            </div>
            <p className="workflow-branch__back">&larr; Returns to Build</p>
          </div>
        </li>
        <li className="workflow-step workflow-step--decision">
          <span className="mono-num">04</span>
          <div className="workflow-step__card">
            <p className="workflow-step__title">Founder decision</p>
            <p className="workflow-step__sub">Approve, defer, or decline</p>
          </div>
        </li>
      </ol>
    </>
  );
}
