# Abaka AI website redesign

A take-home for the Design Technologist role: a redesign of [abaka.ai](https://abaka.ai), the philosophy behind it, and the system that makes it repeatable.

| What | Where |
| --- | --- |
| Live prototype | _link added after deployment_ |
| Design files (Paper, view only) | _link added before submission_ |
| Design philosophy | [`PHILOSOPHY.md`](PHILOSOPHY.md) |
| Design system, coded | `/system` on the live prototype · source in [`site/`](site) |
| Code and technical notes | [`site/README.md`](site/README.md) |
| Hero motion reference | [`prototype/abaka-hero.html`](prototype/abaka-hero.html): open it in a browser |

## What is coded

- **Homepage**, desktop and mobile.
- **`/datasets`**: the catalog, built from the system without a Paper mock first.
- **`/system`**: tokens, contrast, type, space, motion, buttons and content patterns, all rendered from `site/tokens/tokens.json`.

Everything else (sitemap, key pages, navigation states, interaction states) is in the Paper file.

## Run it

```bash
cd site
npm install
npm run dev
```

Values in `[ brackets ]` are placeholders for facts Abaka does not publish. The customer logos are placeholders too.
