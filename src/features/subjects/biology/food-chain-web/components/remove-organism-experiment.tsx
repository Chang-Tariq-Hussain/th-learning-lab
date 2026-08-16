"use client";

import { Bug, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GRASSHOPPER_REMOVED_EFFECTS } from "../food-web-model";

interface RemoveOrganismExperimentProps {
  removed: boolean;
  onToggle: () => void;
  onRestore: () => void;
}

export function RemoveOrganismExperiment({
  removed,
  onToggle,
  onRestore,
}: RemoveOrganismExperimentProps) {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
        What If One Organism Disappears?
      </p>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
        <Button variant={removed ? "primary" : "secondary"} size="sm" onClick={onToggle}>
          <Bug className="h-4 w-4" strokeWidth={1.75} />
          {removed ? "Grasshoppers Removed" : "Remove Grasshoppers"}
        </Button>
        <Button variant="ghost" size="sm" onClick={onRestore}>
          <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
          Restore Ecosystem
        </Button>
      </div>

      {removed ? (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {GRASSHOPPER_REMOVED_EFFECTS.map((effect) => (
            <span
              key={effect.id}
              className="rounded-full border border-ink/15 bg-white/70 px-3 py-1 text-xs font-medium text-ink dark:border-bone/20 dark:bg-white/[0.04] dark:text-bone"
            >
              {effect.label} · {effect.note}
            </span>
          ))}
        </div>
      ) : null}

      <p className="mt-3 text-center text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
        {removed
          ? "Removing one organism can affect several other organisms because food webs contain interconnected relationships."
          : "Try removing grasshoppers to see how the rest of the food web depends on them."}
      </p>
    </div>
  );
}
