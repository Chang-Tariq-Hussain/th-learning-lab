"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { RulerTrack } from "./ruler-track";
import { READING_EXAMPLES } from "../measurement-model";

/** Level 3 — Reading the Ruler. Several fixed-length objects, cycled through, each starting from zero. */
export function ReadingRulerPanel() {
  const [index, setIndex] = useState(0);
  const example = READING_EXAMPLES[index]!;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
      <p className="text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Each object below sits at zero — read where it ends to find its length.
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {READING_EXAMPLES.map((e, i) => (
          <button
            key={e.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-pressed={i === index}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              i === index
                ? "border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft",
            )}
          >
            Object {i + 1}
          </button>
        ))}
      </div>

      <RulerTrack key={example.id} maxCm={example.maxCm} objectLengthCm={example.lengthCm} draggable={false} showCalculation />
    </div>
  );
}
