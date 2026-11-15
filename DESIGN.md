# DESIGN.md — MAD Ventures Holdings website

Every visual decision for the site. The direction is **Black Concept B**, which
the repository's `AGENTS.md` fixes: an oversized MAD VENTURES wordmark,
editorial typography, generous spacing, restrained cobalt, and interior pages
composed around their own content.

Sections 1 to 3 restate what `AGENTS.md` already fixes. Everything after that
was decided on 2026-11-15 to make the direction specific enough to build and
review against. Copy comes only from `COPY.md`.

## 1. The idea

The site is a printed register set on black stock. Type does the work that
pictures and boxes usually do: the wordmark fills the page, the four
initiatives are a list of names set large enough to read as the page's main
event, and each interior page opens with its own title at near-wordmark scale.

One thing is loud on each page, and it is always type. Everything else is
quiet: hairlines, small monospaced annotations, and one short cobalt bar.

The site's first job is to let a visitor read about the software. Contact is
the second job. Emphasis follows that order.

## 2. Color

| Token | Value | Use |
| --- | --- | --- |
| Ground | `#08090B` | The page background, everywhere |
| Raised | `#0E1013` | The footer and the surface of a conceptual example. Never a card |
| Text | `#F4F1EA` | Headings, names, the wordmark, the filled button |
| Secondary | `#B7BBC2` | Body copy |
| Quiet | `#8A9097` | Annotations, notes, breadcrumbs |
| Separator | `#282B31` | Hairlines |
| Cobalt | `#146BFF` | The cut bar, the stage dot, the hover bar, focus |
| Cobalt text | `#669FFF` | Cobalt when it is text or a thin line on the ground, for legibility |

Rules:

- Cobalt is punctuation: the cut, stage dots, 2px link underlines, and small
  marks inside a conceptual figure. It never fills an area larger than the cut
  bar, and it never colors a heading, a button, or a background.
- One ground for the whole site. Sections are separated by space and a
  hairline, not by alternating background tones.
- No gradients, no glow, no drop shadows, no translucent overlays.
- Body copy on the ground must meet a 4.5:1 contrast ratio; `#8A9097` is the
  dimmest value allowed for text.

## 3. Type

Two families, both already in the brand: **Hanken Grotesk** for everything
read as language, **IBM Plex Mono** for annotation.

| Role | Family, weight | Size | Leading | Tracking |
| --- | --- | --- | --- | --- |
| Wordmark | Hanken 800 | fills the measure | 0.82 | -0.055em |
| Venture title | Hanken 800 | fills the measure, up to 13rem | 0.88 | -0.055em |
| Page title | Hanken 800 | 2.5rem to 5.5rem | 0.96 | -0.045em |
| Register name | Hanken 800 | 1.75rem to 4rem | 1.0 | -0.045em |
| Section heading | Hanken 800 | 1.875rem to 3.5rem | 1.02 | -0.035em |
| Row title | Hanken 700 | 1.375rem to 2rem | 1.12 | -0.028em |
| Lead | Hanken 400 | 1.125rem to 1.4375rem | 1.5 | 0 |
| Body | Hanken 400 | 1.0625rem | 1.65 | 0 |
| Note | Hanken 400 | 0.875rem | 1.6 | 0 |
| Annotation | Plex Mono 400 | 0.75rem | 1.5 | 0.02em |

Rules:

- Headings are sentence case and left aligned. Nothing is centered.
- Annotations are set as written in `COPY.md`: sentence case, never forced to
  capitals, never letter-spaced wide. Mono is for stage labels, register
  numbers, breadcrumbs, and the label that names a section. It is never used
  for body copy or headings.
- No heading has one word picked out in a different color or weight.
- Body lines stay under 75 characters. Headings wrap in balanced lines.
- Numbers appear only where `COPY.md` carries them and the content really is a
  sequence or a register position.

## 4. Space and grid

- Page measure: up to 96rem, with gutters of 1.25rem (phone), 2.5rem (tablet),
  4rem (desktop).
- Twelve columns on desktop. The standard interior split puts a section's
  heading in columns 1 to 5 and its body in columns 7 to 12.
- Section spacing: 4rem to 8.5rem above and below, scaling with the viewport.
  A hairline closes a section; space alone opens it.
- Corner radius is 2px on buttons and frames. Nothing is rounder.

## 5. Components

**Cut.** A cobalt bar 6px to 11px thick and 150px to 380px long, followed by a
hairline to the right edge. It appears once per page, under the page's opening
type, and nowhere else.

**Register.** The initiative list. Each row is one link across the full
measure: number, name, purpose, stage. Names are set at register-name size.
Rows are separated by hairlines. On hover or focus a cobalt bar grows along the
row's top edge and the arrow moves; nothing lifts or glows.

