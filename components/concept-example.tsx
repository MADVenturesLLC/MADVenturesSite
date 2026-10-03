import type { Venture } from "@/lib/portfolio";

/**
 * Conceptual company example.
 *
 * These are ILLUSTRATIONS of each company's published development focus, built
 * as live page elements rather than screenshots. They are labeled as conceptual,
 * carry an explicit disclaimer, and state that they are not a product interface
 * and not a claim of an available capability. `npm run verify` fails the build if
 * a label or disclaimer is removed.
 */
export function ConceptExample({ venture }: { venture: Venture }) {
  const concept = venture.concept;
  if (!concept) return null;

  return (
    <div className="concept" data-concept>
      <div className="concept__head">
        <span className="label label-accent">Conceptual example</span>
        <span className="concept__title">{concept.title}</span>
      </div>

      <div className="concept__body">
        {concept.kind === "signal-chain" ? <SignalChain /> : null}
        {concept.kind === "position-grid" ? <PositionGrid /> : null}
        {concept.kind === "readiness" ? <Readiness /> : null}

        <p className="concept__note">
          <span className="label label-stone">Conceptual.</span> An illustration of
          the stated development focus. A live page element, not a screenshot or a
          mockup of a shipped interface. Any figures or bar lengths shown are
          illustrative only and represent no measurement, metric, or verified
          product capability.
        </p>
      </div>
    </div>
  );
}

function SignalChain() {
  const stages = [
    {
      n: "1",
      title: "Signal",
      body: "High-volume social and behavioral input, arriving faster than anyone can read it.",
      rows: [["volume", 88, false], ["clarity", 22, true]],
    },
    {
      n: "2",
      title: "Reading",
      body: "Grouping, weighting, and summarizing that input into something a person can reason about.",
      rows: [["grouped", 64, false], ["traceable", 18, true]],
    },
    {
      n: "3",
      title: "Decision",
      body: "A reading an operator can act on, with the reasoning visible so it can be challenged rather than trusted blindly.",
      rows: [["actionable", 72, false], ["verifiable", 30, true]],
    },
  ];

  return (
    <div className="signal-chain">
      {stages.map((stage) => (
        <div className="signal-cell" key={stage.n}>
          <h4 className="signal-cell__title">
            <span className="mono-num">{stage.n}.</span> {stage.title}
          </h4>
          <p className="signal-cell__body">{stage.body}</p>
          <div className="signal-rows">
            {stage.rows.map(([label, width, quiet]) => (
              <div className="signal-row" key={label as string}>
                <span>{label as string}</span>
                <span className={quiet ? "signal-bar is-quiet" : "signal-bar"}>
                  <span style={{ width: `${width as number}%` }} />
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function PositionGrid() {
  const cells = [
    { title: "Position", value: "One combined view", body: "Accounts and sources brought together instead of read separately." },
    { title: "Change", value: "Direction, over time", body: "Movement shown as a trend, not a single unreadable delta." },
    { title: "Explanation", value: "Why it moved", body: "Each figure traceable to what produced it, so it can be checked." },
    { title: "Control", value: "What you can act on", body: "The decisions the view is meant to support, stated plainly." },
  ];

  return (
    <>
      <div className="position-grid">
        {cells.map((cell) => (
          <div className="position-cell" key={cell.title}>
            <h4 className="position-cell__title">{cell.title}</h4>
            <p className="position-cell__value">{cell.value}</p>
            <p className="position-cell__body">{cell.body}</p>
          </div>
        ))}
      </div>
      <p className="concept__legend">Personal finance · Visibility and control</p>
    </>
  );
}

/**
 * IMPLEVRA's conceptual example: a readiness record for one change, shown as
 * three printed sheets fanned in depth. The front sheet is the readable one.
 *
 * This is a design concept, not a product interface. There is no product to
 * photograph. Every site, state, and change below is fictional and exists to
 * show the documented problem: a change can hold at one location and fail at
 * another, so readiness has to be established rather than assumed.
 *
 * The vocabulary is restricted to IMPLEVRA's published scope. No staffing,
 * workforce, census, or ratio language appears here, and none may be added
 * without the Founder confirming that scope.
 */
const RECORD_SITES = [
  { site: "North site", state: "Demonstrated", gap: false },
  { site: "Central site", state: "Demonstrated", gap: false },
  { site: "South site", state: "Assumed, not established", gap: true },
] as const;

function Readiness() {
  return (
    <div className="rr">
      <div className="rr__stack">
        <article className="rr__sheet rr__sheet--back" aria-hidden="true">
          <p className="rr__kind">Readiness record</p>
        </article>
        <article className="rr__sheet rr__sheet--mid" aria-hidden="true">
          <p className="rr__kind">Readiness record</p>
        </article>

        <article className="rr__sheet rr__sheet--front">
          <div className="rr__top">
            <p className="rr__kind">Readiness record</p>
            <p className="rr__id">Illustrative, fictional change</p>
          </div>

          <div className="rr__change">
            <p className="rr__label">Change under review</p>
            <p className="rr__value">Revised discharge standard</p>
          </div>

          <div className="rr__rows">
            {RECORD_SITES.map((row) => (
              <div className="rr__row" key={row.site}>
                <span className="rr__site">{row.site}</span>
                <span className={row.gap ? "rr__state rr__state--gap" : "rr__state"}>
                  {row.state}
                </span>
              </div>
            ))}
          </div>

          <p className="rr__note">
            A change that holds at one location can still fail at another.
            <strong> Readiness is established and demonstrated, not assumed</strong>, at
            every location, under whatever constraints that location carries.
          </p>
        </article>
      </div>
    </div>
  );
}
