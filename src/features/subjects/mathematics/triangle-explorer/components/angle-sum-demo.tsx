"use client";

import { motion } from "framer-motion";
import type { TriangleAngles } from "../model";

interface Point {
  x: number;
  y: number;
}

const VERTEX_COLORS: Record<keyof TriangleAngles, string> = {
  A: "#3D5AFE",
  B: "#F2A65A",
  C: "#22C55E",
};

function dirPoint(apex: Point, degrees: number, radius: number): Point {
  const rad = (degrees * Math.PI) / 180;
  return { x: apex.x + Math.cos(rad) * radius, y: apex.y - Math.sin(rad) * radius };
}

/** A filled circular sector from `fromDeg` down to `toDeg` (always
 *  `fromDeg > toDeg` here), sharing `apex`. Sweeps through the upper
 *  half-plane by construction — see the component doc comment for
 *  why that's always a clockwise, short-way arc in this layout. */
function sectorPath(apex: Point, radius: number, fromDeg: number, toDeg: number): string {
  const p1 = dirPoint(apex, fromDeg, radius);
  const p2 = dirPoint(apex, toDeg, radius);
  return `M ${apex.x} ${apex.y} L ${p1.x} ${p1.y} A ${radius} ${radius} 0 0 1 ${p2.x} ${p2.y} Z`;
}

/**
 * The "Angle Sum Theorem" proof animation: the triangle's three
 * corners, redrawn sharing a single point on a dashed baseline, swept
 * one after another (A, then B, then C) so the sequence visibly
 * completes a straight 180° line — the classic "tear off the corners
 * and line them up" demonstration, done live with the triangle's own
 * current angles rather than a fixed illustration.
 *
 * All three sectors share one apex and are laid out by *cumulative*
 * turn: starting at 180° (pointing left) and turning clockwise by
 * each angle in turn (180 → 180−A → 180−A−B → 180−A−B−C). Since the
 * three angles always sum to exactly 180°, that last direction is
 * always 0° (pointing right) — so the three sectors automatically
 * tile the upper half of the dashed line with no gap or overlap,
 * for *any* valid triangle, with no special-casing needed here.
 *
 * Remounting on `playKey` change (via the `key` on each sector) is
 * what makes the "Replay" button restart the animation — Framer
 * Motion re-runs `initial -> animate` for freshly mounted elements,
 * the same trick `ConfettiBurst` uses for its milestone celebration.
 */
export function AngleSumDemo({ angleValues, playKey }: { angleValues: TriangleAngles; playKey: number }) {
  const apex: Point = { x: 200, y: 120 };
  const radius = 84;

  const afterA = 180 - angleValues.A;
  const afterB = afterA - angleValues.B;
  const afterC = afterB - angleValues.C; // ≈ 0

  const sectors: { id: keyof TriangleAngles; from: number; to: number; delay: number }[] = [
    { id: "A", from: 180, to: afterA, delay: 0 },
    { id: "B", from: afterA, to: afterB, delay: 0.55 },
    { id: "C", from: afterB, to: afterC, delay: 1.1 },
  ];

  return (
    <div className="rounded-card border border-dashed border-line bg-white/50 p-4 dark:border-line-dark dark:bg-white/[0.02]">
      <svg viewBox="0 0 400 160" className="mx-auto w-full max-w-[360px]" role="img" aria-label="Animation of the triangle's three angles lining up along a straight line to sum to 180 degrees">
        <line
          x1={apex.x - radius}
          y1={apex.y}
          x2={apex.x + radius}
          y2={apex.y}
          strokeDasharray="4 4"
          className="stroke-ink/25 dark:stroke-bone/25"
          strokeWidth={1.5}
        />
        {sectors.map((s) => (
          <motion.path
            key={`${playKey}-${s.id}`}
            d={sectorPath(apex, radius, s.from, s.to)}
            fill={VERTEX_COLORS[s.id]}
            fillOpacity={0.78}
            stroke="white"
            strokeWidth={1.5}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: s.delay, duration: 0.45, ease: "easeOut" }}
            style={{ transformOrigin: `${apex.x}px ${apex.y}px` }}
          />
        ))}
        <motion.text
          key={`${playKey}-label`}
          x={apex.x}
          y={apex.y + 32}
          textAnchor="middle"
          className="fill-ink dark:fill-bone font-mono text-[15px] font-semibold"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.75, duration: 0.4 }}
        >
          A + B + C = 180°
        </motion.text>
      </svg>
      <p className="mt-1 text-center text-xs text-ink-soft dark:text-bone-soft">
        Each corner, moved to share one point, lines up into a straight 180° angle — the Triangle Angle Sum Theorem.
      </p>
    </div>
  );
}
