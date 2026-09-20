"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { GENERAL_DISCLAIMER, LEVELS, levelAtLeast, type Level } from "./model";
import { type Experiment, type LabPreset, type TabId } from "./experiments";
import { BasicsLab } from "./components/basics-lab";
import { EventLab } from "./components/event-lab";
import { PollingLab } from "./components/polling-lab";
import { AddressingLab } from "./components/addressing-lab";
import { DmaLab } from "./components/dma-lab";
import { ExperimentsTab } from "./components/experiments-tab";
import { Btn } from "./components/ui-bits";

const TABS: { id: TabId; label: string; blurb: string; minLevel: Level }[] = [
  { id: "basics", label: "I/O Basics", blurb: "What I/O is, input vs output, device controllers, and how an I/O request progresses.", minLevel: "beginner" },
  { id: "events", label: "Event Lab", blurb: "Generate device events and watch the interrupt, ISR, CPU state, queue, and timeline respond.", minLevel: "beginner" },
  { id: "polling", label: "Polling vs Interrupts", blurb: "Run the same event with polling and with interrupts, then compare CPU activity.", minLevel: "beginner" },
  { id: "addressing", label: "Vectors & Addressing", blurb: "How an interrupt number finds its ISR, and how software addresses device registers.", minLevel: "intermediate" },
  { id: "dma", label: "DMA Lab", blurb: "Compare CPU-driven transfers with Direct Memory Access.", minLevel: "intermediate" },
  { id: "experiments", label: "Guided Experiments", blurb: "Six guided experiments that open the lab pre-configured.", minLevel: "beginner" },
];

/**
 * The "Computer I/O & Interrupt Laboratory" — 2D/2.5D SVG throughout:
 * this topic is about signals, processes, and system interactions, so
 * clear animated diagrams teach better than a 3D motherboard. All
 * simulation logic lives in `model.ts` as pure functions; nothing here
 * calls a server, and each running lab owns a single interval that is
 * cleared when it stops or unmounts.
 */
export function IoInterruptsExplorer() {
  const [level, setLevel] = useState<Level>("beginner");
  const [tab, setTab] = useState<TabId>("basics");
  const [labKey, setLabKey] = useState(0);
  const [preset, setPreset] = useState<LabPreset>({});
  const [experiment, setExperiment] = useState<Experiment | null>(null);

  const visibleTabs = TABS.filter((t) => levelAtLeast(level, t.minLevel));
  const activeTab = (visibleTabs.find((t) => t.id === tab) ?? visibleTabs[0]) as (typeof TABS)[number];
  const levelMeta = LEVELS.find((l) => l.id === level)!;
  const nextLevel = LEVELS[LEVELS.findIndex((l) => l.id === level) + 1];

  const openExperiment = (e: Experiment) => {
    if (!levelAtLeast(level, e.level)) setLevel(e.level);
    setPreset(e.preset);
    setExperiment(e);
    setLabKey((k) => k + 1);
    setTab(e.tab);
  };

  const goTab = (id: TabId) => {
    setTab(id);
    // A manually chosen tab starts from defaults, not a leftover experiment preset.
    if (experiment && id !== experiment.tab) {
      setExperiment(null);
      setPreset({});
      setLabKey((k) => k + 1);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-soft dark:text-bone-soft">Level</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Difficulty level">
          {LEVELS.map((l) => (
            <Btn key={l.id} pressed={level === l.id} onClick={() => setLevel(l.id)}>
              {l.label}
            </Btn>
          ))}
        </div>
        <p className="mt-2 text-sm text-ink-soft dark:text-bone-soft">{levelMeta.blurb}</p>
        {nextLevel && <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">Switch to {nextLevel.label} to unlock more: {nextLevel.blurb.replace(/^Adds /, "").toLowerCase()}</p>}
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Interrupt Laboratory section">
        {visibleTabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={activeTab.id === t.id}
            onClick={() => goTab(t.id)}
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

      {experiment && activeTab.id === experiment.tab && (
        <div className="rounded-card border border-subject-it/50 bg-subject-it-soft/40 p-3.5 dark:bg-subject-it/10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-ink dark:text-bone">{experiment.title}</p>
            <Btn onClick={() => { setExperiment(null); }} className="min-h-[34px] px-3 py-1 text-xs">
              Close guide
            </Btn>
          </div>
          <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">{experiment.goal}</p>
          <ol className="mt-2 list-decimal pl-5 text-sm text-ink-soft dark:text-bone-soft">
            {experiment.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
      )}

      <div className="rounded-card border border-line bg-paper p-3 dark:border-line-dark dark:bg-chalkboard sm:p-5">
        {activeTab.id === "basics" && <BasicsLab level={level} />}
        {activeTab.id === "events" && <EventLab key={labKey} level={level} preset={preset.event} />}
        {activeTab.id === "polling" && <PollingLab key={labKey} level={level} preset={preset.polling} />}
        {activeTab.id === "addressing" && <AddressingLab level={level} />}
        {activeTab.id === "dma" && <DmaLab key={labKey} level={level} preset={preset.dma} />}
        {activeTab.id === "experiments" && <ExperimentsTab onOpen={openExperiment} />}
      </div>

      <p className="text-xs text-ink-soft dark:text-bone-soft">{GENERAL_DISCLAIMER}</p>
    </div>
  );
}

