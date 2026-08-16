"use client";

import { Fragment } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface MitosisComparisonProps {
  visible: boolean;
}

const ROWS: Array<[string, string, string]> = [
  ["Starting cells", "1", "1"],
  ["Final cells", "2", "4"],
  ["Chromosome number", "Same", "Half"],
  ["Main purpose", "Growth", "Sexual reproduction"],
];

/** The spec's short Mitosis-vs-Meiosis comparison, linking back to the existing Mitosis simulation rather than duplicating it. */
export function MitosisComparison({ visible }: MitosisComparisonProps) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex w-full max-w-2xl flex-col gap-3 rounded-[1.75rem] border border-line bg-white/70 p-6 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]"
        >
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">Compare with Mitosis</p>
            <Link
              href="/dashboard/biology/mitosis"
              className="flex items-center gap-1 text-xs font-medium text-subject-biology transition-colors hover:text-pine-700 dark:hover:text-pine-300"
            >
              Open Mitosis
              <ArrowRight className="h-3 w-3" strokeWidth={2} />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-y-2 text-sm">
            <span className="text-ink-soft/60 dark:text-bone-soft/50" />
            <span className="text-center font-semibold text-ink dark:text-bone">Mitosis</span>
            <span className="text-center font-semibold text-subject-biology">Meiosis</span>
            {ROWS.map(([label, mitosisValue, meiosisValue]) => (
              <Fragment key={label}>
                <span className="text-ink-soft dark:text-bone-soft">{label}</span>
                <span className="text-center text-ink-soft dark:text-bone-soft">{mitosisValue}</span>
                <span className="text-center font-medium text-ink dark:text-bone">{meiosisValue}</span>
              </Fragment>
            ))}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
