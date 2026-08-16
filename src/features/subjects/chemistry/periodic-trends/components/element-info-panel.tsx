"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BUCKET_LABEL, TRENDS, getElementWhy, getScore, getScoreBucket, type ElementDef, type TrendId } from "../periodic-trends-model";

interface ElementInfoPanelProps {
  element: ElementDef | null;
  trend: TrendId;
}

export function ElementInfoPanel({ element, trend }: ElementInfoPanelProps) {
  const meta = TRENDS[trend];

  if (!element) {
    return (
      <div className="rounded-card border border-dashed border-line p-4 text-center text-sm text-ink-soft dark:border-line-dark dark:text-bone-soft">
        Click any element to see how it fits the selected trend.
      </div>
    );
  }

  const score = getScore(trend, element.symbol);
  const bucket = getScoreBucket(score);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${element.symbol}-${trend}`}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
        className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-lg font-medium text-ink dark:text-bone">{element.name}</p>
            <p className="font-mono text-xs text-ink-soft dark:text-bone-soft">Atomic number: {element.atomicNumber}</p>
          </div>
          <span
            className="rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide"
            style={{ background: `${meta.color}1f`, color: meta.color }}
          >
            {element.symbol}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-full border border-line px-3 py-1.5 text-xs dark:border-line-dark">
          <span className="text-ink-soft dark:text-bone-soft">Selected trend</span>
          <span className="font-medium text-ink dark:text-bone">{meta.label}</span>
        </div>

        <div className="mt-2 flex items-center justify-between rounded-full border border-line px-3 py-1.5 text-xs dark:border-line-dark">
          <span className="text-ink-soft dark:text-bone-soft">Trend position</span>
          <span className="font-medium text-ink dark:text-bone">{bucket ? BUCKET_LABEL[bucket] : "Not assigned"}</span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          <span className="font-medium text-ink dark:text-bone">Why? </span>
          {getElementWhy(trend, element)}
        </p>

        {element.isPredicted ? (
          <p className="mt-3 text-xs leading-relaxed text-ink-soft/80 dark:text-bone-soft/80">
            {element.name} is superheavy and decays almost instantly, so this position is a predicted estimate, not a measured value.
          </p>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}
