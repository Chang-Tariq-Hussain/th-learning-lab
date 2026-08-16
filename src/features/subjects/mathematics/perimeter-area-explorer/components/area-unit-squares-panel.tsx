"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { UNIT_SQUARES_RECTANGLE, rectangleArea } from "../perimeter-area-model";

const STEP_MS = 90;

/** Level 4 — Area with Unit Squares. Counts the grid's unit squares one at a time to build the total. */
export function AreaUnitSquaresPanel() {
  const { length, width } = UNIT_SQUARES_RECTANGLE;
  const total = rectangleArea(length, width);
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (revealed === 0 || revealed >= total) return;
    const t = setTimeout(() => setRevealed((r) => r + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [revealed, total]);

  const start = () => setRevealed(1);
  const reset = () => setRevealed(0);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
      <p className="max-w-md text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Area can be found by counting equal-sized squares covering a surface — {length} columns × {width} rows.
      </p>

      <div
        className="mx-auto grid gap-0.5"
        style={{ gridTemplateColumns: `repeat(${length}, 32px)`, gridTemplateRows: `repeat(${width}, 32px)` }}
      >
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center justify-center rounded-[2px] border text-[10px] font-mono transition-colors duration-200",
              i < revealed
                ? "border-subject-math/40 bg-subject-math-soft text-subject-math dark:bg-subject-math/20"
                : "border-ink/10 bg-transparent text-transparent dark:border-bone/10",
            )}
          >
            {i < revealed ? i + 1 : ""}
          </div>
        ))}
      </div>

      <p className="font-mono text-lg text-ink dark:text-bone">
        {revealed >= total ? (
          <>
            {length} × {width} = <span className="text-subject-math">{total} square units</span>
          </>
        ) : (
          <span className="text-ink-soft dark:text-bone-soft">Counted {revealed} of {total} squares</span>
        )}
      </p>

      <div className="flex gap-2">
        <Button variant="primary" size="sm" onClick={start} disabled={revealed > 0 && revealed < total}>
          <Play className="h-3.5 w-3.5" strokeWidth={1.75} />
          {revealed > 0 ? "Count Again" : "Start Counting"}
        </Button>
        <Button variant="ghost" size="sm" onClick={reset}>
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
          Reset
        </Button>
      </div>
    </div>
  );
}
