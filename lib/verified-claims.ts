/**
 * Verified-claim registry.
 *
 * The credential guard must check ATTRIBUTION, not vocabulary. Banning words
 * like "certified" or "CEO" is not attribution checking: it blocks legitimate
 * copy, and it still would not catch a real misattribution if the wording
 * differed.
 *
 * So instead, any credential or designation published ABOUT a named person
 * must be recorded here with the evidence that supports it. The guard then
 * checks whether a specific claim is substantiated, rather than whether a
 * word appears.
 *
 * CURRENTLY EMPTY — and that is the point. A search for the Founder's Lean Six
 * Sigma credential returned at least three different people named Michael
 * Daley: a CFA in finance, a finance executive with M&A and SEC reporting, and
 * an uncorroborated same-name profile carrying a Green Belt. None is
 * verifiably the Founder, so nothing is recorded and nothing is published.
 *
 * To add a claim, record the exact designation, the issuing body, the year, and
 * the evidence reference. Findings live in content/withheld-claims.md, which is
 * internal and never published.
 */

export type VerifiedClaim = {
  /** Person the claim is about, as published. */
  subject: string;
  /** The exact wording that may be published. */
  claim: string;
  /** Issuing body. */
  issuer: string;
  /** Year issued. */
  year: number;
  /** Where the evidence lives (internal reference, not published). */
  evidence: string;
};

/**
 * Empty by design. Nothing has been substantiated yet.
 */
export const VERIFIED_CLAIMS: VerifiedClaim[] = [];

/**
 * Designations that may be published WITHOUT a registry entry, because they
 * describe the role at MAD Ventures rather than an external credential.
 */
export const ROLE_DESCRIPTIONS = ["Founder", "Founder and CEO"] as const;
