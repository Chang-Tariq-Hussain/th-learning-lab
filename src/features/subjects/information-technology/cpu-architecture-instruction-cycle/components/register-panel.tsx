"use client";

import { cn } from "@/lib/utils";
import { REGISTER_IDS, binaryOf, type RegisterId, type Registers } from "../model";

export interface RegisterPanelProps {
  registers: Registers;
  previous?: Registers;
  changedRegister?: RegisterId;
  showBinary: boolean;
  className?: string;
}

export function RegisterPanel({ registers, previous, changedRegister, showBinary, className }: RegisterPanelProps) {
  return (
    <div className={cn("rounded-card border border-line bg-paper p-4 dark:border-line-dark dark:bg-chalkboard", className)}>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subject-it">Registers</p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {REGISTER_IDS.map((id) => {
          const value = registers[id];
          const prevValue = previous?.[id];
          const changed = changedRegister === id && prevValue !== undefined && prevValue !== value;
          return (
            <div
              key={id}
              className={cn(
                "flex flex-col items-center rounded-xl border px-2 py-3 transition-colors",
                changed ? "border-subject-it bg-subject-it-soft dark:bg-subject-it/20" : "border-line dark:border-line-dark",
              )}
            >
              <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{id}</span>
              <span className="font-mono text-lg font-semibold text-ink dark:text-bone">{value}</span>
              {changed && prevValue !== undefined ? (
                <span className="font-mono text-[10px] text-subject-it">{prevValue} → {value}</span>
              ) : showBinary ? (
                <span className="font-mono text-[10px] text-ink-soft dark:text-bone-soft">{binaryOf(value)}</span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
