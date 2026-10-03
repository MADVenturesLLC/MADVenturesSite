import Link from "next/link";

/**
 * Bespoke conceptual artwork, one treatment per venture.
 *
 * These are illustrations of each initiative's stated development focus. They are
 * deliberately NOT interface frames: no browser chrome, no status widgets, no
 * dashboard fragments. Each is a different visual idea matched to the problem
 * the software addresses, and each is labeled conceptual wherever it appears.
 *
 * Avenmark is rendered as a restrained text mention rather than artwork,
 * because its public scope is genuinely undefined and a large graphic would
 * imply a design decision that has not been made.
 */

type ArtKind = "bars" | "cells" | "rows" | "unset";

export function VentureArtwork({
  kind,
  seed,
}: {
  kind: ArtKind;
  seed: number;
}) {
  switch (kind) {
    case "bars":
      return <SignalArtwork />;
    case "cells":
      return <CellsArtwork />;
    case "rows":
      return <ReadinessArtwork seed={seed} />;
    default:
      return <UnsetArtwork />;
  }
}

/**
 * OperisIQ Social Intelligence. volume collapsing into signal.
 *
 * A wide field of faint marks with a few heavy ones. It is about attention
 * being spent where it should be, not about a chart of results.
 */
function SignalArtwork() {
  const rows = 9;
  const cols = 16;
  const heavy = new Set([17, 34, 52, 88, 105, 121, 138]);

  return (
    <div className="art art--signal" role="img" aria-label="Conceptual illustration: a wide field of faint marks, with a few carrying more weight.">
      <div className="art__label">Conceptual · signal density</div>
      <div className="art__field" aria-hidden="true">
        {Array.from({ length: rows * cols }).map((_, i) => (
          <span
            key={i}
            className={heavy.has(i) ? "art__mark art__mark--heavy" : "art__mark"}
            style={{ animationDelay: `${(i % 16) * 90}ms` }}
          />
        ))}
      </div>
      <div className="art__caption">Finding the few that carry the meaning.</div>
    </div>
  );
}

/**
 * OperisIQ Financials. one position, read at a glance.
 *
 * A single figure set with its supporting parts reduced to quiet marks around
 * it, so the composition states "one view" rather than "a dashboard".
 */
function CellsArtwork() {
  return (
    <div className="art art--cells" role="img" aria-label="Conceptual illustration: one dominant position figure with quiet supporting marks.">
      <div className="art__label">Conceptual · single position view</div>
      <div className="art__figure" aria-hidden="true">
        <span className="art__figure-bar" />
        <span className="art__figure-bar" style={{ width: "62%" }} />
        <span className="art__figure-bar" style={{ width: "38%" }} />
      </div>
      <div className="art__orbit" aria-hidden="true">
        {["what you have", "what changed", "why it changed", "what you can do"].map(
          (label, i) => (
            <span key={label} className="art__orbit-item" style={{ ["--i" as string]: i }}>
              <i aria-hidden="true" />
              {label}
            </span>
          ),
        )}
      </div>
      <div className="art__caption">One position. Everything that explains it.</div>
    </div>
  );
}

/**
 * IMPLEVRA. four readiness dimensions as a measured sweep.
 *
 * A slow traveling line across four labeled dimensions, implying assessment
 * without claiming a score, a result, or a compliance outcome.
 */
function ReadinessArtwork({ seed }: { seed: number }) {
  const dims = ["Site variance", "Regulation", "Ownership", "Evidence"];

  return (
    <div className="art art--readiness" role="img" aria-label="Conceptual illustration: a traveling line assessing four readiness dimensions.">
      <div className="art__label">Conceptual · readiness dimensions</div>
      <div className="art__sweep" aria-hidden="true">
        <span
          className="art__sweep-line"
          style={{ animationDuration: `${7 + seed}s`, animationDelay: `${seed * -1.4}s` }}
        />
      </div>
      <ul className="art__dims" aria-hidden="true">
        {dims.map((d, i) => (
          <li key={d}>
            <span className="art__dim-dot" style={{ animationDelay: `${i * 1.2 + seed * 0.3}s` }} />
            {d}
          </li>
        ))}
      </ul>
      <div className="art__caption">Still being defined. no result claimed.</div>
    </div>
  );
}

/**
 * Avenmark Health. a restrained text mention, not a drawing.
 *
 * An earlier version rendered a large question-mark placeholder. It was honest
 * but it gave an initiative with no defined scope the same visual weight as the
 * three with a clear purpose, and it implied a design decision rather than an
 * absence of one. The homepage now gives prominence to the initiatives with a
 * stated purpose; Avenmark is mentioned, in words, without inventing scope.
 */
function UnsetArtwork() {
  return (
    <div className="art art--mention">
      <p className="type-num">04 &middot; Initiative</p>
      <p className="art__mention-state">
        <span className="stage-tag__dot" aria-hidden="true" />
        In development &mdash; scope being defined
      </p>
      <p className="art__mention-body">
        Avenmark Health&rsquo;s public category and product scope are still being
        set. We would rather say that plainly than describe something we have not
        decided.
      </p>
      <p className="art__mention-link">
        <Link href="/companies/avenmark-health/">Company page</Link>
      </p>
    </div>
  );
}
