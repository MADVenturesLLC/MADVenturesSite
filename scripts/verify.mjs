#!/usr/bin/env node
/**
 * MAD Ventures company site — structural, brand, and regression checks.
 *
 * Runs against the Next.js App Router source, not the retired static build.
 * Groups:
 *   1. Required files and the approved brand tokens.
 *   2. Portfolio integrity: four ventures, consistent stages, single source.
 *   3. The retired venture stays out of every shipped surface.
 *   4. North Star framing and subordinate internal technology.
 *   5. Conceptual examples stay labeled and truthful.
 *   6. Truthfulness guards: no forms, no invented data, real contact channel.
 *
 * `npm run build` is the compile check; this is the content contract check.
 * Performance and the hosting redirect are NOT verified here — see the delivery
 * report for what is actually measured.
 */
import { readFileSync, existsSync, readdirSync } from "fs";
import { join, dirname, relative } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

let failed = false;
const fail = (msg) => {
  console.error(`✗ ${msg}`);
  failed = true;
};
const ok = (msg) => console.log(`✓ ${msg}`);

const read = (p) => readFileSync(join(root, p), "utf8");

/**
 * Strip comments before scanning for shipped content.
 *
 * These checks exist to catch content that reaches a visitor. Source comments
 * legitimately name the retired venture, the email, and past motion bugs while
 * explaining them, and must not trip the same checks they justify.
 */
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1 ");
}

/* -- 1. Required files ---------------------------------------------------- */

const required = [
  "package.json",
  "next.config.ts",
  "tsconfig.json",
  "postcss.config.mjs",
  "app/layout.tsx",
  "app/page.tsx",
  "app/globals.css",
  "app/not-found.tsx",
  "app/what-we-do/page.tsx",
  "app/approach/page.tsx",
  "app/partnership/page.tsx",
  "app/companies/page.tsx",
  "app/companies/[venture]/page.tsx",
  "components/site-header.tsx",
  "components/site-footer.tsx",
  "components/motion.tsx",
  "components/motion-permission.tsx",
  "components/concept-example.tsx",
  "lib/portfolio.ts",
  "lib/verified-claims.ts",
  "public/_redirects",
  "public/robots.txt",
  "public/sitemap.xml",
  "public/branding/mad-monogram-titanium.svg",
  "brand/mad-ventures/tokens.json",
  "brand/mad-ventures/tokens.css",
  "AGENTS.md",
  "README.md",
];

for (const file of required) {
  if (!existsSync(join(root, file))) fail(`missing: ${file}`);
}
ok(`required files present (${required.length} checked)`);

/* -- 2. Brand tokens ------------------------------------------------------ */

