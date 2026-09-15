"use client";

import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw, StepForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTEXT_SWITCH_OVERHEAD_NOTE, CONTEXT_SWITCH_STEPS } from "../model";

const STEP_DURATION_MS = 2200;

export function ContextSwitchLab() {
  const [stepIndex, setStepIndex] = useState(-1); // -1 = not started
  const [isPlaying, setIsPlaying] = useState(false);

  const isFinished = stepIndex >= CONTEXT_SWITCH_STEPS.length - 1;
  const current = stepIndex >= 0 ? CONTEXT_SWITCH_STEPS[stepIndex] : null;

  useEffect(() => {
    if (!isPlaying) return;
    if (isFinished) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => setStepIndex((i) => Math.min(i + 1, CONTEXT_SWITCH_STEPS.length - 1)), STEP_DURATION_MS);
    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, isFinished]);

  const handlePlayPause = () => {
    if (stepIndex === -1 || isFinished) {
      setStepIndex(0);
      setIsPlaying(true);
      return;
    }
    setIsPlaying((p) => !p);
  };

  const handleStep = () => {
    setIsPlaying(false);
    setStepIndex((i) => Math.min(i + 1, CONTEXT_SWITCH_STEPS.length - 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStepIndex(-1);
  };

  const onCpu = current?.onCpu ?? null;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3">
        <ProcessBox label="Process A" active={onCpu === "A"} />
        <ProcessBox label="Process B" active={onCpu === "B"} />
      </div>

      <div className="flex flex-col items-center gap-1 rounded-card border-2 border-dashed border-subject-it/50 bg-subject-it-soft/40 p-4 text-center dark:bg-subject-it/10">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subject-it">CPU</p>
        <p className="text-lg font-semibold text-ink dark:text-bone">{onCpu ? `Running Process ${onCpu}` : "Switching…"}</p>
      </div>

      <div aria-live="polite" className="rounded-card bg-ink/[0.03] p-4 dark:bg-bone/[0.05]">
        {current ? (
          <div className="flex flex-col gap-1.5">
            <p className="font-mono text-xs uppercase tracking-wide text-subject-it">
              Step {stepIndex + 1} of {CONTEXT_SWITCH_STEPS.length} · {current.title}
            </p>
            <p className="text-sm leading-relaxed text-ink dark:text-bone">{current.description}</p>
            <p className="mt-1 text-xs italic text-ink-soft dark:text-bone-soft">{current.savedContextNote}</p>
          </div>
        ) : (
          <p className="text-sm text-ink-soft dark:text-bone-soft">
            Press Start to walk through a context switch from Process A to Process B, step by step.
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handlePlayPause}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-subject-it px-4 text-sm font-medium text-paper hover:opacity-90"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {stepIndex === -1 ? "Start" : isFinished && !isPlaying ? "Replay" : isPlaying ? "Pause" : "Resume"}
        </button>
        <button
          onClick={handleStep}
          disabled={isFinished}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-3 text-sm font-medium text-ink hover:border-ink/40 disabled:opacity-40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40"
        >
          <StepForward className="h-4 w-4" />
          Step
        </button>
        <button
          onClick={handleReset}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-3 text-sm font-medium text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
      <p className="text-xs text-ink-soft dark:text-bone-soft">{CONTEXT_SWITCH_OVERHEAD_NOTE}</p>
    </div>
  );
}

function ProcessBox({ label, active }: { label: string; active: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 rounded-card border p-4 text-center transition-colors",
        active ? "border-emerald-500 bg-emerald-500/10" : "border-line dark:border-line-dark",
      )}
    >
      <p className="text-sm font-medium text-ink dark:text-bone">{label}</p>
      <p className="text-xs text-ink-soft dark:text-bone-soft">{active ? "Executing" : "Context saved in PCB"}</p>
    </div>
  );
}
