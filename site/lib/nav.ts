import type { LucideIcon } from "lucide-react";
import {
  AppWindow,
  AudioLines,
  Box,
  Briefcase,
  Calendar,
  CircleHelp,
  ClipboardCheck,
  CodeXml,
  Database,
  FileText,
  Image,
  Info,
  Megaphone,
  MessageSquare,
  MousePointer2,
  Scan,
  ShieldCheck,
  Sigma,
  Video,
} from "lucide-react";

/** Navigation content. Shared by the desktop dropdowns, the mobile menu and the footer, so they never disagree. */

export type NavLink = { label: string; href: string; description?: string; icon?: LucideIcon };
export type NavGroup = { label: string; links: NavLink[] };
export type NavItem = {
  label: string;
  href: string;
  intro: { title: string; body: string; link: NavLink };
  /** How the right side of the panel is laid out. */
  layout: "icons" | "numbered" | "columns" | "product";
  links?: NavLink[];
  groups?: NavGroup[];
  extra?: NavLink;
};

export const datasetCategories: NavLink[] = [
  { label: "Coding", href: "/datasets#coding", description: "Repo Patch · Competitive Coding", icon: CodeXml },
  { label: "Reasoning", href: "/datasets#reasoning", description: "Chart Analysis · Math QA", icon: Sigma },
  { label: "Image", href: "/datasets#image", description: "Image Editing · Animation", icon: Image },
  { label: "Video", href: "/datasets#video", description: "Talking Head · 360° Camera", icon: Video },
  { label: "Agentic", href: "/datasets#agentic", description: "Browser Recording · Real World Tasks", icon: MousePointer2 },
  { label: "Audio", href: "/datasets#audio", description: "Conversational · Multilingual TTS", icon: AudioLines },
  { label: "3D", href: "/datasets#3d", description: "Indoor Scenes · 3D Objects", icon: Box },
];

export const services: NavLink[] = [
  {
    label: "Annotation",
    href: "/services/annotation",
    description: "Domain experts for data annotation, RLHF and model evaluation, with quality control built in.",
    icon: Scan,
  },
  {
    label: "Data collection",
    href: "/services/data-collection",
    description: "Diverse, ethically sourced data, handled under SOC 2, ISO 27001 and GDPR.",
    icon: Database,
  },
  {
    label: "Model evaluation",
    href: "/services/model-evaluation",
    description: "Experts test your model for accuracy, robustness, safety, bias and tool calling.",
    icon: ClipboardCheck,
  },
  {
    label: "RL environments",
    href: "/services/rl-environments",
    description: "Where agents learn the job, inside working replicas of the enterprise apps they will use.",
    icon: AppWindow,
  },
];

export const solutions: NavLink[] = [
  { label: "Physical AI", href: "/solutions/physical-ai", description: "Robot and sensor data, labelled frame by frame." },
  { label: "Agents", href: "/solutions/agents", description: "Browser recordings and real-world tasks for training agents." },
  { label: "Voice and audio", href: "/solutions/voice", description: "Full-duplex conversations, multilingual TTS and ASR." },
  { label: "LLM post-training", href: "/solutions/llm", description: "RLHF, reasoning and coding data, checked by domain experts." },
];

export const nav: NavItem[] = [
  {
    label: "Datasets",
    href: "/datasets",
    layout: "icons",
    intro: {
      title: "Off-the-shelf datasets",
      body: "Ready-made training data in seven categories. Pick one and request it.",
      link: { label: "All datasets", href: "/datasets" },
    },
    links: datasetCategories,
    extra: { label: "Need other data?", href: "/datasets/request", description: "Request a dataset" },
  },
  {
    label: "Services",
    href: "/services",
    layout: "icons",
    intro: {
      title: "Work with domain experts",
      body: "Not sure which one fits? Tell us the model and the goal.",
      link: { label: "Talk to an expert", href: "/contact" },
    },
    links: services,
  },
  {
    label: "Platform",
    href: "/platform",
    layout: "product",
    intro: {
      title: "Abaka Forge",
      body: "One platform to collect, clean, label and deliver training data.",
      link: { label: "Explore Forge", href: "/platform" },
    },
  },
  {
    label: "Solutions",
    href: "/solutions",
    layout: "numbered",
    intro: {
      title: "Data for what you are building",
      body: "Four kinds of model, four kinds of data.",
      link: { label: "All solutions", href: "/solutions" },
    },
    links: solutions,
  },
  {
    label: "Company",
    href: "/company",
    layout: "columns",
    intro: {
      title: "The team behind the data",
      body: "Who we are, what we publish, and how to reach us.",
      link: { label: "About Abaka", href: "/company" },
    },
    groups: [
      {
        label: "About",
        links: [
          { label: "About Abaka", href: "/company", description: "Who we are and how we work", icon: Info },
          { label: "Why Abaka", href: "/company/why", description: "Self-funded, independent, confidential", icon: ShieldCheck },
          { label: "Careers", href: "/careers", description: "Join the team", icon: Briefcase },
        ],
      },
      {
        label: "Resources",
        links: [
          { label: "Blog", href: "/blog", description: "Writing from the Abaka team", icon: FileText },
          { label: "News", href: "/news", description: "Company announcements", icon: Megaphone },
          { label: "Events", href: "/events", description: "Where to meet us", icon: Calendar },
        ],
      },
      {
        label: "Support",
        links: [
          { label: "FAQ", href: "/#faq", description: "Pricing, security and delivery", icon: CircleHelp },
          { label: "Talk to an expert", href: "/contact", description: "We reply within 1 business day", icon: MessageSquare },
        ],
      },
    ],
  },
];
