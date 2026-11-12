import type { ReactNode } from "react";

/**
 * Layout primitives for the site's one structure: a 1112px column drawn with 1px lines.
 * On mobile the column is inset 16px and every row stacks into one column.
 */

export function Column({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className="px-4">
      <div
        className={`mx-auto w-full max-w-(--container-column) border-x border-border-default ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

/** A horizontal band of cells. Stacks on small screens; lines between cells come from the cells. */
export function Row({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul";
}) {
  return (
    <Tag className={`flex flex-col border-b border-border-default lg:flex-row ${className}`}>
      {children}
    </Tag>
  );
}

/** One cell. Draws its own divider: below on mobile, to the right on desktop. */
export function Cell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border-b border-border-default last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0 ${className}`}
    >
      {children}
    </div>
  );
}

/** Section header cell: big headline left, a lead and one link right. */
export function SectionHeader({
  title,
  lead,
  link,
  id,
  rule = true,
}: {
  title: ReactNode;
  lead?: ReactNode;
  link?: ReactNode;
  id?: string;
  /** false when what follows draws its own top edge (the Datasets folder tabs), so the two lines don't double */
  rule?: boolean;
}) {
  return (
    <header className={`flex flex-col gap-4 ${rule ? "border-b border-border-default" : ""} px-5 pb-8 pt-10 lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:px-10 lg:pb-12 lg:pt-16`}>
      <h2 id={id} className="display max-w-[760px]">
        {title}
      </h2>
      {(lead || link) && (
        <div className="flex max-w-[420px] flex-col gap-4">
          {lead && <p className="text-body leading-body text-text-secondary lg:text-lead lg:leading-lead">{lead}</p>}
          {link}
        </div>
      )}
    </header>
  );
}

/**
 * The label row above a homepage section (Home · 4.0): a 96px gap, then "[ 03 / 09 ] · Datasets" in a 64px row.
 * Its rules run the full width of the page, past the column.
 */
export function SectionIntro({ n, total, label, spacer = true }: { n: number; total: number; label: string; spacer?: boolean }) {
  const pad = (x: number) => String(x).padStart(2, "0");
  const bleed = "pointer-events-none absolute left-1/2 w-screen -translate-x-1/2 border-t border-border-default";
  return (
    <div aria-hidden className="relative">
      {/* spacer={false} when the section above already ends in open space (Physical AI's statement) */}
      {spacer && (
        <>
          <span className={`${bleed} top-0`} />
          <div className="h-12 lg:h-24" />
        </>
      )}
      <span className={`${bleed} ${spacer ? "top-12 lg:top-24" : "top-0"}`} />
      <div className="flex h-16">
        <div className="relative flex items-center border-r border-border-default pl-5 pr-5 lg:w-[620px] lg:pl-10">
          <span className="absolute -left-px top-[22px] h-5 w-0.5 bg-accent" />
          <span className="whitespace-pre font-mono text-mono uppercase leading-sm tracking-mono text-text-muted">
            [ <span className="text-accent">{pad(n)}</span> / {pad(total)} ]{"   ·   "}
            <span className="text-text-tertiary">{label}</span>
          </span>
        </div>
      </div>
      <span className={`${bleed} bottom-0`} />
    </div>
  );
}

/** The 96px gap between sections without a label row (a page's closing call to action). Rules run full width. */
export function SectionGap() {
  const bleed = "pointer-events-none absolute left-1/2 w-screen -translate-x-1/2 border-t border-border-default";
  return (
    <div aria-hidden className="relative h-12 lg:h-24">
      <span className={`${bleed} top-0`} />
      <span className={`${bleed} bottom-0`} />
    </div>
  );
}
