import { X } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { quietLink } from "@/components/ui/quiet-link";
import { footer } from "@/lib/content";
import { nav } from "@/lib/nav";
import { NewsletterField } from "./NewsletterField";
import { Wordmark } from "./Wordmark";

/** Footer columns are derived from the same nav data as the header, so the two never list different products. */
const c = footer.columns;
const columns = [
  c.datasets,
  { label: c.services, links: nav[1].links! },
  c.platform,
  { label: c.solutions, links: nav[3].links! },
  { label: c.company, links: nav[4].groups!.flatMap((g) => g.links).filter((l) => !c.companyExclude.includes(l.label)) },
];

export function Footer() {
  return (
    <footer className="border-t border-border-default">
      <div className="flex flex-col border-b border-border-default lg:flex-row">
        <div className="flex flex-col gap-4 border-b border-border-default px-5 py-8 lg:w-1/2 lg:border-b-0 lg:border-r lg:px-10 lg:py-10">
          <Logo variant="brand" />
          <p className="text-lg leading-title">{footer.tagline}</p>
        </div>
        <div className="flex flex-col lg:w-1/2">
          <div className="flex flex-1 flex-col lg:flex-row">
            <div className="flex flex-col gap-3 border-b border-border-default px-5 py-6 lg:w-1/2 lg:border-b-0 lg:border-r lg:px-7 lg:py-8">
              <p className="label">{footer.contact.label}</p>
              <a href={`mailto:${footer.contact.email}`} className="text-body font-medium transition-colors duration-(--duration-fast) ease-out hover:text-accent">{footer.contact.email}</a>
              <Link href={footer.contact.link.href} className="text-sm font-medium transition-colors duration-(--duration-fast) ease-out hover:text-accent">{footer.contact.link.label}</Link>
            </div>
            <div className="flex flex-col gap-3 border-b border-border-default px-5 py-6 lg:w-1/2 lg:border-b-0 lg:px-7 lg:py-8">
              <p className="label">{footer.newsletter.label}</p>
              <p className="text-sm leading-sm text-text-secondary">{footer.newsletter.body}</p>
              <NewsletterField />
            </div>
          </div>
          <div className="flex border-border-default lg:border-t">
            {footer.social.map((l, i) => (
              <a key={l.label} href={l.href} title="Placeholder link" className={`flex flex-1 items-center gap-3 ${i === 0 ? "border-r border-border-default " : ""}px-5 py-4 text-sm ${quietLink} lg:px-7`}>
                {i === 0 ? <LinkedInMark /> : <X aria-hidden className="size-4" strokeWidth={1.5} />}
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <nav aria-label="Footer" className="grid grid-cols-2 border-b border-border-default lg:grid-cols-5">
        {columns.map((col, i) => (
          <div key={col.label} className={`border-border-default ${i % 2 === 0 ? "border-r" : ""} border-b lg:border-b-0 lg:border-r lg:last:border-r-0`}>
            <p className="label border-border-default px-5 py-5 lg:border-b lg:px-7">{col.label}</p>
            <ul className="pb-5 lg:pb-0">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={`block px-5 py-2 text-sm ${quietLink} lg:border-b lg:border-border-default lg:px-7 lg:py-3.5`}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="h-[96px] overflow-hidden border-b border-border-default px-2 pt-4 lg:h-[320px] lg:px-0 lg:pt-12" aria-hidden>
        <Wordmark />
      </div>

      <div className="flex flex-wrap justify-between gap-x-5 gap-y-2 px-5 py-5 text-ui lg:grid lg:grid-cols-4 lg:p-0 lg:text-sm">
        {/* mobile: copyright on its own line, then the legal links and Back to top on one */}
        <p className="basis-full text-text-tertiary lg:basis-auto lg:border-r lg:border-border-default lg:px-7 lg:py-4">{footer.copyright}</p>
        {footer.legal.map((l) => (
          <Link key={l.href} href={l.href} className={`${quietLink} lg:border-r lg:border-border-default lg:px-7 lg:py-4`}>{l.label}</Link>
        ))}
        <a href={footer.backToTop.href} className={`${quietLink} ml-auto lg:ml-0 lg:px-7 lg:py-4`}>{footer.backToTop.label}</a>
      </div>
    </footer>
  );
}

/** Lucide has no brand marks; LinkedIn's "in" square, 16px, in the link colour. */
function LinkedInMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill="currentColor">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}
