"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

/**
 * FAQ rows; any number can be open at once. Opening grows the row's height (slow, 320ms) and the rows below slide down;
 * closing is quicker (fast, 120ms), the way Firecrawl's FAQ feels. The answer is revealed by the height, not faded.
 * Height animates through grid-template-rows 0fr → 1fr, so no measuring is needed. Reduced motion: instant.
 * Each question is a button with aria-expanded and aria-controls, so it reads and works like a disclosure.
 */
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  // the first answer is open on load (Home · 4.0)
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (!next.delete(i)) next.add(i);
      return next;
    });
  const id = useId();

  return (
    <div className="flex-1">
      {items.map(({ q, a }, i) => {
        const isOpen = open.has(i);
        return (
          <div
            key={q}
            className={`border-b border-border-default transition-colors duration-(--duration-slow) last:border-b-0 ${isOpen ? "bg-surface-selected" : ""}`}
          >
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${id}-${i}`}
                onClick={() => toggle(i)}
                // the open row is already white (selected); tinting only its question would split it in two
                className={`group flex w-full cursor-pointer items-center justify-between gap-6 px-5 pt-6 text-left text-lg font-title text-text-heading leading-row transition-colors duration-(--duration-base) lg:px-10 lg:pt-[30px] ${isOpen ? "pb-3" : "pb-6 hover:bg-surface-hover lg:pb-[30px]"}`}
              >
                {q}
                {/* Paper 4.0: a chevron that turns up when open */}
                <ChevronDown
                  aria-hidden
                  strokeWidth={1.5}
                  className={`size-4 shrink-0 text-ink-56 transition-[rotate,color] duration-(--duration-base) ease-out group-hover:text-text-primary motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
            </h3>
            <div
              id={`${id}-${i}`}
              role="region"
              aria-label={q}
              inert={!isOpen}
              className={`grid motion-reduce:transition-none ${
                isOpen
                  ? "grid-rows-[1fr] transition-[grid-template-rows] duration-(--duration-slow) ease-out"
                  : "grid-rows-[0fr] transition-[grid-template-rows] duration-(--duration-fast) ease-out"
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-[560px] px-5 pb-6 text-lead leading-lead text-text-secondary lg:box-content lg:px-10 lg:pb-[30px]">{a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
