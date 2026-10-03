import Link from "next/link";
import { VENTURES, ventureHref } from "@/lib/portfolio";

/**
 * The method, as one continuous field.
 *
 * Lives on /approach rather than the homepage: it explains HOW MAD Ventures
 * works, not what a product is. The homepage leads with a specific initiative
 * and a specific user problem instead.
 *
 * The desktop presentation runs left-to-right; the mobile presentation is a
 * separate vertical composition, not a shrunken copy.
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
        <span className="mark-cobalt" aria-hidden="true" />
        <span className="type-label">Our approach &mdash; conceptual</span>
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

        <span className="problem__gate" aria-hidden="true" />

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

      {/* Supporting brand motif — the monogram ring, small and subordinate. */}
      <div className="problem__mark" aria-hidden="true">
        <svg viewBox="0 0 64 64" className="problem__mark-svg">
          <circle className="pf-ring" cx="32" cy="32" r="26" />
          <circle className="pf-ring pf-ring--inner" cx="32" cy="32" r="17" />
          <image
            href="/branding/mad-monogram-obsidian.svg"
            x="20"
            y="24"
            width="24"
            height="16"
            preserveAspectRatio="xMidYMid meet"
          />
        </svg>
      </div>

      <figcaption className="problem__caption">
        A conceptual illustration of the approach, not a product interface. It
        shows no real data, measurement, or verified capability.
      </figcaption>
    </figure>
  );
}

/**
 * Initiative index.
 *
 * Separate from the opening visual and laid out as a full-width register with
 * complete names. The previous version truncated names to fit a two-column
 * legend, which hid exactly the information a visitor needs.
 */
export function InitiativeIndex() {
  return (
    <nav className="ix" aria-label="Initiatives">
      <ul className="ledger">
        {VENTURES.map((venture) => (
          <li key={venture.slug}>
            <Link href={ventureHref(venture.slug)} className="ledger__row ix__row">
              <span className="ledger__index">{venture.index}</span>
              <span className="ledger__name">{venture.name}</span>
              <span className="ix__purpose">{venture.purpose}</span>
              <span className="ix__tail">
                <span className="stage-tag">
                  <span className="stage-tag__dot" aria-hidden="true" />
                  {venture.stage}
                </span>
                <span className="ledger__arrow ix__arrow" aria-hidden="true">&rarr;</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
