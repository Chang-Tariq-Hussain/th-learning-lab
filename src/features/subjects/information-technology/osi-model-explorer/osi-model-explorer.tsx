"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { EncapsulationLab } from "./components/encapsulation-lab";
import { LayerIdChallenge } from "./components/layer-id-challenge";
import { LevelSwitch } from "./components/level-switch";
import { OsiStack } from "./components/osi-stack";
import { OsiVsTcpIp } from "./components/osi-vs-tcpip";
import { PacketJourneyLab } from "./components/packet-journey-lab";
import { TroubleshootingLab } from "./components/troubleshooting-lab";
import type { DetailLevel } from "./model";

export type TabId = "layers" | "encapsulation" | "journey" | "identify" | "troubleshoot" | "tcpip";

const ALL_TABS: { id: TabId; label: string; blurb: string; minLevel: DetailLevel }[] = [
  { id: "layers", label: "The 7 Layers", blurb: "Click any layer to inspect its job, real-world explanation, PDU, device, and protocols.", minLevel: "beginner" },
  { id: "encapsulation", label: "Encapsulation", blurb: "Watch data get wrapped and unwrapped, layer by layer, between two computers.", minLevel: "beginner" },
  { id: "journey", label: "Packet Journey", blurb: "A simple Computer → Switch → Router → Computer path showing where each layer conceptually works.", minLevel: "intermediate" },
  { id: "identify", label: "Identify the Layer", blurb: "Read a short scenario and pick the OSI layer it belongs to.", minLevel: "intermediate" },
  { id: "troubleshoot", label: "Troubleshooting", blurb: "Given a symptom, decide which layer is most likely at fault — conceptually, not diagnostically.", minLevel: "intermediate" },
  { id: "tcpip", label: "OSI vs. TCP/IP", blurb: "A small introductory comparison between the two models.", minLevel: "technical" },
];

const LEVEL_ORDER: DetailLevel[] = ["beginner", "intermediate", "technical"];

/**
 * "OSI Model Explorer" — the second simulation in the Networking
 * branch, following Network Fundamentals & Topologies. Same tabbed,
 * plain-SVG/2D convention as that simulation (and the rest of the IT
 * subject): no 3D, since the OSI model is a conceptual/relational
 * topic, not a physical one.
 *
 * The Beginner/Intermediate/Technical switch controls which tabs are
 * available (per the brief's level scope) rather than duplicating
 * content — Beginner keeps the interactive stack and encapsulation
 * only; Intermediate adds the packet journey, layer identification,
 * and troubleshooting; Technical adds the OSI vs. TCP/IP comparison.
 * The stack and encapsulation views also show extra depth (PDUs,
 * devices, protocol examples, the terminology-varies note) once the
 * level is above Beginner, via a `level` prop passed straight through.
 */
export function OsiModelExplorer() {
  const [level, setLevel] = useState<DetailLevel>("beginner");
  const [tab, setTab] = useState<TabId>("layers");

  const visibleTabs = ALL_TABS.filter((t) => LEVEL_ORDER.indexOf(t.minLevel) <= LEVEL_ORDER.indexOf(level));
  const activeTab = visibleTabs.find((t) => t.id === tab) ?? visibleTabs[0]!;

  // If the previously active tab isn't available at a newly-lowered
  // level, fall back to the first visible tab instead of rendering
  // nothing — done as an effect, not during render, so this never
  // sets state while React is rendering.
  useEffect(() => {
    if (!visibleTabs.some((t) => t.id === tab)) setTab(visibleTabs[0]!.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  return (
    <div className="flex flex-col gap-6">
      <LevelSwitch level={level} onChange={setLevel} />

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="OSI Model Explorer mode">
        {visibleTabs.map((t) => (
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
        {activeTab.id === "layers" && <OsiStack level={level} />}
        {activeTab.id === "encapsulation" && <EncapsulationLab level={level} />}
        {activeTab.id === "journey" && <PacketJourneyLab />}
        {activeTab.id === "identify" && <LayerIdChallenge />}
        {activeTab.id === "troubleshoot" && <TroubleshootingLab />}
        {activeTab.id === "tcpip" && <OsiVsTcpIp />}
      </div>

      <p className="text-xs text-ink-soft dark:text-bone-soft">
        This lab keeps TCP/IP as a full model, Ethernet/MAC address details, IP addressing, subnetting, ARP, DHCP,
        DNS, switching internals, routing, TCP/UDP mechanics, ports, ICMP, and packet tracing out of scope on
        purpose — they&apos;re covered one at a time by later simulations in the Networking branch.
      </p>
    </div>
  );
}
