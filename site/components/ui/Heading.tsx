import { Fragment } from "react";
import type { Heading } from "@/lib/content";

/**
 * Renders a copy Heading: the `em` part is the one orange emphasis (styled by `.display em`).
 * A `\n` in `before` becomes a line break, where the design breaks the line.
 */
export function HeadingText({ h }: { h: Heading }) {
  const lines = (h.before ?? "").split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {/* the space keeps the accessible name readable ("datasets, ready"), the break is only visual */}
          {i > 0 && <>{" "}<br /></>}
          {line}
        </Fragment>
      ))}
      <em>{h.em}</em>
      {h.after}
    </>
  );
}
