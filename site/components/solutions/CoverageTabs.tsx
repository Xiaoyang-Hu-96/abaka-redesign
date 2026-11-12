"use client";

import { Globe, House, ListChecks } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import { physicalAiPage } from "@/lib/content";

/**
 * Physical AI coverage (Paper "Physical AI · 4.0 v2", Coverage): three tabs, Task / Scene / Country, with Scene
 * selected on load. Each shows its top-level split as bars (the largest is accent and full width, the rest grey and
 * scaled to it) and, on the right, the breakdown of one part. Shares come from abaka.ai/physical-ai.
 * ARIA tabs pattern, as DatasetTabs: arrow keys move between tabs, Home/End jump to the ends.
 * Switching tabs grows the bars to their new widths (slow, ease-out); reduced motion: they jump.
 */
const copy = physicalAiPage.coverage;
const icons = [ListChecks, House, Globe];
const pct = (v: number) => `${v.toFixed(1)}%`;

export function CoverageTabs() {
  const [sel, setSel] = useState(1);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const tab = copy.tabs[sel];
  const max = Math.max(...tab.bars.map(([, v]) => v));
  const top = tab.bars.find(([k]) => k === tab.detail.label);

  const onKey = (e: KeyboardEvent) => {
    const n = copy.tabs.length;
    const next = e.key === "ArrowRight" ? (sel + 1) % n : e.key === "ArrowLeft" ? (sel + n - 1) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (next < 0) return;
    e.preventDefault();
    setSel(next);
    tabs.current[next]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label={copy.intro} onKeyDown={onKey} className="flex overflow-x-auto border-b border-border-default px-5 lg:px-10">
        {copy.tabs.map((t, i) => {
          const Icon = icons[i];
          const on = i === sel;
          return (
            <button
              key={t.label}
              ref={(el) => { tabs.current[i] = el; }}
              type="button"
              role="tab"
              id={`coverage-tab-${i}`}
              aria-selected={on}
              aria-controls="coverage-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => setSel(i)}
              className={`-mb-px flex shrink-0 items-center gap-2 px-5 py-3 text-sm leading-ui transition-colors duration-(--duration-base) ease-out ${
                on ? "bg-surface-selected font-medium text-text-primary" : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              }`}
            >
              <Icon aria-hidden className={`size-4 ${on ? "text-accent" : "text-ink-56"}`} strokeWidth={1.6} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div id="coverage-panel" role="tabpanel" aria-labelledby={`coverage-tab-${sel}`} className="flex flex-col bg-surface-selected lg:flex-row">
        <ul className="flex flex-1 flex-col gap-7 border-b border-border-default p-5 lg:border-b-0 lg:border-r lg:p-10">
          {tab.bars.map(([k, v], i) => (
            <li key={k} className="flex flex-col gap-2.5">
              <span className="flex justify-between gap-4 text-body leading-ui">
                <span className={i === 0 ? "font-medium text-text-primary" : "text-text-secondary"}>{k}</span>
                <span className={`font-mono text-mono leading-label ${i === 0 ? "text-text-accent" : "text-text-tertiary"}`}>{pct(v)}</span>
              </span>
              <span aria-hidden className="h-3 bg-grey-100">
                <span
                  className={`block h-full transition-[width] duration-(--duration-slow) ease-out motion-reduce:transition-none ${i === 0 ? "bg-accent" : "bg-grey-400"}`}
                  style={{ width: `${(v / max) * 100}%` }}
                />
              </span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col lg:w-[460px] lg:shrink-0">
          <p className="label border-b border-border-default px-5 py-4 lg:px-8">
            {tab.detail.label}{top ? ` · ${pct(top[1])}` : ""}
          </p>
          {/* 1px gaps over the line colour draw the grid's rules */}
          <dl className="grid grid-cols-1 gap-px bg-border-default sm:grid-cols-2">
            {tab.detail.items.map(([k, v], i, all) => (
              // an odd last item takes the whole row, so no empty cell shows the line colour
              <div key={k} className={`flex justify-between gap-3 bg-surface-selected px-5 py-3 text-sm leading-ui lg:px-8 ${all.length % 2 && i === all.length - 1 ? "sm:col-span-2" : ""}`}>
                <dt className="text-text-secondary">{k}</dt>
                <dd className="font-mono text-text-primary">{pct(v)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <p className="border-t border-border-default px-5 py-3.5 font-mono text-mono-sm leading-mono-sm tracking-mono text-text-tertiary lg:px-10">{copy.source}</p>
    </div>
  );
}
