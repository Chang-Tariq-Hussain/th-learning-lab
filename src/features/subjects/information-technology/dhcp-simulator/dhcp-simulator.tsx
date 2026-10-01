"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ArpLab } from "./components/arp-lab";
import { ExhaustionLab } from "./components/exhaustion-lab";
import { ExperimentBanner, ExperimentsLab } from "./components/experiments-lab";
import { LeaseLab } from "./components/lease-lab";
import { LevelSwitch } from "./components/level-switch";
import { MessagesLab } from "./components/messages-lab";
import { PoolLab } from "./components/pool-lab";
import { RunPanel } from "./components/run-panel";
import { StaticLab } from "./components/static-lab";
import { useDhcpLab } from "./hooks/use-dhcp-lab";
import type { DetailLevel, Experiment, TabId } from "./model";

const ALL_TABS: { id: TabId; label: string; blurb: string; minLevel: DetailLevel }[] = [
  { id: "dora", label: "Get an Address", blurb: "Discover → Offer → Request → ACK. Pick a PC, press Start DHCP and step through the conversation, or let it play automatically.", minLevel: "beginner" },
  { id: "messages", label: "DHCP Messages", blurb: "The four DORA messages, field by field, at the level of detail you choose.", minLevel: "beginner" },
  { id: "pool", label: "Address Pool", blurb: "Configure the DHCP server: range, gateway, DNS server and lease time. See which addresses are free.", minLevel: "beginner" },
  { id: "clients", label: "Multiple Clients", blurb: "Several PCs ask for addresses. The server gives each a different one and records it in the lease table.", minLevel: "beginner" },
  { id: "exhaustion", label: "Pool Exhaustion", blurb: "What happens when there are more PCs than addresses.", minLevel: "beginner" },
  { id: "lease", label: "Release & Renew", blurb: "Leases are temporary. Renew one, release one, or let time run out.", minLevel: "beginner" },
  { id: "static", label: "Static vs DHCP", blurb: "Configure a PC by hand or let the server do it, and compare.", minLevel: "beginner" },
  { id: "arp", label: "DHCP + ARP", blurb: "How DHCP and the ARP simulator fit together, without being the same thing.", minLevel: "beginner" },
  { id: "experiments", label: "Guided Experiments", blurb: "Six experiments that set up the lab, give you a task, and check your result.", minLevel: "beginner" },
];

const LEVEL_ORDER: DetailLevel[] = ["beginner", "intermediate", "technical"];

/**
 * "DHCP Simulator": the eighth simulation in the Networking branch. Same tabbed 2D shell as the earlier ones. The pool,
 * lease table, every PC's configuration, the current run and the event log live in one hook so they survive tab switches.
 *
 * Out of scope on purpose: DHCP relay agents, DHCPv6, DNS, routing, NAT, real lease timers and multiple DHCP servers.
 */
export function DhcpSimulator() {
  const [level, setLevel] = useState<DetailLevel>("beginner");
  const [tab, setTab] = useState<TabId>("dora");
  const [activeExp, setActiveExp] = useState<Experiment | null>(null);
  const lab = useDhcpLab();

  const visibleTabs = ALL_TABS.filter((t) => LEVEL_ORDER.indexOf(t.minLevel) <= LEVEL_ORDER.indexOf(level));
  const activeTab = visibleTabs.find((t) => t.id === tab) ?? visibleTabs[0]!;

  useEffect(() => {
    if (!visibleTabs.some((t) => t.id === tab)) setTab(visibleTabs[0]!.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  function startExperiment(exp: Experiment) {
    lab.load({ state: exp.setup(), selected: exp.id === "exp-release" ? "pc4" : "pc1" });
    setActiveExp(exp);
    setTab(exp.goTo);
  }

  return (
    <div className="flex flex-col gap-6">
      <LevelSwitch level={level} onChange={setLevel} />

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="DHCP Simulator mode">
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

      {activeExp && activeTab.id !== "experiments" && <ExperimentBanner exp={activeExp} lab={lab} onClose={() => setActiveExp(null)} />}

      <div className="min-w-0 rounded-card border border-line bg-paper p-3 dark:border-line-dark dark:bg-chalkboard sm:p-5">
        {activeTab.id === "dora" && <RunPanel lab={lab} level={level} />}
        {activeTab.id === "messages" && <MessagesLab level={level} />}
        {activeTab.id === "pool" && <PoolLab lab={lab} />}
        {activeTab.id === "clients" && <RunPanel lab={lab} level={level} />}
        {activeTab.id === "exhaustion" && <ExhaustionLab lab={lab} level={level} />}
        {activeTab.id === "lease" && <LeaseLab lab={lab} level={level} />}
        {activeTab.id === "static" && <StaticLab lab={lab} level={level} />}
        {activeTab.id === "arp" && <ArpLab lab={lab} />}
        {activeTab.id === "experiments" && <ExperimentsLab lab={lab} active={activeExp?.id ?? null} onStart={startExperiment} />}
      </div>

      <p className="text-xs text-ink-soft dark:text-bone-soft">
        DHCP for IPv4 runs over UDP: the server uses port 67 and the client port 68. This lab is a simplified single-LAN model: one DHCP server, no relay agent, and clients renew only when you ask. Real leases renew automatically, and servers and clients differ in details. DNS, routing, NAT and DHCPv6 are left out on purpose.
      </p>
    </div>
  );
}
