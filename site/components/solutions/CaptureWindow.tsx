import { Camera, Fingerprint, Hand, Layers } from "lucide-react";
import { physicalAiPage } from "@/lib/content";

/**
 * The Physical AI hero window (Paper "Physical AI · 4.0 v2"): one capture with its signals, a labelled frame and
 * a timeline. A drawing, not a player, so it is aria-hidden. The frame is one SVG on the board's 1030×420 grid, so
 * every coordinate stays inside the drawing and it scales down on phones; colours are token utilities.
 */
const c = physicalAiPage.capture;
const signalIcons = [Camera, Layers, Hand, Fingerprint];
const micro = "font-mono text-micro uppercase leading-micro tracking-mono-loose";

/** a mono label on an orange tab, as the annotation boxes carry; width follows the text (≈6.8 units per character) */
function Tag({ x, y, text }: { x: number; y: number; text: string }) {
  const w = text.length * 6.8 + 12;
  return (
    <g>
      <rect x={x} y={y} width={w} height={18} className="fill-accent" />
      <text x={x + 6} y={y + 13} className={`${micro} fill-text-on-accent`}>{text.toUpperCase()}</text>
    </g>
  );
}

/** a forearm with a rounded top, w × h, hung from its top-left corner and turned by `turn` degrees */
const arm = (x: number, y: number, w: number, h: number, turn: number) => (
  <path d={`M0 ${h} V70 A70 70 0 0 1 70 0 H${w - 70} A70 70 0 0 1 ${w} 70 V${h} Z`} transform={`translate(${x} ${y}) rotate(${turn})`} className="fill-grey-400" />
);

export function CaptureWindow() {
  return (
    <div aria-hidden className="flex w-full flex-col overflow-clip rounded-window border border-border-default bg-surface-raised shadow-window">
      <div className="flex h-10 shrink-0 items-center justify-between gap-4 border-b border-border-default px-4">
        <span className={`${micro} truncate text-text-tertiary`}>{c.title}</span>
        <span className="hidden items-center gap-4.5 sm:flex">
          {c.signals.map((s, i) => {
            const Icon = signalIcons[i];
            return (
              <span key={s} className={`flex items-center gap-1.5 ${micro} ${i === 0 ? "text-text-primary" : "text-text-tertiary"}`}>
                <Icon className={`size-3.5 ${i === 0 ? "text-ink" : "text-ink-56"}`} strokeWidth={1.8} />
                {s}
              </span>
            );
          })}
        </span>
      </div>

      <svg viewBox="0 0 1030 420" className="block h-auto w-full bg-grey-100">
        <defs>
          <linearGradient id="capture-depth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: "var(--color-grey-200)" }} />
            <stop offset="0.6" style={{ stopColor: "var(--color-grey-500)" }} />
            <stop offset="1" style={{ stopColor: "var(--color-grey-700)" }} />
          </linearGradient>
        </defs>
        {/* kitchen: counter top, two cabinets, the bowl, the board */}
        <rect x={0} y={250} width={1030} height={170} className="fill-grey-200" />
        <line x1={0} y1={250} x2={1030} y2={250} className="stroke-grey-300" />
        <rect x={120} y={60} width={220} height={150} className="fill-grey-100 stroke-grey-300" />
        <rect x={360} y={60} width={220} height={150} className="fill-grey-100 stroke-grey-300" />
        <path d="M620 196 H800 A70 70 0 0 1 730 266 H690 A70 70 0 0 1 620 196 Z" className="fill-grey-300 stroke-grey-400" />
        <rect x={300} y={270} width={240} height={60} className="fill-grey-300 stroke-grey-400" />
        {arm(250, 300, 150, 200, 18)}
        {arm(770, 300, 150, 220, -14)}
        {/* what a person labelled: the pinching hand and the target bowl, with keypoints */}
        <rect x={228} y={262} width={190} height={150} strokeWidth={1.5} className="fill-accent-29 stroke-accent" />
        <Tag x={228} y={240} text={c.boxes[0]} />
        <rect x={606} y={182} width={300} height={150} strokeWidth={1.5} className="fill-none stroke-accent" />
        <Tag x={606} y={160} text={c.boxes[1]} />
        {[[262, 340], [296, 328], [330, 336], [810, 300], [844, 290], [878, 298]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={4} className="fill-accent" />
        ))}
        {/* depth inset */}
        <rect x={810} y={20} width={200} height={124} className="fill-surface-raised stroke-border-default" />
        <text x={818} y={37} className={`${micro} fill-text-tertiary`}>{c.depth.toUpperCase()}</text>
        <rect x={810.5} y={45} width={199} height={98.5} fill="url(#capture-depth)" />
        <line x1={810} y1={45} x2={1010} y2={45} className="stroke-border-default" />
      </svg>

      <div className="flex h-11 shrink-0 items-center gap-4 border-t border-border-default px-4">
        <span className="font-mono text-micro leading-micro text-text-tertiary">{c.start}</span>
        <span className="relative h-0.5 flex-1 bg-grey-200">
          <span className="absolute inset-y-0 left-0 w-[30%] bg-accent" />
          <span className="absolute -top-0.75 left-[44%] h-2 w-[14%] border border-accent-66 bg-accent-29" />
        </span>
        <span className="font-mono text-micro leading-micro text-text-tertiary">{c.end}</span>
        <span className={`${micro} hidden text-text-secondary md:inline`}>{c.segment}</span>
      </div>
    </div>
  );
}
