"use client";

import { useEffect, useRef } from "react";
import { colorAccent } from "@/lib/tokens";

export type Layer = { color: string; opacity: number; width: number; segs: number[] };
export type Box = { x: number; y: number; w: number; h: number; fill: string; stroke: string; sw: number };
/**
 * drift: every row slides and fades on its own rhythm, and now and then one glitches sideways (unsorted data).
 * label: the table and its orange box stay still; the labels inside the box appear one by one, hold, fade, and
 * start again.
 */
export type Motion = "drift" | "label";

const ACCENT = colorAccent;
const LABEL_LOOP = 7; // s: 2.4 to label everything, hold, fade out at 5.4–6.2, rest

function hash(a: number, b: number) {
  let h = Math.imul(a | 0, 374761393) ^ Math.imul(b | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1103515245);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function noise(x: number, seed: number) {
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  return (hash(i, seed) + (hash(i + 1, seed) - hash(i, seed)) * u) * 2 - 1;
}
const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * A scanline illustration on canvas with one quiet motion. It only runs on screen; with reduced motion it is
 * the still picture (for "label", every label shown).
 */
export function ScanArtCanvas({ width, height, layers, boxes, motion, className = "" }: {
  width: number; height: number; layers: Layer[]; boxes: Box[]; motion: Motion; className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!, ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let k = 1, DPR = 1, raf = 0;
    const isAccent = (l: Layer) => l.color.toUpperCase() === ACCENT;

    // labels are revealed top to bottom, left to right
    const order = new Map<number, number>();
    layers.filter(isAccent).forEach((l) => {
      const idx = Array.from({ length: l.segs.length / 3 }, (_, i) => i).sort((a, b) => l.segs[a * 3 + 1] - l.segs[b * 3 + 1] || l.segs[a * 3] - l.segs[b * 3]);
      idx.forEach((i, n) => order.set(i, n / idx.length));
    });

    const draw = (t: number | null) => {
      ctx.setTransform(DPR * k, 0, 0, DPR * k, 0, 0);
      ctx.clearRect(0, 0, width, height);
      for (const l of layers) {
        const isLabel = isAccent(l);
        ctx.fillStyle = l.color;
        for (let i = 0; i < l.segs.length; i += 3) {
          let x = l.segs[i];
          const y = l.segs[i + 1], len = l.segs[i + 2];
          let a = l.opacity;
          if (t !== null && motion === "drift") {
            const row = Math.round(y * 2);
            x += 6 * noise(t * 1.3 + row * 0.13, row); // each row slides its own way
            a *= 0.5 + 0.5 * (0.5 + 0.5 * noise(t * 1.6 + i * 0.05, row + 99)); // and comes and goes
            const g = Math.floor(t * 3); // now and then a row glitches sideways for a third of a second
            if (hash(row, g) < 0.05) x += (hash(row, g + 7) < 0.5 ? -1 : 1) * (8 + 6 * hash(row, g + 9));
          }
          if (t !== null && motion === "label" && isLabel) {
            const lt = t % LABEL_LOOP, at = 0.2 + order.get(i / 3)! * 2.2;
            a *= clamp((lt - at) / 0.25) * (1 - clamp((lt - 5.4) / 0.8));
          }
          if (a <= 0.001) continue;
          ctx.globalAlpha = a;
          ctx.fillRect(x, y - l.width / 2, len, l.width);
        }
      }
      ctx.globalAlpha = 1;
      for (const b of boxes) {
        if (b.fill !== "none") { ctx.fillStyle = b.fill; ctx.fillRect(b.x, b.y, b.w, b.h); }
        if (b.stroke !== "none") { ctx.strokeStyle = b.stroke; ctx.lineWidth = b.sw; ctx.strokeRect(b.x, b.y, b.w, b.h); }
      }
    };

    const size = () => {
      DPR = Math.min(2, window.devicePixelRatio || 1);
      const r = canvas.getBoundingClientRect();
      k = r.width / width;
      canvas.width = Math.round(r.width * DPR); canvas.height = Math.round(r.height * DPR);
      draw(reduced ? null : performance.now() / 1000);
    };
    const tick = (now: number) => { draw(now / 1000); raf = requestAnimationFrame(tick); };

    size();
    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      if (reduced) return;
      if (e.isIntersecting && !raf) raf = requestAnimationFrame(tick);
      if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = 0; }
    });
    io.observe(canvas);
    return () => { ro.disconnect(); io.disconnect(); cancelAnimationFrame(raf); };
  }, [width, height, layers, boxes, motion]);

  return <canvas ref={ref} aria-hidden className={`block h-auto ${className}`} style={{ aspectRatio: `${width} / ${height}` }} />;
}
