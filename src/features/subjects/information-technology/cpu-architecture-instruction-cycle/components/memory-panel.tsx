"use client";

import { cn } from "@/lib/utils";
import type { CycleStep, ProgramInstruction } from "../model";

export interface MemoryPanelProps {
  instructions: ProgramInstruction[];
  step: CycleStep | undefined;
  className?: string;
}

export function MemoryPanel({ instructions, step, className }: MemoryPanelProps) {
  // Every distinct address this run has written to, in first-write order.
  const dataRows: { address: number; value: number }[] = [];
  if (step) {
    const seen = new Map<number, number>();
    // We only have the current step's write here (the log carries the
    // full history) — the panel shows the latest known value per
    // address, which `step.memoryWrite` always keeps current since
    // writes are cumulative going forward through the timeline.
    if (step.memoryWrite) seen.set(step.memoryWrite.address, step.memoryWrite.value);
    seen.forEach((value, address) => dataRows.push({ address, value }));
  }

  return (
    <div className={cn("rounded-card border border-line bg-paper p-4 dark:border-line-dark dark:bg-chalkboard", className)}>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subject-it">Memory (simulated)</p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[280px] font-mono text-xs">
          <thead>
            <tr className="text-left text-ink-soft dark:text-bone-soft">
              <th className="py-1 pr-3 font-normal">Address</th>
              <th className="py-1 font-normal">Value</th>
            </tr>
          </thead>
          <tbody>
            {instructions.map((instr) => {
              const active = step ? step.ir.address === instr.address : false;
              return (
                <tr
                  key={instr.address}
                  className={cn("border-t border-line/60 dark:border-line-dark/60", active && "bg-subject-it-soft dark:bg-subject-it/20")}
                >
                  <td className="py-1 pr-3 text-ink dark:text-bone">{instr.address}</td>
                  <td className={cn("py-1", active ? "text-subject-it font-semibold" : "text-ink dark:text-bone")}>{instr.text}</td>
                </tr>
              );
            })}
            {dataRows.map((row) => (
              <tr key={row.address} className="border-t border-line/60 bg-subject-it-soft/60 dark:border-line-dark/60 dark:bg-subject-it/10">
                <td className="py-1 pr-3 text-ink dark:text-bone">{row.address}</td>
                <td className="py-1 font-semibold text-subject-it">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11px] text-ink-soft dark:text-bone-soft">
        Addresses 100+ hold this program&rsquo;s instructions; the highlighted row is whatever address is currently being fetched. Addresses written by STORE
        appear below as data.
      </p>
    </div>
  );
}
