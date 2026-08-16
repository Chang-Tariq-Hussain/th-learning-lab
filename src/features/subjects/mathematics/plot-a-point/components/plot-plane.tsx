"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import {
  GRID_MAX,
  GRID_MIN,
  ORIGIN_PX,
  VIEW_SIZE,
  pixelToWorld,
  worldToPixelX,
  worldToPixelY,
} from "../../coordinate-plane-explorer/coordinate-model";

interface PlotPlaneProps {
  guess: { x: number; y: number } | null;
  status: "idle" | "correct" | "incorrect";
  onPlace: (x: number, y: number) => void;
}

const AXIS_TICKS = Array.from({ length: GRID_MAX - GRID_MIN + 1 }, (_, i) => GRID_MIN + i);
const LABELED_TICKS = AXIS_TICKS.filter((n) => n !== 0 && n % 2 === 0);

const QUADRANT_LABEL_POS = {
  I: { x: VIEW_SIZE - 26, y: 26 },
  II: { x: 26, y: 26 },
  III: { x: 26, y: VIEW_SIZE - 16 },
  IV: { x: VIEW_SIZE - 26, y: VIEW_SIZE - 16 },
} as const;

/**
 * The grid, axes, and quadrant labels are drawn exactly like
 * Coordinate Plane Explorer's plane. The interaction is different by
 * design: a single tap/click places a brand-new point at that spot
 * (rather than dragging an existing one), and there is no ghost
 * marker for the target — the student has to find it themselves.
 */
export function PlotPlane({ guess, status, onPlace }: PlotPlaneProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const clientToWorld = (clientX: number, clientY: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const px = ((clientX - rect.left) / rect.width) * VIEW_SIZE;
    const py = ((clientY - rect.top) / rect.height) * VIEW_SIZE;
    return pixelToWorld(px, py);
  };

  const handlePointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (status === "correct") return;
    const w = clientToWorld(e.clientX, e.clientY);
    onPlace(w.x, w.y);
  };

  const gx = guess ? worldToPixelX(guess.x) : null;
  const gy = guess ? worldToPixelY(guess.y) : null;

  const pointColor =
    status === "correct"
      ? "fill-pine-500 stroke-white dark:fill-pine-300 dark:stroke-chalkboard"
      : status === "incorrect"
        ? "fill-amber-500 stroke-white dark:fill-amber-400 dark:stroke-chalkboard"
        : "fill-ink/60 stroke-white dark:fill-bone/60 dark:stroke-chalkboard";

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
      className="h-full w-full touch-none text-subject-math"
      role="img"
      aria-label="An interactive Cartesian coordinate plane. Tap or click to plot a point."
      onPointerDown={handlePointerDown}
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

      {/* Axes with arrowheads */}
      <g className="pointer-events-none stroke-ink/60 dark:stroke-bone/60" strokeWidth={1.75}>
        <line x1={0} y1={ORIGIN_PX} x2={VIEW_SIZE} y2={ORIGIN_PX} />
        <line x1={ORIGIN_PX} y1={0} x2={ORIGIN_PX} y2={VIEW_SIZE} />
        <path d={`M${VIEW_SIZE - 10} ${ORIGIN_PX - 5} L${VIEW_SIZE} ${ORIGIN_PX} L${VIEW_SIZE - 10} ${ORIGIN_PX + 5}`} fill="none" />
        <path d={`M${ORIGIN_PX - 5} 10 L${ORIGIN_PX} 0 L${ORIGIN_PX + 5} 10`} fill="none" />
      </g>
      <g className="pointer-events-none fill-ink/70 dark:fill-bone/70 font-display text-xs font-medium">
        <text x={VIEW_SIZE - 14} y={ORIGIN_PX - 10} textAnchor="end">
          X
        </text>
        <text x={ORIGIN_PX + 12} y={14}>
          Y
        </text>
      </g>

      {/* Quadrant labels */}
      <g className="pointer-events-none fill-ink-soft dark:fill-bone-soft font-mono text-sm font-semibold opacity-60">
        {(Object.keys(QUADRANT_LABEL_POS) as (keyof typeof QUADRANT_LABEL_POS)[]).map((q) => (
          <text key={q} x={QUADRANT_LABEL_POS[q].x} y={QUADRANT_LABEL_POS[q].y} textAnchor="middle">
            {q}
          </text>
        ))}
      </g>

      {/* Origin */}
      <g className="pointer-events-none">
        <circle cx={ORIGIN_PX} cy={ORIGIN_PX} r={4} className="fill-ink/70 dark:fill-bone/70" />
        <text x={ORIGIN_PX + 8} y={ORIGIN_PX + 16} className="fill-ink-soft dark:fill-bone-soft font-mono text-[10px]">
          O (0,0)
        </text>
      </g>

      {/* Student's guess */}
      {guess && gx !== null && gy !== null ? (
        <g className="pointer-events-none">
          <line x1={gx} y1={gy} x2={gx} y2={ORIGIN_PX} strokeDasharray="4 4" strokeWidth={1.5} className="stroke-ink/25 dark:stroke-bone/25" />
          <line x1={gx} y1={gy} x2={ORIGIN_PX} y2={gy} strokeDasharray="4 4" strokeWidth={1.5} className="stroke-ink/25 dark:stroke-bone/25" />
          <circle
            cx={gx}
            cy={gy}
            r={status === "correct" ? 12 : 10}
            strokeWidth={3}
            className={`${pointColor} transition-all duration-200`}
          />
          <text
            x={gx}
            y={guess.y < 9 ? gy - 18 : gy + 26}
            textAnchor="middle"
            className="fill-ink dark:fill-bone font-mono text-[13px] font-semibold"
          >
            ({guess.x}, {guess.y})
          </text>
        </g>
      ) : null}
    </svg>
  );
}
