"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ValueNumberLine } from "./value-number-line";
import { formatNumber, mean, median } from "../central-tendency-model";

export interface OutlierComparisonPanelProps {
  intro: string;
  explanation: string;
  without: number[];
  withOutlier: number[];
}

/**
 * Shared toggle-based comparison used by both Level 6 (Outliers) and
 * Level 7 (Mean vs Median) — same "switch the dataset, watch mean and
 * median react differently" interaction, with different framing text
 * for each level per the brief's Sections 8 and 9.
 */
export function OutlierComparisonPanel({ intro, explanation, without, withOutlier }: OutlierComparisonPanelProps) {
  const [showOutlier, setShowOutlier] = useState(false);
  const dataset = showOutlier ? withOutlier : without;
  const m = mean(dataset);
  const med = median(dataset);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-5">
      <p className="text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{intro}</p>

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

      <ValueNumberLine values={dataset} markers={[{ value: m, label: "Mean", color: "#3D5AFE" }, { value: med, label: "Median", color: "#E8B923" }]} />

      <div className="grid w-full grid-cols-2 gap-3">
        <div className="flex flex-col items-center gap-1 rounded-card border border-line bg-white/60 px-3 py-3 text-center dark:border-line-dark dark:bg-white/[0.03]">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">Mean</p>
          <p className="font-display text-lg font-medium text-[#3D5AFE]">{formatNumber(m)}</p>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-card border border-line bg-white/60 px-3 py-3 text-center dark:border-line-dark dark:bg-white/[0.03]">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">Median</p>
          <p className="font-display text-lg font-medium text-[#E8B923]">{formatNumber(med)}</p>
        </div>
      </div>

      <p className="rounded-card border border-line px-4 py-3 text-center text-sm leading-relaxed text-ink-soft dark:border-line-dark dark:text-bone-soft">
        {explanation}
      </p>
    </div>
  );
}
