"use client";

import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormulaCard } from "@/features/simulation/components/formula/formula-card";
import { VARIANCE_WALKTHROUGH_DATASET, deviations, formatNumber, mean, populationVariance, squaredDeviations } from "../dispersion-model";

const TOTAL_STEPS = 4;

/**
 * Level 4 — Variance. A guided [Next Step] reveal (folding in Section
 * 12's step workspace) over one dataset: find the mean, find each
 * deviation, square them, then average the squares to get variance.
 */
export function VariancePanel() {
  const [step, setStep] = useState(1);
  const dataset = VARIANCE_WALKTHROUGH_DATASET;
  const m = mean(dataset);
  const devs = deviations(dataset, m);
  const sq = squaredDeviations(dataset, m);
  const sumSq = sq.reduce((s, v) => s + v, 0);
  const variance = populationVariance(dataset);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-5">
      <p className="text-center text-sm text-ink-soft dark:text-bone-soft">
        Dataset: {dataset.join(", ")}
      </p>

      <FormulaCard formula="\\sigma^2 = \\dfrac{\\sum (x - \\mu)^2}{N}" caption="Population Variance" />

      <div className="flex w-full flex-col gap-3 text-sm text-ink dark:text-bone">
        <p>
          <span className="font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">Step 1 — Find the mean.</span>
          <br />
          Mean = ({dataset.join(" + ")}) ÷ {dataset.length} = {formatNumber(m)}
        </p>

        {step >= 2 ? (
          <p>
            <span className="font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">Step 2 — Find each deviation.</span>
            <br />
            {devs.map((d) => (d > 0 ? `+${d}` : String(d))).join(", ")}
          </p>
        ) : null}

        {step >= 3 ? (
          <p>
            <span className="font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">Step 3 — Square each deviation.</span>
            <br />
            {sq.join(", ")}
          </p>
        ) : null}

        {step >= 4 ? (
          <p>
            <span className="font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">Step 4 — Average the squared deviations.</span>
            <br />
            Sum = {sq.join(" + ")} = {sumSq}
            <br />
            Variance = {sumSq} ÷ {dataset.length} = {formatNumber(variance)}
          </p>
        ) : null}
      </div>

      {step >= 4 ? (
        <p className="rounded-card border border-pine-500/40 bg-pine-50 px-4 py-3 text-center text-sm text-pine-700 dark:border-pine-300/30 dark:bg-pine-900/20 dark:text-pine-300">
          Variance is the average of the squared deviations from the mean: {formatNumber(variance)}.
        </p>
      ) : null}

      <div className="flex gap-3">
        {step < TOTAL_STEPS ? (
          <Button variant="primary" size="sm" onClick={() => setStep((s) => Math.min(TOTAL_STEPS, s + 1))}>
            Next Step
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
          </Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
            Restart Steps
          </Button>
        )}
      </div>
    </div>
  );
}
