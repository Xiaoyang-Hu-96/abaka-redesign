import type { Metadata } from "next";
import Link from "next/link";
import { HeadingText } from "@/components/ui/Heading";
import { linkedRoutes } from "@/lib/routes";
import { sitemap as copy, type SitemapPage } from "@/lib/sitemap";

export const metadata: Metadata = { title: "Sitemap · Abaka AI" };

/**
 * The site's structure as a tree: the homepage, five menus, their pages, and the pages outside the menus.
 * A solid box is designed in full (a filled square: built in code; an open square: designed in Paper); a dashed
 * box is a template page. Built from the same tokens as the rest of the site.
 *
 * The build fails if a page the site links to is missing from lib/sitemap.ts, so the tree cannot drift.
 */
const listed = new Set([
  copy.home.path,
  ...copy.groups.flatMap((g) => g.pages.map((p) => p.path)),
  ...copy.outside.map((p) => p.path),
  ...copy.internal,
]);
const missing = linkedRoutes.filter((p) => !listed.has(p));
if (missing.length) throw new Error(`lib/sitemap.ts is missing linked pages: ${missing.join(", ")}`);

const line = "bg-grey-400"; // connector colour
const BOX = "h-10"; // every box is 40px tall, so connectors can meet its middle

function Marker({ status }: { status: SitemapPage["status"] }) {
  if (status === "outline") return null;
  return <span aria-hidden className={`size-2 shrink-0 border border-ink ${status === "built" ? "bg-ink" : ""}`} />;
}

function Tag({ tag }: { tag: SitemapPage["tag"] }) {
  if (!tag) return null;
  return (
    <span className={`shrink-0 font-mono text-micro uppercase leading-micro tracking-mono text-accent`}>
      {copy.legend[tag]}
    </span>
  );
}

function PageBox({ p }: { p: SitemapPage }) {
  const full = p.status !== "outline";
  const cls = `flex ${BOX} items-center gap-1.5 px-2 text-sm leading-sm ${
    full ? "border border-grey-400 bg-surface-raised text-text-heading" : "border border-dashed border-grey-400 text-text-secondary"
  }`;
  const inner = (
    <>
      <Marker status={p.status} />
      <span className="min-w-0 flex-1 truncate">{p.name}</span>
      <Tag tag={p.tag} />
    </>
  );
  // every page exists: designed pages and template pages both open
  return p.status !== "paper" ? (
    <Link href={p.path} className={`${cls} transition-colors duration-(--duration-fast) ease-out hover:bg-surface-hover`}>{inner}</Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

/** A menu and its pages: the menu box, then each page hung off a vertical spine. */
function Branch({ label, pages }: { label: string; pages: SitemapPage[] }) {
  return (
    <div className="flex flex-col">
      {/* stub up to the bar that joins the five menus (desktop) */}
      <span aria-hidden className={`mx-auto hidden h-6 w-px lg:block ${line}`} />
      <div className={`flex ${BOX} items-center bg-surface-inverse px-2.5 text-sm font-heading leading-sm text-text-inverse`}>{label}</div>
      <ul className="ml-2">
        {pages.map((p, i) => {
          const last = i === pages.length - 1;
          return (
            <li key={p.path} className="relative pl-3 pt-2">
              {/* spine: runs to the next page, or stops at the middle of the last one (pt-2 + half of 40px = 28px) */}
              <span aria-hidden className={`absolute left-0 top-0 w-px ${line} ${last ? "h-7" : "h-full"}`} />
              <span aria-hidden className={`absolute left-0 top-7 h-px w-3 ${line}`} />
              <PageBox p={p} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Legend() {
  const item = "flex items-center gap-2";
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-mono-sm leading-mono-sm text-text-tertiary">
      <li className={item}><Marker status="built" />{copy.legend.built}</li>
      <li className={item}><Marker status="paper" />{copy.legend.paper}</li>
      <li className={item}><span aria-hidden className="h-3 w-5 border border-dashed border-grey-400" />{copy.legend.outline}</li>
      <li className={`${item} text-accent`}>{copy.legend.new.toUpperCase()}</li>
      <li className={item}>{copy.legend.existing}</li>
    </ul>
  );
}

export default function SitemapPage() {
  return (
    <>
      <header className="flex flex-col gap-6 border-b border-border-default px-5 pb-10 pt-14 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:pb-12 lg:pt-24">
        <div className="flex flex-col gap-4">
          <p className="label">{copy.label}</p>
          <h1 className="display max-w-[700px]">
            <HeadingText h={copy.title} />
          </h1>
        </div>
        <p className="max-w-[420px] text-lead leading-lead text-text-secondary">{copy.lead}</p>
      </header>

      <section aria-label="Site tree" className="flex flex-col gap-10 border-b border-border-default px-5 py-10 lg:px-10 lg:py-12">
        <Legend />

        <div className="flex flex-col">
          <div className="lg:mx-auto lg:w-[200px]"><PageBox p={copy.home} /></div>
          <span aria-hidden className={`mx-auto hidden h-6 w-px lg:block ${line}`} />
          {/* five menus; the bar joins the middle of the first column to the middle of the last (gap 16px × 4) */}
          <div className="relative grid grid-cols-1 gap-8 pt-8 lg:grid-cols-5 lg:gap-4 lg:pt-0">
            <span aria-hidden className={`absolute top-0 hidden h-px lg:block ${line} left-[calc((100%-64px)/10)] right-[calc((100%-64px)/10)]`} />
            {copy.groups.map((g) => <Branch key={g.label} label={g.label} pages={g.pages} />)}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border-default pt-8">
          <p className="label">{copy.outsideLabel}</p>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            {copy.outside.map((p) => <li key={p.path}><PageBox p={p} /></li>)}
          </ul>
        </div>
      </section>

      <section aria-labelledby="changes">
        <h2 id="changes" className="label border-b border-border-default px-5 py-6 lg:px-10">{copy.changesLabel}</h2>
        <div className="flex flex-col border-b border-border-default lg:flex-row">
          {copy.changes.map((c) => (
            <div key={c.label} className="flex flex-1 flex-col gap-3 border-b border-border-default px-5 py-8 last:border-b-0 lg:border-b-0 lg:border-r lg:px-10 lg:last:border-r-0">
              <h3 className="text-title font-title leading-title text-text-heading">{c.label}</h3>
              <ul className="flex flex-col gap-2">
                {c.items.map((item) => (
                  <li key={item} className="text-sm leading-sm text-text-secondary">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="key">
        <h2 id="key" className="label border-b border-border-default px-5 py-6 lg:px-10">{copy.keyLabel}</h2>
        <div className="flex flex-col lg:flex-row">
          {copy.key.map((k, i) => (
            <div key={k.name} className="flex flex-1 flex-col gap-2 border-b border-border-default px-5 py-8 lg:border-r lg:px-10 lg:last:border-r-0">
              <span className="font-mono text-mono leading-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-title font-title leading-title text-text-heading">{k.name}</h3>
              <p className="text-sm leading-sm text-text-secondary">{k.why}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
