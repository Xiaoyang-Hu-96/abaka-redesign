# Reliable before impressive

Design philosophy for the abaka.ai redesign · draft 6

Abaka sells data that has to be trusted before it is bought. Today the site spends its effort on presentation: pinned animations, a dark cinematic look, big numbers. It spends far less on saying what Abaka is or proving what it claims. I want the site to look as reliable as the data should be.

## Audience

Most visitors are AI teams who came to buy. They want to find an existing dataset, commission data (collection, annotation, evaluation, RL environments), or run their own work on Forge. Before getting in touch they need to believe three things: the quality is real, the data is safe to use, and Abaka understands their field.

A smaller group has data to sell. The homepage already invites them with a "Get a free valuation" banner. Annotators are not an audience here. I assume they are recruited elsewhere.

## Diagnosis

The newer pages show what works: Physical AI names its audience and shows the real task, scene and country split of its data, and unit prices are public. Across the site, three things don't line up:

- **Claims and evidence.** "99% accuracy" and "50x faster" have no source. "Trusted by leading AI teams" links to a page with no names.
- **The story.** The page title says annotation company, the homepage says "Human Intelligence Data for Frontier AI", and Physical AI says data infrastructure. Header and footer list different products.
- **Effort and content.** The motion is polished, but Datasets, the one thing a visitor can judge alone, is missing from the header and lists 21 names with no size, format, licence or sample.

## Principles

### 1. Evidence sits next to the claim

Every claim shares a screen with a sample, a sourced number or a method. If there is none, the claim goes. This is why there is no separate case studies section.

### 2. One story, one vocabulary

I keep Abaka's headline, "Human Intelligence Data for Frontier AI", and make every title, menu and component agree with it. The homepage says what Abaka is in one paragraph before it shows any product. Menu labels are nouns a buyer would use. This is why "Products" is gone and Datasets is a top-level item.

### 3. Motion explains, never performs

Animation appears only when it shows how something works, and content never waits for it. This is why the scroll-pinned dataset dial becomes a catalog a visitor can scan, and why each moving scene (the hero, the Solutions panels, the raw-to-labelled pair above the last call to action) shows a person labelling the kind of data that section sells. The one exception is the footer wordmark, which shakes under a moving pointer and settles when it stops. It sits below the last action, so nothing waits for it.

### 4. One main action per page

A page has one primary button and at most one secondary. Everything else is a plain link. The action follows the page: Request a dataset on Datasets, Work with our experts on Annotation, Try Forge on Platform. Homepage sections point to those pages with plain links such as "Explore Annotation". This is why the homepage keeps only "Talk to an expert" and "Try Forge", one for buyers who need sales and one for those who want to start alone. The unlabelled "Try Now" is gone.

## Brand expression

I am evolving the identity, with one replacement. The logo, grid and orange accent stay. The dark canvas becomes light, because buyers check vendors against papers, data cards and spec sheets, which are light pages made for reading.

- **Look:** closer to a lab notebook than a billboard. Tables, units, monospace for data. Annotation marks frame real samples.
- **Tone:** plain, with numbers and units. "From $15 per formalization" says more than "cost-effective".
- **Interaction:** orange marks two things: what you can do, and what a person labelled. The primary button keeps Abaka's light text on orange for now, which fails contrast (2.78:1); the fix is dark text on the same orange (6.02:1). Every button says what happens when you press it.

---

## Assumptions (appendix, not part of the one page)

1. Customers exist but are under NDA, so proof cannot depend on logos or named case studies. The homepage "Trusted by" strip uses real logos of the kind of lab Abaka serves, so the design shows how the strip reads; Abaka names no customers publicly, so I have not confirmed any of them. Before launch each logo needs permission; without it the strip falls back to one anonymised line per customer, and is removed if neither exists.
2. The published unit prices reflect real quotes. I quote them as they appear and add none.
3. Off-the-shelf datasets are a real line of business, even though the current page gives no specifications. Dataset specs in my designs are marked placeholders.
4. Forge is a maintained self-serve product.
5. Annotator and expert recruiting happens outside this site.
6. Buying data from third parties, as Project Reborn does, is a real supply channel, and Abaka is willing to describe how that data is licensed.
7. The homepage headline is the positioning Abaka has chosen. I keep it as written and make the rest of the site agree with it.
