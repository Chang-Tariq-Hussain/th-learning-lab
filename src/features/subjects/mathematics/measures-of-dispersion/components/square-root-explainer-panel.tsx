"use client";

import { StateChain } from "../../applications-of-derivatives/components/state-chain";

const UNITS_FLOW = [
  { label: "Data in meters", tone: "neutral" as const },
  { label: "Variance in meters²", tone: "negative" as const },
  { label: "√ → back to meters", tone: "positive" as const },
];

/** Level 6 — Why Square Root? A short explanation of why standard deviation, not variance, matches the original units. */
export function SquareRootExplainerPanel() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6">
      <p className="text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Variance uses squared units. If the original data is measured in meters, variance is measured in square
        meters — a unit that doesn&apos;t mean much on its own.
      </p>

      <StateChain links={UNITS_FLOW} />

      <p className="rounded-card border border-line px-4 py-3 text-center text-sm leading-relaxed text-ink-soft dark:border-line-dark dark:text-bone-soft">
        Taking the square root returns the spread to the original units — that&apos;s why standard deviation is
        easier to interpret than variance.
      </p>
    </div>
  );
}
