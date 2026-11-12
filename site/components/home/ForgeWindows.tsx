import { Illustration } from "@/components/ui/Illustration";
import { platform } from "@/lib/content";
import { FORGE_WINDOW_W } from "./forge-size";

/**
 * The four drawn Forge screens for the feature tour (Paper "Forge · feature tour v2"). Sample data only.
 * Text that Paper sets in ink-56 uses text-tertiary (ink-64) so it passes AA; ink-40 stays for the faintest marks.
 */
const w = platform.windows;

function Frame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div aria-hidden className="overflow-clip rounded-window border border-border-default bg-surface-raised" style={{ minWidth: FORGE_WINDOW_W }}>
      <div className={`h-[340px] ${className}`}>{children}</div>
    </div>
  );
}
const small = "inline-block px-2.5 py-[5px] text-label font-medium leading-label";
const SecondaryChip = ({ children }: { children: React.ReactNode }) => <span className={`${small} border border-ink`}>{children}</span>;
const PrimaryChip = ({ children }: { children: React.ReactNode }) => <span className={`${small} bg-accent text-text-on-accent`}>{children}</span>;
const Filter = ({ on, children }: { on?: boolean; children: React.ReactNode }) => (
  <span className={`border px-2 py-1 font-mono text-mono-sm leading-mono-sm ${on ? "border-ink bg-surface-page" : "border-border-default text-text-tertiary"}`}>{children}</span>
);
/** a few 2px ink-40 lines standing in for text */
const Lines = ({ widths, accent }: { widths: number[]; accent?: number }) => (
  <>
    {widths.map((p, i) => (
      <span key={i} className={`block h-0.5 shrink-0 ${i === accent ? "bg-accent" : "bg-ink-40"}`} style={{ width: `${p}%` }} />
    ))}
  </>
);
const Head = ({ title, meta, children }: { title: string; meta: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-baseline gap-2.5">
      <span className="text-body font-medium leading-sm">{title}</span>
      <span className="font-mono text-mono-sm leading-mono-sm text-text-tertiary">{meta}</span>
    </div>
    <div className="flex gap-1.5">{children}</div>
  </div>
);

/* 01 · Every data type: a data-type browser */
const thumbs = [[70, 88, 54, 76], [70, 88, 82, 76], [56, 88, 54, 76], [70, 64, 54, 76], [70, 88, 82, 76], [56, 88, 54, 76], [70, 64, 54, 76], [70, 88, 82, 76]];
export function TypesWindow() {
  const t = w.types;
  return (
    <Frame className="flex">
      <div className="flex w-[168px] shrink-0 flex-col gap-0.5 border-r border-border-default px-2.5 py-3.5">
        <span className="px-2.5 pb-2 font-mono text-mono-sm uppercase leading-mono-sm tracking-mono-loose text-text-muted">{t.heading}</span>
        {t.list.map(([name, count], i) => (
          <span key={name} className={`relative flex h-[30px] shrink-0 items-center justify-between px-2.5 ${i === 0 ? "bg-surface-page" : ""}`}>
            {i === 0 && <span className="absolute -left-px -top-px h-[30px] w-0.5 bg-accent" />}
            <span className={`text-mono leading-ui ${i === 0 ? "font-medium" : "text-text-secondary"}`}>{name}</span>
            <span className={`font-mono text-mono-sm leading-mono-sm ${i === 0 ? "text-text-tertiary" : "text-text-muted"}`}>{count}</span>
          </span>
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3.5 px-5 py-4">
        <Head title={t.title} meta={t.meta}>
          <SecondaryChip>{t.actions[0]}</SecondaryChip>
          <PrimaryChip>{t.actions[1]}</PrimaryChip>
        </Head>
        <div className="grid grid-cols-4 gap-2.5">
          {t.items.map(([id, status], i) => (
            <span key={id} className="flex min-w-0 flex-col gap-1.5">
              <span className={`flex h-[78px] shrink-0 flex-col items-center justify-center gap-[5px] border bg-surface-page px-3.5 ${status === "in review" ? "border-accent" : "border-border-default"}`}>
                <Lines widths={thumbs[i]} />
              </span>
              <span className="flex justify-between font-mono text-micro leading-micro">
                <span className="text-text-tertiary">{id}</span>
                <span className={status === "in review" ? "text-accent" : status === "raw" ? "text-text-muted" : ""}>{status}</span>
              </span>
            </span>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* 02 · One platform, start to finish: the pipeline as columns */
const bars = [[80, 60], [70], [84, 58, 72], [66], []];
export function PipelineWindow() {
  const p = w.pipeline;
  return (
    <Frame className="flex flex-col gap-3.5 px-5 py-4">
      <Head title={p.title} meta={p.meta}>
        <SecondaryChip>{p.action}</SecondaryChip>
      </Head>
      <div className="flex flex-1 gap-2">
        {p.columns.map((c, ci) => {
          const active = ci === 2;
          return (
            <div key={c.name} className={`flex flex-1 basis-0 flex-col gap-1.5 border p-2 ${active ? "border-accent bg-surface-hover" : "border-border-default bg-surface-page"}`}>
              <span className="flex justify-between px-0.5 pb-1.5 pt-0.5 font-mono text-micro leading-micro">
                <span className={`uppercase tracking-mono ${active ? "text-accent" : "text-text-tertiary"}`}>{c.name}</span>
                <span className="text-ink-pressed">{c.count}</span>
              </span>
              {c.tasks.map((task, ti) => (
                <span key={task} className={`flex flex-col gap-1.5 border bg-surface-raised p-2 ${c.note ? "border-ink" : "border-border-default"}`}>
                  <span className="font-mono text-micro leading-micro">{task}</span>
                  {c.note ? (
                    <span className="font-mono text-micro leading-micro text-text-tertiary">{c.note}</span>
                  ) : (
                    <Lines widths={[bars[ci][ti]]} accent={active && ti === 1 ? 0 : undefined} />
                  )}
                </span>
              ))}
            </div>
          );
        })}
      </div>
    </Frame>
  );
}

/* 03 · Annotate faster: the model's draft box, and the box a person corrected */
export function AnnotateWindow() {
  const a = w.annotate;
  return (
    <Frame className="flex flex-col">
      <div className="flex h-[38px] shrink-0 items-center justify-between border-b border-border-default px-4">
        <div className="flex gap-1">
          {a.tools.map((t, i) => <Filter key={t} on={i === 0}>{t}</Filter>)}
        </div>
        <span className="font-mono text-mono-sm leading-mono-sm text-text-tertiary">{a.ref}</span>
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 items-center justify-center overflow-hidden">
          <div className="relative h-[190px] w-[340px] shrink-0">
            <Illustration name="annotate-mug" className="absolute left-0 top-0 w-[416px]" />
            <span className="absolute left-[122px] top-9 size-[140px] border-(length:--stroke-strong) border-dashed border-grey-600" />
            <span className="absolute left-[122px] top-4 flex h-5 items-center border border-grey-300 bg-surface-raised px-1.5 font-mono text-mono-sm leading-mono-sm text-text-tertiary">{a.draft}</span>
            <span className="absolute left-[136px] top-[50px] h-[142px] w-[162px] border-(length:--stroke-strong) border-accent" />
            <span className="absolute left-[150px] top-[192px] flex h-5 items-center bg-accent px-1.5 font-mono text-mono-sm leading-mono-sm text-text-on-accent">{a.corrected}</span>
          </div>
        </div>
        <div className="flex w-[200px] shrink-0 flex-col border-l border-border-default">
          <span className="px-3.5 pb-2 pt-3 font-mono text-micro uppercase leading-micro tracking-mono-loose text-text-muted">{a.heading}</span>
          {a.labels.map((l, i) => (
            <span key={l.name} className={`flex flex-col gap-1 px-3.5 py-2.5 ${i === 0 ? "border-y border-grey-200 bg-surface-hover" : "border-b border-border-default"}`}>
              <span className="flex items-center gap-2">
                <span className={`size-2 shrink-0 ${i === 0 ? "bg-accent" : "border border-ink-40"}`} />
                <span className={`text-mono leading-ui ${i === 0 ? "font-medium" : "text-text-secondary"}`}>{l.name}</span>
              </span>
              <span className={`font-mono text-micro leading-mono-sm ${i === 0 ? "text-text-tertiary" : "text-text-muted"}`}>
                {l.note.map((line) => <span key={line} className="block">{line}</span>)}
              </span>
            </span>
          ))}
          <span className="flex-1" />
          <span className="flex gap-1.5 border-t border-border-default px-3.5 py-3">
            <span className="flex flex-1 justify-center border border-ink py-1.5 text-label font-medium leading-label">{a.actions[0]}</span>
            <span className="flex flex-1 justify-center bg-accent py-1.5 text-label font-medium leading-label text-text-on-accent">{a.actions[1]}</span>
          </span>
        </div>
      </div>
    </Frame>
  );
}

/* 04 · Manage the work: the review queue */
const mark: Record<string, string> = {
  accepted: "bg-ink",
  "in review": "border border-ink",
  "sent back": "border border-dashed border-ink",
  queued: "border border-grey-400",
};
const colW = ["w-[150px] pl-1", "w-[150px]", "w-[170px]", "flex-1"];
export function QueueWindow() {
  const q = w.queue;
  return (
    <Frame className="flex flex-col gap-1.5 px-5 py-3.5">
      <div className="flex items-center justify-between pb-1.5">
        <div className="flex gap-1">
          {q.filters.map((f, i) => <Filter key={f} on={i === 0}>{f}</Filter>)}
        </div>
        <SecondaryChip>{q.action}</SecondaryChip>
      </div>
      <div className="flex flex-col">
        <div className="flex h-8 items-center border-b border-border-default">
          {q.columns.map((c, i) => (
            <span key={c} className={`${colW[i]} shrink-0 font-mono text-label uppercase leading-label tracking-label text-text-tertiary`}>{c}</span>
          ))}
        </div>
        {q.rows.map(([task, data, stage, review]) => (
          <div key={task} className="flex h-9 items-center border-b border-border-default font-mono text-label leading-label">
            <span className={`${colW[0]} shrink-0`}>{task}</span>
            <span className={`${colW[1]} shrink-0 text-text-secondary`}>{data}</span>
            <span className={`${colW[2]} shrink-0 text-text-secondary`}>{stage}</span>
            <span className={`${colW[3]} flex items-center gap-2 ${review === "queued" ? "text-text-muted" : ""}`}>
              <span className={`size-2 shrink-0 ${mark[review]}`} />
              {review}
            </span>
          </div>
        ))}
        <div className="flex justify-between pt-2 font-mono text-mono-sm leading-mono-sm text-text-tertiary">
          <span>{q.summary}</span>
          <span>{q.reviewer}</span>
        </div>
      </div>
    </Frame>
  );
}
