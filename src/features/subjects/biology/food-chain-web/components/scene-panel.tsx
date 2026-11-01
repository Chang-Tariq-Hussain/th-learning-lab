"use client";

import { cn } from "@/lib/utils";
import { ORGANISMS, organismById } from "../food-web-model";
import type { Mode, OrganismId } from "../types";

interface OrganismPickerProps {
  mode: Mode;
  selectedId: OrganismId | null;
  onSelect: (id: OrganismId | null) => void;
}

const SELECTABLE = ORGANISMS.filter((o) => o.id !== "fungi");

/**
 * The text and buttons that go with the grassland scene: what the scene shows, a button per organism (the keyboard
 * and touch alternative to clicking the picture) and the selected organism's role. The scene itself is the
 * SimulationLayout stage, so it stays on screen while these are used.
 */
export function OrganismPicker({ mode, selectedId, onSelect }: OrganismPickerProps) {
  const active = selectedId ? organismById(selectedId) : null;
  const caption =
    active && mode === "web" && active.webCaption ? active.webCaption : active?.description;

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-label uppercase tracking-[0.2em] text-subject-biology">
        {mode === "chain" ? "Grassland — Food Chain" : "Grassland — Food Web"}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
        {mode === "chain"
          ? "Energy from the Sun enters the ecosystem through producers and moves through consumers. Arrows show where energy moves to."
          : "Several food chains overlap here. Click an organism to see the energy pathways connected to it."}
      </p>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {SELECTABLE.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onSelect(selectedId === o.id ? null : o.id)}
            aria-pressed={selectedId === o.id}
            className={cn(
              "min-h-11 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors lg:min-h-0",
              selectedId === o.id
                ? "border-subject-biology bg-subject-biology text-paper dark:text-chalkboard"
                : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="mt-3 min-h-[4.5rem] text-center">
        {active ? (
          <>
            <p className="font-mono text-label uppercase tracking-[0.2em] text-subject-biology">
              {active.roleLabel}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
              {caption}
            </p>
          </>
        ) : (
          <p className="text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
            Click an organism to see its role in the {mode === "chain" ? "food chain" : "food web"}.
          </p>
        )}
      </div>
    </div>
  );
}
