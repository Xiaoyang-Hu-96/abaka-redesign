/**
 * Hero "Cells and route". Ported from prototype/abaka-hero.html: the drawing and the timing
 * parameters are unchanged. What changed for production:
 *  - colours come from the design tokens instead of the prototype's warm palette;
 *  - the pointer no longer picks a sample (interaction spec: the hero ignores the pointer);
 *  - a compact 2x2 layout for screens under 1024px;
 *  - start/stop are explicit so the component can pause it off-screen.
 *
 * Everything sits on one grid. Five samples, one per data type, live in cells. The sample under
 * review turns dark, gets an orange box with the label a person gave it, and on wide screens a route
 * runs along the grid lines to the Annotate step. All samples are drawn; none is real data.
 */
import * as t from "@/lib/tokens";

const INK = t.colorInk;
const MARK = t.colorAccent;
const ON_MARK = t.colorOnAccent;
const LINE = t.colorLine;
const RAIL = t.colorGrey500;
const NODE_OFF = t.colorGrey600;
const PAGE = t.colorCanvas;
const LABEL = t.colorInk64; // ink-64, passes AA at 11px
const LABEL_ON = "#141414B8"; // ink-72

const SIG = ["text", "image", "audio", "video", "3d"];
const TAGS = ["final_answer", "lemon", "speaker_a", "pedestrian", "shelf"];
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

  const bar = (x: number, y: number, w: number, h: number, a: number, col?: string) => {
    ctx.globalAlpha = a; ctx.fillStyle = col || INK; ctx.fillRect(x, y, w, h);
  };
  const mono = (text: string, x: number, y: number, col: string, size = 11, alpha = 1) => {
    ctx.globalAlpha = alpha; ctx.font = `500 ${size}px "JetBrains Mono", monospace`;
    ctx.textBaseline = "middle"; ctx.textAlign = "left"; ctx.fillStyle = col; ctx.fillText(text, x, y);
  };
  const tag = (text: string, x: number, y: number) => {
    ctx.font = '500 11px "JetBrains Mono", monospace';
    const w = ctx.measureText(text).width + 12;
    ctx.globalAlpha = 1; ctx.fillStyle = MARK; ctx.fillRect(x, y - 18, w, 18);
    ctx.fillStyle = ON_MARK; ctx.textBaseline = "middle"; ctx.fillText(text, x + 6, y - 8.5);
  };
  const box = (x: number, y: number, w: number, h: number) => {
    ctx.globalAlpha = 1; ctx.strokeStyle = MARK; ctx.lineWidth = 1.5;
    ctx.strokeRect(Math.round(x) + 0.5, Math.round(y) + 0.5, Math.round(w), Math.round(h));
  };

  /** Shape drawn as rows of dashes with exact edges. */
  function fillShape(px: number, py: number, pw: number, ph: number, inside: (u: number, v: number) => boolean, pitch: number, seed: number, alpha: number, thk: number) {
    const rows = Math.floor(ph / pitch), th = thk || Math.max(1.6, pitch * 0.5);
    for (let r = 0; r < rows; r++) {
      const y = py + r * pitch, v = (r + 0.5) / rows; let a = -1, k = 0;
      for (let q = 0; q <= pw; q++) {
        const on = q < pw && inside((q + 0.5) / pw, v);
        if (on && a < 0) a = q;
        if (a >= 0 && (!on || q - a >= 6 + hash(r, k, seed) * 10)) { bar(px + a, y, q - a, th, alpha || 0.8); a = on ? q + 2 : -1; if (on) q += 1; k++; }
      }
    }
  }
  /** Tone drawn with one dash: darker areas get longer dashes and smaller gaps. */
  function fillTone(px: number, py: number, pw: number, ph: number, tone: (u: number, v: number) => number, P: number, seed: number, a: number, th: number) {
    const rows = Math.floor(ph / P);
    for (let r = 0; r < rows; r++) {
      const y = py + r * P, v = (r + 0.5) / rows; let x = 0, k = 0;
      while (x < pw) {
        const tn = tone((x + 1.5) / pw, v); if (tn <= 0.03) { x += 2; continue; }
        let len = Math.min(pw - x, (3 + tn * 12) * (0.75 + 0.5 * hash(r, k, seed)));
        while (len > 2 && tone((x + len) / pw, v) <= 0.03) len -= 1;
        bar(px + x, y, len, th, a); x += len + 2 + (1 - tn) * 8; k++;
      }
    }
  }
  function lemon(pw: number, ph: number) {
    const m = Math.min(pw / 1.05, ph / 0.86);
    return (u: number, v: number) => {
      const X = ((u - 0.5) * pw) / m, Y = ((v - 0.54) * ph) / m;
      const q = Math.pow(Math.abs(X) / 0.36, 2.2) + Math.pow(Math.abs(Y) / 0.25, 2);
      if (q < 1 || Math.hypot(Math.abs(X) - 0.375, Y) < 0.06) {
        if (Math.hypot(X + 0.14, Y + 0.1) < 0.07) return 0.04;
        const sh = clamp(0.42 + X * 0.9 + Y * 1.7);
        return q > 0.86 ? Math.max(0.85, sh) : 0.06 + 0.9 * sh * sh;
      }
      const lx = X - 0.1, ly = Y + 0.33, c = Math.cos(-0.5), sn = Math.sin(-0.5), lu = lx * c - ly * sn, lv = lx * sn + ly * c;
      if ((lu / 0.14) ** 2 + (lv / 0.05) ** 2 < 1) return 0.9;
      const sy = (Y - 0.31) / 0.035;
      if (Math.abs(sy) < 1 && Math.abs(X - 0.06) < 0.4 * Math.sqrt(1 - sy * sy)) return 0.95;
      return 0;
    };
  }
  function sample(i: number, px: number, py: number, pw: number, ph: number, a: number, time: number) {
    const P = 5, TH = 2; if (reduced) time = 0;
    if (i === 0) {
      const rows = Math.floor(ph / P); let para = 0, ln = 0;
      for (let r = 0; r < rows; r++) {
        const plen = 3 + Math.floor(hash(para, 0, 41) * 4); if (ln >= plen) { ln = 0; para++; continue; }
        const full = ln === plen - 1 ? 0.25 + 0.4 * hash(para, 1, 42) : 0.82 + 0.18 * hash(r, 2, 43); let x = px, k = 0;
        while (x < px + pw * full) { const w = 8 + hash(r, k, 44) * 26; bar(x, py + r * P, Math.min(w, px + pw * full - x), TH, a); x += w + 4; k++; }
        ln++;
      }
    } else if (i === 1) {
      fillTone(px, py, pw, ph, lemon(pw, ph), 4, 51, a, TH);
    } else if (i === 2) {
      const Pa = 4, cnt = Math.floor(pw / Pa);
      for (let k = 0; k < cnt; k++) {
        const u = k * 0.1 + time * 0.6, env = Math.pow(vnoise(u * 0.22, 9.1), 1.3);
        const amp = env * (0.12 + 0.88 * Math.pow(vnoise(u * 1.7, 3.3), 1.6)), h = Math.min(ph, Math.max(3, amp * ph * 1.9));
        bar(px + k * Pa, py + ph / 2 - h / 2, TH, h, a);
      }
    } else if (i === 3) {
      const g = pw * 0.08, fw = (pw - 2 * g) / 3, fh = Math.min(ph, fw * 2.6), fy = py + (ph - fh) / 2, step = reduced ? 0 : ((time * 0.12) % 1) * 0.1;
      for (let f = 0; f < 3; f++) {
        const c = 0.34 + f * 0.12 + step;
        fillShape(px + f * (fw + g), fy, fw, fh, (u, v) => {
          const dx = ((u - c) * fw) / fh;
          if (Math.hypot(dx, v - 0.2) < 0.085) return true;
          if (Math.abs(dx) < 0.085 && v > 0.32 && v < 0.62) return true;
          if (v >= 0.62 && v < 0.88 && Math.abs(Math.abs(dx) - 0.05) < 0.035) return true;
          return v > 0.94;
        }, P, 61 + f, a, TH);
      }
    } else {
      const an = reduced ? 0.55 : 0.55 + Math.sin(time * 0.45) * 0.4, ca = Math.cos(an), sa = Math.sin(an), sc = Math.min(pw, ph) * 0.56;
      const nx = Math.round(clamp(pw / 15, 5, 12)), ny = Math.round(nx * 1.3);
      const pt = (x: number, y: number, z: number) => {
        const X = x * ca - z * sa, Z = x * sa + z * ca, pers = 2 / (2 + Z * 0.5);
        bar(px + pw / 2 + X * sc * pers - 2.5, py + ph / 2 + (y * 0.86 - Z * 0.1) * sc * pers - 1, 5, TH, a);
      };
      for (let b = 0; b < 4; b++) for (let ix = 0; ix < nx; ix++) for (let iz = 0; iz < 3; iz++) pt(ix / (nx - 1) - 0.5, -0.9 + b * 0.6, (iz / 2 - 0.5) * 0.55);
      for (let sd = -1; sd <= 1; sd += 2) for (let iy = 0; iy < ny; iy++) for (let iz = 0; iz < 3; iz++) pt(sd * 0.5, -0.9 + (iy / (ny - 1)) * 1.8, (iz / 2 - 0.5) * 0.55);
    }
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
    if (S.t0 === undefined) S.t0 = time;
    let oi = reduced ? 0 : Math.floor((time - S.t0) / DWELL) % 5, act = ORDER[oi];
    while (!ok(act)) { oi = (oi + 1) % 5; act = ORDER[oi]; }
    const pad = Math.min(26, ch * 0.14);
    for (let k = 0; k < 5; k++) {
      if (!ok(k)) continue;
      const tg = k === act ? 0.9 : 0.26; S.al[k] = reduced ? tg : S.al[k] + (tg - S.al[k]) * 0.14;
      const [x, y, w, h] = R(k);
      sample(k, x + pad, y + pad, w - 2 * pad, h - 2 * pad - 18, S.al[k], time);
      mono(SIG[k], x + pad, y + h - 16, k === act ? LABEL_ON : LABEL);
    }
    /* The story of one sample, restarted whenever a different one is picked:
       0.0-1.1s a route runs along the grid lines to the Annotate step; 1.1-1.5s the label appears;
       1.8-2.4s the marker moves down the rail to Evaluate; 2.4s on Evaluate reads "passed". */
    if (S.act !== act) { S.act = act; S.at = time; }
    const te = reduced ? 99 : time - S.at, rx = Math.round(7 * cw), sx = (T[act][0] + T[act][2]) * cw, sy = T[act][1] * ch, ey = 2 * ch;
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
    const a = R(act); box(a[0], a[1], a[2], a[3]);
    tag(TAGS[act], Math.round(a[0]), Math.round(a[1]) + (T[act][1] === 0 ? a[3] + 19 : 1));
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
      sample(k, x + pad, y + pad + 8, cw - 2 * pad, ch - 2 * pad - 26, S.al[k], time);
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
  };
}
