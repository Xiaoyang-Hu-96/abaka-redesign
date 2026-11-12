"use client";

import {
  Camera, CircleCheck, Clock, Copy, Cpu, Droplet, Film, Filter, Layers, Package, Play, Scan, SquareDashed, Tag, Target, User,
  type LucideIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { layers, stack } from "@/lib/content";
import { ms } from "@/lib/time";
import { delaySwitch } from "@/lib/tokens";
import { stackDefs, stackLayers } from "./stack-drawing";

/**
 * Four layers (Paper "Spec · Four layers · hover 01–04 / Forge" and "hover rules").
 * At rest 03 Annotate is the active row and every layer is at full strength, no callout.
 * Hovering a row, or its layer in the drawing, makes it active: the row turns orange (tint, 2px accent bar,
 * accent label and title), that layer is drawn on top at full strength, the others step back to 35%, and a
 * callout hangs off the layer's right corner on a leader line. The frame_118 thread (markers and the line
 * through them) always stays at 100%. Switching waits 120ms so crossing a border doesn't flicker; leaving the
 * section returns to rest. Keyboard focus on a row does the same as hover.
 * Touch: only a mouse hovers (a tap's pointerleave would otherwise undo the tap at once); tapping a row or a layer
 * selects it. Below lg there are no callouts, and the drawing, drawn smaller, stays pinned under the header while
 * the rows scroll past, so each tap's layer is in view.
 */

/* rows are listed top to bottom (Evaluate … Forge); the drawing's layers, keyed the same way */
const keys = ["evaluate", "annotate", "curate", "collect", "forge"] as const;
/* paint order, bottom to top */
const paint = [4, 3, 2, 1, 0];
const REST = 1;
/* the drawing is 700×1320 units shown at 434×818px; each layer's right corner, in px within the visual cell */
const k = 434 / 700;
/* the drawing and its widest callout together are 608px wide (Forge: corner at 639.3 units, 12px leader, 200px card);
   the group is centred in the visual cell, at least 16px from its left edge, so callouts never run past the column */
const GROUP = 639.3 * k + 3.6 + 8 + 200;
const left = `max(16px, (100% - ${GROUP}px) / 2)`;
const x = (px: number) => `calc(${left} + ${px}px)`;
const corner = [279.5, 461.5, 679.5, 879.5, 1105.3].map((y) => y * k);
const icons: LucideIcon[][] = [
  [Cpu, Target, CircleCheck],
  [Tag, SquareDashed, User, CircleCheck],
  [Droplet, Copy, Filter],
  [Camera, Film, Clock, Scan],
  [Play, Layers, Package],
];

export function StackSection() {
  const [hover, setHover] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const active = hover ?? REST;
  const go = (i: number | null, wait = true) => {
    clearTimeout(timer.current);
    if (!wait || hover === null) setHover(i);
    else timer.current = setTimeout(() => setHover(i), ms(delaySwitch));
  };

  return (
    <div
      className="flex flex-col-reverse border-b border-border-default lg:h-[821px] lg:flex-row"
      onPointerLeave={(e) => { if (e.pointerType === "mouse") go(null, false); }}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) go(null, false); }}
    >
      <ol className="flex flex-col lg:w-[360px] lg:shrink-0 xl:w-[400px] lg:border-r lg:border-border-default">
        {layers.map((l, i) => {
          const on = i === active;
          return (
            <li
              key={l.title}
              tabIndex={0}
              aria-current={on ? "step" : undefined}
              onPointerEnter={(e) => { if (e.pointerType === "mouse") go(i); }}
              onFocus={() => go(i, false)}
              onClick={() => go(i, false)}
              className={`flex flex-1 cursor-default flex-col justify-center gap-2 border-b border-border-default py-6 pr-5 transition-colors duration-(--duration-base) ease-out last:border-b-0 focus-visible:shadow-[inset_0_0_0_2px_var(--color-focus-ring)] lg:pr-10 ${
                on ? "border-l-2 border-l-accent bg-surface-hover pl-[18px] lg:pl-[38px]" : "pl-5 lg:pl-10"
              }`}
            >
              <span className={`label transition-colors duration-(--duration-base) ${on ? "text-accent" : ""}`}>{l.step}</span>
              <span className={`text-title font-title leading-row tracking-snug transition-colors duration-(--duration-base) ${on ? "text-accent" : "text-text-heading"}`}>{l.title}</span>
              <span className="text-lead leading-lead text-text-secondary">{l.body}</span>
            </li>
          );
        })}
      </ol>

      <div className="sticky top-16 z-10 flex justify-center border-b border-border-default bg-surface-page py-4 lg:relative lg:top-auto lg:z-auto lg:block lg:bg-transparent lg:flex-1 lg:overflow-hidden lg:border-b-0 lg:py-0" role="img" aria-label="Isometric stack: four data layers on the Forge platform, frame_118 traced through them">
        <svg viewBox="0 0 700 1320" className="h-auto w-40 sm:w-52 lg:absolute lg:top-0 lg:h-[818px] lg:w-[434px]" style={{ left: x(0) }}>
          {stackDefs}
          {paint.map((i) => {
            const L = stackLayers[keys[i]];
            return (
              <g key={keys[i]} onPointerEnter={(e) => { if (e.pointerType === "mouse") go(i); }} onClick={() => go(i, false)}>
                <g id={`stack-${keys[i]}`} className="transition-opacity duration-(--duration-base) ease-out" opacity={hover === null || i === active ? 1 : 0.35}>
                  {L.body}
                </g>
                <g id={`stack-${keys[i]}-thread`}>{L.thread}</g>
              </g>
            );
          })}
          {/* the active layer again, on top of its neighbours */}
          {hover !== null && (
            <g pointerEvents="none">
              <use href={`#stack-${keys[active]}`} />
              <use href={`#stack-${keys[active]}-thread`} />
            </g>
          )}
        </svg>

        {stack.callouts.map((c, i) => {
          const forge = i === 4;
          return (
            <div
              key={c.head[1]}
              aria-hidden={hover !== i}
              className={`pointer-events-none absolute hidden items-start transition-opacity duration-(--duration-fast) ease-out lg:flex ${hover === i ? "opacity-100 delay-(--duration-fast)" : "opacity-0"}`}
              style={{ left: x((forge ? 639.3 : 591) * k + 3.6), top: corner[i] - (forge ? 150 : 24) }}
            >
              <span className={`flex shrink-0 flex-col ${forge ? "w-2 pt-[150px]" : "w-[38px] pt-6"}`}><span className="h-px bg-grey-400" /></span>
              <div className="flex w-[200px] shrink-0 flex-col border border-grey-400 bg-surface-raised">
                <div className="flex justify-between border-b border-border-default px-3 py-2 font-mono text-micro uppercase leading-micro tracking-label">
                  <span className="text-text-tertiary">{c.head[0]}</span>
                  <span className={i === 1 ? "text-accent" : "text-text-secondary"}>{c.head[1]}</span>
                </div>
                <div className="flex border-b border-border-default px-[11px] py-2.5">
                  <CalloutDrawing i={i} />
                </div>
                <div className="flex flex-col gap-1.5 px-3 py-2.5">
                  {c.rows.map(([key, value], r) => {
                    const Icon = icons[i][r];
                    const hot = c.accent === r;
                    return (
                      <div key={key} className="flex items-center gap-2 font-mono text-mono-sm leading-label">
                        <Icon aria-hidden className={`size-3.5 shrink-0 ${hot ? "text-accent" : "text-ink-56"}`} strokeWidth={1.75} />
                        <span className="w-[52px] shrink-0 text-text-tertiary">{key}</span>
                        <span className={hot ? "text-accent" : "text-text-secondary"}>{value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** the small drawing in each callout, 176×44 */
function CalloutDrawing({ i }: { i: number }) {
  const c = (n: string) => `var(--color-${n})`;
  const frames = [6, 30, 54, 78, 102, 126, 150];
  return (
    <svg width="176" height="44" viewBox="0 0 176 44" aria-hidden className="shrink-0">
      {i === 0 && (
        <>
          <rect x="40" y="2" width="96" height="40" fill={c("grey-200")} />
          <polygon points="72,14 96,14 96,20 104,20 104,32 72,32" fill={c("grey-400")} />
          <rect x="64" y="10" width="46" height="26" fill={c("accent-29")} stroke={c("accent")} strokeWidth="1.5" />
          <rect x="70" y="14" width="46" height="26" fill="none" stroke={c("ink-72")} strokeWidth="1.5" strokeDasharray="4 3" />
        </>
      )}
      {i === 1 && (
        <>
          <rect x="40" y="2" width="96" height="40" fill={c("grey-200")} />
          <polygon points="72,14 96,14 96,20 104,20 104,32 72,32" fill={c("grey-400")} />
          <rect x="64" y="10" width="46" height="26" fill={c("accent-29")} stroke={c("accent")} strokeWidth="1.5" />
          {[[61.5, 7.5], [61.5, 33.5], [107.5, 7.5], [107.5, 33.5]].map(([x, y]) => <rect key={`${x}${y}`} x={x} y={y} width="5" height="5" fill={c("accent")} />)}
        </>
      )}
      {i === 2 &&
        frames.map((x, n) =>
          n === 3 ? (
            <rect key={x} x={x} y="11" width="20" height="22" fill={c("raised")} stroke={c("ink-72")} strokeWidth="1.5" />
          ) : n === 1 || n === 5 ? (
            <g key={x}>
              <rect x={x} y="11" width="20" height="22" fill="none" stroke={c("grey-600")} strokeDasharray="2 2" />
              <path d={`M${x + 5} 17l10 10M${x + 15} 17l-10 10`} stroke={c("grey-600")} />
            </g>
          ) : (
            <rect key={x} x={x} y="11" width="20" height="22" fill={c("grey-200")} />
          ),
        )}
      {i === 3 && (
        <>
          <rect x="0.5" y="2.5" width="175" height="39" fill="none" stroke={c("grey-300")} />
          {Array.from({ length: 14 }, (_, n) => 6 + n * 12).flatMap((x) => [
            <rect key={`t${x}`} x={x} y="5" width="4" height="3" fill={c("grey-300")} />,
            <rect key={`b${x}`} x={x} y="36" width="4" height="3" fill={c("grey-300")} />,
          ])}
          {frames.map((x, n) => (
            <rect key={x} x={x} y="11" width="20" height="22" fill={n === 3 ? c("raised") : c("grey-200")} stroke={n === 3 ? c("ink-72") : undefined} strokeWidth={n === 3 ? 1.5 : undefined} />
          ))}
        </>
      )}
      {i === 4 && (
        <>
          <line x1="22" y1="22" x2="142" y2="22" stroke={c("ink-72")} />
          {["C", "C", "A", "E"].map((t, n) => (
            <g key={n}>
              <rect x={8 + n * 36} y="14" width="16" height="16" fill={c("grey-700")} />
              <text x={16 + n * 36} y="25.5" textAnchor="middle" className="font-mono" fontSize="9" fill={c("raised")}>{t}</text>
            </g>
          ))}
          <circle cx="160" cy="22" r="9" fill={c("raised")} stroke={c("ink-72")} strokeWidth="1.5" />
          <path d="M156 22l3 3 5-6" fill="none" stroke={c("ink-72")} strokeWidth="1.5" />
        </>
      )}
    </svg>
  );
}
