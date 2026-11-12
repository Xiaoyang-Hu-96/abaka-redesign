"use client";

import { useEffect, useRef } from "react";
import { colorGrey500, colorGrey700 } from "@/lib/tokens";

type Props = { width: number; height: number; lines: number[]; bars: number[]; className?: string };

// the wordmark's two tones: thin lines grey-500, heavy bars grey-700 (the scanline art uses the same pair)
const LINE = colorGrey500, BAR = colorGrey700, THIN = 1.7, THICK = 3.6;
const RADIUS = 80; // how far from the pointer the lines feel it, in wordmark units
const SHAKE = 5; // the most a line moves sideways

function hash(a: number, b: number) {
  let h = Math.imul(a | 0, 374761393) ^ Math.imul(b | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1103515245);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
/** smooth 1D noise, -1…1 */
function noise(x: number, seed: number) {
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  return (hash(i, seed) + (hash(i + 1, seed) - hash(i, seed)) * u) * 2 - 1;
}

/**
 * The scanline wordmark, drawn on canvas. Moving the pointer over it makes the rows around it shake sideways
 * like an unsteady scan, each row on its own rhythm, and their ends flicker. The shake is fed by movement and
 * decays on its own: a pointer that stops, even on the letters, lets it settle within about half a second.
 * Faster moves shake more. Nothing moves with reduced motion.
 */
export function WordmarkCanvas({ width, height, lines, bars, className = "" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!, ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // energy: what movement adds; amp: what is drawn, easing towards energy
    let k = 1, DPR = 1, raf = 0, amp = 0, energy = 0, px = -1e4, py = -1e4, last = 0, inside = false;

    const draw = (time: number) => {
      ctx.setTransform(DPR * k, 0, 0, DPR * k, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const pass = (segs: number[], color: string, th: number, salt: number) => {
        ctx.fillStyle = color;
        for (let i = 0; i < segs.length; i += 3) {
          let x = segs[i], len = segs[i + 2];
          const y = segs[i + 1];
          if (amp > 0.001) {
            const d = Math.hypot(x + len / 2 - px, (y - py) * 1.6);
            const w = amp * Math.exp(-(d * d) / (RADIUS * RADIUS));
            if (w > 0.01) {
              const row = Math.round(y);
              x += w * SHAKE * noise(time * 9 + row * 0.37, row + salt); // the row slides
              const e0 = w * 5 * noise(time * 14 + i * 0.13, row * 7 + 1), e1 = w * 7 * noise(time * 13 + i * 0.11, row * 7 + 2);
              x += e0; len = Math.max(0, len - e0 + e1); // its ends flicker
            }
          }
          ctx.fillRect(x, y - th / 2, len, th);
        }
      };
      pass(lines, LINE, THIN, 0);
      pass(bars, BAR, THICK, 0); // same salt: a row's bars move with its line
    };

    const size = () => {
      DPR = Math.min(2, window.devicePixelRatio || 1);
      const r = canvas.getBoundingClientRect();
      k = r.width / width;
      canvas.width = Math.round(r.width * DPR); canvas.height = Math.round(r.height * DPR);
      draw(performance.now() / 1000);
    };
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now;
      energy *= Math.pow(0.5, dt / 0.15); // half-life 150ms
      amp += (energy - amp) * (energy > amp ? 0.25 : 0.12);
      draw(now / 1000);
      raf = amp < 0.003 && energy < 0.003 ? 0 : requestAnimationFrame(tick);
      if (!raf) { amp = energy = 0; draw(now / 1000); } // land exactly on the still picture
    };
    const wake = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };
    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect(), nx = (e.clientX - r.left) / k, ny = (e.clientY - r.top) / k;
      const moved = inside ? Math.hypot(nx - px, ny - py) : 0; // entering isn't a jump
      px = nx; py = ny; inside = true;
      energy = Math.min(1, energy + moved / 60); // faster moves feed more shake
      wake();
    };
    // leaving keeps the last position, so the shake dies down where it was
    const leave = () => { inside = false; };

    size();
    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    if (!reduced) {
      // listen on the wrapper so the effect starts as the pointer enters the band, not only on the letters
      const host = canvas.parentElement!;
      host.addEventListener("pointermove", move);
      host.addEventListener("pointerleave", leave);
      return () => { ro.disconnect(); cancelAnimationFrame(raf); host.removeEventListener("pointermove", move); host.removeEventListener("pointerleave", leave); };
    }
    return () => ro.disconnect();
  }, [width, height, lines, bars]);

  return <canvas ref={ref} aria-hidden className={`block h-auto w-full ${className}`} style={{ aspectRatio: `${width} / ${height}` }} />;
}
