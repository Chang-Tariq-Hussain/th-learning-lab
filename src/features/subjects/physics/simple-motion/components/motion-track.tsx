"use client";

const VIEW_WIDTH = 640;
const VIEW_HEIGHT = 200;
const TRACK_Y = 140;
const TRACK_MARGIN = 40;
const CAR_WIDTH = 56;
const CAR_HEIGHT = 28;

export interface MotionTrackProps {
  /** 0 to 1 — how far along the track the object is. */
  progress: number;
  /** The current target distance, shown on the finish marker. */
  distanceM: number;
}

/**
 * Purely presentational: one straight road and one small car, in the
 * same flat-icon / currentColor style as the other Physics
 * visualizations. No drag interaction — position is driven entirely
 * by `progress` from the parent's timer. The track always represents
 * "Start" to the current target Distance, so the finish label updates
 * as the student adjusts the Distance slider.
 */
export function MotionTrack({ progress, distanceM }: MotionTrackProps) {
  const travel = VIEW_WIDTH - TRACK_MARGIN * 2 - CAR_WIDTH;
  const carX = TRACK_MARGIN + travel * Math.min(1, Math.max(0, progress));
  const carY = TRACK_Y - CAR_HEIGHT;

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className="h-full w-full text-subject-physics"
      role="img"
      aria-label="A car moving along a straight track"
    >
      {/* Road */}
      <rect
        x={0}
        y={TRACK_Y}
        width={VIEW_WIDTH}
        height={24}
        rx={4}
        className="fill-ink/10 dark:fill-bone/10"
      />
      {/* Dashed center line */}
      <line
        x1={TRACK_MARGIN * 0.5}
        y1={TRACK_Y + 12}
        x2={VIEW_WIDTH - TRACK_MARGIN * 0.5}
        y2={TRACK_Y + 12}
        strokeWidth={3}
        strokeDasharray="14 12"
        className="stroke-ink/25 dark:stroke-bone/25"
      />
      {/* Start flag */}
      <line
        x1={TRACK_MARGIN}
        y1={TRACK_Y - 6}
        x2={TRACK_MARGIN}
        y2={TRACK_Y + 30}
        strokeWidth={2}
        className="stroke-ink/20 dark:stroke-bone/20"
      />
      <text
        x={TRACK_MARGIN}
        y={TRACK_Y - 12}
        textAnchor="middle"
        className="fill-ink-soft dark:fill-bone-soft text-[11px] font-mono uppercase tracking-wide"
      >
        Start
      </text>
      {/* Finish flag */}
      <line
        x1={VIEW_WIDTH - TRACK_MARGIN}
        y1={TRACK_Y - 6}
        x2={VIEW_WIDTH - TRACK_MARGIN}
        y2={TRACK_Y + 30}
        strokeWidth={2}
        className="stroke-ink/20 dark:stroke-bone/20"
      />
      <text
        x={VIEW_WIDTH - TRACK_MARGIN}
        y={TRACK_Y - 12}
        textAnchor="middle"
        className="fill-ink-soft dark:fill-bone-soft text-[11px] font-mono uppercase tracking-wide"
      >
        Finish · {distanceM.toFixed(0)}m
      </text>

      {/* Car */}
      <g
        transform={`translate(${carX} ${carY})`}
        className="transition-transform duration-150 ease-linear"
      >
        <rect
          x={0}
          y={8}
          width={CAR_WIDTH}
          height={16}
          rx={6}
          fill="currentColor"
        />
        <rect
          x={12}
          y={0}
          width={CAR_WIDTH - 24}
          height={12}
          rx={5}
          fill="currentColor"
        />
        <circle cx={14} cy={26} r={6} className="fill-ink dark:fill-bone" />
        <circle
          cx={CAR_WIDTH - 14}
          cy={26}
          r={6}
          className="fill-ink dark:fill-bone"
        />
      </g>
    </svg>
  );
}
