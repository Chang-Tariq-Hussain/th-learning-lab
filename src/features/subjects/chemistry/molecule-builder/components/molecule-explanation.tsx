"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { MoleculeConfig } from "../molecule-model";
import { GENERAL_EXPLANATION } from "../molecule-model";

interface MoleculeExplanationProps {
  molecule: MoleculeConfig;
}

/** Small, beginner-friendly explanation area — a couple of short sentences, nothing more. */
export function MoleculeExplanation({ molecule }: MoleculeExplanationProps) {
  return (
    <div className="rounded-card border border-line bg-white/60 px-4 py-3 text-center dark:border-line-dark dark:bg-white/[0.03]">
      <AnimatePresence mode="wait">
        <motion.p
          key={molecule.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft"
        >
          {molecule.explanation} {GENERAL_EXPLANATION}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
