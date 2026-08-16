"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FormulaCard } from "@/features/simulation/components/formula/formula-card";
import { cn } from "@/lib/utils";
import { BALANCE_DATASET, MEAN_STEPS_DATASET, formatNumber, mean } from "../central-tendency-model";

const PRESETS: { id: string; label: string; dataset: number[] }[] = [
  { id: "even", label: "Even Spread", dataset: BALANCE_DATASET },
  { id: "skewed", label: "Skewed", dataset: [2, 3, 4, 5, 16] },
  { id: "clustered", label: "Clustered", dataset: [5, 6, 6, 7, 21] },
];

function BalanceScale({ values }: { values: number[] }) {
  const m = mean(values);
  const domainMin = Math.min(...values, m) - 1;
  const domainMax = Math.max(...values, m) + 1;
  const span = domainMax - domainMin;
  const percentFor = (v: number) => ((v - domainMin) / span) * 100;

  return (
    <div className="w-full px-6 pb-14 pt-10 sm:px-10">
      <div className="relative h-1 w-full rounded-full bg-ink/15 dark:bg-bone/20">
        {values.map((v, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 z-10 -translate-x-1/2 rounded-full bg-subject-math/70"
            style={{ width: 10 }}
            animate={{ left: `${percentFor(v)}%`, height: 14 + Math.abs(v - m) * 6 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
          >
            <motion.div
              className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-ink-soft dark:text-bone-soft"
            >
              {v}
            </motion.div>
          </motion.div>
        ))}

        <motion.div
          className="absolute top-full z-20 -translate-x-1/2"
          animate={{ left: `${percentFor(m)}%` }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
        >
          <div className="h-0 w-0 border-x-[9px] border-b-[14px] border-x-transparent border-b-amber-500" />
          <p className="mt-1 text-center font-mono text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            mean = {formatNumber(m)}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Level 2 — Mean. Section 2's balancing-point visualization (bars sit
 * on a beam, the fulcrum tracks the mean as the dataset changes) plus
 * Section 3's step-by-step sum -> count -> divide calculation with the
 * shared FormulaCard for the notation.
 */
export function MeanPanel() {
  const [presetId, setPresetId] = useState("even");
  const dataset = PRESETS.find((p) => p.id === presetId)!.dataset;

  const steps = MEAN_STEPS_DATASET;
  const sum = steps.reduce((s, v) => s + v, 0);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <div className="flex flex-col items-center gap-4">
        <p className="text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          The mean is the point where the data would balance — try each dataset and watch the fulcrum move.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPresetId(p.id)}
              aria-pressed={presetId === p.id}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                presetId === p.id
                  ? "border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
                  : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <BalanceScale values={dataset} />
      </div>

      <div className="flex flex-col gap-4 border-t border-line pt-6 dark:border-line-dark">
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">
          Step-by-step calculation
        </p>
        <FormulaCard formula="\\text{Mean} = \\dfrac{\\text{Sum of values}}{\\text{Number of values}}" />

        <div className="flex flex-col gap-2 text-sm text-ink dark:text-bone">
          <p>
            <span className="font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">Step 1 — Add the values.</span>
            <br />
            {steps.join(" + ")} = {sum}
          </p>
          <p>
            <span className="font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">Step 2 — Count the values.</span>
            <br />
            n = {steps.length}
          </p>
          <p>
            <span className="font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">Step 3 — Divide.</span>
            <br />
            Mean = {sum} ÷ {steps.length} = {formatNumber(sum / steps.length)}
          </p>
        </div>
      </div>
    </div>
  );
}
