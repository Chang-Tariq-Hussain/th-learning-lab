"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Reaction } from "../model";

interface ExplanationPanelProps {
  reaction: Reaction;
  stepIndex: number;
}

const STEP_LABELS = ["Before", "Highlight H⁺", "Transfer", "After", "Explanation"];

export function ExplanationPanel({ reaction, stepIndex }: ExplanationPanelProps) {
  const step = reaction.steps[stepIndex] ?? reaction.steps[0]!;

  return (
    <div className="flex flex-col gap-3 rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03] sm:p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">
        Step {stepIndex + 1} of 5 · {STEP_LABELS[stepIndex]}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${reaction.slug}-${stepIndex}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-3"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-soft/70 dark:text-bone-soft/70">What is happening?</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{step.what}</p>
          </div>
          <div className="rounded-2xl bg-subject-chemistry/10 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-subject-chemistry">Why?</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{step.why}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
