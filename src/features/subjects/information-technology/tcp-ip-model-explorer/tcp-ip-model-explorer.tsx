"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { LevelSwitch } from "@/features/subjects/information-technology/osi-model-explorer/components/level-switch";
import { EncapsulationLab } from "./components/encapsulation-lab";
import { LayerQuizLab } from "./components/layer-quiz-lab";
import { LayerStack } from "./components/layer-stack";
import { NetworkPathLab } from "./components/network-path-lab";
import { OsiMapping } from "./components/osi-mapping";
import { ProtocolExplorer } from "./components/protocol-explorer";
import { RequestResponseLab } from "./components/request-response-lab";
import { WhichModelLab } from "./components/which-model-lab";
import { LAYER_ID_ITEMS, TROUBLESHOOTING_CASES, type DetailLevel } from "./model";

export type TabId =
  | "layers"
  | "mapping"
  | "protocols"
  | "encapsulation"
  | "journey"
  | "path"
  | "which"
  | "identify"
  | "troubleshoot";

const ALL_TABS: { id: TabId; label: string; blurb: string; minLevel: DetailLevel }[] = [
  { id: "layers", label: "The 4 Layers", blurb: "Click any layer to see its responsibility, protocols, data, OSI relationship, and an example.", minLevel: "beginner" },
  { id: "mapping", label: "OSI ↔ TCP/IP", blurb: "Click a layer in either model to see which layer(s) match in the other.", minLevel: "beginner" },
  { id: "protocols", label: "Protocols", blurb: "A first look at where common protocols live in the stack.", minLevel: "beginner" },
  { id: "encapsulation", label: "Encapsulation", blurb: "Watch data get wrapped on the way down and unwrapped on the way up, and learn the data-unit names.", minLevel: "intermediate" },
  { id: "journey", label: "Request → Response", blurb: "A conceptual client–server exchange moving down and up the stacks.", minLevel: "intermediate" },
  { id: "path", label: "Network Path", blurb: "See which TCP/IP layers each device on a simple path takes part in.", minLevel: "intermediate" },
  { id: "which", label: "Which Model?", blurb: "Describe one communication event through OSI, TCP/IP, or both.", minLevel: "intermediate" },
  { id: "identify", label: "Layer Responsibility", blurb: "Read a description and pick the TCP/IP layer responsible.", minLevel: "intermediate" },
  { id: "troubleshoot", label: "Troubleshooting", blurb: "Given a symptom, pick the likely layer — conceptually, not diagnostically.", minLevel: "intermediate" },
];

const LEVEL_ORDER: DetailLevel[] = ["beginner", "intermediate", "technical"];

/**
 * "TCP/IP Model Explorer" — the third simulation in the Networking
 * branch, after Network Fundamentals & Topologies and the OSI Model
 * Explorer. Same tabbed, level-gated 2D shell as the OSI simulation,
 * reusing its step-player hook, UI primitives, level switch, and
 * journey topology instead of duplicating them.
 *
 * Beginner: four layers, protocols, OSI comparison. Intermediate adds
 * encapsulation/data units, request/response, network path, the
 * "Which Model?" view, and the layer-responsibility/troubleshooting
 * activities. Technical adds header details, protocol roles, layer
 * interactions, design differences, and path reasoning inside those
 * views via the `level` prop.
 */
export function TcpIpModelExplorer() {
  const [level, setLevel] = useState<DetailLevel>("beginner");
  const [tab, setTab] = useState<TabId>("layers");

  const visibleTabs = ALL_TABS.filter((t) => LEVEL_ORDER.indexOf(t.minLevel) <= LEVEL_ORDER.indexOf(level));
  const activeTab = visibleTabs.find((t) => t.id === tab) ?? visibleTabs[0]!;

  // Fall back to the first visible tab when lowering the level hides the
  // active one — done in an effect so state is never set during render.
  useEffect(() => {
    if (!visibleTabs.some((t) => t.id === tab)) setTab(visibleTabs[0]!.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  return (
    <div className="flex flex-col gap-6">
      <LevelSwitch level={level} onChange={setLevel} />

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="TCP/IP Model Explorer mode">
        {visibleTabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={activeTab.id === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
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

      <div className="rounded-card border border-line bg-paper p-3 dark:border-line-dark dark:bg-chalkboard sm:p-5">
        {activeTab.id === "layers" && <LayerStack level={level} />}
        {activeTab.id === "mapping" && <OsiMapping level={level} />}
        {activeTab.id === "protocols" && <ProtocolExplorer level={level} />}
        {activeTab.id === "encapsulation" && <EncapsulationLab level={level} />}
        {activeTab.id === "journey" && <RequestResponseLab />}
        {activeTab.id === "path" && <NetworkPathLab level={level} />}
        {activeTab.id === "which" && <WhichModelLab />}
        {activeTab.id === "identify" && (
          <LayerQuizLab
            heading="Layer responsibility experiment"
            intro="Read the description, then click the TCP/IP layer that is responsible."
            items={LAYER_ID_ITEMS}
            itemLabel="Scenario"
            shuffle
          />
        )}
        {activeTab.id === "troubleshoot" && (
          <LayerQuizLab
            heading="Troubleshooting: which layer is likely at fault?"
            intro="A conceptual exercise, not a real diagnostic tool — practice mapping a symptom to the TCP/IP layer it most likely belongs to."
            items={TROUBLESHOOTING_CASES}
            itemLabel="Case"
          />
        )}
      </div>

      <p className="text-xs text-ink-soft dark:text-bone-soft">
        This lab keeps Ethernet and MAC details, IP addressing, subnetting, ARP, DHCP, DNS, routing, NAT, TCP vs. UDP
        mechanics, ports and sockets, ICMP and ping, and full packet tracing out of scope on purpose — later
        simulations in the Networking branch cover them one at a time.
      </p>
    </div>
  );
}
