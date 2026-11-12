/**
 * Homepage and catalog content. Typed data, not markup, so the same facts feed every page.
 * Anything not confirmed by Abaka's current site is marked `placeholder: true` and shown as such.
 */

export type Dataset = { name: string; placeholder?: boolean };
export type Category = { id: string; label: string; intro: string; datasets: Dataset[] };

/** Dataset names are from abaka.ai. Sizes, formats and prices are not public, so the catalog marks them as placeholders. */
export const categories: Category[] = [
  { id: "coding", label: "Coding", intro: "Repository patches, contest problems and code comprehension.", datasets: [{ name: "Repo Patch Dataset" }, { name: "Competitive Coding Dataset" }, { name: "Code Understanding Dataset" }] },
  { id: "reasoning", label: "Reasoning", intro: "Chart analysis, hard math questions and Lean4 formal proofs.", datasets: [{ name: "Multimodal Chart-Analysis" }, { name: "AB-HLE Math QA" }, { name: "IMO Level Lean4 Formalization" }] },
  { id: "image", label: "Image", intro: "Image editing pairs, animation and densely captioned stock images.", datasets: [{ name: "Interleaved/Image-Editing" }, { name: "Animation Dataset" }, { name: "Stock Images With Dense Captions" }] },
  { id: "video", label: "Video", intro: "Captioned stock video, 360-degree body motion and talking heads.", datasets: [{ name: "Stock Videos With Dense Captions" }, { name: "360-degree Camera and Body Motion Videos" }, { name: "Talking Head Videos" }] },
  { id: "agentic", label: "Agentic", intro: "Browser recordings, long-chain agent runs and real-world tasks.", datasets: [{ name: "Browser Recording Dataset" }, { name: "Long Chain Agentic Dataset" }, { name: "Real World Tasks Dataset" }] },
  { id: "audio", label: "Audio", intro: "Conversations, plus multilingual speech synthesis and recognition.", datasets: [{ name: "Conversational Dataset" }, { name: "Multilingual TTS" }, { name: "Multilingual ASR" }] },
  { id: "3d", label: "3D", intro: "Indoor scenes with floor plans, single objects and multi-format 3D.", datasets: [{ name: "Indoor Scenes and Floor Plans" }, { name: "3D Objects" }, { name: "Multi-Format 3D" }] },
];

/**
 * The logo strip. Files are the companies' published logos from Wikimedia Commons, in public/logos, drawn as
 * single-colour masks. ratio is each file's width / height; h is its height in px, tuned by eye so the
 * wordmarks read at one optical size (long thin ones shorter, Mistral's square mark taller).
 */
export const customerLogos = [
  { name: "OpenAI", src: "/logos/openai.svg", ratio: 269.66 / 72.52, h: 26 },
  { name: "Anthropic", src: "/logos/anthropic.svg", ratio: 1024.2 / 115, h: 13 },
  { name: "Google DeepMind", src: "/logos/deepmind.svg", ratio: 800 / 99.27, h: 18 },
  { name: "Meta", src: "/logos/meta.svg", ratio: 948 / 191, h: 22 },
  { name: "Mistral AI", src: "/logos/mistral.svg", ratio: 129 / 91, h: 26 },
  { name: "NVIDIA", src: "/logos/nvidia.svg", ratio: 164 / 30, h: 24 },
  { name: "Microsoft", src: "/logos/microsoft.svg", ratio: 337.6 / 72, h: 24 },
];

export const layers = [
  { step: "04 · Evaluate", title: "Evaluation", body: "Model box scored against the label." },
  { step: "03 · Annotate", title: "Annotation", body: "Labelled by a person, then reviewed." },
  { step: "02 · Curate", title: "Curation", body: "Duplicate and blurred frames removed." },
  { step: "01 · Collect", title: "Collection", body: "One clip captured as raw frames." },
  { step: "Base · Forge", title: "Abaka Forge", body: "The platform all four layers run on." },
];

/** `confirm`: Abaka still needs to confirm this answer. A content flag only; the page doesn't show it. */
export type Faq = { q: string; a: string; confirm?: boolean };
export const faqs: Faq[] = [
  {
    q: "How is pricing set?",
    a: "It depends on the task, the data and the volume. Every project starts with a free quote and a pilot, then moves to full production. Published starting rates include $12 an hour for STEM annotation and $6 per model evaluation. Each service page lists its own rates.",
  },
  {
    q: "How is my data kept safe?",
    a: "Your data is encrypted in transit and at rest, with role-based access. Every project gets an NDA and its own pipeline, and you can run it in our cloud, on your own premises, or both. We never resell or reuse your data, and we don't build models that compete with yours.",
  },
  {
    q: "What formats do you deliver?",
    a: "Whatever your pipeline takes: CSV, JSON, Parquet and more. We can also convert the data to the format that fits your training setup.",
  },
  {
    q: "How fast can we start?",
    a: "First delivery can come within 24 hours of kickoff. How fast the rest follows depends on the task and the size of the dataset.",
  },
  {
    q: "Can I buy a ready-made dataset?",
    a: "Yes. Browse the catalog of coding, reasoning, image, video, audio, agentic and 3D datasets, and request the one you need. Our team stays on hand after delivery.",
  },
  {
    q: "Which fields do your experts cover?",
    a: "500,046 registered experts across 261 disciplines, 108 countries and 45 languages, from STEM and finance to software and healthcare. Every expert passes five checks, including a domain exam, before they see your data.",
  },
  {
    q: "Can I run my own labeling on Forge?",
    a: "Yes. Forge has configurable workflows that both technical and non-technical team members can use, and it runs in the cloud, on your premises, or both. Credits start at $0.20 each.",
    confirm: true,
  },
  {
    q: "Can I sell my data to Abaka?",
    a: "Yes, if you hold a private codebase or company operating data. We license codebases for up to $1M each and company data for up to $5M, used only to train and evaluate AI models. The valuation is free and confidential.",
  },
];

export const badges = [
  { id: "soc2", title: "SOC 2", body: "Security, availability and confidentiality controls" },
  { id: "iso27001", title: "ISO 27001", body: "Information security management" },
  { id: "gdpr", title: "GDPR", body: "EU personal data protection" },
  { id: "ccpa", title: "CCPA", body: "California consumer privacy" },
];

/* ───────────────────────────── Site copy ─────────────────────────────
   Every sentence on the site lives below, grouped by where it appears. Components hold layout only.
   Canvas drawings keep their own sample labels (lemon, speaker_a…), and aria-labels stay with their markup. */

/** A heading with one emphasised (orange) part: before + <em>em</em> + after. */
/** A `\n` in `before` breaks the line where the design breaks it. */
export type Heading = { before?: string; em: string; after?: string };
export type LinkCopy = { label: string; href: string };

/** The two calls to action used across the site. */
export const cta = {
  expert: { label: "Talk to an expert", href: "/contact" },
  forge: { label: "Try Forge", href: "/platform" },
} satisfies Record<string, LinkCopy>;

/* ── Site shell ── */
export const brand = { name: "Abaka AI", wordmark: "abaka · ai", home: "Abaka AI home" };

/** The label row above each homepage section: [ 03 / 09 ] · Datasets */
export const sectionIntros = ["Ways to work", "Platform layers", "Datasets", "Services", "Solutions", "Abaka Forge", "Trust", "FAQ", "Get started"];

export const announcement = {
  tag: "Project Reborn",
  text: "Your old codebase can still earn, up to $1M.",
  link: { label: "Get a free valuation", href: "/sell-your-data" },
};

