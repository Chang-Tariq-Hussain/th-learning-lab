"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { BondMode } from "../bond-model";
import { EXPLANATION } from "../bond-model";

interface ExplanationPanelProps {
  mode: BondMode;
}

/** Short, beginner-friendly explanation of the current bond type — deliberately just a couple of sentences, no deeper chemistry. */
export function ExplanationPanel({ mode }: ExplanationPanelProps) {
  const { title, points } = EXPLANATION[mode];

  return (
    <div className="rounded-card border border-line bg-white/60 p-5 dark:border-line-dark dark:bg-white/[0.03]">
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          <p className="font-display text-base font-medium text-ink dark:text-bone">{title}</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {points.map((point) => (
              <li key={point} className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
                • {point}
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
