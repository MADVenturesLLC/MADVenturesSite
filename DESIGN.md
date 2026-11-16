# DESIGN.md — MAD Ventures Holdings website

Every visual decision for the site. The direction is **Futuristic 3D**: a
spatial, non-SaaS experience with a live 3D stage, translucent depth panels,
and cobalt light.

The Founder authorized this direction on 2026-11-15. It supersedes Black
Concept B, including that direction's ban on glow, gradients, shadows, and
translucent panels. Brand colors, typefaces, the wordmark, the copy, and every
truthfulness rule are unchanged. Copy comes only from `COPY.md`.

## 1. The idea

The site is a spatial instrument floating in deep space. A 3D core turns
slowly behind every page. Content sits in front of it on glass panels that
have real depth: a backing, an etched grid, corner ticks, and type that floats
forward. Panels tilt toward the pointer.

The site's first job is still to let a visitor read about the software.
Contact is the second job. The 3D is atmosphere and structure; it never
carries information a visitor needs.

## 2. Color

| Token | Value | Use |
| --- | --- | --- |
| Ground | `#08090B` | The page background and the base of the stage |
| Raised | `#0E1013` | The base of every glass surface |
| Text | `#F4F1EA` | Headings, names, the wordmark, the filled button |
| Secondary | `#B7BBC2` | Body copy |
| Quiet | `#8A9097` | Annotations, notes, breadcrumbs |
| Cobalt | `#146BFF` | Light: glows, the laser cut, stage dots, the key light |
| Cobalt text | `#669FFF` | Cobalt as text, ticks, and thin lines, for legibility |

Derived surfaces:

- **Glass**: Raised at 74% opacity with a 14px backdrop blur. 90% where blur is
  unsupported.
- **Bevel**: cobalt text at 20% opacity (lit edges) and secondary at 12%
  (quiet edges).
- **Glow**: cobalt at 45% opacity, 28px blur.

Rules:

- Gradients, glow, depth shadows, and backdrop blur are allowed and expected.
  They are always cobalt or neutral; no other hue enters the site.
- Text on glass must meet a 4.5:1 contrast ratio. `#8A9097` is the dimmest
  text value. Glass is never lighter than 74% opacity so the stage cannot
  wash out copy.
- Text that sits directly on the stage is protected by a dark scrim on the
  reading side of the page.

## 3. Type

Two families: **Hanken Grotesk** for language, **IBM Plex Mono** for telemetry.
Both are bundled at build time.

| Role | Family, weight | Size | Leading | Tracking |
| --- | --- | --- | --- | --- |
| Wordmark | Hanken 800 | fills the measure | 0.82 | -0.055em |
| Venture title | Hanken 800 | fills the measure, up to 13rem | 0.88 | -0.055em |
| Page title | Hanken 800 | 2.5rem to 5.5rem | 0.96 | -0.045em |
| Module name | Hanken 800 | 1.75rem to 3.25rem | 0.98 | -0.045em |
| Section heading | Hanken 800 | 1.875rem to 3.5rem | 1.02 | -0.035em |
| Row title | Hanken 700 | 1.375rem to 2rem | 1.12 | -0.028em |
| Lead | Hanken 400 | 1.125rem to 1.4375rem | 1.5 | 0 |
| Body | Hanken 400 | 1.0625rem | 1.65 | 0 |
| Note | Hanken 400 | 0.875rem | 1.6 | 0 |
| Telemetry | Plex Mono 400 | 0.75rem to 0.8125rem | 1.5 | 0.02em |

Rules:

- Headings are sentence case and left aligned. Nothing is centered.
- Telemetry is set as written in `COPY.md`: sentence case, never forced to
  capitals. It covers stage labels, the numbers 01 to 04, breadcrumbs, and
  section labels. No telemetry text is invented for decoration.
- The wordmark carries a white-to-ice vertical gradient and a cobalt
  under-glow. No other heading uses gradient text.
- Body lines stay under 75 characters.

## 4. Space and grid

- Page measure: up to 96rem, with gutters of 1.25rem (phone), 2.5rem (tablet),
  4rem (desktop).
- Twelve columns on desktop. The standard split puts a section's heading in
  columns 1 to 5 and its body in columns 7 to 12.
- Section spacing: 4rem to 8.5rem above and below.
- Panel radius is 6px. Buttons and small frames are 2px.

## 5. The stage

`components/stage-3d.tsx`, mounted once in `app/layout.tsx` behind the page.

- **Scene**: a flat-shaded obsidian icosahedron inside an ice-cobalt wireframe
  lattice with lit nodes, inside a larger, fainter cobalt shell. Three tilted
  rings of points orbit it. A sparse far field of points gives the space
  depth. Lighting is a cobalt key light and an ice-cobalt rim light.
- **Placement**: right of center on desktop, above center and smaller on
  phones.
