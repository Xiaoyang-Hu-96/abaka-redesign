import { Box, Bot, Database, LayoutGrid, PackageCheck, ShieldCheck, Sigma, UserCheck, Users, Video } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DatasetTabs } from "@/components/home/DatasetTabs";
import { FaqBlock } from "@/components/site/FaqBlock";
import { Button, TextLink } from "@/components/ui/Button";
import { Cell, Row, SectionGap, SectionHeader, SectionIntro } from "@/components/ui/Grid";
import { HeadingText } from "@/components/ui/Heading";
import { IconBox } from "@/components/ui/IconBox";
import { datasetsPage as copy } from "@/lib/content";

export const metadata: Metadata = { title: copy.metaTitle };

/**
 * Datasets (Paper "Datasets · 4.0 v2"). The catalog itself is the homepage's folder tabs, so the two never differ;
 * around it: why buy off the shelf, three featured datasets with their starting prices, the FAQ and one request.
 * One primary action on the page: Request a dataset (principle 4). Prices sit next to what they price (principle 1).
 */
const TOTAL = 5;
const statIcons = [Database, LayoutGrid, Users];
const reasonIcons = [PackageCheck, UserCheck, ShieldCheck];
const cardIcons = [Sigma, Video, Box];
/** hero and CTA headings: the orange part is the em */
const em = "[&_em]:not-italic [&_em]:text-text-accent";

