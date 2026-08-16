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
} from "../../coordinate-plane-explorer/coordinate-model";
import { deltaX, deltaY, distance, formatDistance, type DistPoint } from "../model";

export type Highlight = "none" | "dx" | "dy" | "d";

interface DistancePlaneProps {
  a: DistPoint;
  b: DistPoint;
  onChangeA?: (x: number, y: number) => void;
  onChangeB?: (x: number, y: number) => void;
  highlight?: Highlight;
  draggable?: boolean;
  /** When false, the hypotenuse is drawn faint/dashed and labeled "d = ?" — used by the Calculate challenge so the answer isn't given away. */
  revealDistance?: boolean;
}

const AXIS_TICKS = Array.from({ length: GRID_MAX - GRID_MIN + 1 }, (_, i) => GRID_MIN + i);
const LABELED_TICKS = AXIS_TICKS.filter((n) => n !== 0 && n % 2 === 0);

/**
 * The corner of the right triangle sits at (b.x, a.y) — the point
 * directly below/above B and level with A. Horizontal leg: A -> corner.
 * Vertical leg: corner -> B. Hypotenuse: A -> B (the actual distance).
 */
export function DistancePlane({ a, b, onChangeA, onChangeB, highlight = "none", draggable = true, revealDistance = true }: DistancePlaneProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<"a" | "b" | null>(null);

  const clientToWorld = (clientX: number, clientY: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const px = ((clientX - rect.left) / rect.width) * VIEW_SIZE;
    const py = ((clientY - rect.top) / rect.height) * VIEW_SIZE;
    return pixelToWorld(px, py);
  };

  const startDrag = (which: "a" | "b") => (e: ReactPointerEvent<SVGCircleElement>) => {
    if (!draggable) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(which);
    const w = clientToWorld(e.clientX, e.clientY);
    (which === "a" ? onChangeA : onChangeB)?.(w.x, w.y);
  };

  const moveDrag = (which: "a" | "b") => (e: ReactPointerEvent<SVGCircleElement>) => {
    if (dragging !== which) return;
    const w = clientToWorld(e.clientX, e.clientY);
    (which === "a" ? onChangeA : onChangeB)?.(w.x, w.y);
  };

  const endDrag = (e: ReactPointerEvent<SVGCircleElement>) => {
    setDragging(null);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Capture may already have been released.
    }
  };

  const dx = deltaX(a, b);
  const dy = deltaY(a, b);
  const d = distance(a, b);

  const apx = worldToPixelX(a.x);
  const apy = worldToPixelY(a.y);
  const bpx = worldToPixelX(b.x);
  const bpy = worldToPixelY(b.y);
  // Right-angle corner: level with A horizontally-wise, at B's x.
  const cpx = bpx;
  const cpy = apy;

  const cornerSize = 10;
  const cornerX = dx >= 0 ? cpx - cornerSize : cpx + cornerSize;
  const cornerY = dy >= 0 ? cpy - cornerSize : cpy + cornerSize;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
      className="h-full w-full touch-none text-subject-math"
      role="img"
      aria-label="An interactive coordinate plane showing two points, the right triangle between them, and the distance"
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

      {/* Right triangle legs (Δx horizontal, Δy vertical) */}
      <g className="pointer-events-none">
        <line
          x1={apx}
          y1={apy}
          x2={cpx}
          y2={cpy}
          strokeWidth={highlight === "dx" ? 4 : 2.5}
          strokeDasharray={highlight === "dx" ? undefined : "6 4"}
          className={cn("transition-all duration-200", highlight === "dx" ? "stroke-pine-500 dark:stroke-pine-300" : "stroke-pine-500/50 dark:stroke-pine-300/50")}
        />
        <line
          x1={cpx}
          y1={cpy}
          x2={bpx}
          y2={bpy}
          strokeWidth={highlight === "dy" ? 4 : 2.5}
          strokeDasharray={highlight === "dy" ? undefined : "6 4"}
          className={cn("transition-all duration-200", highlight === "dy" ? "stroke-amber-500 dark:stroke-amber-400" : "stroke-amber-500/50 dark:stroke-amber-400/50")}
        />

        {/* Right-angle marker */}
        <path
          d={`M${cpx} ${cornerY} L${cornerX} ${cornerY} L${cornerX} ${cpy}`}
          fill="none"
          strokeWidth={1.5}
          className="stroke-ink/40 dark:stroke-bone/40"
        />

        {/* Δx / Δy labels */}
        <text
          x={(apx + cpx) / 2}
          y={apy + (dy >= 0 ? 20 : -12)}
          textAnchor="middle"
          className={cn("font-mono text-[12px] font-semibold", highlight === "dx" ? "fill-pine-600 dark:fill-pine-300" : "fill-pine-600/60 dark:fill-pine-300/60")}
        >
          Δx = {dx}
        </text>
        <text
          x={cpx + (dx >= 0 ? 12 : -12)}
          y={(cpy + bpy) / 2}
          textAnchor={dx >= 0 ? "start" : "end"}
          className={cn("font-mono text-[12px] font-semibold", highlight === "dy" ? "fill-amber-600 dark:fill-amber-400" : "fill-amber-600/60 dark:fill-amber-400/60")}
        >
          Δy = {dy}
        </text>
      </g>

      {/* Hypotenuse (the distance line) */}
      <line
        x1={apx}
        y1={apy}
        x2={bpx}
        y2={bpy}
        strokeWidth={highlight === "d" ? 4.5 : 3}
        strokeDasharray={revealDistance ? undefined : "5 5"}
        className={cn(
          "transition-all duration-200",
          !revealDistance ? "stroke-ink/40 dark:stroke-bone/40" : highlight === "d" ? "stroke-ink dark:stroke-bone" : "stroke-ink/70 dark:stroke-bone/70"
        )}
      />
      <text
        x={(apx + bpx) / 2 + (dy >= 0 ? 14 : -14)}
        y={(apy + bpy) / 2}
        textAnchor={dy >= 0 ? "start" : "end"}
        className={cn(
          "pointer-events-none font-mono text-[13px] font-semibold",
          !revealDistance ? "fill-ink/50 dark:fill-bone/50" : highlight === "d" ? "fill-ink dark:fill-bone" : "fill-ink/70 dark:fill-bone/70"
        )}
      >
        d = {revealDistance ? formatDistance(d) : "?"}
      </text>

      {/* Point A */}
      <circle
        cx={apx}
        cy={apy}
        r={10}
        strokeWidth={3}
        className={cn("fill-pine-500 stroke-white dark:fill-pine-300 dark:stroke-chalkboard", draggable && "cursor-grab active:cursor-grabbing")}
        onPointerDown={startDrag("a")}
        onPointerMove={moveDrag("a")}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      />
      <text x={apx} y={a.y >= 9 ? apy + 24 : apy - 16} textAnchor="middle" className="pointer-events-none fill-ink dark:fill-bone font-mono text-[12px] font-semibold">
        A ({a.x}, {a.y})
      </text>

      {/* Point B */}
      <circle
        cx={bpx}
        cy={bpy}
        r={10}
        strokeWidth={3}
        className={cn("fill-amber-500 stroke-white dark:fill-amber-400 dark:stroke-chalkboard", draggable && "cursor-grab active:cursor-grabbing")}
        onPointerDown={startDrag("b")}
        onPointerMove={moveDrag("b")}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      />
      <text x={bpx} y={b.y >= 9 ? bpy + 24 : bpy - 16} textAnchor="middle" className="pointer-events-none fill-ink dark:fill-bone font-mono text-[12px] font-semibold">
        B ({b.x}, {b.y})
      </text>
    </svg>
  );
}
