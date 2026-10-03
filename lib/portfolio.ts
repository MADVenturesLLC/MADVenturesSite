/**
 * Public portfolio. single source of truth.
 *
 * Every page, diagram, sitemap entry, and verification check reads venture data
 * from here. Nothing about a venture is restated anywhere else in the app, which
 * is what keeps stage labels and routes from drifting apart.
 *
 * Rules encoded in this file:
 *  - The public portfolio is exactly four ventures.
 *  - `stage` is the company's CURRENT PUBLIC STAGE and nothing more. It is not
 *    availability, traction, customers, or a launch date.
 *  - Avenmark Health is deliberately under-specified because its public
 *    category and scope have not been decided. Do not fill the gap.
 *  - DecivantIQ was sunset 2026-10-01 and is intentionally absent.
 */

export type Stage = "In Development";

export type Venture = {
  /** URL segment under /companies. */
  slug: string;
  /** Display name. */
  name: string;
  /** Position in the register, 01-04. Also used in the constellation. */
  index: string;
  /** One-line public purpose, used in registers and the homepage ledger. */
  purpose: string;
  /** Sentence used on the detail page and in metadata. */
  lede: string;
  stage: Stage;
  /** Development focus bullets. Never a feature list or a schedule. */
  focus: string[];
  /** Optional conceptual example. Explicitly labeled; never a screenshot. */
  concept?: {
    /** Label shown in the example header. */
    title: string;
    /** Which layout component renders it. */
    kind: "signal-chain" | "position-grid" | "readiness";
  };
};

export const VENTURES: Venture[] = [
  {
    slug: "operisiq-social-intelligence",
    name: "OperisIQ Social Intelligence",
    index: "01",
    purpose: "Making complex social signals useful for decisions.",
    lede: "An intelligence platform designed to transform complex social signals into actionable insight.",
    stage: "In Development",
    focus: [
      "Turning high-volume, ambiguous social and behavioral signal into something an operator can actually reason with.",
      "Aimed at people who must decide from incomplete, noisy information and need the reasoning to be visible and challengeable rather than a bare score.",
    ],
    concept: {
      title: "How a signal becomes a decision you can check",
      kind: "signal-chain",
    },
  },
  {
    slug: "operisiq-financials",
    name: "OperisIQ Financials",
    index: "02",
    purpose: "Personal financial visibility and control.",
    lede: "A premium financial command center that brings intelligence, clarity, and control to personal finances.",
    stage: "In Development",
    focus: [
      "Giving an individual a single, legible view of their own financial position instead of a scatter of disconnected accounts and statements.",
      "Intended for the person who wants to understand their position and act on it, rather than a business buying accounting software.",
    ],
    concept: {
      title: "A single position view, as one person would want to read it",
      kind: "position-grid",
    },
  },
  {
    slug: "implevra",
    name: "IMPLEVRA",
    index: "03",
    purpose: "Readiness for operational change in regulated, multi-site organizations.",
    lede: "An operational readiness platform for complex, regulated, multi-site organizations.",
    stage: "In Development",
    focus: [
      "Whether an organization is actually ready to absorb a change across a spread of locations under regulatory constraint.",
      "Readiness treated as something to be established and demonstrated rather than assumed, because a change that works at one location can fail at another.",
    ],
    concept: {
      title: "What operational readiness would have to account for",
      kind: "readiness",
    },
  },
  {
    slug: "avenmark-health",
    name: "Avenmark Health",
    index: "04",
    purpose: "A healthcare venture; its public category and scope are still being defined.",
    lede: "A healthcare venture under development, with its public category and product scope still being defined.",
    stage: "In Development",
    focus: [
      "Early. Its public category and product scope are still being defined, so this page describes no services, clinical capability, or customers that have not been decided and verified.",
      "What can be said truthfully today is that MAD Ventures is building a healthcare venture and is working out what it is.",
    ],
  },
];

/** The exact public count. Change this only with an explicit portfolio decision. */
export const VENTURE_COUNT = VENTURES.length;

export function getVenture(slug: string): Venture | undefined {
  return VENTURES.find((v) => v.slug === slug);
}

export function ventureHref(slug: string): string {
  return `/companies/${slug}/`;
}

