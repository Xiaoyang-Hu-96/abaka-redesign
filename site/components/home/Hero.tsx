"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
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
    // Draw once fonts are ready so the mono labels measure correctly.
    document.fonts?.ready.then(() => hero.resize());
    return () => { io.disconnect(); ro.disconnect(); hero.stop(); };
  }, []);

  return (
    <section aria-labelledby="hero-title" className="border-b border-border-default">
      <div ref={frame} className="relative lg:h-[900px]">
        <div
          ref={copy}
          className="flex flex-col gap-5 border-b border-border-default px-5 pb-8 pt-10 lg:absolute lg:left-10 lg:top-[327px] lg:z-10 lg:max-w-[580px] lg:border-0 lg:p-0"
        >
          <h1
            id="hero-title"
            className="text-[40px] font-semibold leading-[42px] tracking-(--tracking-display) lg:text-hero lg:leading-(--leading-hero)"
          >
            Human Intelligence <br className="hidden lg:block" />
            Data for Frontier AI
          </h1>
          <p className="text-lead leading-lead text-text-secondary lg:text-hero-lead lg:leading-[28px]">
            All the data you need to build AI, in one place.
          </p>
          <div className="flex flex-col gap-2.5 pt-1 lg:flex-row">
            <Button href="/contact" size="lg">Talk to an expert</Button>
            <Button href="/platform" variant="secondary" size="lg">Try Forge</Button>
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
