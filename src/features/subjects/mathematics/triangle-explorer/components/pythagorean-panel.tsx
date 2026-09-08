"use client";

import { motion } from "framer-motion";
import { formatLength, type TriangleSides, type VertexId } from "../model";

interface Point {
  x: number;
  y: number;
}

interface PythagoreanPanelProps {
  rightVertex: VertexId | null;
  sides: TriangleSides;
  playKey: number;
}

const LEG_COLOR = "#3D5AFE";
const LEG2_COLOR = "#F2A65A";
const HYP_COLOR = "#22C55E";

function subtract(p1: Point, p2: Point): Point {
  return { x: p1.x - p2.x, y: p1.y - p2.y };
}

function squarePoints(base: Point, tip: Point, awayFrom: Point): Point[] {
  const edge = subtract(tip, base);
  const len = Math.hypot(edge.x, edge.y) || 1;
  // Two candidate outward normals; pick whichever points away from
  // the right-angle vertex (`awayFrom`), so the square is drawn
  // outside the triangle rather than on top of it.
  const nA: Point = { x: -edge.y / len, y: edge.x / len };
  const mid: Point = { x: (base.x + tip.x) / 2, y: (base.y + tip.y) / 2 };
  const towardAway = (awayFrom.x - mid.x) * nA.x + (awayFrom.y - mid.y) * nA.y;
  const n = towardAway > 0 ? { x: -nA.x, y: -nA.y } : nA;
  const far1: Point = { x: base.x + n.x * len, y: base.y + n.y * len };
  const far2: Point = { x: tip.x + n.x * len, y: tip.y + n.y * len };
  return [base, tip, far2, far1];
}

function polygonPath(points: Point[]): string {
  return `M ${points.map((p) => `${p.x} ${p.y}`).join(" L ")} Z`;
}

function centroid(points: Point[]): Point {
  const x = points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const y = points.reduce((sum, p) => sum + p.y, 0) / points.length;
  return { x, y };
}

/**
 * A self-contained schematic right triangle (right angle fixed at the
 * origin, legs along the axes) with the three classic squares built
 * on each side — independent of `TriangleCanvas`'s freehand vertices,
 * so this diagram stays clean and correctly-proportioned no matter
 * how awkwardly the student has dragged the live triangle. Only the
 * two leg *lengths* (scaled to fit the panel) are taken from the real
 * triangle; the layout itself is always the standard right-angle-at-
 * the-corner textbook orientation.
 *
 * Renders an empty state instead when the current triangle isn't a
 * right triangle — the relationship only holds for one, so nothing
 * here computes or displays without a real right angle to show it on.
 */
