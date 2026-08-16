"use client";

import { cn } from "@/lib/utils";
import { COMPONENTS, componentById } from "../ecosystem-model";
import type { ComponentId } from "../types";
import { EcosystemScene } from "./ecosystem-scene";
import { RelationshipChain } from "./relationship-chain";

interface ComponentExplorerProps {
  selectedId: ComponentId | null;
  highlightIds: ComponentId[] | null;
  plantsRemoved: boolean;
  waterReduced: boolean;
  onSelect: (id: ComponentId | null) => void;
}

export function ComponentExplorer({
  selectedId,
  highlightIds,
  plantsRemoved,
  waterReduced,
  onSelect,
}: ComponentExplorerProps) {
  const active = selectedId ? componentById(selectedId) : null;

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
        Ecosystem Scene
      </p>

      <div className="mx-auto mt-3 h-[300px] w-full max-w-lg rounded-[1.25rem] border border-line bg-white/70 p-2 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04] sm:h-[320px]">
        <EcosystemScene
          selectedId={selectedId}
          highlightIds={highlightIds}
          plantsRemoved={plantsRemoved}
          waterReduced={waterReduced}
          onSelect={(id) => onSelect(selectedId === id ? null : id)}
        />
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {COMPONENTS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(selectedId === c.id ? null : c.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              selectedId === c.id
                ? "border-subject-biology bg-subject-biology text-paper dark:text-chalkboard"
                : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-3 min-h-[4.5rem] text-center">
        {active ? (
          <>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subject-biology">
              {active.roleLabel}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
              {active.description}
            </p>
            {active.relationship ? <RelationshipChain steps={active.relationship} /> : null}
          </>
        ) : (
          <p className="text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
            Click a plant, animal, or part of the environment to see its role in the ecosystem.
          </p>
        )}
      </div>
    </div>
  );
}
