"use client";

import { ValueNumberLine } from "../../central-tendency/components/value-number-line";
import { HIGH_SPREAD_DATASET, LOW_SPREAD_DATASET, formatNumber, mean, populationVariance, standardDeviation } from "../dispersion-model";

function SpreadMeter({ sdA, sdB }: { sdA: number; sdB: number }) {
  const maxSd = Math.max(sdA, sdB) * 1.15 || 1;
  const percentFor = (v: number) => (v / maxSd) * 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">
        <span>Low Spread</span>
        <span>High Spread</span>
      </div>
      <div className="relative h-2 w-full rounded-full bg-gradient-to-r from-pine-500/30 via-amber-400/30 to-[#E0524F]/40">
        <div
          className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-pine-500 shadow-sm transition-all duration-300 dark:border-chalkboard"
          style={{ left: `${percentFor(sdA)}%` }}
        />
        <div
          className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#E0524F] shadow-sm transition-all duration-300 dark:border-chalkboard"
          style={{ left: `${percentFor(sdB)}%` }}
        />
      </div>
      <div className="flex justify-between font-mono text-xs text-ink-soft dark:text-bone-soft">
        <span>SD A = {formatNumber(sdA)}</span>
        <span>SD B = {formatNumber(sdB)}</span>
      </div>
    </div>
  );
}

/**
 * Level 7 — Low vs High Spread. Two synced number lines with the same
 * mean but very different standard deviations, plus a compact "spread
 * meter" (folding in Section 14) showing where each dataset's SD
 * lands on a low-to-high scale.
 */
export function SpreadComparisonPanel() {
  const meanA = mean(LOW_SPREAD_DATASET);
  const meanB = mean(HIGH_SPREAD_DATASET);
  const sdA = standardDeviation(populationVariance(LOW_SPREAD_DATASET));
  const sdB = standardDeviation(populationVariance(HIGH_SPREAD_DATASET));

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-center font-mono text-xs uppercase tracking-[0.15em] text-pine-600 dark:text-pine-300">
          Low Spread — {LOW_SPREAD_DATASET.join(", ")}
        </p>
        <ValueNumberLine
          values={LOW_SPREAD_DATASET}
          markers={[{ value: meanA, label: "Mean", color: "#3D5AFE" }]}
          band={{ from: meanA - sdA, to: meanA + sdA, color: "#2E9E6C" }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-center font-mono text-xs uppercase tracking-[0.15em] text-[#E0524F]">
          High Spread — {HIGH_SPREAD_DATASET.join(", ")}
        </p>
        <ValueNumberLine
          values={HIGH_SPREAD_DATASET}
          markers={[{ value: meanB, label: "Mean", color: "#3D5AFE" }]}
          band={{ from: meanB - sdB, to: meanB + sdB, color: "#E0524F" }}
        />
      </div>

      <SpreadMeter sdA={sdA} sdB={sdB} />

      <p className="rounded-card border border-line px-4 py-3 text-center text-sm leading-relaxed text-ink-soft dark:border-line-dark dark:text-bone-soft">
        Both datasets share a mean of {formatNumber(meanA)}, but a small standard deviation means the values cluster
        tightly around it, while a large one means they&apos;re spread far apart.
      </p>
    </div>
  );
}
