import Link from "next/link";
import { FileCheck, Lock, UserCheck } from "lucide-react";
import { Button, TextLink } from "@/components/ui/Button";
import { Cell, Row, SectionHeader } from "@/components/ui/Grid";
import { Illustration } from "@/components/ui/Illustration";
import { badges, faqs } from "@/lib/content";
import { solutions } from "@/lib/nav";
import { linkCell } from "./sections-a";

const arrow = (
  <span aria-hidden className="inline-block transition-[transform,color] duration-(--duration-base) group-hover:translate-x-1 group-hover:text-accent">→</span>
);

/* ───────────── Solutions ───────────── */
const textures = ["solution-agents", "solution-voice", "solution-llm"];

export function Solutions() {
  const [first, ...rest] = solutions;
  return (
    <section aria-labelledby="solutions">
      <SectionHeader
        id="solutions"
        title={<>Data for <em>what you are building.</em></>}
        lead="Four kinds of model, four kinds of data. Every set is made and checked by people who know the field."
      />
      <div className="flex flex-col border-b border-border-default lg:h-[600px] lg:flex-row">
        <Link href={first.href} className="group flex flex-col border-b border-border-default bg-surface-active lg:w-[638px] lg:shrink-0 lg:border-b-0 lg:border-r">
          <div className="relative h-[330px] overflow-hidden lg:h-[360px]">
            <span className="label absolute left-5 top-5 z-10 lg:left-10 lg:top-8">01</span>
            <Illustration name="solution-physical" className="absolute -left-16 top-0 w-[638px] lg:left-0" />
            <span aria-hidden className="absolute left-[64px] top-[214px] h-[96px] w-[126px] border-[1.5px] border-accent lg:left-[134px]">
              <span className="absolute -left-[1.5px] -top-[22px] bg-accent px-2 font-mono text-mono-sm leading-5 text-on-accent">lemon</span>
            </span>
          </div>
          <div className="flex flex-col gap-3 px-5 pb-8 pt-2 lg:px-10">
            <h3 className="text-[22px] font-semibold leading-[28px] tracking-tight text-text-accent">{first.label}</h3>
            <p className="max-w-[460px] text-body leading-body text-text-secondary">
              Robot and sensor data, labelled frame by frame. Annotators mark objects, grasps and keypoints on real footage.
            </p>
            <span className="text-body font-medium">Explore {first.label} {arrow}</span>
          </div>
        </Link>
        {rest.map((s, i) => (
          <Link
            key={s.label}
            href={s.href}
            className={`${linkCell} flex items-center justify-between border-b border-border-default px-5 py-5 last:border-b-0 lg:relative lg:flex-1 lg:flex-col lg:items-start lg:justify-end lg:border-b-0 lg:border-r lg:px-8 lg:py-8 lg:last:border-r-0`}
          >
            <span className="label lg:absolute lg:left-8 lg:top-8">{String(i + 2).padStart(2, "0")}</span>
            <Illustration name={textures[i]} className="hidden w-[84px] lg:absolute lg:right-8 lg:top-16 lg:block" />
            <span className="text-title font-medium tracking-tight lg:text-[22px] lg:[writing-mode:vertical-rl] lg:rotate-180">{s.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ───────────── Platform ───────────── */
const tiles = [
  { name: "tile-image", label: "Image" },
  { name: "tile-cloud", label: "3D / 4D cloud" },
  { name: null, label: "RLHF" },
  { name: "tile-text", label: "Text" },
  { name: "tile-video", label: "Video" },
];
const stages = ["Collection", "Cleaning", "Annotation", "Training", "Data production"];
const queue = [
  ["image", "annotation", "accepted"],
  ["point cloud", "annotation", "in review"],
  ["rlhf", "annotation", "sent back"],
  ["video", "cleaning", "queued"],
  ["text", "data production", "accepted"],
];

function BentoCell({ title, body, children, className = "" }: { title: string; body: string; children: React.ReactNode; className?: string }) {
  return (
    <Cell className={`flex flex-col justify-between gap-8 overflow-hidden px-5 py-8 lg:px-10 lg:py-10 ${className}`}>
      <div className="-mr-5 overflow-x-auto lg:mr-0">{children}</div>
      <div className="flex flex-col gap-2">
        <h3 className="text-[22px] font-medium leading-[28px] tracking-tight">{title}</h3>
        <p className="text-body leading-body text-text-secondary">{body}</p>
      </div>
    </Cell>
  );
}

export function Platform() {
  return (
    <section aria-labelledby="platform">
      <SectionHeader
        id="platform"
        title={<>Abaka Forge, where <em>human judgment</em> forges frontier AI.</>}
        lead="One platform to collect, clean, label and deliver training data."
        link={<TextLink href="/platform">Explore Forge</TextLink>}
      />
      <Row>
        <BentoCell className="lg:w-[740px] lg:shrink-0" title="Every data type" body="Images, 3D and 4D point clouds, RLHF, text, video and more, labelled in one tool.">
          <ul className="flex w-max gap-2.5 lg:w-auto" aria-label="Data types">
            {tiles.map((t) => (
              <li key={t.label} className="flex w-[124px] flex-col gap-4">
                <span className="flex h-[150px] items-center justify-center border border-border-default bg-surface-raised p-3">
                  {t.name ? (
                    <Illustration name={t.name} className="w-full" />
                  ) : (
                    <span aria-hidden className="flex w-full flex-col gap-2">
                      <span className="h-12 border border-border-default p-2 font-mono text-[10px] text-text-muted">A</span>
                      <span className="h-12 border border-accent p-2 font-mono text-[10px] text-accent">B</span>
                    </span>
                  )}
                </span>
                <span className="label">{t.label}</span>
              </li>
            ))}
          </ul>
        </BentoCell>
        <BentoCell className="flex-1" title="One platform, start to finish" body="From raw data to delivery in one place.">
          <ol className="flex flex-col gap-3 rounded-window border border-border-default bg-surface-raised p-5 shadow-[0_12px_32px_rgb(20_20_20/0.06)]">
            {stages.map((s, i) => (
              <li key={s} className="flex items-center gap-4 text-body">
                <span aria-hidden className="size-3 border border-ink" />
                <span className="font-mono text-mono-sm text-text-tertiary">0{i + 1}</span>
                <span className="flex-1">{s}</span>
                <span
                  aria-hidden
                  className={`h-[3px] w-24 ${i === 2 ? "outline outline-1 outline-offset-2 outline-accent" : ""}`}
                  style={{ backgroundImage: `repeating-linear-gradient(90deg, ${i >= 3 ? "var(--color-grey-600)" : "var(--color-grey-300)"} 0 16px, transparent 16px 20px)` }}
                />
              </li>
            ))}
          </ol>
        </BentoCell>
      </Row>
      <Row>
        <BentoCell className="lg:w-[498px] lg:shrink-0" title="Annotate faster" body="A model drafts the label. A person corrects it.">
          <div className="relative mx-auto h-[232px] w-[416px]" aria-hidden>
            <Illustration name="annotate-mug" className="absolute inset-0" />
            <span className="absolute left-[122px] top-[36px] h-[140px] w-[138px] border border-dashed border-grey-600">
              <span className="absolute -left-px -top-[21px] border border-grey-400 bg-surface-raised px-1.5 font-mono text-mono-sm leading-[18px] text-text-tertiary">model draft</span>
            </span>
            <span className="absolute left-[136px] top-[50px] h-[161px] w-[160px] border-[1.5px] border-accent">
              <span className="absolute -bottom-px -right-px bg-accent px-1.5 font-mono text-mono-sm leading-5 text-on-accent">corrected</span>
            </span>
          </div>
        </BentoCell>
        <BentoCell className="flex-1" title="Manage the work" body="Every task, its stage and its review status in one queue.">
          <table className="w-full min-w-[560px] font-mono text-[13px]">
            <thead>
              <tr className="label text-left">
                {["Task", "Data", "Stage", "Review"].map((h) => (
                  <th key={h} className="border-b border-border-default pb-2.5 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {queue.map(([data, stage, review], i) => (
                <tr key={i} className="border-b border-border-default">
                  <td className="py-2.5">task_[ n ]</td>
                  <td className="text-text-secondary">{data}</td>
                  <td className="text-text-secondary">{stage}</td>
                  <td className={review === "queued" ? "text-text-muted" : ""}>
                    <span aria-hidden className={`mr-2 inline-block size-2 ${review === "accepted" ? "bg-ink" : review === "queued" ? "border border-grey-400" : "border border-ink"}`} />
                    {review}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 flex justify-between text-mono-sm text-text-muted font-mono">
            <span>[ n ] open · [ n ] in review · [ n ] accepted</span>
            <span>reviewer: [ name ]</span>
          </p>
        </BentoCell>
      </Row>
    </section>
  );
}

/* ───────────── Why Abaka (proof, not clickable: no hover) ───────────── */
const proofs = [
  { icon: Lock, title: "Your data stays yours", body: "Encrypted, under NDA, in a separate pipeline for each project. Never resold, reused or shared.", foot: "Cloud · On-premise · Hybrid" },
  { icon: FileCheck, title: "Data you can legally train on", body: "Ethically sourced, with a record of where each item came from.", foot: "Provenance report on request" },
  { icon: UserCheck, title: "People you can verify", body: "Every expert passes five checks, including an ID check and a domain exam, before seeing your data.", foot: "500,046 experts · 108 countries" },
];

export function Why() {
  return (
    <section aria-labelledby="why">
      <SectionHeader
        id="why"
        title={<>Safe to hand over. <em>Safe to train on.</em></>}
        lead="Abaka is self-funded and profitable, and builds nothing that competes with you."
        link={<TextLink href="/trust">Go to trust center</TextLink>}
      />
      <ul className="grid grid-cols-2 border-b border-border-default lg:grid-cols-4">
        {badges.map((b, i) => (
          <li key={b.id} className={`flex flex-col items-center gap-4 px-3 py-6 text-center lg:py-10 ${i % 2 === 0 ? "border-r" : "lg:border-r"} ${i < 2 ? "border-b lg:border-b-0" : ""} border-border-default lg:last:border-r-0`}>
            <Illustration name={`badge-${b.id}`} className="w-[112px]" />
            <span className="text-lead font-semibold">{b.title}</span>
            <span className="max-w-[220px] text-sm leading-sm text-text-secondary">{b.body}</span>
          </li>
        ))}
      </ul>
      <Row>
        {proofs.map(({ icon: Icon, title, body, foot }) => (
          <Cell key={title} className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-4 px-5 py-8 lg:px-10">
              <Icon aria-hidden className="size-5" strokeWidth={1.5} />
              <h3 className="text-title font-medium leading-title">{title}</h3>
              <p className="text-body leading-body text-text-secondary">{body}</p>
            </div>
            <p className="label border-t border-border-default px-5 py-4 lg:px-10">{foot}</p>
          </Cell>
        ))}
      </Row>
    </section>
  );
}

/* ───────────── FAQ: native disclosure, one open at a time via the shared name ───────────── */
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title">
      <header className="border-b border-border-default px-5 pb-8 pt-14 lg:px-10 lg:pb-12 lg:pt-24">
        <h2 id="faq-title" className="display">Frequently asked questions</h2>
      </header>
      <div className="flex border-b border-border-default">
        <div className="hidden w-[440px] shrink-0 border-r border-border-default lg:block" />
        <div className="flex-1">
          {faqs.map((q) => (
            <details key={q} name="faq" className="group border-b border-border-default last:border-b-0 open:bg-surface-raised">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-6 text-lead transition-colors duration-(--duration-base) hover:bg-surface-raised lg:px-10 lg:py-8">
                {q}
                <span aria-hidden className="text-text-muted transition-transform duration-(--duration-slow) group-open:rotate-45 group-hover:text-text-primary">+</span>
              </summary>
              <p className="px-5 pb-6 text-body leading-body text-text-tertiary lg:px-10">
                [ placeholder answer: the real answer comes from Abaka ]
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── Final CTA ───────────── */
export function FinalCta() {
  return (
    <section aria-labelledby="cta" className="flex flex-col border-b border-border-default lg:h-[460px] lg:flex-row">
      <div className="flex border-b border-border-default lg:contents">
        <div className="flex flex-1 flex-col gap-3 border-r border-border-default p-4 lg:order-1 lg:w-[300px] lg:flex-none lg:p-6">
          <span className="font-mono text-mono-sm uppercase tracking-[0.14em] text-text-muted">[ Raw ]</span>
          <Illustration name="cta-raw" className="m-auto w-[150px] lg:w-[252px]" />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4 lg:order-3 lg:w-[300px] lg:flex-none lg:border-l lg:border-border-default lg:p-6">
          <span className="self-end font-mono text-mono-sm uppercase tracking-[0.14em] text-text-muted">[ Labelled ]</span>
          <Illustration name="cta-labelled" className="m-auto w-[150px] lg:w-[252px]" />
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 py-12 text-center lg:order-2">
        <h2 id="cta" className="display">Tell us what <em>your model needs.</em></h2>
        <p className="text-body leading-body text-text-secondary">Tell us the model and the goal. We reply within an hour.</p>
        <div className="flex w-full flex-col gap-2.5 pt-2 lg:w-auto lg:flex-row">
          <Button href="/contact" size="lg">Talk to an expert →</Button>
          <Button href="/platform" variant="secondary" size="lg">Try Forge</Button>
        </div>
      </div>
    </section>
  );
}
