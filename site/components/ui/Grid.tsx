import type { ReactNode } from "react";

/**
 * Layout primitives for the site's one structure: a 1240px column drawn with 1px lines.
 * On mobile the column is inset 16px and every row stacks into one column.
 */

export function Column({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className="px-4 lg:px-0">
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
}: {
  title: ReactNode;
  lead?: ReactNode;
  link?: ReactNode;
  id?: string;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-border-default px-5 pb-8 pt-14 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:px-10 lg:pb-12 lg:pt-24">
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
