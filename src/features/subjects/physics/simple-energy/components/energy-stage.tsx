"use client";

import { currentHeightFraction, type EnergyPlan } from "../energy-model";

const VIEW_WIDTH = 640;
const VIEW_HEIGHT = 240;
const GROUND_Y = 190;
const RAMP_TOP = { x: 70, y: 30 };
const RAMP_BOTTOM = { x: 580, y: GROUND_Y };
const BALL_RADIUS = 16;

export interface EnergyStageProps {
  plan: EnergyPlan;
  progress: number;
}

/**
 * Purely presentational, same pattern as the other Simple visualizations'
 * stages: one fixed hill, one ball, position driven entirely by
 * `progress` from the parent's timer. The ball sits on the slope at
 * whatever point matches the current height fraction — at progress 0
 * that's wherever the Height slider says to start; by progress 1 it's
 * always at the bottom, regardless of the starting height.
 */
export function EnergyStage({ plan, progress }: EnergyStageProps) {
  const heightFrac = currentHeightFraction(plan, progress);
  // Distance fraction along the ramp: 0 at the top (tallest possible point), 1 at the bottom.
  const s = 1 - heightFrac;
  const ballX = RAMP_TOP.x + (RAMP_BOTTOM.x - RAMP_TOP.x) * s;
  const ballY = RAMP_TOP.y + (RAMP_BOTTOM.y - RAMP_TOP.y) * s - BALL_RADIUS;

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className="h-full w-full"
      role="img"
      aria-label="A ball on a hill, rolling down as it is released"
    >
      {/* Ground */}
      <rect
        x={0}
        y={GROUND_Y}
        width={VIEW_WIDTH}
        height={20}
        rx={4}
        className="fill-ink/10 dark:fill-bone/10"
      />

      {/* Hill */}
      <polygon
        points={`${RAMP_TOP.x},${RAMP_TOP.y} ${RAMP_BOTTOM.x},${RAMP_BOTTOM.y} ${RAMP_TOP.x},${RAMP_BOTTOM.y}`}
        className="fill-subject-physics-soft dark:fill-subject-physics/10"
      />
      <line
        x1={RAMP_TOP.x}
        y1={RAMP_TOP.y}
        x2={RAMP_BOTTOM.x}
        y2={RAMP_BOTTOM.y}
        strokeWidth={3}
        className="stroke-ink/25 dark:stroke-bone/25"
      />

      {/* Ball */}
      <circle
        cx={ballX}
        cy={ballY}
        r={BALL_RADIUS}
        className="fill-subject-physics"
      />
    </svg>
  );
}
