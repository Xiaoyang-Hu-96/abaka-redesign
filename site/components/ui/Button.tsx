import Link from "next/link";
import type { ComponentProps } from "react";

/**
 * Buttons. Square corners. One primary per view (principle 4).
 * States follow "Design system · interaction states v4":
 *  - primary:   hover keeps the orange and adds a white top sheen; pressed shrinks to 99%.
 *  - secondary: hover fills ink and inverts the text; pressed goes black and sinks 1px.
 */
type Variant = "primary" | "secondary";

const base =
  "inline-flex h-10 items-center justify-center gap-2 px-4 text-sm font-medium whitespace-nowrap " +
  "transition-[background-color,background-image,color,border-color,translate,scale] duration-(--duration-fast) ease-out " +
  "aria-disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-action-primary-bg text-action-primary-fg " +
    "hover:bg-[linear-gradient(180deg,var(--color-action-primary-sheen),transparent)] " +
    "active:scale-[0.99] active:duration-(--duration-press) " +
    "aria-disabled:bg-action-disabled-bg aria-disabled:text-action-disabled-fg",
  secondary:
    "border border-action-secondary-border text-text-primary " +
    "hover:bg-action-secondary-hover-bg hover:text-text-inverse " +
    "active:translate-y-px active:bg-action-secondary-pressed-bg active:border-action-secondary-pressed-bg " +
    "aria-disabled:border-grey-300 aria-disabled:text-text-muted",
};

type Props = ComponentProps<typeof Link> & { variant?: Variant; size?: "md" | "lg" };

export function Button({ variant = "primary", size = "md", className = "", ...props }: Props) {
  const sizing = size === "lg" ? "h-12 text-body" : "";
  return <Link className={`${base} ${variants[variant]} ${sizing} ${className}`} {...props} />;
}

/**
 * "Explore →" style link, per the "Text link" row of the interaction states sheet.
 *  - default: ink, arrow 6px after the text;
 *  - hover:   text and arrow turn orange (link hover v5: colour only, no underline), the arrow moves 4px;
 *  - pressed: ink-72 (visited does not change it);
 *  - focus:   2px ink ring hugging the text, 4px away;
 *  - disabled (aria-disabled): ink-40, nothing moves.
 */
export function TextLink({
  children,
  className = "",
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      className={
        "group inline-flex w-fit items-center gap-1.5 text-sm font-medium text-text-primary transition-colors duration-(--duration-fast) ease-out hover:text-accent active:text-accent " +
        "focus-visible:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring " +
        `aria-disabled:pointer-events-none aria-disabled:text-text-muted ${className}`
      }
      {...props}
    >
      <span>{children}</span>
      <svg
        aria-hidden
        width="14"
        height="14"
        viewBox="0 0 14 14"
        className="shrink-0 transition-[translate,color] duration-(--duration-base) ease-out group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0 group-aria-disabled:translate-x-0 group-aria-disabled:text-text-muted"
      >
        <path d="M1.5 7h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
        <path d="M8 3.25 12.5 7 8 10.75Z" fill="currentColor" />
      </svg>
    </Link>
  );
}