try {
  const tokens = JSON.parse(read("brand/mad-ventures/tokens.json"));
  if (tokens.colors?.accent?.toUpperCase() !== "#146BFF") {
    fail(`brand accent must be #146BFF, got ${tokens.colors?.accent}`);
  } else {
    ok("brand accent #146BFF unchanged");
  }

  /*
    The Tailwind theme must not drift from the brand source of truth. The
    ground values checked here are the ones AGENTS.md fixes: the near-black
    canvas and the locked cobalt. The warm paper ground is a design decision
    layered on top and is checked for presence, not for a legacy token.
  */
  const css = read("app/globals.css");
  for (const value of ["#08090b", "#0e1013", "#146bff"]) {
    if (!css.toLowerCase().includes(value)) {
      fail(`app/globals.css does not carry brand value ${value}`);
    }
  }
  if (!/#f4f1ea/i.test(css)) {
    fail("app/globals.css is missing the warm off-white paper ground");
  }

  // Cobalt used as TEXT on the light ground must be a deeper step of the same
  // brand hue, and the reason must be documented next to it.
  const cobaltText = css.match(/--color-cobalt-text:\s*(#[0-9a-f]{6})/i);
  if (!cobaltText) {
    fail("app/globals.css must declare --color-cobalt-text for light grounds");
  } else {
    if (!/cobalt TEXT|legibility|5\.6:1/i.test(css)) {
      fail("--color-cobalt-text is declared without a documented contrast reason");
    }
  }
  ok("Tailwind theme carries the brand grounds, cobalt, and warm paper");
} catch (err) {
  fail(`brand token check failed: ${err.message}`);
}

/* -- 3. Portfolio integrity ----------------------------------------------- */

const portfolioSrc = read("lib/portfolio.ts");

// The public portfolio is four. This is the only place it is stated.
const countMatch = portfolioSrc.match(/VENTURE_COUNT\s*=\s*VENTURES\.length/);
if (!countMatch) fail("VENTURE_COUNT is not derived from VENTURES");

const slugs = [...portfolioSrc.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
if (slugs.length !== 4) fail(`expected 4 venture slugs in lib/portfolio.ts, found ${slugs.length}`);
ok(`portfolio data declares ${slugs.length} ventures`);

const RETIRED = "decivant";

/**
 * Walk everything that actually ships. `migration-reference/` is excluded: it is
 * the preserved pre-migration build and is allowed to record the retirement.
 */
function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules", ".next", "out", "migration-reference"].includes(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

const shipped = walk(root).filter((f) => /\.(tsx?|css|json|xml|txt|md)$/.test(f));
/*
  Working documents: maintained for the team, never published to the site. They
  may legitimately name the retired venture when documenting its retirement.
  This exemption is policed below by asserting none of them reaches `out/`.
*/
const WORKING_DOCS = new Set(["AGENTS.md", "README.md", "CODEX-HANDOFF.md", "DEPLOYMENT.md"]);

for (const file of shipped) {
  const rel = relative(root, file);
  if (WORKING_DOCS.has(rel)) continue;
  if (new RegExp(RETIRED, "i").test(stripComments(readFileSync(file, "utf8")))) {
    fail(`retired venture referenced in shipped file: ${rel}`);
  }
}
if (!existsSync(join(root, "app/companies/decivantiq"))) {
  ok("retired venture absent from every shipped file");

/*
  The working-doc exemption above is only safe if those documents are genuinely
  unpublished. Assert it: if any of them ever appears in the build output, the
  exemption must fail rather than silently allow retired-venture copy onto the
  public site.
*/
{
  const built = walk(join(root, "out")).map((f) => f.split("/").pop());
  const leaked = [...WORKING_DOCS].filter((name) => built.includes(name));
  if (leaked.length) {
    for (const name of leaked) {
      fail(`working document ${name} is present in out/; it is not publishable copy`);
    }
  } else {
    ok("no working document reaches the published build output");
  }
};
} else {
  fail("retired venture route still present");
}

/*
  The redirect must be authored in CLOUDFLARE PAGES syntax, and labeled
  unverified until deployed.

  The `!` force modifier is Netlify-only. Cloudflare Pages ignores a rule that
  carries it, so an earlier `301!` looked authored but would never have fired.
  The guard now rejects any status token that is not a bare 301 or 302, and
  requires the destination to carry the trailing slash our build emits.
*/
const redirects = read("public/_redirects");
const redirectRules = redirects
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith("#"));

for (const form of ["/companies/decivantiq", "/companies/decivantiq/"]) {
  const rule = redirectRules.find((l) => l.startsWith(`${form} `));
  if (!rule) {
    fail(`missing redirect for ${form}`);
    continue;
  }
  const parts = rule.split(/\s+/);
  if (parts.length !== 3) {
    fail(`${form}: expected "<from> <to> <status>", found "${rule}"`);
  }
  if (parts[1] !== "/companies/") {
    fail(`${form}: destination must be /companies/ (trailing slash matches the build), found "${parts[1]}"`);
  }
  if (!/^30[12]$/.test(parts[2])) {
    fail(`${form}: status must be a bare 301 or 302 for Cloudflare Pages, found "${parts[2]}". The "!" modifier is Netlify-only and Pages ignores it.`);
  }
}
if (redirectRules.length !== 2) {
  fail(`_redirects should carry exactly 2 rules, found ${redirectRules.length}`);
}
// A catch-all would suppress out/404.html and create indexable soft-404s.
if (redirectRules.some((l) => l.startsWith("/*"))) {
  fail("_redirects contains a catch-all splat; unknown paths would return 200 and out/404.html would never serve");
}
if (!/UNVERIFIED/i.test(redirects)) {
  fail("_redirects must record that the redirect is unverified until deployed");
}
ok("retired route redirected with Cloudflare Pages syntax (authored; unverified until deployed)");

// Sitemap and robots
const sitemap = read("public/sitemap.xml");
if (new RegExp(RETIRED, "i").test(sitemap)) fail("retired venture present in sitemap.xml");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (locs.length !== slugs.length + 5) {
  fail(`sitemap should list ${slugs.length + 5} public URLs, found ${locs.length}`);
}
for (const loc of locs) {
  if (!loc.startsWith("https://www.madventuresholdings.com/")) {
    fail(`sitemap URL is not absolute on the confirmed domain: ${loc}`);
  }
}
ok(`sitemap lists ${locs.length} public URLs, none retired`);

if (!read("public/robots.txt").includes("Sitemap: https://www.madventuresholdings.com/sitemap.xml")) {
  fail("robots.txt does not reference the absolute sitemap URL");
}
ok("robots.txt references the sitemap");

/* -- 4. Positioning ------------------------------------------------------ */

/*
  The approved positioning:
    hero    "We build software that helps companies work better."
    mission "MAD Ventures develops software that helps people understand what
             matters, make clearer decisions, and move work forward."

  Ventures are presented as software initiatives with truthful development
  stages. Claims about acquiring businesses, operating owned companies,
  providing capital, and building institutions are removed unless the Founder
  explicitly confirms them, so they are guarded here.
*/

const APPROVED_HERO = "we build software that helps companies work better.";

const home = read("app/page.tsx").toLowerCase();
const portfolio = read("lib/portfolio.ts").toLowerCase();
const layout = read("app/layout.tsx").toLowerCase();

// The hero statement itself. The homepage renders SITE.hero rather than a
// duplicated literal, so the guard resolves the data source and checks it
// there. That keeps one positioning string instead of two that can drift.
const heroLiteral = home.match(/text="([^"]+)"\s*classname="statement-reveal"/);
const heroFromData = /text=\{site\.hero\}/.test(home) && /hero:\s*"([^"]+)"/.exec(portfolio);
const hero = heroLiteral || heroFromData;
if (!hero) {
  fail("homepage: opening statement not found");
} else {
  if (hero[1].toLowerCase() !== APPROVED_HERO) {
    fail(`homepage: hero is not the approved line (found: ${hero[1]})`);
  } else {
    ok(`hero is the approved line: ${hero[1]}`);
  }
}

