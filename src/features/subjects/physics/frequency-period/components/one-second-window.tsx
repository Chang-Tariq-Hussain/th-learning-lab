"use client";

import { cn } from "@/lib/utils";
import { buildOneSecondPath } from "../wave-model";

interface OneSecondWindowProps {
  frequency: number;
  sweepProgress: number;
  highlighted: boolean;
}

const WIDTH = 720;
const HEIGHT = 100;
const AMPLITUDE = 32;
const MID_Y = HEIGHT / 2;

/** A fixed 1-second timeline showing exactly `frequency` complete cycles — the intuitive "what is a Hertz" picture. */
export function OneSecondWindow({ frequency, sweepProgress, highlighted }: OneSecondWindowProps) {
  const path = buildOneSecondPath(frequency, WIDTH, AMPLITUDE, MID_Y);
  const sweepX = sweepProgress * WIDTH;
  const cycleCount = Math.round(frequency * 10) / 10;

  return (
    <div
      className={cn(
        "rounded-card border p-4 transition-colors dark:border-line-dark",
        highlighted ? "border-pine-500 bg-pine-500/5 dark:border-pine-300" : "border-line bg-white/60 dark:bg-white/[0.03]"
      )}
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">Watch for 1 second</p>
        <p className="font-mono text-[11px] text-ink-soft dark:text-bone-soft">{cycleCount} cycles / second</p>
      </div>

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="mt-2 h-24 w-full text-subject-physics" role="img" aria-label={`${cycleCount} complete cycles in one second`}>
        <line x1={0} y1={MID_Y} x2={WIDTH} y2={MID_Y} strokeWidth={1} strokeDasharray="8 6" className="stroke-ink/15 dark:stroke-bone/15" />
        <path d={path} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
        <line x1={sweepX} y1={4} x2={sweepX} y2={HEIGHT - 4} strokeWidth={2} className="stroke-amber-500" />
        <line x1={0} y1={HEIGHT - 6} x2={0} y2={HEIGHT} strokeWidth={2} className="stroke-ink/40 dark:stroke-bone/40" />
        <line x1={WIDTH} y1={HEIGHT - 6} x2={WIDTH} y2={HEIGHT} strokeWidth={2} className="stroke-ink/40 dark:stroke-bone/40" />
        <text x={0} y={HEIGHT - 10} className="fill-ink-soft dark:fill-bone-soft font-mono text-[10px]">0 s</text>
        <text x={WIDTH} y={HEIGHT - 10} textAnchor="end" className="fill-ink-soft dark:fill-bone-soft font-mono text-[10px]">1 s</text>
      </svg>
    </div>
  );
}
