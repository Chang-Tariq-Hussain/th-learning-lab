"use client";

import { motion } from "framer-motion";
import { QUANTITY_COLORS } from "../colors";

export interface RatioBarProps {
  a: number;
  b: number;
  /** "compact" drops the in-bar number labels for use as a small repeated tile. */
  size?: "default" | "compact";
}

/**
 * A bar split into two colored segments proportional to a and b. Two
 * ratios are equivalent exactly when their bars split at the same
 * point, no matter how long each bar's numbers are — so "same split
 * position" is the direct visual stand-in for "these stay equal."
 */
export function RatioBar({ a, b, size = "default" }: RatioBarProps) {
  const total = a + b;
  const percentA = total === 0 ? 50 : (a / total) * 100;
  const percentB = 100 - percentA;
  const showLabels = size === "default";

  return (
    <div
      className={
        showLabels
          ? "flex h-10 w-full overflow-hidden rounded-full border border-line shadow-sm dark:border-line-dark sm:h-12"
          : "flex h-5 w-full overflow-hidden rounded-full border border-line dark:border-line-dark"
      }
    >
      <motion.div
        animate={{ width: `${percentA}%` }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        style={{ backgroundColor: QUANTITY_COLORS.first.hex }}
        className="flex items-center justify-center"
      >
        {showLabels && percentA > 12 && (
          <span className="px-1 text-xs font-semibold text-white sm:text-sm">{a}</span>
        )}
      </motion.div>
      <motion.div
        animate={{ width: `${percentB}%` }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        style={{ backgroundColor: QUANTITY_COLORS.second.hex }}
        className="flex items-center justify-center"
      >
        {showLabels && percentB > 12 && (
          <span className="px-1 text-xs font-semibold text-white sm:text-sm">{b}</span>
        )}
      </motion.div>
    </div>
  );
}
