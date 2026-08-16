"use client";

import { motion } from "framer-motion";
import { QUANTITY_COLORS } from "../colors";

export interface RatioBarProps {
  a: number;
  b: number;
}

/**
 * A single bar split into two colored segments proportional to a and
 * b. This is the visual crux of the whole toy: two ratios are
 * equivalent exactly when their bars split at the same point, no
 * matter how long each bar's numbers are — so "same split position"
 * becomes a direct stand-in for "same relationship."
 */
export function RatioBar({ a, b }: RatioBarProps) {
  const total = a + b;
  const percentA = total === 0 ? 50 : (a / total) * 100;
  const percentB = 100 - percentA;

  return (
    <div className="flex h-10 w-full overflow-hidden rounded-full border border-line shadow-sm dark:border-line-dark sm:h-12">
      <motion.div
        animate={{ width: `${percentA}%` }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        style={{ backgroundColor: QUANTITY_COLORS.a.hex }}
        className="flex items-center justify-center"
      >
        {percentA > 12 && (
          <span className="px-1 text-xs font-semibold text-white sm:text-sm">{a}</span>
        )}
      </motion.div>
      <motion.div
        animate={{ width: `${percentB}%` }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        style={{ backgroundColor: QUANTITY_COLORS.b.hex }}
        className="flex items-center justify-center"
      >
        {percentB > 12 && (
          <span className="px-1 text-xs font-semibold text-white sm:text-sm">{b}</span>
        )}
      </motion.div>
    </div>
  );
}
