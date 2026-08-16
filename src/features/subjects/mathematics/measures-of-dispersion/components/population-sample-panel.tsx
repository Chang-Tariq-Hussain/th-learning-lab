"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { FormulaCard } from "@/features/simulation/components/formula/formula-card";
import {
  POP_VS_SAMPLE_DATASET,
  formatNumber,
  populationVariance,
  sampleVariance,
  standardDeviation,
  type VarianceMode,
} from "../dispersion-model";

/**
 * Level 9 — Population vs Sample. A brief, deliberately light
 * introduction: the same dataset, computed both ways, so the only
 * new idea is dividing by n - 1 instead of N — nothing more advanced.
 */
export function PopulationSamplePanel() {
  const [mode, setMode] = useState<VarianceMode>("population");
  const dataset = POP_VS_SAMPLE_DATASET;
  const variance = mode === "population" ? populationVariance(dataset) : sampleVariance(dataset);
  const sd = standardDeviation(variance);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-5">
      <p className="text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        For a sample, variance is commonly calculated using n − 1 instead of N. Dataset: {dataset.join(", ")}
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("population")}
          aria-pressed={mode === "population"}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            mode === "population"
              ? "border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
              : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft",
          )}
        >
          Population
        </button>
        <button
          type="button"
          onClick={() => setMode("sample")}
          aria-pressed={mode === "sample"}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            mode === "sample"
              ? "border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
              : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft",
          )}
        >
          Sample
        </button>
      </div>

      <div className="grid w-full grid-cols-2 gap-3">
        <FormulaCard
          formula="\\sigma^2 = \\dfrac{\\sum (x - \\mu)^2}{N}"
          caption="Population"
          className={cn("transition-opacity", mode !== "population" && "opacity-40")}
        />
        <FormulaCard
          formula="s^2 = \\dfrac{\\sum (x - \\bar{x})^2}{n - 1}"
          caption="Sample"
          className={cn("transition-opacity", mode !== "sample" && "opacity-40")}
        />
      </div>

      <div className="grid w-full grid-cols-2 gap-3">
        <div className="flex flex-col items-center gap-1 rounded-card border border-line bg-white/60 px-3 py-3 text-center dark:border-line-dark dark:bg-white/[0.03]">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">Variance</p>
          <p className="font-display text-lg font-medium text-[#E8B923]">{formatNumber(variance)}</p>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-card border border-line bg-white/60 px-3 py-3 text-center dark:border-line-dark dark:bg-white/[0.03]">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">Std. Dev.</p>
          <p className="font-display text-lg font-medium text-[#E0524F]">{formatNumber(sd)}</p>
        </div>
      </div>
    </div>
  );
}
