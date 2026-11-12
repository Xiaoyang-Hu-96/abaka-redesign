# Abaka AI website redesign

A take-home for the Design Technologist role: a redesign of [abaka.ai](https://abaka.ai), the philosophy behind it, and the system that makes it repeatable.

| What | Where |
| --- | --- |
| Live prototype | [abaka-redesign.vercel.app](https://abaka-redesign.vercel.app) |
| Design files (Paper, view only) | [Paper file](https://app.paper.design/file/01M73V6A4J8CG4FQSMJPHQVVMF/p-7-0) |
| Design philosophy | [`PHILOSOPHY.md`](PHILOSOPHY.md) |
| Process: research, competitors, decisions, next steps | [`PROCESS.md`](PROCESS.md) |
| Design system, coded | [`/system`](https://abaka-redesign.vercel.app/system) on the live prototype · source in [`site/`](site) |
| Sitemap | [`/sitemap`](https://abaka-redesign.vercel.app/sitemap): every page, what was added, merged or removed, and why |
| Code and technical notes | [`site/README.md`](site/README.md) |
| Hero motion reference | [`prototype/abaka-hero.html`](prototype/abaka-hero.html): open it in a browser |

## What is coded

Designed in full:

- **Homepage**, desktop and mobile.
- **`/datasets`**: why off the shelf, featured datasets with prices, and the catalog.
- **`/solutions/physical-ai`**: the template for the other solution and service pages.
- **`/contact`**: the brief form every primary button leads to.

The rest of the site:

- **Every other page** the site links to renders from one shared template (`site/components/page/TemplatePage.tsx`) with its own content entry: hero, a bento of cells, FAQ and call to action.
- **`/system`**: tokens, contrast, type, space, motion, buttons and content patterns, all rendered from `site/tokens/tokens.json`.
- **`/sitemap`**: the information architecture as a tree.

Design explorations, navigation states and interaction states are in the Paper file.

## Run it

```bash
cd site
npm install
npm run dev
```

Values in `[ brackets ]` are placeholders for facts Abaka does not publish. The customer logos are real wordmarks, but Abaka names no customers publicly, so none is confirmed (see assumption 1 in `PHILOSOPHY.md`).
