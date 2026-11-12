import { FaqList } from "@/components/home/FaqList";
import { HeadingText } from "@/components/ui/Heading";
import type { Faq, Heading } from "@/lib/content";

/**
 * A page's FAQ (Subpages 4.0): the title in a 376px cell on the left, the questions on the right (FaqList:
 * any number open, the first open on load). Below lg the title sits above the list.
 */
export function FaqBlock({ id, title, items }: { id: string; title: Heading; items: Faq[] }) {
  return (
    <section aria-labelledby={id} className="flex flex-col border-b border-border-default lg:flex-row">
      <div className="border-b border-border-default px-5 pb-8 pt-10 lg:w-[376px] lg:shrink-0 lg:border-b-0 lg:border-r lg:px-10 lg:py-16">
        <h2 id={id} className="display"><HeadingText h={title} /></h2>
      </div>
      <FaqList items={items} />
    </section>
  );
}
