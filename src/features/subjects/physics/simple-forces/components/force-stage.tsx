"use client";

import { boxOffsetFraction, type ForcesPlan } from "../forces-model";
import { ForceArrow } from "./force-arrow";

const VIEW_WIDTH = 640;
const VIEW_HEIGHT = 200;
const SURFACE_Y = 140;
const BOX_SIZE = 64;
const CENTER_X = VIEW_WIDTH / 2;
const MAX_TRAVEL = 170;

const LEFT_COLOR = "#E0524F";
const RIGHT_COLOR = "#3D5AFE";

export interface ForceStageProps {
  plan: ForcesPlan;
  progress: number;
}

/**
 * Purely presentational, same pattern as Simple Motion's `MotionTrack`:
 * one flat surface and one box, position driven entirely by
 * `progress` from the parent's timer — no drag interaction, no
 * physics engine. An arrow sits on each side of the box, sized to
 * that side's force and always pointing outward, so "bigger force,
 * bigger arrow" reads at a glance.
 */
export function ForceStage({ plan, progress }: ForceStageProps) {
  const offsetFraction = boxOffsetFraction(plan, progress);
  const boxCenterX = CENTER_X + offsetFraction * MAX_TRAVEL;
  const boxY = SURFACE_Y - BOX_SIZE;

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className="h-full w-full"
      role="img"
      aria-label={`A box on a surface, pushed by ${plan.leftForce} newtons from the left and ${plan.rightForce} newtons from the right`}
    >
      {/* Surface */}
      <rect
        x={0}
        y={SURFACE_Y}
        width={VIEW_WIDTH}
        height={20}
        rx={4}
        className="fill-ink/10 dark:fill-bone/10"
      />

      {/* Box */}
      <rect
        x={boxCenterX - BOX_SIZE / 2}
        y={boxY}
        width={BOX_SIZE}
        height={BOX_SIZE}
        rx={10}
        className="fill-subject-physics"
      />

      <ForceArrow
        side="left"
        force={plan.leftForce}
        originX={boxCenterX - BOX_SIZE / 2}
        centerY={boxY + BOX_SIZE / 2}
        color={LEFT_COLOR}
      />
      <ForceArrow
        side="right"
        force={plan.rightForce}
        originX={boxCenterX + BOX_SIZE / 2}
        centerY={boxY + BOX_SIZE / 2}
        color={RIGHT_COLOR}
      />
    </svg>
  );
}
