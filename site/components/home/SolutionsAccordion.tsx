"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { solutionsSection } from "@/lib/content";
import { ms } from "@/lib/time";
import { delayHoverIntent } from "@/lib/tokens";
import { SolutionCanvas } from "./SolutionCanvas";

type Item = { label: string; href: string; body: string; scene: string };

/**
 * Desktop Solutions row. One panel is open at a time (638px, like the old fixed Physical AI card); the others
 * collapse to 200px strips with a vertical title. Hovering a strip opens it after 80ms, so sweeping the pointer
 * across the row doesn't flash every panel; leaving the row keeps the last one open. Focus opens it too.
 *
 * Touch (a tablet at lg width): there is no hover, so the first tap on a closed panel opens it and a tap on the open
 * panel follows its link. Only a mouse opens panels by hovering.
 *
 * Only flex-grow animates. The open content is laid out at full width from the start and clipped by the panel,
 * so text never reflows while the width changes. Reduced motion: it switches without the transition.
 */
export function SolutionsAccordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // how the last press started, so a touch tap on a closed panel opens it instead of navigating
  const pointer = useRef<string>("mouse");
  const enter = (i: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(i), ms(delayHoverIntent));
  };

  return (
    <div className="hidden h-[600px] border-b border-border-default lg:flex">
      {items.map((s, i) => {
        const isOpen = open === i;
        return (
          <Link
            key={s.label}
            href={s.href}
            onPointerEnter={(e) => { if (e.pointerType === "mouse") enter(i); }}
            onPointerLeave={() => clearTimeout(timer.current)}
            onPointerDown={(e) => { pointer.current = e.pointerType; }}
            onClick={(e) => {
              if (pointer.current !== "mouse" && !isOpen) {
                e.preventDefault();
                setOpen(i);
              }
            }}
            onFocus={() => setOpen(i)}
            data-open={isOpen}
            style={{ flex: `${isOpen ? 638 : 200} 1 0px` }}
            className={`group relative min-w-0 overflow-hidden border-r border-border-default transition-[flex-grow,background-color] duration-(--duration-slow) ease-(--ease-out) last:border-r-0 motion-reduce:transition-none ${
              isOpen ? "bg-surface-hover" : "hover:bg-surface-hover"
            }`}
          >
            <span className="label absolute left-8 top-8 z-10">{String(i + 1).padStart(2, "0")}</span>

            {/* the scene stays centred, so a strip shows the middle of it and opening reveals the rest; only the open one plays */}
            <SolutionCanvas
              scene={s.scene}
              active={isOpen}
              className={`absolute left-1/2 top-0 h-[360px] w-[634px] -translate-x-1/2 transition-opacity duration-(--duration-slow) motion-reduce:transition-none ${isOpen ? "opacity-100" : "opacity-60"}`}
            />

            {/* closed: vertical title */}
            <span
              aria-hidden
              className={`absolute bottom-8 left-8 text-h3 font-title text-text-heading leading-h3 tracking-snug [writing-mode:vertical-rl] rotate-180 transition-opacity duration-(--duration-fast) motion-reduce:transition-none ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            >
              {s.label}
            </span>

            {/* open: title, text, link, laid out at the open width and sat on the bottom edge, level with the
                strips' vertical titles */}
            <div
              className={`absolute bottom-8 left-0 flex w-[638px] flex-col gap-3 px-8 transition-opacity motion-reduce:transition-none ${
                isOpen ? "opacity-100 delay-150 duration-(--duration-slow)" : "pointer-events-none opacity-0 duration-(--duration-fast)"
              }`}
            >
              <h3 className="text-h3 font-title leading-h3 tracking-snug text-text-accent">{s.label}</h3>
              <p className="max-w-[490px] text-body leading-body text-text-secondary">{s.body}</p>
              <span className="text-body font-medium">
                {solutionsSection.explore} {s.label}{" "}
                <span aria-hidden className="inline-block transition-[translate,color] duration-(--duration-base) group-hover:translate-x-1 group-hover:text-accent">→</span>
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/**
 * Below lg: the same four solutions as a vertical accordion. Physical AI is open on load; tapping a row opens or
 * closes it on its own, as the FAQ does, so nothing above the tapped row collapses and shifts it off screen.
 * Every scene can be seen on a phone, not just the first. The panel's height
 * animates through grid rows 0fr ↔ 1fr (slow), as the FAQ does; only the open scene plays. Rows are buttons with
 * aria-expanded; the open panel holds the link to the page. Reduced motion: it switches instantly.
 */
export function SolutionsStack({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (!next.delete(i)) next.add(i);
      return next;
    });
  return (
    <div className="flex flex-col border-b border-border-default lg:hidden">
      {items.map((s, i) => {
        const isOpen = open.has(i);
        return (
          <div key={s.label} className={`border-b border-border-default last:border-b-0 transition-colors duration-(--duration-base) ${isOpen ? "bg-surface-selected" : ""}`}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`solution-${i}`}
                onClick={() => toggle(i)}
                className={`flex w-full items-center gap-4 px-5 py-5 text-left transition-colors duration-(--duration-base) ease-out ${isOpen ? "" : "hover:bg-surface-hover"}`}
              >
                <span className={`label w-6 shrink-0 ${isOpen ? "text-accent" : ""}`}>{String(i + 1).padStart(2, "0")}</span>
                <span className={`flex-1 text-title font-title tracking-tight ${isOpen ? "text-text-accent" : "text-text-heading"}`}>{s.label}</span>
                <ChevronDown aria-hidden className={`size-4 text-ink-56 transition-[rotate] duration-(--duration-base) ease-out motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`} strokeWidth={1.6} />
              </button>
            </h3>
            <div
              id={`solution-${i}`}
              inert={!isOpen}
              className={`grid transition-[grid-template-rows] duration-(--duration-slow) ease-out motion-reduce:transition-none ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <SolutionCanvas scene={s.scene} active={isOpen} className="block aspect-[634/360] w-full" />
                <div className="flex flex-col gap-3 px-5 pb-8 pt-2">
                  <p className="text-body leading-body text-text-secondary">{s.body}</p>
                  <Link href={s.href} className="group flex w-fit items-center gap-1.5 text-body font-medium">
                    {solutionsSection.explore} {s.label}
                    <span aria-hidden className="inline-block transition-[translate,color] duration-(--duration-base) group-hover:translate-x-1 group-hover:text-accent">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
