"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PCB_DISCLAIMER, SAMPLE_PROCESSES, STATE_LABELS } from "../model";
import { StateBadge } from "./state-badge";

/**
 * Shows several processes existing simultaneously (matching the
 * brief's P1-running/P2-ready/P3-waiting/P4-ready example) and, on
 * click, that process's simplified conceptual PCB — the "Process
 * Inspector" experiment.
 */
export function ProcessInspector() {
  const [selectedId, setSelectedId] = useState(SAMPLE_PROCESSES[0]!.id);
  const selected = SAMPLE_PROCESSES.find((p) => p.id === selectedId)!;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="mb-2 text-sm font-medium text-ink dark:text-bone">Processes currently on the system</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SAMPLE_PROCESSES.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={cn(
                "flex flex-col gap-1 rounded-card border p-3 text-left transition-colors",
                selectedId === p.id
                  ? "border-subject-it bg-subject-it-soft/50 dark:bg-subject-it/10"
                  : "border-line hover:border-ink/30 dark:border-line-dark dark:hover:border-bone/30",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-semibold text-ink dark:text-bone">{p.id} · {p.name}</span>
                <StateBadge state={p.pcb.processState} label={STATE_LABELS[p.pcb.processState]} />
              </div>
              <p className="text-xs text-ink-soft dark:text-bone-soft">{p.activity}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-card border border-line p-4 dark:border-line-dark">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-subject-it">
          Process Control Block — {selected.id} ({selected.name})
        </p>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          <PcbField label="Process ID (PID)" value={String(selected.pcb.pid)} />
          <PcbField label="Process State" value={STATE_LABELS[selected.pcb.processState]} />
          <PcbField label="Program Counter" value={selected.pcb.programCounter} mono />
          <PcbField label="CPU / Register Context" value={selected.pcb.cpuRegisters} mono />
          <PcbField label="Scheduling Information" value={selected.pcb.schedulingInfo} />
          <PcbField label="Memory-Management Information" value={selected.pcb.memoryManagementInfo} mono />
          <PcbField label="I/O Status Information" value={selected.pcb.ioStatusInfo} />
          <PcbField label="Resource Information" value={selected.pcb.resourceInfo} />
        </dl>
      </div>
      <p className="text-xs text-ink-soft dark:text-bone-soft">{PCB_DISCLAIMER}</p>
    </div>
  );
}

function PcbField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{label}</dt>
      <dd className={cn("text-sm text-ink dark:text-bone", mono && "font-mono")}>{value}</dd>
    </div>
  );
}
