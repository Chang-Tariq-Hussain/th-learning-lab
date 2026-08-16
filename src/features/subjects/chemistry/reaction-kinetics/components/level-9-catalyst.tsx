"use client";

import { useState } from "react";
import { ReactionChamber } from "./reaction-chamber";
import { COLOR_A, COLOR_PRODUCT } from "../model";
import { cn } from "@/lib/utils";

function EnergyPath({ withCatalyst }: { withCatalyst: boolean }) {
  const peakY = withCatalyst ? 55 : 18;
  const d = `M 20 90 C 70 90, 80 ${peakY}, 130 ${peakY} S 190 60, 230 60`;
  return (
    <svg viewBox="0 0 250 110" className="w-full">
      <line x1="20" y1="100" x2="230" y2="100" stroke="currentColor" className="text-line dark:text-line-dark" strokeWidth={1} />
      <path d={d} fill="none" stroke={withCatalyst ? "#2E9E5B" : "#B24A3D"} strokeWidth={2.5} strokeLinecap="round" />
      <circle cx="20" cy="90" r="5" fill={COLOR_A} />
      <circle cx="230" cy="60" r="5" fill={COLOR_PRODUCT} />
      <text x="20" y="106" fontSize="9" textAnchor="middle" className="fill-ink-soft dark:fill-bone-soft font-mono">
        Reactants
      </text>
      <text x="230" y="106" fontSize="9" textAnchor="middle" className="fill-ink-soft dark:fill-bone-soft font-mono">
        Products
      </text>
      <text x="130" y={peakY - 8} fontSize="9" textAnchor="middle" className="fill-ink-soft dark:fill-bone-soft font-mono">
        Activation energy
      </text>
    </svg>
  );
}

/** Level 9 — catalysts introduced only conceptually, via a simplified energy-barrier sketch. */
export function Level9Catalyst() {
  const [withCatalyst, setWithCatalyst] = useState(false);
  const [chamberCatalyst, setChamberCatalyst] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <p className="max-w-2xl text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        A catalyst provides an alternative reaction pathway with lower activation energy. It is not consumed
        overall — it speeds the reaction up without becoming part of the final product count.
      </p>

      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setWithCatalyst(false)}
          className={cn(
            "rounded-full border px-4 py-1.5 font-mono text-sm font-medium transition-colors",
            !withCatalyst ? "border-transparent bg-white shadow-card dark:bg-white/[0.08]" : "border-line dark:border-line-dark"
          )}
        >
          Without Catalyst
        </button>
        <button
          type="button"
          onClick={() => setWithCatalyst(true)}
          className={cn(
            "rounded-full border px-4 py-1.5 font-mono text-sm font-medium transition-colors",
            withCatalyst ? "border-transparent bg-white shadow-card dark:bg-white/[0.08]" : "border-line dark:border-line-dark"
          )}
        >
          With Catalyst
        </button>
      </div>

      <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03] sm:p-5">
        <EnergyPath withCatalyst={withCatalyst} />
        <p className="mt-2 text-center text-sm text-ink-soft dark:text-bone-soft">
          {withCatalyst ? "Lower activation barrier — the same reaction, an easier path." : "Higher activation barrier to climb before products can form."}
        </p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => setChamberCatalyst((v) => !v)}
          className={cn(
            "rounded-full border px-4 py-1.5 font-mono text-sm font-medium transition-colors",
            chamberCatalyst ? "border-transparent bg-white shadow-card dark:bg-white/[0.08]" : "border-line dark:border-line-dark"
          )}
        >
          {chamberCatalyst ? "Catalyst Added" : "Add Catalyst to Chamber"}
        </button>
        <ReactionChamber
          key={chamberCatalyst ? "with" : "without"}
          numA={5}
          numB={5}
          tempC={45}
          catalyst={chamberCatalyst}
          label={chamberCatalyst ? "Chamber · With Catalyst" : "Chamber · No Catalyst"}
          className="w-full"
        />
      </div>
    </div>
  );
}
