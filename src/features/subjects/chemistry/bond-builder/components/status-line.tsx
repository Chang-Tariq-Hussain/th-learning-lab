"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BondStage } from "../bond-model";
import { STATUS_TEXT } from "../bond-model";

interface StatusLineProps {
  stage: BondStage;
}

/** Small pill of visual feedback: "Atoms are separate." → "Electrons are moving…" → "Bond formed!" */
export function StatusLine({ stage }: StatusLineProps) {
  return (
    <div
      aria-live="polite"
      className="flex justify-center"
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={stage}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
            stage === "bonded"
              ? "border-subject-chemistry/40 bg-subject-chemistry-soft text-subject-chemistry dark:bg-subject-chemistry/10"
              : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft"
          )}
        >
          {stage === "bonded" ? <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} /> : null}
          {STATUS_TEXT[stage]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
