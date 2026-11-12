/**
 * Redraws the site's dash illustrations in scanlines, the line language of the hero
 * (components/home/hero-engine.ts, scan()).
 *
 * The dash originals and the wordmark mask live in scripts/illustration-src/; `npm run scanlines` rebuilds
 * every scanline SVG in public/illustrations from them.
 *
 *   node scripts/scanline-svg.mjs <dashes.svg> <out.svg> [--pitch 4]
 *       A dash illustration exported from Paper: one <path> of horizontal "M x y h len" dashes per colour.
 *       #8F8F8F is the subject, #FD5F32 the accent (labelled object), #CCCCCC the faint scattered ground.
 *       Anything else in the file (the orange frame in cta-labelled) is copied over as it is.
 *   node scripts/scanline-svg.mjs --mask <mask.png> <out.svg> [--pitch 5]
 *       Any black-on-transparent mask (the footer wordmark).
 *
 * How the dashes become scanlines:
 *   1. The subject's dashes are rasterised fat and blurred, so the sparse 9px rows close into one solid
 *      silhouette. A wider blur of the thin dashes gives the shade: where the old art was dense is darker.
 *   2. The silhouette is scanned at a finer pitch. Each row is one thin line per run, its ends nudged a few
 *      px so the edge reads ragged; now and then a small gap; 1–3 short heavy bars, more where it's dark
 *      and on the shadow side (lower right).
 *   3. The ground dashes stay where they were, as thin light lines with the odd bar: texture, not shape.
 */
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const THIN = 1.2, THICK = 2.6;
/* colours come from the design tokens */
const color = JSON.parse(readFileSync(new URL("../tokens/tokens.json", import.meta.url), "utf8")).color;
const tok = (name) => color[name].$value;
const INK = {
  subject: { line: tok("grey-500"), bar: tok("grey-700") },
  accent: { line: tok("accent"), lineOpacity: 0.65, bar: tok("accent") },
  ground: { line: tok("grey-300"), bar: tok("grey-400") },
};
const ROLE = { "#8F8F8F": "subject", "#FD5F32": "accent", "#CCCCCC": "ground" };

function hash(a, b = 0, c = 0) {
  let h = Math.imul(a | 0, 374761393) ^ Math.imul(b | 0, 668265263) ^ Math.imul(c | 0, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1103515245);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
const f1 = (n) => Math.round(n * 10) / 10;
const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);

/** rasterise an SVG string to a W×H Float32 alpha map (0–1), optionally blurred */
async function alpha(svg, W, H, sigma = 0, scale = 1) {
  let img = sharp(Buffer.from(svg), { density: 72 * scale }).ensureAlpha().extractChannel(3);
  if (sigma) img = img.blur(sigma * scale);
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const out = new Float32Array(W * H), sx = info.width / W, sy = info.height / H;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) out[y * W + x] = data[Math.floor(y * sy) * info.width + Math.floor(x * sx)] / 255;
  return out;
}

/**
 * Scan a mask. `at(x, y)` is the mask (>0.5 inside), `shade(x, y)` 0 (lit) to 1 (dark).
 * Returns path data for the thin lines and the heavy bars.
 */
function scan(W, H, at, shade, { P, seed, jitter = 2.5, minRun = 2 }) {
  let thin = "", bars = "";
  for (let r = 0, y = P / 2; y < H; r++, y += P) {
    const yy = Math.round(y);
    let x = 0, i = 0;
    while (x < W) {
      if (at(x, yy) <= 0.5) { x++; continue; }
      let b = x; while (b < W && at(b, yy) > 0.5) b++;
      if (b - x >= minRun) {
        const a = x + (hash(r, i, seed) - 0.5) * 2 * jitter, e = b + (hash(r, i, seed + 1) - 0.5) * 2 * jitter, len = e - a;
        if (len > 2) {
          const yc = f1(y);
          if (len > 30 && hash(r, i + 50, seed) < 0.2) {
            const g = a + len * (0.2 + 0.6 * hash(r, i + 60, seed)), gw = 2 + hash(r, i + 70, seed) * 4;
            thin += `M${f1(a)} ${yc}h${f1(g - a)}M${f1(g + gw)} ${yc}h${f1(e - g - gw)}`;
          } else thin += `M${f1(a)} ${yc}h${f1(len)}`;
          // shade 1 is solid (the agent's cursor): the whole run is one heavy bar
          if (shade(clamp(Math.round((a + e) / 2), 0, W - 1), yy) >= 0.99) { bars += `M${f1(a)} ${yc}h${f1(len)}`; i++; x = b + 1; continue; }
          // heavy bars: one near the start of most runs, more where the shade is dark
          const n = 1 + Math.floor(hash(r, i + 80, seed) * 3);
          for (let k = 0; k < n; k++) {
            const t = k === 0 ? hash(r, i + 90, seed) * 0.25 : hash(r, i * 11 + k, seed + 3);
            const bx = a + t * len, s = shade(clamp(Math.round(bx), 0, W - 1), yy);
            if (hash(r, i * 7 + k, seed + 2) > (k === 0 ? 0.25 + s : s * 0.9)) continue;
            const bl = Math.min(e - bx, 3 + hash(r, i * 13 + k, seed + 4) * Math.min(18, len * 0.5));
            if (bl > 1.5) bars += `M${f1(bx)} ${yc}h${f1(bl)}`;
          }
        }
        i++;
      }
      x = b + 1;
    }
  }
  return { thin, bars };
}

