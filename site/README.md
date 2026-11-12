# Abaka AI · redesign prototype

Coded part of the Abaka AI website redesign take-home. It covers the homepage (desktop and mobile), the
Datasets catalog and a coded design system at `/system`. The full design lives in Paper. The philosophy
is in `../PHILOSOPHY.md`.

```bash
npm install
npm run dev      # http://localhost:3000, builds tokens first
npm run build    # static export of every page
```

## Stack and why

| Choice | Why |
| --- | --- |
| **Next.js (App Router), TypeScript, static generation** | Every page is content. Nothing needs a server at request time, so every route prerenders to HTML. It is the stack most product teams already read. Astro would ship even less JS; I chose the more familiar option for handoff. |
| **Tailwind v4 fed by design tokens** | The utilities are generated from the token file, so `text-text-secondary` or `bg-surface-raised` can only be a value the system defines. |
| **Lucide icons** | 24px grid, 1.5 stroke, ISC licence. Close to the hand-drawn icons in the design. Imported per icon. |
| **No UI library, no animation library** | The interactions are small: disclosure menus, `<details>`, one canvas. The platform covers them. |

## Design tokens: one source, three outputs

`tokens/tokens.json` is the single source, in W3C DTCG format. It has two layers:

- **Primitives** mirror the Paper file: `color.ink`, `color.accent`, `space.1–9`, `text.*`.
- **Semantic tokens** are what components use: `color.text.primary`, `color.action.primary-bg`, `color.focus.ring`.

`npm run tokens` runs Style Dictionary (`scripts/build-tokens.mjs`) and writes two files:

- `app/tokens.css`: a Tailwind `@theme` block. Each token becomes a CSS variable *and* a utility.
- `lib/tokens.ts`: the same values for JavaScript. The hero canvas draws with these.

Some tokens can't live in Paper (durations, easing, breakpoints, icon stroke), so they exist only in this file.
Generated files are never edited by hand.

## Structure

```
app/(site)/            pages; layout.tsx is the shared shell (announcement, header, footer)
  page.tsx             homepage
  datasets/            catalog
  system/              coded design system, rendered from the tokens
components/ui/         primitives: Button, TextLink, Column/Row/Cell/SectionHeader, Logo, Illustration
components/site/       Header (+ NavPanel), AnnouncementBar, Footer, NewsletterField
components/home/       homepage sections and the hero canvas
lib/nav.ts             navigation data, shared by header, mobile menu and footer
lib/content.ts         typed content; placeholders flagged
public/illustrations/  SVGs exported from Paper, inlined at build time
```

**The grid is a component.** `Column`, `Row` and `Cell` draw the 1240px column with 1px lines. On mobile the
column insets 16px and rows stack. Section code never draws its own borders.

**Nav data is shared.** The desktop dropdowns, the mobile menu and the footer all read `lib/nav.ts`, so they
cannot list different products. Inconsistent menus were one of the problems in the diagnosis.

## Interaction and accessibility

- **States** follow the Paper board "Design system · interaction states v3".
  - Primary button: on hover the orange stays and gains a white sheen; pressed shrinks to 99% in 50ms.
  - Secondary button: on hover it fills ink; pressed goes black and sinks 1px.
  - Link cells: on hover they lift from canvas to white, and the arrow moves 4px and turns orange.
- **Focus** is a 2px ink ring outside a 2px gap, only on `:focus-visible`.
- **Header** follows the disclosure pattern.
  - Each menu button has `aria-expanded`.
  - Esc closes the panel.
  - Panels open after 80ms and close after 200ms, so moving the pointer across the menu does not flash them.
- **Mobile menu** is a native `<dialog>`, so the browser traps focus. Its sections are `<details>`.
- **FAQ** is `<details name="faq">`, so only one answer is open at a time, with no JavaScript.
- **Reduced motion:** colour still changes and nothing moves. The hero draws one still frame and the logo
  marquee stops.
- **Hero canvas**
  - It is `aria-hidden`. The headline is real HTML, so the largest paint is text.
  - It pauses off-screen (IntersectionObserver) and redraws on resize (ResizeObserver).
- **Contrast** is computed at build time on `/system`. Known issues, kept on purpose and listed with their fixes:
  - Primary button label `#F4F4F4` on `#FD5F32`: 2.78:1. Ink on orange would give 6.02:1.
  - Accent headline word on canvas: 2.91:1 at 56px. A text-only `#D9431A` would give 4.18:1.
- **Fixed in code:** mono labels were 4.13:1 (ink at 56%) and failed AA at 12px. `color.text.tertiary` now points
  at ink-64 (5.45:1). The Paper file still uses ink-56.

## Hero animation

`components/home/hero-engine.ts` is ported from `../prototype/abaka-hero.html` with its drawing and timing kept
as they were. Changes:

- Token colours instead of the prototype's warm palette.
- The pointer no longer picks a sample, per the interaction spec.
- A 2×2 compact layout below 1024px.
- Explicit start and stop.

## Content and placeholders

- Dataset names, service descriptions and trust claims come from abaka.ai and the design.
- Not public, and shown in `[ brackets ]`: dataset sizes, formats, licences, prices, FAQ answers, social links
  and customer logos.

## Trade-offs and what I cut

- **Illustrations are inlined SVG exported from Paper, not rebuilt as components.** Faster, and the art stays
  exactly as designed. The cost: the dashes inside an illustration can't darken on hover yet.
- **Stack section:** the layer list is static. Hovering a row does not highlight the matching layer in the
  drawing; that needs the SVG split into one layer per step.
- **Two pages coded.** Physical AI and Contact are designed in Paper only. The `/datasets` page is the "page I
  didn't design" exercise: it was built from the system without a Paper mock first.
- **Not done:**
  - No real forms: the newsletter field validates but sends nothing.
  - No CMS.
  - No analytics.

## Checked

- `npm run build` (all routes static) and `npm run lint`: both pass.
- Desktop 1440 and mobile 375 compared section by section against the Paper "final" page.
- Keyboard: header menus open, close and close on Esc; the mobile menu dialog opens and closes.
- Not yet run: Lighthouse and an automated axe audit.
