"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ALL_CONDITIONS_TRUE,
  CONDITION_BREAK_EXPLANATIONS,
  coffmanDeadlockWouldOccur,
  type CoffmanConditions,
} from "../model";

const CONDITION_META: { key: keyof CoffmanConditions; label: string; short: string }[] = [
  { key: "mutualExclusion", label: "Mutual Exclusion", short: "A resource can be held by only one process at a time." },
  { key: "holdAndWait", label: "Hold and Wait", short: "A process can hold a resource while waiting for another." },
  { key: "noPreemption", label: "No Preemption", short: "A resource can't be forcibly taken from the process holding it." },
  { key: "circularWait", label: "Circular Wait", short: "A cycle of processes each waiting on the next exists." },
];

/** The minimal two-process, two-resource deadlock, made interactive:
 *  toggle any of the four Coffman conditions off and watch whether
 *  the classic mutual-wait scenario can still occur. Section 3. */
export function CoffmanConditionsLab() {
  const [conditions, setConditions] = useState<CoffmanConditions>(ALL_CONDITIONS_TRUE);
  const deadlock = coffmanDeadlockWouldOccur(conditions);
  const brokenKey = (Object.keys(conditions) as (keyof CoffmanConditions)[]).find((k) => !conditions[k]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="font-display text-lg font-medium text-ink dark:text-bone">The minimal deadlock</h3>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          A deadlock occurs when processes are permanently waiting for resources held by one another. Here is the smallest
          possible example: two processes, two resources, each process holding what the other one wants.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <CoreConceptDiagram />
          <div className="flex flex-col justify-center gap-3 rounded-card border border-line bg-white/60 p-4 text-sm dark:border-line-dark dark:bg-white/[0.03]">
            <p className="font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Reading the cycle</p>
            <p className="text-ink-soft dark:text-bone-soft">
              Process A holds Resource 1 and waits for Resource 2. Process B holds Resource 2 and waits for Resource 1. Neither
              can proceed, neither can release what it holds, and neither request will ever be satisfied — that closed loop of
              waiting is the deadlock.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg font-medium text-ink dark:text-bone">The four necessary conditions</h3>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          All four of these must hold at once for this classic scenario to deadlock. Turn any one off and see what happens.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {CONDITION_META.map((c) => (
            <label
              key={c.key}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-card border p-3.5 transition-colors",
                conditions[c.key]
                  ? "border-subject-it bg-subject-it-soft dark:bg-subject-it/10"
                  : "border-line bg-white/40 dark:border-line-dark dark:bg-white/[0.02]",
              )}
            >
              <input
                type="checkbox"
                checked={conditions[c.key]}
                onChange={(e) => setConditions((prev) => ({ ...prev, [c.key]: e.target.checked }))}
                className="mt-1 h-4 w-4 accent-subject-it"
              />
              <span>
                <span className="block text-sm font-medium text-ink dark:text-bone">{c.label}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-ink-soft dark:text-bone-soft">{c.short}</span>
              </span>
            </label>
          ))}
        </div>

        <div
          className={cn(
            "mt-4 rounded-card border p-4",
            deadlock
              ? "border-red-400/60 bg-red-50 dark:border-red-500/40 dark:bg-red-500/10"
              : "border-emerald-400/60 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10",
          )}
        >
          <p className={cn("font-mono text-sm font-semibold", deadlock ? "text-red-700 dark:text-red-300" : "text-emerald-700 dark:text-emerald-300")}>
            {deadlock ? "DEADLOCK — this scenario would occur" : "No deadlock — this scenario is broken"}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
            {deadlock
              ? "All four conditions hold, so Process A and Process B can end up permanently waiting on each other."
              : brokenKey
              ? CONDITION_BREAK_EXPLANATIONS[brokenKey]
              : ""}
          </p>
          {!deadlock && (
            <p className="mt-2 text-xs italic leading-relaxed text-ink-soft/80 dark:text-bone-soft/80">
              This shows why breaking one condition prevents this particular scenario — it isn&apos;t a claim that every possible
              deadlock in every system disappears the same way. The Prevention tab looks at that in more depth.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function CoreConceptDiagram() {
  return (
    <svg viewBox="0 0 260 190" className="mx-auto h-48 w-full max-w-xs" role="img" aria-labelledby="deadlock-core-concept-title">
      <title id="deadlock-core-concept-title">
        Process A holds Resource 1 and requests Resource 2; Process B holds Resource 2 and requests Resource 1, forming a
        circular wait.
      </title>
      <defs>
        <marker id="dl-core-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className="fill-red-500" />
        </marker>
      </defs>

      {/* Nodes */}
      <circle cx="60" cy="40" r="26" className="fill-subject-it-soft stroke-subject-it dark:fill-subject-it/15" strokeWidth="1.5" />
      <text x="60" y="44" textAnchor="middle" className="fill-ink font-mono text-[10px] font-medium dark:fill-bone">Process A</text>

      <rect x="170" y="14" width="70" height="34" rx="6" className="fill-none stroke-ink/60 dark:stroke-bone/60" strokeWidth="1.5" />
      <text x="205" y="35" textAnchor="middle" className="fill-ink font-mono text-[9.5px] dark:fill-bone">Resource 1</text>

      <circle cx="200" cy="150" r="26" className="fill-subject-it-soft stroke-subject-it dark:fill-subject-it/15" strokeWidth="1.5" />
      <text x="200" y="154" textAnchor="middle" className="fill-ink font-mono text-[10px] font-medium dark:fill-bone">Process B</text>

      <rect x="20" y="140" width="70" height="34" rx="6" className="fill-none stroke-ink/60 dark:stroke-bone/60" strokeWidth="1.5" />
      <text x="55" y="161" textAnchor="middle" className="fill-ink font-mono text-[9.5px] dark:fill-bone">Resource 2</text>

      {/* holds: R1 -> A, R2 -> B */}
      <line x1="170" y1="35" x2="86" y2="38" className="stroke-emerald-600" strokeWidth="1.6" markerEnd="url(#dl-core-arrow)" />
      <text x="128" y="27" textAnchor="middle" className="fill-emerald-700 font-mono text-[8px] dark:fill-emerald-400">holds</text>

      <line x1="90" y1="155" x2="174" y2="152" className="stroke-emerald-600" strokeWidth="1.6" markerEnd="url(#dl-core-arrow)" />
      <text x="132" y="145" textAnchor="middle" className="fill-emerald-700 font-mono text-[8px] dark:fill-emerald-400">holds</text>

      {/* requests: A -> R2, B -> R1 (dashed, red = the wait cycle) */}
      <line x1="48" y1="64" x2="42" y2="140" strokeDasharray="4 3" className="stroke-red-500" strokeWidth="1.6" markerEnd="url(#dl-core-arrow)" />
      <text x="20" y="105" textAnchor="middle" className="fill-red-600 font-mono text-[8px] dark:fill-red-400">waits for</text>

      <line x1="212" y1="126" x2="218" y2="50" strokeDasharray="4 3" className="stroke-red-500" strokeWidth="1.6" markerEnd="url(#dl-core-arrow)" />
      <text x="248" y="90" textAnchor="middle" className="fill-red-600 font-mono text-[8px] dark:fill-red-400">waits for</text>
    </svg>
  );
}
