"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { RectShape } from "./rect-shape";
import { rectangleArea, rectanglePerimeter, type RectangleOption } from "../perimeter-area-model";

export interface ComparisonGridProps {
  options: RectangleOption[];
  /** Which measure is held constant across every option ("perimeter" for Level 9, "area" for Level 10). */
  fixedMeasure: "perimeter" | "area";
  fixedValue: number;
  question: string;
  bestIndex: number;
  bestReason: string;
}

/**
 * Shared "several rectangles, one measure held constant, compare the
 * other" activity used by both Level 9 (same perimeter, different
 * area — pick the largest) and Level 10 (same area, different
 * perimeter — pick the smallest), since they're the same interaction
 * mirrored.
 */
export function ComparisonGrid({ options, fixedMeasure, fixedValue, question, bestIndex, bestReason }: ComparisonGridProps) {
  const [guess, setGuess] = useState<number | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6">
      <p className="max-w-md text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Every rectangle below has the same {fixedMeasure} —{" "}
        <span className="font-mono text-ink dark:text-bone">
          {fixedValue} {fixedMeasure === "perimeter" ? "units" : "square units"}
        </span>
        .
      </p>

      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
        {options.map((opt, i) => {
          const perimeter = rectanglePerimeter(opt.length, opt.width);
          const area = rectangleArea(opt.length, opt.width);
          const isGuess = guess === i;
          const isBest = guess !== null && i === bestIndex;

          return (
            <button
              key={i}
              type="button"
              onClick={() => setGuess(i)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-card border p-3 transition-colors",
                isBest
                  ? "border-pine-500 bg-pine-50 dark:border-pine-300 dark:bg-pine-900/20"
                  : isGuess
                    ? "border-amber-500 bg-amber-50 dark:border-amber-400 dark:bg-amber-900/15"
                    : "border-line hover:border-ink/30 dark:border-line-dark dark:hover:border-bone/30",
              )}
            >
              <RectShape length={opt.length} width={opt.width} fillArea boundaryReveal={1} maxPixelWidth={100} unitPx={16} />
              <p className="font-mono text-xs text-ink dark:text-bone">
                {opt.length} × {opt.width}
              </p>
              <p className="font-mono text-[11px] text-ink-soft dark:text-bone-soft">
                P={perimeter} A={area}
              </p>
              {isGuess ? (
                isBest ? (
                  <Check className="h-4 w-4 text-pine-600 dark:text-pine-300" strokeWidth={2.5} />
                ) : (
                  <X className="h-4 w-4 text-amber-600 dark:text-amber-400" strokeWidth={2.5} />
                )
              ) : null}
            </button>
          );
        })}
      </div>

      <p className="text-center text-sm font-medium text-ink dark:text-bone">{question}</p>

      {guess !== null ? (
        <p
          className={cn(
            "max-w-md rounded-card border px-4 py-3 text-center text-sm leading-relaxed",
            guess === bestIndex
              ? "border-pine-500/40 bg-pine-50 text-pine-700 dark:border-pine-300/30 dark:bg-pine-900/20 dark:text-pine-300"
              : "border-amber-500/40 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-900/15 dark:text-amber-300",
          )}
        >
          {guess === bestIndex ? "Correct! " : "Not quite — "}
          {bestReason}
        </p>
      ) : null}
    </div>
  );
}
