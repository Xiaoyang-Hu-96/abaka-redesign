import type { LucideIcon } from "lucide-react";

/**
 * A Lucide icon in a square box (Subpages 4.0). Two sizes: sm is 28px with an 18px icon (card headers),
 * md is 40px with a 20px icon (reason and step cells). Default is a raised white box with a hairline and an ink-56
 * icon; `accent` fills the box orange with an on-accent icon, for the one featured item on a page.
 */
export function IconBox({ icon: Icon, size = "md", accent = false, className = "" }: { icon: LucideIcon; size?: "sm" | "md"; accent?: boolean; className?: string }) {
  const box = size === "sm" ? "size-7" : "size-10";
  const glyph = size === "sm" ? "size-4.5" : accent ? "size-(--icon-md)" : "size-5";
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center ${box} ${
        accent ? "bg-accent text-text-on-accent" : "border border-border-default bg-surface-raised text-ink-56"
      } ${className}`}
    >
      <Icon className={glyph} strokeWidth={1.6} />
    </span>
  );
}
