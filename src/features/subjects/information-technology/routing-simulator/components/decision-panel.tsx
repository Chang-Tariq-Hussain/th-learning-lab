"use client";

import { memo } from "react";
import { Check, Circle, Minus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Panel } from "../../osi-model-explorer/components/ui";
import { routeLabel, type Plan, type PlanStep } from "../model";

type RowState = "pending" | "yes" | "no" | "na";
interface Row {
  title: string;
  state: RowState;
  detail?: string;
}

/** How far through its decision the current router is: 1 received · 2 looked up · 3 selected · 4 next hop chosen · 5 acted. */
function progressOf(step: PlanStep): number {
  switch (step.kind) {
    case "receive":
      return 1;
    case "lookup":
      return 2;
    case "select":
      return 3;
    case "forward":
      return 5;
    default:
      return 5;
  }
}

/** The step to explain: the current one if a router is working, otherwise the last router step before it. */
function routerStepAt(plan: Plan | null, idx: number): PlanStep | null {
  if (!plan) return null;
  for (let i = Math.min(idx, plan.steps.length - 1); i >= 0; i--) {
    const s = plan.steps[i]!;
    if (s.router) return s;
  }
  return null;
}

function buildRows(plan: Plan, step: PlanStep): Row[] {
  if (step.kind === "deliver") {
    return [
      { title: "Destination IP read", state: "yes", detail: plan.dstIp },
      { title: "Routing table checked", state: "na", detail: "not needed: the address belongs to this router" },
      { title: "Best matching route", state: "na" },
      { title: "Next hop / outgoing interface", state: "na" },
      { title: "Action", state: "yes", detail: "KEEP · addressed to this router" },
    ];
  }
  const p = progressOf(step);
  const stage = (n: number): RowState => (p < n ? "pending" : "yes");
  const lk = step.lookup;
  const best = lk?.best ?? null;
  const failed = p >= 3 && !!lk && !best;
  const dropped = step.kind === "drop" && plan.outcome === "dropped";

  const rows: Row[] = [{ title: "Destination IP read", state: stage(1), detail: p >= 1 ? plan.dstIp : undefined }];

  rows.push({
    title: "Routing table checked",
    state: stage(2),
    detail: p >= 2 && lk ? (lk.matches.length === 0 ? "0 routes contain this address" : `${lk.matches.length} route${lk.matches.length === 1 ? "" : "s"} contain this address`) : undefined,
  });

  if (failed) rows.push({ title: "Best matching route", state: "no", detail: "No matching route and no default route" });
  else if (p >= 3 && best) {
    const r = best.route;
    const why = lk!.usedDefault ? "default route: nothing more specific matched" : lk!.matches.length > 1 ? `most specific of ${lk!.matches.length} matches (longest prefix)` : "the only matching route";
    rows.push({ title: "Best matching route", state: "yes", detail: `${routeLabel(r)} (${r.type}) · ${why}` });
  } else rows.push({ title: "Best matching route", state: "pending" });

  if (failed) rows.push({ title: "Next hop / outgoing interface", state: "na", detail: "nothing to forward to" });
  else if (p >= 4 && best) rows.push({ title: "Next hop / outgoing interface", state: "yes", detail: best.route.nextHop ? `next hop ${best.route.nextHop} · out ${best.route.iface}` : `directly connected · out ${best.route.iface}` });
  else rows.push({ title: "Next hop / outgoing interface", state: "pending" });

  if (dropped) rows.push({ title: "Action", state: "no", detail: step.inspect.reason === "No matching route" ? "DROP · NO ROUTE FOUND" : `DROP · ${step.inspect.reason ?? ""}` });
  else if (step.kind === "forward") rows.push({ title: "Action", state: "yes", detail: "FORWARD PACKET" });
  else rows.push({ title: "Action", state: "pending" });
  return rows;
}

const ICON_WRAP: Record<RowState, string> = {
  pending: "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
  yes: "border-emerald-500 bg-emerald-500 text-white",
  no: "border-red-500 bg-red-500 text-white",
  na: "border-amber-500 bg-amber-500 text-white",
};

