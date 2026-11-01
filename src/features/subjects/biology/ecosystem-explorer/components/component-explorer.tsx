"use client";

import { cn } from "@/lib/utils";
import { COMPONENTS, componentById } from "../ecosystem-model";
import type { ComponentId } from "../types";
import { RelationshipChain } from "./relationship-chain";

/** One-line name of the selected part, kept next to the scene. */
export function ComponentTitle({ selectedId }: { selectedId: ComponentId | null }) {
  const active = selectedId ? componentById(selectedId) : null;
  return (
    <p className="truncate text-center font-display text-base font-medium text-ink dark:text-bone">
      {active ? `${active.label} · ${active.roleLabel}` : "Tap a part of the scene"}
    </p>
  );
}

export function ComponentDetails({ selectedId }: { selectedId: ComponentId | null }) {
  const active = selectedId ? componentById(selectedId) : null;
  return (
    <div className="min-h-[4.5rem] text-center">
      {active ? (
        <>
          <p className="font-mono text-label uppercase tracking-[0.2em] text-subject-biology">{active.roleLabel}</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{active.description}</p>
          {active.relationship ? <RelationshipChain steps={active.relationship} /> : null}
        </>
      ) : (
        <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          Click a plant, animal, or part of the environment to see its role in the ecosystem.
        </p>
      )}
    </div>
  );
}

export function ComponentChips({ selectedId, onSelect }: { selectedId: ComponentId | null; onSelect: (id: ComponentId | null) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {COMPONENTS.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onSelect(selectedId === c.id ? null : c.id)}
          aria-pressed={selectedId === c.id}
          className={cn(
            "min-h-11 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
            selectedId === c.id
              ? "border-subject-biology bg-subject-biology text-paper dark:text-chalkboard"
              : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone",
          )}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
