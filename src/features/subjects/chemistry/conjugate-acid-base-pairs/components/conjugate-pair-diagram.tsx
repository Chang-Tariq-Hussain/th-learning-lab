"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ACID_COLOR, BASE_COLOR, type ConjugatePair } from "../model";

interface ConjugatePairDiagramProps {
  pair: ConjugatePair | null;
  selectedMember: "acid" | "base" | null;
}

/** The spec's most important visual: an acid pill and its conjugate-base pill, one proton apart in either direction. */
export function ConjugatePairDiagram({ pair, selectedMember }: ConjugatePairDiagramProps) {
  if (!pair) {
    return (
      <div className="flex h-56 items-center justify-center rounded-card border border-dashed border-line p-4 text-center text-sm text-ink-soft dark:border-line-dark dark:text-bone-soft">
        Pick a molecule above to see its conjugate partner.
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pair.slug}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
        className="flex h-56 flex-col items-center justify-center gap-2 rounded-card border border-line bg-white/40 p-4 dark:border-line-dark dark:bg-white/[0.02]"
      >
        <Pill formula={pair.acid} color={ACID_COLOR} label="Acid" emphasized={selectedMember === "acid"} />

        <div className="flex items-center gap-6 font-mono text-xs text-ink-soft dark:text-bone-soft">
          <span className="flex flex-col items-center">
            <span aria-hidden>&darr;</span>
            <span>&minus; H⁺</span>
          </span>
          <span className="flex flex-col items-center">
            <span aria-hidden>&uarr;</span>
            <span>+ H⁺</span>
          </span>
        </div>

        <Pill formula={pair.conjugateBase} color={BASE_COLOR} label="Conjugate Base" emphasized={selectedMember === "base"} />

        <p className="mt-2 text-center text-xs text-ink-soft/70 dark:text-bone-soft/60">These two differ by exactly one proton.</p>
      </motion.div>
    </AnimatePresence>
  );
}

function Pill({ formula, color, label, emphasized }: { formula: string; color: string; label: string; emphasized: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className="rounded-full border-2 px-4 py-1.5 font-mono text-sm font-semibold transition-transform"
        style={{
          borderColor: color,
          color: emphasized ? "#FFFBF6" : color,
          background: emphasized ? color : `${color}14`,
          transform: emphasized ? "scale(1.08)" : "scale(1)",
        }}
      >
        {formula}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-wide" style={{ color }}>
        {label}
      </span>
    </div>
  );
}
