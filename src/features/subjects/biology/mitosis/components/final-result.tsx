"use client";

import { AnimatePresence, motion } from "framer-motion";

export interface FinalResultProps {
  visible: boolean;
}

/** Shown once Cytokinesis completes — the spec's one-line takeaway, kept simple. */
export function FinalResult({ visible }: FinalResultProps) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3 }}
          className="flex w-full max-w-2xl flex-col items-center gap-1.5 rounded-[1.75rem] border border-subject-biology/30 bg-subject-biology-soft px-6 py-5 text-center dark:border-subject-biology/30 dark:bg-subject-biology/10"
        >
          <p className="text-sm font-semibold text-subject-biology">One parent cell &rarr; Two daughter cells</p>
          <p className="text-xs text-ink-soft dark:text-bone-soft">Each daughter cell receives a set of chromosomes.</p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
