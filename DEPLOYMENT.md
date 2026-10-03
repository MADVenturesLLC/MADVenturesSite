# Cloudflare Pages release setup

Updated 2026-10-03. This is a setup guide, not deployment authorization.

## Repository and current connection

New site repository: `MADVenturesLLC/MADVenturesSite`.
Existing Pages project: `madventuresholdings`.
Domains: `madventuresholdings.com` and `www.madventuresholdings.com`.

Verified via the Cloudflare Pages API on 2026-10-03: the project currently has
no Git source connection (`source: null`), production branch `main`, and saved
build output `.vercel/output`. Publish this release by direct upload of the
verified `out/` artifact; dashboard build settings do not build that upload.
This does not connect the new repository to automatic deployment.

Pre-release canonical production deployment:
`394d515c-3fab-46fb-ad8d-bebddbddf8c0`, with both custom domains listed as aliases.
Retain it for rollback. Michael explicitly authorized publishing the reviewed
site in this conversation on 2026-10-03. Production routing must still be tested.

## Required build settings

| Setting | Value |
| --- | --- |
| Framework preset | Next.js (Static HTML Export) |
| Build command | npm run build |
| Output directory | out |
| Root directory | Repository root (blank) |

Confirm saved settings in Cloudflare; old evidence showed `.vercel/output`.
Do not add next-on-pages or a server adapter. Confirm the CI Node version meets
package.json and run npm ci plus npm run check on the release revision.
Preview branch controls must allow the chosen non-production release branch.
Use the actual deployment URL returned by Cloudflare rather than guessing it.

## Routing requirements

`public/_redirects` is copied to `out/_redirects`:

```text
/companies/decivantiq /companies/ 301
/companies/decivantiq/ /companies/ 301
```

Use plain 301 status codes. Keep `out/404.html` with noindex and no canonical.
Do not add a homepage catch-all. A Python static preview does not process these
rules; use Wrangler Pages locally, then verify on the deployed preview.
Previous builder reports recorded passing local Pages tests; hosted behavior
for this new revision remains unverified until actually tested.

## Release checklist

1. Review the exact commit and all included files, excluding secrets, local CLI
   state, dependencies and generated output. Preserve Michael@MADVenturesHoldings.com.
2. Confirm the intended repository connection, production branch, saved build
   settings and preview branch controls before authorizing any push or upload.
3. Record the actual current production deployment and confirm it is retained
   and eligible for rollback. Do not choose it solely by list ordering. The prior
   site's source has not been located in this repository.
4. With explicit preview authorization, publish a non-production revision; test
   both retired paths (301 to /companies/, then 200), several unknown paths
   (real 404), contact links, all routes, mobile layout and reduced motion.
5. Obtain separate production authorization. Recheck redirects, real 404s,
   contact information and the deployed revision on the custom domains afterward.

The withheld Founder quote and unsubstantiated credentials stay unpublished;
they are optional content, not release blockers. No deployment, Git push, hosting
connection change or DNS action is authorized by this document.
