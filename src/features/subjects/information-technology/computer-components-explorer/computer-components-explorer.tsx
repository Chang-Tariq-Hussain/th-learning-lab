"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { HardwareLab3D } from "./components/hardware-lab-3d";
import { InspectorPanel } from "./components/inspector-panel";
import { ComponentLibrary } from "./components/component-library";
import { RelationshipsPanel } from "./components/relationships-panel";
import { ComparisonsPanel } from "./components/comparisons-panel";
import { BuildAComputerLab } from "./components/build-a-computer-lab";
import { TroubleshootingLab } from "./components/troubleshooting-lab";
import {
  DATA_FLOW_LINK,
  BOOT_PROCESS_LINK,
  HARDWARE_DISCLAIMER,
  DETAIL_LEVEL_LABELS,
  DETAIL_LEVEL_DESCRIPTIONS,
  LAYER_LABELS,
  LAYER_DESCRIPTIONS,
  type ComponentId,
  type DetailLevel,
  type BoardLayer,
  type CameraPresetId,
} from "./model";

type TabMode = "lab" | "library" | "relationships" | "compare" | "build" | "troubleshoot";

const TABS: { id: TabMode; label: string; blurb: string }[] = [
  {
    id: "lab",
    label: "3D Hardware Lab",
    blurb: "Rotate, pan, zoom, and click any part of an interactive motherboard to see what it is and does.",
  },
  {
    id: "library",
    label: "Component Library",
    blurb: "Every component organized by category — Processing, Memory, Storage, Motherboard, I/O, and Power.",
  },
  {
    id: "relationships",
    label: "Relationships",
    blurb: "Select a component and see the path data takes to and from it.",
  },
  {
    id: "compare",
    label: "Compare",
    blurb: "RAM vs. storage, HDD vs. SSD, and CPU vs. GPU, side by side.",
  },
  {
    id: "build",
    label: "Build a Computer",
    blurb: "Pick a compatible part for each required slot and see what's actually required.",
  },
  {
    id: "troubleshoot",
    label: "Troubleshooting",
    blurb: "Given a symptom, reason about which components could plausibly be involved.",
  },
];

/**
 * The "Virtual Computer Hardware Laboratory" (Computer Components &
 * Hardware Explorer) — answers "what are the physical parts of a
 * computer, and how are they connected?" Deliberately distinct from
 * the existing CPU–RAM–Storage Data Flow simulation, which answers
 * "how does data move between them during execution?" — this topic
 * links out to that one (and to Computer Boot Process) rather than
 * repeating their content.
 *
 * 3D is used specifically for the motherboard layout (physical
 * placement, sockets, slots) per the brief's "3D is educationally
 * justified here" guidance; every other mode (categories,
 * relationships, comparisons, build, troubleshooting) stays 2D, where
 * it communicates faster and works better on mobile.
 */
export function ComputerComponentsExplorer() {
  const [tab, setTab] = useState<TabMode>("lab");
  const [selected, setSelected] = useState<ComponentId | null>(null);
  const [preset, setPreset] = useState<CameraPresetId>("overview");
  const [layer, setLayer] = useState<BoardLayer>("basic");
  const [showLabels, setShowLabels] = useState(true);
  const [detailLevel, setDetailLevel] = useState<DetailLevel>("beginner");

  const activeTab = TABS.find((t) => t.id === tab)!;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Hardware Laboratory mode">
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
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-ink-soft dark:text-bone-soft">{activeTab.blurb}</p>

      {/* Detail-level selector — meaningful everywhere except Build/Troubleshoot */}
      {tab !== "build" && tab !== "troubleshoot" && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
            Learning mode:
          </span>
          {(Object.keys(DETAIL_LEVEL_LABELS) as DetailLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => setDetailLevel(level)}
              title={DETAIL_LEVEL_DESCRIPTIONS[level]}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium",
                detailLevel === level ? "border-ink dark:border-bone" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft"
              )}
            >
              {DETAIL_LEVEL_LABELS[level]}
            </button>
          ))}
        </div>
      )}

      <div className="rounded-card border border-line bg-paper p-3 dark:border-line-dark dark:bg-chalkboard sm:p-5">
        {tab === "lab" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Layer:</span>
                {(Object.keys(LAYER_LABELS) as BoardLayer[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLayer(l)}
                    title={LAYER_DESCRIPTIONS[l]}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium",
                      layer === l ? "border-ink dark:border-bone" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft"
                    )}
                  >
                    {LAYER_LABELS[l]}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowLabels((s) => !s)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
                  showLabels
                    ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                    : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft"
                )}
              >
                <Tag className="h-3.5 w-3.5" />
                {showLabels ? "Labels on" : "Labels off"}
              </button>
            </div>

            <HardwareLab3D
              selected={selected}
              onSelect={setSelected}
              preset={preset}
              onPresetChange={setPreset}
              layer={layer}
              showLabels={showLabels}
            />

            <InspectorPanel id={selected} detailLevel={detailLevel} />
          </div>
        )}

        {tab === "library" && <ComponentLibrary detailLevel={detailLevel} />}
        {tab === "relationships" && <RelationshipsPanel />}
        {tab === "compare" && <ComparisonsPanel />}
        {tab === "build" && <BuildAComputerLab />}
        {tab === "troubleshoot" && <TroubleshootingLab />}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
        <Link
          href={DATA_FLOW_LINK.href}
          className="group flex flex-1 items-center justify-between gap-3 rounded-card border border-line p-3 text-sm transition-colors hover:border-subject-it dark:border-line-dark"
        >
          <span>
            <span className="font-medium text-ink dark:text-bone">{DATA_FLOW_LINK.label}</span>
            <span className="mt-0.5 block text-xs text-ink-soft dark:text-bone-soft">{DATA_FLOW_LINK.description}</span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-subject-it transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link
          href={BOOT_PROCESS_LINK.href}
          className="group flex flex-1 items-center justify-between gap-3 rounded-card border border-line p-3 text-sm transition-colors hover:border-subject-it dark:border-line-dark"
        >
          <span>
            <span className="font-medium text-ink dark:text-bone">{BOOT_PROCESS_LINK.label}</span>
            <span className="mt-0.5 block text-xs text-ink-soft dark:text-bone-soft">{BOOT_PROCESS_LINK.description}</span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-subject-it transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <p className="text-xs text-ink-soft dark:text-bone-soft">{HARDWARE_DISCLAIMER}</p>
    </div>
  );
}