export default function DatasetsPage() {
  const f = copy.featured;
  return (
    <>
      {/* hero: breadcrumb, headline, lead and the two actions, then three numbers */}
      <section aria-labelledby="datasets-title" className="border-b border-border-default">
        <div className="flex flex-col gap-8 px-5 py-10 lg:flex-row lg:items-end lg:justify-between lg:gap-8 lg:px-10 lg:py-14">
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <nav aria-label="Breadcrumb">
              <ol className="flex gap-1.5 font-mono text-label uppercase leading-label tracking-label text-text-tertiary">
                <li><Link href="/" className="transition-colors duration-(--duration-fast) ease-out hover:text-accent">{copy.crumbs[0]}</Link> /</li>
                <li aria-current="page" className="text-text-primary">{copy.crumbs[1]}</li>
              </ol>
            </nav>
            <h1 id="datasets-title" className={`text-hero-sm font-heading leading-hero-sm tracking-(--tracking-display) text-text-heading lg:text-hero lg:leading-(--leading-hero) ${em}`}>
              <HeadingText h={copy.title} />
            </h1>
          </div>
          <div className="flex flex-col gap-6 lg:w-[300px] lg:shrink-0">
            <p className="text-lead leading-lead text-text-secondary lg:text-hero-lead">{copy.lead}</p>
            <div className="flex gap-3">
              <Button href={copy.primary.href}>{copy.primary.label}</Button>
              <Button href={copy.secondary.href} variant="secondary">{copy.secondary.label}</Button>
            </div>
          </div>
        </div>
        <dl className="grid grid-cols-1 border-t border-border-default sm:grid-cols-3">
          {copy.stats.map((s, i) => {
            const Icon = statIcons[i];
            return (
              <div key={s.label} className="flex flex-col gap-3 border-b border-border-default px-5 py-6 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 lg:px-10 lg:py-7">
                <Icon aria-hidden className="size-(--icon-md) text-ink-56" strokeWidth={1.6} />
                {/* the label comes first for screen readers; it shows under the number */}
                <dt className="label order-3">{s.label}</dt>
                <dd className="order-2 text-hero-sm font-heading leading-hero-sm tracking-(--tracking-display) text-text-heading lg:text-display lg:leading-display">{s.value}</dd>
              </div>
            );
          })}
        </dl>
      </section>

      {/* 01 · why off the shelf */}
      <section aria-labelledby="why-shelf">
        <SectionIntro n={1} total={TOTAL} label={copy.why.intro} />
        <SectionHeader id="why-shelf" title={<HeadingText h={copy.why.title} />} lead={copy.why.lead} />
        <Row>
          {copy.why.reasons.map((r, i) => (
            <Cell key={r.title} className="flex flex-1 basis-0 flex-col gap-4 px-5 pb-10 pt-8 lg:px-10">
              <IconBox icon={reasonIcons[i]} className="mb-2" />
              <h3 className="text-title font-title leading-title tracking-snug text-text-heading">{r.title}</h3>
              <p className="text-body leading-body text-text-secondary">{r.body}</p>
            </Cell>
          ))}
        </Row>
      </section>

      {/* 02 · featured: the Physical AI dataset with its task split, then three datasets with prices */}
      <section aria-labelledby="featured">
        <SectionIntro n={2} total={TOTAL} label={f.intro} />
        <SectionHeader id="featured" title={<HeadingText h={f.title} />} lead={f.lead} />
        <div className="flex flex-col border-b border-border-default lg:flex-row">
          <div className="flex flex-1 flex-col justify-between gap-8 border-b border-border-default p-5 lg:border-b-0 lg:border-r lg:p-10">
            <div className="flex flex-col gap-4">
              <IconBox icon={Bot} accent />
              <p className="label">{f.card.eyebrow}</p>
              <h3 className="text-h3 font-title leading-h3 tracking-snug text-text-heading">{f.card.title}</h3>
              <p className="text-body leading-body text-text-secondary">{f.card.body}</p>
              <ul className="flex flex-wrap gap-2">
                {f.card.tags.map((t) => (
                  <li key={t} className="border border-border-default px-2.5 py-1 font-mono text-mono-sm leading-mono-sm text-text-secondary">{t}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3 border-t border-border-default pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-mono-sm leading-mono-sm tracking-mono text-text-tertiary">{f.card.foot}</p>
              <TextLink href={f.card.link.href}>{f.card.link.label}</TextLink>
            </div>
          </div>
          <div className="flex flex-col gap-4 bg-surface-hover p-5 lg:w-[500px] lg:shrink-0 lg:p-10">
            <p className="label">{f.card.tableLabel}</p>
            {/* 1px gaps over the line colour draw the table's rules */}
            <dl className="grid grid-cols-1 gap-px border border-border-default bg-border-default sm:grid-cols-2">
              {f.card.tasks.map(([k, v], i) => (
                // with an odd count the last task takes the full row, so Scenes below it can too and stays on one line
                <div key={k} className={`flex justify-between gap-3 bg-surface-raised px-4 py-3 text-sm leading-ui ${f.card.tasks.length % 2 && i === f.card.tasks.length - 1 ? "sm:col-span-2" : ""}`}>
                  <dt className="text-text-secondary">{k}</dt>
                  <dd className="font-mono text-text-primary">{v}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-3 bg-surface-raised px-4 py-3 text-sm leading-ui text-text-tertiary sm:col-span-2">
                <dt>{f.card.scenes.label}</dt>
                <dd className="font-mono">{f.card.scenes.value}</dd>
              </div>
            </dl>
          </div>
        </div>
        <Row>
          {f.cards.map((c, i) => (
            <Cell key={c.name} className="flex flex-1 basis-0 flex-col justify-between gap-7 px-5 py-8 lg:px-10">
              <div className="flex flex-col gap-3">
                <IconBox icon={cardIcons[i]} size="sm" />
                <p className="label">{c.category}</p>
                <h3 className="text-title font-title leading-title tracking-snug text-text-heading">{c.name}</h3>
                <p className="text-body leading-body text-text-secondary">{c.body}</p>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-border-default pt-4">
                <p className="font-mono text-mono-sm leading-mono-sm text-text-tertiary">{c.price}</p>
                <TextLink href={copy.requestHref(c.name)} aria-label={`${copy.request} ${c.name}`}>{copy.request}</TextLink>
              </div>
            </Cell>
          ))}
        </Row>
      </section>

      {/* 03 · the catalog: the homepage's folder tabs; every dataset is listed, so no Browse all row */}
      <section aria-labelledby="catalog">
        <SectionIntro n={3} total={TOTAL} label={copy.catalog.intro} />
        <SectionHeader id="catalog" rule={false} title={<HeadingText h={copy.catalog.title} />} lead={copy.catalog.lead} />
        <DatasetTabs browseAll={false} />
      </section>

      {/* 04 · FAQ */}
      <SectionIntro n={4} total={TOTAL} label={copy.faq.intro} />
      <FaqBlock id="datasets-faq" title={copy.faq.title} items={copy.faq.items} />

      {/* 05 · request: the label sits in the block, not in a label row */}
      <SectionGap />
      <section aria-labelledby="datasets-cta" className="flex flex-col gap-8 border-b border-border-default px-5 py-12 lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:px-10 lg:py-18">
        <div className="flex flex-col gap-5 lg:w-[640px]">
          <p aria-hidden className="label">[ {String(TOTAL).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")} ] · {copy.cta.intro}</p>
          <h2 id="datasets-cta" className="display"><HeadingText h={copy.cta.title} /></h2>
          <p className="text-lead leading-lead text-text-secondary">{copy.cta.lead}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={copy.primary.href} size="lg">{copy.primary.label}</Button>
          <Button href={copy.secondary.href} variant="secondary" size="lg">{copy.secondary.label}</Button>
        </div>
      </section>
    </>
  );
}
