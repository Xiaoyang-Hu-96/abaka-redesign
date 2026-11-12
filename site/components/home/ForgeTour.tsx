"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { platform } from "@/lib/content";
import { FORGE_WINDOW_W } from "./forge-size";

/**
 * Forge feature tour (Paper "Forge · feature tour v2"). Four features on the left, one window on the right that
 * draws the selected feature's screen. Click, Enter or Space selects; hover only tints, because swapping the
 * window on hover would flash it every time the pointer crossed the list on its way to the window.
 * 01 is selected on load. No autoplay.
 * Switching is one motion (slow, ease-out): the old row's body folds shut while the new one opens, the accent bar
 * grows down the new row, and the windows cross-fade with a 4px rise. Reduced motion: it simply swaps.
 * Rows are a vertical tablist: arrow keys move focus, Enter/Space selects (manual activation).
 * On a column narrower than the window (phones), the window is laid out at its normal width and zoomed down to
 * fit, so the whole screen shows, smaller, instead of a cropped corner with a scrollbar.
 */
export function ForgeTour({ children }: { children: React.ReactNode }) {
  const [sel, setSel] = useState(0);
  const rows = useRef<(HTMLButtonElement | null)[]>([]);
  const n = platform.features.length;
  const stage = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = stage.current?.parentElement;
    if (!el) return;
    const fit = () => {
      const cs = getComputedStyle(el);
      const room = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      setScale(Math.min(1, room / FORGE_WINDOW_W));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onKey = (e: KeyboardEvent) => {
    const i = rows.current.findIndex((r) => r === document.activeElement);
    const next = e.key === "ArrowDown" ? (i + 1) % n : e.key === "ArrowUp" ? (i + n - 1) % n : -1;
    if (i < 0 || next < 0) return;
    e.preventDefault();
    rows.current[next]?.focus();
  };

  return (
    <div className="flex flex-col border-b border-border-default lg:h-[408px] lg:flex-row">
      <div role="tablist" aria-orientation="vertical" aria-label="Forge features" onKeyDown={onKey} className="flex flex-col border-border-default lg:w-[400px] lg:shrink-0 lg:border-r">
        {platform.features.map((f, i) => {
          const on = i === sel;
          return (
            <button
              key={f.title}
              ref={(el) => { rows.current[i] = el; }}
              type="button"
              role="tab"
              id={`forge-tab-${i}`}
              aria-selected={on}
              aria-controls="forge-window"
              onClick={() => setSel(i)}
              // the last row has no bottom line and fills the rest of the list, so it meets the tour's own bottom line
              className={`group relative flex gap-4 border-b border-border-default px-5 py-7 text-left transition-colors duration-(--duration-base) ease-out last:border-b-0 lg:px-8 lg:last:flex-1 ${
                on ? "bg-surface-selected" : "hover:bg-surface-hover"
              }`}
            >
              <span
                aria-hidden
                className={`absolute -left-px top-0 h-full w-0.5 origin-top bg-accent transition-[scale] duration-(--duration-slow) ease-out motion-reduce:transition-none ${on ? "scale-y-100" : "scale-y-0"}`}
              />
              <span className={`w-6 shrink-0 font-mono text-mono leading-row transition-colors duration-(--duration-fast) ${on ? "text-accent" : "text-text-muted group-hover:text-text-tertiary"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex flex-col">
                <span className={`text-title font-title leading-row tracking-snug transition-colors duration-(--duration-fast) ${on ? "text-text-heading" : "text-text-secondary group-hover:text-text-heading"}`}>
                  {f.title}
                </span>
                {/* the body folds open and shut (grid rows 0fr ↔ 1fr), so the rows below slide instead of jumping */}
                <span
                  aria-hidden={!on}
                  className={`grid transition-[grid-template-rows,opacity] duration-(--duration-slow) ease-out motion-reduce:transition-none ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <span className="overflow-hidden">
                    <span className="block pb-1 pt-2 text-lead leading-lead text-text-secondary">{f.body}</span>
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <div id="forge-window" role="tabpanel" aria-labelledby={`forge-tab-${sel}`} className="relative min-w-0 flex-1 overflow-hidden p-5 lg:p-8">
        {/* the four drawn windows are rendered by the server and passed in, stacked in one grid cell; the selected one fades in.
            Below the window's own width the stage keeps that width and zooms down (zoom, unlike scale, shrinks the layout too) */}
        <div
          ref={stage}
          className="grid"
          style={scale < 1 ? { width: FORGE_WINDOW_W, zoom: scale } : undefined}
        >
        {(Array.isArray(children) ? children : [children]).map((child, i) => (
          <div
            key={i}
            inert={i !== sel}
            className={`[grid-area:1/1] transition-[opacity,translate,visibility] duration-(--duration-slow) ease-out motion-reduce:transition-none ${
              i === sel ? "visible translate-y-0 opacity-100" : "invisible translate-y-1 opacity-0"
            }`}
          >
            {child}
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}
