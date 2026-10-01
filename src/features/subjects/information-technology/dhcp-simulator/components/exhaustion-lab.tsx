"use client";

import { useState } from "react";
import { Callout, Panel, SectionHeading } from "../../osi-model-explorer/components/ui";
import type { DhcpLab } from "../hooks/use-dhcp-lab";
import { CLIENT_IDS, CLIENT_META, canRunDora, initialState, poolStats, withPoolSize, type DetailLevel } from "../model";
import { LabDiagram } from "./run-panel";
import { ActionButton, Controls, DoraStrip, LeaseTable, StepBanner } from "./parts";
import { EventLog } from "../../ethernet-mac-simulator/components/event-log";

/** Deliberately shrink the pool, let more PCs ask than there are addresses, and see why the extra ones fail. */
export function ExhaustionLab({ lab, level }: { lab: DhcpLab; level: DetailLevel }) {
  const [size, setSize] = useState(3);
  const [count, setCount] = useState(5);
  const stats = poolStats(lab.saved);
  const askers = CLIENT_IDS.slice(0, count);
  const failed = CLIENT_IDS.filter((id) => lab.saved.clients[id].phase === "failed");
  const bound = CLIENT_IDS.filter((id) => lab.saved.clients[id].phase === "bound");
  const running = !!lab.run && !lab.player.isFinished;
  const done = !!lab.lastCompleted && !running;
  const ready = askers.filter((id) => canRunDora(lab.saved, id));
  const releasable = bound[0];

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="When the pool runs out">
        Set how many addresses the server has and how many PCs ask for one. Then run DHCP and watch what happens to the PCs at the end of the queue.
      </SectionHeading>

      <Panel title="Set up the experiment">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm text-ink dark:text-bone">
            Addresses in the pool: <span className="font-mono font-semibold">{size}</span>
            <input type="range" min={1} max={8} value={size} onChange={(e) => setSize(Number(e.target.value))} className="h-11 w-full accent-[var(--subject-it,#0ea5e9)]" aria-label="Number of addresses in the pool" />
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink dark:text-bone">
            PCs requesting an address: <span className="font-mono font-semibold">{count}</span>
            <input type="range" min={1} max={5} value={count} onChange={(e) => setCount(Number(e.target.value))} className="h-11 w-full accent-[var(--subject-it,#0ea5e9)]" aria-label="Number of PCs requesting an address" />
          </label>
        </div>
        <p className="mt-2 font-mono text-sm text-ink dark:text-bone">
          Available addresses: {size} · Clients requesting: {count}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <ActionButton onClick={() => lab.load({ state: initialState(withPoolSize(size)), selected: "pc1" })}>Reset with these numbers</ActionButton>
          <ActionButton tone="primary" disabled={running || ready.length === 0} onClick={() => lab.startDora(askers, "auto")}>
            ▶ Start DHCP for {count} PC{count === 1 ? "" : "s"}
          </ActionButton>
        </div>
      </Panel>

      <div className="rounded-card border border-line bg-white/60 p-3.5 dark:border-line-dark dark:bg-white/[0.03]">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">The DORA process</p>
        <DoraStrip run={lab.run} step={lab.step} stepIndex={lab.stepIndex} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <div className="flex min-w-0 flex-col gap-4">
          <LabDiagram lab={lab} showIdleHint={false} />
          <StepBanner lab={lab} level={level} readyText="Choose the numbers above and press Start DHCP. PCs ask one after another, and each sees the pool as the previous one left it." />
          <Controls lab={lab} canStart={ready.length > 0} onStart={(m) => lab.startDora(askers, m)} startLabel={`▶ Start DHCP (${count})`} />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <LeaseTable state={lab.state} />
          {done && (
            <Callout tone={failed.length > 0 ? "bad" : "good"} title={failed.length > 0 ? `${failed.length} PC${failed.length === 1 ? "" : "s"} could not get an address` : "Every PC got an address"}>
              {failed.length > 0 ? (
                <>
                  <p>
                    {bound.length} PC{bound.length === 1 ? "" : "s"} received an address. {failed.map((id) => CLIENT_META[id].name).join(", ")} sent a Discover and got no Offer, because the server had no free address to offer.
                  </p>
                  <p className="mt-2 font-medium text-ink dark:text-bone">DHCP cannot assign an address if its configured pool has no available address.</p>
                  <p className="mt-2">The server is working exactly as configured. The problem is capacity, and only an administrator can fix it: enlarge the pool, shorten leases so unused addresses return sooner, or release addresses that are no longer needed.</p>
                </>
              ) : (
                <p>The pool had enough addresses ({stats.leased} leased). Lower the number of addresses or raise the number of PCs to see it run dry.</p>
              )}
            </Callout>
          )}
          {done && failed.length > 0 && (
            <Panel title="Try a fix">
              <div className="flex flex-wrap gap-2">
                <ActionButton
                  onClick={() => lab.applyPoolConfig({ ...lab.saved.pool, end: Math.min(254, lab.saved.pool.end + failed.length) })}
                  disabled={running}
                >
                  Add {failed.length} address{failed.length === 1 ? "" : "es"} to the pool
                </ActionButton>
                <ActionButton disabled={running || !releasable} onClick={() => releasable && lab.startRelease(releasable, "auto")}>
                  Release {releasable ? CLIENT_META[releasable].name : "a PC"}&apos;s address
                </ActionButton>
                <ActionButton tone="primary" disabled={running || stats.available === 0} onClick={() => lab.startDora(failed, "auto")}>
                  Retry the {failed.length} failed PC{failed.length === 1 ? "" : "s"}
                </ActionButton>
              </div>
              <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">Free addresses now: {stats.available}. A retry only succeeds when there is at least one.</p>
            </Panel>
          )}
        </div>
      </div>
      <EventLog entries={lab.log} onClear={lab.clearLog} title="DHCP event log" />
    </div>
  );
}
