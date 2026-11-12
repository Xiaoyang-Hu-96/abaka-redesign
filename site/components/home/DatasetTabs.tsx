"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { categories, datasetsPage, datasetsSection } from "@/lib/content";
import { datasetCategories } from "@/lib/nav";

const copy = datasetsSection.tabs;
const arrow = "inline-block transition-[translate,color] duration-(--duration-base) ease-out group-hover:translate-x-1 group-hover:text-accent";

/**
 * Datasets, as folder tabs (Paper "Datasets · folder tabs v2"). One tab per category, then a black
 * Custom data tab that links to the request form. The selected tab is white and joins the panel below it;
 * the others sit 8px lower on canvas and take the hover tint. Coding is selected on load.
 * The panel: the category's intro on the left, its featured datasets on the right, then Browse all.
 * Tabs follow the ARIA tabs pattern: arrow keys move between them, Home/End jump to the ends.
 */
/** `browseAll={false}` drops the Browse all row, for the /datasets page, where every dataset is already listed. */
export function DatasetTabs({ browseAll = true }: { browseAll?: boolean }) {
  const [sel, setSel] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const cat = categories[sel];
  // pick a tab; on narrow screens the strip scrolls so the picked tab is in view
  const pick = (i: number, focus = false) => {
    setSel(i);
    const el = tabs.current[i];
    if (focus) el?.focus();
    el?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  const onKey = (e: KeyboardEvent) => {
    const n = categories.length;
    const next = e.key === "ArrowRight" ? (sel + 1) % n : e.key === "ArrowLeft" ? (sel + n - 1) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (next < 0) return;
    e.preventDefault();
    pick(next, true);
  };

  return (
    <div className="border-b border-border-default">
      <div role="tablist" aria-label="Dataset categories" onKeyDown={onKey} className="flex h-16 items-end overflow-x-auto">
        {categories.map((c, i) => {
          const Icon = datasetCategories.find((d) => d.label === c.label)?.icon;
          const on = i === sel;
          return (
            <button
              key={c.id}
              ref={(el) => { tabs.current[i] = el; }}
              type="button"
              role="tab"
              id={`ds-tab-${c.id}`}
              aria-selected={on}
              aria-controls="ds-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => pick(i)}
              className={`flex shrink-0 basis-0 items-center gap-2.5 border-r border-t border-border-default px-3.5 text-lead leading-lead transition-colors duration-(--duration-base) ease-out lg:flex-1 ${
                on
                  ? "h-16 bg-surface-selected text-text-heading"
                  : "h-14 border-b bg-surface-page text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              }`}
            >
              <span aria-hidden className={`flex size-7 shrink-0 items-center justify-center ${on ? "bg-accent text-text-on-accent" : "text-ink-56"}`}>
                {Icon && <Icon className="size-[22px]" strokeWidth={1.6} />}
              </span>
              <span className="whitespace-nowrap pr-2">{c.label}</span>
            </button>
          );
        })}
        <Link
          href={copy.custom.href}
          className="group flex h-14 shrink-0 basis-0 items-center justify-between gap-4 border-b border-surface-inverse bg-surface-inverse px-[18px] text-lead font-medium leading-lead text-text-inverse lg:flex-1"
        >
          <span className="whitespace-nowrap">{copy.custom.label}</span>
          <span aria-hidden className={`${arrow} text-accent`}>→</span>
        </Link>
      </div>

      <div id="ds-panel" role="tabpanel" aria-labelledby={`ds-tab-${cat.id}`} className="flex flex-col bg-surface-selected lg:flex-row">
        <div className="flex flex-col gap-2.5 border-b border-border-default px-5 pb-7 pt-8 lg:w-[310px] lg:shrink-0 lg:border-b-0 lg:border-r">
          <h3 className="text-h3 font-title text-text-heading leading-h3 tracking-snug">{cat.label}</h3>
          <p className="text-lead leading-lead text-text-secondary">{cat.intro}</p>
        </div>
        <div className="flex min-w-0 flex-1 flex-col pt-3">
          <div className="flex h-10 items-center border-b border-border-default px-5 font-mono text-label uppercase leading-label tracking-mono text-text-tertiary lg:px-10">
            <span className="flex-1">{copy.featured} {cat.label}</span>
            {copy.columns.map((h, i) => (
              <span key={h} className={`hidden shrink-0 lg:block ${i === 0 ? "w-[130px]" : "w-[110px]"}`}>{h}</span>
            ))}
            <span className="w-24 shrink-0" />
          </div>
          {cat.datasets.map((d, i) => (
            <Link
              key={d.name}
              href={datasetsPage.requestHref(d.name)}
              className={`group flex h-16 items-center px-5 transition-colors duration-(--duration-base) ease-out hover:bg-surface-hover lg:px-10 ${i < cat.datasets.length - 1 ? "border-b border-border-default" : ""}`}
            >
              <span className="flex-1 text-lead font-title text-text-heading leading-lead">{d.name}</span>
              {copy.columns.map((h, i) => (
                <span key={h} className={`hidden shrink-0 font-mono text-mono leading-sm text-text-tertiary lg:block ${i === 0 ? "w-[130px]" : "w-[110px]"}`}>
                  {copy.placeholder}
                </span>
              ))}
              <span className="flex w-24 shrink-0 items-center justify-end gap-1.5 text-sm font-medium leading-sm">
                {copy.request} <span aria-hidden className={arrow}>→</span>
              </span>
            </Link>
          ))}
          {browseAll && (
          <Link
            href={`/datasets#${cat.id}`}
            className="group flex h-14 items-center gap-1.5 border-t border-border-default px-5 text-sm font-medium leading-sm transition-colors duration-(--duration-fast) ease-out hover:text-accent lg:px-10"
          >
            <span>{copy.browseAll(cat.label)}</span>
            <span aria-hidden className={arrow}>→</span>
          </Link>
          )}
        </div>
      </div>
    </div>
  );
}
