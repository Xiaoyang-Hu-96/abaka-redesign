"use client";

import { useEffect, useRef } from "react";
import { createSolutionScene } from "./solutions-engine";

/**
 * One animated Solutions scene. It plays only while `active` and on screen; otherwise it holds its frame.
 * With reduced motion it draws one still frame and never animates.
 */
export function SolutionCanvas({ scene, active, className = "" }: { scene: string; active: boolean; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const engine = useRef<ReturnType<typeof createSolutionScene>>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const e = createSolutionScene(canvas, scene, reduced);
    engine.current = e;
    e.resize();
    const ro = new ResizeObserver(() => e.resize());
    const io = new IntersectionObserver(([entry]) => e.setVisible(entry.isIntersecting));
    ro.observe(canvas); io.observe(canvas);
    // fonts for the tags may arrive after the first paint
    document.fonts?.ready.then(() => e.resize());
    return () => { ro.disconnect(); io.disconnect(); e.stop(); engine.current = null; };
  }, [scene]);

  useEffect(() => { engine.current?.setActive(active); }, [active, scene]);

  return <canvas ref={ref} aria-hidden className={className} />;
}
