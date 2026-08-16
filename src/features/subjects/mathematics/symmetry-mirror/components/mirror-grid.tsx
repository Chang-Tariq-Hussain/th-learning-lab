"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GRID_ROWS, GRID_COLS, LEFT_COLS, isLeftColumn, isFilled } from "../grid-model";

interface MirrorGridProps {
  filledLeft: ReadonlySet<string>;
  onToggleCell: (row: number, col: number) => void;
}

const FILL_COLOR = "#7C4FE0";

export function MirrorGrid({ filledLeft, onToggleCell }: MirrorGridProps) {
  return (
    <div
      className="relative grid gap-1.5 sm:gap-2"
      style={{ gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))` }}
      role="grid"
      aria-label="Symmetry grid — click a square on the left to mirror it on the right"
    >
      {/* Mirror line, centered between the two halves */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-subject-math/50"
        style={{ left: "50%" }}
      />

      {Array.from({ length: GRID_ROWS }, (_, row) =>
        Array.from({ length: GRID_COLS }, (_, col) => {
          const filled = isFilled(filledLeft, row, col);
          const interactive = isLeftColumn(col);
          return (
            <button
              key={`${row}-${col}`}
              type="button"
              disabled={!interactive}
              onClick={() => onToggleCell(row, col)}
              aria-label={
                interactive
                  ? `Row ${row + 1}, column ${col + 1}, ${filled ? "filled — click to clear" : "empty — click to fill"}`
                  : `Row ${row + 1}, mirrored square, ${filled ? "filled" : "empty"}`
              }
              className={cn(
                "aspect-square w-full rounded-lg border-2 transition-colors",
                interactive
                  ? "cursor-pointer border-line hover:border-subject-math/50 dark:border-line-dark"
                  : "cursor-default border-line/60 dark:border-line-dark/60",
                col === LEFT_COLS - 1 && "mr-0.5",
                col === LEFT_COLS && "ml-0.5"
              )}
            >
              {filled ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 22 }}
                  className="h-full w-full rounded-md"
                  style={{ backgroundColor: FILL_COLOR }}
                />
              ) : null}
            </button>
          );
        })
      )}
    </div>
  );
}
