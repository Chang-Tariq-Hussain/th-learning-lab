"use client";

import { cn } from "@/lib/utils";
import { cycleClockPoint } from "../wave-model";

interface CycleRingProps {
  phase: number;
  size?: number;
}

const RADIUS = 34;
const LABELS: { angle: number; text: string }[] = [
  { angle: 0, text: "Start" },
  { angle: Math.PI / 2, text: "Up" },
  { angle: (3 * Math.PI) / 2, text: "Down" },
];

/**
 * A small rotating phasor ("cycle clock") — one full turn of the dot
 * equals one complete oscillation of the reference particle, making
 * "one complete cycle" (start → up → down → back to start) visible
 * as a repeating loop rather than just a number.
 */
export function CycleRing({ phase, size = 96 }: CycleRingProps) {
  const dot = cycleClockPoint(phase, RADIUS);
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-24 w-24 shrink-0 text-subject-physics" role="presentation">
      <circle cx={cx} cy={cy} r={RADIUS} fill="none" strokeWidth={1.5} className="stroke-ink/15 dark:stroke-bone/15" />

      {LABELS.map((label) => {
        const lx = cx + (RADIUS + 14) * Math.sin(label.angle);
        const ly = cy - (RADIUS + 14) * Math.cos(label.angle);
        return (
          <text
            key={label.text}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-ink-soft dark:fill-bone-soft font-mono text-[8px] uppercase tracking-wide"
          >
            {label.text}
          </text>
        );
      })}

      <line x1={cx} y1={cy} x2={cx + dot.x} y2={cy + dot.y} strokeWidth={1.5} className="stroke-ink/30 dark:stroke-bone/30" />
      <circle cx={cx + dot.x} cy={cy + dot.y} r={5} className={cn("fill-subject-physics")} />
    </svg>
  );
}
