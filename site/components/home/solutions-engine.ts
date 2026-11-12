/**
 * The four Solutions scenes, animated in the hero's line language (scanlines, see hero-engine.ts).
 * Each scene is a full 634×360 picture: the open panel plays it; a collapsed strip shows a still frame
 * of the middle of it. Every scene has an orange box on what a person would label, as in the hero.
 *
 *  - physical: a robot arm carries the lemon across the table; the lemon's box tracks it frame by frame.
 *  - agents:   a cursor fills in a form and submits it; each action is boxed and named; its path is kept.
 *  - voice:    a microphone between two waveforms; the speakers take turns and the active one is boxed.
 *  - llm:      a reasoning tree grows from a prompt; an expert marks one answer correct, the others fade.
 *
 * Static parts are drawn once to an offscreen canvas; only the moving parts are scanned per frame.
 */
import { monoFamily } from "@/lib/canvas-font";
import * as t from "@/lib/tokens";

const INK = t.colorInk;
const MARK = t.colorAccent;
const ON_MARK = t.colorOnAccent;
export const SCENE_W = 634, SCENE_H = 360;

const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const ease = (x: number) => { x = clamp(x); return x * x * (3 - 2 * x); };
const mix = (a: number, b: number, s: number) => a + (b - a) * s;
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

