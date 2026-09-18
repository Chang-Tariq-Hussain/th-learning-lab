"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  SCENARIO_THREE_PROCESS,
  cloneRagState,
  heldCount,
  release,
  requestedCount,
  runDetectionAlgorithm,
  type RagState,
} from "../model";

/** Sections 11–13 — run the general detection algorithm (works
 *  correctly here even though Database Connection has two instances),
 *  then let the student try a recovery action on a deadlocked process
 *  and see whether it actually breaks the deadlock for the rest. */
export function DetectionRecoveryLab() {
  const [state, setState] = useState<RagState>(SCENARIO_THREE_PROCESS);
  const [hasRun, setHasRun] = useState(false);

  const result = useMemo(() => runDetectionAlgorithm(state), [state]);

  function terminate(processId: string) {
    const next = cloneRagState(state);
    // Terminating releases everything the process holds and cancels
    // its outstanding request.
    next.allocation[processId] = {};
    next.request[processId] = {};
    setState(next);
    setHasRun(true);
  }

  function preemptOneResource(processId: string, resourceId: string) {
    setState((s) => release(s, processId, resourceId));
    setHasRun(true);
  }

  function reset() {
    setState(SCENARIO_THREE_PROCESS);
    setHasRun(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-display text-lg font-medium text-ink dark:text-bone">Detection laboratory</h3>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          Three processes, three resource types — one of which (Database Connection) has two instances. The detection
          algorithm, not a bare cycle check, is what correctly identifies deadlock here.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button onClick={() => setHasRun(true)} className="rounded-full border border-subject-it bg-subject-it-soft px-4 py-1.5 text-sm font-medium text-subject-it dark:bg-subject-it/20">
            Run detection
          </button>
          <button onClick={reset} className="rounded-full border border-line px-4 py-1.5 text-sm font-medium text-ink-soft dark:border-line-dark dark:text-bone-soft">
            Reset scenario
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {state.processes.map((p) => {
          const held = state.resources.filter((r) => heldCount(state, p.id, r.id) > 0);
          const waiting = state.resources.filter((r) => requestedCount(state, p.id, r.id) > 0);
          const isDeadlocked = hasRun && result.deadlockedProcessIds.includes(p.id);
          const isFinished = hasRun && result.finishedOrder.includes(p.id);
          return (
            <div
              key={p.id}
              className={cn(
                "rounded-card border p-3.5",
                isDeadlocked
                  ? "border-red-400/60 bg-red-50 dark:border-red-500/40 dark:bg-red-500/10"
                  : isFinished
                  ? "border-emerald-400/60 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10"
                  : "border-line bg-white/60 dark:border-line-dark dark:bg-white/[0.03]",
              )}
            >
              <p className="font-mono text-sm font-semibold text-ink dark:text-bone">
                {p.name}
                {hasRun && (
                  <span className={cn("ml-2 text-xs", isDeadlocked ? "text-red-600 dark:text-red-400" : isFinished ? "text-emerald-600 dark:text-emerald-400" : "text-ink-soft dark:text-bone-soft")}>
                    {isDeadlocked ? "blocked" : isFinished ? "can finish" : ""}
                  </span>
                )}
              </p>
              <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">
                Holds: {held.length ? held.map((r) => r.name).join(", ") : "nothing"}
              </p>
              <p className="mt-0.5 text-xs text-ink-soft dark:text-bone-soft">
                Waiting on: {waiting.length ? waiting.map((r) => r.name).join(", ") : "nothing"}
              </p>

              {isDeadlocked && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <button onClick={() => terminate(p.id)} className="rounded-full border border-red-400 px-2.5 py-1 text-[11px] font-medium text-red-700 dark:border-red-500/60 dark:text-red-300">
                    Terminate {p.name}
                  </button>
                  {held.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => preemptOneResource(p.id, r.id)}
                      className="rounded-full border border-amber-400 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:border-amber-500/60 dark:text-amber-300"
                    >
                      Preempt {r.name} from {p.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {hasRun && (
        <div
          className={cn(
            "rounded-card border p-4",
            result.deadlockedProcessIds.length > 0
              ? "border-red-400/60 bg-red-50 dark:border-red-500/40 dark:bg-red-500/10"
              : "border-emerald-400/60 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10",
          )}
        >
          <p className={cn("font-mono text-sm font-semibold", result.deadlockedProcessIds.length > 0 ? "text-red-700 dark:text-red-300" : "text-emerald-700 dark:text-emerald-300")}>
            {result.deadlockedProcessIds.length > 0
              ? `Deadlocked: ${result.deadlockedProcessIds.map((id) => state.processes.find((p) => p.id === id)?.name).join(", ")}`
              : "No deadlock — every process can finish"}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
            {result.finishedOrder.length > 0
              ? `Finish order so far: ${result.finishedOrder.map((id) => state.processes.find((p) => p.id === id)?.name).join(" → ")}.`
              : ""}
            {" "}
            Try terminating one deadlocked process, or preempting a single resource it holds, then run detection again to see
            whether that was enough to free the rest.
          </p>
        </div>
      )}
    </div>
  );
}
