"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ConjugatePair } from "../model";

interface ExplanationPanelProps {
  pair: ConjugatePair | null;
  selectedMember: "acid" | "base" | null;
}

export function ExplanationPanel({ pair, selectedMember }: ExplanationPanelProps) {
  if (!pair || !selectedMember) {
    return (
      <div className="flex h-full items-center justify-center rounded-card border border-dashed border-line p-4 text-center text-sm text-ink-soft dark:border-line-dark dark:text-bone-soft">
        Click a molecule to see what happened and why.
      </div>
    );
  }

  const what =
    selectedMember === "acid"
      ? `${pair.acid} lost a proton.`
      : `${pair.conjugateBase} gained a proton.`;

  const why =
    selectedMember === "acid"
      ? `After losing H⁺, it becomes its conjugate base, ${pair.conjugateBase}.`
      : `After gaining H⁺, it becomes its conjugate acid, ${pair.acid}.`;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${pair.slug}-${selectedMember}`}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
        className="flex h-full flex-col gap-3 rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]"
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft/70 dark:text-bone-soft/70">What happened?</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{what}</p>
        </div>
        <div className="rounded-2xl bg-subject-chemistry/10 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-subject-chemistry">Why?</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{why}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
