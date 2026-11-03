"use client";

import { cn } from "@/lib/utils";
import { PRESETS, PRESET_GROUPS, type AtomPreset } from "../presets";
import type { AtomState } from "../atom-model";

interface PresetPickerProps {
  atom: AtomState;
  onLoad: (preset: AtomPreset) => void;
  activeId: string | null;
}

/** Preset atoms, isotopes and ions. Loading one replaces the atom; the note under the chips says what to look at. */
export function PresetPicker({ atom, onLoad, activeId }: PresetPickerProps) {
  const active = PRESETS.find((p) => p.id === activeId && p.atom.protons === atom.protons && p.atom.neutrons === atom.neutrons && p.atom.electrons === atom.electrons) ?? null;
  return (
    <section aria-label="Presets" className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <h3 className="font-display text-base font-medium text-ink dark:text-bone">Load a preset</h3>
      <div className="mt-3 flex flex-col gap-3">
        {PRESET_GROUPS.map((group) => (
          <div key={group}>
            <p className="font-mono text-label uppercase tracking-wide text-ink-soft dark:text-bone-soft">{group}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5" role="group" aria-label={group}>
              {PRESETS.filter((p) => p.group === group).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={active?.id === p.id}
                  onClick={() => onLoad(p)}
                  className={cn(
                    "min-h-11 rounded-full border px-3 text-sm font-medium transition-colors",
                    active?.id === p.id ? "border-pine-500 bg-pine-600 text-paper dark:border-pine-300 dark:bg-pine-300 dark:text-chalkboard" : "border-line text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone",
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p role="status" aria-live="polite" className="mt-3 min-h-5 text-sm text-ink-soft dark:text-bone-soft">
        {active ? active.note : ""}
      </p>
    </section>
  );
}