/* ── shapes: f(x, y) → 0 outside, else shade 0.05 (lit) … 1 (solid). Light from the top left. ── */
type F = (x: number, y: number) => number;
const LX = -0.6, LY = -0.8;
function capsule(ax: number, ay: number, bx: number, by: number, r: number, tone = 0.45): F {
  const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy || 1;
  return (x, y) => {
    const s = clamp(((x - ax) * dx + (y - ay) * dy) / L2), ox = x - ax - s * dx, oy = y - ay - s * dy, d = Math.hypot(ox, oy);
    return d > r ? 0 : clamp(tone - 0.45 * ((ox * LX + oy * LY) / r), 0.05, 0.95);
  };
}
const circle = (cx: number, cy: number, r: number, tone = 0.45) => capsule(cx, cy, cx, cy, r, tone);
function rrect(x0: number, y0: number, x1: number, y1: number, r: number, tone = 0.45, grad = 0.25): F {
  return (x, y) => {
    if (x < x0 || x > x1 || y < y0 || y > y1) return 0;
    const qx = Math.max(x0 + r - x, 0, x - (x1 - r)), qy = Math.max(y0 + r - y, 0, y - (y1 - r));
    if (Math.hypot(qx, qy) > r) return 0;
    return clamp(tone + grad * ((x - x0) / (x1 - x0) + (y - y0) / (y1 - y0) - 1), 0.05, 1);
  };
}
function frame(x0: number, y0: number, x1: number, y1: number, r: number, th: number, tone = 0.45): F {
  const o = rrect(x0, y0, x1, y1, r, tone), i = rrect(x0 + th, y0 + th, x1 - th, y1 - th, Math.max(0, r - th), tone);
  return (x, y) => (i(x, y) ? 0 : o(x, y));
}
function poly(pts: number[][], tone = 0.6) {
  const inside = (x: number, y: number) => {
    let c = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const [xi, yi] = pts[i], [xj, yj] = pts[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const bb = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
  const f = ((x: number, y: number) => (inside(x, y) ? tone : 0)) as F & { near: (x: number, y: number, g: number) => boolean };
  f.near = (x, y, g) => {
    if (x < bb[0] - g || x > bb[2] + g || y < bb[1] - g || y > bb[3] + g) return false;
    if (inside(x, y)) return true;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const [ax, ay] = pts[j], [bx, by] = pts[i], dx = bx - ax, dy = by - ay;
      const s = clamp(((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy));
      if (Math.hypot(x - ax - s * dx, y - ay - s * dy) <= g) return true;
    }
    return false;
  };
  return f;
}
/** text rows: 4px bands (one scan row each) starting at x0 */
function rows(x0: number, ys: number[], lens: number[], tone = 0.6): F {
  return (x, y) => {
    for (let i = 0; i < ys.length; i++) if (y >= ys[i] && y < ys[i] + 4 && x >= x0 && x <= x0 + lens[i]) return tone;
    return 0;
  };
}
const union = (...fs: F[]): F => (x, y) => { for (const f of fs) { const v = f(x, y); if (v) return v; } return 0; };
const minus = (a: F, b: F): F => (x, y) => (b(x, y) ? 0 : a(x, y));
/** the hero lemon, in a pw×ph box at x0,y0 */
function lemon(x0: number, y0: number, pw: number, ph: number): F {
  const m = Math.min(pw / 1.05, ph / 0.86);
  return (x, y) => {
    const X = (x - x0 - pw / 2) / m, Y = (y - y0 - 0.54 * ph) / m;
    if (Math.pow(Math.abs(X) / 0.36, 2.2) + Math.pow(Math.abs(Y) / 0.25, 2) < 1 || Math.hypot(Math.abs(X) - 0.375, Y) < 0.05)
      return Math.max(0.05, clamp(0.5 + X * 1.1 + Y * 1.6, 0, 0.95));
    const lx = X - 0.1, ly = Y + 0.33, c = Math.cos(-0.5), sn = Math.sin(-0.5);
    return ((lx * c - ly * sn) / 0.15) ** 2 + ((lx * sn + ly * c) / 0.055) ** 2 < 1 ? 0.8 : 0;
  };
}

/* ── drawing ── */
type Api = {
  /** scan f inside the box [x0, y0, x1, y1] at alpha a */
  scan: (f: F, bb: number[], a?: number, seed?: number, P?: number) => void;
  box: (x: number, y: number, w: number, h: number, a?: number) => void;
  tag: (text: string, x: number, y: number, a?: number) => void;
  dot: (x: number, y: number, s: number, a: number) => void;
};
type Scene = { period: number; still: number; base: (api: Api) => void; draw: (api: Api, t: number) => void };

const SUBJECT = 0.55, FAINT = 0.22;

/** `marks`: draw the orange boxes and tags. A still strip leaves them out, they'd only show cut in half. */
function makeApi(ctx: CanvasRenderingContext2D, marks = true): Api {
  const bar = (x: number, y: number, w: number, h: number, a: number) => { ctx.globalAlpha = a; ctx.fillStyle = INK; ctx.fillRect(x, y, w, h); };
  const THIN = 1.2, THICK = 2.4;
  return {
    scan(f, bb, a = SUBJECT, seed = 1, P = 4) {
      const x0 = Math.max(0, Math.floor(bb[0])), x1 = Math.min(SCENE_W, Math.ceil(bb[2])), y1 = Math.min(SCENE_H, bb[3]);
      for (let y = Math.max(0, Math.floor(bb[1] / P)) * P + P / 2; y < y1; y += P) {
        const r = (y - P / 2) / P;
        let x = x0, run = 0;
        while (x < x1) {
          if (f(x, y) <= 0) { x++; continue; }
          let b = x, sum = 0;
          while (b < x1) { const v = f(b, y); if (v <= 0) break; sum += v; b++; }
          const shade = sum / (b - x);
          // ragged ends keyed on the row and run, not on x, so moving shapes don't boil
          const s0 = (hash(r, run, seed) - 0.5) * 4, s1 = (hash(r, run, seed + 1) - 0.5) * 5;
          const xa = x + s0, len = b - x + s1 - s0;
          if (len > 1.5) {
            if (shade >= 0.97) bar(xa, y - THICK / 2, len, THICK, a); // solid (the cursor, a pressed button)
            else {
              if (len > 30 && hash(r, run + 40, seed) < 0.2) {
                const g = xa + len * (0.2 + 0.6 * hash(r, run + 41, seed)), gw = 2 + hash(r, run + 42, seed) * 4;
                bar(xa, y - THIN / 2, g - xa, THIN, a * 0.7); bar(g + gw, y - THIN / 2, xa + len - g - gw, THIN, a * 0.7);
              } else bar(xa, y - THIN / 2, len, THIN, a * 0.7);
              const n = 1 + Math.floor(hash(r, run + 6, seed) * 2.5);
              for (let k = 0; k < n; k++) {
                if (k > 0 && hash(r, run * 5 + k + 20, seed) > shade) continue;
                const tt = k === 0 ? hash(r, run + 7, seed) * 0.2 : hash(r, run * 3 + k + 8, seed);
                const bx = xa + tt * len, bl = Math.min(xa + len - bx, 4 + hash(r, run * 7 + k + 30, seed) * Math.min(18, len * 0.6));
                if (bl > 1.5) bar(bx, y - THICK / 2, bl, THICK, a);
              }
            }
          }
          run++; x = b + 1;
        }
      }
    },
    box(x, y, w, h, a = 1) {
      if (!marks) return;
      ctx.globalAlpha = a; ctx.strokeStyle = MARK; ctx.lineWidth = 1.5;
      ctx.strokeRect(Math.round(x) + 0.5, Math.round(y) + 0.5, Math.round(w), Math.round(h));
    },
    tag(text, x, y, a = 1) {
      if (!marks) return;
      ctx.font = `500 11px ${monoFamily()}`;
      const w = ctx.measureText(text).width + 12;
      ctx.globalAlpha = a; ctx.fillStyle = MARK; ctx.fillRect(Math.round(x), Math.round(y) - 18, w, 18);
      ctx.fillStyle = ON_MARK; ctx.textBaseline = "middle"; ctx.textAlign = "left"; ctx.fillText(text, Math.round(x) + 6, Math.round(y) - 8.5);
    },
    dot(x, y, s, a) { bar(x - s / 2, y - s / 2, s, s, a); },
  };
}

/* ── Physical AI ── */
const TABLE = 300, SHOULDER = [452, 250], L1 = 165, L2 = 165, LEMON_W = 96, LEMON_H = 80, LEMON_TOP = 234, SPOTS = [196, 330];
function ik(wx: number, wy: number) {
  const [sx, sy] = SHOULDER, dx = wx - sx, dy = wy - sy, d = Math.min(Math.hypot(dx, dy), L1 + L2 - 1);
  const a = Math.atan2(dy, dx), b = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
  const e1 = [sx + L1 * Math.cos(a - b), sy + L1 * Math.sin(a - b)], e2 = [sx + L1 * Math.cos(a + b), sy + L1 * Math.sin(a + b)];
  return e1[1] < e2[1] ? e1 : e2;
}
const physical: Scene = {
  period: 8, still: 2.2,
  base(api) {
    // the table: an edge, then texture fading down
    api.scan((x, y) => (y < TABLE + 6 ? 0.3 : hash(x >> 4, y >> 2) > 0.3 + (y - TABLE - 6) / 80 ? 0.15 : 0), [0, TABLE, SCENE_W, SCENE_H], FAINT, 3, 7);
    // a camera on a tripod, recording the scene
    api.scan(union(
      rrect(30, 116, 96, 160, 6, 0.5), capsule(96, 138, 114, 138, 12, 0.6), rrect(44, 106, 70, 116, 2, 0.5),
      capsule(63, 160, 38, TABLE, 2.5, 0.6), capsule(63, 160, 63, TABLE, 2.5, 0.6), capsule(63, 160, 88, TABLE, 2.5, 0.6),
    ), [20, 100, 130, TABLE], SUBJECT * 0.8, 5);
    // a crate on the right
    api.scan(union(frame(524, 222, 612, TABLE, 3, 4, 0.5), rrect(524, 246, 612, 250, 0, 0.6), rrect(524, 270, 612, 274, 0, 0.6)), [520, 218, 616, TABLE], SUBJECT * 0.8, 6);
    // the robot's base
    api.scan(union(rrect(430, 262, 474, 284, 3, 0.5), rrect(410, 282, 494, TABLE, 3, 0.7)), [405, 258, 500, TABLE], SUBJECT, 7);
  },
  draw(api, time) {
    const half = Math.floor(time / 4) % 2, u = time % 4, P = SPOTS[half], Q = SPOTS[1 - half];
    const rest = [270, 140], above = [P, LEMON_TOP - 60], grip = [P, LEMON_TOP - 4], drop = [Q, LEMON_TOP - 4];
    const lp = (a: number[], b: number[], s: number) => [mix(a[0], b[0], s), mix(a[1], b[1], s)];
    let W = rest, open = 1, carry = false;
    if (u < 0.7) W = lp(rest, above, ease(u / 0.7));
    else if (u < 1.1) W = lp(above, grip, ease((u - 0.7) / 0.4));
    else if (u < 1.4) { W = grip; open = 1 - ease((u - 1.1) / 0.3); }
    else if (u < 2.6) { const s = ease((u - 1.4) / 1.2); W = [mix(P, Q, s), LEMON_TOP - 4 - 80 * Math.sin(Math.PI * s)]; open = 0; carry = true; }
    else if (u < 2.9) { W = drop; open = ease((u - 2.6) / 0.3); }
    else if (u < 3.6) W = lp(drop, rest, ease((u - 2.9) / 0.7));
    const lx = carry ? W[0] : u < 1.4 ? P : Q, ly = carry ? W[1] + 4 : LEMON_TOP;

    api.scan(lemon(lx - LEMON_W / 2, ly, LEMON_W, LEMON_H), [lx - 50, ly, lx + 50, ly + LEMON_H], SUBJECT, 11);
    const [wx, wy] = W, [ex, ey] = ik(wx, wy), [sx, sy] = SHOULDER, g = 36 + 14 * open;
    api.scan(union(
      capsule(wx - g, wy + 26, wx - g, wy + 52, 3.5, 0.6), capsule(wx + g, wy + 26, wx + g, wy + 52, 3.5, 0.6),
      capsule(wx - g - 4, wy + 26, wx + g + 4, wy + 26, 4, 0.55), capsule(wx, wy, wx, wy + 22, 8, 0.5), circle(wx, wy, 10, 0.5),
      capsule(ex, ey, wx, wy, 11, 0.45), circle(ex, ey, 15, 0.55), capsule(sx, sy, ex, ey, 14, 0.45), circle(sx, sy, 18, 0.6),
    ), [Math.min(wx, ex, sx) - 60, Math.min(wy, ey, sy) - 20, Math.max(wx, ex, sx) + 60, Math.max(wy + 56, sy + 20)], SUBJECT, 13);
    // keypoints on the joints
    [[sx, sy], [ex, ey], [wx, wy]].forEach(([x, y]) => api.dot(x, y, 5, 0.9));
    // the lemon, tracked
    api.box(lx - 42, ly + 4, 84, 66); api.tag("lemon", lx - 42, ly + 4);
  },
};

/* ── Agents ── */
const CURSOR = [[0, 0], [0, 17], [4, 13], [7, 20], [9, 19], [6, 12], [12, 12]];
const WAY: [number, number, number][] = [[0, 430, 286], [1, 300, 154], [2.3, 300, 154], [3, 330, 194], [4, 330, 194], [4.7, 250, 238], [6.6, 250, 238], [7.6, 430, 286], [8, 430, 286]];
function cursorAt(time: number) {
  for (let i = 1; i < WAY.length; i++) if (time <= WAY[i][0]) {
    const [t0, x0, y0] = WAY[i - 1], [t1, x1, y1] = WAY[i], s = ease((time - t0) / (t1 - t0 || 1));
    return [mix(x0, x1, s), mix(y0, y1, s)];
  }
  return [WAY[0][1], WAY[0][2]];
}
const F1 = [200, 140, 470, 166], F2 = [200, 180, 470, 206], BTN = [200, 224, 300, 252];
const agents: Scene = {
  period: 8, still: 2.0,
  base(api) {
    // a second task behind
    const back = union(frame(170, 52, 604, 320, 8, 3, 0.5), rrect(170, 52, 604, 72, 0, 0.45));
    api.scan((x, y) => (x >= 74 && x <= 506 && y >= 22 && y <= 304 ? 0 : back(x, y)), [166, 48, 608, 324], FAINT, 3);
  },
  draw(api, time) {
    const [cx, cy] = cursorAt(time);
    const arrow = poly(CURSOR.map(([x, y]) => [cx + x * 2.6, cy + y * 2.6]), 1);
    const reset = 1 - ease((time - 7.1) / 0.6);
    const typed1 = ease((time - 1.1) / 1.1) * 190 * reset, typed2 = ease((time - 3.1) / 0.8) * 130 * reset;
    const pressed = time > 4.75 && time < 5.05, done = ease((time - 5.1) / 0.5) * reset;
    const win = union(
      rrect(80, 28, 500, 52, 0, 0.55), // title bar
      frame(80, 28, 500, 298, 8, 4, 0.6),
      frame(92, 60, 488, 80, 4, 3, 0.55), rows(104, [68], [160], 0.5), // address bar
      rrect(184, 84, 188, 298, 0, 0.6), // sidebar edge
      rows(96, [96, 110, 124, 138, 152, 166, 180, 194], [70, 54, 76, 48, 66, 58, 72, 40], 0.45), // sidebar
      rows(200, [94], [150], 1), rows(200, [108, 118], [260, 190], 0.4), // heading and intro
      frame(F1[0], F1[1], F1[2], F1[3], 3, 3, 0.55), frame(F2[0], F2[1], F2[2], F2[3], 3, 3, 0.55),
      rows(210, [152], [typed1], 1), rows(210, [192], [typed2], 1), // what the agent typed
      rrect(BTN[0], BTN[1], BTN[2], BTN[3], 4, pressed ? 1 : 0.6),
      rows(316, [236], [done * 120], 1), // the confirmation
    );
    const dots = (x: number, y: number) => (Math.hypot(x - 96, y - 40) < 4 || Math.hypot(x - 110, y - 40) < 4 || Math.hypot(x - 124, y - 40) < 4 ? 0 : 1);
    api.scan((x, y) => (arrow.near(x, y, 4) ? 0 : dots(x, y) && win(x, y)), [76, 24, 504, 302], SUBJECT, 21);
    // the recorded path
    for (let s = 0.05; s < Math.min(time, 7.1); s += 0.06) { const [px, py] = cursorAt(s); api.dot(px + 2, py + 2, 2, 0.3 * reset); }
    api.scan(arrow, [cx - 2, cy - 2, cx + 34, cy + 56], SUBJECT, 23);
    // what the agent is doing right now
    const act: [number[], string] | null =
      time > 1 && time < 2.3 ? [F1, "type"] : time > 3 && time < 4 ? [F2, "type"] : time > 4.7 && time < 5.6 ? [BTN, "click"] : null;
    if (act) { const [b, label] = act; api.box(b[0] - 5, b[1] - 5, b[2] - b[0] + 10, b[3] - b[1] + 10); api.tag(label, b[0] - 5, b[1] - 5); }
  },
};

/* ── Voice ── */
const MIC_X = 317, MID = 168;
function level(side: number, u: number) {
  // the speakers take turns every 4s; the wave travels outward from the microphone
  const turn = ((u % 8) + 8) % 8, on = side === 0 ? (turn < 4 ? 1 : 0) : turn >= 4 ? 1 : 0;
  const edge = Math.min(Math.abs(turn - 4), turn, 8 - turn);
  const talk = on ? 0.15 + 0.85 * ease(edge / 0.3) : 0.12;
  const syl = clamp(vnoise(u * 5.5, side * 7) * 2 - 0.55), grain = 0.6 + 0.4 * vnoise(u * 19, side * 3 + 1);
  return talk * (0.08 + 0.92 * syl * grain);
}
const voice: Scene = {
  period: 8, still: 1.6,
  base(api) {
    api.scan(union(
      capsule(MIC_X, 70, MIC_X, 150, 40, 0.45), // head
      (x, y) => { const d = Math.hypot(x - MIC_X, y - 150); return y >= 150 && d > 50 && d < 56 ? 0.6 : 0; }, // yoke
      capsule(MIC_X - 53, 118, MIC_X - 53, 150, 3, 0.6), capsule(MIC_X + 53, 118, MIC_X + 53, 150, 3, 0.6),
      capsule(MIC_X, 206, MIC_X, 286, 4, 0.6), capsule(MIC_X - 46, 292, MIC_X + 46, 292, 6, 0.7),
    ), [MIC_X - 64, 26, MIC_X + 64, 300], SUBJECT, 31);
    // a time ruler under the waves
    for (let x = 24; x < 610; x += 12) if (x < MIC_X - 70 || x > MIC_X + 70) api.dot(x, 320, x % 60 < 12 ? 3 : 2, FAINT);
  },
  draw(api, time) {
    const amp = (x: number) => {
      const side = x < MIC_X ? 0 : 1, d = side === 0 ? MIC_X - 70 - x : x - (MIC_X + 70);
      if (d < 0 || d > 230) return 0;
      return 6 + 96 * level(side, time - d / 150) * Math.pow(1 - d / 240, 0.6);
    };
    const wave: F = (x, y) => { const h = amp(x); return h && Math.abs(y - MID) < h ? 0.25 + 0.5 * ((y - MID + h) / (2 * h)) : 0; };
    api.scan(wave, [17, MID - 110, 617, MID + 110], SUBJECT, 33);
    // box the words of whoever is speaking
    const side = (time % 8) < 4 ? 0 : 1, x0 = side === 0 ? MIC_X - 70 - 104 : MIC_X + 70 + 8, x1 = x0 + 96;
    let h = 0; for (let x = x0; x <= x1; x += 4) h = Math.max(h, amp(x));
    const fade = ease(Math.min(time % 4, 4 - (time % 4)) / 0.3);
    api.box(x0, MID - h - 6, x1 - x0, 2 * h + 12, fade); api.tag(side === 0 ? "speaker_a" : "speaker_b", x0, MID - h - 6, fade);
  },
};

/* ── LLM post-training: a reasoning tree ──
   A prompt branches into three reasoning paths that grow one step at a time. Each ends in an answer; an
   expert checks them, one is marked correct and the other two are crossed out and fade. */
const COLS = [196, 300, 404], FINAL_X = 504, ROOT = [116, 180];
const PATHS = [[124, 78, 100, 84], [184, 156, 196, 180], [240, 290, 258, 276]];
const WINNER = [1, 0, 2];
const llm: Scene = {
  period: 8, still: 5.4,
  base(api) {
    // a step ruler under the tree
    [ROOT[0] - 46, ...COLS, FINAL_X + 53].forEach((x) => api.dot(x, 336, 3, FAINT));
    for (let x = 40; x < 600; x += 12) api.dot(x, 336, 1.5, FAINT * 0.8);
  },
  draw(api, time) {
    const reset = 1 - ease((time - 7.3) / 0.5), win = WINNER[Math.floor(time / 8) % 3], judged = ease((time - 4.6) / 0.3);
    const a = SUBJECT * reset;
    // the prompt
    api.scan(minus(rrect(24, 150, 116, 210, 10, 0.6), rows(36, [164, 178, 192], [64, 70, 38])), [20, 146, 120, 214], a * ease(time / 0.3), 41);
    PATHS.forEach((ys, p) => {
      const alpha = a * (p === win ? 1 : 1 - 0.65 * judged);
      const pts = [ROOT, ...COLS.map((x, k) => [x, ys[k]]), [FINAL_X, ys[3]]];
      const parts: F[] = [];
      for (let k = 1; k < pts.length; k++) {
        const g = ease((time - 0.4 - (k - 1) * 0.85 - p * 0.18) / 0.55);
        if (g <= 0) break;
        const [x0, y0] = pts[k - 1], [x1, y1] = pts[k];
        parts.push(capsule(x0, y0, mix(x0, x1, g), mix(y0, y1, g), 2.2, 0.6)); // the edge grows
        if (g >= 1) {
          if (k < pts.length - 1) parts.push(circle(x1, y1, 10, 0.5)); // a reasoning step
          else {
            const fill = clamp((time - 0.4 - (k - 1) * 0.85 - p * 0.18 - 0.55) / 0.5);
            parts.push(frame(x1, y1 - 20, 610, y1 + 20, 8, 3, 0.6), rows(x1 + 14, [y1 - 8, y1 + 4], [70 * fill, 46 * clamp(fill * 2 - 1)], 0.8)); // the answer
          }
        }
      }
      if (parts.length) api.scan(union(...parts), [ROOT[0] - 4, Math.min(...ys) - 24, 614, Math.max(...ys) + 24], alpha, 43 + p);
      // the expert's verdict
      if (judged > 0) {
        const y = ys[3];
        if (p === win) { api.box(FINAL_X - 6, y - 26, 612 - FINAL_X, 52, judged * reset); api.tag("correct", FINAL_X - 6, y - 26, judged * reset); }
        else api.scan(union(capsule(FINAL_X + 40, y - 12, FINAL_X + 64, y + 12, 2.2, 0.95), capsule(FINAL_X + 40, y + 12, FINAL_X + 64, y - 12, 2.2, 0.95)),
          [FINAL_X + 34, y - 16, FINAL_X + 70, y + 16], SUBJECT * judged * reset, 49);
      }
    });
  },
};

const SCENES: Record<string, Scene> = { physical, agents, voice, llm };

/** One scene on one canvas. The canvas is drawn at its CSS size; the scene is scaled to fit its width. */
export function createSolutionScene(canvas: HTMLCanvasElement, name: string, reduced: boolean) {
  const scene = SCENES[name], ctx = canvas.getContext("2d")!, base = document.createElement("canvas"), bctx = base.getContext("2d")!;
  let W = 0, H = 0, DPR = 1, k = 1, raf = 0, active = false, visible = false, clock = scene.still, last = 0;

  function size() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    const r = canvas.getBoundingClientRect(); W = Math.round(r.width); H = Math.round(r.height); k = W / SCENE_W;
    canvas.width = base.width = W * DPR; canvas.height = base.height = H * DPR;
    if (!W || !H) return;
    bctx.setTransform(DPR * k, 0, 0, DPR * k, 0, 0); bctx.clearRect(0, 0, SCENE_W, SCENE_H);
    scene.base(makeApi(bctx));
  }
  function paint() {
    if (!W || !H) return; // hidden (the mobile copy on desktop, or the other way round)
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(base, 0, 0);
    ctx.setTransform(DPR * k, 0, 0, DPR * k, 0, 0);
    scene.draw(makeApi(ctx, active), clock % scene.period);
    ctx.globalAlpha = 1;
  }
  function tick(now: number) {
    clock += Math.min(0.05, (now - last) / 1000); last = now;
    paint();
    raf = requestAnimationFrame(tick);
  }
  function update() {
    const run = active && visible && !reduced;
    if (run && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
    if (!run && raf) { cancelAnimationFrame(raf); raf = 0; }
  }
  return {
    resize() { size(); paint(); },
    setActive(on: boolean) { active = on; update(); paint(); },
    setVisible(on: boolean) { visible = on; update(); },
    stop() { cancelAnimationFrame(raf); raf = 0; },
  };
}
