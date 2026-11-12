import {
  AppWindow, AudioLines, BadgeDollarSign, Bot, Brain, Briefcase, Building2, Calendar, ClipboardCheck, Clock, Cloud, Code,
  Coins, Database, FileCheck, FileSearch, FileText, Globe, Handshake, Info, Layers, ListChecks, Lock, Megaphone, Mic,
  MousePointer2, Scan, ShieldCheck, UserCheck, Users, Workflow, type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { CallDrawing, QuoteDrawing, SampleDrawing } from "@/components/contact/OfferDrawings";
import { AnnotateWindow, PipelineWindow, QueueWindow, TypesWindow } from "@/components/home/ForgeWindows";
import { FORGE_WINDOW_W } from "@/components/home/forge-size";
import { Why } from "@/components/home/sections-b";
import { FaqBlock } from "@/components/site/FaqBlock";
import { PageCta } from "@/components/site/PageCta";
import { Button } from "@/components/ui/Button";
import { FitToWidth } from "@/components/ui/FitToWidth";
import { SectionHeader, SectionIntro } from "@/components/ui/Grid";
import { HeadingText } from "@/components/ui/Heading";
import { IconBox } from "@/components/ui/IconBox";
import { Illustration } from "@/components/ui/Illustration";
import { quietArrow, quietLink } from "@/components/ui/quiet-link";
import { ScanArt } from "@/components/ui/ScanArt";
import { templateLabels as labels, type TemplateArt, type TemplateCell, type TemplateIcon, type TemplatePage as Page } from "@/lib/content";

/**
 * One template for every page the prototype doesn't design in full (content: `templatePages` in lib/content.ts).
 *  - full:  hero, a bento of cells, FAQ, CTA
 *  - index: hero, a bento linking to the child pages, CTA
 *  - light: hero, one short block, CTA
 * The hero's drawing reuses the site's own art (Illustration SVGs, ScanArt, the Forge windows, the offer drawings),
 * always aria-hidden. Cells sit on the grid's 1px lines, square; only cells that link take the hover tint.
 */
const icons: Record<TemplateIcon, LucideIcon> = {
  Scan, Database, ClipboardCheck, AppWindow, Users, ShieldCheck, BadgeDollarSign, Clock, Bot, MousePointer2, AudioLines,
  Brain, Layers, Workflow, Cloud, Coins, Code, Building2, FileSearch, Lock, FileCheck, UserCheck, Info, Briefcase,
  FileText, Megaphone, Calendar, Globe, Handshake, Mic, ListChecks,
};
const windows = { types: TypesWindow, pipeline: PipelineWindow, annotate: AnnotateWindow, queue: QueueWindow };
const offers = { sample: SampleDrawing, call: CallDrawing, quote: QuoteDrawing };

function Art({ art }: { art: TemplateArt }) {
  if (art.kind === "illustration") return <Illustration name={art.name} className="w-50" />;
  if (art.kind === "scan") return <ScanArt name={art.name} motion={art.name === "cta-raw" ? "drift" : "label"} className="w-63" />;
  if (art.kind === "offer") {
    const Drawing = offers[art.which];
    return <div aria-hidden className="w-56 [&_svg]:max-w-none"><Drawing /></div>;
  }
  const Window = windows[art.window];
  return <FitToWidth width={FORGE_WINDOW_W}><Window /></FitToWidth>;
}

/** spans on the 3-column grid, so every row is full: 3 → 1·1·1, 4 → 2·1 / 1·2, 5 → 2·1 / 1·1·1 */
const spans: Record<number, number[]> = { 3: [1, 1, 1], 4: [2, 1, 1, 2], 5: [2, 1, 1, 1, 1] };

function Bento({ cells }: { cells: TemplateCell[] }) {
  const span = spans[cells.length] ?? cells.map(() => 1);
  return (
    // 1px gaps over the line colour draw the grid's rules
    <ul className="grid grid-cols-1 gap-px border-b border-border-default bg-border-default lg:grid-cols-3">
      {cells.map((c, i) => (
        <li
          key={c.title}
          className={`relative flex flex-col gap-3 bg-surface-page px-5 pb-10 pt-8 lg:px-10 ${span[i] === 2 ? "lg:col-span-2" : ""} ${
            c.link ? "group transition-colors duration-(--duration-base) ease-out hover:bg-surface-hover" : ""
          }`}
        >
          <IconBox icon={icons[c.icon]} className="mb-2" />
          <h3 className="text-title font-title leading-title tracking-snug text-text-heading">{c.title}</h3>
          <p className="max-w-[560px] text-body leading-body text-text-secondary">{c.body}</p>
          {c.link && (
            // the link covers the whole cell, so the cell is the target
            <Link href={c.link.href} className={`mt-auto flex items-center gap-1.5 pt-2 text-sm font-medium after:absolute after:inset-0 ${quietLink}`}>
              {c.link.label} <span aria-hidden className={quietArrow()}>→</span>
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

export function TemplatePage({ path, page }: { path: string; page: Page }) {
  const id = path.slice(1).replaceAll("/", "-");
  // numbered sections, in order: the bento or block, Why Abaka, the FAQ
  const sections = [page.bento?.intro ?? (page.block ? page.crumb : undefined), page.showWhy ? labels.why : null, page.faq ? labels.faq : null].filter(Boolean) as string[];
  const n = (label: string) => sections.indexOf(label) + 1;
  const em = "[&_em]:not-italic [&_em]:text-text-accent";

  return (
    <>
      <section aria-labelledby={`${id}-title`} className="flex flex-col border-b border-border-default lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-6 px-5 py-12 lg:px-10 lg:py-16">
          <nav aria-label="Breadcrumb">
            <ol className="flex gap-1.5 font-mono text-label uppercase leading-label tracking-label text-text-tertiary">
              <li><Link href={page.parent.href} className="transition-colors duration-(--duration-fast) ease-out hover:text-accent">{page.parent.label}</Link> /</li>
              <li aria-current="page" className="text-text-primary">{page.crumb}</li>
            </ol>
          </nav>
          <h1 id={`${id}-title`} className={`text-hero-sm font-heading leading-hero-sm tracking-(--tracking-display) text-text-heading lg:text-display lg:leading-display ${em}`}>
            <HeadingText h={page.title} />
          </h1>
          <p className="max-w-[520px] text-lead leading-lead text-text-secondary">{page.lead}</p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button href={page.primary.href} size="lg">{page.primary.label}</Button>
            {page.secondary && <Button href={page.secondary.href} variant="secondary" size="lg">{page.secondary.label}</Button>}
          </div>
        </div>
        <div aria-hidden className="flex items-center justify-center border-t border-border-default bg-surface-raised p-8 lg:w-[440px] lg:shrink-0 lg:border-l lg:border-t-0">
          <Art art={page.art} />
        </div>
      </section>

      {page.bento && (
        <section aria-labelledby={`${id}-bento`}>
          <SectionIntro n={n(page.bento.intro)} total={sections.length} label={page.bento.intro} />
          <SectionHeader id={`${id}-bento`} title={<HeadingText h={page.bento.title} />} lead={page.bento.lead} />
          <Bento cells={page.bento.cells} />
        </section>
      )}

      {page.block && (
        <section aria-labelledby={`${id}-block`}>
          {/* the label row names the page; the block's own title is the heading below it */}
          <SectionIntro n={1} total={sections.length} label={page.crumb} />
          <div className="flex flex-col gap-4 border-b border-border-default px-5 py-12 lg:px-10 lg:py-16">
            <h2 id={`${id}-block`} className="text-h3 font-title leading-h3 tracking-snug text-text-heading">{page.block.title}</h2>
            <p className="max-w-[640px] text-lead leading-lead text-text-secondary">{page.block.body}</p>
          </div>
        </section>
      )}

      {page.showWhy && (
        <>
          <SectionIntro n={n(labels.why)} total={sections.length} label={labels.why} />
          <Why />
        </>
      )}

      {page.faq && (
        <>
          <SectionIntro n={n(labels.faq)} total={sections.length} label={labels.faq} />
          <FaqBlock id={`${id}-faq`} title={page.faq.title} items={page.faq.items} />
        </>
      )}

      <PageCta id={`${id}-cta`} title={page.cta.title} lead={page.cta.lead} primary={page.primary} secondary={page.secondary} />
    </>
  );
}
