"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { Panel } from "../../osi-model-explorer/components/ui";
import type { Transmission } from "../lab-state";
import { formatPort, formatPorts, isBroadcastMac } from "../model";

export interface Draft {
  srcMac: string;
  dstMac: string;
}

function Field({ label, value, tone }: { label: string; value: string; tone?: "pending" | "good" | "flood" | "broadcast" }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-line/60 py-1.5 last:border-b-0 dark:border-line-dark/60 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
      <dt className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{label}</dt>
      <dd
        className={cn(
          "break-words font-mono text-xs sm:text-right",
          tone === "pending" && "text-ink-soft dark:text-bone-soft",
          tone === "good" && "font-semibold text-emerald-700 dark:text-emerald-300",
          tone === "flood" && "font-semibold text-violet-700 dark:text-violet-300",
          tone === "broadcast" && "font-semibold text-amber-700 dark:text-amber-300",
          !tone && "text-ink dark:text-bone",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function FramePart({ label, value, active, hint, grow }: { label: string; value: string; active?: boolean; hint?: string; grow?: boolean }) {
  return (
    <div className={cn("rounded-lg border px-2 py-1.5 text-center transition-colors", grow ? "min-w-[9.5rem] flex-1" : "flex-none", active ? "border-subject-it bg-subject-it-soft dark:bg-subject-it/20" : "border-line dark:border-line-dark")}>
      <p className="font-mono text-[9px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{label}</p>
      <p className="font-mono text-[11px] text-ink dark:text-bone">{value}</p>
      {active && hint && <p className="font-mono text-[9px] font-semibold uppercase text-subject-it">{hint}</p>}
    </div>
  );
}

export const FrameInspector = memo(function FrameInspector({ tx, draft }: { tx: Transmission | null; draft: Draft }) {
  const stage = tx?.stage ?? 0;
  const srcMac = tx?.srcMac ?? draft.srcMac;
  const dstMac = tx?.dstMac ?? draft.dstMac;
  const broadcast = isBroadcastMac(dstMac);
  const d = tx && stage >= 5 ? tx.decision : undefined;

  let decisionText = "—";
  let decisionTone: "pending" | "good" | "flood" | "broadcast" | undefined = "pending";
  let actionText = "—";
  if (tx && stage >= 4 && tx.lookup) {
    if (tx.lookup.broadcast) [decisionText, decisionTone] = ["Broadcast", "broadcast"];
    else if (tx.lookup.found) [decisionText, decisionTone] = ["Known Destination", "good"];
    else [decisionText, decisionTone] = ["Unknown Destination", "flood"];
  }
  if (d) actionText = d.action === "flood" ? "Flood" : d.egress.length ? "Forward to one port" : "Filter (drop)";

  return (
    <Panel title="Frame inspector">
      <div className="flex flex-wrap gap-1.5" aria-label="Ethernet frame fields">
        <FramePart grow label="Destination MAC" value={dstMac} active={stage === 4} hint="read to decide" />
        <FramePart grow label="Source MAC" value={srcMac} active={stage === 3} hint="read to learn" />
        <FramePart label="Type" value="…" />
        <FramePart label="Payload" value="data" />
        <FramePart label="FCS" value="check" />
      </div>
      <p className="mt-1.5 text-[11px] text-ink-soft dark:text-bone-soft">{tx ? "The switch reads only the two MAC addresses — never the payload." : "Draft frame — press Send frame to start it."}</p>

      <dl className="mt-2">
        <Field label="Source MAC" value={srcMac} />
        <Field label="Destination MAC" value={dstMac} />
        <Field label="Frame type" value={broadcast ? "Broadcast" : "Unicast"} />
        <Field label="Incoming port" value={tx && stage >= 2 ? formatPort(tx.srcPort) : "—"} tone={tx && stage >= 2 ? undefined : "pending"} />
        <Field label="Outgoing port(s)" value={d ? (d.egress.length ? `${formatPorts(d.egress)}${d.action === "flood" ? " (all except incoming)" : ""}` : "none") : "—"} tone={d ? undefined : "pending"} />
        <Field label="Switch decision" value={decisionText} tone={decisionTone} />
        <Field label="Action" value={actionText} tone={d ? (d.kind === "known-unicast" ? "good" : d.kind === "broadcast" ? "broadcast" : "flood") : "pending"} />
      </dl>
    </Panel>
  );
});
