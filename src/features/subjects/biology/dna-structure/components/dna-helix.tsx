"use client";

import type { KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { BASE_COLORS } from "../model";
import type { Base } from "../types";

export interface DnaHelixProps {
  sequence: Base[];
  filled: (Base | null)[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

const SPACING = 62;
const MARGIN_X = 56;
const VIEW_HEIGHT = 210;
const TOP_Y = 60;
const BOTTOM_Y = 150;
const WAVE_AMPLITUDE = 9;
const PILL_R = 17;

interface Point {
  x: number;
  y: number;
}

/** Connects a run of points with a gently smoothed curve — enough to read as a "curved strand" without a full spline library. */
function smoothPath(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0]!.x} ${points[0]!.y}`;

  let d = `M ${points[0]!.x} ${points[0]!.y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const current = points[i]!;
    const next = points[i + 1]!;
    const midX = (current.x + next.x) / 2;
    const midY = (current.y + next.y) / 2;
    d += ` Q ${current.x} ${current.y} ${midX} ${midY}`;
  }
  const last = points[points.length - 1]!;
  d += ` L ${last.x} ${last.y}`;
  return d;
}

/**
 * A single clickable base — filled (a revealed letter) or blank (an
 * unanswered "?"). Reuses the click/keyboard + glow-when-selected
 * pattern already shipped in Cell Explorer's `OrganelleHotspot`,
 * duplicated locally to keep this feature self-contained.
 */
function BasePill({
  x,
  y,
  base,
  isSelected,
  label,
  onSelect,
}: {
  x: number;
  y: number;
  base: Base | null;
  isSelected: boolean;
  label: string;
  onSelect: () => void;
}) {
  const handleKeyDown = (e: KeyboardEvent<SVGGElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect();
    }
  };

  const fill = base ? BASE_COLORS[base] : "none";

  return (
    <motion.g
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={isSelected}
      style={{
        transformBox: "fill-box",
        transformOrigin: "50% 50%",
        cursor: "pointer",
        filter: isSelected ? "drop-shadow(0 0 4px rgba(255,255,255,0.9)) drop-shadow(0 0 10px rgba(13,148,136,0.7))" : "none",
      }}
      animate={{ scale: isSelected ? 1.14 : 1 }}
      transition={{ type: "spring", stiffness: 340, damping: 22 }}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
    >
      <circle
        cx={x}
        cy={y}
        r={PILL_R}
        fill={fill}
        stroke={base ? "#FFFFFF" : "#94A3B8"}
        strokeWidth={base ? 2 : 2}
        strokeDasharray={base ? undefined : "3 3"}
        fillOpacity={base ? 1 : 0.15}
      />
      <text
        x={x}
        y={y + 5}
        textAnchor="middle"
        fontSize={base ? 15 : 16}
        fontWeight={700}
        fill={base ? "#FFFFFF" : "#64748B"}
      >
        {base ?? "?"}
      </text>
    </motion.g>
  );
}

/**
 * Purely presentational: a horizontal ladder of base pairs with a
 * gently wavy backbone on each strand. Position/state of every base
 * comes straight from `sequence` and `filled`, no internal state or
 * physics — same "plain lookup, no simulation" spirit as the rest of
 * the biology visualizations here.
 */
export function DnaHelix({ sequence, filled, selectedIndex, onSelect }: DnaHelixProps) {
  const width = MARGIN_X * 2 + (sequence.length - 1) * SPACING;

  const topPoints: Point[] = sequence.map((_, i) => ({
    x: MARGIN_X + i * SPACING,
    y: TOP_Y + WAVE_AMPLITUDE * Math.sin(i * 1.1),
  }));
  const bottomPoints: Point[] = sequence.map((_, i) => ({
    x: MARGIN_X + i * SPACING,
    y: BOTTOM_Y - WAVE_AMPLITUDE * Math.sin(i * 1.1),
  }));

  return (
    <svg
      viewBox={`0 0 ${width} ${VIEW_HEIGHT}`}
      className="h-full w-full"
      role="img"
      aria-label="A DNA double helix shown as a ladder of base pairs"
    >
      {/* Sugar-phosphate backbone, top and bottom strand */}
      <path d={smoothPath(topPoints)} fill="none" stroke="#0D9488" strokeWidth={4} strokeLinecap="round" />
      <path d={smoothPath(bottomPoints)} fill="none" stroke="#0D9488" strokeWidth={4} strokeLinecap="round" />

      {/* Rungs connecting each base pair */}
      {sequence.map((_, i) => {
        const top = topPoints[i]!;
        const bottom = bottomPoints[i]!;
        const isFilled = filled[i] !== null;
        const isSelected = selectedIndex === i;
        return (
          <line
            key={i}
            x1={top.x}
            y1={top.y}
            x2={bottom.x}
            y2={bottom.y}
            stroke={isSelected ? "#0D9488" : isFilled ? "#94A3B8" : "#CBD5E1"}
            strokeWidth={isSelected ? 4 : 2.5}
            strokeDasharray={isFilled ? undefined : "4 4"}
          />
        );
      })}

      {/* Top strand: the given sequence */}
      {sequence.map((base, i) => (
        <BasePill
          key={`top-${i}`}
          x={topPoints[i]!.x}
          y={topPoints[i]!.y}
          base={base}
          isSelected={selectedIndex === i}
          label={`Position ${i + 1}, given base ${base}`}
          onSelect={() => onSelect(i)}
        />
      ))}

      {/* Bottom strand: the student-built complementary strand */}
      {sequence.map((_, i) => (
        <BasePill
          key={`bottom-${i}`}
          x={bottomPoints[i]!.x}
          y={bottomPoints[i]!.y}
          base={filled[i] ?? null}
          isSelected={selectedIndex === i}
          label={
            filled[i]
              ? `Position ${i + 1}, complementary base ${filled[i]}`
              : `Position ${i + 1}, not yet answered`
          }
          onSelect={() => onSelect(i)}
        />
      ))}
    </svg>
  );
}
