"use client";

import { AnimatePresence, motion } from "framer-motion";
import { STAGES } from "../model";

export interface ExplanationPanelProps {
  stageIndex: number;
}

/** "Current Stage" + a one-sentence "What happens?" — updates automatically as the stage changes, per the spec. */
export function ExplanationPanel({ stageIndex }: ExplanationPanelProps) {
  const stage = STAGES[stageIndex] ?? STAGES[0]!;

  return (
    <div className="flex h-full flex-col gap-4 rounded-[1.75rem] border border-line bg-white/70 p-6 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">Current Stage</p>
        <AnimatePresence mode="wait">
          <motion.h2
            key={stage.id}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="mt-1 font-display text-xl font-medium text-ink dark:text-bone"
          >
            {stage.label}
          </motion.h2>
        </AnimatePresence>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-ink-soft/70 dark:text-bone-soft/70">What happens?</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={stage.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="mt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft"
          >
            {stage.explanation}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
