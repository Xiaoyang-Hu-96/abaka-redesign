import { readFileSync } from "node:fs";
import path from "node:path";
import { WordmarkCanvas } from "./WordmarkCanvas";

/**
 * The footer wordmark. public/illustrations/wordmark.svg (made by scripts/scanline-svg.mjs) is read at build time
 * and its line segments are handed to a canvas, which makes them shake under the pointer.
 * Each segment is [x, y, length], flattened.
 */
function load() {
  const svg = readFileSync(path.join(process.cwd(), "public/illustrations/wordmark.svg"), "utf8");
  const [, w, h] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)!;
  const segs = (cls: string) =>
    [...svg.matchAll(new RegExp(`class="${cls}" d="([^"]*)"`, "g"))].flatMap(([, d]) =>
      [...d.matchAll(/M([\d.-]+) ([\d.-]+)h([\d.-]+)/g)].flatMap(([, x, y, len]) => [+x, +y, +len]),
    );
  return { width: +w, height: +h, lines: segs("wm-line"), bars: segs("wm-bar") };
}

export function Wordmark({ className = "" }: { className?: string }) {
  return <WordmarkCanvas {...load()} className={className} />;
}
