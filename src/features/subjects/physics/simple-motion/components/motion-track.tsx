"use client";

import { useStageSize } from "@/features/simulation";

export interface MotionTrackProps {
  /** 0 to 1 — how far along the track the object is. */
  progress: number;
  /** The current target distance, shown on the finish marker. */
  distanceM: number;
}

/**
 * One straight road and one small car. Drawn in CSS pixels (viewBox = the stage frame's real size, from
 * `useStageSize`) so the Start/Finish labels stay at the 12px `text-label` size on a phone instead of
 * shrinking with the SVG; before the first measurement it falls back to a 640x200 viewBox that scales.
 * Position is driven entirely by `progress`. The text labels (not colour) say which end is which.
 */
export function MotionTrack({ progress, distanceM }: MotionTrackProps) {
  const size = useStageSize();
  const W = size.width || 640;
  const H = size.height || 200;
  const margin = 56;
  const carScale = Math.min(1, Math.max(0.6, W / 520));
  const carW = 56 * carScale;
  const trackY = H * 0.4;
  const travel = Math.max(10, W - margin * 2 - carW);
  const carX = margin + travel * Math.min(1, Math.max(0, progress));
  const carY = trackY - 28 * carScale;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      className="block h-full w-full text-subject-physics"
      role="img"
      aria-label={`A car moving along a straight track toward a finish line ${distanceM.toFixed(0)} metres away`}
    >
      <rect x={0} y={trackY} width={W} height={24} rx={4} className="fill-ink/10 dark:fill-bone/10" />
      <line
        x1={margin * 0.5}
        y1={trackY + 12}
        x2={W - margin * 0.5}
        y2={trackY + 12}
        strokeWidth={3}
        strokeDasharray="14 12"
        className="stroke-ink/25 dark:stroke-bone/25"
      />
      <line x1={margin} y1={trackY - 6} x2={margin} y2={trackY + 30} strokeWidth={2} className="stroke-ink/40 dark:stroke-bone/40" />
      <text x={margin} y={trackY + 50} textAnchor="middle" className="fill-ink-soft text-label font-mono uppercase dark:fill-bone-soft">
        Start
      </text>
      <line x1={W - margin} y1={trackY - 6} x2={W - margin} y2={trackY + 30} strokeWidth={2} className="stroke-ink/40 dark:stroke-bone/40" />
      <text x={W - margin} y={trackY + 50} textAnchor="middle" className="fill-ink-soft text-label font-mono uppercase dark:fill-bone-soft">
        Finish · {distanceM.toFixed(0)} m
      </text>

      <g transform={`translate(${carX} ${carY}) scale(${carScale})`}>
        <rect x={0} y={8} width={56} height={16} rx={6} fill="currentColor" />
        <rect x={12} y={0} width={32} height={12} rx={5} fill="currentColor" />
        <circle cx={14} cy={26} r={6} className="fill-ink dark:fill-bone" />
        <circle cx={42} cy={26} r={6} className="fill-ink dark:fill-bone" />
      </g>
    </svg>
  );
}