export const newsletter = {
  label: "Work email",
  placeholder: "Work email",
  submit: "Subscribe →",
  error: "Enter a full work email.",
  done: "Thanks. This prototype does not send anything.",
};

export const footer = {
  tagline: "A data company for AI teams.",
  contact: { label: "Contact", email: "business@abaka.ai", link: { label: "Talk to an expert →", href: "/contact" } },
  newsletter: { label: "Newsletter", body: "Abaka's latest updates and industry trends." },
  social: [{ label: "LinkedIn", href: "#" }, { label: "X (Twitter)", href: "#" }],
  /** Columns not taken from the header nav. */
  columns: {
    datasets: { label: "Datasets", links: [{ label: "All datasets", href: "/datasets" }, { label: "Request a dataset", href: "/datasets/request" }] },
    services: "Services",
    platform: { label: "Platform", links: [{ label: "Abaka Forge", href: "/platform" }, { label: "Try Forge", href: "/platform/try" }] },
    solutions: "Solutions",
    company: "Company",
    /** Company links the footer leaves out. */
    companyExclude: ["News", "Events", "Talk to an expert"],
  },
  copyright: "© 2026 Abaka AI",
  legal: [{ label: "Privacy Policy", href: "/privacy" }, { label: "Terms of Service", href: "/terms" }],
  backToTop: { label: "Back to top ↑", href: "#main" },
};

/* ── Homepage, top to bottom ── */
export const hero = {
  /** Two lines on wide screens. */
  title: ["Human Intelligence", "Data for Frontier AI"],
  lead: "All the data you need to build AI, in one place.",
};

export const logoWall = {
  label: "Trusted by",
  title: "Leading AI teams worldwide",
};

export const ways = {
  title: { before: "A data company for AI teams. ", em: "Three ways to work with us." } satisfies Heading,
  items: [
    {
      icon: "way-dataset", label: "Ready-made", title: "Buy a dataset",
      body: "Already collected and labelled. Each one lists its specs and starting price.",
      list: [{ label: "Datasets catalog", href: "/datasets" }],
    },
    {
      icon: "way-commission", label: "Made to order", title: "Commission data",
      body: "We collect, label or test data to your spec, or build an environment for your agent.",
      list: [
        { label: "Data collection", href: "/services/data-collection" },
        { label: "Data annotation", href: "/services/annotation" },
        { label: "Model evaluation", href: "/services/model-evaluation" },
        { label: "RL environments", href: "/services/rl-environments" },
      ],
    },
    {
      icon: "way-forge", label: "Self-serve", title: "Run it yourself",
      body: "Do your own labelling and review on Forge, the platform our teams use.",
      list: [{ label: "Abaka Forge", href: "/platform" }],
    },
  ] as { icon: string; label: string; title: string; body: string; list: { label: string; href: string }[] }[],
};

export const stack = {
  title: { before: "Four layers. ", em: "One platform." } satisfies Heading,
  lead: "Follow frame_118 from capture to evaluation. What passes ships as a dataset or goes to your team.",
  links: [{ label: "Packaged as a dataset", href: "/datasets" }, { label: "Delivered to your team", href: "/services" }],
  /** the steps are `layers`, above. One callout per layer, same order: what happened to frame_118 there.
      Values in brackets are placeholders. `accent` marks the one value that turns orange. */
  callouts: [
    { head: ["frame_118", "scored"], rows: [["model", "[model name]"], ["iou", "[0.00]"], ["result", "[pass / fail]"]] },
    { head: ["frame_118", "label"], rows: [["class", "[object]"], ["box", "[x, y, w, h]"], ["by", "[expert id]"], ["review", "[pass]"]], accent: 3 },
    { head: ["frame_118", "kept"], rows: [["blur", "[score] · ok"], ["dupe", "none"], ["kept", "[n] of [n]"]] },
    { head: ["frame_118", "raw"], rows: [["source", "[camera id]"], ["clip", "[clip id]"], ["time", "[00:04.7]"], ["size", "[w × h]"]] },
    { head: ["Abaka Forge", "run"], rows: [["run", "[run id]"], ["frames", "[n]"], ["status", "[delivered]"]] },
  ] as { head: [string, string]; rows: [string, string][]; accent?: number }[],
};

export const datasetsSection = {
  title: { before: "Off-the-shelf datasets, ", em: "ready to request." } satisfies Heading,
  lead: "Ready-made training data in seven categories. Pick one and request it, or tell us what you need.",
  link: { label: "See all datasets", href: "/datasets" },
  /** Folder tabs: one per category, then the Custom data tab. */
  tabs: {
    /** opens the contact form with "Data collection" picked */
    custom: { label: "Custom data", href: "/contact?need=Data%20collection" },
    featured: "Featured in",
    columns: ["Size", "Format", "Licence"],
    placeholder: "[ — ]",
    request: "Request",
    browseAll: (label: string) => `Browse all ${label} datasets`,
  },
};

export const servicesSection = {
  title: { before: "Work with ", em: "domain experts." } satisfies Heading,
  lead: "Not sure which one fits? Tell us the model and the goal.",
  link: { label: "Talk to an expert", href: "/contact" },
  /** prefix for each card's link: "Explore Annotation" */
  explore: "Explore",
  /** the cards are `services` in lib/nav.ts */
};

export const solutionsSection = {
  title: { before: "Data for ", em: "what you are building." } satisfies Heading,
  lead: "Four kinds of model, four kinds of data. Every set is made and checked by people who know the field.",
  explore: "Explore",
  /** One per panel, in the order of `solutions` in lib/nav.ts. Copy from abaka.ai (/physical-ai, /rl-environments,
      /full-duplex, /annotation, /services/model_evaluation). */
  bodies: [
    "First-person and robot footage with depth, hand pose and touch. Annotators mark objects, grasps and keypoints.",
    "Working copies of mail, calendar, CRM and other business apps. Every task ships with a golden run and a verifier.",
    "Real two-person conversations, one 48 kHz track per speaker. Every overlap, backchannel and interruption is marked.",
    "Preference data, evaluations and red-teaming from vetted experts in math, code and reasoning.",
  ],
};

export const platform = {
  title: { before: "Abaka Forge, where ", em: "human judgment", after: " forges frontier AI." } satisfies Heading,
  lead: "One platform to collect, clean, label and deliver training data.",
  link: { label: "Explore Forge", href: "/platform" },
  /** Feature tour: four features on the left, one window on the right drawing the selected one. */
  features: [
    { title: "Every data type", body: "Images, 3D and 4D point clouds, RLHF, text and video, labelled in one tool." },
    { title: "One platform, start to finish", body: "From raw data to delivery in one place." },
    { title: "Annotate faster", body: "A model drafts the label. A person corrects it." },
    { title: "Manage the work", body: "Every task, its stage and its review status in one queue." },
  ],
  windows: {
    types: {
      heading: "Data type",
      list: [["Image", "1,240"], ["3D / 4D cloud", "318"], ["RLHF", "2,056"], ["Text", "4,812"], ["Video", "96"]],
      title: "Image",
      meta: "1,240 items · 873 labelled",
      actions: ["Upload", "Start labelling"],
      items: [["img_0121", "labelled"], ["img_0122", "labelled"], ["img_0123", "raw"], ["img_0124", "raw"], ["img_0127", "in review"], ["img_0128", "raw"], ["img_0129", "labelled"], ["img_0130", "raw"]],
    },
    pipeline: {
      title: "Pipeline",
      meta: "214 tasks · due 28 Nov",
      action: "Export",
      columns: [
        { name: "Collection", count: "42", tasks: ["task_0412", "task_0413"] },
        { name: "Cleaning", count: "18", tasks: ["task_0398"] },
        { name: "Annotation", count: "96", tasks: ["task_0381", "task_0377", "task_0369"] },
        { name: "Training", count: "31", tasks: ["task_0350"] },
        { name: "Production", count: "27", tasks: ["batch_12"], note: "■ delivered" },
      ],
    },
    annotate: {
      tools: ["▢ box", "◇ polygon", "· point"],
      ref: "task_0381 · img_0127",
      draft: "model draft",
      corrected: "corrected",
      heading: "Labels",
      labels: [
        { name: "mug", note: ["model draft → corrected", "by M. Okafor · 2 min ago"] },
        { name: "handle", note: ["model draft"] },
      ],
      actions: ["Send back", "Submit"],
    },
    queue: {
      filters: ["All 96", "In review 21", "Sent back 6"],
      action: "Assign",
      columns: ["Task", "Data", "Stage", "Review"],
      rows: [
        ["task_0381", "image", "annotation", "accepted"],
        ["task_0377", "point cloud", "annotation", "in review"],
        ["task_0369", "rlhf", "annotation", "sent back"],
        ["task_0412", "video", "cleaning", "queued"],
        ["task_0350", "text", "data production", "accepted"],
      ],
      summary: "96 open · 21 in review · 75 accepted",
      reviewer: "reviewer: A. Rivera",
    },
  },
};

