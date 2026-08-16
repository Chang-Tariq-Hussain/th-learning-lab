"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Dna, Shuffle, SplitSquareHorizontal } from "lucide-react";

export interface WhyItMattersProps {
  visible: boolean;
}

const REASONS = [
  { icon: Dna, text: "Meiosis produces haploid cells used in sexual reproduction." },
  { icon: SplitSquareHorizontal, text: "It reduces the chromosome number by half." },
  { icon: Shuffle, text: "Crossing over and the independent assortment of chromosomes create genetic variation." },
];

/** The spec's short "Why is meiosis important?" card — same brief-facts-list style as Cellular Respiration's explanation panel. */
export function WhyItMatters({ visible }: WhyItMattersProps) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex w-full max-w-2xl flex-col gap-3 rounded-[1.75rem] border border-line bg-white/70 p-6 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">Why is meiosis important?</p>
          <ul className="flex flex-col gap-3">
            {REASONS.map((reason, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-subject-biology-soft text-subject-biology dark:bg-subject-biology/15">
                  <reason.icon className="h-4 w-4" strokeWidth={2} />
                </span>
                <p className="pt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{reason.text}</p>
              </li>
            ))}
          </ul>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
