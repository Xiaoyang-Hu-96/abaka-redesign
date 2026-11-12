import { readFileSync } from "node:fs";
import path from "node:path";
import { ScanArtCanvas, type Layer, type Box, type Motion } from "./ScanArtCanvas";

/**
 * A scanline SVG from public/illustrations, read at build time and handed to a canvas so it can move a little.
 * Every <path> is a layer of horizontal segments ("M x y h len"); every <rect> is kept as it is.
 */
function load(name: string) {
  const svg = readFileSync(path.join(process.cwd(), "public/illustrations", `${name}.svg`), "utf8");
  const [, w, h] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)!;
  const attr = (tag: string, a: string) => tag.match(new RegExp(`\\s${a}="([^"]*)"`))?.[1];
  const layers: Layer[] = [...svg.matchAll(/<path [^>]*>/g)].map(([tag]) => ({
    color: attr(tag, "stroke")!,
    opacity: +(attr(tag, "stroke-opacity") ?? 1),
    width: +(attr(tag, "stroke-width") ?? 1),
    segs: [...attr(tag, "d")!.matchAll(/M([\d.-]+) ([\d.-]+)h([\d.-]+)/g)].flatMap(([, x, y, l]) => [+x, +y, +l]),
  }));
  const boxes: Box[] = [...svg.matchAll(/<rect [^>]*>/g)].map(([tag]) => ({
    x: +attr(tag, "x")!, y: +attr(tag, "y")!, w: +attr(tag, "width")!, h: +attr(tag, "height")!,
    fill: attr(tag, "fill") ?? "none", stroke: attr(tag, "stroke") ?? "none", sw: +(attr(tag, "stroke-width") ?? 1),
  }));
  return { width: +w, height: +h, layers, boxes };
}

export function ScanArt({ name, motion, className = "" }: { name: string; motion: Motion; className?: string }) {
  return <ScanArtCanvas {...load(name)} motion={motion} className={className} />;
}
