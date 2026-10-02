"use client";

import { ChevronDown } from "lucide-react";
import { Panel } from "../../osi-model-explorer/components/ui";

const IDEAS: { q: string; a: string }[] = [
  { q: "What is a switch?", a: "A Layer 2 networking device that forwards Ethernet frames between the devices plugged into its ports, based primarily on MAC addresses." },
  { q: "What is a MAC address?", a: "A 48-bit hardware/network-interface identifier used at the data-link layer, written as six pairs of hex digits (AA:AA:AA:AA:AA:01). The addresses in this lab are made up." },
  { q: "What is a MAC address table?", a: "A table the switch builds in memory that associates each learned source MAC address with the switch port it was seen on." },
  { q: "How does a switch learn?", a: "It reads the source MAC address of every incoming frame and records it against the incoming port. It learns from the source, never the destination, and it doesn't create duplicates." },
  { q: "What happens when the destination is known?", a: "The switch looks the destination MAC up and forwards the frame only out the port listed in the table. Other ports never see it, and a frame whose destination is on the port it came from is filtered rather than sent back." },
  { q: "What happens when the destination is unknown?", a: "The switch floods the unknown unicast frame out every port in the LAN except the one it arrived on. The device that owns that MAC accepts it; the others ignore it. When that device replies, the switch learns it." },
  { q: "What happens with broadcast?", a: "A frame to FF:FF:FF:FF:FF:FF is flooded out every port except the incoming one, so every host in the Layer 2 broadcast domain receives it. Broadcast addresses are never learned." },
  { q: "Why do entries age out?", a: "A dynamic entry is removed if its device stays silent for the aging time (commonly 300 s on real switches; 60 simulated seconds here). That keeps the table small and lets it recover when devices move or unplug." },
  { q: "Is this the whole story?", a: "It is a simplified single-LAN model. Real switches keep a separate MAC table per VLAN and have many more features, which this lab leaves out on purpose." },
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
