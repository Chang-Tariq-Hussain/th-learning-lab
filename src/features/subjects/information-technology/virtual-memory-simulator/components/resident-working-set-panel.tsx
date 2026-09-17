"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { WORKING_SET_NOTE, nonResidentGB, residentGB, type SimProcess } from "../model";
import { AddressSpaceMap } from "./address-space-map";

interface ResidentWorkingSetPanelProps {
  processes: SimProcess[];
  selectedProcessId: string;
  onSelectProcess: (id: string) => void;
}

type ViewMode = "residency" | "working-set";

export function ResidentWorkingSetPanel({ processes, selectedProcessId, onSelectProcess }: ResidentWorkingSetPanelProps) {
  const [view, setView] = useState<ViewMode>("residency");
  const selectedProcess = processes.find((p) => p.id === selectedProcessId) ?? processes[0]!;
  const mappable = selectedProcess.regions.filter((r) => r.kind !== "free");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {processes.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelectProcess(p.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium",
              selectedProcessId === p.id ? "border-ink dark:border-bone" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
            )}
          >
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: p.color }} /> {p.name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="View mode">
        {(["residency", "working-set"] as ViewMode[]).map((v) => (
          <button
            key={v}
            role="tab"
            aria-selected={view === v}
            onClick={() => setView(v)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              view === v
                ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
            )}
          >
            {v === "residency" ? "Resident vs. Non-Resident" : "Working Set (Active vs. Inactive)"}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-mono uppercase tracking-wide text-subject-it">{selectedProcess.name} — Virtual Memory</p>
          <AddressSpaceMap process={selectedProcess} mode={view} />
        </div>
        <div className="flex flex-col gap-2">
          <p className="mb-1 text-xs font-mono uppercase tracking-wide text-subject-it">
            {view === "residency" ? "Region residency" : "Region activity"}
          </p>
          <ul className="flex flex-col gap-1.5">
            {mappable.map((r) => (
              <li key={r.id} className="flex items-center justify-between rounded-md border border-line px-3 py-2 text-sm dark:border-line-dark">
                <span className="text-ink dark:text-bone">{r.label} <span className="font-mono text-xs text-ink-soft dark:text-bone-soft">{r.sizeGB} GB</span></span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-medium",
                    view === "residency"
                      ? r.resident
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "bg-ink/5 text-ink-soft dark:bg-bone/10 dark:text-bone-soft"
                      : r.active
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "bg-ink/5 text-ink-soft dark:bg-bone/10 dark:text-bone-soft",
                  )}
                >
                  {view === "residency" ? (r.resident ? "RESIDENT" : "NON-RESIDENT") : (r.active ? "ACTIVE" : "INACTIVE")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-md border border-line p-3 dark:border-line-dark">
          <p className="text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Resident</p>
          <p className="font-mono text-base text-ink dark:text-bone">{residentGB(selectedProcess).toFixed(2)} GB</p>
        </div>
        <div className="rounded-md border border-line p-3 dark:border-line-dark">
          <p className="text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Non-resident</p>
          <p className="font-mono text-base text-ink dark:text-bone">{nonResidentGB(selectedProcess).toFixed(2)} GB</p>
        </div>
      </div>

      {view === "working-set" && <p className="text-xs text-ink-soft dark:text-bone-soft">{WORKING_SET_NOTE}</p>}
    </div>
  );
}
