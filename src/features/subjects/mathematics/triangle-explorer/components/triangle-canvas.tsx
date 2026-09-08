"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { cn } from "@/lib/utils";
import {
  CANVAS_SIZE,
  MIN_TRIANGLE_AREA,
  angles,
  area,
  clampToCanvas,
  distance,
  formatDegrees,
  formatLength,
  rightAngleVertex,
  sideLengths,
  type TrianglePoint,
  type TriangleVertices,
  type VertexId,
} from "../model";

interface TriangleCanvasProps {
  vertices: TriangleVertices;
  onChange: (vertices: TriangleVertices) => void;
  draggable?: boolean;
}

const VERTEX_COLORS: Record<VertexId, string> = {
  A: "#3D5AFE",
  B: "#F2A65A",
  C: "#22C55E",
};

function midpoint(p1: TrianglePoint, p2: TrianglePoint): TrianglePoint {
  return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
}

/** Outward unit normal of the edge p1→p2, relative to a third point
 *  (the opposite vertex) — used to push side-length labels away from
 *  the triangle's interior rather than through it. */
function outwardNormal(p1: TrianglePoint, p2: TrianglePoint, opposite: TrianglePoint): TrianglePoint {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const mid = midpoint(p1, p2);
  const towardOpposite = (opposite.x - mid.x) * nx + (opposite.y - mid.y) * ny;
  return towardOpposite > 0 ? { x: -nx, y: -ny } : { x: nx, y: ny };
}

/** Builds the SVG arc for the interior angle at `vertex`, sweeping
 *  from the direction of `p1` to the direction of `p2` the short way
 *  — which is always the interior angle for a non-degenerate
 *  triangle, since that angle is strictly under 180°. */
function angleArc(vertex: TrianglePoint, p1: TrianglePoint, p2: TrianglePoint, radius: number) {
  const a1 = Math.atan2(p1.y - vertex.y, p1.x - vertex.x);
  const a2 = Math.atan2(p2.y - vertex.y, p2.x - vertex.x);
  let delta = a2 - a1;
  while (delta <= -Math.PI) delta += Math.PI * 2;
  while (delta > Math.PI) delta -= Math.PI * 2;
  const sweepFlag = delta > 0 ? 1 : 0;
  const start = { x: vertex.x + Math.cos(a1) * radius, y: vertex.y + Math.sin(a1) * radius };
  const end = { x: vertex.x + Math.cos(a1 + delta) * radius, y: vertex.y + Math.sin(a1 + delta) * radius };
  const midAngle = a1 + delta / 2;
  const labelPos = { x: vertex.x + Math.cos(midAngle) * (radius + 16), y: vertex.y + Math.sin(midAngle) * (radius + 16) };
  return {
    path: `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 ${sweepFlag} ${end.x} ${end.y}`,
    labelPos,
  };
}

/** A small square marker (the standard right-angle symbol) drawn
 *  along the two edges leaving `vertex`, used instead of an arc when
 *  that vertex's angle is (within tolerance) exactly 90°. */
function rightAngleMarker(vertex: TrianglePoint, p1: TrianglePoint, p2: TrianglePoint, size: number) {
  const dir = (p: TrianglePoint) => {
    const len = Math.hypot(p.x - vertex.x, p.y - vertex.y) || 1;
    return { x: (p.x - vertex.x) / len, y: (p.y - vertex.y) / len };
  };
  const d1 = dir(p1);
  const d2 = dir(p2);
  const c1 = { x: vertex.x + d1.x * size, y: vertex.y + d1.y * size };
  const corner = { x: vertex.x + d1.x * size + d2.x * size, y: vertex.y + d1.y * size + d2.y * size };
  const c2 = { x: vertex.x + d2.x * size, y: vertex.y + d2.y * size };
  return `M ${c1.x} ${c1.y} L ${corner.x} ${corner.y} L ${c2.x} ${c2.y}`;
}

/**
 * The core interactive scene: an SVG triangle whose three vertices
 * can be dragged freely (pointer-capture drag, same convention as
 * `DistancePlane` and `AngleDial`), with live angle arcs, a
 * right-angle marker where appropriate, and side-length labels. All
 * geometry math is delegated to `model.ts` — this component only
 * turns those numbers into SVG paths and pixel positions.
 */
