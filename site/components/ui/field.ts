/**
 * Text field classes, shared by the contact form and the /system page so both show the same states.
 * v4 text field: hover darkens the border, focus is an ink border with a 3px halo, error is an accent border.
 */
export const field =
  "w-full border bg-surface-page px-3.5 text-body leading-ui transition-[border-color,box-shadow] duration-(--duration-fast) ease-out " +
  "focus-visible:border-border-strong focus-visible:shadow-[0_0_0_3px_var(--color-focus-halo)]";
export const ok = "border-grey-300 hover:border-border-hover";
export const bad = "border-accent";
/** option chips (the contact form's needs): off is a hairline that tints on hover, on is filled ink */
export const chipOff = "border-grey-300 text-text-secondary hover:bg-surface-hover hover:text-text-primary";
export const chipOn = "border-ink bg-surface-inverse text-text-inverse";
