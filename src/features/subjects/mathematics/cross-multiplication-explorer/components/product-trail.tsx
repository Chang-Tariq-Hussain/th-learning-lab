"use client";

import { AnimatePresence, motion } from "framer-motion";
import { DIAGONAL_COLORS } from "../colors";

export interface ProductTrailProps {
  a: number;
  b: number;
  c: number;
  d: number;
  stage: number;
}

/** The two "n × n = product" lines, each fading in once its diagonal has finished drawing. */
export function ProductTrail({ a, b, c, d, stage }: ProductTrailProps) {
  const showFirst = stage >= 2;
  const showSecond = stage >= 4;

  return (
    <div className="flex flex-col items-center gap-2.5 font-mono text-lg tabular-nums sm:flex-row sm:justify-center sm:gap-8">
      <Equation show={showFirst} color={DIAGONAL_COLORS.first.hex} left={a} right={d} />
      <Equation show={showSecond} color={DIAGONAL_COLORS.second.hex} left={b} right={c} />
    </div>
  );
}

function Equation({ show, color, left, right }: { show: boolean; color: string; left: number; right: number }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 24 }}
          className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5"
          style={{ backgroundColor: `${color}1A` }}
        >
          <span style={{ color }}>{left}</span>
          <span className="text-ink-soft dark:text-bone-soft">×</span>
          <span style={{ color }}>{right}</span>
          <span className="text-ink-soft dark:text-bone-soft">=</span>
          <span className="font-semibold" style={{ color }}>
            {left * right}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
