# Process

How the redesign got made, what changed along the way, and what I would do next. I used the full two days. Paper was where I tried directions; the coded prototype is the deliverable, so most decisions were made, and checked, in the browser.

## 1. Reading the current site

I started by working out what Abaka actually sells, because the site doesn't say it in one place. It runs three businesses at once:

- **Custom projects**: collection, annotation and evaluation, scoped with a person. In this industry, most of the revenue.
- **Ready-made datasets**: made once, sold many times. A buyer wants specs and a sample before talking to anyone.
- **A platform (Forge)**: teams bring their own people. A buyer wants to see the product.

Each of these needs a different first step, and the current site gives all of them the same one: "Talk to an Expert". It also puts every offer at the same level of the menu, so a visitor can't tell which one is for them. That is where the diagnosis in `PHILOSOPHY.md` comes from.

What I noted on the live pages:

- Claims with no source next to them: 99% accuracy, 50x faster, 0% copyright risk.
- "Trusted by leading AI teams" links to a page with no names on it.
- Datasets, the one thing a buyer can judge alone, is missing from the header and lists 21 names with no size, format or licence.
- Physical AI is the strongest page: it names its audience and shows the real split of tasks, scenes and countries. I used it as the model for every solution and service page.

The wider market pointed the same way. Trust has become something data vendors sell: neutrality questions after Meta's stake in Scale, security questions after Mercor's breach. Abaka is a challenger in a market where a few companies hold most of the revenue, so it can't win on breadth. It has to be easier to believe.

## 2. Looking at 27 competitor sites

