"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { GENERAL_DISCLAIMER, LEVELS, levelAtLeast, type Level } from "./model";
import { type Experiment, type LabPreset, type TabId } from "./experiments";
import { BasesLab } from "./components/bases-lab";
import { PlaceValueLab } from "./components/place-value-lab";
import { DecBinaryLab } from "./components/dec-binary-lab";
import { GroupingLab } from "./components/grouping-lab";
import { ConverterLab } from "./components/converter-lab";
import { BitsBytesLab } from "./components/bits-bytes-lab";
import { DataUnitsLab } from "./components/data-units-lab";
import { MemoryStorageLab } from "./components/memory-storage-lab";
import { NetworkLab } from "./components/network-lab";
import { AddressesLab } from "./components/addresses-lab";
import { SignedLab } from "./components/signed-lab";
import { PracticeLab } from "./components/practice-lab";
import { ExperimentsTab } from "./components/experiments-tab";
import { Btn } from "./components/ui-bits";

const TABS: { id: TabId; label: string; blurb: string; minLevel: Level }[] = [
  { id: "bases", label: "Number Systems", blurb: "Decimal, binary, octal, and hexadecimal — what each base is and how its digits work.", minLevel: "beginner" },
  { id: "place-value", label: "Place Value", blurb: "Click a digit to see exactly what it contributes to the total.", minLevel: "beginner" },
  { id: "dec-binary", label: "Decimal ↔ Binary", blurb: "Repeated division to convert decimal to binary, and bit toggles to convert binary to decimal.", minLevel: "beginner" },
  { id: "grouping", label: "Binary ↔ Hex/Octal", blurb: "Group bits by 4 for hex or by 3 for octal, and convert hex to decimal by place value.", minLevel: "intermediate" },
  { id: "converter", label: "Universal Converter", blurb: "Type a value in any base and see it instantly in every other one.", minLevel: "beginner" },
  { id: "bits-bytes", label: "Bits & Bytes", blurb: "Toggle a full byte, and convert between bit counts and byte counts.", minLevel: "beginner" },
  { id: "data-units", label: "Data Units", blurb: "The bit-to-petabyte hierarchy, decimal vs binary units, and a unit converter.", minLevel: "beginner" },
  { id: "memory-storage", label: "Memory & Storage", blurb: "Connect data units to real RAM and drive sizes, and calculate storage totals.", minLevel: "intermediate" },
  { id: "network", label: "Transfer Rates", blurb: "Bits vs bytes in network speeds, and a network transfer time calculator.", minLevel: "intermediate" },
  { id: "addresses", label: "Memory Addresses", blurb: "Convert addresses between bases, and calculate addressable memory ranges.", minLevel: "intermediate" },
  { id: "signed", label: "Signed Integers", blurb: "Two's complement — how negative numbers are represented in binary.", minLevel: "technical" },
  { id: "practice", label: "Practice Lab", blurb: "Fresh, random conversion problems — check your answer or see the steps.", minLevel: "beginner" },
  { id: "experiments", label: "Guided Experiments", blurb: "Seven guided experiments that open the lab pre-configured.", minLevel: "beginner" },
];

/**
 * The "Number Systems & Data Units Laboratory" — 2D interactive
 * throughout: number bases, place value, and unit arithmetic are
 * abstract/numeric, not spatial, so clear interactive panels teach
 * better than a 3D scene. All conversion math lives in `model.ts` as
 * pure, exact (BigInt/rational) functions — nothing here calls a
 * server or approximates with floating point.
 *
 * Complements (does not duplicate) Binary & Data Representation: that
 * simulation owns bit-level encoding and character/ASCII encoding;
 * this one owns number bases, base conversion, and data units/storage/
 * transfer-rate arithmetic.
 */
export function NumberSystemsDataUnits() {
  const [level, setLevel] = useState<Level>("beginner");
  const [tab, setTab] = useState<TabId>("bases");
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

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Number Systems & Data Units Laboratory section">
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
            <Btn onClick={() => setExperiment(null)} className="min-h-[34px] px-3 py-1 text-xs">
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
        {activeTab.id === "bases" && <BasesLab level={level} />}
        {activeTab.id === "place-value" && <PlaceValueLab level={level} />}
        {activeTab.id === "dec-binary" && <DecBinaryLab key={labKey} preset={preset.decBinary} />}
        {activeTab.id === "grouping" && <GroupingLab key={labKey} preset={preset.grouping} />}
        {activeTab.id === "converter" && <ConverterLab level={level} />}
        {activeTab.id === "bits-bytes" && <BitsBytesLab />}
        {activeTab.id === "data-units" && <DataUnitsLab key={labKey} level={level} preset={preset.dataUnits} />}
        {activeTab.id === "memory-storage" && <MemoryStorageLab />}
        {activeTab.id === "network" && <NetworkLab key={labKey} preset={preset.network} />}
        {activeTab.id === "addresses" && <AddressesLab key={labKey} level={level} preset={preset.addresses} />}
        {activeTab.id === "signed" && <SignedLab />}
        {activeTab.id === "practice" && <PracticeLab level={level} />}
        {activeTab.id === "experiments" && <ExperimentsTab onOpen={openExperiment} />}
      </div>

      <p className="text-xs text-ink-soft dark:text-bone-soft">{GENERAL_DISCLAIMER}</p>
    </div>
  );
}
