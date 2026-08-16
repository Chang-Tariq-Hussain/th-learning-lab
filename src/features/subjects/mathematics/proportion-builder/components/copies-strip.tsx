"use client";

import { motion } from "framer-motion";
import { RatioBar } from "./ratio-bar";

export interface CopiesStripProps {
  a: number;
  b: number;
  k: number;
}

/**
 * Once solved, this is the "why": Ratio 2 isn't a coincidence, it's
 * literally Ratio 1's bar laid down `k` times in a row. Tiling the
 * same proportion `k` times can never change how it splits — that's
 * the whole reason both sides stay equal, shown without a single
 * equation.
 */
export function CopiesStrip({ a, b, k }: CopiesStripProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center gap-3"
    >
      <p className="text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Ratio 2 is Ratio 1&apos;s bar copied{" "}
        <strong className="font-semibold text-ink dark:text-bone">{k} times</strong> in a row — copying the same
        split can never change it, so both sides stay equal.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {Array.from({ length: k }, (_, i) => (
          <div key={i} className="w-16">
            <RatioBar a={a} b={b} size="compact" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
