"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CompareLab } from "./components/compare-lab";
import { DevicesLab } from "./components/devices-lab";
import { DuplexLab } from "./components/duplex-lab";
import { ExperimentsLab } from "./components/experiments-lab";
import { FcsLab } from "./components/fcs-lab";
import { ForwardingLab } from "./components/forwarding-lab";
import { FrameAnatomyLab } from "./components/frame-anatomy-lab";
import { LevelSwitch } from "./components/level-switch";
import { SendLab } from "./components/send-lab";
import { TableLab } from "./components/table-lab";
import { useEthernetLab } from "./hooks/use-ethernet-lab";
import type { DetailLevel, Experiment, TabId } from "./model";

const ALL_TABS: { id: TabId; label: string; blurb: string; minLevel: DetailLevel }[] = [
  { id: "devices", label: "Devices & MACs", blurb: "Select a device, inspect its network interface and MAC address, rename it, and generate a new address.", minLevel: "beginner" },
  { id: "frame", label: "Frame Anatomy", blurb: "Click each field of the simplified Ethernet frame to see what it is for.", minLevel: "beginner" },
  { id: "send", label: "Send Data", blurb: "Send a frame between devices and watch the switch deliver it — automatically or one step at a time.", minLevel: "beginner" },
  { id: "compare", label: "Unicast vs Broadcast", blurb: "One sender to one destination, versus one sender to everyone.", minLevel: "beginner" },
  { id: "experiments", label: "Guided Experiments", blurb: "Six short experiments with an objective, a task, and an explanation each.", minLevel: "beginner" },
  { id: "table", label: "MAC Table", blurb: "Clear the switch's table, send frames, and watch it learn source MAC addresses.", minLevel: "intermediate" },
  { id: "forwarding", label: "Forwarding Experiments", blurb: "Known destination, unknown destination, and broadcast — compare what the switch does.", minLevel: "intermediate" },
  { id: "fcs", label: "FCS", blurb: "See how the Frame Check Sequence helps a receiver detect a damaged frame.", minLevel: "technical" },
  { id: "duplex", label: "Collisions & Duplex", blurb: "A brief look at shared Ethernet collisions versus modern switched full-duplex links.", minLevel: "technical" },
];

const LEVEL_ORDER: DetailLevel[] = ["beginner", "intermediate", "technical"];

/**
 * "Ethernet & MAC Address Simulator" — the fourth simulation in the
 * Networking branch (after Network Fundamentals & Topologies, OSI Model
 * Explorer, and TCP/IP Model Explorer). Same tabbed, level-gated 2D shell
 * as those simulations. Shared LAN state (devices, the switch's MAC table,
 * the event log, and the current frame transmission) lives here so it
 * survives tab switches.
 *
 * Deliberately out of scope: IP addressing, ARP, and a full switching
 * simulation — a basic MAC-learning switch is included only because
 * Ethernet frames need something to be forwarded by.
 */
export function EthernetMacSimulator() {
  const [level, setLevel] = useState<DetailLevel>("beginner");
  const [tab, setTab] = useState<TabId>("devices");
  const lab = useEthernetLab();

  const visibleTabs = ALL_TABS.filter((t) => LEVEL_ORDER.indexOf(t.minLevel) <= LEVEL_ORDER.indexOf(level));
  const activeTab = visibleTabs.find((t) => t.id === tab) ?? visibleTabs[0]!;

  // If lowering the level hides the active tab, fall back to the first
  // visible one — in an effect so state is never set during render.
  useEffect(() => {
    if (!visibleTabs.some((t) => t.id === tab)) setTab(visibleTabs[0]!.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  function startExperiment(exp: Experiment) {
    if (exp.setup === "reset-all") lab.resetAll();
    else if (exp.setup === "reset-table") lab.clearTable();
    else if (exp.setup === "fill-table") lab.fillTable();
    if (LEVEL_ORDER.indexOf(exp.minLevel) > LEVEL_ORDER.indexOf(level)) setLevel(exp.minLevel);
    setTab(exp.goTo);
  }

  return (
    <div className="flex flex-col gap-6">
      <LevelSwitch level={level} onChange={setLevel} />

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Ethernet & MAC Address Simulator mode">
        {visibleTabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={activeTab.id === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "min-h-[40px] rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              activeTab.id === t.id
                ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-ink-soft dark:text-bone-soft">{activeTab.blurb}</p>

      <div className="min-w-0 rounded-card border border-line bg-paper p-3 dark:border-line-dark dark:bg-chalkboard sm:p-5">
        {activeTab.id === "devices" && <DevicesLab lab={lab} level={level} />}
        {activeTab.id === "frame" && <FrameAnatomyLab lab={lab} level={level} />}
        {activeTab.id === "send" && <SendLab lab={lab} level={level} />}
        {activeTab.id === "compare" && <CompareLab lab={lab} level={level} />}
        {activeTab.id === "experiments" && <ExperimentsLab level={level} onStart={startExperiment} />}
        {activeTab.id === "table" && <TableLab lab={lab} level={level} />}
        {activeTab.id === "forwarding" && <ForwardingLab lab={lab} level={level} />}
        {activeTab.id === "fcs" && <FcsLab lab={lab} />}
        {activeTab.id === "duplex" && <DuplexLab />}
      </div>

      <p className="text-xs text-ink-soft dark:text-bone-soft">
        This lab covers Ethernet frames and MAC addresses on one local network, plus just enough switch behaviour (MAC learning and forwarding) to deliver them. IP
        addressing, ARP, and a full switching simulation are left out on purpose — later simulations in the Networking branch cover them one at a time.
      </p>
    </div>
  );
}
