import {
  BadgeCheck, Bot, Box, ClipboardList, Eye, FileCheck, Fingerprint, Gamepad2, Globe, Grab, Hand, Layers, Lock, MapPin,
  PackageCheck, SlidersHorizontal, Tag, Video,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FaqBlock } from "@/components/site/FaqBlock";
import { CaptureWindow } from "@/components/solutions/CaptureWindow";
import { CoverageTabs } from "@/components/solutions/CoverageTabs";
import { HumanDrawing, RobotDrawing, WorldDrawing } from "@/components/solutions/LayerDrawings";
import { Button } from "@/components/ui/Button";
import { Cell, Row, SectionGap, SectionHeader, SectionIntro } from "@/components/ui/Grid";
import { HeadingText } from "@/components/ui/Heading";
import { IconBox } from "@/components/ui/IconBox";
import { physicalAiPage as copy } from "@/lib/content";

export const metadata: Metadata = { title: copy.metaTitle };

/**
 * Physical AI (Paper "Physical AI · 4.0 v2"), the template the other solution and service pages copy:
 * the claim with a labelled capture next to it (principle 1), what is collected, how wide the coverage is,
 * how a project runs, how the data is kept, then one way to start (principle 4).
 */
const TOTAL = 5;
const layerIcons = [Eye, Bot, Globe];
const layerDrawings = [HumanDrawing, RobotDrawing, WorldDrawing];
const stepIcons = [ClipboardList, MapPin, Layers, Tag, SlidersHorizontal, PackageCheck];
const typeIcons = [Video, Layers, Hand, Fingerprint, Grab, Gamepad2, Box];
const trustIcons = [Lock, FileCheck, BadgeCheck];
/** hero heading: the orange part is the em */
const em = "[&_em]:not-italic [&_em]:text-text-accent";
/** 1px gaps over the line colour draw a grid's rules; cells sit on the page colour */
const ruled = "grid gap-px bg-border-default";