export const why = {
  title: { before: "Safe to hand over. ", em: "Safe to train on." } satisfies Heading,
  lead: "Abaka is self-funded and profitable, and builds nothing that competes with you.",
  link: { label: "Go to trust center", href: "/trust" },
  /** the badges are `badges`, above; icons are set in the component, by position */
  proofs: [
    { title: "Your data stays yours", body: "Encrypted, under NDA, in a separate pipeline for each project. Never resold, reused or shared.", foot: "Cloud · On-premise · Hybrid" },
    { title: "Data you can legally train on", body: "Ethically sourced, with a record of where each item came from.", foot: "Provenance report on request" },
    { title: "People you can verify", body: "Every expert passes five checks, including an ID check and a domain exam, before seeing your data.", foot: "500,046 experts · 108 countries" },
  ],
};

export const faqSection = { title: "Frequently asked questions" /* the questions are `faqs`, above */ };

export const finalCta = {
  raw: "[ Raw ]",
  labelled: "[ Labelled ]",
  title: { before: "Tell us what ", em: "your model needs." } satisfies Heading,
  lead: "Tell us the model and the goal. We reply within 1 business day.",
  primary: { label: "Talk to an expert →", href: "/contact" },
  secondary: { label: "Try Forge", href: "/platform" },
};

/* ── Datasets page ── */
export const datasetsPage = {
  metaTitle: "Datasets · Abaka AI",
  crumbs: ["Home", "Datasets"],
  title: { before: "Off-the-shelf datasets,\n", em: "ready to request." } satisfies Heading,
  lead: "Coding, reasoning, image, video, audio, agentic and 3D data, already collected, labelled and reviewed.",
  primary: { label: "Request a dataset", href: "/datasets/request" },
  secondary: { label: "Talk to an expert", href: "/contact" },
  /** icons: Database, LayoutGrid, Users (in the page) */
  stats: [
    { value: "21", label: "Datasets" },
    { value: "7", label: "Categories" },
    { value: "500,046", label: "Experts behind them" },
  ],
  why: {
    intro: "Why off-the-shelf",
    title: { before: "Train this week,\n", em: "not next quarter." } satisfies Heading,
    lead: "No collection project to scope and wait for. The data is already made; you pick it and request it.",
    /** icons: PackageCheck, UserCheck, ShieldCheck */
    reasons: [
      { title: "Ready to request", body: "Every dataset is collected, labelled and reviewed before it reaches the catalog. Request one and the team takes it from there." },
      { title: "Made by verified experts", body: "500,046 experts across 261 disciplines. Each passes five checks, including an ID check and a domain exam." },
      { title: "Checked batch by batch", body: "Spot checkers, reviewers and domain leads go over every batch before it ships." },
    ],
  },
  featured: {
    intro: "Featured",
    title: { before: "Captured by people,\n", em: "checked by people." } satisfies Heading,
    lead: "Every dataset comes from Abaka's expert network: people who did the work, then people who checked it.",
    card: {
      eyebrow: "Physical AI · Human, robot, world",
      title: "Real-world Physical AI data",
      body: "First-person footage of people doing everyday work in homes, shops and factories, with depth, hand pose and touch recorded in the same clip. Built for robot learning and world models.",
      tags: ["Egocentric video", "Depth", "Hand pose", "Tactile", "UMI", "Teleoperation"],
      foot: "7 task families · 3 scene types · 12+ countries",
      link: { label: "See Physical AI", href: "/solutions/physical-ai" },
      tableLabel: "Task distribution",
      tasks: [
        ["Retail", "20.9%"], ["Cooking", "19.1%"], ["Cleaning", "16.6%"], ["Storage", "13.5%"],
        ["Assembly", "11.9%"], ["Dressing & textile", "9.2%"], ["Logistics & care", "8.8%"],
      ],
      scenes: { label: "Scenes", value: "Home 45 · Shop 36 · Factory 20" },
    },
    /** icons follow the category: Sigma (Reasoning), Video, Box (3D) */
    cards: [
      { category: "Reasoning", name: "IMO Level Lean4 Formalization", body: "Olympiad-level problems written as Lean4 formal proofs, for models that have to build a proof step by step.", price: "From $15 / formalization" },
      { category: "Video", name: "Stock Videos With Dense Captions", body: "Licensed stock footage with detailed captions, for video understanding and video generation.", price: "From $0.10 / video" },
      { category: "3D", name: "Indoor Scenes and Floor Plans", body: "Scanned indoor scenes paired with their floor plans, for robotics, AR/VR and 3D content.", price: "From $100 / scan" },
    ],
  },
  catalog: {
    intro: "Catalog",
    title: { before: "All 21 datasets,\n", em: "by category." } satisfies Heading,
    lead: "Pick a category. Request opens the contact form with the dataset already filled in.",
  },
  faq: {
    intro: "FAQ",
    title: { before: "Questions about\n", em: "datasets." } satisfies Heading,
    items: [
      { q: "What are Abaka's off-the-shelf datasets?", a: "Ready-made training data in seven categories: coding, reasoning, image, video, audio, agentic and 3D. Each one is already collected, labelled and reviewed, so you can request it as it is." },
      { q: "Who makes the datasets?", a: "Abaka's expert network: 500,046 experts across 261 disciplines and 108 countries. Each passes five checks, including an ID check and a domain exam, and spot checkers, reviewers and domain leads go over every batch before it ships." },
      { q: "Can I see a sample before I license one?", a: "Yes. Request the dataset and we send a sample with its specs, so you can check the format and the labels before you license it.", confirm: true },
      { q: "Can you extend a dataset or build a new one?", a: "Yes. We can add volume, languages or label types to a dataset in the catalog, or collect and label a new one to your spec.", confirm: true },
      { q: "How is a dataset priced?", a: "Per item, by dataset. Published starting prices include $15 per Lean4 formalization, $0.10 per stock video and $100 per indoor scan. Volume and licence terms set the final quote.", confirm: true },
      { q: "What formats do you deliver?", a: "Whatever your pipeline takes: CSV, JSON, Parquet and more. We can also convert the data to the format that fits your training setup." },
    ] satisfies Faq[],
  },
  cta: {
    intro: "Request",
    title: { before: "Found the one?\n", em: "Request it." } satisfies Heading,
    lead: "Name the dataset and what you're training. We reply within 1 business day.",
  },
  request: "Request",
  /** a Request link opens the contact form with the dataset filled in */
  requestHref: (name: string) => `/contact?dataset=${encodeURIComponent(name)}`,
};

