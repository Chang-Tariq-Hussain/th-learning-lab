"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ValueNumberLine } from "../../central-tendency/components/value-number-line";
import {
  DISPERSION_OUTLIER_BASE,
  DISPERSION_OUTLIER_VALUE,
  formatNumber,
  mean,
  populationVariance,
  standardDeviation,
} from "../dispersion-model";

/**
 * Level 8 — Outliers. Toggling one extreme value into the dataset
 * shows standard deviation jump far more than the earlier Mean/Median
 * simulation's mean did — the same underlying idea, one level deeper.
 */
export function DispersionOutlierPanel() {
  const [showOutlier, setShowOutlier] = useState(false);
  const dataset = showOutlier ? [...DISPERSION_OUTLIER_BASE, DISPERSION_OUTLIER_VALUE] : DISPERSION_OUTLIER_BASE;
  const m = mean(dataset);
  const variance = populationVariance(dataset);
  const sd = standardDeviation(variance);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-5">
      <p className="text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Start with {DISPERSION_OUTLIER_BASE.join(", ")}, then add one extreme value: {DISPERSION_OUTLIER_VALUE}.
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setShowOutlier(false)}
          aria-pressed={!showOutlier}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            !showOutlier
              ? "border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
              : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft",
          )}
        >
          Without Outlier
        </button>
        <button
          type="button"
          onClick={() => setShowOutlier(true)}
          aria-pressed={showOutlier}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            showOutlier
              ? "border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
              : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft",
          )}
        >
          With Outlier
        </button>
      </div>

      <p className="font-mono text-sm text-ink dark:text-bone">Data: {dataset.join(", ")}</p>

      <ValueNumberLine values={dataset} markers={[{ value: m, label: "Mean", color: "#3D5AFE" }]} />

      <div className="grid w-full grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-1 rounded-card border border-line bg-white/60 px-3 py-3 text-center dark:border-line-dark dark:bg-white/[0.03]">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">Mean</p>
          <p className="font-display text-lg font-medium text-[#3D5AFE]">{formatNumber(m)}</p>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-card border border-line bg-white/60 px-3 py-3 text-center dark:border-line-dark dark:bg-white/[0.03]">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">Variance</p>
          <p className="font-display text-lg font-medium text-[#E8B923]">{formatNumber(variance)}</p>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-card border border-line bg-white/60 px-3 py-3 text-center dark:border-line-dark dark:bg-white/[0.03]">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">Std. Dev.</p>
          <p className="font-display text-lg font-medium text-[#E0524F]">{formatNumber(sd)}</p>
        </div>
      </div>

      <p className="rounded-card border border-line px-4 py-3 text-center text-sm leading-relaxed text-ink-soft dark:border-line-dark dark:text-bone-soft">
        Extreme values can greatly increase standard deviation — just like you saw with the mean in the Measures of
        Central Tendency simulation, one far-away point pulls hard on every calculation that uses it.
      </p>
    </div>
  );
}
