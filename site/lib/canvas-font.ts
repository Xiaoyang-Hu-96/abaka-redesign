/**
 * The mono family for canvas text. next/font gives the font a generated family name, so canvases read the
 * resolved --font-mono token instead of naming the font. Read once, then cached (canvases call this every frame).
 */
let cached = "";
export function monoFamily() {
  if (cached) return cached;
  if (typeof document === "undefined") return "monospace";
  cached = getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim();
  return cached || "monospace";
}