// The positioning sentence must be carried in page metadata.
if (!portfolio.includes("understand what matters")) {
  fail("lib/portfolio.ts: approved positioning sentence missing");
}
// Layout must derive its metadata from SITE.mission rather than carry its own
// stale copy, so the positioning has exactly one source of truth.
if (!/description:\s*site\.mission/.test(layout)) {
  fail("app/layout.tsx: metadata must use SITE.mission as its description");
}
if (/creates, develops, and operates companies/i.test(layout)) {
  fail("app/layout.tsx: still carries the retired positioning sentence");
}
ok("positioning carried in page data and metadata");

/*
  The retired company-framing must not survive anywhere a visitor or a crawler
  can read it: the site-wide title, Open Graph and Twitter cards, public
  headings, and page metadata.

  NOTE: the previous guard tested for "creates, develops, and operates" while
  the string actually in app/layout.tsx was "create, develop, and operate". The
  guard therefore passed for many runs while the retired positioning was live
  in every browser tab and social card. The pattern below matches the verb
  forms that are actually used, and the check is proven by injection below.
*/
const RETIRED_FRAMING = [
  /creat\w*, develop\w*,? and operate\w* compan/gi,
  /builds?, owns?,? and operates?\b/gi,
  /companies built to endure/gi,
  /operates these companies/gi,
  /public portfolio compan/gi,
  /portfolio compan/gi,
  /portfolio products?\b/gi,
  /companies we own\b/gi,
  /business acquisition conversations/gi,
  /strategic investments?\b/gi,
  /selective (capital|positions)/gi,
  /recurring revenue|deep moats?/gi,
];

/* The patterns above are found in JSX, where a phrase can wrap across lines.
   Compare against whitespace-collapsed source so a re-wrap cannot smuggle a
   retired phrase past the guard. Comments are stripped first: a maintainer
   note that quotes a removed string verbatim is documentation, not published
   copy, and should not force the useful explanation to be deleted. */
const collapsed = (src) => stripComments(src).replace(/\s+/g, " ");

