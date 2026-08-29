"use client";

import { cn } from "@/lib/utils";
import { GRID_MAX, GRID_MIN, ORIGIN_PX, VIEW_SIZE, worldToPixelX, worldToPixelY } from "../../coordinate-plane-explorer/coordinate-model";
import { evaluateLine, formatEquation, lineEndpoints } from "../model";

interface LinePlaneProps {
  m: number;
  b: number;
  /** When false, the line is drawn faint/dashed without a label — used by Match mode so the target isn't given away. */
  revealEquation?: boolean;
  /** An optional faint target line to match against (Match mode). */
  targetM?: number;
  targetB?: number;
}

const AXIS_TICKS = Array.from({ length: GRID_MAX - GRID_MIN + 1 }, (_, i) => GRID_MIN + i);
const LABELED_TICKS = AXIS_TICKS.filter((n) => n !== 0 && n % 2 === 0);

/**
 * A static (non-draggable) coordinate plane showing the line
 * y = mx + b, updating live as the slope/intercept sliders change.
 * Reuses the same grid, axis, and pixel-mapping conventions as every
 * other Coordinate Geometry simulation in this batch, via the shared
 * `coordinate-model` helpers.
 */
export function LinePlane({ m, b, revealEquation = true, targetM, targetB }: LinePlaneProps) {
  const [p1, p2] = lineEndpoints(m, b);
  const x1 = worldToPixelX(p1.x);
  const y1 = worldToPixelY(p1.y);
  const x2 = worldToPixelX(p2.x);
  const y2 = worldToPixelY(p2.y);

  const interceptY = evaluateLine(m, b, 0);
  const showIntercept = interceptY >= GRID_MIN && interceptY <= GRID_MAX;
  const interceptPx = worldToPixelX(0);
  const interceptPy = worldToPixelY(interceptY);

  const hasTarget = targetM !== undefined && targetB !== undefined;
  const targetPoints = hasTarget ? lineEndpoints(targetM!, targetB!) : null;

  return (
    <svg
      viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
      className="h-full w-full text-subject-math"
      role="img"
      aria-label={`A coordinate plane showing the line ${formatEquation(m, b)}`}
    >
      {/* Grid lines */}
      <g>
        {AXIS_TICKS.map((n) => (
          <line
            key={`v-${n}`}
            x1={worldToPixelX(n)}
            y1={0}
            x2={worldToPixelX(n)}
            y2={VIEW_SIZE}
            strokeWidth={n % 5 === 0 ? 1 : 0.5}
            className={n % 5 === 0 ? "stroke-ink/15 dark:stroke-bone/15" : "stroke-ink/[0.06] dark:stroke-bone/[0.08]"}
          />
        ))}
        {AXIS_TICKS.map((n) => (
          <line
            key={`h-${n}`}
            x1={0}
            y1={worldToPixelY(n)}
            x2={VIEW_SIZE}
            y2={worldToPixelY(n)}
            strokeWidth={n % 5 === 0 ? 1 : 0.5}
            className={n % 5 === 0 ? "stroke-ink/15 dark:stroke-bone/15" : "stroke-ink/[0.06] dark:stroke-bone/[0.08]"}
          />
        ))}
      </g>

      {/* Axis tick labels */}
      <g className="pointer-events-none fill-ink-soft dark:fill-bone-soft font-mono text-[9px]">
        {LABELED_TICKS.map((n) => (
          <text key={`xt-${n}`} x={worldToPixelX(n)} y={ORIGIN_PX + 13} textAnchor="middle">
            {n}
          </text>
        ))}
        {LABELED_TICKS.map((n) => (
          <text key={`yt-${n}`} x={ORIGIN_PX - 7} y={worldToPixelY(n) + 3} textAnchor="end">
            {n}
          </text>
        ))}
      </g>

      {/* Axes */}
      <g className="pointer-events-none stroke-ink/50 dark:stroke-bone/50" strokeWidth={1.5}>
        <line x1={0} y1={ORIGIN_PX} x2={VIEW_SIZE} y2={ORIGIN_PX} />
        <line x1={ORIGIN_PX} y1={0} x2={ORIGIN_PX} y2={VIEW_SIZE} />
      </g>

      {/* Target line (Match mode only) */}
      {targetPoints ? (
        <line
          x1={worldToPixelX(targetPoints[0].x)}
          y1={worldToPixelY(targetPoints[0].y)}
          x2={worldToPixelX(targetPoints[1].x)}
          y2={worldToPixelY(targetPoints[1].y)}
          strokeWidth={3}
          strokeDasharray="3 6"
          className="stroke-amber-500/70 dark:stroke-amber-400/70"
        />
      ) : null}

      {/* The line y = mx + b */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        strokeWidth={3.5}
        strokeDasharray={revealEquation ? undefined : "5 5"}
        className={cn("transition-all duration-150", revealEquation ? "stroke-ink dark:stroke-bone" : "stroke-ink/40 dark:stroke-bone/40")}
      />

      {/* y-intercept marker */}
      {showIntercept ? (
        <circle cx={interceptPx} cy={interceptPy} r={7} className="fill-subject-math stroke-white dark:stroke-ink" strokeWidth={2} />
      ) : null}

      {/* Equation label */}
      <text
        x={x2 + (x2 >= x1 ? -12 : 12)}
        y={y2 + (y2 >= y1 ? -12 : 16)}
        textAnchor={x2 >= x1 ? "end" : "start"}
        className={cn("pointer-events-none font-mono text-[14px] font-semibold", revealEquation ? "fill-ink dark:fill-bone" : "fill-ink/50 dark:fill-bone/50")}
      >
        {revealEquation ? formatEquation(m, b) : "y = mx + b"}
      </text>
    </svg>
  );
}
