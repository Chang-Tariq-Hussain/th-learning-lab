"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { cn } from "@/lib/utils";
import {
  GRID_MAX,
  GRID_MIN,
  ORIGIN_PX,
  VIEW_SIZE,
  pixelToWorld,
  worldToPixelX,
  worldToPixelY,
  type Quadrant,
} from "../coordinate-model";

interface CoordinatePlaneProps {
  point: { x: number; y: number };
  onPointChange: (x: number, y: number) => void;
  onQuadrantClick: (quadrant: Quadrant) => void;
  onOriginClick: () => void;
  onHoverChange: (coord: { x: number; y: number } | null) => void;
  showGuides: boolean;
  target: { x: number; y: number } | null;
}

const AXIS_TICKS = Array.from({ length: GRID_MAX - GRID_MIN + 1 }, (_, i) => GRID_MIN + i);
const LABELED_TICKS = AXIS_TICKS.filter((n) => n !== 0 && n % 2 === 0);

const QUADRANT_LABEL_POS: Record<Quadrant, { x: number; y: number }> = {
  I: { x: VIEW_SIZE - 26, y: 26 },
  II: { x: 26, y: 26 },
  III: { x: 26, y: VIEW_SIZE - 16 },
  IV: { x: VIEW_SIZE - 26, y: VIEW_SIZE - 16 },
};

export function CoordinatePlane({
  point,
  onPointChange,
  onQuadrantClick,
  onOriginClick,
  onHoverChange,
  showGuides,
  target,
}: CoordinatePlaneProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);

  const clientToWorld = (clientX: number, clientY: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: point.x, y: point.y };
    const px = ((clientX - rect.left) / rect.width) * VIEW_SIZE;
    const py = ((clientY - rect.top) / rect.height) * VIEW_SIZE;
    return pixelToWorld(px, py);
  };

  const handlePointDown = (e: ReactPointerEvent<SVGCircleElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    const w = clientToWorld(e.clientX, e.clientY);
    onPointChange(w.x, w.y);
  };

  const handlePointMove = (e: ReactPointerEvent<SVGCircleElement>) => {
    if (!dragging) return;
    const w = clientToWorld(e.clientX, e.clientY);
    onPointChange(w.x, w.y);
  };

  const endPointDrag = (e: ReactPointerEvent<SVGCircleElement>) => {
    setDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Capture may already have been released — nothing to do.
    }
  };

  const handleHoverMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    onHoverChange(clientToWorld(e.clientX, e.clientY));
  };

  const px = worldToPixelX(point.x);
  const py = worldToPixelY(point.y);
  const labelAbove = point.y < 9;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
      className="h-full w-full touch-none text-subject-math"
      role="img"
      aria-label="An interactive Cartesian coordinate plane with a draggable point"
      onPointerMove={handleHoverMove}
      onPointerLeave={() => onHoverChange(null)}
    >
      {/* Quadrant click regions (behind everything else) */}
      <g className="cursor-pointer">
        <rect x={ORIGIN_PX} y={0} width={VIEW_SIZE - ORIGIN_PX} height={ORIGIN_PX} fill="transparent" onClick={() => onQuadrantClick("I")} />
        <rect x={0} y={0} width={ORIGIN_PX} height={ORIGIN_PX} fill="transparent" onClick={() => onQuadrantClick("II")} />
        <rect x={0} y={ORIGIN_PX} width={ORIGIN_PX} height={VIEW_SIZE - ORIGIN_PX} fill="transparent" onClick={() => onQuadrantClick("III")} />
        <rect x={ORIGIN_PX} y={ORIGIN_PX} width={VIEW_SIZE - ORIGIN_PX} height={VIEW_SIZE - ORIGIN_PX} fill="transparent" onClick={() => onQuadrantClick("IV")} />
      </g>

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
        {(Object.keys(QUADRANT_LABEL_POS) as Quadrant[]).map((q) => (
          <text key={q} x={QUADRANT_LABEL_POS[q].x} y={QUADRANT_LABEL_POS[q].y} textAnchor="middle">
            {q}
          </text>
        ))}
      </g>

      {/* Origin */}
      <g className="cursor-pointer" onClick={onOriginClick}>
        <circle cx={ORIGIN_PX} cy={ORIGIN_PX} r={10} fill="transparent" />
        <circle cx={ORIGIN_PX} cy={ORIGIN_PX} r={4} className="fill-ink/70 dark:fill-bone/70" />
        <text x={ORIGIN_PX + 8} y={ORIGIN_PX + 16} className="pointer-events-none fill-ink-soft dark:fill-bone-soft font-mono text-[10px]">
          O (0,0)
        </text>
      </g>

      {/* Target ghost marker for the placement challenge */}
      {target ? (
        <circle
          cx={worldToPixelX(target.x)}
          cy={worldToPixelY(target.y)}
          r={11}
          fill="none"
          strokeDasharray="4 4"
          strokeWidth={2}
          className="pointer-events-none stroke-amber-500"
        />
      ) : null}

      {/* Guide lines: vertical to x-axis, horizontal to y-axis */}
      {showGuides ? (
        <g className="pointer-events-none">
          <line x1={px} y1={py} x2={px} y2={ORIGIN_PX} strokeDasharray="4 4" strokeWidth={1.5} className="stroke-pine-500/60 dark:stroke-pine-300/60" />
          <line x1={px} y1={ORIGIN_PX} x2={ORIGIN_PX} y2={ORIGIN_PX} strokeWidth={2} className="stroke-pine-500/70 dark:stroke-pine-300/70" />
          <text x={px} y={ORIGIN_PX + (point.y >= 0 ? 26 : -14)} textAnchor="middle" className="fill-pine-600 dark:fill-pine-300 font-mono text-[11px] font-semibold">
            x = {point.x}
          </text>

          <line x1={px} y1={py} x2={ORIGIN_PX} y2={py} strokeDasharray="4 4" strokeWidth={1.5} className="stroke-amber-500/70" />
          <line x1={ORIGIN_PX} y1={py} x2={ORIGIN_PX} y2={ORIGIN_PX} strokeWidth={2} className="stroke-amber-500/80" />
          <text x={ORIGIN_PX + (point.x >= 0 ? -14 : 14)} y={py - 8} textAnchor={point.x >= 0 ? "end" : "start"} className="fill-amber-600 dark:fill-amber-400 font-mono text-[11px] font-semibold">
            y = {point.y}
          </text>
        </g>
      ) : null}

      {/* Draggable point */}
      <circle
        cx={px}
        cy={py}
        r={10}
        className="cursor-grab fill-pine-500 stroke-white active:cursor-grabbing dark:fill-pine-300 dark:stroke-chalkboard"
        strokeWidth={3}
        onPointerDown={handlePointDown}
        onPointerMove={handlePointMove}
        onPointerUp={endPointDrag}
        onPointerCancel={endPointDrag}
      />
      <text
        x={px}
        y={labelAbove ? py - 18 : py + 26}
        textAnchor="middle"
        className="pointer-events-none fill-ink dark:fill-bone font-mono text-[13px] font-semibold"
      >
        P = ({point.x}, {point.y})
      </text>
    </svg>
  );
}
