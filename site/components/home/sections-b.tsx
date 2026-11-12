import { FileCheck, Lock, UserCheck } from "lucide-react";
import { Button, TextLink } from "@/components/ui/Button";
import { Cell, Row, SectionHeader } from "@/components/ui/Grid";
import { HeadingText } from "@/components/ui/Heading";
import { Illustration } from "@/components/ui/Illustration";
import { ScanArt } from "@/components/ui/ScanArt";
import { badges, faqSection, faqs, finalCta, platform, solutionsSection, why } from "@/lib/content";
import { solutions } from "@/lib/nav";
import { FaqList } from "./FaqList";
import { ForgeTour } from "./ForgeTour";
import { AnnotateWindow, PipelineWindow, QueueWindow, TypesWindow } from "./ForgeWindows";
import { SolutionsAccordion, SolutionsStack } from "./SolutionsAccordion";


/* ───────────── Solutions ───────────── */
/** Animated scenes, drawn in components/home/solutions-engine.ts */
const scenes = ["physical", "agents", "voice", "llm"];

export function Solutions() {
  const items = solutions.map((s, i) => ({ ...s, body: solutionsSection.bodies[i], scene: scenes[i] }));
  return (
    <section aria-labelledby="solutions">
      <SectionHeader
        id="solutions"
        title={<HeadingText h={solutionsSection.title} />}
        lead={solutionsSection.lead}
      />
      <SolutionsAccordion items={items} />

      {/* below lg: a tap-to-open stack of the same four */}
      <SolutionsStack items={items} />
    </section>
  );
}

/* ───────────── Platform: the Forge feature tour ───────────── */
export function Platform() {
  return (
    <section aria-labelledby="platform">
      <SectionHeader
        id="platform"
        title={<HeadingText h={platform.title} />}
        lead={platform.lead}
        link={<TextLink href={platform.link.href}>{platform.link.label}</TextLink>}
      />
      <ForgeTour>{[<TypesWindow key="t" />, <PipelineWindow key="p" />, <AnnotateWindow key="a" />, <QueueWindow key="q" />]}</ForgeTour>
    </section>
  );
}

/* ───────────── Why Abaka (proof, not clickable: no hover) ───────────── */
const proofIcons = [Lock, FileCheck, UserCheck];

export function Why() {
  return (
    <section aria-labelledby="why">
      <SectionHeader
        id="why"
        title={<HeadingText h={why.title} />}
        lead={why.lead}
        link={<TextLink href={why.link.href}>{why.link.label}</TextLink>}
      />
      <ul className="grid grid-cols-2 border-b border-border-default lg:grid-cols-4">
        {badges.map((b, i) => (
          <li key={b.id} className={`flex flex-col items-center gap-4 px-3 py-6 text-center lg:py-10 ${i % 2 === 0 ? "border-r" : "lg:border-r"} ${i < 2 ? "border-b lg:border-b-0" : ""} border-border-default lg:last:border-r-0`}>
            <Illustration name={`badge-${b.id}`} className="w-[112px]" />
            <span className="text-lead font-medium text-text-heading">{b.title}</span>
            <span className="max-w-[220px] text-sm leading-sm text-text-secondary">{b.body}</span>
          </li>
        ))}
      </ul>
      <Row>
        {why.proofs.map(({ title, body, foot }, i) => {
          const Icon = proofIcons[i];
          return (
          <Cell key={title} className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-4 px-5 py-8 lg:px-10">
              <Icon aria-hidden className="size-5" strokeWidth={1.5} />
              <h3 className="text-title font-title text-text-heading leading-title">{title}</h3>
              <p className="text-body leading-body text-text-secondary">{body}</p>
            </div>
            <p className="label border-t border-border-default px-5 py-4 lg:px-10">{foot}</p>
          </Cell>
          );
        })}
      </Row>
    </section>
  );
}

/* ───────────── FAQ: any number open at once, the height animates (FaqList) ───────────── */
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title">
      <header className="border-b border-border-default px-5 pb-8 pt-10 lg:px-10 lg:pb-12 lg:pt-16">
        <h2 id="faq-title" className="display">{faqSection.title}</h2>
      </header>
      <div className="flex border-b border-border-default">
        <div className="hidden w-[440px] shrink-0 border-r border-border-default lg:block" />
        <FaqList items={faqs} />
      </div>
    </section>
  );
}

/* ───────────── Final CTA ───────────── */
export function FinalCta() {
  return (
    <section aria-labelledby="cta" className="flex flex-col border-b border-border-default lg:h-[460px] lg:flex-row">
      <div className="flex border-b border-border-default lg:contents">
        <div className="flex flex-1 flex-col gap-3 border-r border-border-default p-4 lg:order-1 lg:w-[300px] lg:flex-none lg:p-6">
          <span className="font-mono text-mono-sm uppercase tracking-label text-text-muted">{finalCta.raw}</span>
          <ScanArt name="cta-raw" motion="drift" className="m-auto w-[150px] lg:w-[252px]" />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4 lg:order-3 lg:w-[300px] lg:flex-none lg:border-l lg:border-border-default lg:p-6">
          <span className="self-end font-mono text-mono-sm uppercase tracking-label text-text-muted">{finalCta.labelled}</span>
          <ScanArt name="cta-labelled" motion="label" className="m-auto w-[150px] lg:w-[252px]" />
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 py-12 text-center lg:order-2">
        <h2 id="cta" className="display"><HeadingText h={finalCta.title} /></h2>
        <p className="text-body leading-body text-text-secondary">{finalCta.lead}</p>
        <div className="flex w-full flex-col gap-2.5 pt-2 lg:w-auto lg:flex-row">
          <Button href={finalCta.primary.href} size="lg">{finalCta.primary.label}</Button>
          <Button href={finalCta.secondary.href} variant="secondary" size="lg">{finalCta.secondary.label}</Button>
        </div>
      </div>
    </section>
  );
}
