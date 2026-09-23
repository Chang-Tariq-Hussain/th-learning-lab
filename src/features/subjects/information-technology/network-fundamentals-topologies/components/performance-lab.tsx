"use client";

import { useMemo, useState } from "react";
import {
  BANDWIDTH_OPTIONS_MBPS,
  computeCongestion,
  computeThroughput,
  type CongestionFlow,
} from "../model";
import { Callout, LabeledSlider, Panel, PillButton, SectionHeading } from "./ui";

export function PerformanceLab() {
  const [bandwidth, setBandwidth] = useState(100);
  const [latency, setLatency] = useState(20);
  const [packetLoss, setPacketLoss] = useState(0);
  const [load, setLoad] = useState(60);

  const result = useMemo(
    () => computeThroughput({ bandwidthMbps: bandwidth, latencyMs: latency, packetLossPercent: packetLoss, loadPercent: load }),
    [bandwidth, latency, packetLoss, load],
  );

  const [flowCount, setFlowCount] = useState(2);
  const capacity = 100;
  const flows: CongestionFlow[] = useMemo(
    () => Array.from({ length: flowCount }, (_, i) => ({ id: `f${i}`, name: `PC ${i + 1}`, demandMbps: 60 })),
    [flowCount],
  );
  const congestion = useMemo(() => computeCongestion(flows, capacity), [flows]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <SectionHeading title="Bandwidth vs. throughput">
          Bandwidth is the theoretical, available capacity of a connection. Throughput is the actual data rate
          achieved once real conditions — load, latency, and packet loss — are taken into account.
        </SectionHeading>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr,1fr]">
          <div className="flex flex-col gap-4">
            <Panel title="Link bandwidth">
              <div className="flex flex-wrap gap-2">
                {BANDWIDTH_OPTIONS_MBPS.map((b) => (
                  <PillButton key={b} active={bandwidth === b} onClick={() => setBandwidth(b)}>
                    {b >= 1000 ? `${b / 1000} Gbps` : `${b} Mbps`}
                  </PillButton>
                ))}
              </div>
              <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">Illustrative link-capacity examples, not a measurement of any real connection.</p>
            </Panel>
            <Panel>
              <div className="flex flex-col gap-4">
                <LabeledSlider label="Latency" value={latency} min={1} max={300} unit=" ms" onChange={setLatency} />
                <LabeledSlider label="Packet loss" value={packetLoss} min={0} max={30} unit="%" onChange={setPacketLoss} />
                <LabeledSlider label="Network load" value={load} min={0} max={150} unit="%" onChange={setLoad} />
              </div>
            </Panel>
          </div>

          <Panel title="Result">
            <div className="flex flex-col gap-3">
              <div className="rounded-card bg-ink/[0.03] p-3 text-center dark:bg-bone/[0.05]">
                <p className="font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">Bandwidth (capacity)</p>
                <p className="mt-1 font-display text-xl font-semibold text-ink dark:text-bone">{bandwidth >= 1000 ? `${bandwidth / 1000} Gbps` : `${bandwidth} Mbps`}</p>
              </div>
              <div className="rounded-card bg-subject-it-soft p-3 text-center dark:bg-subject-it/15">
                <p className="font-mono text-xs uppercase tracking-wide text-subject-it">Throughput (achieved)</p>
                <p className="mt-1 font-display text-xl font-semibold text-subject-it">{result.throughputMbps} Mbps</p>
              </div>
              <p className="text-sm text-ink-soft dark:text-bone-soft">
                That&apos;s about {result.utilizationPercent}% of the link&apos;s bandwidth actually being used, given the
                current load, latency, and packet loss you set above. This is a simplified educational model, not a
                real network performance calculation.
              </p>
            </div>
          </Panel>
        </div>
        <p className="mt-3 text-sm text-ink-soft dark:text-bone-soft">
          Notice that raising bandwidth alone doesn&apos;t fix high latency or packet loss — they&apos;re independent effects.
        </p>
      </div>

      <div>
        <SectionHeading title="Network congestion">
          When multiple flows share one link and total demand exceeds its capacity, every flow gets throttled and a
          queue builds up — congestion is a capacity problem, not a broken connection.
        </SectionHeading>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr,1fr]">
          <Panel title="Shared link">
            <LabeledSlider label="Number of PCs sharing the link" value={flowCount} min={1} max={6} unit="" onChange={(v) => setFlowCount(Math.round(v))} />
            <p className="mt-2 text-sm text-ink-soft dark:text-bone-soft">Each PC wants 60 Mbps; the shared link&apos;s capacity is fixed at {capacity} Mbps.</p>
          </Panel>
          <Panel title="Per-flow outcome">
            <ul className="flex flex-col gap-1.5 text-sm">
              {congestion.perFlowMbps.map((f) => (
                <li key={f.id} className="flex items-center justify-between">
                  <span className="text-ink-soft dark:text-bone-soft">{f.name} wants {f.demandMbps} Mbps</span>
                  <span className={f.achievedMbps < f.demandMbps ? "font-medium text-amber-600 dark:text-amber-400" : "font-medium text-emerald-600 dark:text-emerald-400"}>
                    gets {f.achievedMbps} Mbps
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
        {congestion.congested ? (
          <Callout tone="warn" title="Link is congested">
            Total demand ({congestion.totalDemandMbps} Mbps) exceeds the link&apos;s {capacity} Mbps capacity. Every flow is
            throttled toward a fair share, and an illustrative queueing delay of about {congestion.queueDelayMs} ms
            builds up.
          </Callout>
        ) : (
          <Callout tone="good" title="Link has headroom">
            Total demand ({congestion.totalDemandMbps} Mbps) fits within the link&apos;s {capacity} Mbps capacity — every
            flow gets what it asked for.
          </Callout>
        )}
      </div>
    </div>
  );
}
