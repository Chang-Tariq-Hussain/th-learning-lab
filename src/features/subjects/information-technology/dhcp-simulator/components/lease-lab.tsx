"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Callout, Panel, SectionHeading } from "../../osi-model-explorer/components/ui";
import { EventLog } from "../../ethernet-mac-simulator/components/event-log";
import type { DhcpLab } from "../hooks/use-dhcp-lab";
import { CLIENT_IDS, CLIENT_META, canRunDora, formatDuration, leaseElapsed, leaseRemaining, type DetailLevel } from "../model";
import { LabDiagram } from "./run-panel";
import { ActionButton, Controls, DoraStrip, LeaseTable, StepBanner } from "./parts";

/** Lease timer with the renewal point (T1, half of the lease) marked. */
function LeaseBar({ elapsed }: { elapsed: number }) {
  return (
    <div className="relative h-3 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-bone/10" role="img" aria-label={`${Math.round(elapsed * 100)} percent of the lease has passed`}>
      <div className={cn("h-full rounded-full transition-all", elapsed >= 1 ? "bg-red-500" : elapsed >= 0.5 ? "bg-amber-500" : "bg-emerald-500")} style={{ width: `${Math.max(2, elapsed * 100)}%` }} />
      <span className="absolute inset-y-0 left-1/2 w-0.5 bg-ink/50 dark:bg-bone/60" aria-hidden />
    </div>
  );
}

export function LeaseLab({ lab, level }: { lab: DhcpLab; level: DetailLevel }) {
  const [auto, setAuto] = useState(false);
  const mode = auto ? "auto" : "step";
  const running = !!lab.run && !lab.player.isFinished;
  const s = lab.saved;
  const leased = s.leases.filter((l) => l.status === "leased");
  const idle = CLIENT_IDS.filter((id) => canRunDora(s, id));

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="Leases: release and renew">
        A lease is temporary. A client can renew it to keep its address, release it to give it back, or simply never renew, in which case it expires.
      </SectionHeading>
      <Callout tone="neutral" title="A simplification in this lab">
        Real clients renew automatically, starting when about half of the lease has passed. Here a client renews only when you press Renew, so you can also see what happens to a client that never does (for example a laptop that left the network).
      </Callout>

      <Panel title="Lab clock">
        <p className="font-mono text-sm text-ink dark:text-bone">
          +{formatDuration(s.clock)} since the lab started · lease length {formatDuration(s.pool.leaseMin)}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {[10, 30, 60].map((m) => (
            <ActionButton key={m} onClick={() => lab.advanceTime(m)} disabled={running}>
              Advance {m} min
            </ActionButton>
          ))}
        </div>
      </Panel>

      <Panel title="Clients holding a lease">
        {leased.length === 0 ? (
          <div>
            <p className="text-sm text-ink-soft dark:text-bone-soft">No PC has a lease yet.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {idle.slice(0, 3).length > 0 && (
                <ActionButton tone="primary" disabled={running} onClick={() => lab.startDora(idle.slice(0, 3), "auto")}>
                  Give {Math.min(3, idle.length)} PCs a lease
                </ActionButton>
              )}
            </div>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {leased.map((l) => {
              const el = leaseElapsed(l, s.clock);
              const name = CLIENT_META[l.clientId].name;
              return (
                <li key={l.ip} className="flex flex-col gap-2 rounded-lg border border-line p-3 dark:border-line-dark">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-sm font-semibold text-ink dark:text-bone">
                      {name} <span className="font-mono font-normal">{l.ip}</span>
                    </span>
                    <span className="text-xs text-ink-soft dark:text-bone-soft">
                      {formatDuration(leaseRemaining(l, s.clock))} left{el >= 0.5 ? " · past the halfway (T1) point: time to renew" : ""}
                    </span>
                  </div>
                  <LeaseBar elapsed={el} />
                  <div className="flex flex-wrap gap-2">
                    <ActionButton tone="good" disabled={running} onClick={() => lab.startRenew(l.clientId, mode)}>
                      Renew
                    </ActionButton>
                    <ActionButton tone="warn" disabled={running} onClick={() => lab.startRelease(l.clientId, mode)}>
                      Release
                    </ActionButton>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {s.leases.some((l) => l.status === "expired") && <p className="mt-3 text-xs text-red-700 dark:text-red-300">Some leases expired. Those PCs lost their configuration and must run DORA again in the Get an Address tab.</p>}
        <label className="mt-3 flex min-h-[44px] items-center gap-2 text-sm text-ink dark:text-bone">
          <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} className="h-5 w-5" />
          Play renew/release automatically (otherwise step through with Next Step)
        </label>
      </Panel>

      <div className="rounded-card border border-line bg-white/60 p-3.5 dark:border-line-dark dark:bg-white/[0.03]">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Renew and release exchanges</p>
        <DoraStrip run={lab.run} step={lab.step} stepIndex={lab.stepIndex} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <div className="flex min-w-0 flex-col gap-4">
          <LabDiagram lab={lab} showIdleHint={false} />
          <StepBanner lab={lab} level={level} readyText="Press Renew or Release next to a PC above. Renewal is a short two-message exchange; release is one message the server never answers." />
          <Controls lab={lab} canStart={false} showStart={false} onStart={() => undefined} />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <LeaseTable state={lab.state} />
        </div>
      </div>
      <EventLog entries={lab.log} onClear={lab.clearLog} title="DHCP event log" />
    </div>
  );
}
