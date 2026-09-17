"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { OverviewPanel } from "./components/overview-panel";
import { AddressTranslationLab } from "./components/address-translation-lab";
import { ResidentWorkingSetPanel } from "./components/resident-working-set-panel";
import { MemoryPressureOvercommitLab } from "./components/memory-pressure-overcommit-lab";
import { ProcessIsolationLab } from "./components/process-isolation-lab";
import {
  DETAIL_LEVEL_DESCRIPTIONS,
  DETAIL_LEVEL_LABELS,
  PAGING_PREVIEW_NOTE,
  PRESSURE_REQUEST_GB,
  VIRTUAL_MEMORY_DISCLAIMER,
  createInitialProcesses,
  freeRamGB,
  type DetailLevel,
  type SimProcess,
} from "./model";

type TabMode = "overview" | "translation" | "resident" | "pressure" | "isolation";

const TABS: { id: TabMode; label: string; blurb: string }[] = [
  {
    id: "overview",
    label: "Virtual Memory Map",
    blurb: "See a process's virtual address space next to physical RAM, and how they compare.",
  },
  {
    id: "translation",
    label: "Address Translation",
    blurb: "Step through what happens when a process accesses a virtual address, resident or not.",
  },
  {
    id: "resident",
    label: "Resident & Working Set",
    blurb: "See which regions are currently resident in RAM, and which are actively in use right now.",
  },
  {
    id: "pressure",
    label: "Memory Pressure & Overcommit",
    blurb: "Keep starting processes until RAM runs out, and compare total virtual demand to physical capacity.",
  },
  {
    id: "isolation",
    label: "Process Isolation",
    blurb: "See how two processes can share the same-looking virtual address while it means something completely different for each.",
  },
];

const PRESSURE_COLORS = ["#dc2626", "#7c3aed", "#0891b2", "#be185d", "#65a30d", "#ea580c"];

let pressureCounter = 0;

function createPressureProcess(): SimProcess {
  const letters = ["D", "E", "F", "G", "H", "I", "J", "K"];
  const letter = letters[pressureCounter % letters.length] ?? "X";
  const color = PRESSURE_COLORS[pressureCounter % PRESSURE_COLORS.length]!;
  pressureCounter += 1;
  return {
    id: `pressure-${pressureCounter}`,
    name: `Process ${letter}`,
    color,
    virtualSizeGB: PRESSURE_REQUEST_GB,
    isolationVirtualAddress: "0x1000",
    regions: [
      { id: `pressure-region-${pressureCounter}`, kind: "data", label: "Resident Data", sizeGB: PRESSURE_REQUEST_GB, resident: true, active: true },
    ],
  };
}

/**
 * The "Virtual Memory Laboratory" — 2D/2.5D throughout (no three.js),
 * per brief guidance: virtual address spaces and residency are
 * abstract concepts best shown as address-space maps and capacity
 * bars. Deliberately stops short of pages/frames/page tables/page
 * replacement — see `PAGING_PREVIEW_NOTE` — those belong to a later
 * Paging simulation.
 */
export function VirtualMemorySimulator() {
  const [tab, setTab] = useState<TabMode>("overview");
  const [detailLevel, setDetailLevel] = useState<DetailLevel>("intermediate");
  const [processes, setProcesses] = useState<SimProcess[]>(() => createInitialProcesses());
  const [selectedProcessId, setSelectedProcessId] = useState<string>(processes[0]!.id);
  const [pressureDenied, setPressureDenied] = useState(false);

  const addPressureProcess = () => {
    if (freeRamGB(processes) >= PRESSURE_REQUEST_GB) {
      setProcesses((prev) => [...prev, createPressureProcess()]);
      setPressureDenied(false);
    } else {
      setPressureDenied(true);
    }
  };

  const resetPressure = () => {
    const fresh = createInitialProcesses();
    setProcesses(fresh);
    setSelectedProcessId(fresh[0]!.id);
    setPressureDenied(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Virtual Memory Laboratory mode">
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
      </div>
      <p className="text-sm text-ink-soft dark:text-bone-soft">{TABS.find((t) => t.id === tab)!.blurb}</p>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-soft dark:text-bone-soft">Detail level:</span>
        {(Object.keys(DETAIL_LEVEL_LABELS) as DetailLevel[]).map((level) => (
          <button
            key={level}
            onClick={() => setDetailLevel(level)}
            title={DETAIL_LEVEL_DESCRIPTIONS[level]}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium",
              detailLevel === level ? "border-ink dark:border-bone" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
            )}
          >
            {DETAIL_LEVEL_LABELS[level]}
          </button>
        ))}
      </div>

      <div className="rounded-card border border-line bg-paper p-3 dark:border-line-dark dark:bg-chalkboard sm:p-5">
        {tab === "overview" && (
          <OverviewPanel processes={processes} selectedProcessId={selectedProcessId} onSelectProcess={setSelectedProcessId} detailLevel={detailLevel} />
        )}
        {tab === "translation" && (
          <AddressTranslationLab processes={processes} selectedProcessId={selectedProcessId} onSelectProcess={setSelectedProcessId} />
        )}
        {tab === "resident" && (
          <ResidentWorkingSetPanel processes={processes} selectedProcessId={selectedProcessId} onSelectProcess={setSelectedProcessId} />
        )}
        {tab === "pressure" && (
          <MemoryPressureOvercommitLab processes={processes} onAddPressureProcess={addPressureProcess} pressureDenied={pressureDenied} onReset={resetPressure} />
        )}
        {tab === "isolation" && <ProcessIsolationLab processes={processes} />}
      </div>

      {detailLevel === "advanced" && <p className="text-xs text-ink-soft dark:text-bone-soft">{PAGING_PREVIEW_NOTE}</p>}
      <p className="text-xs text-ink-soft dark:text-bone-soft">{VIRTUAL_MEMORY_DISCLAIMER}</p>
    </div>
  );
}
