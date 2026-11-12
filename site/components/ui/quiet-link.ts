/**
 * Quiet links (Paper "Design system · link hover v5"): links that sit in lists and menus. Ink-72 at rest; on hover
 * the text turns accent, colour only (fast). No underline, no tint. Pressed keeps the accent and adds no movement.
 * Visited changes nothing. Focus-visible is the global 2px ink ring with a 2px canvas gap.
 * TextLinks follow the same colour rule, but rest at ink and medium weight; nav panel items keep the v4 tint.
 *
 * Put `quietLink` on the link (it is also the `group` for its arrow) and `quietArrow` on an arrow or chevron.
 */
export const quietLink =
  "group text-text-secondary transition-colors duration-(--duration-fast) ease-out hover:text-accent active:text-accent";

/** The link's arrow or chevron: turns accent with the text; `nudge` moves an arrow 4px (base). Reduced motion: colour only. */
export const quietArrow = (nudge = true) =>
  "transition-[translate,color] duration-(--duration-base) ease-out group-hover:text-accent group-active:text-accent " +
  (nudge ? "group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" : "");
