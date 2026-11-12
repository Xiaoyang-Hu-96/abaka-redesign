import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Inlines an SVG exported from Paper (public/illustrations) at build time.
 * Inline rather than <img> so the SVG's text uses the page's self-hosted fonts and its
 * colours can later be driven by CSS. Exported fixed sizes are dropped; the viewBox scales.
 */
const cache = new Map<string, string>();

function load(name: string) {
  if (!cache.has(name)) {
    const raw = readFileSync(path.join(process.cwd(), "public/illustrations", `${name}.svg`), "utf8");
    const svg = raw
      .replace(/<svg([^>]*?)\s(width|height)="[^"]*"/g, "<svg$1")
      .replace(/<svg([^>]*?)\s(width|height)="[^"]*"/g, "<svg$1")
      .replace(/<svg([^>]*?)\sstyle="[^"]*"/, "<svg$1")
      .replace(/font-family="Inter"/g, 'style="font-family:var(--font-sans)"')
      .replace(/font-family="JetBrains Mono"/g, 'style="font-family:var(--font-mono)"');
    cache.set(name, svg);
  }
  return cache.get(name)!;
}

export function Illustration({ name, className = "", label }: { name: string; className?: string; label?: string }) {
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`block [&>svg]:block [&>svg]:h-auto [&>svg]:w-full ${className}`}
      dangerouslySetInnerHTML={{ __html: load(name) }}
    />
  );
}
