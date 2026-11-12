import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { contrast, grade } from "@/lib/contrast";
import * as t from "@/lib/tokens";

export const metadata: Metadata = { title: "Design system · Abaka AI" };

/**
 * The coded design system. Every swatch, size and ratio on this page is read from the generated
 * tokens, so this page cannot drift from the site. Each part ends with the principle it serves.
 */

function Part({ id, n, title, why, children }: { id: string; n: string; title: string; why: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-b border-border-default">
      <div className="flex flex-col gap-2 border-b border-border-default px-5 py-8 lg:flex-row lg:items-end lg:justify-between lg:px-10">
        <div className="flex flex-col gap-2">
          <p className="label">{n}</p>
          <h2 id={`${id}-title`} className="text-h3 font-semibold tracking-tight">{title}</h2>
        </div>
        <p className="max-w-[460px] text-sm leading-sm text-text-secondary">{why}</p>
      </div>
      <div className="px-5 py-8 lg:px-10">{children}</div>
    </section>
  );
}

const Code = ({ children }: { children: ReactNode }) => <code className="font-mono text-mono-sm text-text-tertiary">{children}</code>;

const colors: [string, string, string][] = [
  ["color.text.primary", t.colorTextPrimary, "Headlines and body. The one text colour."],
  ["color.text.secondary", t.colorTextSecondary, "Leads and descriptions."],
  ["color.text.tertiary", t.colorTextTertiary, "Mono labels, captions."],
  ["color.text.muted", t.colorTextMuted, "Disabled only. Not for readable text."],
  ["color.text.accent", t.colorTextAccent, "One emphasis per section headline."],
  ["color.surface.page", t.colorSurfacePage, "Page and resting cells."],
  ["color.surface.raised", t.colorSurfaceRaised, "Hovered cells, panels."],
  ["color.surface.inverse", t.colorSurfaceInverse, "Announcement bar."],
  ["color.border.default", t.colorBorderDefault, "Every grid line."],
  ["color.action.primary.bg", t.colorActionPrimaryBg, "Primary buttons only."],
];

const pairs: [string, string, string, string][] = [
  ["Body text", t.colorTextPrimary, t.colorSurfacePage, "body"],
  ["Secondary text", t.colorTextSecondary, t.colorSurfacePage, "body"],
  ["Mono labels", t.colorTextTertiary, t.colorSurfacePage, "12px"],
  ["Field placeholder", t.colorTextTertiary, t.colorSurfaceRaised, "14px"],
  ["Disabled (exempt)", t.colorTextMuted, t.colorSurfacePage, "UI"],
  ["Accent headline word", t.colorTextAccent, t.colorSurfacePage, "56px"],
  ["Primary button label", t.colorActionPrimaryFg, t.colorActionPrimaryBg, "14px"],
  ["Inverse bar text", t.colorTextInverse, t.colorSurfaceInverse, "14px"],
  ["Focus ring", t.colorFocusRing, t.colorFocusGap, "UI"],
];

const type: [string, string, string][] = [
  ["text.hero", t.textHero, "Human Intelligence Data"],
  ["text.display", t.textDisplay, "Four layers. One platform."],
  ["text.h3", t.textH3, "Section part"],
  ["text.title", t.textTitle, "Card title"],
  ["text.lead", t.textLead, "Lead paragraph next to a headline."],
  ["text.body", t.textBody, "Body copy in cells and lists."],
  ["text.sm", t.textSm, "Descriptions and buttons."],
  ["text.label", t.textLabel, "MONO LABEL · 01"],
];

const space = [t.space1, t.space2, t.space3, t.space4, t.space5, t.space6, t.space7, t.space8, t.space9];