export function PythagoreanPanel({ rightVertex, sides, playKey }: PythagoreanPanelProps) {
  if (!rightVertex) {
    return (
      <div className="rounded-card border border-dashed border-line bg-white/50 p-5 text-center dark:border-line-dark dark:bg-white/[0.02]">
        <p className="text-sm text-ink-soft dark:text-bone-soft">
          The Pythagorean relationship only applies to right triangles. Load the <span className="font-medium text-ink dark:text-bone">Right</span> preset above, or drag a vertex until the right-angle marker appears, to see it here.
        </p>
      </div>
    );
  }

  // Legs are the two sides that include the right-angle vertex; the
  // hypotenuse is the side named after that vertex (opposite it) —
  // see model.ts's side-naming convention.
  const sideKeys = ["a", "b", "c"] as const;
  const hypKey = rightVertex.toLowerCase() as (typeof sideKeys)[number];
  const legKeys = sideKeys.filter((k) => k !== hypKey);
  const leg1 = sides[legKeys[0]!];
  const leg2 = sides[legKeys[1]!];
  const hyp = sides[hypKey];

  const maxLeg = Math.max(leg1, leg2);
  const scale = maxLeg > 0 ? 92 / maxLeg : 1;
  const L1 = leg1 * scale;
  const L2 = leg2 * scale;

  const right: Point = { x: 40, y: 210 };
  const p1: Point = { x: right.x + L1, y: right.y };
  const p2: Point = { x: right.x, y: right.y - L2 };

  const legSquare1 = squarePoints(right, p1, p2);
  const legSquare2 = squarePoints(right, p2, p1);
  const hypSquare = squarePoints(p1, p2, right);

  const c1 = centroid(legSquare1);
  const c2 = centroid(legSquare2);
  const c3 = centroid(hypSquare);

  const relativeError = hyp > 0 ? Math.abs(leg1 ** 2 + leg2 ** 2 - hyp ** 2) / hyp ** 2 : 1;
  const confirmed = relativeError < 0.01;

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <svg viewBox="0 0 320 260" className="mx-auto w-full max-w-[300px]" role="img" aria-label="Squares built on each side of the right triangle, illustrating a squared plus b squared equals c squared">
        {/* Triangle outline */}
        <path
          d={`M ${right.x} ${right.y} L ${p1.x} ${p1.y} L ${p2.x} ${p2.y} Z`}
          className="fill-ink/5 stroke-ink/50 dark:fill-bone/5 dark:stroke-bone/50"
          strokeWidth={1.5}
        />

        <motion.path
          key={`${playKey}-leg1`}
          d={polygonPath(legSquare1)}
          fill={LEG_COLOR}
          fillOpacity={0.35}
          stroke={LEG_COLOR}
          strokeWidth={2}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0, duration: 0.4, ease: "easeOut" }}
          style={{ transformOrigin: `${right.x}px ${right.y}px` }}
        />
        <motion.path
          key={`${playKey}-leg2`}
          d={polygonPath(legSquare2)}
          fill={LEG2_COLOR}
          fillOpacity={0.35}
          stroke={LEG2_COLOR}
          strokeWidth={2}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.4, ease: "easeOut" }}
          style={{ transformOrigin: `${right.x}px ${right.y}px` }}
        />
        <motion.path
          key={`${playKey}-hyp`}
          d={polygonPath(hypSquare)}
          fill={HYP_COLOR}
          fillOpacity={0.35}
          stroke={HYP_COLOR}
          strokeWidth={2}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.4, ease: "easeOut" }}
          style={{ transformOrigin: `${p1.x}px ${p1.y}px` }}
        />

        <text x={c1.x} y={c1.y} textAnchor="middle" dominantBaseline="middle" className="pointer-events-none fill-ink dark:fill-bone font-mono text-[11px] font-semibold">
          {legKeys[0]}²
        </text>
        <text x={c2.x} y={c2.y} textAnchor="middle" dominantBaseline="middle" className="pointer-events-none fill-ink dark:fill-bone font-mono text-[11px] font-semibold">
          {legKeys[1]}²
        </text>
        <text x={c3.x} y={c3.y} textAnchor="middle" dominantBaseline="middle" className="pointer-events-none fill-ink dark:fill-bone font-mono text-[11px] font-semibold">
          {hypKey}²
        </text>
      </svg>

      <motion.div
        key={`${playKey}-equation`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05, duration: 0.4 }}
        className="mt-3 text-center"
      >
        <p className="font-mono text-sm text-ink dark:text-bone">
          {legKeys[0]}² + {legKeys[1]}² = {hypKey}²
        </p>
        <p className="mt-1 font-mono text-xs text-ink-soft dark:text-bone-soft">
          {formatLength(leg1)}² + {formatLength(leg2)}² = {formatLength(leg1 ** 2 + leg2 ** 2)} {confirmed ? "≈" : "vs."} {formatLength(hyp)}² = {formatLength(hyp ** 2)}
        </p>
        {confirmed ? (
          <p className="mt-1 text-xs font-medium text-pine-600 dark:text-pine-300">Confirmed — the two sides match.</p>
        ) : (
          <p className="mt-1 text-xs text-ink-soft/80 dark:text-bone-soft/80">Close, but not exact — fine-tune the right angle for a closer match.</p>
        )}
      </motion.div>
    </div>
  );
}
