"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  PHYSICAL_RAM_GB,
  freeRamGB,
  nonResidentGB,
  residentGB,
  totalResidentGB,
  totalVirtualDemandGB,
  type DetailLevel,
  type SimProcess,
} from "../model";
import { AddressSpaceMap } from "./address-space-map";
import { PhysicalRamBar } from "./physical-ram-bar";

interface OverviewPanelProps {
  processes: SimProcess[];
  selectedProcessId: string;
  onSelectProcess: (id: string) => void;
  detailLevel: DetailLevel;
}

const COMPARISON_ROWS: { virtual: string; physical: string }[] = [
  { virtual: "Process-visible memory abstraction", physical: "Actual hardware memory" },
  { virtual: "Large address space", physical: "Limited physical capacity" },
  { virtual: "Managed by OS/hardware mechanisms", physical: "Physical resource" },
  { virtual: "Each process can have its own address space", physical: "Shared system resource" },
];

export function OverviewPanel({ processes, selectedProcessId, onSelectProcess, detailLevel }: OverviewPanelProps) {
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const selectedProcess = processes.find((p) => p.id === selectedProcessId) ?? processes[0]!;
  const selectedRegion = selectedProcess.regions.find((r) => r.id === selectedRegionId) ?? null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {processes.map((p) => (
          <button
            key={p.id}
            onClick={() => { onSelectProcess(p.id); setSelectedRegionId(null); }}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium",
              selectedProcessId === p.id ? "border-ink dark:border-bone" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
            )}
          >
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: p.color }} /> {p.name}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-mono uppercase tracking-wide text-subject-it">
            {selectedProcess.name} — Simplified Educational Virtual Address Space
          </p>
          <AddressSpaceMap process={selectedProcess} mode="plain" selectedRegionId={selectedRegionId} onSelectRegion={(r) => setSelectedRegionId(r.id)} />
          <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">
            This is {selectedProcess.name}&apos;s own memory model — {selectedProcess.virtualSizeGB} GB total — not physical RAM.
          </p>
        </div>
        <div>
          <p className="mb-2 text-xs font-mono uppercase tracking-wide text-subject-it">Physical RAM ({PHYSICAL_RAM_GB} GB capacity)</p>
          <PhysicalRamBar processes={processes} height="h-56" />
          <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">
            The actual physical memory resource, shared by every process — including {selectedProcess.name}&apos;s currently resident data.
          </p>
        </div>
      </div>

      {selectedRegion && (
        <div className="rounded-card bg-ink/[0.03] p-4 dark:bg-bone/[0.05]">
          <p className="text-sm text-ink dark:text-bone">
            <span className="font-medium">{selectedRegion.label}</span> · <span className="font-mono">{selectedRegion.sizeGB} GB</span>
            {selectedRegion.kind !== "free" && (
              <> · {selectedRegion.resident ? "currently resident in RAM" : "not currently resident"}</>
            )}
          </p>
        </div>
      )}

      {detailLevel !== "beginner" && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Virtual size", value: `${selectedProcess.virtualSizeGB} GB` },
            { label: "Resident", value: `${residentGB(selectedProcess).toFixed(2)} GB` },
            { label: "Non-resident", value: `${nonResidentGB(selectedProcess).toFixed(2)} GB` },
            { label: "Processes total resident", value: `${totalResidentGB(processes).toFixed(2)} GB` },
          ].map((stat) => (
            <div key={stat.label} className="rounded-md border border-line p-3 dark:border-line-dark">
              <p className="text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{stat.label}</p>
              <p className="font-mono text-base text-ink dark:text-bone">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {detailLevel === "advanced" && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Free RAM", value: `${freeRamGB(processes).toFixed(2)} GB` },
            { label: "Total virtual demand", value: `${totalVirtualDemandGB(processes).toFixed(2)} GB` },
            { label: "Processes", value: `${processes.length}` },
            { label: "Active process", value: selectedProcess.name },
          ].map((stat) => (
            <div key={stat.label} className="rounded-md border border-line p-3 dark:border-line-dark">
              <p className="text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{stat.label}</p>
              <p className="font-mono text-base text-ink dark:text-bone">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      <div>
        <p className="mb-2 text-sm font-medium text-ink dark:text-bone">Virtual memory vs. physical RAM</p>
        <div className="overflow-x-auto rounded-card border border-line dark:border-line-dark">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead className="border-b border-line bg-ink/[0.02] text-xs uppercase tracking-wide text-ink-soft dark:border-line-dark dark:bg-bone/[0.03] dark:text-bone-soft">
              <tr>
                <th className="px-3 py-2 font-medium">Virtual Memory</th>
                <th className="px-3 py-2 font-medium">Physical RAM</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.virtual} className="border-b border-line last:border-0 dark:border-line-dark">
                  <td className="px-3 py-2 text-ink dark:text-bone">{row.virtual}</td>
                  <td className="px-3 py-2 text-ink-soft dark:text-bone-soft">{row.physical}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