export default function SystemPage() {
  return (
    <>
      <header className="flex flex-col gap-4 border-b border-border-default px-5 pb-10 pt-14 lg:px-10 lg:pb-12 lg:pt-24">
        <p className="label">Design system</p>
        <h1 className="display max-w-[820px]">
          Reliable before <em>impressive.</em>
        </h1>
        <p className="max-w-[640px] text-lead leading-lead text-text-secondary">
          Tokens live in <Code>tokens/tokens.json</Code> and are built into CSS variables, Tailwind utilities and a TypeScript
          module. Everything on this page is rendered from those tokens.
        </p>
      </header>

      <Part id="colour" n="01 · Foundations" title="Colour" why="One ink at four opacities, one orange. Buyers read vendor sites like spec sheets, so the page stays light and the orange marks only actions and one emphasis per section.">
        <ul className="grid grid-cols-2 gap-px bg-border-default lg:grid-cols-5">
          {colors.map(([name, hex, use]) => (
            <li key={name} className="flex flex-col bg-surface-page">
              <span className="h-20 border-b border-border-default" style={{ background: hex }} />
              <span className="flex flex-col gap-1 p-3">
                <Code>{name}</Code>
                <span className="font-mono text-mono-sm">{hex}</span>
                <span className="text-label leading-label text-text-secondary">{use}</span>
              </span>
            </li>
          ))}
        </ul>
      </Part>

      <Part id="contrast" n="02 · Accessibility" title="Contrast and focus" why="Ratios are computed at build time from the tokens. Two pairs fail and are left as known issues on purpose; the fix for each is listed so the decision is visible.">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="label">
              <th className="pb-3 font-normal">Pair</th><th className="pb-3 font-normal">Sample</th><th className="pb-3 font-normal">Ratio</th><th className="pb-3 font-normal">Grade</th>
            </tr>
          </thead>
          <tbody>
            {pairs.map(([label, fg, bg, size]) => {
              const r = contrast(fg, bg);
              const g = grade(r);
              const fails = g === "Fails" || (g === "AA large" && size !== "56px" && size !== "UI");
              return (
                <tr key={label} className="border-t border-border-default">
                  <td className="py-3">{label}</td>
                  <td><span className="px-2 py-1 font-medium" style={{ color: fg, background: bg }}>Aa</span></td>
                  <td className="font-mono">{r}:1</td>
                  <td className={fails && !label.startsWith("Disabled") ? "font-medium" : ""}>{label.startsWith("Disabled") ? "Exempt (WCAG 1.4.3)" : fails ? `Known issue: ${g}` : g}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <ul className="mt-6 flex flex-col gap-2 text-sm leading-sm text-text-secondary">
          <li>· Primary button label: {contrast(t.colorActionPrimaryFg, t.colorActionPrimaryBg)}:1. Fix: ink on orange gives {contrast(t.colorInk, t.colorAccent)}:1.</li>
          <li>· Accent headline word: {contrast(t.colorTextAccent, t.colorSurfacePage)}:1 at 56px. Fix: a text-only accent of #D9431A gives {contrast("#D9431A", t.colorSurfacePage)}:1.</li>
          <li>· Mono labels were 4.13:1 at ink-56 and failed AA at 12px. The token color.text.tertiary now points at ink-64 (5.45:1); the Paper file still shows ink-56.</li>
          <li>· Focus: a 2px ink ring outside a 2px gap, shown only for keyboard focus (<Code>:focus-visible</Code>). Tab through this page to see it.</li>
        </ul>
      </Part>

      <Part id="type" n="03 · Foundations" title="Type" why="Inter for reading, JetBrains Mono for data: labels, step numbers, units. Monospace says 'this is a value', which is most of what a data company shows.">
        <ul className="flex flex-col">
          {type.map(([name, size, sample]) => (
            <li key={name} className="flex items-baseline gap-6 border-b border-border-default py-3 last:border-b-0">
              <span className="w-32 shrink-0"><Code>{name} · {size}</Code></span>
              <span className={`truncate ${name === "text.label" ? "label" : "font-semibold tracking-tight"}`} style={{ fontSize: name === "text.label" ? undefined : size }}>
                {sample}
              </span>
            </li>
          ))}
        </ul>
      </Part>

      <Part id="space" n="04 · Foundations" title="Space, grid and breakpoints" why="One 1240px column drawn with 1px lines; every section is cells inside it. The grid is visible on purpose: it is the notebook the data sits in.">
        <ul className="flex flex-col gap-2">
          {space.map((s, i) => (
            <li key={s} className="flex items-center gap-4">
              <span className="w-20"><Code>space.{i + 1}</Code></span>
              <span className="h-3 bg-accent-29" style={{ width: s }} />
              <span className="font-mono text-mono-sm">{s}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm leading-sm text-text-secondary">
          Column {t.containerColumn} · page {t.containerPage} · breakpoints md {t.breakpointMd}, lg {t.breakpointLg}, xl {t.breakpointXl}.
          Below lg the column insets 16px and every row stacks.
        </p>
      </Part>

      <Part id="motion" n="05 · Foundations" title="Motion" why="Motion explains, never performs. Colour changes first; nothing moves more than 4px. With reduced motion, colour still changes and nothing moves.">
        <ul className="grid grid-cols-2 gap-px bg-border-default lg:grid-cols-4">
          {[["duration.press", t.durationPress, "Pressed"], ["duration.fast", t.durationFast, "Hover colour"], ["duration.base", t.durationBase, "Arrows, cell fills"], ["duration.slow", t.durationSlow, "Panels, FAQ"]].map(([n, v, u]) => (
            <li key={n} className="flex flex-col gap-1 bg-surface-page p-4">
              <Code>{n}</Code>
              <span className="font-mono text-h3">{v}</span>
              <span className="text-sm text-text-secondary">{u}</span>
            </li>
          ))}
        </ul>
      </Part>

      <Part id="components" n="06 · Components" title="Buttons and links" why="One primary per view; at most one secondary; everything else is a plain link (principle 4). Hover, press and focus the live samples; the static row shows each state.">
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap items-center gap-4">
            <Button href="#components">Talk to an expert</Button>
            <Button href="#components" variant="secondary">Try Forge</Button>
            <Button href="#components" aria-disabled>Disabled</Button>
          </div>
          <div className="grid grid-cols-2 gap-px bg-border-default text-sm lg:grid-cols-4">
            {[
              ["Primary · hover", "bg-accent bg-[linear-gradient(180deg,var(--color-accent-sheen),transparent)] text-on-accent"],
              ["Primary · pressed", "bg-accent text-on-accent scale-[0.99]"],
              ["Secondary · hover", "bg-ink text-canvas border border-ink"],
              ["Secondary · pressed", "bg-ink-pressed text-canvas border border-ink-pressed translate-y-px"],
            ].map(([label, cls]) => (
              <div key={label} className="flex flex-col gap-3 bg-surface-page p-4">
                <span className={`inline-flex h-10 items-center justify-center px-4 font-medium ${cls}`}>Button</span>
                <Code>{label}</Code>
              </div>
            ))}
          </div>
        </div>
      </Part>

      <Part id="patterns" n="07 · Content patterns" title="How recurring content is shown" why="Evidence sits next to the claim (principle 1). Each pattern pairs a statement with something a buyer can check.">
        <dl className="grid gap-px bg-border-default text-sm lg:grid-cols-2">
          {[
            ["Section header", "Headline with one accent phrase; lead and a single link to the right."],
            ["Link cell", "Whole cell is the link. Hover lifts it to white and nudges the arrow."],
            ["Data offering", "Category, icon and real dataset names; specs in mono, placeholders bracketed."],
            ["Metrics", "Numbers in mono with their unit, under the claim they support (e.g. experts · countries)."],
            ["Logos", "Shown only with permission; placeholders are labelled as such."],
            ["Call to action", "One orange button plus one outline button, never more."],
          ].map(([term, def]) => (
            <div key={term} className="bg-surface-page p-5">
              <dt className="font-medium">{term}</dt>
              <dd className="mt-1 text-text-secondary">{def}</dd>
            </div>
          ))}
        </dl>
      </Part>
    </>
  );
}
