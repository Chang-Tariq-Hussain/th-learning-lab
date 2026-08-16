"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import type { StageInfo } from "../model";

export interface KeyConceptCalloutProps {
  stage: StageInfo;
}

/** Briefly highlights one of the two ideas the spec calls out as most important for students to remember — only rendered when the current stage has one. */
export function KeyConceptCallout({ stage }: KeyConceptCalloutProps) {
  return (
    <AnimatePresence>
      {stage.keyConcept ? (
        <motion.div
          key={stage.id}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="flex w-full max-w-2xl items-center gap-2.5 rounded-2xl border border-subject-biology/30 bg-subject-biology-soft px-4 py-2.5 text-sm font-medium text-subject-biology dark:border-subject-biology/30 dark:bg-subject-biology/10"
        >
          <Lightbulb className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          {stage.keyConcept}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
