"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { MemoryMapLab } from "./components/memory-map-lab";
import { PartitioningLab } from "./components/partitioning-lab";
import { FragmentationLab } from "./components/fragmentation-lab";
import { AllocationStrategyLab } from "./components/allocation-strategy-lab";
import { MemoryPressureLab } from "./components/memory-pressure-lab";
import { ProcessConnectionPanel } from "./components/process-connection-panel";
import { MEMORY_MANAGEMENT_DISCLAIMER } from "./model";

type LabMode = "map" | "partitioning" | "fragmentation" | "strategies" | "pressure" | "connection";

const LAB_MODES: { id: LabMode; label: string; blurb: string }[] = [
  {
    id: "map",
    label: "Memory Map Lab",
    blurb: "Create processes, watch the OS allocate their memory, inspect any block, and see logical vs. physical addresses.",
  },
  {
    id: "partitioning",
    label: "Partitioning Lab",
    blurb: "Compare fixed-size and variable-size partitioning on the same sample processes.",
  },
  {
    id: "fragmentation",
    label: "Fragmentation Lab",
    blurb: "See why a request can fail even when total free memory would be enough — external fragmentation.",
  },
  {
    id: "strategies",
    label: "Allocation Strategies",
    blurb: "Compare First Fit, Best Fit, and Worst Fit on the exact same memory layout and request.",
  },
  {
    id: "pressure",
    label: "Memory Pressure",
    blurb: "Keep starting processes and watch free memory run out.",
  },
  {
    id: "connection",
    label: "Process Connection",
    blurb: "See how each process lifecycle state connects to a memory event.",
  },
];

/**
 * The "Memory Management Laboratory" — 2D/2.5D throughout (no
 * three.js), per brief guidance: memory addresses and fragmentation
 * are abstract concepts best shown as a spatial-but-flat memory map,
 * not a 3D RAM chip. Connects to, but stays separate from, the
 * Process Management and CPU Scheduling simulators built in the
 * previous batch.
 */
export function MemoryManagementSimulator() {
  const [mode, setMode] = useState<LabMode>("map");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Memory Management Laboratory mode">
        {LAB_MODES.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={mode === m.id}
            onClick={() => setMode(m.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              mode === m.id
                ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-ink-soft dark:text-bone-soft">{LAB_MODES.find((m) => m.id === mode)!.blurb}</p>

      <div className="rounded-card border border-line bg-paper p-3 dark:border-line-dark dark:bg-chalkboard sm:p-5">
        {mode === "map" && <MemoryMapLab />}
        {mode === "partitioning" && <PartitioningLab />}
        {mode === "fragmentation" && <FragmentationLab />}
        {mode === "strategies" && <AllocationStrategyLab />}
        {mode === "pressure" && <MemoryPressureLab />}
        {mode === "connection" && <ProcessConnectionPanel />}
      </div>

      <p className="text-xs text-ink-soft dark:text-bone-soft">{MEMORY_MANAGEMENT_DISCLAIMER}</p>
    </div>
  );
}
