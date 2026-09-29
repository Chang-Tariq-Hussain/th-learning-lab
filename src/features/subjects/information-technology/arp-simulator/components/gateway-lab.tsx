"use client";

import { Callout, Panel, SectionHeading } from "../../osi-model-explorer/components/ui";
import type { ArpLab } from "../hooks/use-arp-lab";
import { REMOTE_SERVER, type DetailLevel } from "../model";
import { RunPanel } from "./run-panel";

const REMOTE_FLOW = ["Destination is remote", "Use the default gateway", "Resolve the gateway's MAC address (ARP)", "Send the Ethernet frame to the gateway"];

/** Local network limit + default gateway ARP: a conceptual preview only — routing is not simulated. */
export function GatewayLab({ lab, level }: { lab: ArpLab; level: DetailLevel }) {
  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="Local network only — and the default gateway">
        ARP finds a MAC address for a device on the same local network. For a destination on another network, PC-A does not ARP for it at all.
      </SectionHeading>
      <div className="grid gap-4 md:grid-cols-2">
        <Panel title="PC-A (192.168.1.10/24) → Remote Server">
          <ol className="flex flex-col items-start gap-1">
            {REMOTE_FLOW.map((t, i) => (
              <li key={t} className="flex flex-col items-start">
                <span className="rounded-lg border border-line bg-white/80 px-3 py-1.5 text-sm font-medium text-ink dark:border-line-dark dark:bg-white/[0.06] dark:text-bone">{t}</span>
                {i < REMOTE_FLOW.length - 1 && <span className="pl-4 text-ink-soft dark:text-bone-soft" aria-hidden>↓</span>}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-ink-soft dark:text-bone-soft">
            {REMOTE_SERVER.name} {REMOTE_SERVER.ip}/{REMOTE_SERVER.prefix} is not on 192.168.1.0/24, so PC-A never asks &quot;Who has {REMOTE_SERVER.ip}?&quot;.
          </p>
        </Panel>
        <Callout tone="good" title="ARP resolves the next local-link destination">
          It does not resolve the final remote host&apos;s MAC address. The Ethernet frame carries the router&apos;s MAC as its destination, while the IP packet inside keeps the remote server&apos;s IP address as its destination.
          {level !== "beginner" && " Each router along the way repeats the same idea on its own links: the next hop changes, the final IP destination does not."}
        </Callout>
      </div>
      <Panel title="Run it">
        <RunPanel lab={lab} level={level} scenarios={["gateway", "gateway-hit", "first"]} remoteHint />
      </Panel>
      <p className="text-xs text-ink-soft dark:text-bone-soft">
        This is a conceptual preview. What the router does after it accepts the frame (choosing a route, forwarding the packet) is not simulated here — it is the subject of a later lab.
      </p>
    </div>
  );
}
