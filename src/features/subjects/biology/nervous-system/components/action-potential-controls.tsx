"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { POTENTIAL_PHASES } from "../nervous-model";
import type { PotentialPhaseInfo } from "../types";
import { IonChannelInset } from "./action-potential-graph";

interface ActionPotentialActionsProps {
  progress: number;
  running: boolean;
  started: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

/** Fire / Pause / Reset: rendered in the sticky stage block so they stay reachable with the graph. */
export function ActionPotentialActions({ progress, running, started, onStart, onPause, onReset }: ActionPotentialActionsProps) {
  return (
    <>
      {running ? (
        <Button variant="secondary" size="md" onClick={onPause} className="min-w-28">
          <Pause className="h-4 w-4" strokeWidth={1.75} />
          Pause
        </Button>
      ) : (
        <Button variant="primary" size="md" onClick={onStart} className="min-w-28">
          <Play className="h-4 w-4" strokeWidth={1.75} />
          {progress >= 1 ? "Fire Again" : started ? "Resume" : "Fire Neuron"}
        </Button>
      )}
      <Button variant="ghost" size="md" onClick={onReset}>
        <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
        Reset
      </Button>
    </>
  );
}

interface ActionPotentialDetailsProps {
  started: boolean;
  phase: PotentialPhaseInfo;
}

/** Phase pills, caption and the ion-channel inset; they sit with the controls, beside / under the sticky graph. */
export function ActionPotentialDetails({ started, phase }: ActionPotentialDetailsProps) {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-label uppercase tracking-[0.2em] text-subject-biology">Fire the Neuron</p>

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

      <IonChannelInset phase={phase} />
    </div>
  );
}
