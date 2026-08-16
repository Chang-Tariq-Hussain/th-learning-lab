"use client";

import { useState } from "react";
import { ReactionChamber } from "./reaction-chamber";
import { StatReadout } from "./stat-readout";
import { formatRateLabel } from "../model";
import { cn } from "@/lib/utils";
import type { ChamberStats } from "../types";

const CONCENTRATION_STEPS = [2, 4, 6, 8, 10];
const SURFACE_AREA_BONUS = [0, 1, 2];

/** Level 10 — "Run Your Own Reaction": every factor together, clearly labeled as a simplified qualitative model. */
export function Level10Experiment() {
  const [concentrationIndex, setConcentrationIndex] = useState(2);
  const [tempC, setTempC] = useState(55);
  const [surfaceAreaIndex, setSurfaceAreaIndex] = useState(0);
  const [catalyst, setCatalyst] = useState(false);
  const [stats, setStats] = useState<ChamberStats | null>(null);

  const baseCount = CONCENTRATION_STEPS[concentrationIndex] ?? CONCENTRATION_STEPS[2]!;
  const surfaceBonus = SURFACE_AREA_BONUS[surfaceAreaIndex] ?? 0;
  const count = baseCount + surfaceBonus;

  const collisionsPerSecond =
    stats && stats.elapsed > 0.5
      ? (stats.successfulCollisions + stats.failedCollisions) / stats.elapsed
      : 0;
  const rate = stats && stats.elapsed > 0.5 ? stats.successfulCollisions / stats.elapsed : 0;
  const progress = stats ? Math.round((stats.productCount / count) * 100) : 0;

  return (
    <div className="flex flex-col gap-5">
      <p className="max-w-2xl text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Combine everything you&apos;ve explored. Adjust concentration, temperature, surface area, and the catalyst,
        then watch how the reaction responds.
      </p>
      <p className="rounded-card border border-line bg-white/40 p-3 text-xs leading-relaxed text-ink-soft dark:border-line-dark dark:bg-white/[0.02] dark:text-bone-soft">
        This is a simplified, qualitative visualization. Particle counts and rates here are for building intuition —
        they don&apos;t represent exact real-world reaction kinetics.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">
            <span>Low</span>
            <span className="text-ink dark:text-bone">Concentration</span>
            <span>High</span>
          </div>
          <input
            type="range"
            min={0}
            max={CONCENTRATION_STEPS.length - 1}
            step={1}
            value={concentrationIndex}
            onChange={(e) => setConcentrationIndex(Number(e.target.value))}
            className="mt-2 w-full accent-[#2E9E5B]"
          />
        </div>
        <div>
          <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">
            <span>20°C</span>
            <span className="text-ink dark:text-bone">Temperature — {tempC}°C</span>
            <span>100°C</span>
          </div>
          <input
            type="range"
            min={20}
            max={100}
            step={5}
            value={tempC}
            onChange={(e) => setTempC(Number(e.target.value))}
            className="mt-2 w-full accent-[#2E9E5B]"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {["Low", "Medium", "High"].map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setSurfaceAreaIndex(i)}
            className={cn(
              "rounded-full border px-4 py-1.5 font-mono text-sm font-medium transition-colors",
              surfaceAreaIndex === i
                ? "border-transparent bg-white shadow-card dark:bg-white/[0.08]"
                : "border-line dark:border-line-dark"
            )}
          >
            Surface Area: {label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setCatalyst((v) => !v)}
          className={cn(
            "rounded-full border px-4 py-1.5 font-mono text-sm font-medium transition-colors",
            catalyst ? "border-transparent bg-white shadow-card dark:bg-white/[0.08]" : "border-line dark:border-line-dark"
          )}
        >
          {catalyst ? "Catalyst: On" : "Catalyst: Off"}
        </button>
      </div>

      <ReactionChamber
        key={`experiment-${count}`}
        numA={count}
        numB={count}
        tempC={tempC}
        catalyst={catalyst}
        label="Your Reaction"
        onStats={setStats}
      />

      <StatReadout
        items={[
          { label: "Collision Frequency", value: `${collisionsPerSecond.toFixed(1)}/s` },
          { label: "Successful Collisions", value: stats?.successfulCollisions ?? 0, accent: "#5A9E6F" },
          { label: "Reaction Progress", value: `${Math.min(progress, 100)}%` },
          { label: "Relative Rate", value: formatRateLabel(rate) },
        ]}
      />
    </div>
  );
}
