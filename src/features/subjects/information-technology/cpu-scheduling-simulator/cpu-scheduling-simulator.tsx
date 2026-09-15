"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ProcessEditor } from "./components/process-editor";
import { CpuQueueView } from "./components/cpu-queue-view";
import { GanttChart } from "./components/gantt-chart";
import { MetricsPanel } from "./components/metrics-panel";
import { ComparisonView } from "./components/comparison-view";
import { StarvationLab } from "./components/starvation-lab";
import {
  ALGORITHM_INFO,
  DEFAULT_PROCESSES,
  DEFAULT_QUANTUM,
  runScheduler,
  SCHEDULING_DISCLAIMER,
  type SchedulingAlgorithm,
  type SimProcess,
} from "./model";

type LabMode = "simulate" | "compare" | "starvation";

const LAB_MODES: { id: LabMode; label: string; blurb: string }[] = [
  {
    id: "simulate",
    label: "Scheduling Lab",
    blurb: "Pick an algorithm, edit the process set, and step through the CPU deciding who runs next.",
  },
  {
    id: "compare",
    label: "Compare Algorithms",
    blurb: "Run FCFS, SJF, Round Robin, and Priority on the exact same process set, side by side.",
  },
  {
    id: "starvation",
    label: "Starvation Lab",
    blurb: "See a low-priority process get starved under Priority Scheduling — then fix it with aging.",
  },
];

const ALGORITHMS: SchedulingAlgorithm[] = ["fcfs", "sjf", "round-robin", "priority"];

