import Link from "next/link";
import { Reveal, RevealGroup, RevealItem, StatementReveal } from "@/components/motion";
import { Tilt } from "@/components/tilt";
import { INTERNAL_PLATFORMS, SITE, VALUES, VENTURES, ventureHref } from "@/lib/portfolio";

/**
 * Homepage, Futuristic 3D. Layout and styling follow DESIGN.md; every word
 * comes from COPY.md. The live 3D core is mounted once, in app/layout.tsx.
 *
 * Constraints carried over from earlier review:
 *  - ONE ground for the whole page.
 *  - ONE contact invitation, "Start a conversation". The email appears as
 *    plain text, never as a second button.
 *  - Reading about the software comes first, so the filled button in the
 *    masthead leads to the software and the invitation is the text link.
 */
export default function HomePage() {
  return (
    <>
      {/* Masthead. The wordmark is a brand mark, not a heading; the page's
          single h1 is the approved line beneath it. */}
      <section className="masthead" aria-labelledby="home-heading">
        <div className="shell">
          <div className="wordmark-wrap">
            <p className="wordmark" aria-hidden="true">
              <span>MAD</span>
              <span>VENTURES</span>
            </p>
          </div>

          <div className="cut" aria-hidden="true">
            <b />
            <i />
          </div>

          <div className="mast__body">
            <h1 id="home-heading" className="t-page mast__statement">
              <StatementReveal
                text={SITE.hero}
                className="statement-reveal"
              />
            </h1>

            <Reveal delay={0.12} className="mast__side">
              <Tilt className="mast__console" max={4}>
              <p className="lead mast__sub">
                Software that helps people understand what matters, decide clearly,
                and move work forward.
              </p>
              <div className="actions">
                <Link href="/companies/" className="btn btn-primary">
                  See what we&rsquo;re building <span className="arrow" aria-hidden="true">&rarr;</span>
                </Link>
                <Link href="/partnership/" className="text-link">
                  Start a conversation <span className="arrow" aria-hidden="true">&rarr;</span>
                </Link>
              </div>
              </Tilt>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The four initiatives, one spatial module each. */}
      <section className="modules-band" aria-labelledby="initiatives-heading">
        <div className="shell">
          <p className="label" id="initiatives-heading">
            Software initiatives in development
          </p>

          <RevealGroup as="ul" className="modules" stagger={0.06}>
            {VENTURES.map((venture) => (
              <RevealItem as="li" key={venture.slug}>
                <Tilt className="module" contentClassName="module__inner">
                  <span className="module__index">{venture.index}</span>
                  <Link href={ventureHref(venture.slug)} className="module__link">
                    <span className="module__name">{venture.name}</span>
                  </Link>
                  <span className="module__purpose">{venture.purpose}</span>
                  <span className="module__foot">
                    <span className="stage-tag">
                      <span className="stage-tag__dot" aria-hidden="true" />
                      {venture.stage}
                    </span>
                    <span className="module__arrow" aria-hidden="true">&rarr;</span>
                  </span>
                </Tilt>
              </RevealItem>
            ))}
          </RevealGroup>

          <p className="note modules__note">
            All four are in development and none is available to use today. Each
            states its current stage plainly, including the one whose public
            scope is still being defined.
          </p>
        </div>
      </section>

      {/* The three verbs. */}
      <section className="section section--rule" aria-labelledby="values-heading">
        <div className="shell">
          <Reveal>
            <h2 id="values-heading" className="t-heading values__title">
              Software is only useful when it changes what someone does next.
            </h2>
          </Reveal>

          <RevealGroup as="ul" className="cols cols--3" stagger={0.1}>
            {VALUES.map((value) => (
              <RevealItem as="li" key={value.n}>
                <Tilt contentClassName="cols__item">
                <h3 className="verb__title">
                  {value.title} <span className="verb__lead">{value.lead}</span>
                </h3>
                <p>{value.body}</p>
                </Tilt>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Founder. Short. No attributed quote is published while the approved
          one conflicts with the current positioning. See
          content/withheld-claims.md. */}
      <section id="about" className="section section--rule" aria-labelledby="founder-heading">
        <div className="shell">
          <div className="split">
            <Reveal>
              <h2 id="founder-heading" className="visually-hidden">
                Founder
              </h2>
              <p className="founder__monogram" aria-hidden="true">M</p>
              <p className="founder__name">Michael Daley</p>
              <p className="label founder__role">
                Founder &middot; MAD Ventures Holdings LLC
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <h3 className="t-heading founder__statement">
                Built by someone who has had to solve these problems with a team.
              </h3>

              <Tilt className="founder__panel" max={3}>
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
              </Tilt>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Supporting technology. Subordinate and clearly internal. */}
      <section className="section section--rule" aria-labelledby="tech-heading">
        <div className="shell">
          <Reveal>
            <div className="section-intro">
              <h2 id="tech-heading" className="t-heading">
                The internal tools behind our own work.
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="cols cols--3 arch">
              {INTERNAL_PLATFORMS.map((platform) => (
                <Tilt key={platform.name} contentClassName="cols__item">
                  <p className="label">Internal initiative</p>
                  <h3 className="cols__title">{platform.name}</h3>
                  <p>{platform.body}</p>
                </Tilt>
              ))}
            </div>
            <p className="note below-split">
              Internal tools for our own work. They are not venture
              initiatives, and nothing about their current state is presented as a
              product or a customer-facing capability.
            </p>
          </Reveal>
        </div>
      </section>

      {/* The invitation. One CTA intent. */}
      <section className="section section--rule" aria-labelledby="invite-heading">
        <div className="shell">
          <div className="split">
            <Reveal>
              <h2 id="invite-heading" className="t-heading">
                Have a problem software could help solve?
              </h2>
            </Reveal>

            <Reveal delay={0.08}>
              <Tilt max={3} contentClassName="invite__body">
                <p className="lead">
                  We are looking for people with a real operational problem worth
                  solving, a team that can be held to a standard, and the patience
                  to build something that lasts longer than a launch.
                </p>
                <div className="actions">
                  <Link href="/partnership/" className="btn btn-primary">
                    Start a conversation <span className="arrow" aria-hidden="true">&rarr;</span>
                  </Link>
                  <p className="invite__email">
                    Or write to{" "}
                    <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                  </p>
                </div>
              </Tilt>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
