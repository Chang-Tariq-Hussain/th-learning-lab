"use client";

import { AnimatePresence, motion } from "framer-motion";

export interface FinalResultProps {
  visible: boolean;
}

const FLOW_STEPS = ["1 Diploid Cell", "DNA Replication", "Meiosis I", "2 Cells", "Meiosis II", "4 Haploid Cells"];

/** Shown once Telophase II completes — the spec's full flow summary, kept to single words/short phrases per step. */
export function FinalResult({ visible }: FinalResultProps) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3 }}
          className="flex w-full max-w-2xl flex-col items-center gap-3 rounded-[1.75rem] border border-subject-biology/30 bg-subject-biology-soft px-6 py-5 text-center dark:border-subject-biology/30 dark:bg-subject-biology/10"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1">
            {FLOW_STEPS.map((step, i) => (
              <span key={step} className="flex items-center gap-1.5">
                <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-semibold text-subject-biology dark:bg-white/10">{step}</span>
                {i < FLOW_STEPS.length - 1 ? <span className="text-subject-biology/50">&rarr;</span> : null}
              </span>
            ))}
          </div>
          <p className="text-xs text-ink-soft dark:text-bone-soft">
            Each of the four cells has half the chromosome number of the original cell.
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
