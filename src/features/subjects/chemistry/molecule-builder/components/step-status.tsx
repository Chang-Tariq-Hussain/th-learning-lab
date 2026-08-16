"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BuildStep } from "../molecule-model";
import { STEP_STATUS } from "../molecule-model";

interface StepStatusProps {
  step: BuildStep;
}

/** Small feedback pill, mirroring Bond Builder's status line: separate → moving → bonding → complete. */
export function StepStatus({ step }: StepStatusProps) {
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
            step === 4
              ? "border-subject-chemistry/40 bg-subject-chemistry-soft text-subject-chemistry dark:bg-subject-chemistry/10"
              : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
          )}
        >
          {step === 4 ? (
            <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} />
          ) : null}
          {STEP_STATUS[step]}
          <span className="text-ink-soft/60 dark:text-bone-soft/60">
            · Step {step} of 4
          </span>
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