export default function PhysicalAiPage() {
  return (
    <>
      {/* hero, centred: breadcrumb, headline, lead, the two actions, then the capture window */}
      <section aria-labelledby="pai-title" className="border-b border-border-default">
        <div className="flex flex-col items-center gap-6 px-5 pb-10 pt-14 text-center lg:px-10 lg:pb-14 lg:pt-18">
          <nav aria-label="Breadcrumb">
            <ol className="flex gap-1.5 font-mono text-label uppercase leading-label tracking-label text-text-tertiary">
              <li><Link href="/solutions" className="transition-colors duration-(--duration-fast) ease-out hover:text-accent">{copy.crumbs[0]}</Link> /</li>
              <li aria-current="page" className="text-text-primary">{copy.crumbs[1]}</li>
            </ol>
          </nav>
          <h1 id="pai-title" className={`max-w-[860px] text-hero-sm font-heading leading-hero-sm tracking-(--tracking-display) text-text-heading lg:text-hero lg:leading-(--leading-hero) ${em}`}>
            <HeadingText h={copy.title} />
          </h1>
          <p className="max-w-[620px] text-lead leading-lead text-text-secondary lg:text-hero-lead">{copy.lead}</p>
          <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row">
            <Button href={copy.primary.href} size="lg">{copy.primary.label}</Button>
            <Button href={copy.secondary.href} variant="secondary" size="lg">{copy.secondary.label}</Button>
          </div>
        </div>
        <div className="px-5 pb-10 lg:px-10 lg:pb-14">
          <CaptureWindow />
        </div>
      </section>

      {/* statement */}
      <section aria-labelledby="pai-statement" className="flex flex-col items-center gap-6 px-5 py-16 text-center lg:px-10 lg:py-24">
        <h2 id="pai-statement" className="display max-w-[820px]"><HeadingText h={copy.statement.title} /></h2>
        <p className="max-w-[600px] text-lead leading-lead text-text-secondary">{copy.statement.body}</p>
      </section>

      {/* 01 · three layers */}
      <section aria-labelledby="pai-layers">
        <SectionIntro n={1} total={TOTAL} label={copy.layers.intro} spacer={false} />
        <SectionHeader id="pai-layers" title={<HeadingText h={copy.layers.title} />} lead={copy.layers.lead} />
        <Row>
          {copy.layers.items.map((l, i) => {
            const Drawing = layerDrawings[i];
            return (
              <Cell key={l.title} className="flex flex-1 basis-0 flex-col">
                <Drawing />
                <div className="flex flex-col gap-3 px-5 pb-9 pt-7 lg:px-8">
                  <IconBox icon={layerIcons[i]} size="sm" />
                  <p className="label">{l.step}</p>
                  <h3 className="text-h3 font-title leading-h3 tracking-snug text-text-heading">{l.title}</h3>
                  <p className="text-body leading-body text-text-secondary">{l.body}</p>
                  <p className="pt-1 font-mono text-mono-sm uppercase leading-mono-sm tracking-mono text-text-tertiary">{l.tags}</p>
                </div>
              </Cell>
            );
          })}
        </Row>
      </section>

      {/* 02 · coverage */}
      <section aria-labelledby="pai-coverage" className="border-b border-border-default">
        <SectionIntro n={2} total={TOTAL} label={copy.coverage.intro} />
        <SectionHeader id="pai-coverage" rule={false} title={<HeadingText h={copy.coverage.title} />} lead={copy.coverage.lead} />
        <CoverageTabs />
      </section>

      {/* 03 · how it works: six steps, then the seven data types */}
      <section aria-labelledby="pai-pipeline">
        <SectionIntro n={3} total={TOTAL} label={copy.pipeline.intro} />
        <SectionHeader id="pai-pipeline" title={<HeadingText h={copy.pipeline.title} />} lead={copy.pipeline.lead} />
        <ol className={`${ruled} grid-cols-1 border-b border-border-default sm:grid-cols-2 lg:grid-cols-3`}>
          {copy.pipeline.steps.map((s, i) => (
            <li key={s.title} className="flex flex-col gap-3 bg-surface-page px-5 pb-10 pt-8 lg:px-10">
              <IconBox icon={stepIcons[i]} className="mb-2" />
              <p className={`label ${i === 0 ? "text-text-accent" : ""}`}>{s.step}</p>
              <h3 className="text-title font-title leading-title tracking-snug text-text-heading">{s.title}</h3>
              <p className="text-body leading-body text-text-secondary">{s.body}</p>
            </li>
          ))}
        </ol>
        <div className={`${ruled} grid-cols-1 border-b border-border-default sm:grid-cols-2 lg:grid-cols-4`}>
          <div className="flex flex-col justify-end gap-1.5 bg-surface-page px-5 py-6 lg:px-10">
            <p className="label">{copy.pipeline.types.label}</p>
            <p className="text-sm leading-sm text-text-secondary">{copy.pipeline.types.body}</p>
          </div>
          {copy.pipeline.types.items.map((t, i) => {
            const Icon = typeIcons[i];
            return (
              <p key={t} className="flex items-center gap-3 bg-surface-page px-5 py-6 text-body leading-body text-text-primary lg:px-8">
                <Icon aria-hidden className="size-5 shrink-0 text-ink-56" strokeWidth={1.6} />
                {t}
              </p>
            );
          })}
        </div>
      </section>

      {/* 04 · your data */}
      <section aria-labelledby="pai-trust">
        <SectionIntro n={4} total={TOTAL} label={copy.trust.intro} />
        <div className="flex flex-col border-b border-border-default lg:flex-row">
          <div className="flex flex-col gap-4 border-b border-border-default px-5 py-10 lg:w-[376px] lg:shrink-0 lg:border-b-0 lg:border-r lg:px-10 lg:py-12">
            <h2 id="pai-trust" className="whitespace-pre-line text-h3 font-heading leading-h3 tracking-snug text-text-heading">{copy.trust.title}</h2>
            <p className="text-body leading-body text-text-secondary">{copy.trust.body}</p>
          </div>
          {copy.trust.items.map((t, i) => (
            <div key={t.title} className="flex flex-1 basis-0 flex-col gap-2.5 border-b border-border-default px-5 py-10 last:border-b-0 lg:border-b-0 lg:border-r lg:px-8 lg:py-12 lg:last:border-r-0">
              <IconBox icon={trustIcons[i]} className="mb-2" />
              <h3 className="text-title font-title leading-title tracking-snug text-text-heading">{t.title}</h3>
              <p className="text-body leading-body text-text-secondary">{t.body}</p>
              <p className="pt-2 font-mono text-mono-sm uppercase leading-mono-sm tracking-mono text-text-tertiary">{t.foot}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 05 · FAQ */}
      <SectionIntro n={5} total={TOTAL} label={copy.faq.intro} />
      <FaqBlock id="pai-faq" title={copy.faq.title} items={copy.faq.items} />

      {/* call to action, centred */}
      <SectionGap />
      <section aria-labelledby="pai-cta" className="flex flex-col items-center gap-6 border-b border-border-default px-5 py-14 text-center lg:px-10 lg:py-22">
        <h2 id="pai-cta" className="display"><HeadingText h={copy.cta.title} /></h2>
        <p className="max-w-[520px] text-lead leading-lead text-text-secondary">{copy.cta.lead}</p>
        <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row">
          <Button href={copy.primary.href} size="lg">{copy.primary.label}</Button>
          <Button href={copy.secondary.href} variant="secondary" size="lg">{copy.secondary.label}</Button>
        </div>
      </section>
    </>
  );
}
