/**
 * The method, as one continuous field.
 *
 * Lives on /approach rather than the homepage: it explains HOW MAD Ventures
 * works, not what a product is. The homepage leads with a specific initiative
 * and a specific user problem instead.
 *
 * Everything shown is conceptual. No figure, count, or result is real.
 */

const STAGES = [
  {
    id: "volume",
    title: "Volume",
    body: "More signal arrives than anyone can read.",
  },
  {
    id: "surface",
    title: "What matters",
    body: "The few things worth attention are surfaced.",
  },
  {
    id: "reasoning",
    title: "Clear reasoning",
    body: "How it was reached stays visible and checkable.",
  },
  {
    id: "act",
    title: "The next action",
    body: "Handed to the person who has to act on it.",
  },
] as const;

export function ProblemField() {
  return (
    <figure className="problem" data-concept>
      <div className="problem__head">
        <span className="label">Our approach &mdash; conceptual</span>
      </div>

      <div className="problem__field" role="img" aria-labelledby="pf-title pf-desc">
        <h3 className="visually-hidden" id="pf-title">
          From volume to a decision
        </h3>
        <p className="visually-hidden" id="pf-desc">
          A conceptual sequence: a dense field of signal, a narrow selection, a
          visible chain of reasoning, and a handoff to the person who acts.
        </p>

        <div className="problem__stage problem__stage--volume" aria-hidden="true">
          {Array.from({ length: 160 }).map((_, i) => (
            <span key={i} className={i % 13 === 0 ? "pf-mark pf-mark--lit" : "pf-mark"} />
          ))}
        </div>

        <div className="problem__stage problem__stage--surface" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="pf-mark pf-mark--lit" />
          ))}
        </div>

        <span className="problem__link" aria-hidden="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className="pf-chain" />
          ))}
        </span>

        <div className="problem__stage problem__stage--act" aria-hidden="true">
          <span className="pf-act" />
        </div>
      </div>

      <ol className="problem__steps">
        {STAGES.map((stage, i) => (
          <li key={stage.id}>
            <span className="problem__step-n">{String(i + 1).padStart(2, "0")}</span>
            <span className="problem__step-title">{stage.title}</span>
            <span className="problem__step-body">{stage.body}</span>
          </li>
        ))}
      </ol>

      <figcaption className="problem__caption">
        A conceptual illustration of the approach, not a product interface. It
        shows no real data, measurement, or verified capability.
      </figcaption>
    </figure>
  );
}
