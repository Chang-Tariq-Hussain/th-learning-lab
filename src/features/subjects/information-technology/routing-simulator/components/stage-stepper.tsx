"use client";

import { memo } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PHASES, type Plan, type PlanStep } from "../model";

export function narrate(step: PlanStep | null): string {
  if (!step) return "Pick a source and a destination, then press Send packet. Watch the host decide, then watch each router look up a route.";
  return step.text;
}

const BANNER_TONE = {
  delivered: "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200",
  dropped: "border-red-500 bg-red-50 text-red-800 dark:bg-red-500/10 dark:text-red-200",
  "no-host": "border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-200",
} as const;

function bannerText(plan: Plan): string {
  const last = plan.steps[plan.steps.length - 1]!;
  if (plan.outcome === "delivered") return "PACKET FORWARDED AND DELIVERED";
  if (plan.outcome === "no-host") return "NO DEVICE WITH THAT ADDRESS";
  if (last.inspect.reason === "No matching route") return "NO ROUTE FOUND · PACKET DROPPED";
  return "PACKET DROPPED";
}

export const StageStepper = memo(function StageStepper({ plan, idx, step }: { plan: Plan | null; idx: number; step: PlanStep | null }) {
  const phase = step?.phase ?? 0;
  const finished = !!plan && idx >= plan.steps.length - 1;
  const routerHop = plan ? plan.steps.slice(0, idx + 1).filter((s) => s.kind === "receive").length : 0;
  const totalHops = plan ? plan.steps.filter((s) => s.kind === "receive").length : 0;
  const outcomeKey = finished && plan ? plan.outcome : null;

  return (
    <div className="flex flex-col gap-3">
      <ol className="grid grid-cols-2 gap-1.5 sm:grid-cols-4" aria-label="Packet journey stages">
        {PHASES.map((s) => {
          const done = phase > s.n || (finished && phase === s.n && s.n === 8);
          const current = phase === s.n && !done;
          return (
            <li
              key={s.n}
              aria-current={current ? "step" : undefined}
              className={cn(
                "flex min-h-[44px] items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[11px] font-medium leading-tight",
                current ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20" : done ? "border-emerald-500/50 text-emerald-700 dark:text-emerald-300" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
              )}
            >
              <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px]", current ? "bg-subject-it text-paper" : done ? "bg-emerald-500 text-white" : "bg-ink/10 dark:bg-bone/10")}>{done ? <Check className="h-3 w-3" strokeWidth={3} /> : s.n}</span>
              <span>
                <span className="sr-only">Stage {s.n}: </span>
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>

      <div className={cn("rounded-xl border-2 px-3 py-2 text-center font-mono text-sm font-bold tracking-wide sm:text-base", outcomeKey ? BANNER_TONE[outcomeKey] : "border-dashed border-line text-ink-soft dark:border-line-dark dark:text-bone-soft")}>
        {outcomeKey && plan ? bannerText(plan) : "Outcome appears when the packet finishes"}
      </div>

      <p role="status" className="min-h-[5.5rem] text-sm leading-relaxed text-ink dark:text-bone">
        <span className="font-mono text-[11px] uppercase tracking-wide text-subject-it">
          {step ? `Stage ${phase} of ${PHASES.length} · ${PHASES[phase - 1]!.label}${step.router && totalHops > 1 && routerHop > 0 ? ` · router ${routerHop} of ${totalHops}` : ""}` : "Ready"}
        </span>
        <br />
        {narrate(step)}
      </p>
    </div>
  );
});
