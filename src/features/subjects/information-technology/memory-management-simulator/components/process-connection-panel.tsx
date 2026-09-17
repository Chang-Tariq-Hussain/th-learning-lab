"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PROCESS_MEMORY_EVENTS, type ProcessLifecycleForMemory } from "../model";

/**
 * Connects Memory Management back to the Process Management
 * Simulator's lifecycle: each process state has a corresponding
 * memory event. Click a state to see what happens to that process's
 * memory at that point — reinforcing the earlier batch's model
 * rather than re-teaching it.
 */
export function ProcessConnectionPanel() {
  const [selected, setSelected] = useState<ProcessLifecycleForMemory>("new");
  const info = PROCESS_MEMORY_EVENTS.find((e) => e.state === selected)!;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-ink-soft dark:text-bone-soft">
        Memory Management connects directly to what the Process Management Simulator taught about a process&apos;s lifecycle. Click each stage to see what it means for that process&apos;s memory.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2 rounded-card border border-line bg-ink/[0.02] p-4 dark:border-line-dark dark:bg-bone/[0.03]">
        {PROCESS_MEMORY_EVENTS.map((e, i) => (
          <div key={e.state} className="flex items-center gap-2">
            <button
              onClick={() => setSelected(e.state)}
              className={cn(
                "rounded-full border-2 px-3 py-2 text-sm font-medium transition-all",
                selected === e.state
                  ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                  : "border-transparent bg-ink/5 text-ink-soft hover:border-ink/20 dark:bg-bone/10 dark:text-bone-soft dark:hover:border-bone/20",
              )}
            >
              {e.stateLabel}
            </button>
            {i < PROCESS_MEMORY_EVENTS.length - 1 && <span className="text-ink-soft dark:text-bone-soft">→</span>}
          </div>
        ))}
      </div>

      <div className="rounded-card bg-ink/[0.03] p-4 dark:bg-bone/[0.05]">
        <p className="mb-1 text-xs font-mono uppercase tracking-wide text-subject-it">{info.memoryEvent}</p>
        <p className="text-sm leading-relaxed text-ink dark:text-bone">{info.description}</p>
      </div>

      <p className="text-xs text-ink-soft dark:text-bone-soft">
        Try the Memory Map Lab&apos;s &quot;Create &amp; Allocate&quot; and &quot;Terminate &amp; free&quot; actions alongside this — they&apos;re the same two events shown here as New (create) and Terminated (release).
      </p>
    </div>
  );
}
