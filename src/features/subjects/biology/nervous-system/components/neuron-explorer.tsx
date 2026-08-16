"use client";

import { cn } from "@/lib/utils";
import { NEURON_PARTS } from "../nervous-model";
import type { NeuronPartId } from "../types";
import { NeuronDiagram } from "./neuron-diagram";

interface NeuronExplorerProps {
  activeId: NeuronPartId | null;
  onSelect: (id: NeuronPartId | null) => void;
}

export function NeuronExplorer({ activeId, onSelect }: NeuronExplorerProps) {
  const active = NEURON_PARTS.find((p) => p.id === activeId) ?? null;

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
        Neuron Anatomy
      </p>

      <div className="mx-auto mt-3 h-[220px] w-full max-w-md rounded-[1.25rem] border border-line bg-white/70 p-2 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
        <NeuronDiagram highlight={activeId} />
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {NEURON_PARTS.map((part) => (
          <button
            key={part.id}
            type="button"
            onClick={() => onSelect(activeId === part.id ? null : part.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              activeId === part.id
                ? "border-subject-biology bg-subject-biology text-paper dark:text-chalkboard"
                : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone",
            )}
          >
            {part.label}
          </button>
        ))}
      </div>

      <div className="mt-3 min-h-[2.5rem] text-center">
        <p className="text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
          {active ? active.function : "Click a part to see what it does."}
        </p>
      </div>
    </div>
  );
}
