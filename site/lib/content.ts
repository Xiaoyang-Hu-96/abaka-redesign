/**
 * Homepage and catalog content. Typed data, not markup, so the same facts feed every page.
 * Anything not confirmed by Abaka's current site is marked `placeholder: true` and shown as such.
 */

export type Dataset = { name: string; placeholder?: boolean };
export type Category = { id: string; label: string; datasets: Dataset[] };

/** Dataset names are from abaka.ai. Sizes, formats and prices are not public, so the catalog marks them as placeholders. */
export const categories: Category[] = [
  { id: "coding", label: "Coding", datasets: [{ name: "Repo Patch Dataset" }, { name: "Competitive Coding Dataset" }, { name: "Code Understanding Dataset" }] },
  { id: "reasoning", label: "Reasoning", datasets: [{ name: "Multimodal Chart-Analysis" }, { name: "AB-HLE Math QA" }, { name: "IMO Level Lean4 Formalization" }] },
  { id: "image", label: "Image", datasets: [{ name: "Interleaved/Image-Editing" }, { name: "Animation Dataset" }, { name: "Stock Images With Dense Captions" }] },
  { id: "video", label: "Video", datasets: [{ name: "Stock Videos With Dense Captions" }, { name: "360-degree Camera and Body Motion Videos" }, { name: "Talking Head Videos" }] },
  { id: "agentic", label: "Agentic", datasets: [{ name: "Browser Recording Dataset" }, { name: "Long Chain Agentic Dataset" }, { name: "Real World Tasks Dataset" }] },
  { id: "audio", label: "Audio", datasets: [{ name: "Conversational Dataset" }, { name: "Multilingual TTS" }, { name: "Multilingual ASR" }] },
  { id: "3d", label: "3D", datasets: [{ name: "Indoor Scenes and Floor Plans" }, { name: "3D Objects" }, { name: "Multi-Format 3D" }] },
];

export const placeholderLogos = ["OpenAI", "ANTHROPIC", "Google DeepMind", "Meta", "MISTRAL AI", "cohere", "NVIDIA", "Microsoft"];

export const layers = [
  { step: "04 · Evaluate", title: "Evaluation", body: "Model box scored against the label." },
  { step: "03 · Annotate", title: "Annotation", body: "Labelled by a person, then reviewed.", active: true },
  { step: "02 · Curate", title: "Curation", body: "Duplicate and blurred frames removed." },
  { step: "01 · Collect", title: "Collection", body: "One clip captured as raw frames." },
  { step: "Base · Forge", title: "Abaka Forge", body: "The platform all four layers run on." },
];

export const faqs = [
  "How is pricing set?",
  "How is my data kept safe?",
  "What formats do you deliver?",
  "How fast can we start?",
  "Can I buy a ready-made dataset?",
  "Which fields do your experts cover?",
  "Can I run my own labeling on Forge?",
  "Can I sell my data to Abaka?",
];

export const badges = [
  { id: "soc2", title: "SOC 2", body: "Security, availability and confidentiality controls" },
  { id: "iso27001", title: "ISO 27001", body: "Information security management" },
  { id: "gdpr", title: "GDPR", body: "EU personal data protection" },
  { id: "ccpa", title: "CCPA", body: "California consumer privacy" },
];
