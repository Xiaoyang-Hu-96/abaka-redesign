import Link from "next/link";
import { Cell, Row, SectionHeader } from "@/components/ui/Grid";
import { TextLink } from "@/components/ui/Button";
import { Illustration } from "@/components/ui/Illustration";
import { categories, layers, placeholderLogos } from "@/lib/content";
import { datasetCategories, services } from "@/lib/nav";

/** Shared hover for any cell that is a link: it lifts from canvas grey to raised white (interaction states v3). */
export const linkCell =
  "group block transition-colors duration-(--duration-base) ease-out hover:bg-surface-raised";

/* ───────────── Logo wall ───────────── */
export function LogoWall() {
  const logos = [...placeholderLogos, ...placeholderLogos];
  return (
    <section aria-label="Customers" className="flex flex-col border-b border-border-default lg:flex-row">
      <div className="flex shrink-0 flex-col gap-1.5 px-5 pt-5 lg:w-[310px] lg:justify-center lg:border-r lg:border-border-default lg:px-10 lg:py-0">
        <p className="label">Trusted by</p>
        <p className="text-body font-medium">Leading AI teams worldwide</p>
        <p className="font-mono text-mono-sm text-text-muted">[ placeholder logos ]</p>
      </div>
      <div className="group relative h-[88px] flex-1 overflow-hidden lg:h-[112px] [mask-image:linear-gradient(90deg,transparent,#000_80px,#000_calc(100%-80px),transparent)]">
        <ul className="flex h-full w-max items-center motion-safe:animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused]">
          {logos.map((l, i) => (
            <li key={i} aria-hidden={i >= placeholderLogos.length} className="px-10 text-[19px] font-semibold tracking-tight text-text-tertiary transition-colors duration-(--duration-fast) hover:text-text-primary">
              {l}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────── What Abaka is: three ways ───────────── */
type Way = { icon: string; label: string; title: string; href: string; cta: string; body: string; list: { label: string; meta?: string }[] };
const ways: Way[] = [
  {
    icon: "way-dataset", label: "Ready-made", title: "Buy a dataset", href: "/datasets", cta: "Browse datasets",
    body: "Already collected and labelled. Each one lists its specs and starting price.",
    list: [{ label: "Datasets catalog", meta: String(categories.reduce((n, c) => n + c.datasets.length, 0)) }],
  },
  {
    icon: "way-commission", label: "Made to order", title: "Commission data", href: "/services", cta: "See services",
    body: "We collect, label or test data to your spec, or build an environment for your agent.",
    list: [{ label: "Data collection" }, { label: "Data annotation" }, { label: "Model evaluation" }, { label: "RL environments" }],
  },
  {
    icon: "way-forge", label: "Self-serve", title: "Run it yourself", href: "/platform", cta: "See the platform",
    body: "Do your own labelling and review on Forge, the platform our teams use.",
    list: [{ label: "Abaka Forge" }],
  },
];

export function Ways() {
  return (
    <section aria-labelledby="ways">
      <SectionHeader id="ways" title={<>A data company for AI teams. <em>Three ways to work with us.</em></>} />
      <Row>
        {ways.map((w) => (
          <Cell key={w.title} className="flex-1">
            <Link href={w.href} className={`${linkCell} flex h-full flex-col gap-7 px-5 py-8 lg:px-10 lg:py-10`}>
              <Illustration name={w.icon} className="w-[72px]" />
              <div className="flex flex-col gap-2">
                <p className="label">{w.label}</p>
                <h3 className="text-[22px] font-semibold leading-[28px] tracking-tight">{w.title}</h3>
                <p className="text-body leading-body text-text-secondary">{w.body}</p>
              </div>
              <ul className="flex-1 border-t border-border-default">
                {w.list.map((li) => (
                  <li key={li.label} className="flex justify-between border-b border-border-default py-2.5 text-body">
                    {li.label}
                    {li.meta && <span className="font-mono text-mono-sm text-text-tertiary">{li.meta}</span>}
                  </li>
                ))}
              </ul>
              <span className="text-body font-medium">
                {w.cta} <span aria-hidden className="inline-block transition-[transform,color] duration-(--duration-base) group-hover:translate-x-1 group-hover:text-accent">→</span>
              </span>
            </Link>
          </Cell>
        ))}
      </Row>
    </section>
  );
}

/* ───────────── Stack: four layers, one platform ───────────── */
export function Stack() {
  return (
    <section aria-labelledby="stack">
      <SectionHeader
        id="stack"
        title={<>Four layers. <em>One platform.</em></>}
        lead="Follow frame_118 from capture to evaluation. What passes ships as a dataset or goes to your team."
        link={
          <div className="flex flex-col gap-2.5 lg:flex-row lg:gap-7">
            <TextLink href="/datasets">Packaged as a dataset</TextLink>
            <TextLink href="/services">Delivered to your team</TextLink>
          </div>
        }
      />
      <div className="flex flex-col-reverse border-b border-border-default lg:flex-row">
        <ol className="lg:w-[440px] lg:shrink-0 lg:border-r lg:border-border-default">
          {layers.map((l) => (
            <li
              key={l.title}
              aria-current={l.active ? "step" : undefined}
              className={`flex flex-col gap-1.5 border-b border-border-default px-5 py-6 last:border-b-0 lg:px-10 lg:py-9 ${
                l.active ? "border-l-2 border-l-accent bg-surface-active" : ""
              }`}
            >
              <span className={`label ${l.active ? "text-accent" : ""}`}>{l.step}</span>
              <span className={`text-title font-medium leading-title ${l.active ? "text-accent" : ""}`}>{l.title}</span>
              <span className="text-body text-text-secondary">{l.body}</span>
            </li>
          ))}
        </ol>
        <div className="flex flex-1 items-center justify-center border-b border-border-default py-6 lg:border-b-0" aria-label="Isometric stack: four data layers on the Forge platform" role="img">
          <div className="relative w-[330px] lg:w-[434px]">
            <Illustration name="stack" />
            <Illustration name="stack-logo" className="absolute inset-0" />
            <Illustration name="stack-label" className="absolute inset-0" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Datasets ───────────── */
export function Datasets() {
  const rows = [categories.slice(0, 4), categories.slice(4)];
  return (
    <section aria-labelledby="datasets">
      <SectionHeader
        id="datasets"
        title={<>Off-the-shelf datasets, <em>ready to request.</em></>}
        lead="Ready-made training data in seven categories. Pick one and request it, or tell us what you need."
        link={<TextLink href="/datasets">See all datasets</TextLink>}
      />
      {rows.map((row, r) => (
        <Row key={r}>
          {row.map((c) => {
            const Icon = datasetCategories.find((d) => d.label === c.label)!.icon!;
            return (
              <Cell key={c.id} className="lg:w-1/4">
                <Link href={`/datasets#${c.id}`} className={`${linkCell} flex h-full flex-col gap-5 px-5 py-6 lg:px-8 lg:py-8`}>
                  <span className="flex items-center gap-3 text-title font-medium">
                    <Icon aria-hidden className="size-(--icon-md)" strokeWidth={1.5} />
                    {c.label}
                  </span>
                  <ul className="flex flex-col gap-2 text-body text-text-secondary">
                    {c.datasets.map((d) => <li key={d.name}>{d.name}</li>)}
                  </ul>
                </Link>
              </Cell>
            );
          })}
          {r === 1 && (
            <Cell className="lg:w-1/4">
              <Link href="/datasets/request" className="hatch group flex h-full flex-col gap-3 px-5 py-8 lg:px-8">
                <span aria-hidden className="text-title text-accent">+</span>
                <span className="text-title font-semibold leading-title">Need data we don&apos;t have yet?</span>
                <span className="text-body leading-body text-text-secondary">Tell us what your model should learn. We collect and label it to your spec.</span>
                <span className="pt-2 text-body font-medium">
                  Request a dataset <span aria-hidden className="inline-block transition-[transform,color] duration-(--duration-base) group-hover:translate-x-1 group-hover:text-accent">→</span>
                </span>
              </Link>
            </Cell>
          )}
        </Row>
      ))}
    </section>
  );
}

/* ───────────── Services ───────────── */
const serviceArt: Record<string, string> = {
  Annotation: "service-annotation",
  "Data collection": "service-collection",
  "Model evaluation": "service-evaluation",
  "RL environments": "service-rl",
};

export function Services() {
  return (
    <section aria-labelledby="services">
      <SectionHeader
        id="services"
        title={<>Work with <em>domain experts.</em></>}
        lead="Not sure which one fits? Tell us the model and the goal."
        link={<TextLink href="/contact">Talk to an expert</TextLink>}
      />
      <Row>
        {services.map((s) => (
          <Cell key={s.label} className="flex-1">
            <Link href={s.href} className={`${linkCell} flex h-full flex-col gap-5 px-5 py-8 lg:px-10 lg:py-10`}>
              <Illustration name={serviceArt[s.label]} className="h-[104px] w-[128px]" />
              <h3 className="text-title font-medium leading-title">{s.label}</h3>
              <p className="flex-1 text-body leading-body text-text-secondary">{s.description}</p>
              <span className="text-body font-medium">
                Explore {s.label} <span aria-hidden className="inline-block transition-[transform,color] duration-(--duration-base) group-hover:translate-x-1 group-hover:text-accent">→</span>
              </span>
            </Link>
          </Cell>
        ))}
      </Row>
    </section>
  );
}
