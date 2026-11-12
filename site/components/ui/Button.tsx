import Link from "next/link";
import type { ComponentProps } from "react";

/**
 * Buttons. Square corners. One primary per view (principle 4).
 * States follow "Design system · interaction states v3":
 *  - primary:   hover keeps the orange and adds a white top sheen; pressed shrinks to 99%.
 *  - secondary: hover fills ink and inverts the text; pressed goes black and sinks 1px.
 */
type Variant = "primary" | "secondary";

const base =
  "inline-flex h-10 items-center justify-center gap-2 px-4 text-sm font-medium whitespace-nowrap " +
  "transition-[background-color,background-image,color,border-color,transform] duration-(--duration-fast) ease-out " +
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

/** "Explore →" style link. Hover: underline, arrow moves 4px and turns orange. */
export function TextLink({
  children,
  className = "",
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      className={`group inline-flex items-center gap-1.5 text-sm font-medium text-text-primary hover:underline underline-offset-4 ${className}`}
      {...props}
    >
      {children}
      <span
        aria-hidden
        className="transition-[transform,color] duration-(--duration-base) ease-out group-hover:translate-x-1 group-hover:text-accent"
      >
        →
      </span>
    </Link>
  );
}
