"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { BoundaryLab } from "./components/boundary-lab";
import { CidrLab } from "./components/cidr-lab";
import { ConfigLab } from "./components/config-lab";
import { ExperimentsLab } from "./components/experiments-lab";
import { ExplorerLab } from "./components/explorer-lab";
import { InspectorLab } from "./components/inspector-lab";
import { LevelSwitch } from "./components/level-switch";
import { MapLab } from "./components/map-lab";
import { NetworkLab } from "./components/network-lab";
import { PrivateLab } from "./components/private-lab";
import { RemoteLab } from "./components/remote-lab";
import { SameLab } from "./components/same-lab";
import { useIpLab } from "./hooks/use-ip-lab";
import type { DetailLevel, Experiment, TabId } from "./model";

const ALL_TABS: { id: TabId; label: string; blurb: string; minLevel: DetailLevel }[] = [
  { id: "map", label: "Network Map", blurb: "Inspect each device: IPv4 address, subnet mask, network address, host portion, and MAC address.", minLevel: "beginner" },
  { id: "explorer", label: "IPv4 Explorer", blurb: "Decimal and binary side by side. Expand octets and click bits to see their decimal contribution.", minLevel: "beginner" },
  { id: "boundary", label: "Mask & Boundary", blurb: "See what a subnet mask does and where the network / host boundary falls.", minLevel: "beginner" },
  { id: "network", label: "Find the Network", blurb: "Calculate the network address, broadcast address, and usable host range, step by step in binary.", minLevel: "beginner" },
  { id: "same", label: "Same Network?", blurb: "Predict, then see the reasoning for whether two hosts share a network.", minLevel: "beginner" },
  { id: "remote", label: "Local vs Remote", blurb: "Local or remote destination? Change the default gateway and see what happens.", minLevel: "beginner" },
  { id: "config", label: "IP Configuration", blurb: "Configure a device, get explanations for mistakes, and try a duplicate IP address.", minLevel: "beginner" },
  { id: "private", label: "Public & Private", blurb: "Private ranges, public addresses, and (under Advanced) special addresses.", minLevel: "beginner" },
  { id: "experiments", label: "Guided Experiments", blurb: "Five short experiments with an objective, a task, and an explanation each.", minLevel: "beginner" },
  { id: "cidr", label: "CIDR Prefixes", blurb: "Move through /8 to /30 and watch the boundary, address count, and host count change.", minLevel: "intermediate" },
  { id: "inspector", label: "Address Inspector", blurb: "Inspect any address and mask: binary, network, broadcast, host portion, and classification.", minLevel: "intermediate" },
];

const LEVEL_ORDER: DetailLevel[] = ["beginner", "intermediate", "technical"];

/**
 * "IP Addressing Simulator" — the fifth simulation in the Networking branch. Same tabbed,
 * level-gated 2D shell as the earlier ones. Host configuration lives here so it survives
 * tab switches.
 *
 * Out of scope on purpose: the advanced Subnetting lab, ARP, DHCP, DNS, NAT and routing.
 */
export function IpAddressingSimulator() {
  const [level, setLevel] = useState<DetailLevel>("beginner");
  const [tab, setTab] = useState<TabId>("map");
  const lab = useIpLab();

  const visibleTabs = ALL_TABS.filter((t) => LEVEL_ORDER.indexOf(t.minLevel) <= LEVEL_ORDER.indexOf(level));
  const activeTab = visibleTabs.find((t) => t.id === tab) ?? visibleTabs[0]!;

  useEffect(() => {
    if (!visibleTabs.some((t) => t.id === tab)) setTab(visibleTabs[0]!.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  function startExperiment(exp: Experiment) {
    if (exp.setup === "reset-all") lab.resetAll();
    if (LEVEL_ORDER.indexOf(exp.minLevel) > LEVEL_ORDER.indexOf(level)) setLevel(exp.minLevel);
    setTab(exp.goTo);
  }

  return (
    <div className="flex flex-col gap-6">
      <LevelSwitch level={level} onChange={setLevel} />

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="IP Addressing Simulator mode">
        {visibleTabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={activeTab.id === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "min-h-[40px] rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              activeTab.id === t.id ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20" : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-ink-soft dark:text-bone-soft">{activeTab.blurb}</p>

      <div className="min-w-0 rounded-card border border-line bg-paper p-3 dark:border-line-dark dark:bg-chalkboard sm:p-5">
        {activeTab.id === "map" && <MapLab lab={lab} />}
        {activeTab.id === "explorer" && <ExplorerLab />}
        {activeTab.id === "boundary" && <BoundaryLab level={level} />}
        {activeTab.id === "network" && <NetworkLab level={level} />}
        {activeTab.id === "same" && <SameLab />}
        {activeTab.id === "remote" && <RemoteLab lab={lab} />}
        {activeTab.id === "config" && <ConfigLab lab={lab} level={level} />}
        {activeTab.id === "private" && <PrivateLab />}
        {activeTab.id === "experiments" && <ExperimentsLab onStart={startExperiment} />}
        {activeTab.id === "cidr" && <CidrLab level={level} />}
        {activeTab.id === "inspector" && <InspectorLab level={level} />}
      </div>

      <p className="text-xs text-ink-soft dark:text-bone-soft">
        This lab focuses on IPv4 addressing. Full subnetting design, ARP, DHCP, DNS, NAT, and routing are left out on purpose; later simulations in the Networking branch cover them one at a time. &quot;Send&quot; here is a simplified local-vs-remote decision, not real routing.
      </p>
    </div>
  );
}
