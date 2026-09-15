"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { runPriority, STARVATION_PROCESSES } from "../model";
import { colorForProcess } from "./gantt-chart";

/**
 * A focused, single-purpose demo: the same process set run through
 * Priority Scheduling with aging off, then on, so starvation isn't
 * just defined in text — it's something the student can see (P1's
 * waiting time) and then fix by flipping one switch.
 */
export function StarvationLab({ className }: { className?: string }) {
  const [agingEnabled, setAgingEnabled] = useState(false);
  const processOrder = STARVATION_PROCESSES.map((p) => p.id);

  const result = useMemo(
    () => runPriority(STARVATION_PROCESSES, { agingEnabled, agingInterval: 4 }),
    [agingEnabled],
  );
  const maxTime = Math.max(1, result.totalTime);
  const p1 = result.processResults.find((r) => r.id === "P1")!;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="rounded-card bg-ink/[0.03] p-3 text-sm text-ink-soft dark:bg-bone/[0.05] dark:text-bone-soft">
        <span className="font-medium text-ink dark:text-bone">P1</span> has the lowest priority (5) and arrives first, but
        higher-priority processes keep arriving right as it would otherwise get a turn. Watch what happens to its waiting time.
      </div>

      <label className="flex w-fit items-center gap-2 text-sm text-ink dark:text-bone">
        <input
          type="checkbox"
          checked={agingEnabled}
          onChange={(e) => setAgingEnabled(e.target.checked)}
          className="h-4 w-4 rounded border-line accent-subject-it dark:border-line-dark"
        />
        Enable aging (priority improves by 1 every 4 time units waited)
      </label>

      <div className="flex h-10 min-w-[300px] overflow-hidden rounded-md border border-line dark:border-line-dark">
        {result.segments.map((seg) => (
          <div
            key={`${seg.processId ?? "idle"}-${seg.start}`}
            style={{ width: `${((seg.end - seg.start) / maxTime) * 100}%` }}
            className={cn(
              "flex items-center justify-center border-r border-paper text-[11px] font-mono text-white last:border-r-0 dark:border-chalkboard",
              seg.processId ? colorForProcess(seg.processId, processOrder) : "bg-ink/10 text-ink-soft dark:bg-bone/10 dark:text-bone-soft",
            )}
            title={`${seg.processId ?? "Idle"}: ${seg.start}–${seg.end}`}
          >
            {seg.processId ?? ""}
          </div>
        ))}
      </div>

      <div
        className={cn(
          "rounded-card border p-4",
          p1.waitingTime > 10
            ? "border-rose-500/40 bg-rose-500/10"
            : "border-emerald-500/40 bg-emerald-500/10",
        )}
      >
        <p className="text-sm font-medium text-ink dark:text-bone">
          P1&apos;s waiting time: <span className="font-mono">{p1.waitingTime}</span>
        </p>
        <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">
          {agingEnabled
            ? "With aging on, P1's effective priority improves the longer it waits, so it eventually outranks new arrivals — starvation is avoided."
            : "With aging off, P1 can be pushed back indefinitely by a steady stream of higher-priority arrivals — this is starvation."}
        </p>
      </div>
      <p className="text-xs text-ink-soft dark:text-bone-soft">
        Simplified educational model: real schedulers use more sophisticated aging and priority-boost schemes than this single fixed rate.
      </p>
    </div>
  );
}
