"use client";

import { useState, type ReactNode } from "react";
import { SimulationLayout, type SimulationRunState } from "@/features/simulation";
import type { DnsLab } from "../hooks/use-dns-lab";
import { validateName, type DetailLevel, type Fault, type NodeId } from "../model";
import { DnsDiagram, StateLegend, VIEW_H, VIEW_W } from "./dns-diagram";
import { CachePanel, Collapsible, Controls, DnsEventLog, NodeInfo, QueryInspector, ResultCard, SpeedSelect, StepBanner } from "./parts";

export function legMsFor(speed: number): number {
  return Math.round(Math.min(650, (1600 / speed) * 0.4));
}

/**
 * The reusable "run a lookup" surface: the diagram wired to the lab, the step banner and controls, the result, the
 * resolver cache, the query inspector and the event log. The Resolve and Scenarios tabs both render it.
 * Stacks on small screens; the controls stay pinned to the bottom of the viewport while the diagram scrolls.
 */
export function RunSurface({ lab, level, header, fault = null, idleText, onGoToCache }: { lab: DnsLab; level: DetailLevel; header?: ReactNode; fault?: Fault; idleText?: string; onGoToCache?: () => void }) {
  const [node, setNode] = useState<NodeId | null>(null);
  const canStart = !validateName(lab.domain);
  const stepKey = lab.run && lab.stepIndex >= 0 ? `${lab.run.id}:${lab.stepIndex}` : null;
  const result = lab.runDone ? lab.run?.result : null;
  const resolvedIp = result?.ip ?? null;

  const runState: SimulationRunState = !lab.run ? "idle" : lab.player.isPlaying ? "running" : lab.runDone ? "finished" : "paused";
  const hint = canStart ? undefined : "Enter a valid domain name to start.";

  return (
    <div className="flex flex-col gap-4">
      {header}
      <SimulationLayout
        stageLabel="DNS lookup simulation"
        aspect={VIEW_W / VIEW_H}
        stageCap="30rem"
        runState={runState}
        stage={<DnsDiagram run={lab.run} step={lab.step} stepKey={stepKey} legMs={legMsFor(lab.player.speed)} cache={lab.cache} selected={node} onSelect={(id) => setNode((n) => (n === id ? null : id))} resolvedIp={resolvedIp} />}
        readouts={
          <p className="truncate text-center text-sm font-medium text-ink dark:text-bone">
            {lab.run && lab.step ? `Step ${lab.stepIndex + 1} of ${lab.run.steps.length}: ${lab.step.title}` : "Press Start or Next step to begin"}
          </p>
        }
        actions={<Controls lab={lab} canStart={canStart} onStart={(mode) => lab.resolve(lab.domain, mode, fault)} />}
        controls={
          <div className="flex min-w-0 flex-col gap-4">
            <StepBanner lab={lab} level={level} idleText={idleText} />
            {hint && <p className="px-1 text-xs text-ink-soft dark:text-bone-soft">{hint}</p>}
            <SpeedSelect lab={lab} />
            <StateLegend />
            <NodeInfo node={node} level={level} />
            <ResultCard lab={lab} />
            <CachePanel cache={lab.cache} now={lab.now} highlight={lab.step?.highlight} onFlush={lab.flushCache} />
            {onGoToCache && (
              <button onClick={onGoToCache} className="inline-flex min-h-[44px] items-center self-start text-sm font-medium text-subject-it underline-offset-2 hover:underline">
                Explore the cache and TTL →
              </button>
            )}
            <Collapsible title="Query inspector: click a DNS message">
              <QueryInspector run={lab.run} stepIndex={lab.stepIndex} level={level} />
            </Collapsible>
          </div>
        }
      />
      <DnsEventLog lab={lab} entries={lab.log} />
    </div>
  );
}
