"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { POTENTIAL_PHASES } from "../nervous-model";
import type { PotentialPhaseInfo } from "../types";
import { ActionPotentialGraph } from "./action-potential-graph";

interface ActionPotentialControlsProps {
  progress: number;
  running: boolean;
  started: boolean;
  phase: PotentialPhaseInfo;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function ActionPotentialControls({
  progress,
  running,
  started,
  phase,
  onStart,
  onPause,
  onReset,
}: ActionPotentialControlsProps) {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
        Fire the Neuron
      </p>

      <ActionPotentialGraph progress={progress} phase={phase} running={running || started} />

      <ol className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
        {POTENTIAL_PHASES.map((p) => (
          <li key={p.id}>
            <span
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                started && phase.id === p.id
                  ? "border-subject-biology bg-subject-biology text-paper dark:text-chalkboard"
                  : "border-ink/10 text-ink-soft/70 dark:border-bone/15 dark:text-bone-soft/60",
              )}
            >
              {p.label}
            </span>
          </li>
        ))}
      </ol>

      <p className="mt-3 min-h-[3rem] text-center text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
        {started
          ? phase.caption
          : "Press Fire Neuron to watch the membrane potential rise and fall through one action potential."}
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        {running ? (
          <Button variant="secondary" size="md" onClick={onPause}>
            <Pause className="h-4 w-4" strokeWidth={1.75} />
            Pause
          </Button>
        ) : (
          <Button variant="primary" size="md" onClick={onStart}>
            <Play className="h-4 w-4" strokeWidth={1.75} />
            {progress >= 1 ? "Fire Again" : started ? "Resume" : "Fire Neuron"}
          </Button>
        )}
        <Button variant="ghost" size="md" onClick={onReset}>
          <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
          Reset
        </Button>
      </div>
    </div>
  );
}