export function CpuSchedulingSimulator() {
  const [mode, setMode] = useState<LabMode>("simulate");
  const [processes, setProcesses] = useState<SimProcess[]>(DEFAULT_PROCESSES);
  const [algorithm, setAlgorithm] = useState<SchedulingAlgorithm>("fcfs");
  const [quantum, setQuantum] = useState(DEFAULT_QUANTUM);
  const [agingEnabled, setAgingEnabled] = useState(false);

  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const result = useMemo(
    () => runScheduler(processes, algorithm, quantum, { agingEnabled, agingInterval: 4 }),
    [processes, algorithm, quantum, agingEnabled],
  );
  const isFinished = currentTime !== null && currentTime >= result.totalTime;

  // Any change to the inputs invalidates the current playback run.
  useEffect(() => {
    setCurrentTime(null);
    setIsPlaying(false);
  }, [processes, algorithm, quantum, agingEnabled]);

  useEffect(() => {
    if (!isPlaying) return;
    if (currentTime !== null && currentTime >= result.totalTime) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setCurrentTime((t) => Math.min((t ?? 0) + 1, result.totalTime));
    }, 700 / speed);
    return () => clearTimeout(timer);
  }, [isPlaying, currentTime, result.totalTime, speed]);

  const handlePlayPause = () => {
    if (currentTime === null || isFinished) {
      setCurrentTime(0);
      setIsPlaying(true);
      return;
    }
    setIsPlaying((p) => !p);
  };

  const handleStep = () => {
    setIsPlaying(false);
    setCurrentTime((t) => Math.min((t ?? -1) + 1, result.totalTime));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="CPU Scheduling Laboratory mode">
        {LAB_MODES.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={mode === m.id}
            onClick={() => setMode(m.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              mode === m.id
                ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-ink-soft dark:text-bone-soft">{LAB_MODES.find((m) => m.id === mode)!.blurb}</p>

      <div className="rounded-card border border-line bg-paper p-3 dark:border-line-dark dark:bg-chalkboard sm:p-5">
        {mode === "simulate" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-ink dark:text-bone">Scheduling Algorithm</p>
              <div className="flex flex-wrap gap-2">
                {ALGORITHMS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAlgorithm(a)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm font-medium",
                      algorithm === a
                        ? "border-subject-it bg-subject-it text-paper"
                        : "border-line text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40",
                    )}
                  >
                    {ALGORITHM_INFO[a].shortLabel}
                  </button>
                ))}
              </div>
              <p className="text-xs text-ink-soft dark:text-bone-soft">
                {ALGORITHM_INFO[algorithm].summary}{" "}
                <span
                  className={cn(
                    "ml-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                    ALGORITHM_INFO[algorithm].preemptive
                      ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                      : "bg-ink/10 text-ink-soft dark:bg-bone/10 dark:text-bone-soft",
                  )}
                >
                  {ALGORITHM_INFO[algorithm].preemptive ? "Preemptive" : "Non-preemptive"}
                </span>
              </p>

              {algorithm === "round-robin" && (
                <div className="mt-1 flex items-center gap-2">
                  <label htmlFor="quantum-input" className="text-sm text-ink dark:text-bone">
                    Time Quantum:
                  </label>
                  <input
                    id="quantum-input"
                    type="number"
                    min={1}
                    max={10}
                    value={quantum}
                    onChange={(e) => setQuantum(Math.min(10, Math.max(1, Math.round(Number(e.target.value)) || 1)))}
                    className="h-8 w-16 rounded-md border border-line bg-paper px-2 text-ink dark:border-line-dark dark:bg-chalkboard dark:text-bone"
                  />
                </div>
              )}

              {algorithm === "priority" && (
                <label className="mt-1 flex w-fit items-center gap-2 text-sm text-ink dark:text-bone">
                  <input
                    type="checkbox"
                    checked={agingEnabled}
                    onChange={(e) => setAgingEnabled(e.target.checked)}
                    className="h-4 w-4 rounded border-line accent-subject-it dark:border-line-dark"
                  />
                  Enable aging (reduces starvation — see the Starvation Lab tab)
                </label>
              )}
            </div>

            <ProcessEditor
              processes={processes}
              onChange={setProcesses}
              onResetToDefault={() => setProcesses(DEFAULT_PROCESSES)}
              showPriority={algorithm === "priority"}
            />

            <div>
              <p className="mb-2 text-sm font-medium text-ink dark:text-bone">CPU &amp; Ready Queue</p>
              <CpuQueueView processes={processes} result={result} time={currentTime} />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-ink dark:text-bone">Gantt Chart</p>
              <GanttChart
                segments={result.segments}
                processOrder={processes.map((p) => p.id)}
                totalTime={result.totalTime}
                currentTime={currentTime}
                isPlaying={isPlaying}
                isFinished={isFinished}
                onPlayPause={handlePlayPause}
                onStep={handleStep}
                onReset={handleReset}
                speed={speed}
                onSpeedChange={setSpeed}
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-ink dark:text-bone">Scheduling Metrics</p>
              <MetricsPanel result={result} />
            </div>
          </div>
        )}

        {mode === "compare" && (
          <div className="flex flex-col gap-4">
            <ProcessEditor
              processes={processes}
              onChange={setProcesses}
              onResetToDefault={() => setProcesses(DEFAULT_PROCESSES)}
              showPriority
            />
            <div className="flex items-center gap-2">
              <label htmlFor="compare-quantum" className="text-sm text-ink dark:text-bone">
                Round Robin Time Quantum:
              </label>
              <input
                id="compare-quantum"
                type="number"
                min={1}
                max={10}
                value={quantum}
                onChange={(e) => setQuantum(Math.min(10, Math.max(1, Math.round(Number(e.target.value)) || 1)))}
                className="h-8 w-16 rounded-md border border-line bg-paper px-2 text-ink dark:border-line-dark dark:bg-chalkboard dark:text-bone"
              />
            </div>
            <ComparisonView processes={processes} quantum={quantum} />
          </div>
        )}

        {mode === "starvation" && <StarvationLab />}
      </div>

      <p className="text-xs text-ink-soft dark:text-bone-soft">{SCHEDULING_DISCLAIMER}</p>
    </div>
  );
}
