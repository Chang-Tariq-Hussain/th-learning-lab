"use client";

import { EventLog } from "../../ethernet-mac-simulator/components/event-log";
import type { DhcpLab } from "../hooks/use-dhcp-lab";
import { CLIENT_IDS, CLIENT_META, canRunDora, type DetailLevel } from "../model";
import { DhcpDiagram, DiagramLegend } from "./dhcp-diagram";
import { MessageInspector } from "./message-inspector";
import { ActionButton, ClientPicker, Collapsible, ConfigCard, Controls, DoraStrip, LeaseTable, StepBanner } from "./parts";

export function legMsFor(speed: number): number {
  return Math.round(Math.min(650, (1600 / speed) * 0.4));
}

/** The diagram wired to a lab: shows the step's message, the shown (mid-run) state, and the focused PC. */
export function LabDiagram({ lab, showIdleHint }: { lab: DhcpLab; showIdleHint?: boolean }) {
  const stepKey = lab.run && lab.stepIndex >= 0 ? `${lab.run.id}:${lab.stepIndex}` : null;
  return (
    <div className="flex flex-col gap-2">
      <DhcpDiagram state={lab.state} step={lab.step} stepKey={stepKey} legMs={legMsFor(lab.player.speed)} selectedId={lab.step?.clientId ?? lab.selectedId} onSelect={lab.setSelectedId} showIdleHint={showIdleHint} />
      <DiagramLegend />
    </div>
  );
}

export function currentMessageIndex(lab: DhcpLab): number {
  if (!lab.run || !lab.step?.message) return -1;
  return lab.run.messages.indexOf(lab.step.message);
}

/**
 * The reusable "run DHCP" surface: choose a PC, watch the DORA chain and diagram, step or auto-play, and see the PC's
 * configuration, the lease table, the message inspector and the log. Stacks on small screens; controls stay pinned.
 */
export function RunPanel({ lab, level, allowBatch = true }: { lab: DhcpLab; level: DetailLevel; allowBatch?: boolean }) {
  const canStart = canRunDora(lab.saved, lab.selectedId);
  const pending = CLIENT_IDS.filter((id) => canRunDora(lab.saved, id));
  const focus = lab.step?.clientId ?? lab.selectedId;
  const sel = lab.saved.clients[lab.selectedId];
  const hint = canStart ? undefined : sel.mode === "manual" ? `${CLIENT_META[lab.selectedId].name} uses manual configuration. Switch it to DHCP in the Static vs DHCP tab.` : `${CLIENT_META[lab.selectedId].name} already has a lease. Release it in the Release & Renew tab, or choose another PC.`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <ClientPicker state={lab.state} value={lab.selectedId} onChange={lab.setSelectedId} />
        {allowBatch && pending.length > 1 && (
          <div>
            <ActionButton onClick={() => lab.startDora(pending, "auto")} disabled={!!lab.run && !lab.player.isFinished}>
              Configure all {pending.length} unconfigured PCs
            </ActionButton>
          </div>
        )}
      </div>

      <div className="rounded-card border border-line bg-white/60 p-3.5 dark:border-line-dark dark:bg-white/[0.03]">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">The DORA process</p>
        <DoraStrip run={lab.run} step={lab.step} stepIndex={lab.stepIndex} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <div className="flex min-w-0 flex-col gap-4">
          <LabDiagram lab={lab} />
          <StepBanner lab={lab} level={level} />
          <Controls lab={lab} canStart={canStart} onStart={(mode) => lab.startDora([lab.selectedId], mode)} hint={hint} />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <ConfigCard state={lab.state} id={focus} />
          <LeaseTable state={lab.state} highlightIp={lab.state.clients[focus].config?.ip ?? null} />
          <Collapsible title="Message inspector: click a DHCP message">
            <MessageInspector messages={lab.run?.messages ?? []} currentIndex={currentMessageIndex(lab)} level={level} />
          </Collapsible>
        </div>
      </div>

      <EventLog entries={lab.log} onClear={lab.clearLog} title="DHCP event log" />
    </div>
  );
}
