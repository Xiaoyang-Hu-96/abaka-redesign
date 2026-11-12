import { Button } from "@/components/ui/Button";
import { SectionGap } from "@/components/ui/Grid";
import { HeadingText } from "@/components/ui/Heading";
import type { Heading, LinkCopy } from "@/lib/content";

/** A page's closing call to action, centred (as on Physical AI): headline, one line, the page's two actions. */
export function PageCta({ id, title, lead, primary, secondary }: { id: string; title: Heading; lead: string; primary: LinkCopy; secondary?: LinkCopy }) {
  return (
    <>
      <SectionGap />
      <section aria-labelledby={id} className="flex flex-col items-center gap-6 border-b border-border-default px-5 py-14 text-center lg:px-10 lg:py-22">
        <h2 id={id} className="display"><HeadingText h={title} /></h2>
        <p className="max-w-[520px] text-lead leading-lead text-text-secondary">{lead}</p>
        <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row">
          <Button href={primary.href} size="lg">{primary.label}</Button>
          {secondary && <Button href={secondary.href} variant="secondary" size="lg">{secondary.label}</Button>}
        </div>
      </section>
    </>
  );
}
