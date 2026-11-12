import Link from "next/link";

/** One announcement at a time. Ink bar, the tag is the only orange. */
export function AnnouncementBar() {
  return (
    <div className="bg-surface-inverse px-4 py-2.5 text-center text-[13px] leading-[18px] text-text-inverse lg:py-0 lg:leading-10 lg:text-sm">
      <span className="mr-2.5 inline-block bg-accent-29 px-2 font-mono text-mono-sm uppercase leading-4 tracking-[0.14em] text-accent align-middle">
        Project Reborn
      </span>
      <span className="align-middle">Your old codebase can still earn, up to $1M.</span>{" "}
      <Link
        href="/sell-your-data"
        className="group whitespace-nowrap font-medium text-raised underline underline-offset-4 align-middle lg:ml-1.5"
      >
        Get a free valuation{" "}
        <span aria-hidden className="inline-block transition-[transform,color] duration-(--duration-base) group-hover:translate-x-1 group-hover:text-accent">
          →
        </span>
      </Link>
    </div>
  );
}
