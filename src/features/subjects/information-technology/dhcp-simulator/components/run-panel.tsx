"use client";

import { SimulationLayout, type SimulationRunState } from "@/features/simulation";
import { EventLog } from "../../ethernet-mac-simulator/components/event-log";
import type { DhcpLab } from "../hooks/use-dhcp-lab";
import { CLIENT_IDS, CLIENT_META, canRunDora, type DetailLevel } from "../model";
import { DhcpDiagram, DiagramLegend, VIEW_H, VIEW_W } from "./dhcp-diagram";
import { MessageInspector } from "./message-inspector";
import { ActionButton, ClientPicker, Collapsible, ConfigCard, Controls, DoraStrip, LeaseTable, SpeedSelect, StepBanner } from "./parts";

export function legMsFor(speed: number): number {
  return Math.round(Math.min(650, (1600 / speed) * 0.4));
}

function stageKeyFor(lab: DhcpLab) {
  return lab.run && lab.stepIndex >= 0 ? `${lab.run.id}:${lab.stepIndex}` : null;
}

/** The diagram wired to a lab: shows the step's message, the shown (mid-run) state, and the focused PC. Fills its frame. */
function StageDiagram({ lab, showIdleHint }: { lab: DhcpLab; showIdleHint?: boolean }) {
  return <DhcpDiagram state={lab.state} step={lab.step} stepKey={stageKeyFor(lab)} legMs={legMsFor(lab.player.speed)} selectedId={lab.step?.clientId ?? lab.selectedId} onSelect={lab.setSelectedId} showIdleHint={showIdleHint} />;
}

/** The diagram on its own (no playback controls), for labs that only illustrate a finished run. */
export function LabDiagram({ lab, showIdleHint }: { lab: DhcpLab; showIdleHint?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="mx-auto w-full max-w-[560px] rounded-card border border-line bg-paper dark:border-line-dark dark:bg-chalkboard" style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}>
        <StageDiagram lab={lab} showIdleHint={showIdleHint} />
      </div>
      <DiagramLegend />
    </div>
  );
}

/**
 * The lab surface every DHCP tab that plays messages shares: the diagram, a one-line step readout and the
 * playback controls stay on screen (SimulationLayout), while the step banner, speed and the lab's own panels
 * scroll beside / below them.
 */
export function RunLayout({ lab, actions, banner, hint, showIdleHint, children }: { lab: DhcpLab; actions: React.ReactNode; banner: React.ReactNode; hint?: string; showIdleHint?: boolean; children?: React.ReactNode }) {
  const runState: SimulationRunState = !lab.run ? "idle" : lab.player.isPlaying ? "running" : lab.player.isFinished ? "finished" : "paused";
  return (
    <SimulationLayout
      stageLabel="DHCP simulation"
      aspect={VIEW_W / VIEW_H}
      stageCap="30rem"
      runState={runState}
      stage={<StageDiagram lab={lab} showIdleHint={showIdleHint} />}
      readouts={
        <p className="truncate text-center text-sm font-medium text-ink dark:text-bone">
          {lab.run && lab.step ? `Step ${lab.stepIndex + 1} of ${lab.run.steps.length}: ${lab.step.title}` : "Press Start or Next Step to begin"}
        </p>
      }
      actions={actions}
      controls={
        <div className="flex min-w-0 flex-col gap-4">
          {banner}
          {hint && !lab.run ? <p className="px-1 text-xs text-ink-soft dark:text-bone-soft">{hint}</p> : null}
          <SpeedSelect lab={lab} />
          <DiagramLegend />
          {children}
        </div>
      }
    />
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
        <p className="mb-2 font-mono text-label uppercase tracking-wide text-ink-soft dark:text-bone-soft">The DORA process</p>
        <DoraStrip run={lab.run} step={lab.step} stepIndex={lab.stepIndex} />
      </div>

      <RunLayout
        lab={lab}
        banner={<StepBanner lab={lab} level={level} />}
        hint={hint}
        actions={<Controls lab={lab} canStart={canStart} onStart={(mode) => lab.startDora([lab.selectedId], mode)} />}
      >
        <ConfigCard state={lab.state} id={focus} />
        <LeaseTable state={lab.state} highlightIp={lab.state.clients[focus].config?.ip ?? null} />
        <Collapsible title="Message inspector: click a DHCP message">
          <MessageInspector messages={lab.run?.messages ?? []} currentIndex={currentMessageIndex(lab)} level={level} />
        </Collapsible>
      </RunLayout>

      <EventLog entries={lab.log} onClear={lab.clearLog} title="DHCP event log" />
    </div>
  );
}
