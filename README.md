# MAD Ventures website

Public software-company website for MAD Ventures Holdings LLC.
**We build software that helps companies work better.**

Repository: https://github.com/MADVenturesLLC/MADVenturesSite
Website: https://www.madventuresholdings.com

## Develop

Use Node.js 20.9 or newer and npm. Dependency versions are recorded in
package-lock.json.

```sh
npm ci
npm run dev
```

Open http://localhost:4193. Keep development and production builds from running
simultaneously against the same `.next` cache.

## Verify and preview

```sh
npm run check
npm run start
```

`check` runs type checking, lint, the production build and content verification.
`start` serves the built `out/` directory at http://localhost:4192 and requires
Python 3. This simple file server does not execute Cloudflare redirect rules.
To validate Pages routing locally with Wrangler already available:

```sh
npx wrangler pages dev out
```

Use the URL printed by Wrangler. Test the retired company paths and unknown
paths against the Pages preview before production release.

## Structure

| Path | Responsibility |
| --- | --- |
| app/ | Routes and global styling |
| components/ | Navigation, page compositions, concepts and motion |
| lib/ | Shared site/initiative content and claim registry |
| public/ | Brand assets, robots, sitemap and Pages redirects |
| scripts/verify.mjs | Content and structural regression checks |
| content/ | Internal withheld-claim record; not published assets |

The app exports static HTML into `out/`; it does not require a Node server or
Cloudflare Next.js adapter. Build output, dependencies, secrets and local CLI
state are excluded from Git. Existing routes remain stable even where navigation
uses the label Software instead of Companies.

See AGENTS.md for current content/design instructions and DEPLOYMENT.md for
hosting settings and the release boundary.
