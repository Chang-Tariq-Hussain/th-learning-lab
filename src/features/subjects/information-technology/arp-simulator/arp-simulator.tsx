"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CacheLab } from "./components/cache-lab";
import { CompareLab } from "./components/compare-lab";
import { ExperimentsLab } from "./components/experiments-lab";
import { GatewayLab } from "./components/gateway-lab";
import { LevelSwitch } from "./components/level-switch";
import { MessagesLab } from "./components/messages-lab";
import { RunPanel } from "./components/run-panel";
import { useArpLab } from "./hooks/use-arp-lab";
import type { DetailLevel, Experiment, TabId } from "./model";

const ALL_TABS: { id: TabId; label: string; blurb: string; minLevel: DetailLevel }[] = [
  { id: "resolve", label: "Resolve an Address", blurb: "IP → ARP → MAC → Ethernet. Send data from PC-A and watch each step, one at a time or automatically.", minLevel: "beginner" },
  { id: "compare", label: "Cache Miss vs Hit", blurb: "Why ARP does not run before every packet: compare a first message with a repeat.", minLevel: "beginner" },
  { id: "messages", label: "ARP Messages", blurb: "The ARP request and reply side by side, field by field.", minLevel: "beginner" },
  { id: "gateway", label: "Local vs Gateway", blurb: "ARP only resolves addresses on the local network. For remote destinations PC-A resolves its default gateway.", minLevel: "beginner" },
  { id: "cache", label: "ARP Cache", blurb: "Inspect, clear and reset each device's ARP cache.", minLevel: "beginner" },
  { id: "experiments", label: "Guided Experiments", blurb: "Five short experiments with an objective, a task, and an explanation each.", minLevel: "beginner" },
];

const LEVEL_ORDER: DetailLevel[] = ["beginner", "intermediate", "technical"];

/**
 * "ARP Simulator" — the seventh simulation in the Networking branch. Same tabbed, level-gated 2D shell as the
 * earlier ones. Caches, the current run and the event log live in one hook so they survive tab switches.
 *
 * Out of scope on purpose: DHCP, DNS, routing, NAT, TCP/UDP, ICMP, IPv6 Neighbor Discovery, and cache timers.
 */
export function ArpSimulator() {
  const [level, setLevel] = useState<DetailLevel>("beginner");
  const [tab, setTab] = useState<TabId>("resolve");
  const lab = useArpLab();

  const visibleTabs = ALL_TABS.filter((t) => LEVEL_ORDER.indexOf(t.minLevel) <= LEVEL_ORDER.indexOf(level));
  const activeTab = visibleTabs.find((t) => t.id === tab) ?? visibleTabs[0]!;

  useEffect(() => {
    if (!visibleTabs.some((t) => t.id === tab)) setTab(visibleTabs[0]!.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  function startExperiment(exp: Experiment) {
    lab.setScenario(exp.scenario);
    if (LEVEL_ORDER.indexOf(exp.minLevel) > LEVEL_ORDER.indexOf(level)) setLevel(exp.minLevel);
    setTab(exp.goTo);
  }

  return (
    <div className="flex flex-col gap-6">
      <LevelSwitch level={level} onChange={setLevel} />

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="ARP Simulator mode">
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
        {activeTab.id === "resolve" && <RunPanel lab={lab} level={level} scenarios={["first", "hit", "unknown", "gateway", "custom"]} />}
        {activeTab.id === "compare" && <CompareLab lab={lab} level={level} />}
        {activeTab.id === "messages" && <MessagesLab level={level} />}
        {activeTab.id === "gateway" && <GatewayLab lab={lab} level={level} />}
        {activeTab.id === "cache" && <CacheLab lab={lab} level={level} onOpenResolve={() => setTab("resolve")} />}
        {activeTab.id === "experiments" && <ExperimentsLab level={level} onStart={startExperiment} />}
      </div>

      <p className="text-xs text-ink-soft dark:text-bone-soft">
        ARP maps an IPv4 address to a link-layer (MAC) address on the local network. This lab is a simplified Ethernet/IPv4 model: real systems age out cache entries, retry unanswered requests, and differ in details. DHCP, DNS, switching, routing and IPv6 Neighbor Discovery are left out on purpose.
      </p>
    </div>
  );
}
