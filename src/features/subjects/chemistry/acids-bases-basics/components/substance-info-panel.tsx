"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CLASSIFICATION_COLOR,
  CLASSIFICATION_ION_NOTE,
  classificationLabel,
  type Substance,
} from "../acids-bases-model";
import { ParticleView } from "./particle-view";

interface SubstanceInfoPanelProps {
  substance: Substance | null;
}

export function SubstanceInfoPanel({ substance }: SubstanceInfoPanelProps) {
  if (!substance) {
    return (
      <div className="rounded-card border border-dashed border-line p-4 text-center text-sm text-ink-soft dark:border-line-dark dark:text-bone-soft">
        Click a substance above to see its approximate pH.
      </div>
    );
  }

  const color = CLASSIFICATION_COLOR[substance.classification];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={substance.slug}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
        className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-lg font-medium text-ink dark:text-bone">{substance.name}</p>
            <p className="font-mono text-xs text-ink-soft dark:text-bone-soft">
              pH: approximately {substance.approxPH}
            </p>
          </div>
          <span
            className="rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide"
            style={{ background: `${color}1f`, color }}
          >
            {classificationLabel(substance.classification)}
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{substance.blurb}</p>

        <p className="mt-2 font-mono text-xs" style={{ color }}>
          {CLASSIFICATION_ION_NOTE[substance.classification]}
        </p>

        <div className="mt-3">
          <ParticleView substance={substance} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
