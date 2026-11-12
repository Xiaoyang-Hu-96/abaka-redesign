"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { cta, hero } from "@/lib/content";
import { createHero } from "./hero-engine";

/**
 * The headline and buttons are real HTML, so the largest paint is text, not the canvas.
 * Wide screens: the canvas fills the hero and the copy sits on it. Small screens: copy first,
 * then a 2x2 canvas below it.
 */
export function Hero() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cv = canvas.current!, box = frame.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const copyRect = () => {
      if (!copy.current || window.innerWidth < 1024) return null;
      const a = box.getBoundingClientRect(), b = copy.current.getBoundingClientRect();
      return { top: b.top - a.top, bottom: b.bottom - a.top, left: b.left - a.left, right: b.right - a.left };
    };
    const hero = createHero(cv, copyRect, reduced);

    // Only animate while the hero is on screen.
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? hero.start() : hero.stop()));
    io.observe(cv);
    const ro = new ResizeObserver(() => hero.resize());
    ro.observe(cv);
    // Hovering a sample puts it under review (wide screens only; the engine ignores it in the 2x2 layout).
    const move = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); hero.pointer(e.clientX - r.left, e.clientY - r.top); };
    const leave = () => hero.pointer(null);
    box.addEventListener("pointermove", move);
    box.addEventListener("pointerleave", leave);
    // Draw once fonts are ready so the mono labels measure correctly.
    document.fonts?.ready.then(() => hero.resize());
    return () => {
      io.disconnect(); ro.disconnect(); hero.stop();
      box.removeEventListener("pointermove", move); box.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <section aria-labelledby="hero-title" className="border-b border-border-default">
      {/* Wide screens: the hero fills what is left of the first screen under the announcement band
          (40px bar inset 12px: 64px), header (96px + 1px line) and the hero's own 1px bottom line, between 560px and
          900px. The 4 grid rows split that height, so the whole route stays above the fold. */}
      <div ref={frame} className="relative lg:h-[clamp(560px,calc(100svh-162px),900px)]">
        <div
          ref={copy}
          className="flex flex-col gap-5 border-b border-border-default px-5 pb-8 pt-10 lg:absolute lg:left-10 lg:top-1/2 lg:z-10 lg:max-w-[580px] lg:-translate-y-1/2 lg:border-0 lg:p-0"
        >
          <h1
            id="hero-title"
            className="text-hero-sm font-heading text-text-heading leading-hero-sm tracking-(--tracking-display) lg:text-hero lg:leading-(--leading-hero)"
          >
            {hero.title[0]} <br className="hidden lg:block" />
            {hero.title[1]}
          </h1>
          <p className="text-lead leading-lead text-text-secondary lg:text-hero-lead lg:leading-row">
            {hero.lead}
          </p>
          <div className="flex flex-col gap-2.5 pt-1 lg:flex-row">
            <Button href={cta.expert.href} size="lg">{cta.expert.label}</Button>
            <Button href={cta.forge.href} variant="secondary" size="lg">{cta.forge.label}</Button>
          </div>
        </div>
        <canvas
          ref={canvas}
          aria-hidden
          className="block h-[400px] w-full sm:h-[520px] lg:absolute lg:inset-0 lg:h-full"
        />
      </div>
    </section>
  );
}
