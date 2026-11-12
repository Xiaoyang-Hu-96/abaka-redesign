/**
 * The three isometric objects on the Contact page (Paper "Contact sales · 4.0"): a sample from the stack,
 * a laptop video call, a checked quote. Drawn on a 128×104 grid with token colours.
 */
const ink = "var(--color-ink)", raised = "var(--color-raised)", accent = "var(--color-accent)";
const line = { stroke: ink, strokeWidth: 1.2, strokeLinejoin: "round" as const };
const box = "h-auto w-full max-w-[112px] shrink-0";

function Dots({ id, color = "var(--color-grey-600)", r = 0.75 }: { id: string; color?: string; r?: number }) {
  return (
    <pattern id={id} width="4" height="4" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r={r} fill={color} />
    </pattern>
  );
}

/** Free sample: one tile lifted off a stack of two */
export function SampleDrawing() {
  return (
    <svg viewBox="0 0 128 104" aria-hidden className={box}>
      <defs><Dots id="offer-dots-a" /></defs>
      <polygon points="64,50 104,70 64,90 24,70" fill={raised} {...line} />
      <polygon points="24,70 64,90 64,96 24,76" fill="url(#offer-dots-a)" {...line} />
      <polygon points="64,90 104,70 104,76 64,96" fill="url(#offer-dots-a)" {...line} />
      <polygon points="24,60 64,80 64,86 24,66" fill="url(#offer-dots-a)" {...line} />
      <polygon points="64,80 104,60 104,66 64,86" fill="url(#offer-dots-a)" {...line} />
      <polygon points="64,40 104,60 64,80 24,60" fill={raised} {...line} />
      <polygon points="64,52 80,60 64,68 48,60" fill="none" {...line} strokeDasharray="3 3" />
      <line x1="64" y1="34" x2="64" y2="58" stroke={accent} strokeWidth="1.2" strokeDasharray="2 3" />
      <polygon points="48,22 64,30 64,34 48,26" fill={raised} {...line} stroke={accent} />
      <polygon points="64,30 80,22 80,26 64,34" fill={raised} {...line} stroke={accent} />
      <polygon points="64,14 80,22 64,30 48,22" fill={raised} {...line} stroke={accent} />
    </svg>
  );
}

/** 30-min call: a laptop on a video call, the researcher's tile in orange */
export function CallDrawing() {
  return (
    <svg viewBox="0 0 128 104" aria-hidden className={box}>
      <defs>
        <Dots id="offer-dots-b" />
        <Dots id="offer-dots-c" color={accent} r={0.8} />
      </defs>
      <polygon points="24,70 64,90 64,95 24,75" fill="url(#offer-dots-b)" {...line} />
      <polygon points="64,90 104,70 104,75 64,95" fill="url(#offer-dots-b)" {...line} />
      <polygon points="24,70 64,50 104,70 64,90" fill={raised} {...line} />
      <polygon points="50,74 70,64 82,70 62,80" fill="none" {...line} strokeDasharray="3 3" />
      <polygon points="64,6 67,7.5 67,51.5 64,50" fill="url(#offer-dots-b)" {...line} />
      <polygon points="24,70 64,50 64,6 24,26" fill={raised} {...line} />
      <polygon points="28,61.4 42.8,54 42.8,23.2 28,30.6" fill={raised} {...line} />
      <ellipse cx="35.4" cy="37.9" rx="3.4" ry="4" fill={raised} stroke={ink} strokeWidth="1.2" />
      <path d="M31.2,55.4 Q35.4,40 39.6,51.2" fill={raised} stroke={ink} strokeWidth="1.2" />
      <polygon points="45.2,52.8 60,45.4 60,14.6 45.2,22" fill="url(#offer-dots-c)" {...line} stroke={accent} />
      <ellipse cx="52.6" cy="29.3" rx="3.4" ry="4" fill={raised} stroke={accent} strokeWidth="1.2" />
      <path d="M48.4,46.8 Q52.6,31.4 56.8,42.6" fill={raised} stroke={accent} strokeWidth="1.2" />
      <circle cx="44" cy="18.6" r="1.1" fill={ink} />
    </svg>
  );
}

/** Custom quote: a sheet with a few lines and an orange tick */
export function QuoteDrawing() {
  return (
    <svg viewBox="0 0 128 104" aria-hidden className={box}>
      <defs><Dots id="offer-dots-d" /></defs>
      <polygon points="20,66 64,88 116,62 72,40" fill="none" {...line} strokeDasharray="3 3" />
      <polygon points="26,58 66,38 106,58 66,78" fill="url(#offer-dots-d)" {...line} />
      <polygon points="26,50 66,30 106,50 66,70" fill={raised} {...line} />
      <line x1="40" y1="51" x2="66" y2="38" stroke={ink} strokeWidth="1.2" />
      <line x1="46" y1="54" x2="72" y2="41" stroke={ink} strokeWidth="1.2" />
      <line x1="52" y1="57" x2="68" y2="49" stroke={ink} strokeWidth="1.2" />
      <polyline points="74,56 80,60 92,50" fill="none" stroke={accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