/* ── Physical AI (/solutions/physical-ai). Distributions are copied from abaka.ai/physical-ai (Nov 2026). ── */
export type Share = [label: string, value: number];
export const physicalAiPage = {
  metaTitle: "Physical AI · Abaka AI",
  crumbs: ["Solutions", "Physical AI"],
  title: { before: "Real-world data\nfor ", em: "Physical AI." } satisfies Heading,
  lead: "First-person footage, robot demonstrations and scene data, captured in real homes, shops and factories, then labelled frame by frame.",
  primary: { label: "Talk to an expert", href: "/contact?need=Physical%20AI" },
  secondary: { label: "Get sample pack", href: "/contact?need=Physical%20AI" },
  capture: {
    title: "capture_0418 · kitchen · head camera",
    /** icons: Camera, Layers, Hand, Fingerprint. The first is the one on screen. */
    signals: ["RGB", "Depth", "Hand pose", "Tactile"],
    boxes: ["left hand · pinch", "bowl · target"],
    depth: "Depth",
    start: "00:12",
    end: "00:40",
    segment: "segment: scoop rice → bowl",
  },
  statement: {
    title: { before: "Footage is easy to find.\n", em: "Training-ready data isn't." } satisfies Heading,
    body: "We plan each collection backwards from your training run: the tasks, scenes and sensors your model needs, recorded together and labelled the same way every time.",
  },
  layers: {
    intro: "What we collect",
    title: { before: "Three layers,\n", em: "one training set." } satisfies Heading,
    lead: "Human, robot and world data from the same pipeline, so the layers line up when your model trains on them.",
    /** icons: Eye, Bot, Globe. Drawing labels are in the drawings' own copy below. */
    items: [
      { step: "01 · Human layer", title: "Egocentric data", body: "First-person video of people at work: how they move, reach and handle objects. The source signal for teaching robots.", tags: "Video · Pose · Tactile" },
      { step: "02 · Robot layer", title: "UMI and teleoperation", body: "Handheld-gripper capture and teleoperated runs. The bridge from a human demonstration to a robot doing the task.", tags: "UMI · Teleop · Tactile" },
      { step: "03 · World layer", title: "Scene and simulation", body: "Scenes, simulation and world-model context from the same pipeline: what VLA and world models actually train against.", tags: "World model · Simulation · Scene" },
    ],
    drawings: {
      human: ["RGB · 1st person", "21 keypoints"],
      robot: ["grasp", "gripper width", "contact force"],
      world: ["kitchen", "dining", "living room"],
    },
  },
  coverage: {
    intro: "Coverage",
    title: { before: "Beyond one\n", em: "lab kitchen." } satisfies Heading,
    lead: "A wide spread of tasks, scenes and countries, for models that have to work outside the place they were trained.",
    source: "Share of collected clips. Source: abaka.ai/physical-ai",
    /** icons: ListChecks, House, Globe. Scene is selected on load. */
    tabs: [
      {
        label: "Task",
        bars: [["Retail & merchandising", 20.9], ["Cooking & meals", 19.1], ["Cleaning & sanitation", 16.6], ["Storage & organisation", 13.5], ["Assembly & manufacturing", 11.9], ["Dressing & textile", 9.2], ["Logistics & care", 8.8]] as Share[],
        detail: {
          label: "Retail & merchandising",
          items: [["Shelf restocking", 20.6], ["Product merchandising", 19.1], ["Order packing", 17.7], ["Parcel unpacking", 16.3], ["Barcode scanning", 6.7], ["Fresh produce sorting", 6.2], ["Cash register handling", 5.3], ["Gift wrapping", 4.3], ["Fitting room reset", 3.8]] as Share[],
        },
      },
      {
        label: "Scene",
        bars: [["Home", 45.0], ["Commercial", 35.5], ["Factory", 19.5]] as Share[],
        detail: {
          label: "Home",
          items: [["Kitchen", 13.8], ["Living room", 11.6], ["Bedroom", 11.0], ["Bathroom", 9.7], ["Balcony", 6.1], ["Dining room", 5.4], ["Children's room", 5.4], ["Laundry room", 5.2], ["Home office", 5.1], ["Foyer / entry", 5.0]] as Share[],
        },
      },
      {
        label: "Country",
        bars: [["United States", 28.7], ["India", 20.5], ["Nigeria", 8.0], ["Kenya", 7.3], ["Brazil", 5.6], ["Other countries", 14.3]] as Share[],
        detail: {
          label: "More countries",
          items: [["Canada", 4.4], ["United Kingdom", 3.7], ["Egypt", 2.9], ["Philippines", 1.4], ["Indonesia", 1.3], ["Argentina", 1.1], ["Pakistan", 0.9]] as Share[],
        },
      },
    ],
  },
  pipeline: {
    intro: "How it works",
    title: { before: "Built around\n", em: "your training loop." } satisfies Heading,
    lead: "From the first call to a versioned dataset, one team runs every step.",
    /** icons: ClipboardList, MapPin, Layers, Tag, SlidersHorizontal, PackageCheck */
    steps: [
      { step: "01 · Scope", title: "Plan it with your team", body: "We start from your use case and shape the tasks, scenes and sensors around what the model needs." },
      { step: "02 · Collect", title: "Capture in real places", body: "Homes, shops and factories in the US, India, Nigeria, Kenya, Brazil and more, not a single lab set." },
      { step: "03 · Record", title: "Every signal at once", body: "Vision, depth, hand pose and touch, captured together in every clip." },
      { step: "04 · Annotate", title: "Labelled, then reviewed", body: "Trained annotators mark objects, grasps and keypoints, with checks at every step." },
      { step: "05 · Customise", title: "Built to your spec", body: "Custom scenes, subjects and label schemas, shaped to what you are actually training." },
      { step: "06 · Deliver", title: "Ready for training", body: "Structured, versioned datasets in the format your training pipeline already reads." },
    ],
    types: {
      label: "Data types",
      body: "Seven signals, one pipeline.",
      /** icons: Video, Layers, Hand, Fingerprint, Grab, Gamepad2, Box */
      items: ["Egocentric video", "Depth", "Hand pose", "Tactile", "UMI", "Teleoperation", "Scene and simulation"],
    },
  },
  trust: {
    intro: "Your data",
    title: "Safe to hand over.\nSafe to train on.",
    body: "Footage from real homes and workplaces needs more care, not less.",
    /** icons: Lock, FileCheck, BadgeCheck */
    items: [
      { title: "Yours alone", body: "Encrypted, under NDA, in a separate pipeline for each project. Never resold or reused.", foot: "Cloud · On-premise · Hybrid" },
      { title: "Legally collected", body: "Ethically sourced, with a record of where each clip came from.", foot: "Provenance report on request" },
      { title: "Verified people", body: "Everyone who records or labels passes five checks, including an ID check.", foot: "500,046 experts · 108 countries" },
    ],
  },
  faq: {
    intro: "FAQ",
    title: { before: "Questions about\n", em: "collection." } satisfies Heading,
    items: [
      { q: "What Physical AI data can you collect?", a: "Three layers: first-person human footage with pose and touch, robot data from UMI capture and teleoperation, and scene and simulation data for world models." },
      { q: "How does a new project start?", a: "With a call about your robot, the tasks and the scenes. We scope the collection backwards from your training run, run a pilot, then move to full production.", confirm: true },
      { q: "How do you keep the data diverse?", a: "We record in real homes, shops and factories across 12+ countries, and track the spread of tasks, scenes and countries so no single setting dominates the set." },
      { q: "Can I see a sample first?", a: "Yes. Ask for the sample pack and we send clips with their labels and specs before you commit.", confirm: true },
      { q: "What format is the data delivered in?", a: "Structured, versioned datasets in the format your training pipeline already reads. We can convert to the format that fits your setup.", confirm: true },
    ] satisfies Faq[],
  },
  cta: {
    title: { before: "Plan your ", em: "collection." } satisfies Heading,
    lead: "Tell us the robot, the tasks and the scenes. We reply within 1 business day.",
  },
};

