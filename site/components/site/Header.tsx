"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { nav } from "@/lib/nav";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { NavPanel } from "./NavPanel";

/** Panels open 80ms after the pointer arrives and close 200ms after it leaves, so sweeping across the menu does not flash. */
const OPEN_DELAY = 80;
const CLOSE_DELAY = 200;

export function Header() {
  const [open, setOpen] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const panelId = useId();

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
    <div className="relative z-40" onMouseLeave={() => schedule(null, CLOSE_DELAY)}>
      <div className="flex h-16 items-center justify-between border-b border-border-default pl-5 pr-3 lg:px-10">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex gap-1">
            {nav.map((item, i) => (
              <li key={item.label} onMouseEnter={() => schedule(i, OPEN_DELAY)}>
                <button
                  type="button"
                  aria-expanded={open === i}
                  aria-controls={`${panelId}-${i}`}
                  onClick={() => setOpen(open === i ? null : i)}
                  className={`flex items-center gap-1.5 px-2 py-1.5 text-body transition-colors duration-(--duration-fast) ease-out ${
                    open === i ? "bg-ink-10/40 text-text-primary" : "text-text-secondary hover:bg-ink-10/40 hover:text-text-primary"
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    aria-hidden
                    className={`size-3 transition-transform duration-(--duration-base) ease-out ${open === i ? "rotate-180" : ""}`}
                    strokeWidth={1.5}
                  />
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden gap-2.5 lg:flex">
          <Button href="/platform" variant="secondary">Try Forge</Button>
          <Button href="/contact">Talk to an expert</Button>
        </div>

        <MobileMenu />
      </div>

      {nav.map((item, i) => (
        <div
          key={item.label}
          id={`${panelId}-${i}`}
          hidden={open !== i}
          onMouseEnter={() => schedule(i, 0)}
          className="absolute inset-x-0 top-full hidden lg:block motion-safe:animate-[panel-in_var(--duration-slow)_var(--ease-out)]"
        >
          <NavPanel item={item} />
        </div>
      ))}
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
            <Logo />
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
            const links = item.links ?? item.groups?.flatMap((g) => g.links) ?? [item.intro.link];
            return (
              <details key={item.label} className="group border-b border-border-default open:bg-surface-raised">
                <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-5 text-title font-medium tracking-tight">
                  {item.label}
                  <ChevronDown aria-hidden className="size-3.5 transition-transform group-open:rotate-180" strokeWidth={1.5} />
                </summary>
                <ul className="px-5 pb-4">
                  {links.map((l, i) => (
                    <li key={l.label}>
                      <Link href={l.href} className="flex items-baseline gap-3.5 py-2.5 text-lead text-text-secondary">
                        {item.layout === "numbered" && <span className="label">{String(i + 1).padStart(2, "0")}</span>}
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            );
          })}
          <div className="mt-auto flex flex-col gap-2.5 border-t border-border-default px-5 py-6">
            <Button href="/contact" size="lg">Talk to an expert</Button>
            <Button href="/platform" variant="secondary" size="lg">Try Forge</Button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