- **Behavior**: it turns slowly, leans toward the pointer, and rotates and
  drifts with scroll progress. It dims once the visitor scrolls below the
  first screen.
- **Static backdrop**: a cobalt radial glow and a perspective floor grid in
  CSS. This is what shows with no JavaScript, before the scene loads, or
  without WebGL.
- **Loading**: three.js is imported on demand and is not in the critical
  bundle. The canvas is hidden from assistive technology and takes no pointer
  events.

## 6. Components

**Spatial panel** (`components/tilt.tsx`). The basic container. Four planes:
glass backing at 0, etched grid at +10px, corner ticks at +22px, content at
+38px, under a 1200px perspective. With a mouse it tilts up to 5 degrees
toward the pointer and a radial spotlight follows the cursor. On hover or
focus the top edge lights cobalt. On touch devices and narrow screens the
planes sit flat.

**Initiative module.** A spatial panel per initiative: number, name, purpose,
then a foot rail with the stage tag and an arrow. The whole panel is the link.
Four modules sit in a two-by-two grid on desktop.

**Stage tag.** A glowing 6px cobalt dot and the stage in mono. It always reads
exactly "In Development".

**Columns and rows.** Parallel items (the three verbs, facts, focus areas,
internal tools) and sequenced items (steps, partnership paths) are each a
spatial panel. Internal tools hang from one lit rail to show they are one
supporting layer.

**Laser cut.** The cobalt bar under each page's opening type, now a lit
gradient with glow. Once per page.

**Buttons.** One filled button per view at most: text color fill with a cobalt
under-glow. Every other action is a text link with a 2px cobalt underline.

**Conceptual figures.** Glass frames with telemetry styling. Each keeps its
"Conceptual example" label and its disclaimer. The readiness record is three
sheets on real Z planes. The method figure's dense field recedes in
perspective, with lit marks glowing. Figures are live page elements, never
images.

**Header.** Sticky, translucent with an 18px blur, and a cobalt laser hairline
along its bottom edge.

**Footer.** Near-opaque glass with a lit top edge.

## 7. Page compositions

**Home.** A near-full-screen hero: the wordmark at full measure over the live
core, the laser cut, the headline at left, and a console panel at right
holding the supporting line and actions. Then the four initiative modules,
the three verbs as planes, the founder block (a glowing outlined initial and a
facts panel), the internal tools on their rail, and the invitation panel.

**Software index.** Page title, count line, lead, laser cut, then taller
initiative modules.

**Initiative page.** The name sized to fill the measure, three fact panels,
the focus list in a panel, the conceptual example, and where to go next.

**What We Do.** The mission as the title, three step panels, Build Room with
its workflow figure, MadOS, and the internal platforms on the rail.

**Approach.** Three stage panels, the method figure, infrastructure, and five
focus-area panels.

**Partnership.** Three path panels and a contact panel with the email set
large.

**Page not found.** The message at page-title size with section links.

## 8. Motion

- The page is complete and readable with no JavaScript, no WebGL, and no
  animation.
- All motion follows one permission (`components/motion-permission.tsx`): it
  is off when the visitor prefers reduced motion or pauses it with the footer
  control.
- With motion off, the stage renders one still frame and ignores the pointer
  and scrolling; panels do not tilt and the spotlight does not follow.
- Tilt never runs for touch input.
- The loop stops while the browser tab is hidden.

## 9. Access and behavior

- Every interactive element has a visible focus ring: 2px cobalt text color.
- Tap targets are at least 44px tall.
- Layout holds from 360px wide. No horizontal scrolling at any width.
- Diagrams carry a text alternative. Decorative planes, the canvas, and marks
  are hidden from assistive technology.

## 10. Never

- Logos, badges, or marks other than the supplied MAD monograms.
- Press mentions, testimonials, customer names, statistics, or any number not
  in `COPY.md`. This includes decorative telemetry: no invented coordinates,
  readouts, or status text.
- Third-party embeds, trackers, widgets, or externally hosted media.
- Illustrations that look like product screenshots.
- A second accent hue.
- Copy that is not in `COPY.md`.

## 11. Review checklist

Check every page, at 1440px and 390px wide.

1. The stage renders behind the page, and the page is still complete with
   JavaScript disabled.
2. Every panel shows its glass, grid, and corner ticks; on desktop it tilts
   toward the pointer.
3. All light is cobalt or neutral. The laser cut appears once per page.
4. Text on glass and on the stage is clearly readable.
5. Telemetry is sentence-case mono, and none of it is invented.
6. Body lines are under 75 characters and nothing is centered.
7. Every word on the page is in `COPY.md`.
8. Nothing overflows or scrolls sideways; tap targets are at least 44px.
9. Focus is visible on every link and button.
10. With reduced motion set or motion paused, the stage is still, panels do
    not tilt, and nothing is hidden or empty.
11. Every conceptual figure keeps its label and disclaimer.
