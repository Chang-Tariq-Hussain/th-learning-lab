"use client";

import { useMemo, useState } from "react";
import { DEVICE_INFO, DEVICE_TYPE_ORDER, makeNetworkSizeScenarios, type NetworkSizeKind } from "../model";
import { NetworkGraphSvg } from "./network-graph-svg";
import { Panel, PillButton, SectionHeading } from "./ui";

export function BasicsLab() {
  const scenarios = useMemo(() => makeNetworkSizeScenarios(), []);
  const [kind, setKind] = useState<NetworkSizeKind>("lan");
  const active = scenarios.find((s) => s.kind === kind)!;

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="What is a computer network?">
        A network is a set of devices — <em>nodes</em> — connected so they can exchange data. Each connection between two
        nodes is a <em>link</em>. A device that participates directly in a network — sending or receiving data — is
        usually called a <em>host</em>. Networks exist so devices can share resources: files, printers, internet access,
        and services like a shared server.
      </SectionHeading>

      <div className="grid gap-4 sm:grid-cols-2">
        <Panel title="Node">
          <p className="text-sm text-ink-soft dark:text-bone-soft">
            Any device that is part of the network — a computer, phone, printer, switch, or router. Every device on the
            network diagrams in this lab is a node.
          </p>
        </Panel>
        <Panel title="Link">
          <p className="text-sm text-ink-soft dark:text-bone-soft">
            The connection between two nodes — a cable or a wireless signal. A link is what actually carries data from
            one node toward another.
          </p>
        </Panel>
      </div>

      <div>
        <SectionHeading title="Network sizes">
          Networks are often described by roughly how large an area they cover. These categories are useful mental
          models, but real networks don&apos;t follow strict geographic boundaries — the categories overlap in practice.
        </SectionHeading>
        <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Network size">
          {scenarios.map((s) => (
            <PillButton key={s.kind} active={kind === s.kind} onClick={() => setKind(s.kind)}>
              {s.name}
            </PillButton>
          ))}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr,1fr]">
          <NetworkGraphSvg state={active.network} ariaLabel={`${active.fullName} example`} />
          <Panel title={active.fullName}>
            <p className="text-sm text-ink-soft dark:text-bone-soft">{active.description}</p>
          </Panel>
        </div>
      </div>

      <div>
        <SectionHeading title="End devices vs. network devices vs. services">
          Real networks combine these roles — a laptop can be a client one moment and share a file the next — so treat
          these as typical roles, not rigid categories.
        </SectionHeading>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {(["end", "network", "service"] as const).map((category) => (
            <Panel key={category} title={category === "end" ? "End Devices" : category === "network" ? "Network Devices" : "Network Services"}>
              <ul className="flex flex-col gap-1 text-sm text-ink-soft dark:text-bone-soft">
                {DEVICE_TYPE_ORDER.filter((t) => DEVICE_INFO[t].category === category).map((t) => (
                  <li key={t}>{DEVICE_INFO[t].label}</li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
      </div>
    </div>
  );
}
