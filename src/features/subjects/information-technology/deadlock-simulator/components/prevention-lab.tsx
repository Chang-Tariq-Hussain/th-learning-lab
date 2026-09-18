"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/** Section 9 — deadlock prevention by breaking one of the four
 *  necessary conditions. Hold-and-Wait and Circular-Wait get concrete
 *  interactive demonstrations; No Preemption and Mutual Exclusion are
 *  explained conceptually, per the brief (some resources genuinely
 *  cannot be preempted or shared). */
export function PreventionLab() {
  return (
    <div className="flex flex-col gap-8">
      <HoldAndWaitDemo />
      <CircularWaitDemo />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
          <p className="font-mono text-sm font-semibold text-ink dark:text-bone">Break No Preemption</p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
            If the OS can forcibly take a resource back from a process that holds it — save that process&apos;s state, hand the
            resource to another process, and resume the first one later — a wait cycle can be broken from outside. This works
            well for resources like CPU registers or memory pages, which can be saved and restored. It works poorly for
            resources mid-operation, like a printer halfway through a page.
          </p>
        </div>
        <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
          <p className="font-mono text-sm font-semibold text-ink dark:text-bone">Break Mutual Exclusion</p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
            If a resource could be accessed by multiple processes at once, no process would ever have to wait for exclusive
            access. This is not a general solution: some resources — a printer mid-page, a write lock on a record, a single
            tape drive — cannot realistically be made shareable without corrupting the work itself.
          </p>
        </div>
      </div>
    </div>
  );
}

function HoldAndWaitDemo() {
  const [requireAllUpfront, setRequireAllUpfront] = useState(false);

  // Same P1/P2 two-resource scenario as the Coffman lab, replayed under
  // each policy so the effect of the rule is concrete rather than only
  // asserted.
  const outcome = requireAllUpfront
    ? {
        deadlock: false,
        narrative:
          "Under this policy, P1 must request Printer AND Scanner together before starting. Both are free, so P1 gets both and runs to completion, then releases them. P2's later request for both then succeeds too. Neither process is ever left holding one resource while blocked on another.",
      }
    : {
        deadlock: true,
        narrative:
          "P1 grabs the Printer, P2 grabs the Scanner, then each requests what the other is holding. Each is free to acquire resources one at a time and wait in between, so this partial-hold pattern is exactly what leads to the classic deadlock.",
      };

  return (
    <div>
      <h3 className="font-display text-lg font-medium text-ink dark:text-bone">Break Hold and Wait</h3>
      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Require a process to request every resource it will need before it starts running, instead of acquiring resources one
        at a time as it goes.
      </p>

      <label className="mt-3 flex w-fit cursor-pointer items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs font-medium dark:border-line-dark">
        <input type="checkbox" checked={requireAllUpfront} onChange={(e) => setRequireAllUpfront(e.target.checked)} className="h-3.5 w-3.5 accent-subject-it" />
        Require all resources requested up front
      </label>

      <div
        className={cn(
          "mt-3 rounded-card border p-4",
          outcome.deadlock ? "border-red-400/60 bg-red-50 dark:border-red-500/40 dark:bg-red-500/10" : "border-emerald-400/60 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10",
        )}
      >
        <p className={cn("font-mono text-sm font-semibold", outcome.deadlock ? "text-red-700 dark:text-red-300" : "text-emerald-700 dark:text-emerald-300")}>
          {outcome.deadlock ? "P1 and P2 deadlock" : "No deadlock"}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{outcome.narrative}</p>
      </div>
    </div>
  );
}

function CircularWaitDemo() {
  // P1 always requests in increasing order (obeys the rule). P2 is the
  // one the student flips between obeying the rule and trying to
  // request "backwards" — which is exactly the direction a circular
  // wait against P1 would require.
  const [p2RequestsBackwards, setP2RequestsBackwards] = useState(true);

  const p1Order = "R1 then R2";
  const p2Order = p2RequestsBackwards ? "R2 then R1" : "R1 then R2";
  const blocked = p2RequestsBackwards;

  return (
    <div>
      <h3 className="font-display text-lg font-medium text-ink dark:text-bone">Break Circular Wait</h3>
      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Impose one global ordering on resources — here R1 &lt; R2 &lt; R3 — and require every process to request resources
        only in increasing order.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
        <span className="rounded-full border border-line px-3 py-1.5 font-mono dark:border-line-dark">P1 requests: {p1Order}</span>
        <label className="flex cursor-pointer items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono dark:border-line-dark">
          <input type="checkbox" checked={p2RequestsBackwards} onChange={(e) => setP2RequestsBackwards(e.target.checked)} className="h-3.5 w-3.5 accent-subject-it" />
          P2 requests: {p2Order}
        </label>
      </div>

      <div className={cn("mt-3 rounded-card border p-4", blocked ? "border-emerald-400/60 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10" : "border-amber-400/60 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10")}>
        <p className={cn("font-mono text-sm font-semibold", blocked ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300")}>
          {blocked ? "P2's second request is refused before it can create a cycle" : "Both processes request in increasing order — no cycle can form"}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          {blocked
            ? "P2 already holds R2 and is trying to request R1 next — a lower-numbered resource after a higher one. The global ordering rule forbids that request outright, so the back-and-forth pattern a circular wait needs never gets the chance to form."
            : "With both processes always moving from lower-numbered to higher-numbered resources, there is no direction left for a cycle to close in."}
        </p>
      </div>
    </div>
  );
}
