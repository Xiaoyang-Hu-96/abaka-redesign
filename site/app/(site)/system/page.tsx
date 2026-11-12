import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ChevronDown, Database, Layers, ShieldCheck } from "lucide-react";
import { FaqList } from "@/components/home/FaqList";
import { Button, TextLink } from "@/components/ui/Button";
import { bad, chipOff, chipOn, field, ok } from "@/components/ui/field";
import { Cell, Row, SectionHeader, SectionIntro } from "@/components/ui/Grid";
import { HeadingText } from "@/components/ui/Heading";
import { IconBox } from "@/components/ui/IconBox";
import { quietArrow, quietLink } from "@/components/ui/quiet-link";
import { faqs } from "@/lib/content";
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
          <h2 id={`${id}-title`} className="text-h3 font-heading text-text-heading tracking-tight">{title}</h2>
        </div>
        <p className="max-w-[460px] text-sm leading-sm text-text-secondary">{why}</p>
      </div>
      <div className="px-5 py-8 lg:px-10">{children}</div>
    </section>
  );
}

const Code = ({ children }: { children: ReactNode }) => <code className="font-mono text-mono-sm text-text-tertiary">{children}</code>;

/** A row of one component in each of its states, each named underneath. Static states use the component's own classes. */
function States({ items, cols = 4 }: { items: [string, ReactNode][]; cols?: 3 | 4 }) {
  return (
    <div className={`grid grid-cols-1 gap-px bg-border-default sm:grid-cols-2 ${cols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
      {items.map(([label, node]) => (
        <div key={label} className="flex flex-col justify-between gap-4 bg-surface-page p-4">
          <div>{node}</div>
          <Code>{label}</Code>
        </div>
      ))}
    </div>
  );
}
const Sub = ({ children }: { children: ReactNode }) => <h3 className="label mb-3">{children}</h3>;

const colors: [string, string, string][] = [
  ["color.text.primary", t.colorTextPrimary, "Headlines and body. The one text colour."],
  ["color.text.secondary", t.colorTextSecondary, "Leads and descriptions."],
  ["color.text.tertiary", t.colorTextTertiary, "Mono labels, captions."],
  ["color.text.muted", t.colorTextMuted, "Disabled only. Not for readable text."],
  ["color.text.accent", t.colorTextAccent, "One emphasis per section headline."],
  ["color.surface.page", t.colorSurfacePage, "Page and resting cells."],
  ["color.surface.hover", t.colorSurfaceHover, "Hover, on any surface: cells, rows, tabs, menu items."],
  ["color.surface.selected", t.colorSurfaceSelected, "Selected or open: the open tab, FAQ row, menu. Also panels."],
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

      <Part id="type" n="03 · Foundations" title="Type" why="Geist for reading, Geist Mono for data: labels, step numbers, units. Monospace says 'this is a value', which is most of what a data company shows.">
        <ul className="flex flex-col">
          {type.map(([name, size, sample]) => (
            <li key={name} className="flex items-baseline gap-6 border-b border-border-default py-3 last:border-b-0">
              <span className="w-32 shrink-0"><Code>{name} · {size}</Code></span>
              <span className={`truncate ${name === "text.label" ? "label" : "font-heading tracking-tight text-text-heading"}`} style={{ fontSize: name === "text.label" ? undefined : size }}>
                {sample}
              </span>
            </li>
          ))}
        </ul>
      </Part>

      <Part id="space" n="04 · Foundations" title="Space, grid and breakpoints" why="One 1112px column drawn with 1px lines; every section is cells inside it. The grid is visible on purpose: it is the notebook the data sits in.">
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
          <div>
            <Sub>Links</Sub>
            <States cols={4} items={[
              ["Text link · rest", <TextLink key="t" href="#components">Explore Forge</TextLink>],
              ["Text link · hover", <span key="th" className="inline-flex items-center gap-1.5 text-sm font-medium text-accent">Explore Forge <span className="translate-x-1">→</span></span>],
              ["Quiet link · rest", <a key="q" href="#components" className={`flex items-center gap-1.5 text-body ${quietLink}`}>Data collection <span aria-hidden className={quietArrow()}>→</span></a>],
              ["Quiet link · hover", <span key="qh" className="flex items-center gap-1.5 text-body text-accent">Data collection <span className="translate-x-1">→</span></span>],
            ]} />
          </div>
        </div>
      </Part>

      <Part id="navigation" n="07 · Components" title="Navigation" why="Menus are named the way buyers look (principle 2). A menu button is a quiet link; the open one turns orange and flips its chevron. Items in a panel tint on hover and show an orange arrow; keyboard focus is an inset ring. Below lg the menu is a full-screen dialog with one disclosure per menu.">
        <div className="flex flex-col gap-8">
          <div>
            <Sub>Menu button</Sub>
            <States cols={3} items={[
              ["Rest", <span key="r" className="flex items-center gap-1.5 text-lead text-text-secondary">Datasets <ChevronDown aria-hidden className="size-3 text-ink-56" strokeWidth={1.5} /></span>],
              ["Hover", <span key="h" className="flex items-center gap-1.5 text-lead text-accent">Datasets <ChevronDown aria-hidden className="size-3 text-accent" strokeWidth={1.5} /></span>],
              ["Open", <span key="o" className="flex items-center gap-1.5 text-lead text-accent">Datasets <ChevronDown aria-hidden className="size-3 rotate-180 text-accent" strokeWidth={1.5} /></span>],
            ]} />
          </div>
          <div>
            <Sub>Panel item</Sub>
            <States cols={3} items={[
              ["Rest", <PanelItem key="r" />],
              ["Hover", <PanelItem key="h" state="hover" />],
              ["Keyboard focus", <PanelItem key="f" state="focus" />],
            ]} />
          </div>
        </div>
      </Part>

      <Part id="cells" n="08 · Components" title="Cells, cards and tabs" why="Everything sits in cells on the 1px grid; there are no floating rounded cards. Hover is a light orange tint on any surface; selected or open is white. An icon box marks what a cell is about; the one featured item gets the orange box.">
        <div className="flex flex-col gap-8">
          <div>
            <Sub>Icon box</Sub>
            <States cols={3} items={[
              ["sm · 28px, card headers", <IconBox key="s" icon={Database} size="sm" />],
              ["md · 40px, cells and steps", <IconBox key="m" icon={Layers} />],
              ["accent · the featured item", <IconBox key="a" icon={ShieldCheck} accent />],
            ]} />
          </div>
          <div>
            <Sub>Cell</Sub>
            <States cols={3} items={[
              ["Rest", <CellSample key="r" />],
              ["Hover · links only", <CellSample key="h" hover />],
              ["Selected / open", <CellSample key="s" selected />],
            ]} />
          </div>
          <div>
            <Sub>Folder tab</Sub>
            <States cols={3} items={[
              ["Rest", <FolderTab key="r" />],
              ["Hover", <FolderTab key="h" hover />],
              ["Selected", <FolderTab key="s" selected />],
            ]} />
          </div>
          <div>
            <Sub>FAQ row · live</Sub>
            <div className="border border-border-default"><FaqList items={faqs.slice(0, 2)} /></div>
          </div>
        </div>
      </Part>

      <Part id="forms" n="09 · Components" title="Forms" why="Fields are plain and square, on the page colour. Errors use the accent border and say what to fix in words, so the colour is never the only signal. The live form is on /contact.">
        <div className="flex flex-col gap-8">
          <div>
            <Sub>Text field</Sub>
            <States cols={4} items={[
              ["Rest", <span key="r" className={`${field} ${ok} flex h-11 items-center text-text-muted`}>Work email</span>],
              ["Hover", <span key="h" className={`${field} flex h-11 items-center border-border-hover text-text-muted`}>Work email</span>],
              ["Focus", <span key="f" className={`${field} flex h-11 items-center border-border-strong shadow-[0_0_0_3px_var(--color-focus-halo)]`}>ana@lab.ai</span>],
              ["Error", <span key="e" className="flex flex-col gap-2"><span className={`${field} ${bad} flex h-11 items-center`}>ana@lab</span><span className="flex items-center gap-1.5 text-label text-text-primary"><span aria-hidden className="size-1.5 bg-accent" />Enter a full work email</span></span>],
            ]} />
          </div>
          <div>
            <Sub>Option chip</Sub>
            <States cols={3} items={[
              ["Off", <span key="o" className={`inline-block border px-3 py-2 text-sm leading-ui ${chipOff}`}>Annotation</span>],
              ["Hover", <span key="h" className="inline-block border border-grey-300 bg-surface-hover px-3 py-2 text-sm leading-ui text-text-primary">Annotation</span>],
              ["On", <span key="n" className={`inline-block border px-3 py-2 text-sm leading-ui ${chipOn}`}>Annotation</span>],
            ]} />
          </div>
        </div>
      </Part>

      <Part id="sections" n="10 · Components" title="Section layouts" why="Every section opens the same way: a 96px gap, a label row, then a header cell with one headline and a lead. Rows of cells follow. A page ends with one centred call to action. These are the live components.">
        <div className="flex flex-col gap-6 border border-border-default">
          <SectionIntro n={3} total={5} label="Catalog" />
          <SectionHeader title={<HeadingText h={{ before: "All 21 datasets,\n", em: "by category." }} />} lead="Pick a category. Request opens the contact form with the dataset already filled in." />
          <Row>
            {["Cell", "Cell", "Cell"].map((c, i) => <Cell key={i} className="flex-1 px-5 py-6 text-sm text-text-secondary lg:px-10">{c}</Cell>)}
          </Row>
        </div>
      </Part>

      <Part id="footer" n="11 · Components" title="Footer" why="The footer repeats the menus from the same data as the header, so the two can't disagree (principle 2). Its links are quiet links. The wordmark shakes under a moving pointer and settles when it stops; it sits below the last action, so nothing waits for it.">
        <States cols={3} items={[
          ["Column link · rest", <span key="r" className="text-sm text-text-secondary">Data collection</span>],
          ["Column link · hover", <span key="h" className="text-sm text-accent">Data collection</span>],
          ["Bottom row", <span key="b" className="flex flex-wrap gap-x-5 gap-y-1 text-ui text-text-tertiary"><span>© 2026 Abaka AI</span><span className="text-text-secondary">Privacy Policy</span><span className="text-text-secondary">Back to top ↑</span></span>],
        ]} />
      </Part>

      <Part id="patterns" n="12 · Content patterns" title="How recurring content is shown" why="Evidence sits next to the claim (principle 1). Each pattern pairs a statement with something a buyer can check.">
        <dl className="grid gap-px bg-border-default text-sm lg:grid-cols-2">
          {[
            ["Section header", "Headline with one accent phrase; lead and a single link to the right."],
            ["Link cell", "Whole cell is the link. Hover tints it light orange and nudges the arrow."],
            ["Data offering", "Category, icon and real dataset names; specs in mono, placeholders bracketed."],
            ["Metrics", "Numbers in mono with their unit, under the claim they support (e.g. experts · countries)."],
            ["Logos", "One grey, from each company's published wordmark; shown only with permission before launch."],
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

/* Static stand-ins for states that need a pointer or keyboard; each uses the live component's classes. */
function PanelItem({ state }: { state?: "hover" | "focus" }) {
  return (
    <span className={`relative flex flex-col gap-1 border border-border-default px-5 py-4 ${state === "hover" ? "bg-surface-hover" : "bg-surface-page"} ${state === "focus" ? "shadow-[inset_0_0_0_2px_var(--color-focus-ring)]" : ""}`}>
      <span className="text-lead font-title leading-body text-text-heading">Coding</span>
      <span className="text-sm leading-sm text-text-tertiary">Repo Patch · Competitive Coding</span>
      <span aria-hidden className={`absolute right-4 top-4 text-sm text-accent ${state === "hover" ? "" : "opacity-0"}`}>→</span>
    </span>
  );
}

function CellSample({ hover, selected }: { hover?: boolean; selected?: boolean }) {
  return (
    <span className={`flex flex-col gap-2 border border-border-default p-4 ${selected ? "bg-surface-selected" : hover ? "bg-surface-hover" : "bg-surface-page"}`}>
      <IconBox icon={Layers} size="sm" />
      <span className="text-body font-title text-text-heading">Every data type</span>
      <span className={`flex items-center gap-1.5 text-sm ${hover ? "text-accent" : "text-text-secondary"}`}>Explore <span aria-hidden className={hover ? "translate-x-1" : ""}>→</span></span>
    </span>
  );
}

function FolderTab({ hover, selected }: { hover?: boolean; selected?: boolean }) {
  return (
    <span className="flex h-16 items-end">
      <span className={`flex items-center gap-2.5 border-r border-t border-l border-border-default px-3.5 text-lead leading-lead ${
        selected ? "h-16 bg-surface-selected text-text-heading" : `h-14 border-b ${hover ? "bg-surface-hover text-text-primary" : "bg-surface-page text-text-secondary"}`
      }`}>
        <span aria-hidden className={`flex size-7 items-center justify-center ${selected ? "bg-accent text-text-on-accent" : "text-ink-56"}`}><Database className="size-4" strokeWidth={1.6} /></span>
        Coding
      </span>
    </span>
  );
}
