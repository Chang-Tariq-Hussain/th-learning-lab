"use client";

import { cn } from "@/lib/utils";

/**
 * One row of `den` equal cells, with the first `filled` of them
 * shaded — the basic visual unit every operation's visualization is
 * built from. `crossedFrom` optionally re-styles a trailing run of
 * already-filled cells as "removed" (used by the Subtraction
 * visualization to show cells being taken away rather than added).
 */
export function FractionBar({
  den,
  filled,
  crossedCount = 0,
  color,
  size = "md",
}: {
  den: number;
  filled: number;
  /** How many of the filled cells, counting from the end, are shown as removed. */
  crossedCount?: number;
  color: string;
  size?: "sm" | "md";
}) {
  const cellSize = size === "sm" ? "h-6 w-6 sm:h-7 sm:w-7" : "h-8 w-8 sm:h-9 sm:w-9";
  const keptFilled = Math.max(0, filled - crossedCount);

  return (
    <div className="flex gap-1" role="img" aria-label={`${filled} of ${den} parts shaded`}>
      {Array.from({ length: den }, (_, i) => {
        const isKept = i < keptFilled;
        const isCrossed = i >= keptFilled && i < filled;
        return (
          <div
            key={i}
            className={cn(
              cellSize,
              "flex items-center justify-center rounded-md border transition-colors",
              isKept
                ? "border-transparent"
                : isCrossed
                  ? "border-dashed border-subject-physics/60 bg-subject-physics/10"
                  : "border-line dark:border-line-dark",
            )}
            style={isKept ? { backgroundColor: color, borderColor: color } : undefined}
          >
            {isCrossed ? <span className="text-xs font-semibold text-subject-physics">×</span> : null}
          </div>
        );
      })}
    </div>
  );
}

/**
 * A fraction's amount can exceed one whole (e.g. an addition result
 * of 10/6). This renders one `FractionBar` per whole needed, filling
 * each completely before spilling into the next — the same "second
 * bar starts" idea as a mixed number's whole-number part.
 */
export function WholeBars({ den, totalFilled, color, size }: { den: number; totalFilled: number; color: string; size?: "sm" | "md" }) {
  const barCount = Math.max(1, Math.ceil(totalFilled / den));
  return (
    <div className="flex flex-col gap-1.5">
      {Array.from({ length: barCount }, (_, i) => {
        const filledInBar = Math.min(den, Math.max(0, totalFilled - i * den));
        return <FractionBar key={i} den={den} filled={filledInBar} color={color} size={size} />;
      })}
    </div>
  );
}