export const SITE = {
  name: "MAD Ventures Holdings LLC",
  domain: "www.madventuresholdings.com",
  origin: "https://www.madventuresholdings.com",
  /**
    The public contact address.

    Founder instruction, 2026-10-02: preserve the address that is live today,
    Michael@MADVenturesHoldings.com, until the Founder confirms that
    contact@madventuresholdings.com is operational. Publishing an address that
    does not receive mail is worse than publishing an older one.

    Note the casing is exactly as it appears in the live footer. Email local
    parts are technically case-sensitive; most providers are not. Do not
    "tidy" the capitalisation without the Founder saying so.
  */
  email: "Michael@MADVenturesHoldings.com",
  tagline: "Software for the work that matters.",

  /**
   * The short form used in the site-wide default title, Open Graph, and Twitter
   * cards. Derived from the approved hero rather than carrying its own wording,
   * so there is one positioning string rather than three that drift apart.
   */
  pageTitle: "Software that helps companies work better.",

  /**
   * The approved hero line. This is the first thing a visitor reads and the
   * primary metadata description.
   */
  hero: "We build software that helps companies work better.",

  /**
   * The positioning sentence. Carries the homepage, /what-we-do, About, and
   * page metadata. Replaces the previous create/develop/operate-ownership
   * framing.
   */
  mission:
    "MAD Ventures develops software that helps people understand what matters, make clearer decisions, and move work forward.",
};

/**
 * Operating motion. The homepage visual renders this; it is deliberately not a
 * process strip and not an org chart.
 */
export const VALUES = [
  {
    n: "01",
    title: "Understand",
    lead: "what matters",
    body: "Software that turns a large, noisy picture into the few things a person actually needs to see.",
  },
  {
    n: "02",
    title: "Decide",
    lead: "with more clarity",
    body: "Software that makes the reasoning behind a conclusion visible, so it can be checked and challenged.",
  },
  {
    n: "03",
    title: "Move",
    lead: "work forward",
    body: "Software that carries a decision into the next action instead of stopping at the insight.",
  },
] as const;

/**
 * How each venture is developed.
 *
 * The previous operating model (Build / Acquire / Operate / Scale) made claims
 * about acquiring businesses, providing capital, and operating owned companies.
 * Those were removed under the current positioning and are recorded in
 * content/withheld-claims.md rather than silently dropped.
 */
export const DEVELOPMENT_STAGES = [
  {
    n: "01",
    title: "Problem",
    body: "Start from a specific, costly problem someone already has. not from a category we want to exist.",
  },
  {
    n: "02",
    title: "Product",
    body: "Build the smallest thing that genuinely helps, and put it in front of the people who have the problem.",
  },
  {
    n: "03",
    title: "Discipline",
    body: "Earn the right to expand by being useful, measurable, and honest about what is still unproven.",
  },
] as const;

/**
 * Internal supporting technology. NOT products, NOT for sale, and
 * deliberately subordinate to the mission.
 */
export const INTERNAL_PLATFORMS = [
  {
    name: "Build Room",
    body: "Coordinates software-building work: scope and ownership, build, independent review, corrections, and a separate founder decision.",
  },
  {
    name: "MadOS",
    body: "Organizes the company’s work, decisions, and technology so context survives across the software we build.",
  },
] as const;

/**
 * Partnership pathways.
 *
 * The previous "Business acquisition conversations" path was removed. It
 * reasserted the acquire-and-operate framing that the current positioning
 * retires, and content/withheld-claims.md already records that framing as
 * removed. The remaining three are software-focused and consistent with
 * "We build software that helps companies work better."
 */
export const PARTNERSHIP_PATHS = [
  {
    n: "01",
    title: "Strategic enterprise partnerships",
    body: "For organizations exploring focused collaboration with MAD Ventures or one of the software initiatives it is developing.",
  },
  {
    n: "02",
    title: "Operating and product collaboration",
    body: "For founders and senior operators with aligned judgment on consequential software, and the discipline to build beyond the concept.",
  },
  {
    n: "03",
    title: "Product and technology collaboration",
    body: "For teams and organizations that want to build or improve software that solves a real operational problem.",
  },
] as const;

export const FOCUS_AREAS = [
  { n: "A1", title: "AI", body: "Applied intelligence built into real products and operations." },
  { n: "A2", title: "Software", body: "Durable software, built to be depended on day after day." },
  { n: "A3", title: "Healthcare innovation", body: "Technology that raises the standard of care and access." },
  { n: "A4", title: "Digital products", body: "Consumer and prosumer products people return to." },
  { n: "A5", title: "Operational excellence", body: "The shared operating layer that makes the work sharper." },
  /*
    The previous A6 "Strategic investments. Selective positions in companies
    aligned with our thesis" was removed. It is the same capital-partner
    positioning that content/withheld-claims.md records as removed, and it
    contradicted "We build software that helps companies work better."
  */
] as const;