export const DecisionPanel = memo(function DecisionPanel({ plan, idx }: { plan: Plan | null; idx: number }) {
  const step = routerStepAt(plan, idx);
  const rows = plan && step ? buildRows(plan, step) : null;
  const p = step ? progressOf(step) : 0;
  const activeRow = p === 1 ? 0 : p === 2 ? 1 : p === 3 ? 2 : p === 5 ? 4 : -1;
  const lk = step?.lookup;
  const verdict = p >= 3 && lk ? (lk.best ? (lk.usedDefault ? "default" : "specific") : "none") : null;

  return (
    <Panel title={`Router decision${step?.router ? ` · ${step.router}` : ""}`}>
      <ol className="flex flex-col gap-1.5">
        {(rows ?? PLACEHOLDER).map((r, i) => (
          <li key={r.title}>
            <div className={cn("flex items-start gap-2.5 rounded-lg border px-2.5 py-2 text-sm transition-colors", i === activeRow ? "border-subject-it bg-subject-it-soft dark:bg-subject-it/15" : "border-transparent")}>
              <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border", ICON_WRAP[r.state])} aria-hidden>
                {r.state === "yes" ? <Check className="h-3 w-3" strokeWidth={3} /> : r.state === "no" ? <X className="h-3 w-3" strokeWidth={3} /> : r.state === "na" ? <Minus className="h-3 w-3" strokeWidth={3} /> : <Circle className="h-2 w-2" strokeWidth={2} />}
              </span>
              <div className="min-w-0">
                <p className={cn("font-medium", r.state === "pending" ? "text-ink-soft dark:text-bone-soft" : "text-ink dark:text-bone")}>
                  <span className="mr-1 font-mono text-xs text-ink-soft dark:text-bone-soft">{i + 1}.</span>
                  {r.title}
                  <span className="sr-only"> — {r.state === "yes" ? "done" : r.state === "no" ? "failed" : r.state === "na" ? "skipped" : "waiting"}</span>
                </p>
                {r.detail && <p className="break-words font-mono text-[11px] text-ink-soft dark:text-bone-soft">{r.detail}</p>}
              </div>
            </div>
            {i < 4 && (
              <p aria-hidden className="pl-[1.35rem] font-mono text-xs leading-none text-ink-soft/70 dark:text-bone-soft/70">
                ↓
              </p>
            )}
          </li>
        ))}
      </ol>

      {lk && lk.matches.length > 0 && p >= 2 && (
        <div className="mt-3 rounded-xl border border-line p-2.5 dark:border-line-dark">
          <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Matching routes, most specific first</p>
          <ul className="mt-1.5 space-y-1">
            {lk.matches.map((m, i) => {
              const chosen = p >= 3 && i === 0;
              return (
                <li key={routeLabel(m.route)} className={cn("flex flex-wrap items-center gap-x-2 gap-y-0.5 rounded-lg border px-2 py-1 font-mono text-[11px]", chosen ? "border-emerald-500 bg-emerald-50 text-ink dark:bg-emerald-500/15 dark:text-bone" : "border-line text-ink dark:border-line-dark dark:text-bone")}>
                  <span className="font-semibold">{routeLabel(m.route)}</span>
                  <span className="text-ink-soft dark:text-bone-soft">prefix length {m.route.prefix}</span>
                  {chosen ? <span className="ml-auto font-semibold text-emerald-700 dark:text-emerald-300">SELECTED</span> : p >= 3 ? <span className="ml-auto text-ink-soft dark:text-bone-soft">matches, but less specific</span> : null}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="mt-3 rounded-xl border border-line p-2.5 text-xs dark:border-line-dark" role="group" aria-label="Which route wins">
        <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Which route wins?</p>
        <ul className="mt-1.5 space-y-1">
          <WinRow on={verdict === "specific"} text="A specific route matches → use the most specific one." />
          <WinRow on={verdict === "default"} text="No specific route, but a default route (0.0.0.0/0) exists → use the default route." />
          <WinRow on={verdict === "none"} bad text="Nothing matches and there is no default route → NO ROUTE FOUND." />
        </ul>
      </div>
    </Panel>
  );
});

const PLACEHOLDER: Row[] = [
  { title: "Destination IP read", state: "pending" },
  { title: "Routing table checked", state: "pending" },
  { title: "Best matching route", state: "pending" },
  { title: "Next hop / outgoing interface", state: "pending" },
  { title: "Action", state: "pending" },
];

function WinRow({ on, bad, text }: { on: boolean; bad?: boolean; text: string }) {
  return (
    <li className={cn("rounded-lg border px-2 py-1.5 leading-snug transition-colors", on ? (bad ? "border-red-500 bg-red-50 font-semibold text-red-800 dark:bg-red-500/10 dark:text-red-200" : "border-emerald-500 bg-emerald-50 font-semibold text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200") : "border-transparent text-ink-soft dark:text-bone-soft")}>{text}</li>
  );
}
