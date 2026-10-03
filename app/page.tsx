import Link from "next/link";
import { Reveal, RevealGroup, RevealItem, StatementReveal } from "@/components/motion";
import { INTERNAL_PLATFORMS, SITE, VALUES, VENTURES, ventureHref } from "@/lib/portfolio";

/**
 * Homepage, Concept B: the editorial colophon.
 *
 * The masthead carries the identity. The wordmark is set to the full measure of
 * the page, a single heavy cobalt rule cuts the composition, and the four
 * software initiatives read as a printed colophon rather than a card grid or a
 * ruled register.
 *
 * Two deliberate constraints, both learned from review:
 *  - ONE theme for the whole page. The earlier version alternated paper and
 *    ink scenes, which split the brand into two identities.
 *  - ONE invitation. "Start a conversation" is the only contact CTA on the
 *    page; the email appears as plain text, never as a second button.
 *  - Section eyebrows are rationed. The colophon label is the only
 *    uppercase micro-label above a headline; everything else leads with type.
 */
export default function HomePage() {
  return (
    <>
      {/* ================================================================
          Scene 1 — Masthead. The identity is the composition.
          ================================================================ */}
      <section className="masthead on-tone tone-paper" aria-labelledby="home-heading">
        <div className="shell">
          {/* The wordmark is a brand mark, not a heading. The page's single
              h1 is the approved line beneath it. The wrapper is the query
              container, so the wordmark fills whatever measure it is given. */}
          <div className="wordmark-wrap">
            <p className="wordmark" aria-hidden="true">
              <span>MAD</span>
              <span>VENTURES</span>
            </p>
          </div>

          {/* Geometry only. This used to carry a "Four software initiatives"
              label, but that made five text elements in the hero and repeated
              the colophon heading one scroll away. The bar and rule are the
              composition. */}
          <div className="cut" aria-hidden="true">
            <b />
            <i />
          </div>

          <h1 id="home-heading" className="mast__statement">
            <StatementReveal
              text={SITE.hero}
              className="statement-reveal"
            />
          </h1>

          <Reveal delay={0.12}>
            <p className="mast__sub">
              Software that helps people understand what matters, decide clearly,
              and move work forward.
            </p>
            <div className="mast__actions">
              <Link href="/partnership/" className="btn btn-ink">
                Start a conversation <span className="arrow" aria-hidden="true">&rarr;</span>
              </Link>
              <Link href="/companies/" className="link-arrow">
                See what we&rsquo;re building <span className="arrow" aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================================================================
          Scene 2 — The colophon. The only eyebrow on the page, and the one
          place the four initiatives are listed. Every name is a real link.
          ================================================================ */}
      <section className="colophon-band on-tone tone-paper" aria-labelledby="initiatives-heading">
        <div className="shell">
          <p className="label" id="initiatives-heading">
            Software initiatives in development
          </p>

          <RevealGroup as="ul" className="colo__list" stagger={0.06}>
            {VENTURES.map((venture) => (
              <RevealItem as="li" key={venture.slug}>
                <Link href={ventureHref(venture.slug)} className="colo__item">
                  <span className="colo__index">{venture.index}</span>
                  <span className="colo__name">{venture.name}</span>
                  <span className="colo__purpose">{venture.purpose}</span>
                  <span className="colo__stage">
                    <span className="stage-tag">
                      <span className="stage-tag__dot" aria-hidden="true" />
                      {venture.stage}
                    </span>
                  </span>
                  <span className="colo__arrow" aria-hidden="true">&rarr;</span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>

          <p className="colo__note">
            All four are in development and none is available to use today. Each
            states its current stage plainly, including the one whose public
            scope is still being defined.
          </p>
        </div>
      </section>

      {/* ================================================================
          Scene 3 — What the software is for. No eyebrow: the heading does
          the work.
          ================================================================ */}
      <section className="scene on-tone tone-paper" aria-labelledby="values-heading">
        <div className="shell">
          <Reveal>
            <h2 id="values-heading" className="type-heading values__title">
              Software is only useful when it changes what someone does next.
            </h2>
          </Reveal>

          <RevealGroup as="ul" className="verbs" stagger={0.1}>
            {VALUES.map((value) => (
              <RevealItem as="li" key={value.n} className="verb">
                <span className="verb__mark" aria-hidden="true" />
                <h3 className="verb__title">
                  {value.title} <span className="verb__lead">{value.lead}</span>
                </h3>
                <p className="verb__body">{value.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ================================================================
          Scene 4 — Founder. Short. No attributed quote is published while the
          approved one conflicts with the current positioning. See
          content/withheld-claims.md. The pivot copy below was supplied by the
          Founder himself.
          ================================================================ */}
      <section id="about" className="scene on-tone tone-paper" aria-labelledby="founder-heading">
        <div className="shell">
          <div className="founder">
            <div className="founder__identity">
              <Reveal>
                <h2 id="founder-heading" className="visually-hidden">
                  Founder
                </h2>
                <p className="founder__monogram" aria-hidden="true">M</p>
                <p className="founder__name">Michael Daley</p>
                <p className="founder__role">
                  Founder &middot; MAD Ventures Holdings LLC
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <div className="founder__body">
                <h3 className="type-heading founder__statement">
                  Built by someone who has had to solve these problems with a team.
                </h3>

                <dl className="founder__facts">
                  <div>
                    <dt className="label">Operating experience</dt>
                    <dd>
                      Senior management inside operating organizations: healthcare
                      operations, workforce management, capacity planning, and
                      operational readiness.
                    </dd>
                  </div>
                  <div>
                    <dt className="label">How it shapes the software</dt>
                    <dd>
                      Michael&rsquo;s experience in healthcare operations informs how
                      he approaches software: start with a real problem, understand
                      the constraints, and make the next step clear.
                    </dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================================================================
          Scene 5 — Supporting technology. Subordinate and clearly internal.
          ================================================================ */}
      <section className="scene scene-tight on-tone tone-paper" aria-labelledby="tech-heading">
        <div className="shell">
          <Reveal>
            <h2 id="tech-heading" className="type-heading" style={{ maxWidth: "28ch" }}>
              The internal tools we build our own software with.
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="tech" style={{ marginTop: "2.5rem" }}>
              {INTERNAL_PLATFORMS.map((platform) => (
                <div key={platform.name} className="tech__card">
                  <p className="type-num">Internal initiative</p>
                  <h3 className="tech__name">{platform.name}</h3>
                  <p className="tech__body">{platform.body}</p>
                </div>
              ))}
            </div>
            <p className="tech__note">
              Internal tools for building our own software. They are not venture
              initiatives, and nothing about their current state is presented as a
              product or a customer-facing capability.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ================================================================
          Scene 6 — The invitation. The only contact CTA on the page.
          ================================================================ */}
      <section className="invite-band on-tone tone-paper" aria-labelledby="invite-heading">
        <div className="shell">
          <div className="invite">
            <Reveal>
              <h2 id="invite-heading" className="type-heading invite__title">
                Have a problem software could help solve?
              </h2>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="invite__body">
                <p className="type-body">
                  We are looking for people with a real operational problem worth
                  solving, a team that can be held to a standard, and the patience
                  to build something that lasts longer than a launch.
                </p>
                <div className="invite__actions">
                  <Link href="/partnership/" className="btn btn-ink">
                    Start a conversation <span className="arrow" aria-hidden="true">&rarr;</span>
                  </Link>
                  <p className="invite__email">
                    Or write to{" "}
                    <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