**Stage tag.** A 6px cobalt dot and the stage in mono. It always reads exactly
"In Development".

**Ruled columns.** Short parallel items (internal tools, facts, focus areas,
the three verbs) sit in columns that share a top hairline. They have no
border, no background, and no padding box. This replaces cards everywhere.

**Rows.** Sequenced items (the three steps, the three partnership paths) run
number, title, body across the measure with hairlines between.

**Buttons.** One filled button per view at most: text color fill, ground-color
text, 2px radius, 3rem tall. Every other action is a text link with a 2px
cobalt underline. The header's contact link is a text link, so the header
never outranks the page.

**Conceptual example.** The only framed object on the site. A 1px separator
frame on the raised surface marks it as an illustration, and its label says
"Conceptual example". Its contents use hairline cells, not filled tiles.

**Header.** Sticky, ground color, hairline beneath. Monogram and name left,
navigation center, contact link right. No blur, no translucency.

**Footer.** Raised surface. Brand and line left, link columns right, motion
control, legal line.

## 6. Page compositions

**Home.** The wordmark at full measure, then the cut. Below it the headline
sits left at page-title size and the supporting line and actions sit right,
bottom aligned. The filled button leads to the software; the contact action is
the text link. Then the register of four initiatives. Then the statement and
three verbs in ruled columns. Then the founder block: an outlined initial, the
name, the statement, and the two facts. Then the internal tools in ruled
columns. Then the invitation.

**Software index.** Page title, lead, the count line, the cut, then the
register with taller rows than on the homepage. A closing split explains that
each product keeps its own name.

**Initiative page.** The initiative's name is the composition: set to fill the
measure the way the wordmark does on the homepage. Under it the lead, then the
three facts (stage, parent company, operating model) as ruled columns. The
current focus follows as a split, then the conceptual example at full measure,
then where to go next.

**What We Do.** The mission sentence as the page title. The three steps as
rows. Build Room as a split, with its workflow drawn at full measure beneath
so every label is readable. MadOS as a split, with the internal platforms in
ruled columns beneath.

**Approach.** Page title and lead. The three stages as rows. The method figure
at full measure: a dense field of marks, a few lit, a chain, one action, with
its four captions aligned beneath the four parts. Then infrastructure as a
split and the focus areas in ruled columns.

**Partnership.** Page title and lead. The three paths as rows. The contact
block sets the email address large as the page's closing type, with the one
filled button beneath it.

**Page not found.** The message at page-title size, left aligned, with the
section links as text links.

## 7. Motion

- The page is complete and readable with no JavaScript and no animation.
- Motion is allowed only where the visitor has not asked for reduced motion,
  and the footer control can pause it.
- The one authored moment is the headline unmasking on the homepage. Reveals on
  scroll stay subtle and never hide content by default.
- Hover and focus changes take 160ms to 220ms and move at most 4px.

## 8. Access and behavior

- Every interactive element has a visible focus ring: 2px cobalt text color,
  3px offset.
- Tap targets are at least 44px tall.
- Layout holds from 360px wide. No horizontal scrolling at any width.
- Diagrams carry a text alternative. Decorative marks are hidden from
  assistive technology.

## 9. Never

- Logos, badges, or marks other than the supplied MAD monograms.
- Press mentions, testimonials, customer names, statistics, or any number not
  in `COPY.md`.
- Third-party embeds, trackers, widgets, or externally hosted media. Fonts are
  bundled at build time.
- Card grids, pills, icons used as decoration, stock imagery, or illustrations
  that look like product screenshots.
- Copy that is not in `COPY.md`.

## 10. Review checklist

Check every page, at 1440px and 390px wide, against this list.

1. The ground is `#08090B` edge to edge, with no tonal bands except the footer.
2. The loudest element on the page is type, and there is only one such element.
3. Cobalt appears only as the cut, stage dots, link underlines, the current
   navigation item, hover or focus states, thin annotation text, and the small
   lit marks inside a conceptual figure. The cut appears exactly once.
4. No cards: nothing has a filled box and a border except a conceptual example.
5. No gradient, glow, or shadow anywhere.
6. Annotations are sentence-case mono; no wide-tracked capitals.
7. Body lines are under 75 characters and nothing is centered.
8. Every word on the page is in `COPY.md`.
9. Nothing overflows or scrolls sideways; tap targets are at least 44px.
10. Focus is visible on every link and button.
11. With reduced motion set, nothing is hidden or empty.
12. No large empty area: every region of a page carries content or deliberate
    space between sections.
