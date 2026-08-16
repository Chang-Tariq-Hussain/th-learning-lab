"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactionStep } from "../reaction-model";
import { REACTION_STEP_EXPLANATION, REACTION_GENERAL_NOTE } from "../reaction-model";

interface ReactionExplanationProps {
  step: ReactionStep;
}

/** Small, beginner-friendly explanation area — a couple of short sentences, nothing more. */
export function ReactionExplanation({ step }: ReactionExplanationProps) {
  return (
    <div className="rounded-card border border-line bg-white/60 px-4 py-3 text-center dark:border-line-dark dark:bg-white/[0.03]">
      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft"
        >
          {REACTION_STEP_EXPLANATION[step]} {REACTION_GENERAL_NOTE}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
