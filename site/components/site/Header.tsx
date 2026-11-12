"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { quietLink } from "@/components/ui/quiet-link";
import { cta } from "@/lib/content";
import { ms } from "@/lib/time";
import { delayClose, delayHoverIntent } from "@/lib/tokens";
import { nav } from "@/lib/nav";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { NavPanel } from "./NavPanel";

/**
 * Panels open 80ms after the pointer arrives and close 200ms after it leaves, so sweeping across the menu does not flash.
 * The header sticks to the top while the page scrolls (anchors leave room for it via scroll-padding on <html>).
 * All four panels share one canvas shell that stays open while the pointer moves between menus: the contents
 * cross-fade (base) and the shell's height follows the new panel (slow), so switching never re-opens the shell.
 */
const OPEN_DELAY = ms(delayHoverIntent);
const CLOSE_DELAY = ms(delayClose);

export function Header() {
  const [open, setOpen] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const panelId = useId();
  // the last panel shown, so closing fades out with its content instead of an empty shell
  const [last, setLast] = useState(0);
  const shown = open ?? last;
  // each panel's height, measured even while closed (the shell is invisible, not display:none)
  const [heights, setHeights] = useState<number[]>([]);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  // the height only animates between two open panels, never on the first open
  const prev = useRef<number | null>(null);
  const switching = open !== null && prev.current !== null;
  useEffect(() => {
    prev.current = open;
    if (open !== null) setLast(open);
  }, [open]);

  useEffect(() => {
    const ro = new ResizeObserver(() => setHeights(panels.current.map((el) => el?.offsetHeight ?? 0)));
    panels.current.forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, []);

  const schedule = (next: number | null, delay: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(next), delay);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="sticky top-0 z-40 bg-surface-page" onMouseLeave={() => schedule(null, CLOSE_DELAY)}>
      <div className="flex h-16 items-center justify-between border-b border-border-default pl-5 pr-3 lg:h-24 lg:px-10">
        <Logo variant="brand" />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex gap-7">
            {nav.map((item, i) => (
              <li key={item.label} onMouseEnter={() => schedule(i, OPEN_DELAY)}>
                <button
                  type="button"
                  aria-expanded={open === i}
                  aria-controls={`${panelId}-${i}`}
                  onClick={() => setOpen(open === i ? null : i)}
                  // quiet link (link hover v5): ink-72, hover accent; open = accent with the chevron flipped
                  className={`flex items-center gap-1.5 px-1 py-1.5 text-lead ${quietLink} ${open === i ? "text-accent" : ""}`}
                >
                  {item.label}
                  <ChevronDown
                    aria-hidden
                    className={`size-3 transition-[rotate,color] duration-(--duration-base) ease-out group-hover:text-accent ${open === i ? "rotate-180 text-accent" : "text-ink-56"}`}
                    strokeWidth={1.5}
                  />
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden gap-2.5 lg:flex">
          <Button href={cta.forge.href} variant="secondary">{cta.forge.label}</Button>
          <Button href={cta.expert.href}>{cta.expert.label}</Button>
        </div>

        <MobileMenu />
      </div>

      {/* the shell: canvas, bottom line, shadow. Opening fades it in and drops it 4px (slow); closed it is invisible but laid out */}
      <div
        onMouseEnter={() => open !== null && schedule(open, 0)}
        className={`absolute inset-x-0 top-full hidden overflow-clip border-b border-border-default bg-surface-page shadow-window lg:block ${
          switching ? "transition-[opacity,translate,visibility,height] duration-(--duration-slow) ease-out" : "transition-[opacity,translate,visibility] duration-(--duration-slow) ease-out"
        } motion-reduce:transition-none ${open === null ? "invisible -translate-y-1 opacity-0" : "visible translate-y-0 opacity-100"}`}
        style={{ height: heights[shown] || undefined }}
      >
        {nav.map((item, i) => (
          <div
            key={item.label}
            ref={(el) => { panels.current[i] = el; }}
            id={`${panelId}-${i}`}
            inert={open !== i}
            aria-hidden={open !== i}
            className={`absolute inset-x-0 top-0 transition-opacity duration-(--duration-base) ease-out motion-reduce:transition-none ${
              i === shown ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <NavPanel item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Mobile: a full-screen <dialog> (focus is trapped by the browser), sections as native disclosure. */
function MobileMenu() {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => ref.current?.showModal()}
        className="flex size-10 items-center justify-center"
      >
        <Menu aria-hidden className="size-5" strokeWidth={1.5} />
      </button>
      <dialog
        ref={ref}
        aria-label="Menu"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-surface-page p-0 px-4 backdrop:bg-transparent"
      >
        <div className="flex min-h-full flex-col border-x border-border-default">
          <div className="flex h-16 items-center justify-between border-b border-border-default pl-5 pr-3">
            <Logo variant="brand" />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => ref.current?.close()}
              className="flex size-10 items-center justify-center bg-ink-10/40"
            >
              <X aria-hidden className="size-4" strokeWidth={1.5} />
            </button>
          </div>
          {nav.map((item) => {
            // the panel's links, then its intro link ("All datasets") and extra ("Request a dataset"), without repeats
            const all = [...(item.links ?? item.groups?.flatMap((g) => g.links) ?? []), item.intro.link, ...(item.extra ? [{ ...item.extra, label: item.extra.description ?? item.extra.label }] : [])];
            const links = all.filter((l, i) => all.findIndex((m) => m.href === l.href) === i);
            return (
              <details key={item.label} className="group border-b border-border-default open:bg-surface-selected">
                <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-5 text-title font-title text-text-heading tracking-tight">
                  {item.label}
                  <ChevronDown aria-hidden className="size-3.5 transition-[rotate] duration-(--duration-base) ease-out group-open:rotate-180" strokeWidth={1.5} />
                </summary>
                <ul className="px-5 pb-4">
                  {links.map((l, i) => (
                    <li key={l.label}>
                      <Link href={l.href} className="flex items-baseline gap-3.5 py-2.5 text-lead text-text-secondary">
                        {item.layout === "numbered" && i < (item.links?.length ?? 0) && <span className="label">{String(i + 1).padStart(2, "0")}</span>}
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            );
          })}
          <div className="mt-auto flex flex-col gap-2.5 border-t border-border-default px-5 py-6">
            <Button href={cta.expert.href} size="lg">{cta.expert.label}</Button>
            <Button href={cta.forge.href} variant="secondary" size="lg">{cta.forge.label}</Button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