const framingHits = [];
for (const file of [
  "app/page.tsx",
  "app/layout.tsx",
  "app/what-we-do/page.tsx",
  "app/approach/page.tsx",
  "app/partnership/page.tsx",
  "app/companies/page.tsx",
  "app/companies/[venture]/page.tsx",
  "lib/portfolio.ts",
  "components/site-footer.tsx",
  "components/site-header.tsx",
]) {
  const src = collapsed(read(file));
  for (const re of RETIRED_FRAMING) {
    re.lastIndex = 0;
    const m = src.match(re);
    if (m) framingHits.push(`${file}: "${m[0].trim()}"`);
  }
}
if (framingHits.length) {
  for (const hit of framingHits) fail(`retired company framing still published — ${hit}`);
} else {
  ok("retired create/develop/operate framing absent from headings, metadata, and cards");
}

/*
  The colophon label. Changed from "Software we're developing" to "Software
  initiatives in development" on Founder instruction, 2026-10-02.
  Counted against comment-stripped source so an explanatory note in the file
  cannot register as a second CTA.
*/
const homeFlat = collapsed(read("app/page.tsx")).toLowerCase();

if (!/software initiatives in development/i.test(homeFlat)) {
  fail('homepage: the "Software initiatives in development" colophon label was dropped');
} else {
  ok('initiatives list labeled "Software initiatives in development"');
}

/* -- 6b. Partnership paths ----------------------------------------------- */

