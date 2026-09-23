"use client";

import { useState } from "react";
import { TOPOLOGY_INFO, TOPOLOGY_ORDER, buildTopology, type NetworkState, type TopologyKind } from "../model";
import { NetworkGraphSvg } from "./network-graph-svg";
import { Callout, Panel, PillButton, SectionHeading } from "./ui";

export function TopologyLab({
  network,
  setNetwork,
}: {
  network: NetworkState;
  setNetwork: (updater: (state: NetworkState) => NetworkState) => void;
}) {
  const [active, setActive] = useState<TopologyKind>("star");

  function applyTopology(kind: TopologyKind) {
    setActive(kind);
    setNetwork(() => buildTopology(kind));
  }

  const info = TOPOLOGY_INFO[active];

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Network topologies">
        A topology is the pattern of connections between devices. Pick one to build it automatically — this replaces
        whatever is currently on the canvas, so try the Failure Lab right after building one to see how the pattern
        affects resilience.
      </SectionHeading>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Topology">
        {TOPOLOGY_ORDER.map((kind) => (
          <PillButton key={kind} active={active === kind} onClick={() => applyTopology(kind)}>
            {TOPOLOGY_INFO[kind].label}
          </PillButton>
        ))}
      </div>

      <NetworkGraphSvg state={network} ariaLabel={`${info.label} topology`} />

      <div className="grid gap-3 sm:grid-cols-2">
        <Panel title="Structure">
          <p className="text-sm text-ink-soft dark:text-bone-soft">{info.structure}</p>
        </Panel>
        <Panel title="Typical use case">
          <p className="text-sm text-ink-soft dark:text-bone-soft">{info.examples}</p>
        </Panel>
        <Panel title="Scalability">
          <p className="text-sm text-ink-soft dark:text-bone-soft">{info.scalability}</p>
        </Panel>
        <Panel title="Redundancy">
          <p className="text-sm text-ink-soft dark:text-bone-soft">{info.redundancy}</p>
        </Panel>
        <Panel title="Failure behavior">
          <p className="text-sm text-ink-soft dark:text-bone-soft">{info.failureBehavior}</p>
        </Panel>
        <Panel title="Complexity">
          <p className="text-sm text-ink-soft dark:text-bone-soft">{info.complexity}</p>
        </Panel>
      </div>

      <Callout tone="neutral" title={'No topology is universally "best"'}>
        Which topology fits depends on requirements — how much redundancy is worth the cost, how many devices need to
        join, and how much complexity is acceptable. Use the Failure Lab to compare how each one actually behaves when
        something breaks, rather than relying on the table alone.
      </Callout>
    </div>
  );
}
