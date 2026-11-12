import Link from "next/link";
import type { NavItem, NavLink } from "@/lib/nav";

/**
 * One dropdown panel. Every panel shares the same shell: a 310px intro cell on the left,
 * cells separated by vertical lines on the right. Only the right side's layout changes.
 */
export function NavPanel({ item }: { item: NavItem }) {
  return (
    <div className="flex overflow-clip rounded-b-window border-b border-border-default bg-surface-raised shadow-[0_12px_32px_rgb(20_20_20/0.06)]">
      <div className="flex w-[310px] shrink-0 flex-col justify-between gap-3 border-r border-border-default px-10 py-8">
        <div className="flex flex-col gap-3">
          <p className="text-title font-semibold leading-title">{item.intro.title}</p>
          <p className="text-sm leading-sm text-text-secondary">{item.intro.body}</p>
        </div>
        <Link href={item.intro.link.href} className="pt-2 text-body font-medium hover:underline underline-offset-4">
          {item.intro.link.label} →
        </Link>
      </div>
      <div className="flex min-w-0 flex-1">
        {item.layout === "icons" && <IconGrid links={item.links!} extra={item.extra} />}
        {item.layout === "numbered" && <Numbered links={item.links!} />}
        {item.layout === "columns" && <Columns item={item} />}
        {item.layout === "product" && <ProductShot />}
      </div>
    </div>
  );
}

/** Hover for any item inside a panel: canvas fill on the white panel, and an orange arrow fades in. */
const itemClass =
  "group relative flex flex-col gap-2.5 px-7 py-6 transition-colors duration-(--duration-fast) ease-out hover:bg-surface-page";

function ItemArrow() {
  return (
    <span aria-hidden className="absolute right-6 top-6 text-sm text-accent opacity-0 transition-opacity duration-(--duration-fast) group-hover:opacity-100">
      →
    </span>
  );
}

function IconGrid({ links, extra }: { links: NavLink[]; extra?: NavLink }) {
  const cells = extra ? [...links, extra] : links;
  const perRow = cells.length > 4 ? 4 : 2;
  const rows: NavLink[][] = [];
  for (let i = 0; i < cells.length; i += perRow) rows.push(cells.slice(i, i + perRow));
  return (
    <div className="flex flex-1 flex-col">
      {rows.map((row, r) => (
        <div key={r} className="flex flex-1 border-b border-border-default last:border-b-0">
          {row.map((link) => {
            const isExtra = link === extra;
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`${itemClass} flex-1 border-r border-border-default last:border-r-0 ${isExtra ? "hatch" : ""}`}
              >
                <span className="flex items-center gap-2.5">
                  {Icon ? (
                    <Icon aria-hidden className="size-(--icon-md) shrink-0" strokeWidth={1.5} />
                  ) : (
                    <span aria-hidden className="text-title text-accent">+</span>
                  )}
                  <span className="text-lead font-medium leading-body">{link.label}</span>
                </span>
                <span className={`text-sm leading-sm ${isExtra ? "font-medium text-text-primary" : "text-text-tertiary"}`}>
                  {link.description}
                  {isExtra && " →"}
                </span>
                {!isExtra && <ItemArrow />}
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function Numbered({ links }: { links: NavLink[] }) {
  return (
    <>
      {links.map((link, i) => (
        <Link key={link.label} href={link.href} className={`${itemClass} flex-1 border-r border-border-default py-8 last:border-r-0`}>
          <span className="label">{String(i + 1).padStart(2, "0")}</span>
          <span className="text-lead font-medium leading-body">{link.label}</span>
          <span className="flex-1 text-sm leading-sm text-text-secondary">{link.description}</span>
          <span className="pt-2 text-sm font-medium">Explore →</span>
        </Link>
      ))}
    </>
  );
}

function Columns({ item }: { item: NavItem }) {
  return (
    <>
      {item.groups!.map((group) => (
        <div key={group.label} className="flex flex-1 flex-col gap-5 border-r border-border-default px-7 py-8 last:border-r-0">
          <p className="label">{group.label}</p>
          {group.links.map((link) => (
            <Link key={link.label} href={link.href} className="group flex flex-col gap-1">
              <span className="text-lead font-medium leading-body group-hover:underline underline-offset-4">{link.label}</span>
              <span className="text-sm leading-sm text-text-secondary">{link.description}</span>
            </Link>
          ))}
        </div>
      ))}
    </>
  );
}

/** Platform panel: one product shot instead of forced categories. Numbers are placeholders. */
function ProductShot() {
  const dash = (w: number, accent = false) => (
    <span className="block h-[3px]" style={{ width: w, backgroundImage: `repeating-linear-gradient(90deg, ${accent ? "var(--color-accent)" : "var(--color-grey-500)"} 0 10px, transparent 10px 14px)` }} />
  );
  return (
    <div className="flex flex-1 overflow-clip bg-surface-page px-10 pt-8" aria-label="Forge analytics screen, illustrative">
      <div className="flex flex-1 flex-col rounded-t-window border border-b-0 border-border-default bg-surface-raised shadow-[0_12px_32px_rgb(20_20_20/0.06)]">
        <p className="border-b border-border-default px-5 py-3 font-mono text-mono-sm tracking-wider text-text-muted">
          ANNOTATION / PROJECT_[ N ] / ANALYTICS / <span className="text-text-primary">OVERVIEW</span>
        </p>
        <div className="flex flex-1">
          <ul className="w-[168px] shrink-0 space-y-0.5 border-r border-border-default px-2.5 py-4 text-[13px] text-text-secondary">
            <li className="px-2.5 py-1.5">Data</li>
            <li className="px-2.5 py-1.5 font-medium text-text-primary">Analytics</li>
            <li className="border-l-2 border-accent bg-surface-active py-1.5 pl-5 font-medium text-text-primary">Overview</li>
            {["Batch", "Team", "Member"].map((l) => (
              <li key={l} className="py-1.5 pl-[22px] text-text-tertiary">{l}</li>
            ))}
          </ul>
          <div className="flex flex-1 flex-col">
            <div className="flex border-b border-border-default">
              {["Active annotators", "Effective annotators", "Total annotators", "Working teams"].map((k) => (
                <div key={k} className="flex flex-1 flex-col gap-2 border-r border-border-default px-4 py-4 last:border-r-0">
                  <span className="whitespace-nowrap font-mono text-mono-sm uppercase tracking-wide text-text-muted">{k}</span>
                  <span className="font-mono text-body">[ n ]</span>
                </div>
              ))}
            </div>
            <div className="flex flex-1 gap-0">
              <div className="flex flex-1 flex-col gap-3.5 border-r border-border-default p-4">
                <span className="text-[13px] font-medium">Team quality</span>
                {[180, 150, 110, 165].map((w, i) => (
                  <span key={i} className="flex items-center gap-3 font-mono text-mono-sm text-text-tertiary">
                    team_[ {"abcd"[i]} ] {dash(w, i === 2)}
                  </span>
                ))}
              </div>
              <div className="flex flex-1 flex-col gap-3.5 p-4">
                <span className="text-[13px] font-medium">Workflow distribution</span>
                {[["accepted", 180], ["in review", 125], ["annotating", 90], ["queued", 40]].map(([l, w], i) => (
                  <span key={l} className={`flex items-center gap-3 font-mono text-mono-sm ${i === 2 ? "text-accent" : "text-text-tertiary"}`}>
                    <span className="w-20">{l}</span> {dash(w as number, i === 2)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
