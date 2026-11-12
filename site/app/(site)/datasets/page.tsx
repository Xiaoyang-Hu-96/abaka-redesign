import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { categories } from "@/lib/content";
import { datasetCategories } from "@/lib/nav";

export const metadata: Metadata = { title: "Datasets · Abaka AI" };

/**
 * Datasets catalog. The current site lists 21 names with no size, format, licence or sample.
 * A buyer judges a dataset by those columns, so the catalog shows them, as marked placeholders
 * until Abaka publishes the real values (principle 1: evidence sits next to the claim).
 * One primary action on the page: Request a dataset (principle 4).
 */
const columns = ["Dataset", "Size", "Format", "Licence", "From", ""];

export default function DatasetsPage() {
  return (
    <>
      <header className="flex flex-col gap-6 border-b border-border-default px-5 pb-10 pt-14 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:pb-12 lg:pt-24">
        <div className="flex flex-col gap-4">
          <p className="label">Datasets</p>
          <h1 className="display max-w-[700px]">
            Off-the-shelf datasets, <em>ready to request.</em>
          </h1>
        </div>
        <div className="flex max-w-[420px] flex-col gap-5">
          <p className="text-lead leading-lead text-text-secondary">
            {categories.reduce((n, c) => n + c.datasets.length, 0)} datasets in {categories.length} categories. Pick
            one and request it, or tell us what you need.
          </p>
          <Button href="/datasets/request" size="lg" className="self-start">Request a dataset</Button>
        </div>
      </header>

      <p className="border-b border-border-default bg-surface-raised px-5 py-3 font-mono text-mono-sm text-text-tertiary lg:px-10">
        [ bracketed ] values are placeholders. Abaka does not publish sizes, formats or prices yet.
      </p>

      <div className="flex flex-col lg:flex-row">
        <nav aria-label="Categories" className="border-b border-border-default lg:w-[310px] lg:shrink-0 lg:border-b-0 lg:border-r">
          <ul className="flex gap-1 overflow-x-auto px-5 py-3 lg:sticky lg:top-0 lg:flex-col lg:gap-0 lg:px-0 lg:py-6">
            {datasetCategories.map(({ label, href, icon: Icon }) => (
              <li key={label} className="shrink-0">
                <Link
                  href={href.replace("/datasets", "")}
                  className="flex items-center gap-3 whitespace-nowrap px-3 py-2 text-body text-text-secondary transition-colors duration-(--duration-fast) hover:bg-surface-raised hover:text-text-primary lg:px-10 lg:py-3"
                >
                  {Icon && <Icon aria-hidden className="size-4" strokeWidth={1.5} />}
                  {label}
                  <span className="font-mono text-mono-sm text-text-muted">
                    {categories.find((c) => c.label === label)?.datasets.length}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 flex-1">
          {categories.map((c) => (
            <section key={c.id} id={c.id} aria-labelledby={`${c.id}-title`} className="scroll-mt-4 border-b border-border-default last:border-b-0">
              <h2 id={`${c.id}-title`} className="border-b border-border-default px-5 py-5 text-title font-medium lg:px-8">{c.label}</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] table-fixed text-left text-sm">
                  <colgroup><col className="w-[38%]" /><col /><col /><col /><col className="w-[10%]" /><col className="w-[14%]" /></colgroup>
                  <thead>
                    <tr>
                      {columns.map((h) => (
                        <th key={h} scope="col" className="label border-b border-border-default px-5 py-3 font-normal first:lg:pl-8">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {c.datasets.map((d) => (
                      <tr key={d.name} className="group border-b border-border-default transition-colors duration-(--duration-base) last:border-b-0 hover:bg-surface-raised">
                        <th scope="row" className="px-5 py-4 text-body font-medium lg:pl-8">{d.name}</th>
                        <td className="px-5 font-mono text-text-tertiary">[ n ] items</td>
                        <td className="px-5 font-mono text-text-tertiary">[ format ]</td>
                        <td className="px-5 font-mono text-text-tertiary">[ licence ]</td>
                        <td className="px-5 font-mono text-text-tertiary">$[ n ]</td>
                        <td className="px-5 text-right lg:pr-8">
                          <Link href={`/datasets/request?dataset=${encodeURIComponent(d.name)}`} className="whitespace-nowrap font-medium hover:underline underline-offset-4">
                            Request{" "}
                            <span aria-hidden className="inline-block transition-[transform,color] duration-(--duration-base) group-hover:translate-x-1 group-hover:text-accent">→</span>
                            <span className="sr-only"> {d.name}</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
          <Link href="/datasets/request" className="hatch group flex flex-col gap-2 px-5 py-10 lg:px-8">
            <span aria-hidden className="text-title text-accent">+</span>
            <span className="text-title font-semibold">Need data we don&apos;t have yet?</span>
            <span className="text-body text-text-secondary">Tell us what your model should learn. We collect and label it to your spec.</span>
          </Link>
        </div>
      </div>
    </>
  );
}
