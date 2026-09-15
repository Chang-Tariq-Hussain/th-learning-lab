"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { ALGORITHM_INFO, runScheduler, type SchedulingAlgorithm, type SimProcess } from "../model";
import { colorForProcess } from "./gantt-chart";

const ALGORITHMS: SchedulingAlgorithm[] = ["fcfs", "sjf", "round-robin", "priority"];

export interface ComparisonViewProps {
  processes: SimProcess[];
  quantum: number;
  className?: string;
}

/**
 * Runs all four algorithms against the same process set and lines up
 * their Gantt charts and averages for direct comparison. Deliberately
 * doesn't declare a "winner" — the accompanying copy in the page
 * (Learn section) explains that the right choice depends on system
 * goals, and this view is what makes the trade-off visible rather
 * than just asserted.
 */
export function ComparisonView({ processes, quantum, className }: ComparisonViewProps) {
  const processOrder = processes.map((p) => p.id);
  const results = useMemo(
    () => ALGORITHMS.map((algo) => ({ algo, result: runScheduler(processes, algo, quantum) })),
    [processes, quantum],
  );
  const maxTime = Math.max(1, ...results.map(({ result }) => result.totalTime));

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {results.map(({ algo, result }) => (
        <div key={algo} className="rounded-card border border-line p-4 dark:border-line-dark">
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-medium text-ink dark:text-bone">
              {ALGORITHM_INFO[algo].label}
              {algo === "round-robin" && <span className="ml-2 font-mono text-xs text-ink-soft dark:text-bone-soft">(quantum {quantum})</span>}
            </p>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                ALGORITHM_INFO[algo].preemptive
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                  : "bg-ink/10 text-ink-soft dark:bg-bone/10 dark:text-bone-soft",
              )}
            >
              {ALGORITHM_INFO[algo].preemptive ? "Preemptive" : "Non-preemptive"}
            </span>
          </div>

          <div className="mb-3 flex h-9 min-w-[300px] overflow-hidden rounded-md border border-line dark:border-line-dark">
            {result.segments.map((seg) => (
              <div
                key={`${seg.processId ?? "idle"}-${seg.start}`}
                style={{ width: `${((seg.end - seg.start) / maxTime) * 100}%` }}
                className={cn(
                  "flex items-center justify-center border-r border-paper text-[10px] font-mono text-white last:border-r-0 dark:border-chalkboard",
                  seg.processId ? colorForProcess(seg.processId, processOrder) : "bg-ink/10 text-ink-soft dark:bg-bone/10 dark:text-bone-soft",
                )}
                title={`${seg.processId ?? "Idle"}: ${seg.start}–${seg.end}`}
              >
                {seg.processId ?? ""}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            <p className="text-ink-soft dark:text-bone-soft">Avg Waiting: <span className="font-mono font-medium text-ink dark:text-bone">{result.averageWaitingTime}</span></p>
            <p className="text-ink-soft dark:text-bone-soft">Avg Turnaround: <span className="font-mono font-medium text-ink dark:text-bone">{result.averageTurnaroundTime}</span></p>
            <p className="text-ink-soft dark:text-bone-soft">Avg Response: <span className="font-mono font-medium text-ink dark:text-bone">{result.averageResponseTime}</span></p>
            <p className="text-ink-soft dark:text-bone-soft">Finish Time: <span className="font-mono font-medium text-ink dark:text-bone">{result.totalTime}</span></p>
          </div>
        </div>
      ))}
      <p className="text-xs text-ink-soft dark:text-bone-soft">
        No single algorithm wins on every measure here — the right choice depends on what a system is optimizing for (fast average response for an interactive system, fair rotation across many users, predictable order, or letting short jobs finish quickly).
      </p>
    </div>
  );
}
