"use client";

import { useState, type ReactNode } from "react";
import type { DnsLab } from "../hooks/use-dns-lab";
import { validateName, type DetailLevel, type Fault, type NodeId } from "../model";
import { DnsDiagram, StateLegend } from "./dns-diagram";
import { CachePanel, Collapsible, Controls, DnsEventLog, NodeInfo, QueryInspector, ResultCard, StepBanner } from "./parts";

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

  return (
    <div className="flex flex-col gap-4">
      {header}
      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <div className="flex min-w-0 flex-col gap-3">
          <DnsDiagram run={lab.run} step={lab.step} stepKey={stepKey} legMs={legMsFor(lab.player.speed)} cache={lab.cache} selected={node} onSelect={(id) => setNode((n) => (n === id ? null : id))} resolvedIp={resolvedIp} />
          <StateLegend />
          <NodeInfo node={node} level={level} />
          <StepBanner lab={lab} level={level} idleText={idleText} />
          <Controls lab={lab} canStart={canStart} onStart={(mode) => lab.resolve(lab.domain, mode, fault)} hint={canStart ? undefined : "Enter a valid domain name to start."} />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
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
      </div>
      <DnsEventLog lab={lab} entries={lab.log} />
    </div>
  );
}