/*
  The paths heading once read "Four ways in" above a three-item list, after the
  acquisition path was removed. The count is now derived from the data.

  Matched against comment-stripped source: an explanatory note that quotes the
  old string is documentation, not a regression, and must not trip the guard.
  (The same lesson applies as for the CTA counter.)
*/
{
  const pathsSrc = read("lib/portfolio.ts");
  const block = pathsSrc.slice(pathsSrc.indexOf("export const PARTNERSHIP_PATHS"));
  const pathCount = (block.slice(0, block.indexOf("as const;")).match(/\n    n: "/g) || []).length;

  // Strip comments first, so prose in the file cannot register as page copy.
  const pageFlat = collapsed(read("app/partnership/page.tsx"));

  if (!/pathCountWord/.test(pageFlat)) {
    fail("/partnership: the paths count must be derived from PARTNERSHIP_PATHS, not typed");
  } else if (/\b(one|two|three|four|five|six)\s+ways in/i.test(pageFlat)) {
    fail("/partnership: a hardcoded path count in the heading; derive it from the data");
  } else {
    ok(`partnership paths: ${pathCount} paths, heading count derived from data`);
  }

  // Ownership / company-building framing must not return.
  for (const re of [/long-term ownership/i, /company-building/i, /operating counterpart/i, /built to hold/i]) {
    if (re.test(pageFlat)) fail(`/partnership: retired ownership or company-building framing — "${re}"`);
  }
  if (!/looking to solve meaningful problems through software/.test(pageFlat)) {
    fail("/partnership: the approved introduction is missing");
  }
  ok("partnership framing is software collaboration, not ownership");
}

/*
  The invitation label. One contact CTA intent on the page: "Start a
  conversation". The email may appear, but never as a second button.
*/
const startCount = (homeFlat.match(/start a conversation/gi) || []).length;
if (startCount < 1) {
  fail('homepage: the primary invitation "Start a conversation" is missing');
} else if (startCount > 2) {
  fail(`homepage: "Start a conversation" appears ${startCount} times; keep one invitation`);
} else {
  ok(`"Start a conversation" is the invitation (${startCount} placements)`);
}
if (/classname="[^"]*btn[^"]*"[^>]*>\s*\{?site\.email/i.test(homeFlat)) {
  fail("homepage: the email is styled as a button; the invitation must be the single CTA");
}
ok("email is plain text, not a second contact button");

/*
  Removed claims. These must not appear in shipped page copy. They are recorded
  in content/withheld-claims.md, which is deliberately excluded from this scan.
*/
const REMOVED = [
  { re: /acquir(e|es|ed|ing|ing)/, label: "acquiring businesses" },
  { re: /\bcapital\b/, label: "providing capital" },
  { re: /\binstitutions?\b/, label: "building institutions" },
  { re: /not a fund/, label: "'not a fund' exclusion" },
  { re: /not a capital provider/, label: "'not a capital provider' exclusion" },
  { re: /shareholder/, label: "shareholder framing" },
  { re: /hold(s|ing)? (the )?compan(y|ies) (we|that) (own|built|acquir)/, label: "operating owned companies" },
  { re: /what it owns/, label: "owning companies" },
  { re: /most companies fail/, label: "unsupported broad assertion" },
];

const SHIPPED = [
  ["app/page.tsx", "homepage"],
  ["app/layout.tsx", "layout metadata"],
  ["app/what-we-do/page.tsx", "/what-we-do"],
  ["app/approach/page.tsx", "/approach"],
  ["app/partnership/page.tsx", "/partnership"],
  ["app/companies/page.tsx", "/companies"],
  ["app/companies/[venture]/page.tsx", "company pages"],
  ["lib/portfolio.ts", "portfolio data"],
  ["components/venture-artwork.tsx", "venture artwork"],
  ["components/concept-example.tsx", "concept examples"],
  ["components/site-footer.tsx", "site footer"],
  ["components/site-header.tsx", "site header"],
];

/* -- 6z. American English ------------------------------------------------ */

/*
  Founder instruction, 2026-10-02: public copy and metadata use American
  English. Attributed quotations are excluded and preserved verbatim; the only
  attributed quotation on this project is the withheld Founder quote, which
  lives in content/withheld-claims.md and is deliberately NOT scanned, because
  that file is excluded from SHIPPED for the same reason.

  Run against comment-stripped source so a maintainer note that quotes a
  British spelling does not trip the guard.
*/
const BRITISH_SPELLING =
  /\b(organis\w*|behaviour\w*|centre|summaris\w*|recognis\w*|prioritis\w*|utilis\w*|specialis\w*|judgement|travell\w*|cancelled|modelled|labelled|favour\w*|defence|fulfil\w*|programme|licence\w*|colour\w*|whilst|amongst|grey)\b/i;

{
  const spellingHits = [];
  for (const [file] of SHIPPED) {
    const flat = collapsed(read(file));
    BRITISH_SPELLING.lastIndex = 0;
    const m = flat.match(BRITISH_SPELLING);
    if (m) spellingHits.push(`${file}: "${m[0]}"`);
  }
  if (spellingHits.length) {
    for (const hit of spellingHits) fail(`British spelling in shipped copy - ${hit}`);
  } else {
    ok(`American English across ${SHIPPED.length} shipped files`);
  }
}


/* -- 6a. Site-wide positioning scan --------------------------------------- */

/*
  The Partnership page was found still carrying "long-term ownership" and
  "company-building" after the homepage had been repositioned. This is a
  standing scan so the same conflict cannot survive on a page nobody is
  actively editing.

  The word "owner" is NOT banned: a change can have a named owner, and that is
  work ownership, not company ownership. Only company/asset ownership and
  company-building framing are rejected. "not investment criteria" is a
  disclaimer and is therefore allowed through.
*/
const POSITIONING_CONFLICTS = [
  { re: /long-term ownership/i, why: "company-ownership framing" },
  { re: /company-building|company building/i, why: "company-building framing" },
  { re: /technology compan(?:y|ies)\b/i, why: "technology-company framing" },
  { re: /owner thinking about a transition/i, why: "acquisition framing" },
  { re: /operating counterpart/i, why: "company-operating framing" },
  { re: /built to hold/i, why: "retired partnership headline" },
  { re: /acquir(?:e|ing|isition)\b/i, why: "acquisition framing" },
];

const positioningHits = [];
for (const file of SHIPPED.map(([path]) => path)) {
  const flat = collapsed(read(file));
  for (const { re, why } of POSITIONING_CONFLICTS) {
    re.lastIndex = 0;
    const m = flat.match(re);
    if (m) positioningHits.push(`${file} [${why}]: "${m[0].trim()}"`);
  }
}
if (positioningHits.length) {
  for (const hit of positioningHits) fail(`positioning conflict — ${hit}`);
} else {
  ok(`no ownership, acquisition, or company-building framing in ${SHIPPED.length} shipped files`);
}

for (const [file, label] of SHIPPED) {
  const src = stripComments(read(file)).toLowerCase();
  for (const { re, label: claim } of REMOVED) {
    if (re.test(src)) fail(`${label} (${file}) makes a removed claim: ${claim}`);
  }
}
ok("no removed claims in shipped page copy");

// The withheld Founder quote must not be published while it conflicts.
for (const [file, label] of SHIPPED) {
  if (new RegExp("chase deals", "i").test(read(file))) {
    fail(`${label} (${file}) publishes the withheld Founder quote`);
  }
}
ok("conflicting Founder quote is not published");

// Build Room and MadOS stay subordinate supporting technology.
for (const file of ["app/page.tsx", "app/what-we-do/page.tsx", "app/approach/page.tsx"]) {
  const src = read(file);
  if (/(build room|mados)/i.test(src) && !/internal/i.test(src)) {
    fail(`${file}: Build Room / MadOS mentioned without internal framing`);
  }
}
ok("Build Room and MadOS framed as internal, subordinate");

/* -- 4b. Credential attribution ----------------------------------------- */

/*
  The guard checks ATTRIBUTION, not vocabulary.

  An earlier version banned words like "certified", "certification", "CEO" and
  "Lean Six Sigma" outright. That was wrong twice over: it would block
  legitimate copy, and it still would not catch a real misattribution if the
  wording differed. Banning a word is not the same as checking who a claim is
  about.

  The rule now: any credential or designation published ABOUT a named person
  must be substantiated in lib/verified-claims.ts. That file is intentionally
  empty, because a search returned several different people named Michael
  Daley and none was verifiably the Founder. The registry — not a word list —
  is what makes a credential publishable.

  Findings stay internal in content/withheld-claims.md and are never published.
*/
const registry = read("lib/verified-claims.ts");
const verified = [
  ...[...registry.matchAll(/claim:\s*"([^"]+)"/g)].map((m) => m[1]),
  ...[...registry.matchAll(/\bFounder\b/g)].map(() => "Founder"),
];

/*
  Patterns that attribute a credential or designation to a named person.
  These are ATTRIBUTION shapes, not banned vocabulary: "Michael Daley, CFA"
  attributes; "we are a certified vendor" does not.
*/
const ATTRIBUTIONS = [
  /Michael\s+Daley[^.\n]{0,40}\b(CFA|MBA|certified?|accredited)\b/i,
  /\b(CFA|MBA)\b[^.\n]{0,20}Michael\s+Daley/i,
  /Michael\s+Daley[^.\n]{0,40}\b(green|black|master)\s?belt\b/i,
  /\b(green|black|master)\s?belt\b[^.\n]{0,40}Michael\s+Daley/i,
  /Michael\s+Daley[^.\n]{0,40}\b(lean|six)\s?sigma\b/i,
  /\b(lean|six)\s?sigma\b[^.\n]{0,40}Michael\s+Daley/i,
];

const CRED_SCOPE = [
  ["app/page.tsx", "homepage"],
  ["app/what-we-do/page.tsx", "/what-we-do"],
  ["app/approach/page.tsx", "/approach"],
  ["app/partnership/page.tsx", "/partnership"],
  ["app/companies/page.tsx", "/companies"],
  ["app/companies/[venture]/page.tsx", "company pages"],
  ["lib/portfolio.ts", "portfolio data"],
  ["components/site-footer.tsx", "site footer"],
];

for (const [file, label] of CRED_SCOPE) {
  const src = stripComments(read(file));
  for (const re of ATTRIBUTIONS) {
    if (re.test(src)) {
      const isRegistered = verified.some((v) => re.test(v));
      if (!isRegistered) {
        fail(
          `${label} (${file}) attributes an unverified credential to the Founder. ` +
            `Record it in lib/verified-claims.ts with issuer and year, or remove it.`,
        );
      }
    }
  }
}
ok("no unverified credential is attributed to the Founder");

/*
  The registry itself must never be empty-by-accident: if a claim is added it
  must carry an issuer and an evidence reference, so "we meant to verify it"
  cannot stand in for verification.
*/
for (const m of registry.matchAll(/issuer:\s*"([^"]*)"/g)) {
  if (!m[1].trim()) fail("lib/verified-claims.ts: an entry has no issuer");
}
for (const m of registry.matchAll(/evidence:\s*"([^"]*)"/g)) {
  if (!m[1].trim()) fail("lib/verified-claims.ts: an entry has no evidence reference");
}
ok("credential registry entries carry issuer and evidence");

/* -- 5. Conceptual examples ---------------------------------------------- */

/* -- 5. Conceptual examples ---------------------------------------------- */

const conceptSrc = read("components/concept-example.tsx");
if (!/conceptual/i.test(conceptSrc)) fail("concept component is not labeled conceptual");
if (!/not a screenshot/i.test(conceptSrc)) {
  fail("concept component must state it is not a screenshot");
}
if (/<img/i.test(conceptSrc)) fail("concept example must not be a screenshot image");
if (!/illustrative/i.test(conceptSrc)) {
  fail("concept example must state its figures are illustrative only");
}
ok("conceptual examples are labeled, live elements, and disclaimed");

// Every venture with a concept keeps its truthful stage on the detail route.
const conceptSlugs = [...portfolioSrc.matchAll(/slug: "([^"]+)"[\s\S]{0,1400}?concept:/g)].map(
  (m) => m[1],
);
for (const slug of conceptSlugs) {
  if (!/stage:\s*"In Development"/.test(portfolioSrc)) {
    fail(`${slug}: concept example present but truthful stage missing`);
  }
}
ok(`${conceptSlugs.length} venture(s) carry a labeled conceptual example`);
ok("concept examples paired with truthful development stages");

