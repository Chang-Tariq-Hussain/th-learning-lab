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
import { distance, formatDistance, formatPoint, midpoint, type MidPoint } from "../model";

export type Highlight = "none" | "am" | "mb";

interface MidpointPlaneProps {
  a: MidPoint;
  b: MidPoint;
  onChangeA?: (x: number, y: number) => void;
  onChangeB?: (x: number, y: number) => void;
  highlight?: Highlight;
  draggable?: boolean;
  /** When false, M is drawn faint and labeled "M = ?" — used by the Calculate challenge so the answer isn't given away. */
  revealMidpoint?: boolean;
}

const AXIS_TICKS = Array.from({ length: GRID_MAX - GRID_MIN + 1 }, (_, i) => GRID_MIN + i);
const LABELED_TICKS = AXIS_TICKS.filter((n) => n !== 0 && n % 2 === 0);

export function MidpointPlane({ a, b, onChangeA, onChangeB, highlight = "none", draggable = true, revealMidpoint = true }: MidpointPlaneProps) {
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

  const m = midpoint(a, b);
  const halfDist = distance(a, m);

  const apx = worldToPixelX(a.x);
  const apy = worldToPixelY(a.y);
  const bpx = worldToPixelX(b.x);
  const bpy = worldToPixelY(b.y);
  const mpx = worldToPixelX(m.x);
  const mpy = worldToPixelY(m.y);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
      className="h-full w-full touch-none text-subject-math"
      role="img"
      aria-label="An interactive coordinate plane showing two points, the segment between them, and its midpoint"
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

      {/* A -> M half */}
      <line
        x1={apx}
        y1={apy}
        x2={mpx}
        y2={mpy}
        strokeWidth={highlight === "am" ? 4.5 : 3}
        className={cn(
          "transition-all duration-200",
          highlight === "am" ? "stroke-pine-500 dark:stroke-pine-300" : "stroke-pine-500/60 dark:stroke-pine-300/60"
        )}
      />
      {/* M -> B half */}
      <line
        x1={mpx}
        y1={mpy}
        x2={bpx}
        y2={bpy}
        strokeWidth={highlight === "mb" ? 4.5 : 3}
        className={cn(
          "transition-all duration-200",
          highlight === "mb" ? "stroke-amber-500 dark:stroke-amber-400" : "stroke-amber-500/60 dark:stroke-amber-400/60"
        )}
      />

      {/* Half-distance labels */}
      <g className="pointer-events-none font-mono text-[11px] font-semibold">
        <text
          x={(apx + mpx) / 2}
          y={(apy + mpy) / 2 - 10}
          textAnchor="middle"
          className={highlight === "am" ? "fill-pine-600 dark:fill-pine-300" : "fill-pine-600/70 dark:fill-pine-300/70"}
        >
          {formatDistance(halfDist)}
        </text>
        <text
          x={(mpx + bpx) / 2}
          y={(mpy + bpy) / 2 - 10}
          textAnchor="middle"
          className={highlight === "mb" ? "fill-amber-600 dark:fill-amber-400" : "fill-amber-600/70 dark:fill-amber-400/70"}
        >
          {formatDistance(halfDist)}
        </text>
      </g>

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

      {/* Midpoint M — the focal point of the whole simulation */}
      <circle
        cx={mpx}
        cy={mpy}
        r={8.5}
        strokeWidth={3}
        strokeDasharray={revealMidpoint ? undefined : "3 3"}
        className={cn("stroke-white dark:stroke-chalkboard transition-opacity", revealMidpoint ? "fill-subject-math" : "fill-subject-math/40")}
      />
      <text
        x={mpx}
        y={m.y >= 9 ? mpy + 24 : mpy - 16}
        textAnchor="middle"
        className={cn("pointer-events-none font-mono text-[12px] font-semibold", revealMidpoint ? "fill-subject-math" : "fill-subject-math/60")}
      >
        M {revealMidpoint ? formatPoint(m) : "= ?"}
      </text>
    </svg>
  );
}