export function TriangleCanvas({ vertices, onChange, draggable = true }: TriangleCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<VertexId | null>(null);

  const clientToLocal = (clientX: number, clientY: number): TrianglePoint => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: ((clientX - rect.left) / rect.width) * CANVAS_SIZE,
      y: ((clientY - rect.top) / rect.height) * CANVAS_SIZE,
    };
  };

  const moveVertex = (id: VertexId, next: TrianglePoint) => {
    const clamped = clampToCanvas(next);
    const candidate: TriangleVertices = { ...vertices, [id]: clamped };
    // Refuse moves that would collapse the triangle (near-zero or
    // inverted area) rather than letting it flip or vanish mid-drag.
    if (area(candidate) < MIN_TRIANGLE_AREA) return;
    onChange(candidate);
  };

  const startDrag = (id: VertexId) => (e: ReactPointerEvent<SVGCircleElement>) => {
    if (!draggable) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(id);
    moveVertex(id, clientToLocal(e.clientX, e.clientY));
  };

  const duringDrag = (id: VertexId) => (e: ReactPointerEvent<SVGCircleElement>) => {
    if (dragging !== id) return;
    moveVertex(id, clientToLocal(e.clientX, e.clientY));
  };

  const endDrag = (e: ReactPointerEvent<SVGCircleElement>) => {
    setDragging(null);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Capture may already have been released.
    }
  };

  const nudgeVertex = (id: VertexId) => (e: React.KeyboardEvent) => {
    if (!draggable) return;
    const step = e.shiftKey ? 10 : 3;
    const deltas: Record<string, TrianglePoint> = {
      ArrowUp: { x: 0, y: -step },
      ArrowDown: { x: 0, y: step },
      ArrowLeft: { x: -step, y: 0 },
      ArrowRight: { x: step, y: 0 },
    };
    const delta = deltas[e.key];
    if (!delta) return;
    e.preventDefault();
    const current = vertices[id];
    moveVertex(id, { x: current.x + delta.x, y: current.y + delta.y });
  };

  const sides = sideLengths(vertices);
  const ang = angles(vertices);
  const rightVertex = rightAngleVertex(ang);

  const pairs: { id: VertexId; opp1: VertexId; opp2: VertexId }[] = [
    { id: "A", opp1: "B", opp2: "C" },
    { id: "B", opp1: "A", opp2: "C" },
    { id: "C", opp1: "A", opp2: "B" },
  ];

  const edgeMidpoints: { key: string; p1: TrianglePoint; p2: TrianglePoint; opposite: TrianglePoint; label: string }[] = [
    { key: "a", p1: vertices.B, p2: vertices.C, opposite: vertices.A, label: `a = ${formatLength(sides.a)}` },
    { key: "b", p1: vertices.A, p2: vertices.C, opposite: vertices.B, label: `b = ${formatLength(sides.b)}` },
    { key: "c", p1: vertices.A, p2: vertices.B, opposite: vertices.C, label: `c = ${formatLength(sides.c)}` },
  ];

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
      className="h-full w-full touch-none select-none text-subject-math"
      role="img"
      aria-label={`A triangle with sides ${formatLength(sides.a)}, ${formatLength(sides.b)}, ${formatLength(sides.c)} and angles ${formatDegrees(ang.A)}, ${formatDegrees(ang.B)}, ${formatDegrees(ang.C)}`}
    >
      {/* Filled triangle body */}
      <path
        d={`M ${vertices.A.x} ${vertices.A.y} L ${vertices.B.x} ${vertices.B.y} L ${vertices.C.x} ${vertices.C.y} Z`}
        className="fill-subject-math/10 stroke-subject-math dark:fill-subject-math/15"
        strokeWidth={2.5}
      />

      {/* Angle arcs / right-angle marker */}
      {pairs.map(({ id, opp1, opp2 }) => {
        const vertex = vertices[id];
        const p1 = vertices[opp1];
        const p2 = vertices[opp2];
        const maxRadius = Math.min(distance(vertex, p1), distance(vertex, p2)) / 3;
        const radius = Math.max(16, Math.min(30, maxRadius));

        if (id === rightVertex) {
          return (
            <path
              key={id}
              d={rightAngleMarker(vertex, p1, p2, Math.min(18, radius))}
              fill="none"
              className="stroke-ink dark:stroke-bone"
              strokeWidth={2}
            />
          );
        }

        const { path, labelPos } = angleArc(vertex, p1, p2, radius);
        return (
          <g key={id}>
            <path d={path} fill="none" className="stroke-ink/60 dark:stroke-bone/60" strokeWidth={2} />
            <text
              x={labelPos.x}
              y={labelPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="pointer-events-none fill-ink dark:fill-bone font-mono text-[11px] font-semibold"
            >
              {formatDegrees(ang[id])}
            </text>
          </g>
        );
      })}

      {/* Side length labels */}
      {edgeMidpoints.map(({ key, p1, p2, opposite, label }) => {
        const mid = midpoint(p1, p2);
        const normal = outwardNormal(p1, p2, opposite);
        const pos = { x: mid.x + normal.x * 16, y: mid.y + normal.y * 16 };
        return (
          <text
            key={key}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="pointer-events-none fill-ink-soft dark:fill-bone-soft font-mono text-[12px] font-semibold"
          >
            {label}
          </text>
        );
      })}

      {/* Draggable vertex handles */}
      {(["A", "B", "C"] as VertexId[]).map((id) => {
        const p = vertices[id];
        return (
          <g key={id}>
            <circle
              cx={p.x}
              cy={p.y}
              r={11}
              fill={VERTEX_COLORS[id]}
              stroke="white"
              strokeWidth={3}
              className={cn(draggable && "cursor-grab active:cursor-grabbing")}
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))" }}
              tabIndex={draggable ? 0 : undefined}
              role={draggable ? "slider" : undefined}
              aria-label={draggable ? `Vertex ${id}` : undefined}
              aria-valuetext={draggable ? `x ${Math.round(p.x)}, y ${Math.round(p.y)}` : undefined}
              onPointerDown={startDrag(id)}
              onPointerMove={duringDrag(id)}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onKeyDown={nudgeVertex(id)}
            />
            <text
              x={p.x}
              y={p.y - 18}
              textAnchor="middle"
              className="pointer-events-none fill-ink dark:fill-bone font-display text-[13px] font-medium"
            >
              {id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
