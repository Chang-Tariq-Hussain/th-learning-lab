"use client";

import { ValueNumberLine } from "../../central-tendency/components/value-number-line";
import { SAME_MEAN_A, SAME_MEAN_B, formatNumber, mean } from "../dispersion-model";

/**
 * Level 1 — Center vs Spread. Two fixed datasets with an identical
 * mean but very different spread, shown on stacked number lines —
 * the foundational contrast the whole simulation builds on.
 */
export function CenterSpreadPanel() {
  const meanA = mean(SAME_MEAN_A);
  const meanB = mean(SAME_MEAN_B);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <p className="text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Both datasets below have the same mean. Do they have the same amount of variation?
      </p>

      <div className="flex flex-col gap-1">
        <p className="text-center font-mono text-xs uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">
          Dataset A — {SAME_MEAN_A.join(", ")}
        </p>
        <ValueNumberLine values={SAME_MEAN_A} markers={[{ value: meanA, label: "Mean", color: "#3D5AFE" }]} />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-center font-mono text-xs uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">
          Dataset B — {SAME_MEAN_B.join(", ")}
        </p>
        <ValueNumberLine values={SAME_MEAN_B} markers={[{ value: meanB, label: "Mean", color: "#3D5AFE" }]} />
      </div>

      <p className="rounded-card border border-line px-4 py-3 text-center text-sm leading-relaxed text-ink-soft dark:border-line-dark dark:text-bone-soft">
        Mean A = {formatNumber(meanA)}, Mean B = {formatNumber(meanB)} — the same. But Dataset A sits entirely at
        the mean, while Dataset B is spread far from it. <span className="font-semibold text-ink dark:text-bone">No, they don&apos;t have the same
        variation</span> — the mean tells us the center, but we also need a measure of spread.
      </p>
    </div>
  );
}
