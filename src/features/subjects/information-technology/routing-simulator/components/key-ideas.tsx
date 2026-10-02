"use client";

import { ChevronDown } from "lucide-react";
import { Panel } from "../../osi-model-explorer/components/ui";

const IDEAS: { q: string; a: string }[] = [
  { q: "What is a router?", a: "A Layer 3 device that connects different IP networks and forwards packets between them. It chooses where to send each packet by looking at the packet’s destination IP address." },
  { q: "What is a routing table?", a: "The list of networks a router knows about. Each entry says which destination network it covers, where to send packets for it (a next hop, or straight out an interface), and which interface to use." },
  { q: "What is a default gateway?", a: "The router interface a host sends traffic to when the destination is on a different network. It is configured on the host, and it must be an address on the host’s own network (for PC-A, 192.168.1.1)." },
  { q: "What is a connected route?", a: "A route a router creates by itself for each network its interfaces are directly attached to. An interface configured as 192.168.1.1/24 gives the router a connected route to 192.168.1.0/24." },
  { q: "What is a static route?", a: "A route typed in by hand. It tells the router: to reach this destination network, send packets to this next hop out of this interface. It does not adapt if the network changes." },
  { q: "What is a next hop?", a: "The IP address of the next router on the way to the destination. It must be on a network the router is directly connected to. A connected route has no next hop because the destination is right there." },
  { q: "What is a destination network?", a: "The network (address plus prefix length, like 192.168.3.0/24) that a route covers. A route matches a packet when the packet’s destination IP address falls inside that network." },
  { q: "What is a default route?", a: "The route 0.0.0.0/0. It matches every IPv4 address, so it is used only when no more specific route matches the destination." },
  { q: "What is the most specific route?", a: "When several routes match, the router uses the one with the longest prefix length. A /24 beats a /16 because it describes a smaller, more exact set of addresses. This is called longest-prefix match." },
  { q: "What if there is no route?", a: "If nothing in the table matches and there is no default route, the router cannot forward the packet and drops it. A router never guesses where an unknown network might be." },
  { q: "Do routers use MAC addresses to route?", a: "No. The routing decision is based on the destination IP address. MAC addresses only matter on each individual link, where the packet is wrapped in a new Ethernet frame for that hop." },
  { q: "Why does a reply need a route back?", a: "Routing is one direction at a time. A reply from PC-B to PC-A is a new packet, so the routers on the way back also need a route to PC-A’s network." },
];

export function KeyIdeas() {
  return (
    <Panel title="Key ideas in plain language">
      <div className="grid gap-2 md:grid-cols-2">
        {IDEAS.map((i) => (
          <details key={i.q} className="group rounded-xl border border-line px-3 py-2 dark:border-line-dark">
            <summary className="flex min-h-[32px] cursor-pointer list-none items-center justify-between gap-2 text-sm font-medium text-ink dark:text-bone [&::-webkit-details-marker]:hidden">
              {i.q}
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" strokeWidth={1.75} aria-hidden />
            </summary>
            <p className="pb-1 pt-1.5 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">{i.a}</p>
          </details>
        ))}
      </div>
    </Panel>
  );
}
