"use client";

import { ValueNumberLine } from "./value-number-line";
import { RANGE_DATASET, formatNumber, range } from "../central-tendency-model";

/** Level 5 — Range. Minimum and maximum highlighted on the number line, with the arrow between them showing the distance the formula computes. */
export function RangePanel() {
  const min = Math.min(...RANGE_DATASET);
  const max = Math.max(...RANGE_DATASET);
  const minIndex = RANGE_DATASET.indexOf(min);
  const maxIndex = RANGE_DATASET.indexOf(max);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-5">
      <p className="text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Range tells us the difference between the largest and smallest values.
      </p>

      <p className="font-mono text-sm text-ink dark:text-bone">Data: {RANGE_DATASET.join(", ")}</p>

      <ValueNumberLine
        values={RANGE_DATASET}
        highlightIndices={new Set([minIndex, maxIndex])}
        highlightColor="#E0524F"
        rangeArrow={{ from: min, to: max }}
        markers={[
          { value: min, label: "Min", color: "#E0524F" },
          { value: max, label: "Max", color: "#E0524F" },
        ]}
      />

      <p className="font-mono text-sm text-ink dark:text-bone">
        Range = {max} − {min} = {formatNumber(range(RANGE_DATASET))}
      </p>
    </div>
  );
}
