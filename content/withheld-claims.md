# Withheld claims

Content that previously appeared on the public site and is **not** published
under the current positioning.

Nothing here has been rewritten. Every original is preserved verbatim below so
it can be restored, amended by the Founder, or retired deliberately.

---

## 1. Founder quote — conflicts with current positioning

**Status:** currently withheld from the public page. **Not rewritten.**
**Permanent retirement has NOT been confirmed** — this is a hold pending the
Founder's decision, not a settled outcome.

A quotation is optional. Founder credibility is built from accurate, approved
experience and an explanation of how that experience informs the software
&mdash; not from this quote.

**Original, verbatim:**

> "We don't chase deals. We build operators, back them with capital and
> infrastructure, and stay long enough to see the companies become institutions."
>
> — Michael Daley · Founder, MAD Ventures Holdings LLC

**Why it is withheld:** it makes two claims the current direction requires us to
remove unless the Founder explicitly confirms them —

- **"back them with capital"** — a claim about providing capital.
- **"see the companies become institutions"** — a claim about building
  institutions.

It is an attributed quote, so rewriting it is not ours to do. It is preserved
here unchanged, and needs a Founder decision:

- **Option A** — retire it permanently, and publish a different approved quote.
- **Option B** — confirm the capital and institution claims, in which case it can
  return to the page as written.
- **Option C** — supply a replacement quote for Founder approval.

**Not blocking.** The Founder section runs as a typographic feature built on
grounded experience, with no quotation. The quote stays archived here verbatim
and unpublished unless the Founder later confirms the capital and institution
claims, or supplies a replacement.

---

## 2. Other removed claims

These were written by us, not attributed, so they were removed outright rather
than preserved. Recorded here so the decision is visible rather than silent.

| Removed claim | Reason |
|---|---|
| "acquires established ones, and operates what it owns" | Acquiring and operating owned businesses |
| "We are not a fund and not a consultancy" | A capital-positioning exclusion |
| "pairing capital with operators who ship" | Capital claim |
| "Acquire — We buy proven businesses…" | Acquiring businesses |
| "Ownership here means product judgment and standards, not just capital" | Capital + ownership framing |
| "A capital partner who will measure a holding company in decades" | Capital-partner framing |
| "Selective capital and venture opportunities" (partnership path) | Capital-partner framing |
| "You would be working with an operator, not a capital provider" | Explicitly removed by Founder instruction |
| "Most companies fail between the idea and the business" | Broad unsupported assertion |

### 2a. Found still live on 2026-10-02, now removed

A positioning sweep for conflicting headings and metadata found two items
that this file already recorded as removed but that were still being published
from `lib/portfolio.ts`. Both contradicted the approved line, "We build
software that helps companies work better."

| Was still published | Where it was | Reason |
|---|---|---|
| "Business acquisition conversations — For owners considering a thoughtful transition and a long-term operating home for a technology business." | `PARTNERSHIP_PATHS` item 01, rendered on `/partnership/` | Reasserted the acquire-and-operate framing this file records as removed. The remaining three partnership paths are software-focused and invents no new offering. |
| "Strategic investments — Selective positions in companies aligned with our thesis." | `FOCUS_AREAS` A6, rendered on `/approach/` | Capital-partner positioning, and near-verbatim the already-removed "Selective capital and venture opportunities". The remaining five focus areas are unchanged in meaning. |

Also removed in the same sweep, as investor language inconsistent with the
approved positioning and unsupported by anything: "recurring revenue and deep
moats" (A2) and "makes every company sharper" (A5), both reworded without
changing what the area is.

**This sweep is now enforced.** `scripts/verify.mjs` fails if any of these
phrases reappear in shipped copy, in page headings, in the site-wide title, or
in the Open Graph and Twitter cards. The check strips comments first, so a
maintainer note quoting a removed string does not trip it.

---

## 3. Founder background language

The Founder section previously said MAD Ventures "was built by someone who spent
a career inside operating organisations rather than alongside them." That is a
generalisation we cannot verify.

It has been replaced with language grounded in approved background: healthcare
operations, Lean Six Sigma, workforce management, capacity planning, operational
readiness, and execution. **No employer is named**, and no endorsement by any
employer is implied.

---

## 4. Credential verification — "Lean Six Sigma" NOT published

A public search for the Founder's Six Sigma credential returned **at least three
different people named Michael Daley**:

| Result | Credential / role | Assessment |
|---|---|---|
| Michael Daley, CFA | ESG Investing certificate, CFA Institute | Different person — finance, not operations |
| Michael Daley | Lean Six Sigma Green Belt ("Bywater") | Same name; no corroboration tying it to MAD Ventures |
| Mike Daley | M&A, technical accounting, SEC reporting | Different person — finance executive |

**Conclusion: unverifiable.** No certification is published.

Publishing "Lean Six Sigma" from this evidence would mean attaching a
same-name stranger's credential to the Founder. That is a false claim about a
real person, so it was not done.

The Founder section instead states experience &mdash; senior management inside
operating organisations, workforce management, capacity planning, and
operational readiness &mdash; and explains how that experience shapes the
product. **No employer is named** and no employer endorsement is implied.

`scripts/verify.mjs` now **fails the build** if any certification or
designation is added to shipped copy (Lean Six Sigma, green/black/master belt,
"certified", "certification", CFA, MBA, CEO) without first being substantiated
with the issuing body and year.

**To publish one**, supply: the exact designation, the issuing body, and the
year.
