import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { CallDrawing, QuoteDrawing, SampleDrawing } from "@/components/contact/OfferDrawings";
import { contact } from "@/lib/content";

export const metadata: Metadata = { title: contact.metaTitle };

const drawings = [SampleDrawing, CallDrawing, QuoteDrawing];

/** Contact sales (Paper "Contact sales · 4.0"): what you get on the left, the brief on the right. */
export default function ContactPage() {
  return (
    <section aria-labelledby="contact-title" className="flex flex-col border-b border-border-default lg:flex-row">
      <div className="flex flex-col gap-5 border-b border-border-default px-5 pb-10 pt-14 lg:w-[560px] lg:shrink-0 lg:border-b-0 lg:border-r lg:px-10 lg:pb-12 lg:pt-24">
        <h1 id="contact-title" className="display">
          {/* keep the trailing space: without it the accessible name reads "Talk to adata expert" */}
          {contact.title.before}
          <br />
          <em>{contact.title.em}</em>
        </h1>
        <p className="max-w-[360px] text-h3 leading-row text-text-secondary">{contact.lead}</p>
        <div className="flex max-w-[479px] flex-col gap-3">
          <p className="font-mono text-mono-sm uppercase leading-label tracking-mono-loose text-text-tertiary">{contact.with}</p>
          <ul className="flex border border-border-default">
            {contact.offers.map((o, i) => {
              const Drawing = drawings[i];
              return (
                <li key={o.title} className="flex flex-1 basis-0 flex-col gap-3.5 border-r border-border-default px-4 py-5 last:border-r-0">
                  <Drawing />
                  <span className="flex flex-col gap-1">
                    <span className="text-lead font-title text-text-heading leading-sm">{o.title}</span>
                    <span className="font-mono text-mono-sm leading-label text-text-tertiary">{o.note}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="flex-1 bg-surface-raised px-5 pb-12 pt-10 lg:px-10 lg:pt-24">
        <ContactForm />
      </div>
    </section>
  );
}
