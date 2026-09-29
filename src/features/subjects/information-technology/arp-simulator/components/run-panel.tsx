"use client";

import { cn } from "@/lib/utils";
import { EventLog } from "../../ethernet-mac-simulator/components/event-log";
import type { ArpLab } from "../hooks/use-arp-lab";
import { SCENARIOS, SOURCE_IDS, nodeById, scenarioById, type DetailLevel, type ScenarioId } from "../model";
import { ArpDiagram } from "./arp-diagram";
import { CachePanel } from "./cache-panel";
import { ChainStrip, Collapsible, Controls, KnowledgeCard, StepBanner, StepList } from "./parts";
import { MessageInspector } from "./packet-view";

function ScenarioPicker({ lab, ids }: { lab: ArpLab; ids: ScenarioId[] }) {
  const items = SCENARIOS.filter((s) => ids.includes(s.id));
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Scenario">
      {items.map((s) => (
        <button
          key={s.id}
          role="radio"
          aria-checked={lab.scenario === s.id}
          onClick={() => lab.setScenario(s.id)}
          className={cn(
            "min-h-[40px] rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            lab.scenario === s.id ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20" : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

function CustomInputs({ lab }: { lab: ArpLab }) {
  const invalid = !lab.destCheck.ok;
  const field = "min-h-[44px] rounded-lg border border-line bg-paper px-3 text-sm text-ink dark:border-line-dark dark:bg-chalkboard dark:text-bone";
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <label className="flex flex-col gap-1 text-xs text-ink-soft dark:text-bone-soft">
        Sender
        <select value={lab.srcId} onChange={(e) => lab.setSrcId(e.target.value as (typeof SOURCE_IDS)[number])} className={field}>
          {SOURCE_IDS.map((id) => {
            const n = nodeById(lab.nodes, id)!;
            return (
              <option key={id} value={id}>
                {n.name} ({n.ip})
              </option>
            );
          })}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs text-ink-soft dark:text-bone-soft">
        Destination IPv4 address
        <input
          value={lab.destIp}
          onChange={(e) => lab.setDestIp(e.target.value)}
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          aria-invalid={invalid}
          aria-describedby="arp-dest-help"
          className={cn(field, "font-mono", invalid && "border-red-400 dark:border-red-500/60")}
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-ink-soft dark:text-bone-soft">
        Message
        <input value={lab.message} onChange={(e) => lab.setMessage(e.target.value.slice(0, 40))} maxLength={40} className={field} />
      </label>
      <p id="arp-dest-help" className={cn("text-xs sm:col-span-3", invalid ? "text-red-700 dark:text-red-300" : "text-ink-soft dark:text-bone-soft")}>
        {lab.destCheck.ok
          ? "Try 192.168.1.30 (PC-C), 192.168.1.1 (the router), 192.168.1.99 (nobody), or 10.0.0.5 (another network)."
          : lab.destCheck.reason}
      </p>
    </div>
  );
}

/**
 * The reusable "run the scenario" surface: scenario choice, what the sender knows, the key chain,
 * the diagram, the current step, controls, the ARP cache, the message inspector, and the logs.
 * On narrow screens everything stacks, the controls stay pinned, and the inspector is collapsible.
 */
export function RunPanel({ lab, level, scenarios, remoteHint, hidePicker, allowRemove }: { lab: ArpLab; level: DetailLevel; scenarios: ScenarioId[]; remoteHint?: boolean; hidePicker?: boolean; allowRemove?: boolean }) {
  const preset = scenarioById(lab.scenario);
  const showRemote = !!remoteHint || (lab.run ? !lab.run.local : preset.destIp.startsWith("192.168.2."));
  const stage = lab.step ? (lab.run && lab.stepIndex >= lab.run.steps.length - 1 && lab.run.outcome !== "unanswered" && lab.run.outcome !== "hit-wrong" ? "data" : lab.step.chain) : null;

  return (
    <div className="flex flex-col gap-4">
      {!hidePicker && <ScenarioPicker lab={lab} ids={scenarios} />}
      {lab.scenario === "custom" && <CustomInputs lab={lab} />}

      <div className="grid gap-3 lg:grid-cols-2">
        <KnowledgeCard lab={lab} />
        <div className="rounded-card border border-line bg-white/60 p-3.5 dark:border-line-dark dark:bg-white/[0.03]">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">The key chain</p>
          <ChainStrip run={lab.run} stage={stage} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <ArpDiagram nodes={lab.nodes} step={lab.step} srcId={lab.srcId} showRemote={showRemote} showIdleHint selectedId={lab.inspectId} onSelect={lab.setInspectId} />
        </div>
        <div className="min-w-0 lg:col-start-1 lg:row-start-2">
          <StepBanner lab={lab} />
        </div>
        <div className="min-w-0 lg:col-start-1 lg:row-start-3">
          <Controls lab={lab} />
        </div>
        <div className="min-w-0 lg:col-start-2 lg:row-start-1">
          <CachePanel lab={lab} onRemove={allowRemove ? (ip) => lab.removeCacheEntry(lab.inspectId, ip) : undefined} />
        </div>
        <div className="min-w-0 lg:col-start-2 lg:row-start-2 lg:row-span-2">
          <Collapsible title="Message inspector — ARP message or Ethernet frame">
            <MessageInspector run={lab.run} message={lab.step?.message ?? null} nodes={lab.nodes} level={level} />
          </Collapsible>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <Collapsible title={`Steps${lab.run ? ` · ${lab.run.steps.length}` : ""}`} defaultOpen={false}>
          <StepList run={lab.run} stepIndex={lab.stepIndex} />
        </Collapsible>
        <div className="min-w-0">
          <EventLog entries={lab.log} onClear={lab.clearLog} title="ARP event log" />
        </div>
      </div>
    </div>
  );
}
