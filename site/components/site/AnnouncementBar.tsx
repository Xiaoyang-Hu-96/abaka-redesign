import Link from "next/link";
import { announcement } from "@/lib/content";

/** One announcement at a time. Ink bar, the tag is the only orange. */
export function AnnouncementBar() {
  return (
    /* inset 12px inside the column (Home · 4.0) */
    <div className="p-3">
    <div className="bg-surface-inverse px-4 py-2.5 text-center text-ui leading-ui text-text-inverse lg:py-0 lg:leading-10 lg:text-sm">
      <span className="mr-3 inline-block bg-accent-29 px-2 py-0.5 font-mono text-label uppercase leading-label tracking-mono-loose text-accent align-middle">
        {announcement.tag}
      </span>
      <span className="align-middle">{announcement.text}</span>{" "}
      <Link
        href={announcement.link.href}
        className="group whitespace-nowrap font-medium text-raised underline underline-offset-4 align-middle lg:ml-1.5"
      >
        {announcement.link.label}{" "}
        <span aria-hidden className="inline-block transition-[translate,color] duration-(--duration-base) group-hover:translate-x-1 group-hover:text-accent">
          →
        </span>
      </Link>
    </div>
    </div>
  );
}
