"use client";

import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { cn } from "@/lib/utils";
import {
  GRID_MAX,
  GRID_MIN,
  ORIGIN_PX,
  SCALE,
  VIEW_SIZE,
  worldToPixelX,
  worldToPixelY,
} from "../../coordinate-plane-explorer/coordinate-model";
import { formatValue } from "../calculus-model";

const AXIS_TICKS = Array.from({ length: GRID_MAX - GRID_MIN + 1 }, (_, i) => GRID_MIN + i);
const LABELED_TICKS = AXIS_TICKS.filter((n) => n !== 0 && n % 5 === 0);
const SAMPLES = 120;
/** Curve y-values are clamped a little beyond the visible grid so a steep path never produces extreme SVG coordinates. */
const CLAMP_PAD = 3;

export interface GraphSegment {
  evaluate: (x: number) => number;
  from: number;
  to: number;
  color?: string;
}

export interface GraphMarker {
  x: number;
  y: number;
  /** "open" draws a hollow circle (discontinuity/hole); "closed" draws a filled dot. */
  kind: "open" | "closed";
  color?: string;
}

export interface ApproachDot {
  x: number;
  y: number;
  color: string;
  label?: string;
}

export interface TrackedPoint {
  x: number;
  y: number;
  color?: string;
  label?: string;
}

export interface FunctionGraphProps {
  segments: GraphSegment[];
  /** A single point students can drag horizontally along the curve (Level 2). */
  trackedPoint?: TrackedPoint;
  onDragTrackedPointX?: (x: number) => void;
  /** Show dashed guide lines from the tracked point to both axes. */
  showGuides?: boolean;
  /** Extra fixed dots — used for left/right approach demonstrations. */
  approachDots?: ApproachDot[];
  /** Hollow/filled circles marking discontinuities or holes. */
  markers?: GraphMarker[];
  /** A vertical dashed line marking the target x-value in a limit example. */
  targetX?: number;
  className?: string;
  ariaLabel?: string;
}

function clampY(y: number): number {
  return Math.max(GRID_MIN - CLAMP_PAD, Math.min(GRID_MAX + CLAMP_PAD, y));
}

function buildPath(segment: GraphSegment): string {
  const { evaluate, from, to } = segment;
  const points: string[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const x = from + ((to - from) * i) / SAMPLES;
    const y = clampY(evaluate(x));
    const px = worldToPixelX(x);
    const py = worldToPixelY(y);
    points.push(`${i === 0 ? "M" : "L"}${px.toFixed(1)} ${py.toFixed(1)}`);
  }
  return points.join(" ");
}

/**
 * Shared SVG coordinate-plane plotter for every level of Calculus
 * Foundations. Built on the same world<->pixel mapping as Coordinate
 * Plane Explorer / Slope of a Line so every level shares one accurate
 * grid, and just layers curves, markers, and points on top depending
 * on what a given level needs.
 */
