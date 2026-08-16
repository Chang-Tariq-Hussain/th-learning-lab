"use client";

import { motion } from "framer-motion";
import { DIAGONAL_COLORS } from "../colors";
import { NumberField } from "./number-field";

export interface CrossDiagramProps {
  a: number;
  b: number;
  c: number;
  d: number;
  onChangeA: (value: number) => void;
  onChangeB: (value: number) => void;
  onChangeC: (value: number) => void;
  onChangeD: (value: number) => void;
  /** 0 idle · 1 first diagonal drawing · 2 first done · 3 second diagonal drawing · 4 second done · 5 result revealed */
  stage: number;
}

// Logical coordinate space the diagram is authored in; the SVG and the
// absolutely-positioned HTML corners share these percentages so a line
// endpoint always lands exactly on its number field regardless of the
// container's rendered width.
const X_LEFT = 20;
const X_RIGHT = 80;
const Y_NUM = 25;
const Y_DEN = 75;
const Y_MID = 50;

export function CrossDiagram({ a, b, c, d, onChangeA, onChangeB, onChangeC, onChangeD, stage }: CrossDiagramProps) {
  const drawFirst = stage >= 1;
  const drawSecond = stage >= 3;
  const firstDone = stage >= 2;
  const secondDone = stage >= 4;

  return (
    <div className="relative mx-auto aspect-[5/2] w-full max-w-xl select-none">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        {/* First diagonal: a (top-left) × d (bottom-right) */}
        <motion.line
          x1={X_LEFT}
          y1={Y_NUM}
          x2={X_RIGHT}
          y2={Y_DEN}
          stroke={DIAGONAL_COLORS.first.hex}
          strokeWidth={0.8}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: drawFirst ? 1 : 0, opacity: drawFirst ? 1 : 0 }}
          transition={{ duration: 0.65, ease: "easeInOut" }}
        />
        {/* Second diagonal: b (bottom-left) × c (top-right) */}
        <motion.line
          x1={X_LEFT}
          y1={Y_DEN}
          x2={X_RIGHT}
          y2={Y_NUM}
          stroke={DIAGONAL_COLORS.second.hex}
          strokeWidth={0.8}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: drawSecond ? 1 : 0, opacity: drawSecond ? 1 : 0 }}
          transition={{ duration: 0.65, ease: "easeInOut" }}
        />
      </svg>

      <Corner leftPct={X_LEFT} topPct={Y_NUM} active={firstDone} color={DIAGONAL_COLORS.first.hex}>
        <NumberField value={a} onChange={onChangeA} color={DIAGONAL_COLORS.first.hex} label="Numerator a" />
      </Corner>
      <Corner leftPct={X_LEFT} topPct={Y_DEN} active={secondDone} color={DIAGONAL_COLORS.second.hex}>
        <NumberField value={b} onChange={onChangeB} color={DIAGONAL_COLORS.second.hex} label="Denominator b" />
      </Corner>
      <Corner leftPct={X_RIGHT} topPct={Y_NUM} active={secondDone} color={DIAGONAL_COLORS.second.hex}>
        <NumberField value={c} onChange={onChangeC} color={DIAGONAL_COLORS.second.hex} label="Numerator c" />
      </Corner>
      <Corner leftPct={X_RIGHT} topPct={Y_DEN} active={firstDone} color={DIAGONAL_COLORS.first.hex}>
        <NumberField value={d} onChange={onChangeD} color={DIAGONAL_COLORS.first.hex} label="Denominator d" />
      </Corner>

      {/* Fraction bars */}
      <div
        className="absolute h-[2px] w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/25 dark:bg-bone/25"
        style={{ left: `${X_LEFT}%`, top: `${Y_MID}%` }}
      />
      <div
        className="absolute h-[2px] w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/25 dark:bg-bone/25"
        style={{ left: `${X_RIGHT}%`, top: `${Y_MID}%` }}
      />

      {/* Equals sign, chipped so it stays legible over the crossing diagonals */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper px-2.5 py-1 font-display text-2xl font-medium text-ink shadow-card dark:bg-chalkboard dark:text-bone"
        style={{ left: "50%", top: `${Y_MID}%` }}
      >
        =
      </div>
    </div>
  );
}

function Corner({
  leftPct,
  topPct,
  active,
  color,
  children,
}: {
  leftPct: number;
  topPct: number;
  active: boolean;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl"
      style={{ left: `${leftPct}%`, top: `${topPct}%` }}
      animate={{
        boxShadow: active ? `0 0 0 3px ${color}33` : "0 0 0 0px transparent",
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