/* -- 5c. The IMPLEVRA conceptual readiness record ----------------------- */

/*
  Concept A moved to the IMPLEVRA page when the homepage became Concept B. The
  guards follow it: the record must stay labeled as an illustrative concept,
  must be live DOM rather than a screenshot image, and must carry no invented
  figure that could read as a result.
*/
const lead = read("components/concept-example.tsx");
/* JSX wraps, so match against collapsed source. */
const leadFlat = lead.replace(/\s+/g, " ");

if (!/design concept/i.test(leadFlat)) {
  fail("readiness record: the concept is not labeled a design concept");
}
if (!/illustrative/i.test(leadFlat)) {
  fail("readiness record: must state that the record is illustrative");
}
if (!/fictional/i.test(leadFlat)) {
  fail("readiness record: must state that the change is fictional");
}
if (!/not a screenshot/i.test(leadFlat) && !/not a product screenshot/i.test(leadFlat)) {
  fail("readiness record: must state it is not a product screenshot");
}
if (!/represent no measurement|no data, measurement, result, or capability shown here is verified/i.test(leadFlat)) {
  fail("readiness record: must disclaim measurement, metric, and verified capability");
}
if (/<img/i.test(lead)) fail("readiness record: must be live DOM, not a screenshot image");
if (!/rr__sheet--front/.test(lead)) {
  fail("readiness record: the readable front sheet is missing");
}
ok("readiness record is labeled illustrative, live elements, and disclaimed");

