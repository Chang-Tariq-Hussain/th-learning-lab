"use client";

import { cn } from "@/lib/utils";
import { MULTIPLES_GRID_MAX } from "../model";

export interface MultiplesGridProps {
  base: number;
  /** Cells the student has tapped, correct or not. */
  tried: Set<number>;
  /** Cells confirmed correct (a subset of `tried`). */
  found: Set<number>;
  onTap: (cell: number) => void;
}

/** A 1..50 grid of tappable numbers. Tapping a true multiple of
 *  `base` locks it in green; tapping a non-multiple flashes red and
 *  can be retried. */
export function MultiplesGrid({ base, tried, found, onTap }: MultiplesGridProps) {
  const cells = Array.from({ length: MULTIPLES_GRID_MAX }, (_, i) => i + 1);

  return (
    <div
      className="grid grid-cols-5 gap-1.5 sm:grid-cols-10"
      role="group"
      aria-label={`Multiples of ${base} from 1 to ${MULTIPLES_GRID_MAX}`}
    >
      {cells.map((cell) => {
        const isFound = found.has(cell);
        const isWrongTry = tried.has(cell) && !isFound;
        return (
          <button
            key={cell}
            type="button"
            onClick={() => onTap(cell)}
            disabled={isFound}
            aria-pressed={isFound}
            className={cn(
              "flex h-9 items-center justify-center rounded-lg border font-mono text-xs font-medium transition-colors sm:h-10 sm:text-sm",
              isFound
                ? "border-subject-chemistry bg-subject-chemistry-soft text-subject-chemistry dark:bg-subject-chemistry/15"
                : isWrongTry
                  ? "border-subject-physics/50 bg-subject-physics/10 text-subject-physics"
                  : "border-line bg-white/70 text-ink hover:border-ink/30 dark:border-line-dark dark:bg-white/[0.04] dark:text-bone dark:hover:border-bone/30",
            )}
          >
            {cell}
          </button>
        );
      })}
    </div>
  );
}
