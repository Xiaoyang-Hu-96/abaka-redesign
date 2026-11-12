/**
 * Hero "Cells and route". Ported from prototype/abaka-hero-fit.html, the final hero: the drawing,
 * the fitted annotation boxes, the bird video sample, the pointer pick and the timing are unchanged.
 * What changed for production:
 *  - colours come from the design tokens instead of the prototype's warm palette;
 *  - a compact 2x2 layout for screens under 1024px (no pointer pick there);
 *  - start/stop are explicit so the component can pause it off-screen.
 *
 * Everything sits on one grid. Five samples, one per data type, live in cells. The sample under
 * review turns dark, gets an orange box with the label a person gave it, and on wide screens a route
 * runs along the grid lines to the Annotate step. All samples are drawn; none is real data.
 */
import { monoFamily } from "@/lib/canvas-font";
import * as t from "@/lib/tokens";

const INK = t.colorInk;
const MARK = t.colorAccent;
const ON_MARK = t.colorOnAccent;
const LINE = t.colorLine;
const RAIL = t.colorGrey500;
const NODE_OFF = t.colorGrey600;
const PAGE = t.colorCanvas;
const LABEL = t.colorInk64; // ink-64, passes AA at 11px
const LABEL_ON = t.colorInk72;

const SIG = ["text", "image", "audio", "video", "3d"];
const TAGS = ["final_answer", "lemon", "speaker_a", "bird", "box"];
/** Review order: audio first, it is the largest sample and the first frame should have one focus. */
const ORDER = [2, 1, 0, 3, 4];
const DWELL = 3.6;

const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const ease = (x: number) => x * x * (3 - 2 * x);
function hash(a: number, b = 0, c = 0) {
  let h = Math.imul(a | 0, 374761393) ^ Math.imul(b | 0, 668265263) ^ Math.imul(c | 0, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1103515245);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function vnoise(x: number, y: number) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, 7), b = hash(xi + 1, yi, 7), c = hash(xi, yi + 1, 7), d = hash(xi + 1, yi + 1, 7);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

type Rect = { top: number; bottom: number; left: number; right: number };

