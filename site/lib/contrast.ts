/** WCAG 2.x contrast ratio between two hex colours. Alpha (#RRGGBBAA) is composited over `bg` first. */
function parse(hex: string) {
  const h = hex.replace("#", "");
  return [0, 2, 4, 6].map((i) => (h.length > i ? parseInt(h.slice(i, i + 2), 16) / 255 : 1));
}

function luminance([r, g, b]: number[]) {
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrast(fg: string, bg: string) {
  const b = parse(bg);
  const [r, g, bl, a] = parse(fg);
  const f = [r, g, bl].map((c, i) => c * a + b[i] * (1 - a));
  const [hi, lo] = [luminance(f), luminance(b)].sort((x, y) => y - x);
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}

/** AA thresholds: 4.5 for body text, 3 for text at 24px+ (or 18.66px bold) and for UI parts. */
export function grade(ratio: number) {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA large";
  return "Fails";
}