/* ── Header menus (the links themselves are in lib/nav.ts) ── */
export const navPanel = {
  explore: "Explore →",
  /** Platform menu: an illustrative Forge analytics screen. Numbers are placeholders. */
  product: {
    crumbs: "ANNOTATION / PROJECT_[ N ] / ANALYTICS / ",
    current: "OVERVIEW",
    menu: ["Data", "Analytics"],
    menuCurrent: "Overview",
    menuSub: ["Batch", "Team", "Member"],
    metrics: ["Active annotators", "Effective annotators", "Total annotators", "Working teams"],
    value: "[ n ]",
    quality: "Team quality",
    team: ["team_[ ", " ]"],
    workflow: "Workflow distribution",
    stages: ["accepted", "in review", "annotating", "queued"],
  },
};

/* ── Coming soon: every linked page this prototype doesn't build ── */
export const comingSoon = {
  metaTitle: "Coming soon · Abaka AI",
  title: { before: "This page is ", em: "outside the prototype." } satisfies Heading,
  body: "This redesign covers the homepage, the datasets catalog and the design system. The rest of abaka.ai would follow the same system.",
  links: [
    { label: "Back to the homepage", href: "/" },
    { label: "Browse datasets", href: "/datasets" },
    { label: "See the design system", href: "/system" },
    { label: "See the sitemap", href: "/sitemap" },
  ],
};

/* ── Contact (Paper "Contact sales · 4.0") ── */
export const contact = {
  metaTitle: "Talk to a data expert · Abaka AI",
  title: { before: "Talk to a ", em: "data expert." } satisfies Heading,
  lead: "A data researcher replies within 1 business day.",
  with: "With",
  offers: [
    { title: "Free sample", note: "your use case" },
    { title: "30-min call", note: "with a researcher" },
    { title: "Custom quote", note: "99% QA SLA" },
  ],
  form: {
    name: "Name",
    email: "Work email",
    company: "Company",
    need: "What do you need?",
    needs: ["Datasets", "Data collection", "Annotation", "Model evaluation", "RL environments", "Physical AI", "Forge"],
    dataset: "Dataset",
    datasetPlaceholder: "Optional: name a dataset from the catalog",
    fromCatalog: "From catalog",
    message: "Tell us about your model and the data it needs",
    submit: "Send the brief",
    errors: { name: "Enter your name.", email: "Enter a full work email.", message: "Tell us a little about the model." },
    /** No backend: the prototype confirms inline and sends nothing. */
    done: {
      title: "Brief received.",
      body: "A data researcher would reply within 1 business day. This prototype does not send anything.",
      again: "Write another brief",
    },
  },
};

/* ── Template pages: every linked page without a page of its own (components/page/TemplatePage.tsx) ──
   Three tiers. full: hero, bento, FAQ, CTA. index: hero, a bento of links to the child pages, CTA.
   light: hero, one short block, CTA. Facts come from this file, copy/*.md and abaka.ai only.
   `confirm: true` marks a line Abaka still has to confirm; the page doesn't show it. */
export type TemplateIcon =
  | "Scan" | "Database" | "ClipboardCheck" | "AppWindow" | "Users" | "ShieldCheck" | "BadgeDollarSign" | "Clock"
  | "Bot" | "MousePointer2" | "AudioLines" | "Brain" | "Layers" | "Workflow" | "Cloud" | "Coins" | "Code"
  | "Building2" | "FileSearch" | "Lock" | "FileCheck" | "UserCheck" | "Info" | "Briefcase" | "FileText" | "Megaphone"
  | "Calendar" | "Globe" | "Handshake" | "Mic" | "ListChecks";
export type TemplateArt =
  | { kind: "illustration"; name: string }
  | { kind: "forge"; window: "types" | "pipeline" | "annotate" | "queue" }
  | { kind: "scan"; name: "cta-raw" | "cta-labelled" }
  | { kind: "offer"; which: "sample" | "call" | "quote" };
export type TemplateCell = { icon: TemplateIcon; title: string; body: string; link?: LinkCopy; confirm?: boolean };
export type TemplatePage = {
  tier: "full" | "index" | "light";
  metaTitle: string;
  parent: LinkCopy;
  crumb: string;
  title: Heading;
  lead: string;
  primary: LinkCopy;
  secondary?: LinkCopy;
  art: TemplateArt;
  bento?: { intro: string; title: Heading; lead?: string; cells: TemplateCell[] };
  block?: { title: string; body: string; link?: LinkCopy };
  /** /company/why: the homepage's Why Abaka section after the bento */
  showWhy?: boolean;
  faq?: { title: Heading; items: Faq[] };
  cta: { title: Heading; lead: string };
};

const expert: LinkCopy = { label: "Talk to an expert", href: "/contact" };
const reply = "We reply within 1 business day.";
const svc: LinkCopy = { label: "Services", href: "/services" };
const sol: LinkCopy = { label: "Solutions", href: "/solutions" };
const co: LinkCopy = { label: "Company", href: "/company" };
const home: LinkCopy = { label: "Home", href: "/" };
const checks: Faq = { q: "Who does the work?", a: "Vetted experts from a network of 500,046 across 261 disciplines and 108 countries. Each passes five checks, including an ID check and a domain exam, before seeing your data." };
const safe: Faq = { q: "How is my data kept safe?", a: "Encrypted in transit and at rest, under NDA, in a separate pipeline for each project. You can run it in our cloud, on your premises, or both. We never resell or reuse your data." };

/** section labels the template adds itself */
export const templateLabels = { why: "Why Abaka", faq: "FAQ" };

