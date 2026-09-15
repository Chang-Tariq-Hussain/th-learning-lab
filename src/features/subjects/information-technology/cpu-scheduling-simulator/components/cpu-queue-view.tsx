"use client";

import { cn } from "@/lib/utils";
import { colorForProcess } from "./gantt-chart";
import { processStateAt, type ScheduleResult, type SimProcess } from "../model";

export interface CpuQueueViewProps {
  processes: SimProcess[];
  result: ScheduleResult;
  time: number | null;
  className?: string;
}

/**
 * The "what's happening on the CPU right now" panel: a CPU box
 * showing the currently running process (if any) and its remaining
 * burst, plus a Ready Queue row showing every arrived-but-not-running
 * process in the order Round Robin would serve them. For the
 * non-preemptive algorithms the queue is still shown (it's still
 * true that those processes are "ready and waiting"), just not
 * literally rotated the way Round Robin rotates it.
 */
export function CpuQueueView({ processes, result, time, className }: CpuQueueViewProps) {
  const processOrder = processes.map((p) => p.id);
  const activeSegment =
    time === null ? undefined : result.segments.find((s) => time >= s.start && time < s.end);
  const runningProcess = activeSegment?.processId
    ? processes.find((p) => p.id === activeSegment.processId)
    : undefined;

  const remainingBurst = (() => {
    if (!runningProcess || time === null) return null;
    // Sum of this process's future segment time from `time` onward,
    // derived from the schedule rather than tracked separately.
    return result.segments
      .filter((s) => s.processId === runningProcess.id && s.end > time)
      .reduce((sum, s) => sum + (s.end - Math.max(s.start, time)), 0);
  })();

  const readyIds =
    time === null
      ? []
      : processes
          .filter((p) => processStateAt(p, result, time) === "ready")
          .sort((a, b) => a.arrivalTime - b.arrivalTime)
          .map((p) => p.id);

  const newIds =
    time === null
      ? processes.map((p) => p.id)
      : processes.filter((p) => processStateAt(p, result, time) === "new").map((p) => p.id);

  const completedIds =
    time === null
      ? []
      : processes.filter((p) => processStateAt(p, result, time) === "completed").map((p) => p.id);

  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row", className)}>
      <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed border-subject-it/50 bg-subject-it-soft/40 p-6 text-center dark:bg-subject-it/10">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subject-it">CPU</p>
        {runningProcess ? (
          <>
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-xl font-mono text-lg font-semibold text-white shadow-sm",
                colorForProcess(runningProcess.id, processOrder),
              )}
            >
              {runningProcess.id}
            </div>
            <p className="text-xs text-ink-soft dark:text-bone-soft">Running · {remainingBurst} unit{remainingBurst === 1 ? "" : "s"} left</p>
          </>
        ) : (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-dashed border-ink/20 text-xs text-ink-soft dark:border-bone/20 dark:text-bone-soft">
              Idle
            </div>
            <p className="text-xs text-ink-soft dark:text-bone-soft">
              {time === null ? "Not started" : "No process ready"}
            </p>
          </>
        )}
      </div>

      <div className="flex flex-[2] flex-col gap-3">
        <div>
          <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft dark:text-bone-soft">Ready Queue</p>
          <div className="flex min-h-[3.25rem] flex-wrap items-center gap-2 rounded-card border border-line bg-paper p-2 dark:border-line-dark dark:bg-chalkboard">
            {readyIds.length === 0 ? (
              <span className="px-2 text-xs text-ink-soft dark:text-bone-soft">Empty</span>
            ) : (
              readyIds.map((id) => (
                <span
                  key={id}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg font-mono text-xs font-semibold text-white",
                    colorForProcess(id, processOrder),
                  )}
                >
                  {id}
                </span>
              ))
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft dark:text-bone-soft">Not Yet Arrived</p>
            <div className="flex min-h-[2.5rem] flex-wrap items-center gap-1.5 rounded-card border border-dashed border-line p-2 dark:border-line-dark">
              {newIds.length === 0 ? (
                <span className="px-1 text-xs text-ink-soft dark:text-bone-soft">None</span>
              ) : (
                newIds.map((id) => (
                  <span key={id} className="rounded-md border border-line px-2 py-1 font-mono text-[11px] text-ink-soft dark:border-line-dark dark:text-bone-soft">
                    {id}
                  </span>
                ))
              )}
            </div>
          </div>
          <div className="flex-1">
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft dark:text-bone-soft">Completed</p>
            <div className="flex min-h-[2.5rem] flex-wrap items-center gap-1.5 rounded-card border border-line bg-ink/[0.03] p-2 dark:border-line-dark dark:bg-bone/[0.05]">
              {completedIds.length === 0 ? (
                <span className="px-1 text-xs text-ink-soft dark:text-bone-soft">None yet</span>
              ) : (
                completedIds.map((id) => (
                  <span key={id} className="rounded-md bg-ink/10 px-2 py-1 font-mono text-[11px] text-ink dark:bg-bone/10 dark:text-bone">
                    {id} ✓
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