On the first day I collected the homepages of 27 companies in the same market, in three groups: human data vendors (Scale, Surge, Mercor, Turing, Invisible, Snorkel), RL environment and data labs (HUD, Bespoke Labs, Prime Intellect, Collinear, Veris and others), and annotation platforms (Labelbox, Encord, SuperAnnotate, V7, Toloka). For each one I noted the headline and how the page looks: [the full scan, with screenshots](https://claude.ai/artifact/SX4FQeMYELL4BQNJmBr6sH). Three things came out of it.

**Most headlines describe ambition, not the offer.** "Human Intelligence for AGI", "Defining intelligence", "Accelerate superintelligence". Side by side, they are hard to tell apart. The clearest was Mercor: four plain entrances on the first screen, one for each kind of visitor. It is the same idea behind giving each of Abaka's businesses its own first step, and sellers their own path.

**The looks fall into three groups.**

- Dark AI-lab gradients and glossy 3D (Scale, Turing, micro1). This is where Abaka's current site sits.
- Warm paper and serif headlines, like a journal (AfterQuery, Datacurve, Fleet, Plato).
- Technical, like an instrument panel: dot grids, mono labels, annotation marks on the page (Invisible, Bespoke Labs, Prime Intellect, Veris, SuperAnnotate).

The third group matched the direction I had in mind, because it looks like the work Abaka does, so I went that way, on a light canvas so it still reads like a spec sheet.

**Colour doesn't set anyone apart.** Almost every site is one neutral and one accent, and orange or red-orange is common: Collinear, Bespoke Labs, V7 and Abaka itself. Keeping the orange was right, because it's already Abaka's, but it couldn't carry the brand alone. What makes the redesign recognisable is the drawing: real samples in scanlines with a person's label on them. So I kept orange for two jobs only, actions and labels, and let everything else stay ink on canvas.

Only a few sites put proof on the first screen: live usage numbers (HUD), a benchmark card (Collinear), the real product UI (Labelbox). They let a visitor check the claim on the spot, which is principle 1 in `PHILOSOPHY.md`.

## 3. Turns along the way

**Dark to light.** The current site is a dark, cinematic page. I kept the logo, the grid and the orange, and moved to a light canvas. Buyers check vendors against papers, data cards and spec sheets, and those are light pages made for reading.

**The hero took the longest.** I went through bar charts, a grid of signals, and a pipeline drawn as a route before landing on one idea: show the work itself. The hero now draws real samples (a passage, a lemon, a stretch of audio, a bird across video frames), and a person's label lands on each one. That became the visual language for the whole site: scanlines for raw data, an orange box for what a person labelled. The Solutions scenes, the closing call to action and the footer wordmark all use it.

**Navigation by what buyers look for.** "Products" mixed a catalog, a platform and two industry pages. I split it: Datasets became a top-level menu, Forge became Platform, and the industry pages moved under a new Solutions menu, named by what the buyer is building. The full before and after is on `/sitemap`.

**One rule for every interactive surface.** Partway through, the hovers had drifted: some cells tinted, some went white, one menu underlined. I stopped and wrote one rule: hover is a light orange tint on any surface, selected or open is white, and links in lists only change colour. Then I rewired every component to it. The rule is on `/system`.

**Things I tried and dropped.**

- An orange label box that moved from block to block in the closing call to action. It pulled the eye away from the button.
- An annotation-style hover on the footer wordmark. It read as a gimmick. The wordmark now shakes slightly under a moving pointer and settles as soon as it stops.
- Placeholder customer names. They are now real wordmarks, with a note that Abaka names no customers publicly and each one needs permission before launch.

## 4. Working with AI

I designed in Paper and built in code, with Claude doing much of the hands-on work in both: drawing boards in Paper, writing components, checking pages in the browser at desktop and phone widths. For references I used Mobbin through its MCP connection. For each part of the homepage (the announcement bar, the hero, the dataset catalog, the industries section, stats, product features, the closing call to action) I pulled real examples from other sites into Paper and compared them before drawing my own. The Solutions panels that widen on hover came out of that search. I set the direction, reviewed every screen and made the calls on what stayed. Every value in the code comes from one token file, so changes I asked for in one place showed up everywhere at once.

## 5. What I would test with real visitors

- **First screen.** Can a first-time visitor say what Abaka sells after five seconds on the homepage?
- **The new menus.** A tree test on Datasets, Services, Platform, Solutions and Company. Do buyers with each of the three needs pick the right menu first?
- **Prices next to samples.** Does showing starting prices on the dataset and service pages change how many visitors reach the contact form, and who they are?
- **The seller path.** Do people with data to sell find it from the announcement bar, without it getting in the way of buyers?

## 6. Handing it to engineering

- **Tokens are the source.** `site/tokens/tokens.json` builds the CSS variables, the Tailwind utilities and a TypeScript module. Change a value there and the site and `/system` change together.
- **Copy lives in one file.** `site/lib/content.ts` holds every sentence, so writing and layout can change separately.
- **The map can't drift.** If the site links to a page that isn't on `/sitemap`, the build fails.
- **New pages are cheap.** Every page without its own design renders from one template with its own content entry. Adding a page is adding an entry.
- **A stack most teams already read.** Next.js with static pages, TypeScript, Tailwind fed by the tokens, no UI or animation library. Every page is content, so nothing needs a server at request time. The full reasoning, including why not Astro, is in the README.
- **Open items are marked.** Answers Abaka still has to confirm carry `confirm: true`. The two contrast issues are listed on `/system` with their fixes.

## 7. What I cut

- **A content layer.** I planned typed Markdown content with schemas, so a new case study or dataset is a new file. A single typed copy file was enough for the prototype.
- **Machine-readable pages.** Structured data (schema.org Dataset, FAQ), `llms.txt` and plain-text versions of each page. For a company that sells structured data, I would make this a principle.
- **Real forms.** The contact form and newsletter check input but send nothing. Page views are counted with Vercel's cookieless Web Analytics, so there is no consent banner.
- **Keeping Paper in step.** After the first full design, the code became the source of truth. Some Paper boards, the phone mock-up among them, show the earlier version.

## 8. Next steps, with more time

- **More motion.** The logo, the icons and the illustrations could all move the way the hero does: a label landing, a line scanning. Each would still have to show how something works, not just decorate.
- **Real numbers.** With Abaka's own data (dataset sizes, prices, delivery times, where visitors drop off), I would replace the bracketed placeholders and adjust the pages to what visitors actually do.
- **Close the open items.** Confirm the answers marked `confirm: true`, get permission for each customer logo, and decide on the two contrast fixes listed on `/system`.
- **Run the tests above.** Start with the tree test on the new menus. It is the biggest change and the cheapest to check.
- **Research and case studies as evidence.** The open benchmarks from the 2077AI Foundation, which Abaka co-founded, are the most convincing proof it has. One named project with a method and a result would do more than any of the current numbers.
- **Design the template pages in full,** starting with the ones that get the most traffic, and bring the Paper file back in step with the code.
- **A full accessibility pass.** Screen reader and keyboard runs on every page, plus automated audits, on top of the contrast checks already on `/system`.
- **A path for experts and annotators.** I assumed they are recruited elsewhere and left them out of this site. A real version should check that, and at least say where to go.
