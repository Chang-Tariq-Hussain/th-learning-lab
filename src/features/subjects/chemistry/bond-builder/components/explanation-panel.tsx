"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { BondMode, CovalentPairConfig, IonicPairConfig } from "../bond-model";
import { explanationFor } from "../bond-model";

interface ExplanationPanelProps {
  mode: BondMode;
  pair: IonicPairConfig | CovalentPairConfig;
}

/** Short, beginner-friendly explanation of the current bond type and pair — a few sentences, no deeper chemistry. */
export function ExplanationPanel({ mode, pair }: ExplanationPanelProps) {
  const { title, points } = explanationFor(mode, pair);

  return (
    <div className="rounded-card border border-line bg-white/60 p-5 dark:border-line-dark dark:bg-white/[0.03]">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${mode}-${pair.id}`}
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
