"use client";

import { useState } from "react";
import { Callout, Panel, SectionHeading } from "../../osi-model-explorer/components/ui";
import { NODE_LABEL, ROUTER_IFACES, hostById, parseIPv4, type NodeId } from "../model";
import type { IpLab } from "../hooks/use-ip-lab";
import { AddressInspector, KV } from "./parts";
import { NetworkMapDiagram } from "./network-map-diagram";

/** Section 1: the lab network and a per-device inspector (IP, mask, network, host portion, MAC). */
export function MapLab({ lab }: { lab: IpLab }) {
  const [selected, setSelected] = useState<NodeId>("a");
  const host = hostById(lab.hosts, selected);
  const parsed = host ? parseIPv4(host.ip) : null;

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="The lab network">
        Select a device. An IPv4 address identifies a network <em>interface</em>, so a router, which connects to two networks, has one address per interface. Switches work with MAC addresses and do not need an IP address to forward frames.
      </SectionHeading>
      <NetworkMapDiagram hosts={lab.hosts} selected={selected} onSelect={setSelected} />

      {selected === "router" ? (
        <div className="grid gap-4 md:grid-cols-2">
          {ROUTER_IFACES.map((r) => {
            const p = parseIPv4(r.ip);
            return p.ok ? <AddressInspector key={r.lan} ip={p.value} prefix={r.prefix} title={`Router · LAN ${r.lan} interface`} mac={r.mac} /> : null;
          })}
        </div>
      ) : host && parsed?.ok ? (
        <div className="grid gap-4 md:grid-cols-2">
          <AddressInspector ip={parsed.value} prefix={host.prefix} title={`${NODE_LABEL[selected]} · addressing`} mac={host.mac} />
          <Panel title="Default gateway">
            <dl>
              <KV label="Default gateway" value={host.gateway || "(none)"} />
            </dl>
            <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">
              The gateway is the router address this device uses to reach other networks. It is configured on the host; you can change it in the Local vs. Remote and IP Configuration tabs.
            </p>
          </Panel>
        </div>
      ) : (
        <Callout tone="warn" title="This address is not valid IPv4">Fix it in the IP Configuration tab.</Callout>
      )}

      <Callout title="Two identities for one interface">
        Each interface has a MAC address (from the Ethernet lab), used on the local link, and an IPv4 address, used to identify the interface within an IP network. The MAC comes with the interface; the IP address is configured.
      </Callout>
    </div>
  );
}
