"use client";

import { cn } from "@/lib/utils";
import {
  MEMORY_PRESSURE_DENIED_NOTE,
  OVERCOMMIT_NOTE,
  OS_RESERVED_RAM_GB,
  PHYSICAL_RAM_GB,
  PRESSURE_REQUEST_GB,
  freeRamGB,
  totalResidentGB,
  totalVirtualDemandGB,
  type SimProcess,
} from "../model";
import { PhysicalRamBar } from "./physical-ram-bar";

interface MemoryPressureOvercommitLabProps {
  processes: SimProcess[];
  onAddPressureProcess: () => void;
  pressureDenied: boolean;
  onReset: () => void;
}

/**
 * Two closely related experiments in one tab, since overcommit is
 * best understood right next to memory pressure: (1) keep adding
 * processes that each request resident memory until physical RAM is
 * exhausted, and (2) compare total virtual address-space demand
 * against physical RAM capacity — which can exceed it even when
 * resident memory doesn't.
 */
export function MemoryPressureOvercommitLab({ processes, onAddPressureProcess, pressureDenied, onReset }: MemoryPressureOvercommitLabProps) {
  const used = totalResidentGB(processes) + OS_RESERVED_RAM_GB;
  const usedPct = Math.round((used / PHYSICAL_RAM_GB) * 100);
  const free = freeRamGB(processes);
  const virtualDemand = totalVirtualDemandGB(processes);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-sm font-medium text-ink dark:text-bone">Memory pressure</p>
        <p className="mb-3 text-sm text-ink-soft dark:text-bone-soft">
          Each click starts a new simulated process and immediately requests {PRESSURE_REQUEST_GB} GB of resident memory. Keep going and watch free RAM shrink.
        </p>

        <div className="rounded-card border border-line bg-ink/[0.02] p-4 dark:border-line-dark dark:bg-bone/[0.03]">
          <PhysicalRamBar processes={processes} />
        </div>

        <div className="mt-3 rounded-card border border-line p-4 dark:border-line-dark">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-ink dark:text-bone">Physical RAM used: {usedPct}%</span>
            <span className="font-mono text-ink-soft dark:text-bone-soft">{free.toFixed(2)} GB free of {PHYSICAL_RAM_GB} GB</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-bone/10">
            <div
              className={cn("h-full rounded-full transition-all", usedPct > 85 ? "bg-rose-500" : usedPct > 60 ? "bg-amber-500" : "bg-emerald-500")}
              style={{ width: `${Math.min(100, usedPct)}%` }}
            />
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={onAddPressureProcess}
              disabled={pressureDenied}
              className="inline-flex h-9 items-center rounded-full bg-subject-it px-4 text-sm font-medium text-paper hover:opacity-90 disabled:opacity-40"
            >
              Start process ({PRESSURE_REQUEST_GB} GB resident)
            </button>
            <button
              onClick={onReset}
              className="inline-flex h-9 items-center rounded-full border border-line px-3 text-sm font-medium text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40"
            >
              Reset
            </button>
          </div>
        </div>

        {pressureDenied && (
          <div className="mt-3 rounded-card border border-rose-300 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
            <p className="mb-1 font-medium">Request denied — not enough free RAM.</p>
            <p>{MEMORY_PRESSURE_DENIED_NOTE}</p>
          </div>
        )}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ink dark:text-bone">Overcommit: virtual demand vs. physical capacity</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-line p-3 dark:border-line-dark">
            <p className="text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Total virtual address-space demand</p>
            <p className="font-mono text-xl text-ink dark:text-bone">{virtualDemand.toFixed(2)} GB</p>
            <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">Sum of every process&apos;s virtual address-space size.</p>
          </div>
          <div className="rounded-md border border-line p-3 dark:border-line-dark">
            <p className="text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Physical RAM capacity</p>
            <p className="font-mono text-xl text-ink dark:text-bone">{PHYSICAL_RAM_GB.toFixed(2)} GB</p>
            <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">Currently resident: {totalResidentGB(processes).toFixed(2)} GB.</p>
          </div>
        </div>
        {virtualDemand > PHYSICAL_RAM_GB && (
          <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">
            Virtual demand ({virtualDemand.toFixed(2)} GB) already exceeds physical RAM ({PHYSICAL_RAM_GB} GB) — and yet the system keeps running, because only resident memory ({totalResidentGB(processes).toFixed(2)} GB) actually has to fit in RAM at once.
          </p>
        )}
        <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">{OVERCOMMIT_NOTE}</p>
      </div>
    </div>
  );
}
