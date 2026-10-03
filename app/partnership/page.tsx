import type { Metadata } from "next";
import Link from "next/link";
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

export default function PartnershipPage() {
  return (
    <>
      <section className="page-head">
        <div className="shell page-head__inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Partnership</span>
          </nav>
          <h1 className="display-1 page-head__title">Build the software with us.</h1>
          <p className="lead page-head__lead">
            MAD Ventures welcomes conversations with people and organizations looking
            to solve meaningful problems through software.
          </p>
          <div className="page-head__cut" aria-hidden="true">
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
              <h2 id="paths-heading" className="display-2">
                {pathCountWord} ways in.
              </h2>
            </div>
          </Reveal>

          <RevealGroup as="ul" className="area-list" stagger={0.07}>
            {PARTNERSHIP_PATHS.map((path) => (
              <RevealItem as="li" key={path.n} className="area-row">
                <span className="mono-num area-row__n">{path.n}</span>
                <h2 className="display-3 area-row__title">{path.title}</h2>
                <p className="prose area-row__body">{path.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="contact-heading">
        <div className="shell contact-grid">
          <Reveal>
            <div>
              <p className="label">Approved channel</p>
              <h2 id="contact-heading" className="display-2 mados-title">
                Begin with a clear conversation.
              </h2>
              <p className="prose">
                Share the context, the software you want to build or improve, and why
                MAD Ventures may be the right partner for it.
              </p>
              <p className="prose">
                If your enquiry is about using one of our software initiatives,
                please contact that team directly. We are not a customer
                support route.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="contact-box">
              <p className="label">Contact MAD Ventures</p>
              <a className="contact-box__email" href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
              <a href={`mailto:${SITE.email}`} className="btn btn-primary btn-block">
                Start a conversation <span className="arrow" aria-hidden="true">&rarr;</span>
              </a>
              <p className="contact-box__note">
                Email is the approved contact channel. There is no form on this site, so
                nothing you type here is stored or sent anywhere.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
