"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ALLOWED_TRANSITIONS,
  LIFECYCLE_STATES,
  STATE_INFO,
  STATE_LABELS,
  TRANSITION_EXPLANATIONS,
  type ProcessLifecycleState,
} from "../model";
import { StateBadge, stateColorClasses } from "./state-badge";

interface HistoryEntry {
  from: ProcessLifecycleState;
  to: ProcessLifecycleState;
}

/**
 * The lifecycle diagram doubles as the "Follow a Process" experiment:
 * the student drives one process's state forward themselves, and can
 * only pick transitions the model actually allows — an invalid move
 * simply isn't offered, so "why can't a New process go straight to
 * Running?" becomes something the UI itself demonstrates.
 */
export function FollowAProcess() {
  const [state, setState] = useState<ProcessLifecycleState>("new");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [inspected, setInspected] = useState<ProcessLifecycleState>("new");

  const nextOptions = ALLOWED_TRANSITIONS[state];

  const advance = (to: ProcessLifecycleState) => {
    setHistory((h) => [...h, { from: state, to }]);
    setState(to);
    setInspected(to);
  };

  const reset = () => {
    setState("new");
    setHistory([]);
    setInspected("new");
  };

  const info = STATE_INFO[inspected];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-card border border-line bg-ink/[0.02] p-4 dark:border-line-dark dark:bg-bone/[0.03]">
        {LIFECYCLE_STATES.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => setInspected(s)}
              className={cn(
                "rounded-full border-2 px-3 py-2 text-sm font-medium transition-all",
                state === s
                  ? "border-ink dark:border-bone"
                  : "border-transparent hover:border-ink/20 dark:hover:border-bone/20",
                stateColorClasses(s),
                inspected === s && "ring-2 ring-offset-2 ring-subject-it dark:ring-offset-chalkboard",
              )}
              aria-pressed={inspected === s}
            >
              {STATE_LABELS[s]}
              {state === s && <span className="ml-1.5 text-[10px] uppercase tracking-wide">● current</span>}
            </button>
            {i < LIFECYCLE_STATES.length - 1 && <span className="text-ink-soft dark:text-bone-soft">→</span>}
          </div>
        ))}
      </div>

      <div className="rounded-card bg-ink/[0.03] p-4 dark:bg-bone/[0.05]">
        <p className="mb-1 text-xs font-mono uppercase tracking-wide text-subject-it">{STATE_LABELS[inspected]}</p>
        <p className="text-sm leading-relaxed text-ink dark:text-bone">{info.fullDescription}</p>
        <p className="mt-2 text-xs font-medium text-ink-soft dark:text-bone-soft">
          Uses CPU time while in this state? <span className={info.usesCpu ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>{info.usesCpu ? "Yes" : "No"}</span>
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-ink dark:text-bone">
          Process is currently: <StateBadge state={state} label={STATE_LABELS[state]} />
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {nextOptions.length === 0 ? (
            <p className="text-sm text-ink-soft dark:text-bone-soft">Terminated — no further transitions. Reset to follow it again.</p>
          ) : (
            nextOptions.map((to) => (
              <button
                key={to}
                onClick={() => advance(to)}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-subject-it px-4 text-sm font-medium text-paper hover:opacity-90"
                title={TRANSITION_EXPLANATIONS[`${state}->${to}`]}
              >
                Move to {STATE_LABELS[to]}
              </button>
            ))
          )}
          <button
            onClick={reset}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-3 text-sm font-medium text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>

      {history.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs font-mono uppercase tracking-wide text-ink-soft dark:text-bone-soft">History</p>
          <ol className="flex flex-wrap gap-x-1.5 gap-y-1 text-xs text-ink-soft dark:text-bone-soft">
            {history.map((h, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <span className="font-mono">{STATE_LABELS[h.from]} → {STATE_LABELS[h.to]}</span>
                {i < history.length - 1 && <span>·</span>}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
