"use client";

import { CPU_PARTS, type CpuPartId } from "../model";

export interface ComponentInspectorProps {
  selectedPart: CpuPartId | null;
}

export function ComponentInspector({ selectedPart }: ComponentInspectorProps) {
  const part = CPU_PARTS.find((p) => p.id === selectedPart);

  if (!part) {
    return (
      <div className="rounded-card border border-dashed border-line p-4 text-sm text-ink-soft dark:border-line-dark dark:text-bone-soft">
        Click any part of the CPU diagram to read what it does.
      </div>
    );
  }

  return (
    <div className="rounded-card border border-line bg-paper p-4 dark:border-line-dark dark:bg-chalkboard">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subject-it">Component Inspector</p>
      <h3 className="mt-1 font-display text-lg font-medium text-ink dark:text-bone">{part.label}</h3>
      <p className="mt-2 text-sm font-medium text-ink dark:text-bone">{part.purpose}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{part.detail}</p>
    </div>
  );
}
