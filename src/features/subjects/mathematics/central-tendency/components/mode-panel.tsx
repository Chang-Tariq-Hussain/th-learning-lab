"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { MODE_EXAMPLES, modes } from "../central-tendency-model";

function FrequencyChart({ dataset }: { dataset: number[] }) {
  const freq = new Map<number, number>();
  for (const v of dataset) freq.set(v, (freq.get(v) ?? 0) + 1);
  const distinct = [...freq.keys()].sort((a, b) => a - b);
  const maxCount = Math.max(...freq.values());
  const modeSet = new Set(modes(dataset));

  return (
    <div className="flex h-40 items-end justify-center gap-4">
      {distinct.map((v) => {
        const count = freq.get(v)!;
        const isMode = modeSet.has(v);
        return (
          <div key={v} className="flex flex-col items-center gap-1.5">
            <span className={cn("font-mono text-xs font-semibold", isMode ? "text-pine-600 dark:text-pine-300" : "text-ink-soft dark:text-bone-soft")}>
              {count}
            </span>
            <div
              className={cn("w-9 rounded-t-md transition-all duration-300", isMode ? "bg-pine-500" : "bg-ink/15 dark:bg-bone/20")}
              style={{ height: `${(count / maxCount) * 96 + 8}px` }}
            />
            <span className="font-mono text-xs text-ink dark:text-bone">{v}</span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Level 4 — Mode. Three preset datasets (one clear mode, no mode, and
 * bimodal) rendered as a frequency chart — the tallest, highlighted
 * bar(s) are the mode(s).
 */
export function ModePanel() {
  const [exampleId, setExampleId] = useState(MODE_EXAMPLES[0]!.id);
  const example = MODE_EXAMPLES.find((e) => e.id === exampleId)!;
  const modeValues = modes(example.dataset);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
      <p className="text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        The mode is the value that appears most often. Not every dataset has exactly one.
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {MODE_EXAMPLES.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => setExampleId(e.id)}
            aria-pressed={exampleId === e.id}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              exampleId === e.id
                ? "border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft",
            )}
          >
            {e.label}
          </button>
        ))}
      </div>

      <p className="font-mono text-sm text-ink dark:text-bone">Data: {example.dataset.join(", ")}</p>

      <FrequencyChart dataset={example.dataset} />

      <p
        className={cn(
          "rounded-card border px-4 py-2 text-sm",
          modeValues.length === 0
            ? "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft"
            : "border-pine-500/40 bg-pine-50 text-pine-700 dark:border-pine-300/30 dark:bg-pine-900/20 dark:text-pine-300",
        )}
      >
        {modeValues.length === 0 ? "No mode — every value appears exactly once." : `Mode: ${modeValues.join(", ")}`}
      </p>
    </div>
  );
}
