import Link from "next/link";
import { Cell, Row, SectionHeader } from "@/components/ui/Grid";
import { TextLink } from "@/components/ui/Button";
import { HeadingText } from "@/components/ui/Heading";
import { quietArrow, quietLink } from "@/components/ui/quiet-link";
import { Illustration } from "@/components/ui/Illustration";
import { customerLogos, datasetsSection, logoWall, servicesSection, stack, ways } from "@/lib/content";
import { services } from "@/lib/nav";
import { DatasetTabs } from "./DatasetTabs";
import { StackSection } from "./StackSection";

/** Shared hover for any cell that is a link: it lifts from canvas grey to raised white (interaction states v3). */
export const linkCell =
  "group block transition-colors duration-(--duration-base) ease-out hover:bg-surface-hover";

/* ───────────── Logo wall ───────────── */
export function LogoWall() {
  const logos = [...customerLogos, ...customerLogos];
  return (
    <section aria-label="Customers" className="flex flex-col border-b border-border-default lg:flex-row">
      {/* mobile: the text sits in its own cell above the strip, with a line between them */}
      <div className="flex shrink-0 flex-col gap-1.5 border-b border-border-default px-5 py-5 lg:w-[310px] lg:justify-center lg:border-b-0 lg:border-r lg:px-10 lg:py-0">
        <p className="label">{logoWall.label}</p>
        <p className="text-body font-title text-text-heading">{logoWall.title}</p>
      </div>
      {/* flex-1 only in the desktop row: in the mobile column its zero basis would ignore the height */}
      <div className="group relative h-18 overflow-hidden lg:h-28 lg:flex-1 [mask-image:linear-gradient(90deg,transparent,#000_40px,#000_calc(100%-40px),transparent)] lg:[mask-image:linear-gradient(90deg,transparent,#000_80px,#000_calc(100%-80px),transparent)]">
        {/* logos are drawn at 75% on phones, so a few fit across instead of one and a half */}
        <ul className="flex h-full w-max items-center [--logo-scale:0.75] motion-safe:animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused] lg:[--logo-scale:1]">
          {logos.map((l, i) => (
            // the second copy only makes the loop seamless, so screen readers hear each name once
            <li key={i} aria-hidden={i >= customerLogos.length} className="flex h-full items-center px-6 text-text-tertiary lg:px-10 transition-colors duration-(--duration-fast) ease-out hover:bg-surface-hover hover:text-text-primary">
              {/* the logo file is a mask over the text colour, so every logo is one grey and darkens on hover */}
              <span
                role="img"
                aria-label={l.name}
                className="block bg-current"
                style={{
                  height: `calc(${l.h}px * var(--logo-scale))`,
                  aspectRatio: l.ratio,
                  maskImage: `url(${l.src})`, WebkitMaskImage: `url(${l.src})`,
                  maskSize: "contain", WebkitMaskSize: "contain",
                  maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat",
                  maskPosition: "center", WebkitMaskPosition: "center",
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────── What Abaka is: three ways ───────────── */
export function Ways() {
  return (
    <section aria-labelledby="ways">
      <SectionHeader id="ways" title={<HeadingText h={ways.title} />} />
      <Row>
        {ways.items.map((w) => (
          <Cell key={w.title} className="flex flex-1 flex-col gap-7 px-5 py-8 lg:px-10 lg:py-10">
            <Illustration name={w.icon} className="w-[72px]" />
            <div className="flex flex-col gap-2">
              <p className="label">{w.label}</p>
              <h3 className="text-h3 font-title text-text-heading leading-h3 tracking-snug">{w.title}</h3>
              <p className="text-body leading-body text-text-secondary">{w.body}</p>
            </div>
            {/* each row is its own link: a quiet link (link hover v5), label and arrow turn orange, the arrow moves 4px */}
            <ul className="flex-1 border-t border-border-default">
              {w.list.map((li) => (
                <li key={li.label} className="border-b border-border-default">
                  <Link
                    href={li.href}
                    className={`flex items-center gap-3 py-2.5 text-body ${quietLink}`}
                  >
                    <span className="flex-1">{li.label}</span>
                    <span aria-hidden className={`text-text-muted ${quietArrow()}`}>→</span>
                  </Link>
                </li>
              ))}
            </ul>
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
        title={<HeadingText h={stack.title} />}
        lead={stack.lead}
        link={
          <div className="flex flex-col gap-2.5 lg:flex-row lg:gap-7">
            {stack.links.map((l) => <TextLink key={l.href} href={l.href}>{l.label}</TextLink>)}
          </div>
        }
      />
      <StackSection />
    </section>
  );
}

/* ───────────── Datasets ───────────── */
export function Datasets() {
  return (
    <section aria-labelledby="datasets">
      <SectionHeader
        id="datasets"
        rule={false}
        title={<HeadingText h={datasetsSection.title} />}
        lead={datasetsSection.lead}
        link={<TextLink href={datasetsSection.link.href}>{datasetsSection.link.label}</TextLink>}
      />
      <DatasetTabs />
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
        title={<HeadingText h={servicesSection.title} />}
        lead={servicesSection.lead}
        link={<TextLink href={servicesSection.link.href}>{servicesSection.link.label}</TextLink>}
      />
      <Row>
        {services.map((s) => (
          <Cell key={s.label} className="flex-1">
            <Link href={s.href} className={`${linkCell} flex h-full flex-col gap-5 px-5 py-8 lg:px-10 lg:py-10`}>
              <Illustration name={serviceArt[s.label]} className="h-[104px] w-[128px]" />
              <h3 className="text-title font-title text-text-heading leading-title">{s.label}</h3>
              <p className="flex-1 text-body leading-body text-text-secondary">{s.description}</p>
              <span className="text-body font-medium">
                {servicesSection.explore} {s.label} <span aria-hidden className="inline-block transition-[translate,color] duration-(--duration-base) group-hover:translate-x-1 group-hover:text-accent">→</span>
              </span>
            </Link>
          </Cell>
        ))}
      </Row>
    </section>
  );
}
