"use client";

import { memo } from "react";
import { Check, Circle, Minus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Panel } from "../../osi-model-explorer/components/ui";
import type { Transmission } from "../lab-state";
import { formatPort } from "../model";

type RowState = "pending" | "yes" | "no" | "na";

interface Row {
  label: string;
  state: RowState;
  detail?: string;
}

/** Which rows the current stage has just completed (highlighted as "active"). */
const ACTIVE_AT: Record<number, number[]> = { 2: [0], 3: [1], 4: [2, 3], 5: [4] };

function buildRows(tx: Transmission | null): Row[] {
  const stage = tx?.stage ?? 0;
  const st = (at: number): RowState => (stage < at ? "pending" : "yes");
  const rows: Row[] = [
    { label: "Frame received", state: st(2), detail: tx && stage >= 2 ? `on incoming port ${formatPort(tx.srcPort)}` : undefined },
    {
      label: "Source MAC learned",
      state: st(3),
      detail: tx && stage >= 3 ? `${tx.srcMac} → ${formatPort(tx.srcPort)} (${tx.learn?.result === "new" ? "new entry" : "already known, age reset"})` : undefined,
    },
    { label: "Destination MAC checked", state: st(4), detail: tx && stage >= 4 ? tx.dstMac : undefined },
  ];

  // Row 4: was the destination found?
  if (tx && stage >= 4 && tx.lookup) {
    if (tx.lookup.broadcast) rows.push({ label: "Destination found", state: "na", detail: "n/a — broadcast is never in the table" });
    else if (tx.lookup.found) rows.push({ label: "Destination found", state: "yes", detail: `${tx.dstMac} → ${formatPort(tx.lookup.port!)}` });
    else rows.push({ label: "Destination found", state: "no", detail: "not in the MAC table" });
  } else rows.push({ label: "Destination found", state: "pending" });

  // Row 5: the action.
  if (tx && stage >= 5 && tx.decision) {
    const d = tx.decision;
    const text = d.action === "flood" ? "FLOOD" : d.egress.length ? formatPort(d.egress[0]!) : "FILTER";
    rows.push({
      label: d.action === "flood" ? "Action" : "Forwarding decision",
      state: "yes",
      detail: d.action === "flood" ? `→ ${text} (all ports except ${formatPort(tx.srcPort)})` : `→ ${text}${d.egress.length ? " only" : " (dropped)"}`,
    });
  } else rows.push({ label: "Forwarding decision", state: "pending" });

  return rows;
}

const ICON_WRAP: Record<RowState, string> = {
  pending: "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
  yes: "border-emerald-500 bg-emerald-500 text-white",
  no: "border-red-500 bg-red-500 text-white",
  na: "border-amber-500 bg-amber-500 text-white",
};

export const DecisionPanel = memo(function DecisionPanel({ tx }: { tx: Transmission | null }) {
  const rows = buildRows(tx);
  const stage = tx?.stage ?? 0;
  const activeRows = ACTIVE_AT[stage] ?? [];
  return (
    <Panel title="Switch decision">
      <ol className="flex flex-col gap-2">
        {rows.map((r, i) => {
          const isActive = activeRows.includes(i);
          return (
            <li key={r.label} className={cn("flex items-start gap-2.5 rounded-lg border px-2.5 py-2 text-sm transition-colors", isActive ? "border-subject-it bg-subject-it-soft dark:bg-subject-it/15" : "border-transparent")}>
              <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border", ICON_WRAP[r.state])} aria-hidden>
                {r.state === "yes" ? <Check className="h-3 w-3" strokeWidth={3} /> : r.state === "no" ? <X className="h-3 w-3" strokeWidth={3} /> : r.state === "na" ? <Minus className="h-3 w-3" strokeWidth={3} /> : <Circle className="h-2 w-2" strokeWidth={2} />}
              </span>
              <div className="min-w-0">
                <p className={cn("font-medium", r.state === "pending" ? "text-ink-soft dark:text-bone-soft" : "text-ink dark:text-bone")}>
                  <span className="mr-1 font-mono text-xs text-ink-soft dark:text-bone-soft">{i + 1}.</span>
                  {r.label}
                  <span className="sr-only"> — {r.state === "yes" ? "yes" : r.state === "no" ? "no" : r.state === "na" ? "not applicable" : "waiting"}</span>
                </p>
                {r.detail && <p className="break-words font-mono text-[11px] text-ink-soft dark:text-bone-soft">{r.detail}</p>}
              </div>
            </li>
          );
        })}
      </ol>
      {!tx && <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">Send a frame to watch the switch work through these questions, in this order, every time.</p>}
    </Panel>
  );
});