export const templatePages: Record<string, TemplatePage> = {
  /* ── Services ── */
  "/services": {
    tier: "index", metaTitle: "Services · Abaka AI", parent: home, crumb: "Services",
    title: { before: "Work with\n", em: "domain experts." },
    lead: "Collection, annotation, evaluation and RL environments, run by vetted experts.",
    primary: expert, art: { kind: "illustration", name: "way-commission" },
    bento: {
      intro: "Services", title: { before: "Four services,\n", em: "one team." },
      cells: [
        { icon: "Scan", title: "Annotation", body: "Domain experts for data annotation, RLHF and model evaluation, with quality control built in.", link: { label: "Explore Annotation", href: "/services/annotation" } },
        { icon: "Database", title: "Data collection", body: "Diverse, ethically sourced data, handled under SOC 2, ISO 27001 and GDPR.", link: { label: "Explore Data collection", href: "/services/data-collection" } },
        { icon: "ClipboardCheck", title: "Model evaluation", body: "Experts test your model for accuracy, robustness, safety, bias and tool calling.", link: { label: "Explore Model evaluation", href: "/services/model-evaluation" } },
        { icon: "AppWindow", title: "RL environments", body: "Where agents learn the job, inside working replicas of the enterprise apps they will use.", link: { label: "Explore RL environments", href: "/services/rl-environments" } },
      ],
    },
    cta: { title: { before: "Not sure which ", em: "fits?" }, lead: `Tell us the model and the goal. ${reply}` },
  },
  "/services/annotation": {
    tier: "full", metaTitle: "Annotation · Abaka AI", parent: svc, crumb: "Annotation",
    title: { before: "Labels from people\n", em: "who know the field." },
    lead: "Domain experts for data annotation, RLHF and model evaluation, with quality control built in.",
    primary: expert, secondary: { label: "See datasets", href: "/datasets" }, art: { kind: "illustration", name: "service-annotation" },
    bento: {
      intro: "How it works", title: { before: "Expert labels,\n", em: "checked twice." },
      cells: [
        { icon: "Users", title: "Vetted experts", body: "500,046 experts across 261 disciplines, 108 countries and 45 languages." },
        { icon: "ShieldCheck", title: "Five checks first", body: "Every expert passes an application, an interview, an ID check, a domain exam and ongoing re-verification." },
        { icon: "ListChecks", title: "Reviewed batch by batch", body: "Spot checkers, reviewers and domain leads go over every batch before it ships." },
        { icon: "BadgeDollarSign", title: "Published rates", body: "STEM annotation starts at $12 an hour. Every project starts with a free quote and a pilot." },
      ],
    },
    faq: {
      title: { before: "Questions about\n", em: "annotation." },
      items: [
        checks,
        { q: "How is pricing set?", a: "By the task, the data and the volume. Every project starts with a free quote and a pilot, then moves to full production." },
        { q: "How fast can we start?", a: "First delivery can come within 24 hours of kickoff. The rest depends on the task and the size of the dataset." },
      ],
    },
    cta: { title: { before: "Start with ", em: "a pilot." }, lead: `Tell us the data and the labels you need. ${reply}` },
  },
  "/services/data-collection": {
    tier: "full", metaTitle: "Data collection · Abaka AI", parent: svc, crumb: "Data collection",
    title: { before: "Data collected\n", em: "for your model." },
    lead: "Diverse, ethically sourced data, handled under SOC 2, ISO 27001 and GDPR.",
    primary: expert, secondary: { label: "See Physical AI", href: "/solutions/physical-ai" }, art: { kind: "illustration", name: "service-collection" },
    bento: {
      intro: "How it works", title: { before: "Real places,\n", em: "real people." },
      cells: [
        { icon: "Globe", title: "Captured where it happens", body: "Homes, shops and factories across 12+ countries, not a single lab set." },
        { icon: "Layers", title: "Every signal at once", body: "Vision, depth, hand pose and touch, recorded together in one clip." },
        { icon: "FileCheck", title: "Legally sourced", body: "Ethically sourced, with a record of where each item came from. Provenance report on request." },
      ],
    },
    faq: {
      title: { before: "Questions about\n", em: "collection." },
      items: [
        { q: "What can you collect?", a: "First-person and robot footage, scene data, conversations, documents and more, shaped to the tasks your model needs.", confirm: true },
        safe,
        { q: "What formats do you deliver?", a: "Whatever your pipeline takes: CSV, JSON, Parquet and more. We can also convert the data to the format that fits your training setup." },
      ],
    },
    cta: { title: { before: "Plan your ", em: "collection." }, lead: `Tell us the tasks, the scenes and the volume. ${reply}` },
  },
  "/services/model-evaluation": {
    tier: "full", metaTitle: "Model evaluation · Abaka AI", parent: svc, crumb: "Model evaluation",
    title: { before: "Know what your model\n", em: "gets wrong." },
    lead: "Experts test your model for accuracy, robustness, safety, bias and tool calling.",
    primary: expert, art: { kind: "illustration", name: "service-evaluation" },
    bento: {
      intro: "What we test", title: { before: "Judged by people\n", em: "who know the answer." },
      cells: [
        { icon: "ClipboardCheck", title: "Accuracy and robustness", body: "Experts in the field check answers, then push on the cases where models break." },
        { icon: "ShieldCheck", title: "Safety and bias", body: "Red-teaming and bias checks by vetted reviewers." },
        { icon: "Workflow", title: "Tool calling", body: "Does the model pick the right tool and use it correctly, step by step." },
        { icon: "BadgeDollarSign", title: "Published rates", body: "Model evaluation starts at $6 per evaluation." },
      ],
    },
    faq: { title: { before: "Questions about\n", em: "evaluation." }, items: [checks, safe, { q: "How fast can we start?", a: "First delivery can come within 24 hours of kickoff. The rest depends on the task and the size of the set." }] },
    cta: { title: { before: "Test your ", em: "model." }, lead: `Tell us the model and what it has to get right. ${reply}` },
  },
  "/services/rl-environments": {
    tier: "full", metaTitle: "RL environments · Abaka AI", parent: svc, crumb: "RL environments",
    title: { before: "Where agents\n", em: "learn the job." },
    lead: "Working copies of mail, calendar, CRM and other business apps, built for training agents.",
    primary: expert, secondary: { label: "See Agents", href: "/solutions/agents" }, art: { kind: "illustration", name: "service-rl" },
    bento: {
      intro: "What you get", title: { before: "Real apps,\n", em: "checked runs." },
      cells: [
        { icon: "AppWindow", title: "Working replicas", body: "Mail, calendar, CRM and other enterprise apps your agent will use." },
        { icon: "ListChecks", title: "A golden run per task", body: "Every task ships with a reference run of the correct steps." },
        { icon: "ClipboardCheck", title: "A verifier per task", body: "Each task comes with a check that says whether the agent got it right." },
      ],
    },
    faq: { title: { before: "Questions about\n", em: "environments." }, items: [
      { q: "Which apps can you replicate?", a: "Mail, calendar, CRM and other business apps. Tell us the workflow and we scope the environment around it.", confirm: true },
      safe,
      { q: "How do tasks get scored?", a: "Every task ships with a golden run and a verifier, so a run can be checked without a person in the loop." },
    ] },
    cta: { title: { before: "Train your ", em: "agent." }, lead: `Tell us the apps and the tasks. ${reply}` },
  },

  /* ── Solutions ── */
  "/solutions": {
    tier: "index", metaTitle: "Solutions · Abaka AI", parent: home, crumb: "Solutions",
    title: { before: "Data for\n", em: "what you are building." },
    lead: "Four kinds of model, four kinds of data. Every set is made and checked by people who know the field.",
    primary: expert, art: { kind: "scan", name: "cta-labelled" },
    bento: {
      intro: "Solutions", title: { before: "Pick your\n", em: "model." },
      cells: [
        { icon: "Bot", title: "Physical AI", body: "First-person and robot footage with depth, hand pose and touch.", link: { label: "Explore Physical AI", href: "/solutions/physical-ai" } },
        { icon: "MousePointer2", title: "Agents", body: "Working copies of business apps, each task with a golden run and a verifier.", link: { label: "Explore Agents", href: "/solutions/agents" } },
        { icon: "AudioLines", title: "Voice and audio", body: "Real two-person conversations, one 48 kHz track per speaker.", link: { label: "Explore Voice and audio", href: "/solutions/voice" } },
        { icon: "Brain", title: "LLM post-training", body: "Preference data, evaluations and red-teaming from vetted experts.", link: { label: "Explore LLM post-training", href: "/solutions/llm" } },
      ],
    },
    cta: { title: { before: "Tell us what ", em: "you're building." }, lead: reply },
  },
  "/solutions/agents": {
    tier: "full", metaTitle: "Agents · Abaka AI", parent: sol, crumb: "Agents",
    title: { before: "Data for agents\n", em: "that do the work." },
    lead: "Browser recordings, real-world tasks and working app replicas for training agents.",
    primary: expert, secondary: { label: "See RL environments", href: "/services/rl-environments" }, art: { kind: "forge", window: "queue" },
    bento: {
      intro: "What we provide", title: { before: "Every action,\n", em: "recorded and named." },
      cells: [
        { icon: "MousePointer2", title: "Browser recordings", body: "People doing real tasks in the browser, each action recorded and named." },
        { icon: "AppWindow", title: "RL environments", body: "Working copies of mail, calendar, CRM and other business apps." },
        { icon: "ClipboardCheck", title: "Golden run and verifier", body: "Every task ships with the correct steps and a check that scores a run." },
      ],
    },
    faq: { title: { before: "Questions about\n", em: "agent data." }, items: [checks, safe, { q: "Can you build tasks for our own app?", a: "Yes. Tell us the workflow and we scope tasks and environments around it.", confirm: true }] },
    cta: { title: { before: "Train your ", em: "agent." }, lead: `Tell us the tasks and the apps. ${reply}` },
  },
  "/solutions/voice": {
    tier: "full", metaTitle: "Voice and audio · Abaka AI", parent: sol, crumb: "Voice and audio",
    title: { before: "Real conversations\n", em: "for speech models." },
    lead: "Full-duplex conversations, multilingual TTS and ASR data.",
    primary: expert, secondary: { label: "See audio datasets", href: "/datasets#audio" }, art: { kind: "illustration", name: "tile-cloud" },
    bento: {
      intro: "What we record", title: { before: "Two people,\n", em: "two tracks." },
      cells: [
        { icon: "Mic", title: "One track per speaker", body: "Real two-person conversations, recorded at 48 kHz on separate tracks." },
        { icon: "AudioLines", title: "Every overlap marked", body: "Overlaps, backchannels and interruptions are all labelled." },
        { icon: "Globe", title: "Many languages", body: "Multilingual TTS and ASR data from a network that covers 45 languages." },
      ],
    },
    faq: { title: { before: "Questions about\n", em: "audio." }, items: [checks, safe, { q: "What formats do you deliver?", a: "Whatever your pipeline takes. We can convert the data to the format that fits your training setup." }] },
    cta: { title: { before: "Plan your ", em: "recordings." }, lead: `Tell us the languages and the hours you need. ${reply}` },
  },
  "/solutions/llm": {
    tier: "full", metaTitle: "LLM post-training · Abaka AI", parent: sol, crumb: "LLM post-training",
    title: { before: "Post-training data\n", em: "from experts." },
    lead: "Preference data, evaluations and red-teaming from vetted experts in math, code and reasoning.",
    primary: expert, secondary: { label: "See reasoning datasets", href: "/datasets#reasoning" }, art: { kind: "illustration", name: "tile-text" },
    bento: {
      intro: "What we provide", title: { before: "Human judgment,\n", em: "at scale." },
      cells: [
        { icon: "Users", title: "RLHF and preference data", body: "Experts rank and correct model answers in their own field." },
        { icon: "ClipboardCheck", title: "Evaluations", body: "Accuracy, robustness, safety, bias and tool calling, judged by people." },
        { icon: "ShieldCheck", title: "Red-teaming", body: "Vetted reviewers look for the failures before your users do." },
        { icon: "Code", title: "Reasoning and code", body: "Math, code and reasoning experts from a network of 500,046." },
      ],
    },
    faq: { title: { before: "Questions about\n", em: "post-training." }, items: [checks, safe, { q: "How is pricing set?", a: "By the task, the data and the volume. Every project starts with a free quote and a pilot." }] },
    cta: { title: { before: "Improve your ", em: "model." }, lead: `Tell us the model and the goal. ${reply}` },
  },

  /* ── Platform ── */
  "/platform": {
    tier: "full", metaTitle: "Abaka Forge · Abaka AI", parent: home, crumb: "Platform",
    title: { before: "Abaka Forge, where\n", em: "human judgment", after: " forges frontier AI." },
    lead: "One platform to collect, clean, label and deliver training data.",
    primary: { label: "Try Forge", href: "/platform/try" }, secondary: expert, art: { kind: "forge", window: "types" },
    bento: {
      intro: "Features", title: { before: "One tool,\n", em: "start to finish." },
      cells: [
        { icon: "Layers", title: "Every data type", body: "Images, 3D and 4D point clouds, RLHF, text and video, labelled in one tool." },
        { icon: "Workflow", title: "One platform, start to finish", body: "From raw data to delivery in one place." },
        { icon: "Bot", title: "Annotate faster", body: "A model drafts the label. A person corrects it." },
        { icon: "ListChecks", title: "Manage the work", body: "Every task, its stage and its review status in one queue." },
        { icon: "Cloud", title: "Runs where you need it", body: "In the cloud, on your premises, or both." },
      ],
    },
    faq: { title: { before: "Questions about\n", em: "Forge." }, items: [
      { q: "Can I run my own labeling on Forge?", a: "Yes. Forge has configurable workflows that both technical and non-technical team members can use.", confirm: true },
      { q: "Where does it run?", a: "In our cloud, on your premises, or both." },
      { q: "How is it priced?", a: "Credits start at $0.20 each.", confirm: true },
    ] },
    cta: { title: { before: "Start on ", em: "Forge." }, lead: `Try it yourself, or talk to us first. ${reply}` },
  },
  "/platform/try": {
    tier: "light", metaTitle: "Try Forge · Abaka AI", parent: { label: "Platform", href: "/platform" }, crumb: "Try Forge",
    title: { before: "Try ", em: "Abaka Forge." },
    lead: "Set up a workspace and label your own data, with our team on hand.",
    primary: { label: "Request access", href: "/contact?need=Forge" }, secondary: { label: "Explore Forge", href: "/platform" }, art: { kind: "forge", window: "annotate" },
    block: { title: "How access works", body: "Tell us your data and your team. We set up the workspace and walk you through it. Credits start at $0.20 each." },
    cta: { title: { before: "Ready to ", em: "label?" }, lead: reply },
  },

  /* ── Company ── */
  "/company": {
    tier: "index", metaTitle: "About Abaka · Abaka AI", parent: home, crumb: "Company",
    title: { before: "The team\n", em: "behind the data." },
    lead: "Self-funded, profitable and independent. Who we are, what we publish, and how to reach us.",
    primary: expert, art: { kind: "illustration", name: "way-dataset" },
    bento: {
      intro: "Company", title: { before: "About\n", em: "Abaka." },
      cells: [
        { icon: "ShieldCheck", title: "Why Abaka", body: "Self-funded, independent, confidential.", link: { label: "Why Abaka", href: "/company/why" } },
        { icon: "Briefcase", title: "Careers", body: "Join the team.", link: { label: "Open roles", href: "/careers" } },
        { icon: "FileText", title: "Blog", body: "Writing from the Abaka team.", link: { label: "Read the blog", href: "/blog" } },
        { icon: "Megaphone", title: "News", body: "Company announcements.", link: { label: "See news", href: "/news" } },
        { icon: "Calendar", title: "Events", body: "Where to meet us.", link: { label: "See events", href: "/events" } },
      ],
    },
    cta: { title: { before: "Talk to ", em: "the team." }, lead: reply },
  },
  "/company/why": {
    tier: "full", metaTitle: "Why Abaka · Abaka AI", parent: co, crumb: "Why Abaka",
    title: { before: "Independent\n", em: "by design." },
    lead: "Abaka is self-funded and profitable, and builds nothing that competes with you.",
    primary: expert, secondary: { label: "Trust center", href: "/trust" }, art: { kind: "illustration", name: "badge-soc2" },
    bento: {
      intro: "Our commitments", title: { before: "Your data,\n", em: "your rules." },
      cells: [
        { icon: "Coins", title: "Self-funded", body: "No venture capital, outside investors or acquisition pressure." },
        { icon: "Lock", title: "Never resold", body: "Your data is never resold, reused or shared." },
        { icon: "Building2", title: "No competing models", body: "We never build models or products that compete with yours." },
        { icon: "FileCheck", title: "NDA on every project", body: "Strict NDAs and a separate, secure pipeline for every project." },
      ],
    },
    showWhy: true,
    faq: { title: { before: "Questions about\n", em: "trust." }, items: [safe, checks, { q: "Who owns Abaka?", a: "Abaka is self-funded and profitable, free from venture capital, outside investors and acquisition pressure." }] },
    cta: { title: { before: "Talk to ", em: "us." }, lead: reply },
  },
  "/careers": {
    tier: "light", metaTitle: "Careers · Abaka AI", parent: co, crumb: "Careers",
    title: { before: "Join ", em: "the team." },
    lead: "We build the data frontier AI trains on.",
    primary: { label: "See open roles", href: "https://job-boards.greenhouse.io/abakaai" }, art: { kind: "offer", which: "call" },
    block: { title: "Open roles", body: "Abaka lists its open roles on its job board." },
    cta: { title: { before: "Questions about ", em: "a role?" }, lead: reply },
  },
  "/blog": {
    tier: "light", metaTitle: "Blog · Abaka AI", parent: co, crumb: "Blog",
    title: { before: "Writing from ", em: "the Abaka team." },
    lead: "On data, evaluation and training frontier models.",
    primary: { label: "Read on abaka.ai", href: "https://www.abaka.ai/blog" }, art: { kind: "offer", which: "sample" },
    block: { title: "The archive", body: "Posts are published on abaka.ai/blog." },
    cta: { title: { before: "Talk to ", em: "an expert." }, lead: reply },
  },
  "/news": {
    tier: "light", metaTitle: "News · Abaka AI", parent: co, crumb: "News",
    title: { before: "Company ", em: "announcements." },
    lead: "What's new at Abaka.",
    primary: { label: "Read on abaka.ai", href: "https://www.abaka.ai/news" }, art: { kind: "offer", which: "quote" },
    block: { title: "The archive", body: "Announcements are published on abaka.ai/news." },
    cta: { title: { before: "Talk to ", em: "an expert." }, lead: reply },
  },
  "/events": {
    tier: "light", metaTitle: "Events · Abaka AI", parent: co, crumb: "Events",
    title: { before: "Where to ", em: "meet us." },
    lead: "Conferences and meetups the Abaka team joins.",
    primary: { label: "See on abaka.ai", href: "https://www.abaka.ai/events" }, art: { kind: "offer", which: "call" },
    block: { title: "Upcoming events", body: "Events are listed on abaka.ai/events." },
    cta: { title: { before: "Talk to ", em: "an expert." }, lead: reply },
  },

  /* ── Outside the menus ── */
  "/sell-your-data": {
    tier: "full", metaTitle: "Sell your data · Abaka AI", parent: home, crumb: "Sell your data",
    title: { before: "Your old codebase\n", em: "can still earn." },
    lead: "Abaka licenses private codebases and company operating data to train and evaluate AI models. The valuation is free and confidential.",
    primary: { label: "Get a free valuation", href: "/contact" }, art: { kind: "scan", name: "cta-raw" },
    bento: {
      intro: "Two offers", title: { before: "What we\n", em: "license." },
      cells: [
        { icon: "Code", title: "Private codebases, up to $1M each", body: "Repos from shut-down startups, agency projects and internal tools. Good fit: 500+ pull requests, 3+ contributors, handwritten code from 2023 or earlier, full commit history." },
        { icon: "Building2", title: "Company data, up to $5M", body: "The docs, chats, tickets and SOPs your teams produce. Good fit: teams of 10 or more, several departments and roles." },
        { icon: "Clock", title: "Offer in 14 days", body: "A reply within 48 hours, a metadata-only scan that keeps your code on your machine, then a written offer." },
        { icon: "Handshake", title: "No fees, ever", body: "NDA before anything sensitive changes hands. Used only to train and evaluate AI models. Paid in two parts after quality checks." },
      ],
    },
    faq: { title: { before: "Questions about\n", em: "selling." }, items: [
      { q: "What can I sell?", a: "Private codebases, licensed for up to $1M each, and company operating data, for up to $5M per company." },
      { q: "How long does it take?", a: "A person replies within 48 hours. The scan takes minutes, and a written offer follows within 14 days." },
      { q: "Is the licence exclusive?", a: "The terms are set in the written offer for each deal.", confirm: true },
    ] },
    cta: { title: { before: "Find out what ", em: "it's worth." }, lead: "The valuation is free and confidential." },
  },
  "/trust": {
    tier: "full", metaTitle: "Trust center · Abaka AI", parent: home, crumb: "Trust center",
    title: { before: "Safe to hand over.\n", em: "Safe to train on." },
    lead: "How Abaka protects your data, sources its own, and checks the people who work on it.",
    primary: expert, secondary: { label: "Why Abaka", href: "/company/why" }, art: { kind: "illustration", name: "badge-iso27001" },
    bento: {
      intro: "Security", title: { before: "Controls\n", em: "you can check." },
      cells: [
        { icon: "ShieldCheck", title: "SOC 2 and ISO 27001", body: "Security, availability and confidentiality controls, and information security management.", confirm: true },
        { icon: "FileCheck", title: "GDPR and CCPA", body: "EU personal data protection and California consumer privacy.", confirm: true },
        { icon: "Lock", title: "Your data stays yours", body: "Encrypted in transit and at rest, with role-based access, under NDA, in a separate pipeline for each project." },
        { icon: "UserCheck", title: "People you can verify", body: "Five checks before anyone sees your data, and every batch reviewed." },
        { icon: "Cloud", title: "Where it runs", body: "Cloud, on-premise or hybrid." },
      ],
    },
    faq: { title: { before: "Questions about\n", em: "security." }, items: [
      safe,
      { q: "Can I get your security documentation?", a: "Ask your Abaka contact and we share it under NDA.", confirm: true },
      { q: "Where does the data come from?", a: "It is ethically sourced, with a provenance report for each project on request." },
    ] },
    cta: { title: { before: "Talk to ", em: "our team." }, lead: reply },
  },
  "/privacy": {
    tier: "light", metaTitle: "Privacy Policy · Abaka AI", parent: home, crumb: "Privacy Policy",
    title: { before: "Privacy ", em: "Policy." },
    lead: "How Abaka handles personal data.",
    primary: expert, art: { kind: "illustration", name: "badge-gdpr" },
    block: { title: "The policy", body: "The full policy text comes from Abaka and is published on this page." },
    cta: { title: { before: "Questions about ", em: "privacy?" }, lead: reply },
  },
  "/terms": {
    tier: "light", metaTitle: "Terms of Service · Abaka AI", parent: home, crumb: "Terms of Service",
    title: { before: "Terms of ", em: "Service." },
    lead: "The terms for using Abaka's site and services.",
    primary: expert, art: { kind: "illustration", name: "badge-ccpa" },
    block: { title: "The terms", body: "The full terms come from Abaka and are published on this page." },
    cta: { title: { before: "Questions about ", em: "the terms?" }, lead: reply },
  },
};
