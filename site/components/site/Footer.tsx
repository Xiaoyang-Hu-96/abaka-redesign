import Link from "next/link";
import { Illustration } from "@/components/ui/Illustration";
import { Logo } from "@/components/ui/Logo";
import { nav } from "@/lib/nav";
import { NewsletterField } from "./NewsletterField";

/** Footer columns are derived from the same nav data as the header, so the two never list different products. */
const columns = [
  { label: "Datasets", links: [{ label: "All datasets", href: "/datasets" }, { label: "Request a dataset", href: "/datasets/request" }] },
  { label: "Services", links: nav[1].links! },
  { label: "Platform", links: [{ label: "Abaka Forge", href: "/platform" }, { label: "Try Forge", href: "/platform/try" }] },
  { label: "Solutions", links: nav[3].links! },
  { label: "Company", links: nav[4].groups!.flatMap((g) => g.links).filter((l) => !["News", "Events", "Talk to an expert"].includes(l.label)) },
];

export function Footer() {
  return (
    <footer className="border-t border-border-default">
      <div className="flex flex-col border-b border-border-default lg:flex-row">
        <div className="flex flex-col gap-4 border-b border-border-default px-5 py-8 lg:w-1/2 lg:border-b-0 lg:border-r lg:px-10 lg:py-10">
          <Logo />
          <p className="text-[18px] leading-[26px]">A data company for AI teams.</p>
        </div>
        <div className="flex flex-col lg:w-1/2">
          <div className="flex flex-1 flex-col lg:flex-row">
            <div className="flex flex-col gap-3 border-b border-border-default px-5 py-6 lg:w-1/2 lg:border-b-0 lg:border-r lg:px-7 lg:py-8">
              <p className="label">Contact</p>
              <a href="mailto:business@abaka.ai" className="text-body font-medium hover:underline underline-offset-4">business@abaka.ai</a>
              <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">Talk to an expert →</Link>
            </div>
            <div className="flex flex-col gap-3 border-b border-border-default px-5 py-6 lg:w-1/2 lg:border-b-0 lg:px-7 lg:py-8">
              <p className="label">Newsletter</p>
              <p className="text-sm leading-sm text-text-secondary">Abaka&apos;s latest updates and industry trends.</p>
              <NewsletterField />
            </div>
          </div>
          <div className="flex border-border-default lg:border-t">
            <a href="#" title="Placeholder link" className="flex-1 border-r border-border-default px-5 py-4 text-sm text-text-secondary transition-colors hover:text-accent lg:px-7">LinkedIn</a>
            <a href="#" title="Placeholder link" className="flex-1 px-5 py-4 text-sm text-text-secondary transition-colors hover:text-accent lg:px-7">X (Twitter)</a>
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
                  <Link href={l.href} className="block px-5 py-2 text-sm text-text-secondary transition-colors duration-(--duration-fast) hover:text-accent lg:border-b lg:border-border-default lg:px-7 lg:py-3.5">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="h-[96px] overflow-hidden border-b border-border-default px-2 pt-6 lg:h-[320px] lg:px-0 lg:pt-16" aria-hidden>
        <Illustration name="wordmark" />
      </div>

      <div className="flex flex-wrap justify-between gap-x-5 gap-y-2 px-5 py-5 text-[13px] lg:grid lg:grid-cols-4 lg:p-0 lg:text-sm">
        <p className="text-text-tertiary lg:border-r lg:border-border-default lg:px-7 lg:py-4">© 2026 Abaka AI</p>
        <Link href="/privacy" className="text-text-secondary hover:text-accent lg:border-r lg:border-border-default lg:px-7 lg:py-4">Privacy Policy</Link>
        <Link href="/terms" className="text-text-secondary hover:text-accent lg:border-r lg:border-border-default lg:px-7 lg:py-4">Terms of Service</Link>
        <a href="#main" className="text-text-secondary hover:text-accent lg:px-7 lg:py-4">Back to top ↑</a>
      </div>
    </footer>
  );
}
