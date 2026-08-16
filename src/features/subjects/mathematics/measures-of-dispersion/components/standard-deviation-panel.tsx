"use client";

import { StateChain } from "../../applications-of-derivatives/components/state-chain";
import { ValueNumberLine } from "../../central-tendency/components/value-number-line";
import { FormulaCard } from "@/features/simulation/components/formula/formula-card";
import { VARIANCE_WALKTHROUGH_DATASET, formatNumber, mean, populationVariance, standardDeviation } from "../dispersion-model";

const FLOW = [
  { label: "Deviations", tone: "neutral" as const },
  { label: "Square", tone: "neutral" as const },
  { label: "Average", tone: "neutral" as const },
  { label: "Variance", tone: "neutral" as const },
  { label: "Square Root", tone: "neutral" as const },
  { label: "Std. Deviation", tone: "positive" as const },
];

/**
 * Level 5 — Standard Deviation. Continues directly from variance
 * (Section 5), using the shared `StateChain` to show the full
 * deviations -> square -> average -> variance -> square root -> SD
 * pipeline, then folds in Section 7's spread-band visualization on
 * the number line.
 */
export function StandardDeviationPanel() {
  const dataset = VARIANCE_WALKTHROUGH_DATASET;
  const m = mean(dataset);
  const variance = populationVariance(dataset);
  const sd = standardDeviation(variance);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
      <StateChain links={FLOW} />

      <p className="text-center text-sm text-ink-soft dark:text-bone-soft">
        Dataset: {dataset.join(", ")} — Variance = {formatNumber(variance)}
      </p>

      <FormulaCard formula={`\\sigma = \\sqrt{\\sigma^2} = \\sqrt{${formatNumber(variance)}} \\approx ${formatNumber(sd)}`} caption="Standard Deviation" />

      <ValueNumberLine
        values={dataset}
        markers={[{ value: m, label: "Mean", color: "#3D5AFE" }]}
        band={{ from: m - sd, to: m + sd, color: "#3D5AFE", label: "About one standard deviation from the mean" }}
      />
    </div>
  );
}