// No invented figure may appear in the record. Only numeric-with-units and
// percent/currency patterns are rejected; site names are vocabulary.
const inventedFigure = lead.match(
  /(\d+\s?%|\$\s?\d|\b\d[\d,.]*\s?(patients?|staff|beds|units?|sites?|hours?|days?|x)\b)/gi,
);
if (inventedFigure) {
  fail(`readiness record: possible invented figure in the concept - "${inventedFigure[0]}"`);
} else {
  ok("readiness record contains no invented figure");
}

/*
  IMPLEVRA's published scope is operational readiness: absorbing a change across
  a spread of locations, under regulatory constraint, established and
  demonstrated rather than assumed. It is NOT a workforce-management or
  staffing product, and nothing to that effect has been confirmed by the
  Founder.

  An earlier concept published census, absence, agency cover, shift letters,
  float, ratios, rooms, overtime, leave, and rotas. That vocabulary implies a
  capability the site has never claimed, so it is now blocked. This guard
  fails until the Founder confirms the scope in writing.
*/
const UNCONFIRMED_SCOPE = [
  /\bcensus\b/i,
  /\babsence\b/i,
  /\bagency cover\b/i,
  /\bagency\b/i,
  /\bfloat\b/i,
  /\brotas?\b/i,
  /\bshifts?\b/i,
  /\bstaffing\b/i,
  /\bheadcount\b/i,
  /\bworkforce\b/i,
  /\bovertime\b/i,
  /\bhandover\b/i,
  /\bnurse-to-patient\b/i,
  /\bpatient ratio\b/i,
  /\bspreadsheet\b/i,
];

