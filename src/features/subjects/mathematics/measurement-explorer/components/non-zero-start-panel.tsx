"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { RulerTrack } from "./ruler-track";
import { NON_ZERO_EXAMPLES } from "../measurement-model";

/**
 * Level 4 — Measuring from a Non-Zero Point. The most important
 * lesson in the simulation: an object that doesn't start at zero
 * still has Length = End − Start, not just "read the end."
 */
export function NonZeroStartPanel() {
  const [index, setIndex] = useState(0);
  const example = NON_ZERO_EXAMPLES[index]!;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
      <p className="text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        This object doesn&apos;t start at zero. What&apos;s its length? It&apos;s{" "}
        <span className="font-semibold text-ink dark:text-bone">not</span> just the ending number.
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {NON_ZERO_EXAMPLES.map((e, i) => (
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
            Example {i + 1}
          </button>
        ))}
      </div>

      <RulerTrack
        key={example.id}
        maxCm={example.maxCm}
        objectLengthCm={example.lengthCm}
        initialStartCm={example.startCm}
        draggable={false}
        showCalculation
      />
    </div>
  );
}
