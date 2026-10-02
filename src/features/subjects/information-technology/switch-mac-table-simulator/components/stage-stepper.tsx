"use client";

import { memo } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Transmission } from "../lab-state";
import { LAST_STAGE, OUTCOME_BANNER, STAGES, deviceById, formatPort, formatPorts, type ForwardKind } from "../model";

export function narrate(tx: Transmission | null): string {
  if (!tx) return "Pick a sender and a destination, then press Send frame. Watch what the switch does at each stage.";
  const src = deviceById(tx.srcId).name;
  const ingress = formatPort(tx.srcPort);
  switch (tx.stage) {
    case 1:
      return `${src} builds an Ethernet frame addressed to ${tx.dstMac} and sends it down the cable toward the switch.`;
    case 2:
      return `The frame arrives on ${ingress}. The switch now knows which port it came in on — the incoming port.`;
    case 3: {
      const r = tx.learn?.result;
      return r === "new"
        ? `The switch reads the SOURCE MAC ${tx.srcMac} and learns it: ${tx.srcMac} is reachable via ${ingress}. A new entry is added to the MAC table.`
        : `The switch reads the SOURCE MAC ${tx.srcMac}. It is already in the table on ${ingress}, so no duplicate is created — the entry's age is reset to 0.`;
    }
    case 4: {
      if (tx.lookup?.broadcast) return `The destination is ${tx.dstMac}, the broadcast address. It is never stored in the MAC table, so there is nothing to look up.`;
      if (tx.lookup?.found) return `The switch looks up the DESTINATION MAC ${tx.dstMac}: found, on ${formatPort(tx.lookup.port!)}.`;
      return `The switch looks up the DESTINATION MAC ${tx.dstMac}: it is not in the table, so the switch doesn't know where that device is.`;
    }
    case 5: {
      const d = tx.decision;
      if (!d) return "";
      if (d.kind === "known-unicast") return d.egress.length ? `Destination known → forward the frame out ${formatPort(d.foundPort!)} only. Every other port stays quiet.` : `Destination known, but it can't be reached through ${formatPort(d.foundPort!)} — the frame is filtered.`;
      if (d.kind === "unknown-unicast") return `Destination unknown → flood: send a copy out every port except ${ingress}. The real owner (if any) will accept it; everyone else ignores it.`;
      return `Broadcast → flood: send a copy out every port except ${ingress}, so every host on the LAN receives it.`;
    }
    case 6: {
      const d = tx.decision;
      return d && d.egress.length ? `The frame leaves the switch through ${formatPorts(d.egress)} — never back out ${ingress}.` : "There is no port to send the frame out of, so it is dropped.";
    }
    default: {
      const acc = (tx.deliveries ?? []).filter((x) => x.accepted).length;
      const ign = (tx.deliveries ?? []).length - acc;
      return `Each host compares the destination MAC with its own. ${acc} accepted the frame${ign ? `, ${ign} ignored it (not addressed to them)` : ""}. Done — look at the MAC table and compare with the next frame.`;
    }
  }
}

const BANNER_TONE: Record<ForwardKind, string> = {
  "known-unicast": "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200",
  "unknown-unicast": "border-violet-500 bg-violet-50 text-violet-800 dark:bg-violet-500/10 dark:text-violet-200",
  broadcast: "border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-200",
};

export const StageStepper = memo(function StageStepper({ tx }: { tx: Transmission | null }) {
  const stage = tx?.stage ?? 0;
  const kind = tx && tx.stage >= 5 ? tx.decision?.kind : undefined;
  return (
    <div className="flex flex-col gap-3">
      <ol className="grid grid-cols-2 gap-1.5 sm:grid-cols-4" aria-label="Switching stages">
        {STAGES.map((s) => {
          const done = stage > s.n || (stage === LAST_STAGE && s.n === LAST_STAGE);
          const current = stage === s.n && !done;
          return (
            <li
              key={s.n}
              aria-current={current ? "step" : undefined}
              className={cn(
                "flex min-h-[40px] items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[11px] font-medium leading-tight",
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

      <div className={cn("rounded-xl border-2 px-3 py-2 text-center font-mono text-sm font-bold tracking-wide sm:text-base", kind ? BANNER_TONE[kind] : "border-dashed border-line text-ink-soft dark:border-line-dark dark:text-bone-soft")}>
        {kind ? OUTCOME_BANNER[kind] : "Outcome appears after the switch decides"}
      </div>

      <p role="status" className="min-h-[3.5rem] text-sm leading-relaxed text-ink dark:text-bone">
        <span className="font-mono text-[11px] uppercase tracking-wide text-subject-it">{stage ? `Stage ${stage} of ${LAST_STAGE} · ${STAGES[stage - 1]!.label}` : "Ready"}</span>
        <br />
        {narrate(tx)}
      </p>
    </div>
  );
});

const LEGEND: { kind: ForwardKind; title: string; cond: string; result: string; tone: string }[] = [
  { kind: "unknown-unicast", title: "Unknown unicast", cond: "Destination MAC not in the table", result: "Flood to every port except the incoming one", tone: "border-violet-500 bg-violet-50 dark:bg-violet-500/10" },
  { kind: "known-unicast", title: "Known unicast", cond: "Destination MAC found in the table", result: "Forward out that one port only", tone: "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" },
  { kind: "broadcast", title: "Broadcast", cond: "Destination FF:FF:FF:FF:FF:FF", result: "Flood to every port except the incoming one", tone: "border-amber-500 bg-amber-50 dark:bg-amber-500/10" },
];

/** The three possible outcomes side by side; the one the current frame produced is highlighted. */
export const OutcomeLegend = memo(function OutcomeLegend({ tx }: { tx: Transmission | null }) {
  const active = tx && tx.stage >= 5 ? tx.decision?.kind : undefined;
  return (
    <div className="grid gap-2 sm:grid-cols-3" role="group" aria-label="The three forwarding outcomes">
      {LEGEND.map((l) => (
        <div key={l.kind} className={cn("rounded-xl border p-3 text-xs transition-colors", active === l.kind ? cn("border-2", l.tone) : "border-line dark:border-line-dark", active && active !== l.kind && "opacity-60")}>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-ink dark:text-bone">{l.title}</p>
          <p className="mt-1 text-ink-soft dark:text-bone-soft">{l.cond}</p>
          <p className="mt-1 flex items-start gap-1 font-medium text-ink dark:text-bone">
            <span aria-hidden>↓</span>
            {l.result}
          </p>
        </div>
      ))}
    </div>
  );
});