const scopeHits = [];
{
  const flat = collapsed(read("components/concept-example.tsx"));
  for (const re of UNCONFIRMED_SCOPE) {
    re.lastIndex = 0;
    const m = flat.match(re);
    if (m) scopeHits.push(`concept-example: "${m[0]}"`);
  }
}
if (scopeHits.length) {
  for (const hit of scopeHits) {
    fail(
      `homepage opening: staffing-specific framing is not confirmed by the Founder — ${hit}. ` +
        `Remove it, or record the confirmed scope in lib/portfolio.ts first.`,
    );
  }
} else {
  ok("homepage opening stays inside IMPLEVRA's documented readiness scope");
}

/* -- 5b. 404 hygiene ------------------------------------------------------ */

const notFound = read("app/not-found.tsx");
if (!/index:\s*false|noindex/i.test(notFound)) {
  fail("app/not-found.tsx must be noindex");
}
if (!/canonical:\s*null/.test(notFound)) {
  fail("app/not-found.tsx must not inherit or declare a canonical URL");
}
ok("404 page is noindex with no canonical");

/* -- 6. Truthfulness guards ----------------------------------------------- */

const contact = "Michael@MADVenturesHoldings.com";

for (const file of shipped) {
  if (!file.endsWith(".tsx")) continue;
  const rel = relative(root, file);
  if (rel.startsWith("migration-reference")) continue;
  const src = readFileSync(file, "utf8");
  if (/<form[\s>]/.test(stripComments(src))) {
    fail(`${rel}: a form is present but no submission backend is approved`);
  }
}

if (!portfolioSrc.includes(contact)) {
  fail(`lib/portfolio.ts: approved contact address ${contact} not declared`);
}
for (const file of ["app/page.tsx", "app/partnership/page.tsx", "components/site-footer.tsx"]) {
  const src = read(file);
  if (!src.includes(contact) && !/SITE\.email/.test(src)) {
    fail(`${file}: approved contact channel not used`);
  }
}
ok(`approved email channel wired via SITE.email (${contact}); no forms without a backend`);

// No fabricated metrics, testimonials, or launch promises.
const FORBIDDEN = [
  /\b\d+(\.\d+)?%\s*(growth|increase|uplift|roi|conversion)/i,
  /\btrusted by\b/i,
  /\bcustomers? include\b/i,
  /\b\d{3,}\+?\s*(customers|users|companies|clients)/i,
  /\blaunch(es|ing)? (on|in) \w+ 20\d\d\b/i,
];

/*
  Phrases that only read as claims when asserted. Our stage disclaimers contain
  them inside an explicit negation, which is the correct and required wording.
*/
const NEGATED = /\b(not|never|no|without|does not|do not|is not|are not|cannot)\b/i;

function stripDisclaimers(src) {
  return src
    .replace(/[^.]*\b(?:general availability|production readiness|launch date|committed launch)\b[^.]*\./gi, " ")
    .replace(NEGATED, " ");
}

for (const file of shipped) {
  if (!file.endsWith(".tsx")) continue;
  const rel = relative(root, file);
  if (rel.startsWith("migration-reference")) continue;
  const src = readFileSync(file, "utf8");
  const scannable = stripDisclaimers(stripComments(src));
  for (const re of FORBIDDEN) {
    if (re.test(scannable)) fail(`${rel}: possible fabricated claim matching ${re}`);
  }
}
ok("no fabricated metrics, testimonials, or launch promises detected");

/* -- 7. Motion safety ----------------------------------------------------- */

const motionSrc = read("components/motion.tsx");
const motionCode = stripComments(motionSrc);

// A null-safety trap: useReducedMotion() returns null before it resolves. Any
// `if (reduced)` therefore takes the animated path on first paint, which can
// leave content hidden behind an animation that never runs.
const unsafeChecks = [...motionCode.matchAll(/if \(reduced\)\s*(return|\{)/g)];
if (unsafeChecks.length > 0) {
  fail(`motion.tsx: ${unsafeChecks.length} unsafe \`if (reduced)\` guard(s); use \`reduced !== false\``);
}

// Text must never depend on an animation completing.
if (/y:\s*["']?1\d+0?%/.test(motionCode)) {
  fail("motion.tsx: a text element is translated out of its own box; text must not move to be read");
}
ok("motion is opt-in; no text depends on an animation to become readable");

/* -- Result --------------------------------------------------------------- */

if (failed) {
  console.error("\nverify: FAILED");
  process.exit(1);
}
console.log("\nAll checks passed.");
