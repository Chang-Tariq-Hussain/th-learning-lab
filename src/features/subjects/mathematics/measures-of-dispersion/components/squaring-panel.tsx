"use client";

import { useState } from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SQUARING_DATASET, deviations, formatNumber, mean } from "../dispersion-model";

/**
 * Level 3 — Why Square Deviations? Shows that raw deviations sum to
 * zero (positive and negative cancel), then a single toggle squares
 * every deviation so the sum becomes meaningful.
 */
export function SquaringPanel() {
  const [squared, setSquared] = useState(false);
  const m = mean(SQUARING_DATASET);
  const devs = deviations(SQUARING_DATASET, m);
  const displayValues = squared ? devs.map((d) => d * d) : devs;
  const sum = displayValues.reduce((s, v) => s + v, 0);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
      <p className="text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Dataset: {SQUARING_DATASET.join(", ")} — mean = {formatNumber(m)}
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {devs.map((d, i) => (
          <div
            key={i}
            className={cn(
              "flex h-14 w-16 flex-col items-center justify-center rounded-card border font-mono text-sm font-semibold transition-colors",
              !squared && d < 0 && "border-[#E0524F]/40 bg-[#E0524F]/10 text-[#E0524F]",
              !squared && d >= 0 && "border-[#3D5AFE]/40 bg-[#3D5AFE]/10 text-[#3D5AFE]",
              squared && "border-pine-500/40 bg-pine-50 text-pine-700 dark:border-pine-300/30 dark:bg-pine-900/20 dark:text-pine-300",
            )}
          >
            {squared ? (
              <>
                <span className="text-xs opacity-70">
                  ({d})²
                </span>
                <span>{d * d}</span>
              </>
            ) : (
              <span>
                {d > 0 ? "+" : ""}
                {d}
              </span>
            )}
          </div>
        ))}
      </div>

      <p className="font-mono text-sm text-ink dark:text-bone">
        Sum = {displayValues.map((v, i) => (i > 0 && v >= 0 ? `+ ${v}` : String(v))).join(" ")} = {formatNumber(sum)}
      </p>

      {!squared ? (
        <p className="rounded-card border border-line px-4 py-3 text-center text-sm leading-relaxed text-ink-soft dark:border-line-dark dark:text-bone-soft">
          The positive and negative deviations cancel each other out — the sum is always zero. Squaring fixes this.
        </p>
      ) : (
        <p className="rounded-card border border-pine-500/40 bg-pine-50 px-4 py-3 text-center text-sm leading-relaxed text-pine-700 dark:border-pine-300/30 dark:bg-pine-900/20 dark:text-pine-300">
          Now every value is positive, so the sum ({formatNumber(sum)}) actually tells us something about the spread.
        </p>
      )}

      <Button variant="primary" size="sm" onClick={() => setSquared((s) => !s)}>
        {squared ? "Show Original Deviations" : "Square the Deviations"}
        <ArrowDown className={cn("h-3.5 w-3.5 transition-transform", squared && "rotate-180")} strokeWidth={1.75} />
      </Button>
    </div>
  );
}
