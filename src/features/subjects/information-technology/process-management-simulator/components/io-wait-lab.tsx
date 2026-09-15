"use client";

import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw, StepForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { IO_WAIT_STEPS, type IoWaitPhase } from "../model";

const STEP_DURATION_MS = 2200;

function processAState(phase: IoWaitPhase) {
  switch (phase) {
    case "running":
      return { label: "Running", cls: "border-emerald-500 bg-emerald-500/10" };
    case "requested":
      return { label: "Running (requesting I/O)", cls: "border-amber-500 bg-amber-500/10" };
    case "blocked-other-runs":
      return { label: "Waiting / Blocked", cls: "border-rose-500 bg-rose-500/10" };
    case "io-complete":
      return { label: "I/O finished — still Blocked", cls: "border-amber-500 bg-amber-500/10" };
    case "ready-again":
      return { label: "Ready", cls: "border-sky-500 bg-sky-500/10" };
  }
}

function processBState(phase: IoWaitPhase) {
  const running = phase === "blocked-other-runs" || phase === "io-complete";
  return running
    ? { label: "Running (using the CPU while A waits)", cls: "border-emerald-500 bg-emerald-500/10" }
    : { label: "Ready", cls: "border-line dark:border-line-dark" };
}

export function IoWaitLab() {
  const [stepIndex, setStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const isFinished = stepIndex >= IO_WAIT_STEPS.length - 1;
  const current = stepIndex >= 0 ? IO_WAIT_STEPS[stepIndex] : null;

  useEffect(() => {
    if (!isPlaying) return;
    if (isFinished) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => setStepIndex((i) => Math.min(i + 1, IO_WAIT_STEPS.length - 1)), STEP_DURATION_MS);
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
    setStepIndex((i) => Math.min(i + 1, IO_WAIT_STEPS.length - 1));
  };
  const handleReset = () => {
    setIsPlaying(false);
    setStepIndex(-1);
  };

  const phase = current?.phase ?? "running";
  const aInfo = processAState(phase);
  const bInfo = processBState(phase);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3">
        <div className={cn("flex flex-col items-center gap-1 rounded-card border p-4 text-center", aInfo.cls)}>
          <p className="text-sm font-medium text-ink dark:text-bone">Process A</p>
          <p className="text-xs text-ink-soft dark:text-bone-soft">{aInfo.label}</p>
        </div>
        <div className={cn("flex flex-col items-center gap-1 rounded-card border p-4 text-center", bInfo.cls)}>
          <p className="text-sm font-medium text-ink dark:text-bone">Process B</p>
          <p className="text-xs text-ink-soft dark:text-bone-soft">{bInfo.label}</p>
        </div>
      </div>

      <div aria-live="polite" className="rounded-card bg-ink/[0.03] p-4 dark:bg-bone/[0.05]">
        {current ? (
          <div className="flex flex-col gap-1.5">
            <p className="font-mono text-xs uppercase tracking-wide text-subject-it">
              Step {stepIndex + 1} of {IO_WAIT_STEPS.length} · {current.title}
            </p>
            <p className="text-sm leading-relaxed text-ink dark:text-bone">{current.description}</p>
          </div>
        ) : (
          <p className="text-sm text-ink-soft dark:text-bone-soft">
            Press Start to watch Process A block on I/O while Process B gets a turn on the CPU.
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
      <p className="text-xs text-ink-soft dark:text-bone-soft">
        A blocked process uses no CPU time — that&apos;s why the OS can give Process B a turn instead of leaving the CPU idle.
      </p>
    </div>
  );
}
