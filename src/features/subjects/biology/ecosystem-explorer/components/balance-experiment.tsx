"use client";

import { Droplets, Leaf, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BalanceExperimentProps {
  plantsRemoved: boolean;
  waterReduced: boolean;
  onToggleRemovePlants: () => void;
  onToggleReduceWater: () => void;
  onReset: () => void;
}

export function BalanceExperiment({
  plantsRemoved,
  waterReduced,
  onToggleRemovePlants,
  onToggleReduceWater,
  onReset,
}: BalanceExperimentProps) {
  const message = plantsRemoved
    ? "Plants are an important source of food and energy for many organisms."
    : waterReduced
      ? "Water is an abiotic factor that many organisms depend on."
      : null;

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
        Ecosystem Balance Experiment
      </p>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
        <Button
          variant={plantsRemoved ? "primary" : "secondary"}
          size="sm"
          onClick={onToggleRemovePlants}
        >
          <Leaf className="h-4 w-4" strokeWidth={1.75} />
          {plantsRemoved ? "Plants Removed" : "Remove Plants"}
        </Button>
        <Button
          variant={waterReduced ? "primary" : "secondary"}
          size="sm"
          onClick={onToggleReduceWater}
        >
          <Droplets className="h-4 w-4" strokeWidth={1.75} />
          {waterReduced ? "Water Reduced" : "Reduce Water"}
        </Button>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
          Reset Ecosystem
        </Button>
      </div>

      <p className="mt-3 min-h-[2.5rem] text-center text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
        {message ??
          "Try removing plants or reducing water to see how the rest of the ecosystem depends on them."}
      </p>
    </div>
  );
}
