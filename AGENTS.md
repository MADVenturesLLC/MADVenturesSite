# MADVenturesSite — website instructions

## Purpose and positioning

This repository, `MADVenturesLLC/MADVenturesSite`, contains the public website for
MAD Ventures Holdings LLC at `https://www.madventuresholdings.com`.

Approved headline: **We build software that helps companies work better.**
Supporting message: software that helps people understand what matters, make
clearer decisions, and move work forward. Do not restore claims about acquiring,
owning or operating companies, providing capital, or building institutions.

## Actual implementation

React, Next.js App Router, TypeScript, Tailwind CSS, and Motion for React.
`next.config.ts` uses `output: "export"` and `trailingSlash: true`; `npm run build`
produces `out/`. No server adapter or Pages Functions are needed for this site.
Do not use `next start` for the static export. See README.md for commands.

## Approved visual direction

Black Concept B: oversized MAD VENTURES wordmark, editorial typography, generous
spacing, restrained cobalt and content-specific interior compositions.
Background #08090B; primary text #F4F1EA; secondary #B7BBC2; accent #146BFF;
separators #282B31. Hanken Grotesk and IBM Plex Mono; use the supplied monograms.
Avoid generic SaaS card grids, decorative glow, gradients and invented metrics.
Preserve keyboard focus, contrast, mobile readability and reduced-motion/static
fallbacks. Essential content must not depend on JavaScript animation.

## Public content

Four initiatives, each **In Development**:
- OperisIQ Social Intelligence: social signals made useful for decisions.
- OperisIQ Financials: personal financial visibility and control.
- IMPLEVRA: operational readiness for regulated, multi-site organizations.
- Avenmark Health: in development; scope being defined. Do not invent its scope.

Stage is not proof of availability. Label conceptual examples clearly, with no
invented functionality, customers, results or real data. Build Room and MadOS
are supporting internal technology initiatives, not public products.
Use American English. Public contact: `Michael@MADVenturesHoldings.com`.
The Founder quote remains withheld, not permanently retired. Do not publish
unsupported credentials. Internal withheld content is never a public asset.

DecivantIQ was sunset on 2026-10-01. Do not recreate its page, links or sitemap
entry. Preserve both permanent retirement redirects in `public/_redirects`.

## Work and verification

Inspect current files before edits. Preserve other contributors' work. Keep
changes scoped; avoid unnecessary dependencies or abstractions.
Run `npm ci` in a fresh checkout and `npm run check` after meaningful changes.
Review all new/untracked files as well as tracked diffs. Source checks do not
prove hosted redirects, 404 status, production performance or live availability.

## Release boundary

Cloudflare Pages project: `madventuresholdings`. Verified on 2026-10-03:
no Git source connection; production branch `main`. Direct uploads publish the
static `out/` artifact. This new repository is not connected automatically.
Do not assume pushing code changes the hosting connection.

Keep the original MADVent checkout and remote intact. No commit, push, merge,
upload, Cloudflare connection/settings change, deployment, DNS mutation, spend
or new provider access without explicit authorization. See DEPLOYMENT.md.
