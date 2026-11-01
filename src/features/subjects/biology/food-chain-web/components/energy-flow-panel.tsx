"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ENERGY_LADDER, organismById } from "../food-web-model";

interface EnergyFlowActionsProps {
  running: boolean;
  onPlayPause: () => void;
  onReset: () => void;
}

/** Start / Pause and Reset for the energy-flow particles: rendered in the sticky stage block. */
export function EnergyFlowActions({ running, onPlayPause, onReset }: EnergyFlowActionsProps) {
  return (
    <>
      <Button variant={running ? "secondary" : "primary"} size="md" onClick={onPlayPause}>
        {running ? (
          <>
            <Pause className="h-4 w-4" strokeWidth={1.75} />
            Pause
          </>
        ) : (
          <>
            <Play className="h-4 w-4" strokeWidth={1.75} />
            Start Energy Flow
          </>
        )}
      </Button>
      <Button variant="ghost" size="md" onClick={onReset}>
        <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
        Reset
      </Button>
    </>
  );
}

/** What the energy-flow particles mean, and the energy ladder. Sits with the controls. */
export function EnergyFlowPanel() {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-label uppercase tracking-[0.2em] text-subject-biology">Energy Flow</p>

      <p className="mt-3 text-center text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
        Watch small particles carry energy from the Sun through each organism in the chain.
      </p>

      <div className="mt-4">
        <p className="text-center font-mono text-label uppercase tracking-[0.2em] text-ink-soft/70 dark:text-bone-soft/70">
          Illustrative energy available
        </p>
        <div className="mt-2 flex flex-col items-center gap-0.5">
          {ENERGY_LADDER.map((step, i) => (
            <div key={step.id} className="flex flex-col items-center">
              <span className="rounded-full border border-ink/15 bg-white/70 px-3 py-1 text-xs font-medium text-ink dark:border-bone/20 dark:bg-white/[0.04] dark:text-bone">
                {organismById(step.id).label} · {step.label}
              </span>
              {i < ENERGY_LADDER.length - 1 ? (
                <span className="my-0.5 text-ink-soft/40 dark:text-bone-soft/40">↓</span>
              ) : null}
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
          Only a small portion of energy is transferred to the next trophic level. Much energy
          is used by organisms or lost as heat.
        </p>
      </div>
    </div>
  );
}
