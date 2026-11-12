import { physicalAiPage } from "@/lib/content";

/**
 * The three drawings above the Physical AI layer cards (Paper "Physical AI · 4.0 v2"): a stack of first-person
 * frames with hand keypoints, a gripper boxed on a grasp, and a floor plan with labelled rooms. Each is one SVG on
 * the board's 370×240 panel, aria-hidden, in token colours.
 */
const d = physicalAiPage.layers.drawings;
const micro = "font-mono text-micro uppercase leading-micro tracking-mono-loose";

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <svg aria-hidden viewBox="0 0 370 240" className="block h-auto w-full border-b border-border-default bg-grey-100">
      {children}
    </svg>
  );
}

export function HumanDrawing() {
  return (
    <Panel>
      <rect x={84} y={56} width={180} height={120} className="fill-grey-200 stroke-grey-300" />
      <rect x={72} y={68} width={180} height={120} className="fill-grey-200 stroke-grey-300" />
      <rect x={60} y={80} width={180} height={120} className="fill-surface-raised stroke-grey-400" />
      <path d="M110 200 V180 A40 40 0 0 1 190 180 V200 Z" className="fill-grey-300" />
      {[[121, 123], [145, 113], [169, 119], [189, 135]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r={3} className="fill-accent" />
      ))}
      <text x={68} y={97} className={`${micro} fill-text-tertiary`}>{d.human[0].toUpperCase()}</text>
      <text x={68} y={193} className={`${micro} fill-text-accent`}>{d.human[1].toUpperCase()}</text>
    </Panel>
  );
}

export function RobotDrawing() {
  return (
    <Panel>
      <rect x={0} y={190} width={370} height={50} className="fill-grey-200" />
      <line x1={0} y1={190} x2={370} y2={190} className="stroke-grey-300" />
      <rect x={130} y={40} width={100} height={40} className="fill-grey-400" />
      <rect x={170} y={20} width={20} height={24} className="fill-grey-500" />
      <rect x={136} y={80} width={16} height={80} className="fill-grey-500" />
      <rect x={208} y={80} width={16} height={80} className="fill-grey-500" />
      <rect x={156} y={128} width={48} height={62} className="fill-grey-300 stroke-grey-400" />
      <rect x={146} y={118} width={68} height={80} strokeWidth={1.5} className="fill-none stroke-accent" />
      <rect x={146} y={102} width={d.robot[0].length * 6.8 + 10} height={16} className="fill-accent" />
      <text x={151} y={114} className={`${micro} fill-text-on-accent`}>{d.robot[0].toUpperCase()}</text>
      <text x={250} y={70} className={`${micro} fill-text-tertiary`}>{d.robot[1].toUpperCase()}</text>
      <text x={250} y={82} className={`${micro} fill-text-tertiary`}>{d.robot[2].toUpperCase()}</text>
    </Panel>
  );
}

export function WorldDrawing() {
  return (
    <Panel>
      <rect x={56} y={40} width={260} height={160} className="fill-surface-raised stroke-grey-500" />
      <rect x={56.5} y={40.5} width={149.5} height={95.5} className="fill-surface-hover" />
      <path d="M56 136 H206 V40 M206 100 V200" className="fill-none stroke-grey-400" />
      <rect x={84} y={64} width={40} height={22} className="fill-grey-300" />
      <rect x={228} y={130} width={60} height={36} className="fill-grey-300" />
      <circle cx={110} cy={164} r={14} className="fill-grey-300" />
      <text x={64} y={55} className={`${micro} fill-text-accent`}>{d.world[0].toUpperCase()}</text>
      <text x={214} y={115} className={`${micro} fill-text-tertiary`}>{d.world[1].toUpperCase()}</text>
      <text x={64} y={193} className={`${micro} fill-text-tertiary`}>{d.world[2].toUpperCase()}</text>
    </Panel>
  );
}
