/**
 * The sitemap of the redesigned site, drawn as a tree at /sitemap. Every internal page the site links to must be
 * listed here; the page fails the build if one is missing (see linkedRoutes in lib/routes.ts).
 * One sentence per unbuilt page, and the paths each kind of visitor takes, are in the README.
 *
 * status: built = designed in full and coded · paper = designed in Paper only · outline = built from the shared template
 * (components/page/TemplatePage.tsx), short sections only
 * tag: "new" = not on today's abaka.ai (checked Nov 2026). No tag = the page exists today; where it moved
 * from is told in the change list below, not on each box.
 */

export type Status = "built" | "paper" | "outline";
export type SitemapPage = { path: string; name: string; status: Status; tag?: "new" };
export type SitemapGroup = { label: string; path: string; pages: SitemapPage[] };

export const sitemap = {
  label: "Sitemap",
  title: { before: "Five menus, ", em: "named the way buyers look.", after: "" },
  lead: "The homepage, five menus and the pages around them. Four pages are designed in full; every other page is built from one shared template.",

  legend: {
    built: "Built in code",
    paper: "Designed in Paper",
    outline: "Template page",
    new: "New",
    existing: "No tag: on abaka.ai today",
  },

  home: { path: "/", name: "Homepage", status: "built" } as SitemapPage,

  groups: [
    {
      label: "Datasets",
      path: "/datasets",
      pages: [
        { path: "/datasets", name: "Catalog", status: "built" },
        { path: "/datasets/request", name: "Request a dataset", status: "outline", tag: "new" },
      ],
    },
    {
      label: "Services",
      path: "/services",
      pages: [
        { path: "/services", name: "All services", status: "outline", tag: "new" },
        { path: "/services/annotation", name: "Annotation", status: "outline" },
        { path: "/services/data-collection", name: "Data collection", status: "outline" },
        { path: "/services/model-evaluation", name: "Model evaluation", status: "outline" },
        { path: "/services/rl-environments", name: "RL environments", status: "outline" },
      ],
    },
    {
      label: "Platform",
      path: "/platform",
      pages: [
        { path: "/platform", name: "Abaka Forge", status: "outline" },
        { path: "/platform/try", name: "Try Forge", status: "outline", tag: "new" },
      ],
    },
    {
      label: "Solutions",
      path: "/solutions",
      pages: [
        { path: "/solutions", name: "All solutions", status: "outline", tag: "new" },
        { path: "/solutions/physical-ai", name: "Physical AI", status: "built" },
        { path: "/solutions/agents", name: "Agents", status: "outline", tag: "new" },
        { path: "/solutions/voice", name: "Voice and audio", status: "outline" },
        { path: "/solutions/llm", name: "LLM post-training", status: "outline", tag: "new" },
      ],
    },
    {
      label: "Company",
      path: "/company",
      pages: [
        { path: "/company", name: "About Abaka", status: "outline" },
        { path: "/company/why", name: "Why Abaka", status: "outline" },
        { path: "/careers", name: "Careers", status: "outline" },
        { path: "/blog", name: "Blog", status: "outline" },
        { path: "/news", name: "News", status: "outline" },
        { path: "/events", name: "Events", status: "outline" },
      ],
    },
  ] as SitemapGroup[],

  outsideLabel: "Outside the menus",
  outside: [
    { path: "/contact", name: "Talk to an expert", status: "built" },
    { path: "/sell-your-data", name: "Sell your data", status: "outline" },
    { path: "/trust", name: "Trust center", status: "outline", tag: "new" },
    { path: "/privacy", name: "Privacy", status: "outline", tag: "new" },
    { path: "/terms", name: "Terms", status: "outline", tag: "new" },
  ] as SitemapPage[],
  /** Built pages for the team, not linked from the public menus. Not drawn in the tree. */
  internal: ["/system", "/sitemap"],

  changesLabel: "What changed from today's site",
  changes: [
    {
      label: "Added",
      items: [
        "Solutions: a menu by what the buyer is building",
        "Trust center, so security claims sit next to proof",
        "Request a dataset and Try Forge",
      ],
    },
    {
      label: "Merged or moved",
      items: [
        "Products split into Datasets, Platform and Solutions",
        "Resources and Team move under Company",
        "FAQs become a homepage section",
        "Project Reborn and Trusted get plain names: Sell your data, Why Abaka",
      ],
    },
    {
      label: "Removed",
      items: [
        "The “Products” label",
        "Pricing as a page: prices sit on each page",
        "Careers and Pricing from the header",
      ],
    },
  ],

  keyLabel: "Why these three are designed in full",
  key: [
    { name: "Datasets", why: "The one thing a buyer can judge alone. Today it's missing from the header." },
    { name: "Talk to an expert", why: "Every primary button ends here." },
    { name: "Physical AI", why: "Abaka's strongest page; the template the other solution and service pages copy." },
  ],
};
