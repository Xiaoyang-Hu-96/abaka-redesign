# Abaka AI website redesign

A take-home for the Design Technologist role: a redesign of [abaka.ai](https://abaka.ai), the philosophy behind it, and the system that makes it repeatable.

| What | Where |
| --- | --- |
| Live prototype | [abaka-redesign.vercel.app](https://abaka-redesign.vercel.app) |
| Design files (Paper, view only) | [Paper file](https://app.paper.design/file/01M73V6A4J8CG4FQSMJPHQVVMF/p-7-0) |
| Design philosophy | [`PHILOSOPHY.md`](PHILOSOPHY.md) |
| Process: research, competitors, decisions, next steps | [`PROCESS.md`](PROCESS.md) |
| What I cut | [`PROCESS.md` · What I cut](PROCESS.md#7-what-i-cut) |
| Design system, coded | [`/system`](https://abaka-redesign.vercel.app/system) on the live prototype |
| Sitemap | [`/sitemap`](https://abaka-redesign.vercel.app/sitemap): every page, what was added, merged or removed, and why |
| Hero motion reference | [`prototype/abaka-hero.html`](prototype/abaka-hero.html): open it in a browser |

## What is here

Designed in full:

- **[Homepage](https://abaka-redesign.vercel.app)**, desktop and mobile.
- **[Datasets](https://abaka-redesign.vercel.app/datasets)**: why off the shelf, featured datasets with prices, and the catalog.
- **[Physical AI](https://abaka-redesign.vercel.app/solutions/physical-ai)**: the template for the other solution and service pages.
- **[Talk to an expert](https://abaka-redesign.vercel.app/contact)**: the brief form every primary button leads to.

The rest of the site:

- **Every other page** the site links to exists. Each renders from one shared template with its own content entry: a hero with a drawing, a few cells on the grid, FAQ and a call to action.
- **[`/system`](https://abaka-redesign.vercel.app/system)**: the design system, rendered from the same tokens as the site. Foundations, every component in its states, content patterns, and one line of rationale per part.
- **[`/sitemap`](https://abaka-redesign.vercel.app/sitemap)**: the information architecture as a tree.

Explorations and earlier versions are in the Paper file.

## Stack and why

| Choice | Why |
| --- | --- |
| **Next.js (App Router), TypeScript, static pages** | Every page is content, so nothing needs a server at request time and every route prerenders to HTML. It's the stack most product teams already read. Astro would ship even less JavaScript; I chose the more familiar option for handoff. |
| **Tailwind v4, fed by the design tokens** | The utilities are generated from the token file, so a class like `text-text-secondary` can only be a value the system defines. |
| **Geist, Geist Mono, Outfit** | Self-hosted. Geist for reading, Geist Mono for data, Outfit only for the `abaka · ai` wordmark. |
| **Lucide icons** | A 24px grid with a thin stroke, close to the drawn icons in the design. Imported one by one. |
| **No UI library, no animation library** | The interactions are small: menus, tabs, an accordion, a few canvases. The browser covers them. |
| **Vercel** | Each push to the working branch deploys the live prototype. Page views are counted with Vercel Web Analytics, which sets no cookies, so the site needs no consent banner. |

## How the system works in code

- **One source for every value.** `site/tokens/tokens.json` (W3C design token format) holds colours, type, space, motion and breakpoints, in two layers: primitives that mirror Paper (`color.ink`, `space.4`) and semantic tokens that components use (`color.text.primary`, `color.surface.hover`). One script turns it into CSS variables, Tailwind utilities and a TypeScript module. Change a value there and the site and `/system` change together.
- **The grid is a component.** `Column`, `Row` and `Cell` draw the 1112px column and its 1px lines. Sections never draw their own borders.
- **Menus come from one file.** The header, the mobile menu and the footer all read `site/lib/nav.ts`, so they can't list different things. Mismatched menus were one of the problems in the diagnosis.
- **Copy lives in one file.** `site/lib/content.ts` holds every sentence on the site, so writing and layout change separately.
- **The map can't drift.** If the site links to a page that isn't on `/sitemap`, the build fails.
- **New pages are cheap.** A page without its own design is one content entry rendered by the shared template.

More detail on each part, including every interaction, is in [`site/README.md`](site/README.md).

## Accessibility

- **Focus** is a 2px ink ring outside a 2px gap, shown only for keyboard focus.
- **Keyboard and screen readers:** menus are disclosures with `aria-expanded` and close on Esc. Tabs follow the tabs pattern with arrow keys. The mobile menu is a native dialog that traps focus. Drawings are hidden from screen readers; every headline is real text.
- **Reduced motion:** colour still changes, nothing moves, and animated drawings show a still frame.
- **Touch:** everything that opens on hover also opens on a tap.
- **Contrast** is computed from the tokens on `/system`. Two pairs fall short and are kept on purpose, each with its fix listed: the primary button label (2.78:1) and the orange headline word (2.91:1 at 56px).

## Placeholders and open items

- Values in `[ brackets ]` are facts Abaka doesn't publish yet, such as dataset sizes and formats.
- The customer logos are real wordmarks, but Abaka names no customers publicly, so none is confirmed. Each needs permission before launch (assumption 1 in `PHILOSOPHY.md`).
- Answers Abaka still has to confirm are marked `confirm: true` in `site/lib/content.ts`.
- The contact form and newsletter check what you type but send nothing.

## Run it

```bash
cd site
npm install
npm run dev     # builds the tokens first
npm run build   # prerenders every page
```
