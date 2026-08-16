"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactionConfig, ReactionStep } from "../reaction-model";
import { getStepLabel } from "../reaction-model";

interface ReactionStepStatusProps {
  reaction: ReactionConfig;
  step: ReactionStep;
}

/** Small feedback pill, mirroring Molecule Builder's step status: reactants → approaching → breaking → rearranging → forming → products. */
export function ReactionStepStatus({
  reaction,
  step,
}: ReactionStepStatusProps) {
  return (
    <div className="flex justify-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
            step === 6
              ? "border-subject-chemistry/40 bg-subject-chemistry-soft text-subject-chemistry dark:bg-subject-chemistry/10"
              : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
          )}
        >
          {step === 6 ? (
            <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} />
          ) : null}
          {getStepLabel(reaction, step)}
          <span className="text-ink-soft/60 dark:text-bone-soft/60">
            · Step {step} of 6
          </span>
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