export function FunctionGraph({
  segments,
  trackedPoint,
  onDragTrackedPointX,
  showGuides = false,
  approachDots = [],
  markers = [],
  targetX,
  className,
  ariaLabel = "An interactive coordinate plane showing a function's graph.",
}: FunctionGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);

  const paths = useMemo(() => segments.map((s) => buildPath(s)), [segments]);

  /** A local, decimal-precision pixel->world conversion — `pixelToWorld` from the shared model rounds to whole grid units, which is right for plotting points but too coarse for dragging smoothly along a curve. */
  const clientXToWorld = (clientX: number): number => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const px = ((clientX - rect.left) / rect.width) * VIEW_SIZE;
    const raw = (px - ORIGIN_PX) / SCALE;
    return Math.round(raw * 100) / 100;
  };

  const startDrag = (e: ReactPointerEvent<SVGCircleElement>) => {
    if (!onDragTrackedPointX) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    onDragTrackedPointX(clientXToWorld(e.clientX));
  };
  const moveDrag = (e: ReactPointerEvent<SVGCircleElement>) => {
    if (!dragging || !onDragTrackedPointX) return;
    onDragTrackedPointX(clientXToWorld(e.clientX));
  };
  const endDrag = (e: ReactPointerEvent<SVGCircleElement>) => {
    setDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Capture may already have been released.
    }
  };

  const tpx = trackedPoint ? worldToPixelX(trackedPoint.x) : null;
  const tpy = trackedPoint ? worldToPixelY(clampY(trackedPoint.y)) : null;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
      className={cn("h-full w-full touch-none text-subject-math", className)}
      role="img"
      aria-label={ariaLabel}
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

      {/* Target guide line (limit examples) */}
      {targetX !== undefined ? (
        <line
          x1={worldToPixelX(targetX)}
          y1={0}
          x2={worldToPixelX(targetX)}
          y2={VIEW_SIZE}
          strokeWidth={1.5}
          strokeDasharray="4 4"
          className="pointer-events-none stroke-amber-500/70 dark:stroke-amber-400/70"
        />
      ) : null}

      {/* The curve(s) */}
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          strokeWidth={3}
          className={segments[i]?.color ? undefined : "stroke-subject-math"}
          style={segments[i]?.color ? { stroke: segments[i]?.color } : undefined}
        />
      ))}

      {/* Guide lines from the tracked point to both axes */}
      {showGuides && trackedPoint && tpx !== null && tpy !== null ? (
        <g className="pointer-events-none stroke-ink/35 dark:stroke-bone/35" strokeDasharray="4 3" strokeWidth={1.25}>
          <line x1={tpx} y1={tpy} x2={tpx} y2={ORIGIN_PX} />
          <line x1={ORIGIN_PX} y1={tpy} x2={tpx} y2={tpy} />
        </g>
      ) : null}

      {/* Open/closed markers (discontinuities and holes) */}
      {markers.map((m, i) => {
        const mx = worldToPixelX(m.x);
        const my = worldToPixelY(clampY(m.y));
        return (
          <circle
            key={i}
            cx={mx}
            cy={my}
            r={7}
            strokeWidth={2.5}
            className={cn(
              "pointer-events-none",
              m.kind === "open"
                ? "fill-paper stroke-ink dark:fill-chalkboard dark:stroke-bone"
                : "fill-ink stroke-paper dark:fill-bone dark:stroke-chalkboard"
            )}
            style={m.color ? { stroke: m.color } : undefined}
          />
        );
      })}

      {/* Left/right approach dots */}
      {approachDots.map((d, i) => {
        const dx = worldToPixelX(d.x);
        const dy = worldToPixelY(clampY(d.y));
        return (
          <g key={i}>
            <circle cx={dx} cy={dy} r={7} strokeWidth={2.5} style={{ fill: d.color }} className="stroke-paper dark:stroke-chalkboard" />
            {d.label ? (
              <text
                x={dx}
                y={dy - 14}
                textAnchor="middle"
                className="pointer-events-none font-mono text-[11px] font-semibold fill-ink dark:fill-bone"
              >
                {d.label}
              </text>
            ) : null}
          </g>
        );
      })}

      {/* The tracked / draggable point */}
      {trackedPoint && tpx !== null && tpy !== null ? (
        <g>
          <circle
            cx={tpx}
            cy={tpy}
            r={10}
            strokeWidth={3}
            style={trackedPoint.color ? { fill: trackedPoint.color } : undefined}
            className={cn(
              "stroke-white dark:stroke-chalkboard",
              !trackedPoint.color && "fill-pine-500 dark:fill-pine-300",
              onDragTrackedPointX && "cursor-grab active:cursor-grabbing"
            )}
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          />
          <text
            x={tpx}
            y={trackedPoint.y >= 8 ? tpy + 24 : tpy - 16}
            textAnchor="middle"
            className="pointer-events-none fill-ink dark:fill-bone font-mono text-[12px] font-semibold"
          >
            {trackedPoint.label ?? `(${formatValue(trackedPoint.x)}, ${formatValue(trackedPoint.y)})`}
          </text>
        </g>
      ) : null}
    </svg>
  );
}
