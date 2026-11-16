import type { Metadata } from "next";
import Link from "next/link";
import { Tilt } from "@/components/tilt";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion";
import { PARTNERSHIP_PATHS, SITE } from "@/lib/portfolio";

/*
  The paths heading used to hardcode "Four ways in" while the list held three,
  after the acquisition path was removed. Deriving the count from the data makes
  that class of drift impossible, and scripts/verify.mjs now asserts the
  rendered number matches the array length.
*/
const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six"] as const;
const pathCount = PARTNERSHIP_PATHS.length;
const pathCountWord = NUMBER_WORDS[pathCount] ?? String(pathCount);

export const metadata: Metadata = {
  title: "Partnership",
  description:
    "MAD Ventures welcomes conversations with people and organizations looking to solve meaningful problems through software.",
  alternates: { canonical: "/partnership/" },
};

/**
 * Partnership. Layout follows DESIGN.md: the paths are rows, and the contact
 * block sets the email address large as the page's closing type.
 */
export default function PartnershipPage() {
  return (
    <>
      <section className="page-head">
        <div className="shell">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Partnership</span>
          </nav>

          <h1 className="t-page page-head__title">Build the software with us.</h1>

          <div className="page-head__foot">
            <p className="lead page-head__lead">
              MAD Ventures welcomes conversations with people and organizations looking
              to solve meaningful problems through software.
            </p>
          </div>

          <div className="cut" aria-hidden="true">
            <b />
            <i />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="paths-heading">
        <div className="shell">
          <Reveal>
            <div className="section-intro">
              <p className="label">Partnership paths</p>
              <h2 id="paths-heading" className="t-heading">
                {pathCountWord} ways in.
              </h2>
            </div>
          </Reveal>

          <RevealGroup as="ul" className="rows" stagger={0.07}>
            {PARTNERSHIP_PATHS.map((path) => (
              <RevealItem as="li" key={path.n}>
                <Tilt contentClassName="rows__row" max={2}>
                <span className="mono-num rows__n">{path.n}</span>
                <h3 className="t-row rows__title">{path.title}</h3>
                <p className="prose rows__body">{path.body}</p>
              </Tilt>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="section section--rule" aria-labelledby="contact-heading">
        <div className="shell">
          <div className="split">
            <Reveal>
              <p className="label">Approved channel</p>
              <h2 id="contact-heading" className="t-heading">
                Begin with a clear conversation.
              </h2>
              <p className="prose" style={{ marginTop: "1.5rem" }}>
                Share the context, the software you want to build or improve, and why
                MAD Ventures may be the right partner for it.
              </p>
              <p className="prose">
                If your inquiry is about using one of our software initiatives,
                please contact that team directly. We are not a customer
                support route.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <Tilt max={3} contentClassName="contact-box">
                <p className="label">Contact MAD Ventures</p>
                <a className="contact-box__email" href={`mailto:${SITE.email}`}>
                  {SITE.email}
                </a>
                <a href={`mailto:${SITE.email}`} className="btn btn-primary">
                  Start a conversation <span className="arrow" aria-hidden="true">&rarr;</span>
                </a>
                <p className="contact-box__note">
                  Email is the approved contact channel. There is no form on this site, so
                  nothing you type here is stored or sent anywhere.
                </p>
              </Tilt>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
