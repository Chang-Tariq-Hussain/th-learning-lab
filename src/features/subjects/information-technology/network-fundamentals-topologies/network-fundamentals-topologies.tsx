"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BasicsLab } from "./components/basics-lab";
import { BuildNetworkLab } from "./components/build-network-lab";
import { ClientServerP2pLab } from "./components/client-server-p2p-lab";
import { FailureRedundancyLab } from "./components/failure-redundancy-lab";
import { GuidedExperimentsLab } from "./components/guided-experiments-lab";
import { PacketLab } from "./components/packet-lab";
import { PerformanceLab } from "./components/performance-lab";
import { TopologyLab } from "./components/topology-lab";
import { buildTopology, type NetworkState } from "./model";

export type TabId = "basics" | "build" | "topologies" | "failure" | "client-server" | "packets" | "performance" | "guided";

const TABS: { id: TabId; label: string; blurb: string }[] = [
  { id: "basics", label: "Basics", blurb: "What a network is, nodes and links, network sizes, and device roles." },
  { id: "build", label: "Build a Network", blurb: "Add, move, connect, and inspect devices on your own canvas." },
  { id: "topologies", label: "Topologies", blurb: "Auto-build Bus, Star, Ring, Mesh, Tree, and Hybrid layouts and compare them." },
  { id: "failure", label: "Failure Lab", blurb: "Fail a device or link, find single points of failure, and add redundancy." },
  { id: "client-server", label: "Client–Server vs. P2P", blurb: "Compare two ways of organizing who provides and who requests data." },
  { id: "packets", label: "Send Data", blurb: "Animate a packet across your network and experiment with packet loss." },
  { id: "performance", label: "Performance", blurb: "Bandwidth vs. throughput, latency, and congestion when links are shared." },
  { id: "guided", label: "Guided Experiments", blurb: "Seven short, structured experiments that link straight to the right tab." },
];

/**
 * "Network Fundamentals & Topologies Laboratory" — the first
 * simulation in the Networking branch of Information Technology.
 * 2D/2.5D throughout (plain SVG), matching the Deadlock Simulator's
 * convention for relational/conceptual topics rather than physical
 * hardware. The Build, Topologies, and Failure Lab tabs share one
 * `NetworkState` so a network built (or auto-generated from a
 * topology preset) carries over into the failure experiment — the
 * other tabs manage their own self-contained network snapshots, same
 * pattern as each lab in the Deadlock Simulator.
 */
export function NetworkFundamentalsTopologies() {
  const [tab, setTab] = useState<TabId>("basics");
  const [network, setNetwork] = useState<NetworkState>(() => buildTopology("star"));
  const activeTab = TABS.find((t) => t.id === tab)!;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Network Fundamentals & Topologies mode">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              tab === t.id
                ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-ink-soft dark:text-bone-soft">{activeTab.blurb}</p>

      <div className="rounded-card border border-line bg-paper p-3 dark:border-line-dark dark:bg-chalkboard sm:p-5">
        {tab === "basics" && <BasicsLab />}
        {tab === "build" && <BuildNetworkLab network={network} setNetwork={setNetwork} />}
        {tab === "topologies" && <TopologyLab network={network} setNetwork={setNetwork} />}
        {tab === "failure" && <FailureRedundancyLab network={network} setNetwork={setNetwork} />}
        {tab === "client-server" && <ClientServerP2pLab />}
        {tab === "packets" && <PacketLab network={network} />}
        {tab === "performance" && <PerformanceLab />}
        {tab === "guided" && <GuidedExperimentsLab onJumpToTab={setTab} />}
      </div>

      <p className="text-xs text-ink-soft dark:text-bone-soft">
        This lab keeps IP addressing, MAC addresses, ARP, DHCP, DNS, switching internals, routing protocols, and
        TCP/UDP out of scope on purpose — they&apos;re covered one at a time by later simulations in the Networking
        branch, once the shapes and vocabulary here are familiar.
      </p>
    </div>
  );
}
