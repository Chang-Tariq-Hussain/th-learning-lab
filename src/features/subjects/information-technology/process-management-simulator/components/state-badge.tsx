"use client";

import { cn } from "@/lib/utils";
import type { ProcessLifecycleState } from "../model";

const STATE_COLORS: Record<ProcessLifecycleState, string> = {
  new: "bg-ink/10 text-ink-soft dark:bg-bone/10 dark:text-bone-soft",
  ready: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  running: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  waiting: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  terminated: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
};

export function stateColorClasses(state: ProcessLifecycleState): string {
  return STATE_COLORS[state];
}

export function StateBadge({ state, label, className }: { state: ProcessLifecycleState; label: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", STATE_COLORS[state], className)}>
      {label}
    </span>
  );
}
