import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TemplatePage } from "@/components/page/TemplatePage";
import { TextLink } from "@/components/ui/Button";
import { HeadingText } from "@/components/ui/Heading";
import { comingSoon as copy, templatePages } from "@/lib/content";
import { templateRoutes, unbuiltRoutes } from "@/lib/routes";

/**
 * Every linked page without a route of its own. A page with an entry in `templatePages` renders the shared
 * template; any other linked page renders Coming soon (lib/routes.ts); anything else is a real 404.
 */
export const dynamicParams = false;
export function generateStaticParams() {
  return [...templateRoutes, ...unbuiltRoutes].map((p) => ({ slug: p.slice(1).split("/") }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const path = `/${(await params).slug.join("/")}`;
  return { title: templatePages[path]?.metaTitle ?? copy.metaTitle };
}

export default async function ComingSoonPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const path = `/${(await params).slug.join("/")}`;
  const page = templatePages[path];
  if (page) return <TemplatePage path={path} page={page} />;
  if (!unbuiltRoutes.includes(path)) notFound();

  return (
    <section aria-labelledby="coming-soon" className="flex flex-col gap-6 border-b border-border-default px-5 pb-20 pt-14 lg:px-10 lg:pb-32 lg:pt-24">
      <p className="label normal-case">{path}</p>
      <h1 id="coming-soon" className="display max-w-[760px]">
        <HeadingText h={copy.title} />
      </h1>
      <p className="max-w-[560px] text-lead leading-lead text-text-secondary">{copy.body}</p>
      <div className="flex flex-col gap-2.5 pt-2 lg:flex-row lg:gap-7">
        {copy.links.map((l) => (
          <TextLink key={l.href} href={l.href}>{l.label}</TextLink>
        ))}
      </div>
    </section>
  );
}
