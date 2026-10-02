"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { Panel } from "../../osi-model-explorer/components/ui";
import type { Plan, PlanStep } from "../model";

function toneOf(decision: string): string {
  if (decision.startsWith("DROP") || decision.startsWith("NO MATCH") || decision === "NO SUCH HOST") return "text-red-700 dark:text-red-300";
  if (decision === "FORWARD" || decision === "DELIVERED" || decision === "ROUTE SELECTED" || decision === "FOR THIS ROUTER" || decision === "SAME NETWORK") return "text-emerald-700 dark:text-emerald-300";
  return "text-ink dark:text-bone";
}

export const PacketInspector = memo(function PacketInspector({ plan, step }: { plan: Plan | null; step: PlanStep | null }) {
  const i = step?.inspect;
  const rows: [string, string | undefined][] = [
    ["Source IP", plan?.srcIp],
    ["Destination IP", plan?.dstIp],
    ["TTL", i ? String(i.ttl) : undefined],
    ["Current device", i?.device],
    ["Incoming interface", i?.inIface],
    ["Matching route", i?.route],
    ["Next hop", i?.nextHop],
    ["Outgoing interface", i?.outIface],
  ];
  return (
    <Panel title="Packet inspector">
      <dl className="grid grid-cols-1 gap-x-4 gap-y-1.5 text-xs min-[420px]:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k} className="flex min-w-0 items-baseline justify-between gap-2 border-b border-line/60 pb-1 dark:border-line-dark/60">
            <dt className="shrink-0 text-ink-soft dark:text-bone-soft">{k}</dt>
            <dd className="min-w-0 break-words text-right font-mono text-ink dark:text-bone">{v ?? "—"}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-2.5 rounded-xl border border-line bg-ink/[0.03] px-3 py-2 dark:border-line-dark dark:bg-bone/[0.05]">
        <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Decision</p>
        <p className={cn("font-mono text-sm font-bold", i ? toneOf(i.decision) : "text-ink-soft dark:text-bone-soft")}>{i ? i.decision : "—"}</p>
        {i?.reason && (
          <p className="mt-0.5 text-xs text-ink-soft dark:text-bone-soft">
            <span className="font-semibold">Reason:</span> {i.reason}
          </p>
        )}
      </div>
      <p className="mt-2 text-[11px] leading-snug text-ink-soft dark:text-bone-soft">
        The source and destination IP addresses stay the same all the way. Each router lowers the TTL by 1. On each link the packet rides inside a fresh Ethernet frame, but the router chooses its route from the destination <em>IP</em> address, not from MAC addresses.
      </p>
      {!plan && <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">Send a packet to watch these fields change as it moves.</p>}
    </Panel>
  );
});
