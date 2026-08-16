"use client";

import { Lightbulb, MousePointerClick } from "lucide-react";
import type { OrganelleInfo } from "../data/organelle-info";

export interface InfoPanelProps {
  organelle: OrganelleInfo | null;
}

/**
 * TASK 5 SCOPE: now takes the full `OrganelleInfo` (name, description,
 * fact) instead of just a name, and renders all three. Same card shell
 * and empty state as before -- no UI redesign, just filling in content
 * this component already had room for.
 */
export function InfoPanel({ organelle }: InfoPanelProps) {
  if (!organelle) {
    return (
      <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-3 rounded-[1.75rem] border border-dashed border-line bg-white/50 p-6 text-center dark:border-line-dark dark:bg-white/[0.03]">
        <MousePointerClick className="h-6 w-6 text-ink-soft/60 dark:text-bone-soft/60" strokeWidth={1.5} />
        <p className="text-sm text-ink-soft dark:text-bone-soft">Click any part of the cell to learn what it does.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[220px] flex-col gap-4 rounded-[1.75rem] border border-line bg-white/70 p-6 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">Selected</p>
        <h2 className="mt-1 font-display text-xl font-medium text-ink dark:text-bone">{organelle.name}</h2>
      </div>

      <p className="text-base leading-relaxed text-ink-soft dark:text-bone-soft">{organelle.description}</p>

      <div className="mt-auto flex items-start gap-2 rounded-2xl bg-subject-biology-soft px-4 py-3 text-sm leading-relaxed text-subject-biology dark:bg-subject-biology/15">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
        <span>
          <span className="font-medium">Fun fact: </span>
          {organelle.fact}
        </span>
      </div>
    </div>
  );
}