function paths({ thin, bars }, ink) {
  const op = ink.lineOpacity ? ` stroke-opacity="${ink.lineOpacity}"` : "";
  return (
    (thin ? `  <path d="${thin}" fill="none" stroke="${ink.line}"${op} stroke-width="${THIN}"/>\n` : "") +
    (bars ? `  <path d="${bars}" fill="none" stroke="${ink.bar}" stroke-width="${THICK}"/>\n` : "")
  );
}

/** the bounding box of a mask, for the light direction */
function bbox(m, W, H) {
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (m[y * W + x] > 0.5) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  return { x0, y0, w: Math.max(1, x1 - x0), h: Math.max(1, y1 - y0) };
}

async function convertDashes(src, P) {
  const svgOpen = src.match(/<svg[^>]*>/)[0];
  const W = +svgOpen.match(/width="([\d.]+)"/)[1], H = +svgOpen.match(/height="([\d.]+)"/)[1];
  const dashRe = /\s*<path d="([^"]+)"[^>]*stroke="(#[0-9A-Fa-f]{6})"[^>]*\/>/g;
  const layers = [...src.matchAll(dashRe)].map(([, d, c]) => {
    const dashes = [...d.matchAll(/M([\d.]+) ([\d.]+)h([\d.]+)/g)].map(([, x, y, h]) => [+x, +y, +h]);
    return { role: ROLE[c.toUpperCase()] ?? "subject", dashes };
  });
  const rest = src.replace(/<svg[^>]*>|<\/svg>/g, "").replace(dashRe, "").trim();
  const wrap = (body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${body}</svg>`;

  // A table of equal dashes (cta-labelled) is structured data: keep its rows exact, no ragged ends.
  const lens = new Set(layers.flatMap((l) => l.dashes.map((d) => d[2])));
  if (lens.size === 1) return `${svgOpen}\n${grid(layers)}${rest ? "  " + rest.replace(/\n\s*/g, "\n  ") + "\n" : ""}</svg>\n`;

  let body = "";
  for (const [li, { role, dashes }] of layers.entries()) {
    if (role === "ground") {
      // texture: each dash stays put, as a thin light line; a few get a bar
      let thin = "", bars = "";
      dashes.forEach(([x, y, h], i) => {
        const a = x + (hash(i, 1, li) - 0.5) * 3, len = h + (hash(i, 2, li) - 0.3) * 6;
        thin += `M${f1(a)} ${y}h${f1(len)}`;
        if (hash(i, 3, li) < 0.3) bars += `M${f1(a + hash(i, 4, li) * len * 0.5)} ${y}h${f1(3 + hash(i, 5, li) * 5)}`;
      });
      body += paths({ thin, bars }, INK.ground);
      continue;
    }
    // pitch of the source rows
    const ys = [...new Set(dashes.map((d) => d[1]))].sort((a, b) => a - b);
    const gaps = ys.slice(1).map((y, k) => y - ys[k]).filter((v) => v > 0.5);
    const pitch = gaps.length ? Math.min(...gaps) : 9;
    const fat = wrap(dashes.map(([x, y, h]) => `<path d="M${x - 2} ${y}h${h + 4}" stroke="#000" stroke-width="${pitch + 1.5}" stroke-linecap="round"/>`).join(""));
    const thinSvg = wrap(dashes.map(([x, y, h]) => `<path d="M${x} ${y}h${h}" stroke="#000" stroke-width="3"/>`).join(""));
    const mask = await alpha(fat, W, H, 1.6, 2);
    const dens = await alpha(thinSvg, W, H, pitch * 0.9, 2);
    let dmax = 0; for (const v of dens) dmax = Math.max(dmax, v);
    const box = bbox(mask, W, H);
    const shade = (x, y) => {
      const u = (x - box.x0) / box.w, v = (y - box.y0) / box.h;
      return clamp(0.15 + 0.55 * (dens[y * W + x] / dmax) + 0.35 * (u - 0.5) + 0.35 * (v - 0.5));
    };
    body += paths(scan(W, H, (x, y) => mask[y * W + x], shade, { P, seed: 11 + li * 7 }), INK[role]);
  }
  return `${svgOpen}\n${body}${rest ? "  " + rest.replace(/\n\s*/g, "\n  ") + "\n" : ""}</svg>\n`;
}

/**
 * Structured rows: each row's dashes join into one exact thin line. The accent dashes (the labels)
 * become heavy orange bars where they were; grey rows get a heavy bar on about one cell in five.
 */
function grid(layers) {
  const key = (x, y) => `${Math.round(x)}:${y}`;
  const labelled = new Set(layers.filter((l) => l.role === "accent").flatMap((l) => l.dashes.map(([x, y]) => key(x, y))));
  let out = "";
  for (const [li, { role, dashes }] of layers.entries()) {
    let thin = "", bars = "";
    const rows = new Map();
    for (const d of dashes) { if (!rows.has(d[1])) rows.set(d[1], []); rows.get(d[1]).push(d); }
    for (const [y, ds] of rows) {
      ds.sort((p, q) => p[0] - q[0]);
      if (role !== "accent") {
        let a = ds[0][0], b = a + ds[0][2];
        for (const [x, , h] of ds.slice(1)) {
          if (x - b > 6) { thin += `M${f1(a)} ${y}h${f1(b - a)}`; a = x; }
          b = x + h;
        }
        thin += `M${f1(a)} ${y}h${f1(b - a)}`;
      }
      ds.forEach(([x, , h], i) => {
        const on = role === "accent" || (!labelled.has(key(x, y)) && hash(i, Math.round(y), li + 3) < (role === "ground" ? 0.12 : 0.2));
        if (on) bars += `M${f1(x)} ${y}h${h}`;
      });
    }
    out += paths({ thin, bars }, role === "accent" ? { bar: INK.accent.bar } : INK[role]);
  }
  return out;
}

async function convertMask(file, P) {
  const { data, info } = await sharp(file).ensureAlpha().extractChannel(3).raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, m = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) m[i] = data[i] / 255;
  const box = bbox(m, W, H);
  // lit from the top left; the lower part of every letter is darker
  const shade = (x, y) => clamp(0.04 + 0.5 * ((y - box.y0) / box.h) + 0.25 * ((x - box.x0) / box.w) + 0.3 * (hash(x >> 4, y >> 3, 5) - 0.5));
  const d = scan(W, H, (x, y) => m[y * W + x], shade, { P, seed: 23, jitter: 3, minRun: 3 });
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="display: inline-block">\n${paths(d, INK.subject)}</svg>\n`;
}

/**
 * The footer wordmark: one group per letter, so hovering a letter can put it "under review" like the
 * hero samples (orange lines, a fitted box, a tag). The colours here are defaults; globals.css drives the hover.
 */
async function convertWordmark(file, P, tags) {
  const { data, info } = await sharp(file).ensureAlpha().extractChannel(3).raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, m = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) m[i] = data[i] / 255;
  // letters = runs of columns that hold ink
  const cols = [];
  for (let x = 0; x < W; x++) { let ink = false; for (let y = 0; y < H && !ink; y++) ink = m[y * W + x] > 0.5; cols.push(ink); }
  const letters = [];
  for (let x = 0; x < W; x++) if (cols[x] && !cols[x - 1]) { let b = x; while (b < W && cols[b]) b++; letters.push([x, b]); }
  const box = bbox(m, W, H);
  const shade = (x, y) => clamp(0.04 + 0.5 * ((y - box.y0) / box.h) + 0.25 * ((x - box.x0) / box.w) + 0.3 * (hash(x >> 4, y >> 3, 5) - 0.5));
  let body = "";
  letters.forEach(([a, b], li) => {
    const at = (x, y) => (x >= a && x < b ? m[y * W + x] : 0);
    let y0 = H; for (let y = 0; y < H && y0 === H; y++) for (let x = a; x < b; x++) if (m[y * W + x] > 0.5) { y0 = y; break; }
    const d = scan(W, H, at, shade, { P, seed: 23 + li, jitter: 3, minRun: 3 });
    const bx = a - 8, by = y0 - 8, bw = b - a + 16, tag = tags[li];
    body +=
      `  <g class="wm-letter">\n` +
      `    <path class="wm-line" d="${d.thin}" fill="none" stroke="${INK.subject.line}" stroke-width="${THIN * 1.4}"/>\n` +
      `    <path class="wm-bar" d="${d.bars}" fill="none" stroke="${INK.subject.bar}" stroke-width="${THICK * 1.4}"/>\n` +
      (!tag ? "  </g>\n" :
      `    <g class="wm-box">\n` +
      `      <rect x="${bx}" y="${by}" width="${bw}" height="${H - by + 4}" fill="none" stroke="#FD5F32" stroke-width="2.5"/>\n` +
      `      <rect x="${bx - 1.25}" y="${by - 30}" width="${tag.length * 11 + 20}" height="30" fill="#FD5F32"/>\n` +
      `      <text x="${bx + 9}" y="${by - 9}" fill="#F4F4F4" font-size="17" class="wm-tag">${tag}</text>\n` +
      `    </g>\n  </g>\n`);
  });
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" class="wordmark" style="display: inline-block">\n${body}</svg>\n`;
}

const args = process.argv.slice(2);
const pi = args.indexOf("--pitch"), P = pi >= 0 ? +args.splice(pi, 2)[1] : null;
const ti = args.indexOf("--tags"), tags = ti >= 0 ? args.splice(ti, 2)[1].split(",") : [];
if (args[0] === "--mask") writeFileSync(args[2], await convertMask(args[1], P ?? 5));
else if (args[0] === "--wordmark") writeFileSync(args[2], await convertWordmark(args[1], P ?? 6, tags));
else writeFileSync(args[1], await convertDashes(readFileSync(args[0], "utf8"), P ?? 4));
