"use client";

import { Button } from "@/components/ui/button";

interface VilliViewProps {
  exchanging: boolean;
  done: boolean;
  onExplore: () => void;
}

const WALL_X = 58;
const VILLI_X = [92, 120, 148];
const VILLUS_BASE_Y = 122;
const VILLUS_TIP_Y = 24;
const BLOOD_X = 192;

/** A finger-like villus: narrow base, gently tapering shaft, rounded bulbous tip. */
function villusPath(cx: number, halfWidth: number): string {
  const base = VILLUS_BASE_Y;
  const tip = VILLUS_TIP_Y;
  const h = base - tip;
  return `
    M ${cx - halfWidth} ${base}
    C ${cx - halfWidth} ${base - h * 0.55}, ${cx - halfWidth * 0.85} ${tip + h * 0.18}, ${cx - halfWidth * 0.55} ${tip + 9}
    C ${cx - halfWidth * 0.25} ${tip}, ${cx + halfWidth * 0.25} ${tip}, ${cx + halfWidth * 0.55} ${tip + 9}
    C ${cx + halfWidth * 0.85} ${tip + h * 0.18}, ${cx + halfWidth} ${base - h * 0.55}, ${cx + halfWidth} ${base}
    Z
  `;
}

/** A thin capillary loop running up into the villus core and back down. */
function villusVessel(cx: number): string {
  const base = VILLUS_BASE_Y + 4;
  const top = VILLUS_TIP_Y + 16;
  return `M ${cx - 3} ${base} C ${cx - 4} ${top + 20}, ${cx - 2} ${top}, ${cx} ${top} C ${cx + 2} ${top}, ${cx + 4} ${top + 20}, ${cx + 3} ${base}`;
}

export function VilliView({ exchanging, done, onExplore }: VilliViewProps) {
  const shifted = exchanging || done;

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
        Villi — Nutrient Absorption
      </p>

      <svg
        viewBox="0 0 230 140"
        className="mx-auto mt-3 h-40 w-full max-w-xs"
        role="img"
        aria-label="A zoomed-in view of the small intestine wall with finger-like villi absorbing nutrients into nearby blood vessels"
      >
        <defs>
          <linearGradient id="vv-villus" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#BFE8E1" />
            <stop offset="100%" stopColor="#EAFBF8" />
          </linearGradient>
        </defs>

        {/* Intestine wall */}
        <path
          d={`M ${WALL_X - 14} 6 C ${WALL_X - 2} 4, ${WALL_X - 2} 4, ${WALL_X - 14} 8 L ${WALL_X - 14} 132 C ${WALL_X - 2} 136, ${WALL_X - 2} 136, ${WALL_X - 14} 130 Z`}
          className="fill-subject-biology-soft stroke-subject-biology/50 dark:fill-subject-biology/10 dark:stroke-subject-biology/40"
          strokeWidth={1.5}
        />
        <text x={WALL_X - 8} y={138} textAnchor="middle" className="fill-ink/60 dark:fill-bone/60 font-mono text-[7px] uppercase tracking-wide">
          Wall
        </text>

        {/* Villi (finger-like projections) */}
        {VILLI_X.map((x, i) => (
          <g key={i}>
            <path d={villusPath(x, 13)} fill="url(#vv-villus)" className="stroke-subject-biology/60 dark:stroke-subject-biology/45" strokeWidth={1.5} />
            <path d={villusVessel(x)} fill="none" className="stroke-rose-400/60 dark:stroke-rose-400/40" strokeWidth={1.25} />
          </g>
        ))}
        <text x={120} y={122} textAnchor="middle" className="fill-ink/60 dark:fill-bone/60 font-mono text-[7px] uppercase tracking-wide">
          Villi
        </text>

        {/* Blood vessel */}
        <rect
          x={BLOOD_X}
          y={20}
          width={14}
          height={100}
          rx={7}
          className="fill-rose-100 stroke-rose-400/70 dark:fill-rose-900/20 dark:stroke-rose-500/50"
          strokeWidth={2}
        />
        <text x={BLOOD_X + 7} y={134} textAnchor="middle" className="fill-ink/60 dark:fill-bone/60 font-mono text-[7px] uppercase tracking-wide">
          Blood
        </text>

        {/* Nutrient particles moving from villi into blood */}
        <circle
          cx={shifted ? BLOOD_X + 7 : 118}
          cy={50}
          r={4}
          className="fill-amber-500 stroke-amber-700 dark:fill-amber-400 dark:stroke-amber-600 transition-[cx] duration-[1400ms] ease-in-out"
          strokeWidth={1}
        />
        <circle
          cx={shifted ? BLOOD_X + 7 : 118}
          cy={70}
          r={4}
          className="fill-pine-500 stroke-pine-700 dark:fill-pine-300 dark:stroke-pine-600 transition-[cx] duration-[1400ms] ease-in-out"
          strokeWidth={1}
        />
        <circle
          cx={shifted ? BLOOD_X + 7 : 118}
          cy={90}
          r={4}
          className="fill-sky-500 stroke-sky-700 dark:fill-sky-400 dark:stroke-sky-600 transition-[cx] duration-[1400ms] ease-in-out"
          strokeWidth={1}
        />
      </svg>

      <div className="mt-2 flex justify-center">
        <Button
          variant="primary"
          size="sm"
          onClick={onExplore}
          disabled={exchanging}
        >
          Explore Absorption
        </Button>
      </div>

      <p className="mt-3 min-h-[2.5rem] text-center text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
        {done
          ? "Nutrients have crossed from the villi into the blood, which carries them to the rest of the body."
          : "Villi increase the surface area of the small intestine, so more nutrients can be absorbed into the blood."}
      </p>
    </div>
  );
}