export function createHero(canvas: HTMLCanvasElement, getCopyRect: () => Rect | null, reduced: boolean) {
  const ctx = canvas.getContext("2d")!;
  let W = 0, H = 0, DPR = 1, raf = 0, running = false;
  const S: { al: number[]; t0?: number; act?: number; at: number } = { al: [0.32, 0.32, 0.32, 0.32, 0.32], at: 0 };
  const ptr = { x: -999, y: -999 };

  const bar = (x: number, y: number, w: number, h: number, a: number, col?: string) => {
    ctx.globalAlpha = a; ctx.fillStyle = col || INK; ctx.fillRect(x, y, w, h);
  };
  const mono = (text: string, x: number, y: number, col: string, size = 11, alpha = 1) => {
    ctx.globalAlpha = alpha; ctx.font = `500 ${size}px ${monoFamily()}`;
    ctx.textBaseline = "middle"; ctx.textAlign = "left"; ctx.fillStyle = col; ctx.fillText(text, x, y);
  };
  const tag = (text: string, x: number, y: number) => {
    ctx.font = `500 11px ${monoFamily()}`;
    const w = ctx.measureText(text).width + 12;
    ctx.globalAlpha = 1; ctx.fillStyle = MARK; ctx.fillRect(x, y - 18, w, 18);
    ctx.fillStyle = ON_MARK; ctx.textBaseline = "middle"; ctx.fillText(text, x + 6, y - 8.5);
  };
  const box = (x: number, y: number, w: number, h: number) => {
    ctx.globalAlpha = 1; ctx.strokeStyle = MARK; ctx.lineWidth = 1.5;
    ctx.strokeRect(Math.round(x) + 0.5, Math.round(y) + 0.5, Math.round(w), Math.round(h));
  };

  /**
   * Scanlines, the one line language of the site. Each row of a shape is a single thin line;
   * its ragged ends draw the silhouette, a small gap now and then reads as a skipped scan,
   * and a few short heavy bars sit on the line, more of them where `at` says the shape is dark.
   * `at(x, y)` returns 0 outside the shape, else its shade (0 lit, 1 dark), in local px.
   * `part(x)` splits a row into differently weighted runs (the marked span of the audio).
   */
  const THIN = 1.2, THICK = 2.4;
  function scan(
    px: number, py: number, pw: number, ph: number, at: (x: number, y: number) => number, a: number, seed: number,
    o: { P?: number; part?: (x: number) => number; alphaFor?: (part: number) => number; toneLines?: boolean } = {},
  ) {
    const P = o.P ?? 4, rows = Math.floor(ph / P);
    for (let r = 0; r < rows; r++) {
      const yc = r * P + P / 2;
      let x = 0;
      while (x < pw) {
        if (at(x, yc) <= 0) { x++; continue; }
        const pid = o.part ? o.part(x) : 0;
        let b = x, sum = 0;
        while (b < pw && at(b, yc) > 0 && (o.part ? o.part(b) : 0) === pid) { sum += at(b, yc); b++; }
        const shade = sum / (b - x), al = (o.alphaFor ? o.alphaFor(pid) : a) * (o.toneLines ? 0.35 + 0.85 * shade : 1);
        /* ragged ends only where the shape itself ends, not where a span changes weight */
        const s0 = x === 0 || at(x - 1, yc) <= 0 ? (hash(r, x, seed) - 0.5) * 5 : 0;
        const s1 = b >= pw || at(b, yc) <= 0 ? (hash(r, b, seed + 1) - 0.5) * 6 : 0;
        const x0 = px + x + s0, len = b - x + s1 - s0, y = py + yc;
        if (len > 2) {
          if (len > 30 && hash(r, 3, seed) < 0.22) {
            const g = x0 + len * (0.2 + 0.6 * hash(r, 4, seed)), gw = 2 + hash(r, 5, seed) * 4;
            bar(x0, y - THIN / 2, g - x0, THIN, al * 0.7); bar(g + gw, y - THIN / 2, x0 + len - g - gw, THIN, al * 0.7);
          } else bar(x0, y - THIN / 2, len, THIN, al * 0.7);
          const n = 1 + Math.floor(hash(r, 6, seed) * 2.5);
          for (let k = 0; k < n; k++) {
            if (k > 0 && hash(r, 20 + k, seed) > shade) continue;
            const t = k === 0 ? hash(r, 7, seed) * 0.2 : hash(r, 8 + k, seed);
            const bx = x0 + t * len, bl = Math.min(x0 + len - bx, 4 + hash(r, 30 + k, seed) * 18);
            if (bl > 2) bar(bx, y - THICK / 2, bl, THICK, al);
          }
        }
        x = b + 1;
      }
    }
  }
  /** Lemon: a pointed oval and a leaf. Lit upper left, dark lower right. */
  function lemon(pw: number, ph: number) {
    const m = Math.min(pw / 1.05, ph / 0.86);
    return (x: number, y: number) => {
      const X = (x - pw / 2) / m, Y = (y - 0.54 * ph) / m;
      if (Math.pow(Math.abs(X) / 0.36, 2.2) + Math.pow(Math.abs(Y) / 0.25, 2) < 1 || Math.hypot(Math.abs(X) - 0.375, Y) < 0.05)
        return Math.max(0.05, clamp(0.5 + X * 1.1 + Y * 1.6));
      const lx = X - 0.1, ly = Y + 0.33, c = Math.cos(-0.5), sn = Math.sin(-0.5);
      return ((lx * c - ly * sn) / 0.15) ** 2 + ((lx * sn + ly * c) / 0.055) ** 2 < 1 ? 0.8 : 0;
    };
  }
  /**
   * Draws one sample and returns the box a person would mark on it: the first paragraph of the
   * text, the lemon, a span of the audio, the bird in one video frame, the 3D shelf.
   * `te` is the time since this sample was picked (99 when it is not the one under review).
   */
  function sample(i: number, px: number, py: number, pw: number, ph: number, a: number, time: number, te: number): number[] {
    const P = 5, TH = 2; if (reduced) time = 0;
    let bb = [px, py, pw, ph];
    if (i === 0) {
      const rows = Math.floor(ph / P); let para = 0, ln = 0, y0 = 1e9, y1 = 0, mw = 0;
      for (let r = 0; r < rows; r++) {
        const plen = 3 + Math.floor(hash(para, 0, 41) * 4); if (ln >= plen) { ln = 0; para++; continue; }
        /* text keeps one line per text line, so it still reads as text, in the scanline weights */
        const full = ln === plen - 1 ? 0.25 + 0.4 * hash(para, 1, 42) : 0.82 + 0.18 * hash(r, 2, 43), y = py + r * P + P / 2;
        const len = pw * full + (hash(r, 3, 44) - 0.5) * 6;
        bar(px, y - THIN / 2, len, THIN, a * 0.7);
        bar(px + hash(r, 4, 44) * 3, y - THICK / 2, 5 + hash(r, 5, 44) * 16, THICK, a);
        if (hash(r, 6, 44) < 0.35) bar(px + len * (0.3 + 0.5 * hash(r, 7, 44)), y - THICK / 2, 4 + hash(r, 8, 44) * 12, THICK, a);
        if (para === 0) { y0 = Math.min(y0, y - TH); y1 = y + TH; mw = Math.max(mw, pw * full); }
        ln++;
      }
      if (y1) bb = [px - 5, y0 - 5, mw + 10, y1 - y0 + 10];
    } else if (i === 1) {
      scan(px, py, pw, ph, lemon(pw, ph), a, 51, { P: 3.5 });
      const m = Math.min(pw / 1.05, ph / 0.86);
      bb = [px + pw / 2 - 0.45 * m, py + 0.54 * ph - 0.41 * m, 0.9 * m, 0.78 * m];
    } else if (i === 2) {
      /* the marked span (36-66%) stays dark; the rest of the waveform dims while audio is under review */
      /* speech as a few syllables: smooth lozenges along the line, each one breathing slowly.
         Drawn as scanlines they read like the shapes in the rest of the site, not a jagged meter. */
      const syl = [[0.12, 0.07], [0.3, 0.1], [0.51, 0.12], [0.7, 0.08], [0.88, 0.06]];
      const hs: number[] = [];
      for (let x = 0; x < pw; x++) {
        const u = x / pw; let h = 0;
        syl.forEach(([c, w], k) => {
          const amp = 0.45 + 0.55 * vnoise(time * 0.35 + k * 3.1, 2.7);
          h = Math.max(h, amp * Math.exp(-(((u - c) / w) ** 2)));
        });
        hs[x] = h * ph * 0.92;
      }
      const inS = (x: number) => (x / pw >= 0.36 && x / pw < 0.66 ? 1 : 0);
      scan(px, py, pw, ph, (x, y) => (hs[x] > 2 && Math.abs(y - ph / 2) < hs[x] / 2 ? 0.25 + 0.75 * (1 - Math.abs(y - ph / 2) / (hs[x] / 2)) : 0), a, 71, {
        P: 3.5, part: inS, alphaFor: (p) => (a > 0.5 && !p ? 0.26 + (a - 0.26) * 0.25 : a),
      });
      bb = [px + pw * 0.36, py - 2, pw * 0.3, ph + 4];
    } else if (i === 3) {
      /* three frames stacked like a strip of film: a bird seen head-on, wings up, level, down, drifting
         right. Under review, the box starts on the first frame and slides to the second, the way a
         tracked object is followed from frame to frame; the frame under the box is the dark one. */
      const g = Math.max(8, ph * 0.13), fh = (ph - 2 * g) / 3, span = Math.min(pw * 0.36, fh * 1.7), lift = [0.42, 0.06, -0.34];
      const drift = reduced ? 0 : Math.sin(time * 0.5) * 0.03, on = a > 0.5, fpos = on ? ease(clamp((te - 0.15) / 0.45)) : 1, B: number[][] = [];
      for (let f = 0; f < 3; f++) {
        const fy = py + f * (fh + g), cx = pw * (0.42 + f * 0.08 + drift), cy = fh * (0.5 + lift[f] * 0.42), L = lift[f] * fh;
        const af = on ? 0.26 + (a - 0.26) * clamp(1 - Math.abs(f - fpos)) : a;
        scan(px, fy, pw, fh, (x, y) => {
          const X = x - cx, Y = y - cy, sx = Math.abs(X) / span;
          if ((X / (span * 0.15)) ** 2 + (Y / (fh * 0.21)) ** 2 < 1) return 0.9;
          if (Y > fh * 0.12 && Y < fh * 0.34 && Math.abs(X) < span * (0.04 + 0.22 * (Y / fh - 0.12))) return 0.7;
          if (sx > 1) return 0;
          const wy = -L * Math.pow(sx, 1.15) - fh * 0.16 * Math.sin(Math.PI * sx), th = Math.max(1.6, fh * (0.17 - 0.13 * sx));
          return Math.abs(Y - wy) < th ? 0.6 - 0.4 * sx : 0;
        }, af, 61 + f, { P: 3 });
        const top = Math.min(0, -L) - fh * 0.3, bot = Math.max(fh * 0.34, -L + fh * 0.16);
        B.push([px + cx - span - 10, fy + cy + top - 7, 2 * span + 20, bot - top + 14]);
      }
      bb = B[0].map((v, q) => v + (B[1][q] - v) * fpos);
    } else {
      /* a box turning slowly, seen from a little above. Each visible face is a scanline field;
         the face turned away from the light (upper left) collects more heavy bars, and a 2px
         gap between faces draws the edges. */
      const an = reduced ? 0.62 : 0.62 + time * 0.3, ca = Math.cos(an), sa = Math.sin(an), ct = Math.cos(0.5), st = Math.sin(0.5);
      const s = Math.min(pw, ph) * 0.34, cx = pw / 2, cy = ph / 2;
      const tf = (x: number, y: number, z: number) => {
        const X = x * ca - z * sa, Z = x * sa + z * ca;
        return [X, y * ct - Z * st, y * st + Z * ct];
      };
      const V = [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => tf(x, y, z))));
      const F: [number[], number[]][] = [
        [[0, 1, 3, 2], [-1, 0, 0]], [[4, 6, 7, 5], [1, 0, 0]], [[0, 4, 5, 1], [0, -1, 0]],
        [[2, 3, 7, 6], [0, 1, 0]], [[0, 2, 6, 4], [0, 0, -1]], [[1, 5, 7, 3], [0, 0, 1]],
      ];
      const L = [-0.42, -0.84, -0.34];
      const faces = F.map(([idx, n]) => {
        const N = tf(n[0], n[1], n[2]);
        const pts = idx.map((k) => [cx + V[k][0] * s, cy + V[k][1] * s]);
        const mx = pts.reduce((q, p) => q + p[0], 0) / 4, my = pts.reduce((q, p) => q + p[1], 0) / 4, k = 1 - 5 / s;
        const lit = Math.max(0, N[0] * L[0] + N[1] * L[1] + N[2] * L[2]);
        return { visible: N[2] < 0, pts: pts.map(([x, y]) => [mx + (x - mx) * k, my + (y - my) * k]), shade: 0.12 + 0.8 * (1 - lit) };
      }).filter((f) => f.visible);
      const inside = (pts: number[][], x: number, y: number) => {
        let sign = 0;
        for (let k = 0; k < 4; k++) {
          const [x1, y1] = pts[k], [x2, y2] = pts[(k + 1) % 4], c = (x2 - x1) * (y - y1) - (y2 - y1) * (x - x1);
          if (c !== 0) { if (sign === 0) sign = Math.sign(c); else if (Math.sign(c) !== sign) return false; }
        }
        return true;
      };
      scan(px, py, pw, ph, (x, y) => { for (const f of faces) if (inside(f.pts, x, y)) return f.shade; return 0; }, a, 81, { P: 3.5, toneLines: true });
      const xs = V.map((v) => cx + v[0] * s), ys = V.map((v) => cy + v[1] * s);
      bb = [px + Math.min(...xs) - 8, py + Math.min(...ys) - 8, Math.max(...xs) - Math.min(...xs) + 16, Math.max(...ys) - Math.min(...ys) + 16];
    }
    return bb;
  }

  function strokeGrid(cols: number, rows: number, cw: number, ch: number, skip: (i: number, j: number) => boolean) {
    ctx.globalAlpha = 1; ctx.strokeStyle = LINE; ctx.lineWidth = 1;
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      if (skip(i, j)) continue;
      ctx.strokeRect(Math.round(i * cw) + 0.5, Math.round(j * ch) + 0.5, Math.round(cw), Math.round(ch));
    }
  }

  function drawWide(time: number) {
    const cols = 8, rows = 4, cw = W / cols, ch = H / rows, c = getCopyRect() ?? { top: 0, bottom: 0, left: 0, right: 0 };
    const r0 = Math.floor((c.top - 12) / ch), r1 = Math.floor((c.bottom + 12) / ch);
    strokeGrid(cols, rows, cw, ch, (i, j) => i < 4 && j >= r0 && j <= r1);
    const T = [[0, 0, 1, 1], [3, 3, 1, 1], [4, 2, 2, 1], [5, 0, 1, 1], [1, 3, 1, 1]];
    const R = (k: number) => [T[k][0] * cw, T[k][1] * ch, T[k][2] * cw, T[k][3] * ch];
    /* a sample whose cell would sit under the copy is left out, so the text always wins */
    const ok = (k: number) => { const r = R(k); return !(r[0] < W / 2 - 2 && r[1] < c.bottom + 12 && r[1] + r[3] > c.top - 12); };
    /* the pointer picks the sample under it; otherwise the timer walks the review order */
    let hov = -1;
    for (let k = 0; k < 5; k++) { const r = R(k); if (ok(k) && ptr.x >= r[0] && ptr.x < r[0] + r[2] && ptr.y >= r[1] && ptr.y < r[1] + r[3]) hov = k; }
    if (S.t0 === undefined) S.t0 = time;
    let oi = reduced ? 0 : Math.floor((time - S.t0) / DWELL) % 5, act = hov >= 0 ? hov : ORDER[oi];
    while (!ok(act)) { oi = (oi + 1) % 5; act = ORDER[oi]; }
    if (S.act !== act) { S.act = act; S.at = time; }
    const pad = Math.min(26, ch * 0.14), teS = reduced ? 99 : time - S.at, bbs: number[][] = [];
    for (let k = 0; k < 5; k++) {
      if (!ok(k)) continue;
      const tg = k === act ? 0.9 : 0.26; S.al[k] = reduced ? tg : S.al[k] + (tg - S.al[k]) * 0.14;
      const [x, y, w, h] = R(k);
      bbs[k] = sample(k, x + pad, y + pad, w - 2 * pad, h - 2 * pad - 18, S.al[k], time, k === act ? teS : 99);
      mono(SIG[k], x + pad, y + h - 16, k === act ? LABEL_ON : LABEL);
    }
    /* The story of one sample, restarted whenever a different one is picked (by the timer or the pointer):
       0.0-1.1s a route runs along the grid lines to the Annotate step; 1.1-1.5s the label appears;
       1.8-2.4s the marker moves down the rail to Evaluate; 2.4s on Evaluate reads "passed".
       Video waits half a second first, while its box moves from the first frame to the second. */
    const te = reduced ? 99 : teS - (act === 3 ? 0.55 : 0), rx = Math.round(7 * cw), sx = (T[act][0] + T[act][2]) * cw, sy = T[act][1] * ch, ey = 2 * ch;
    const L1 = rx - sx, L2 = Math.abs(ey - sy);
    const pr = ease(clamp(te / 1.1)), d = pr * (L1 + L2), arrived = clamp((te - 1.0) / 0.4), p2 = ease(clamp((te - 1.8) / 0.6)), passed = clamp((te - 2.4) / 0.3);
    ctx.globalAlpha = 1; ctx.fillStyle = RAIL; ctx.fillRect(rx, Math.round(ch), 1, Math.round(3 * ch));
    ctx.fillStyle = INK; ctx.fillRect(Math.round(sx), Math.round(sy), Math.round(Math.min(d, L1)) + 1, 1);
    if (d > L1) { const len = d - L1; ctx.fillRect(rx, Math.round(ey > sy ? sy : sy - len), 1, Math.round(len) + 1); }
    if (p2 > 0) ctx.fillRect(rx, Math.round(ey), 1, Math.round(p2 * ch) + 1);
    const node = (y: number, on: boolean) => {
      ctx.globalAlpha = 1; ctx.fillStyle = PAGE; ctx.fillRect(rx - 3, Math.round(y) - 3, 7, 7);
      ctx.strokeStyle = on ? INK : NODE_OFF; ctx.lineWidth = 1; ctx.strokeRect(rx - 2.5, Math.round(y) - 2.5, 6, 6);
      if (on) { ctx.fillStyle = INK; ctx.fillRect(rx - 1, Math.round(y) - 1, 3, 3); }
    };
    node(ch, true); node(2 * ch, arrived > 0); node(3 * ch, passed > 0);
    const mx = d < L1 ? sx + d : rx, my = p2 > 0 ? ey + p2 * ch : d < L1 ? sy : sy + Math.sign(ey - sy) * (d - L1);
    ctx.globalAlpha = 1; ctx.fillStyle = MARK; ctx.fillRect(Math.round(mx) - 3, Math.round(my) - 3, 7, 7);
    const ix = rx + 18;
    mono("COLLECT", ix, ch + 24, LABEL_ON); mono("done", ix, 2 * ch - 22, LABEL);
    mono("ANNOTATE", ix, 2 * ch + 24, arrived > 0 ? INK : LABEL); mono("label", ix, 3 * ch - 44, LABEL);
    mono(TAGS[act], ix, 3 * ch - 22, INK, 15, arrived);
    mono("EVALUATE", ix, 3 * ch + 24, passed > 0 ? INK : LABEL);
    if (passed <= 0) mono("next", ix, 4 * ch - 22, LABEL);
    else mono("passed", ix, 4 * ch - 22, INK, 15, passed);
    /* the orange box fits the part a person would mark: a span of audio, an object, a passage, a figure in one frame */
    const a = bbs[act]; box(a[0], a[1], a[2], a[3]);
    if (act === 3) { if (teS > 0.6) tag(TAGS[act], Math.round(a[0] + a[2]) + 3, Math.round(a[1]) + 19); }
    else tag(TAGS[act], Math.round(a[0]), a[1] - 18 < 2 ? Math.round(a[1] + a[3]) + 19 : Math.round(a[1]) + 1);
  }

  /** Compact: a 2x2 grid of text, video, 3d and image. The box moves between them; no route. */
  function drawCompact(time: number) {
    const cells = [0, 3, 4, 1], cw = W / 2, ch = H / 2, pad = 16;
    strokeGrid(2, 2, cw, ch, () => false);
    if (S.t0 === undefined) S.t0 = time;
    const act = reduced ? 3 : Math.floor((time - S.t0) / DWELL) % 4;
    cells.forEach((k, n) => {
      const x = (n % 2) * cw, y = Math.floor(n / 2) * ch, tg = n === act ? 0.9 : 0.26;
      S.al[k] = reduced ? tg : S.al[k] + (tg - S.al[k]) * 0.14;
      sample(k, x + pad, y + pad + 8, cw - 2 * pad, ch - 2 * pad - 26, S.al[k], time, 99);
      mono(SIG[k], x + 12, y + ch - 16, n === act ? LABEL_ON : LABEL);
    });
    const x = (act % 2) * cw, y = Math.floor(act / 2) * ch;
    box(x + 10, y + 26, cw - 20, ch - 52); tag(TAGS[cells[act]], Math.round(x + 10), Math.round(y + 27));
  }

  function size() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    const r = canvas.getBoundingClientRect(); W = Math.round(r.width); H = Math.round(r.height);
    canvas.width = W * DPR; canvas.height = H * DPR;
  }
  function frame(now: number) {
    const time = now / 1000;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, W, H);
    if (W >= 900) drawWide(time); else drawCompact(time);
    ctx.globalAlpha = 1;
    if (running && !reduced) raf = requestAnimationFrame(frame);
  }

  return {
    resize() { size(); frame(performance.now()); },
    start() { if (running) return; running = true; size(); raf = requestAnimationFrame(frame); },
    stop() { running = false; cancelAnimationFrame(raf); },
    /** Pointer position relative to the canvas; pass null when it leaves. */
    pointer(x: number | null, y = 0) {
      ptr.x = x ?? -999; ptr.y = x === null ? -999 : y;
      if (reduced) frame(performance.now()); // no animation loop runs with reduced motion, so redraw once
    },
  };
}
