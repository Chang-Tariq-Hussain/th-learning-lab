"use client";

import { cn } from "@/lib/utils";
import type { Fraction } from "../model";

/**
 * "Part of a part": a denA × denB grid where the top numA rows are
 * one shaded band, the left numB columns are a second shaded band,
 * and their overlap — numA × numB cells out of denA × denB total —
 * is the product, shaded darkest. This is the standard area model
 * for fraction multiplication.
 */
export function MultiplyVisual({ a, b }: { a: Fraction; b: Fraction }) {
  const rows = a.den;
  const cols = b.den;
  const cellPx = Math.max(14, Math.min(28, Math.floor(240 / Math.max(rows, cols))));

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="grid gap-[2px]"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellPx}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellPx}px)`,
        }}
        role="img"
        aria-label={`${a.num}/${a.den} times ${b.num}/${b.den}, shown as an overlapping grid`}
      >
        {Array.from({ length: rows * cols }, (_, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          const inRowBand = r < a.num;
          const inColBand = c < b.num;
          return (
            <div
              key={i}
              className={cn(
                "rounded-[2px] border border-line/60 dark:border-line-dark/60",
                inRowBand && inColBand
                  ? "bg-subject-math"
                  : inRowBand || inColBand
                    ? "bg-subject-math/25"
                    : "bg-transparent",
              )}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-4 text-xs text-ink-soft dark:text-bone-soft">
        <LegendSwatch className="bg-subject-math/25" label={`${a.num}/${a.den} alone`} />
        <LegendSwatch className="bg-subject-math" label={`${a.num}/${a.den} of ${b.num}/${b.den}`} />
      </div>
    </div>
  );
}

function LegendSwatch({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("h-3 w-3 rounded-sm", className)} />
      {label}
    </span>
  );
}
