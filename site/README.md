# Abaka AI · redesign prototype

Coded part of the Abaka AI website redesign take-home. It covers the homepage (desktop and mobile), the
Datasets catalog, the Physical AI page, the Contact page, a coded design system at `/system` and the sitemap at `/sitemap`
(every page as a tree, what was added, merged or removed, and why the three key pages; one sentence per
unbuilt page is below). The full design lives in Paper. The philosophy
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
| **Geist, Geist Mono, Outfit** | Self-hosted with `next/font`. Geist for reading, Geist Mono for data, Outfit only for the `abaka · ai` wordmark in the header. |
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
  contact/             Talk to an expert: the brief form every primary button leads to
  system/              coded design system, rendered from the tokens
  sitemap/             information architecture; content in lib/sitemap.ts. The build fails if a linked page is missing
components/ui/         primitives: Button, TextLink, Column/Row/Cell/SectionHeader, Logo, Illustration
components/site/       Header (+ NavPanel), AnnouncementBar, Footer, NewsletterField
components/home/       homepage sections and the hero canvas
lib/nav.ts             navigation data, shared by header, mobile menu and footer
lib/content.ts         all site copy, grouped by section; placeholders flagged
public/illustrations/  SVGs exported from Paper, inlined at build time
```

**The grid is a component.** `Column`, `Row` and `Cell` draw the 1112px column with 1px lines. On mobile the
column insets 16px and rows stack. Section code never draws its own borders.

**Nav data is shared.** The desktop dropdowns, the mobile menu and the footer all read `lib/nav.ts`, so they
cannot list different products. Inconsistent menus were one of the problems in the diagnosis.

## Interaction and accessibility

- **States** follow the Paper board "Design system · interaction states v4 (hover = tint, selected = white)".
  Three speeds (fast 120, base 200, slow 320ms) on one curve, `cubic-bezier(.2,0,0,1)`; any transition that
  names neither falls back to base on that curve (`default.*` tokens).
  - Primary button: on hover the orange stays and gains a white sheen; pressed shrinks to 99% in 50ms.
  - Secondary button: on hover it fills ink; pressed goes black and sinks 1px.
  - Surfaces follow one rule. Hover is a light orange tint (`color.surface.hover`, accent at 4%) on any
    surface, canvas or white. Selected or open is white (`color.surface.selected`): the open tab, the open FAQ
    row, the open menu. White never means hover.
  - Link cells: on hover the cell tints, and the arrow moves 4px and turns orange.
  - Quiet links (`components/ui/quiet-link.ts`, Paper "link hover v5"): links in lists and menus (header nav,
    footer columns, bottom bar and social links, Three ways rows) are ink-72 and turn orange on hover, colour only; an arrow
    turns orange and moves 4px. No underline, no tint. TextLinks (`Explore Forge →`) follow the same colour rule but
    rest at ink and medium weight, so they still read as actions.
- **Focus** is a 2px ink ring outside a 2px gap, only on `:focus-visible`.
- **Header** sticks to the top while the page scrolls; `scroll-padding-top` on `<html>` keeps anchors clear of it.
  It follows the disclosure pattern.
  - Each menu button has `aria-expanded`.
  - Esc closes the panel.
  - Panels open after 80ms and close after 200ms, so moving the pointer across the menu does not flash them.
  - All five panels share one canvas shell. Moving between menus keeps the shell open: the contents cross-fade
    (200ms) and its height eases to the new panel (320ms). Closed panels are `inert`.
- **Mobile menu** is a native `<dialog>`, so the browser traps focus. Its sections are `<details>`.
- **Four layers** (`StackSection.tsx`): 03 Annotate is active at rest. Hovering a row or its layer makes it
  active: orange row, that layer drawn on top, the others at 35%, the frame_118 thread kept at 100%, and a callout
  on a leader line from the layer's right corner. Switching waits 120ms; leaving the section returns to rest;
  focus does what hover does. The drawing is the Paper stack split into one group per layer (`stack-drawing.tsx`).
- **Solutions** (desktop) is an accordion (`SolutionsAccordion.tsx`). One panel is open at 638px, the others
  are 200px strips with a vertical title. Hovering a strip opens it after 80ms, so a pointer sweeping across
  doesn't flash every panel. Leaving the row keeps the last one open, and focus opens a panel too. Only
  `flex-grow` animates (320ms ease-out). The open text is laid out at full width from the start, so it never
  reflows mid-animation; it fades in once the width has mostly settled. Below 1024px it is a plain list.
- **FAQ** (`FaqList.tsx`): any number of answers can be open at once. Opening grows the row's height over 300ms (ease-out) and
  the rows below slide down; closing takes 120ms. Closed rows tint on hover; the open row stays white (no tint), only its × darkens. The height animates through `grid-template-rows` 0fr → 1fr, so
  nothing is measured. Each question is a button with `aria-expanded`; closed answers are `inert`. Instant with
  reduced motion.
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

`components/home/hero-engine.ts` is ported from `../prototype/abaka-hero-fit.html`, the final hero. The drawing,
the timing, the boxes fitted to each sample (a passage, the lemon, a span of audio, the bird in one video frame)
and the pointer pick are kept as they were: hovering a sample puts it under review. Changes:

- Token colours instead of the prototype's warm palette.
- Scanlines instead of dashes: every sample is drawn one thin line per row, with ragged ends for the
  silhouette and a few short heavy bars on the shadow side (`scan()` in the engine). Text keeps one line
  per text line so it still reads as text. See `../prototype/lemon-compare.html` for the before and after.
- A 2×2 compact layout below 1024px, with no pointer pick.
- Explicit start and stop. With reduced motion there is no loop; the hero redraws once when the pointer moves.

## Solutions scenes

`components/home/solutions-engine.ts` animates the four Solutions panels in the same scanlines. Each is a full
634×360 scene with an orange box on what a person would label, as in the hero:

- **Physical AI**: a robot arm carries the lemon across the table, watched by a camera. The lemon's box
  tracks it frame by frame; the joints carry keypoints.
- **Agents**: a cursor fills in a form and submits it. Each action is boxed and named (type, click), and the
  cursor's path stays on screen as a trail of dots.
- **Voice and audio**: a microphone between two waveforms. The speakers take turns, the wave travels outward
  from the microphone, and whoever is speaking is boxed (speaker_a, speaker_b).
- **LLM post-training**: a reasoning tree. A prompt branches into three paths that grow one step at a time, each
  ending in an answer. An expert check marks one correct; the other two are crossed out and fade. The winner
  changes every loop. It is a graph on purpose, so it doesn't look like the Agents browser window.

Only the open panel plays, and only while on screen. Collapsed strips hold a still frame of the middle of the
scene, without the orange marks (they would show cut in half). Static parts (table, camera, back window,
microphone) are drawn once to an offscreen canvas; only moving parts are scanned per frame, which holds 60fps.
With reduced motion each panel draws one still frame.

## Scanline SVGs

The CTA pair and the footer wordmark are static SVGs in the same line language. `npm run scanlines`
(`scripts/scanline-svg.mjs`) rebuilds them:

- **The CTA pair**, from the dash originals in `scripts/illustration-src/`. The raw cloud is rasterised into a
  silhouette and scanned. The labelled table keeps exact, unjittered rows, since structure is the point; its
  labels are heavy orange bars.
  On the page they are drawn on canvas (`components/ui/ScanArt.tsx`), each with its own motion. The raw
  cloud's rows slide and fade on their own rhythms, and now and then one glitches sideways. The labelled
  table and its orange box stay still; the labels inside the box appear one by one, hold, fade and start
  again (7s loop).
  Both pause off screen and stay still with reduced motion.
- **The wordmark**: a mask of "Abaka" in Inter Bold, scanned at 6px. It doesn't depend on Inter being loaded.
  About 30% sits below the footer edge. The footer draws it on a canvas (`components/site/WordmarkCanvas.tsx`,
  fed the SVG's segments at build time): moving the pointer over it shakes the nearby rows sideways like an unsteady scan,
  each on its own rhythm, with flickering ends. The shake is fed by movement and decays on its own (150ms
  half-life), so it settles as soon as the pointer stops, even on the letters. The loop only
  runs while it moves. Nothing moves with reduced motion.

## Content and placeholders

- `lib/content.ts` holds every sentence on the site, grouped by where it appears (site shell, homepage sections
  top to bottom, datasets page, header menus). Components hold layout only. Headings with an orange part are
  `{ before, em, after }`. Exceptions: navigation labels live in `lib/nav.ts`, shared by header, mobile menu and
  footer; canvas drawings keep their own sample labels; aria-labels stay with their markup.

- Dataset names, service descriptions and trust claims come from abaka.ai and the design.
- Not public, and shown in `[ brackets ]`: dataset sizes, formats, licences, prices and social links.
- Customer logos are real wordmarks (Wikimedia Commons, in `public/logos/`, drawn as one-colour masks), but
  Abaka names no customers publicly, so none is confirmed. Each needs permission before launch; see
  assumption 1 in `../PHILOSOPHY.md`.

## Remaining pages, one sentence each

These now render from one shared template (`components/page/TemplatePage.tsx`, content in `templatePages` in
`lib/content.ts`): hero with a drawing, a bento of 3–5 cells, FAQ and CTA; index pages link to their children;
light pages have one short block. `/datasets/request` redirects to the contact form with Datasets picked.

The tree at `/sitemap` shows where each page sits. This is how the system builds the ones not designed in full.

**Datasets**

- `/datasets` Datasets catalog: Top-level now. Seven category tabs; each dataset has size, format and licence next to its name, and Request fills in the contact form.
- `/datasets/request` Request a dataset: For data the catalog doesn't have: the Contact form with the need set to Data collection and one field for what's missing.

**Services**

- `/services` Services: Four service cells, built like Three ways on the homepage: illustration, two lines, one quiet link each.
- `/services/annotation` Annotation: The Physical AI template: the claim, a real labelled sample beside it, the review steps, unit prices, one Talk to an expert button.
- `/services/data-collection` Data collection: Same template; the sample is a capture session with its country and device split.
- `/services/model-evaluation` Model evaluation: Same template; the sample is one scored model answer with the rubric next to it.
- `/services/rl-environments` RL environments: Same template; the sample is a replica app with an agent's actions boxed and named, as in the Agents scene.

**Platform**

- `/platform` Abaka Forge: The homepage Forge tour at full width, one section per feature, with Try Forge as the only primary button.
- `/platform/try` Try Forge: Self-serve sign-up: one short form in the Contact form's fields and states, work email first.

**Solutions**

- `/solutions` Solutions: The homepage Solutions accordion, plus one sentence and one link per kind of model.
- `/solutions/physical-ai` Physical AI: The template the other solution and service pages copy: task, scene and country split of the data, a labelled frame, prices.
- `/solutions/agents` Agents: Browser recordings and real-world tasks; the sample is one recorded session with each action named.
- `/solutions/voice` Voice and audio: Full-duplex conversations, multilingual TTS and ASR; the sample is a two-speaker clip with the turns boxed.
- `/solutions/llm` LLM post-training: RLHF, reasoning and coding data; the sample is one prompt with the answers an expert ranked.

**Company**

- `/company` About Abaka: Who runs Abaka and how the work is done, as a section header and rows of cells.
- `/company/why` Why Abaka: Self-funded, independent, confidential: the four commitments as numbered rows, each with what it means for your data.
- `/careers` Careers: Open roles from the existing job board, one quiet-link row per role.
- `/blog` Blog: Posts as rows: title, then date and topic in a mono label.
- `/news` News: The same rows as Blog.
- `/events` Events: The same rows, with date and city first.

**Outside the menus**

- `/` Homepage: Says what Abaka is, then one section per way to buy, each pointing to its page.
- `/contact` Talk to an expert: Where every primary button ends. It reads ?dataset= and ?need=, so nobody retypes what they already picked.
- `/sell-your-data` Sell your data: For people with data to sell, reached from the announcement bar: what Abaka buys, how valuation works, one form.
- `/trust` Trust center: SOC 2, ISO 27001, GDPR and how data is handled, each claim next to its certificate or policy.
- `/privacy` Privacy Policy: Plain text in one narrow column, linked from the footer's bottom row.
- `/terms` Terms of Service: Same as Privacy.
- `/system` Design system: The coded design system. For the team, not linked from the public menus.
- `/sitemap` Sitemap: This page. For the team, not linked from the public menus.

## Who goes where

- **Buyer who wants ready-made data:** Datasets → Category tab → Request → Contact, dataset filled in
- **Buyer who needs data made:** Services or Solutions → Talk to an expert → Contact
- **Team that wants to label it themselves:** Try Forge, in the header → Try Forge sign-up
- **Someone with data to sell:** Announcement bar → Sell your data
- **Security or procurement reviewer:** Footer → Trust center → Why Abaka

## Trade-offs and what I cut

- **Illustrations are inlined SVG exported from Paper, not rebuilt as components.** Faster, and the art stays
  exactly as designed. The cost: the lines inside an illustration can't darken on hover yet.
- **Links to pages that aren't built** (services, platform, solutions, contact…) open a Coming soon page
  (`app/(site)/[...slug]`). The list is every internal link found in `lib/nav.ts` and `lib/content.ts`
  minus the built pages (`lib/routes.ts`), so a new link is covered automatically and any other URL is a real 404.
- **Four pages coded:** the homepage, Datasets, Contact and Physical AI (`/solutions/physical-ai`, the template
  for the other solution and service pages). The
  `/datasets` page is the "page I didn't design" exercise: it was built from the system without a Paper mock first.
- **Not done:**
  - No real forms: the newsletter field validates but sends nothing.
  - No CMS.
  - No analytics.

## Checked

- `npm run build` (all routes static) and `npm run lint`: both pass.
- Desktop 1440 and mobile 375 compared section by section against the Paper "final" page.
- Keyboard: header menus open, close and close on Esc; the mobile menu dialog opens and closes.
- Not yet run: Lighthouse and an automated axe audit.
