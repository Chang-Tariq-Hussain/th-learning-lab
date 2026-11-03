"use client";

import { cn } from "@/lib/utils";
import { SHELL_MODELS, distribute, shellLabel, shellNotes, type ShellModelId } from "../shells";

interface ShellPanelProps {
  electrons: number;
  model: ShellModelId;
  onModelChange: (model: ShellModelId) => void;
  selectedShell: number | null;
  onSelectShell: (n: number | null) => void;
  /** Latest message about a shell filling, starting or emptying. */
  feedback: string | null;
}

/** Shell occupancy: one row per shell with a fill bar, selectable to highlight that shell in the scene. */
export function ShellPanel({ electrons, model, onModelChange, selectedShell, onSelectShell, feedback }: ShellPanelProps) {
  const d = distribute(electrons, model);
  const notes = shellNotes(electrons, model);
  const arrangement = d.shells.length > 0 ? d.shells.map((s) => s.count).join(", ") : "no electrons";

  return (
    <section aria-label="Electron shells" className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-base font-medium text-ink dark:text-bone">Electron shells</h3>
        <p className="font-mono text-sm text-ink-soft dark:text-bone-soft">Arrangement: {arrangement}</p>
      </div>

      <div role="radiogroup" aria-label="Shell model" className="mt-3 grid gap-2 sm:grid-cols-2">
        {(Object.keys(SHELL_MODELS) as ShellModelId[]).map((id) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={model === id}
            onClick={() => onModelChange(id)}
            className={cn(
              "min-h-11 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
              model === id ? "border-pine-500 bg-pine-50 text-pine-900 dark:border-pine-300 dark:bg-pine-900/20 dark:text-pine-50" : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft",
            )}
          >
            {SHELL_MODELS[id].label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-helper text-ink-soft dark:text-bone-soft">{SHELL_MODELS[d.modelUsed].description}</p>

      {d.shells.length === 0 ? (
        <p className="mt-3 text-sm text-ink-soft dark:text-bone-soft">This ion has no electrons, so there are no shells to show.</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {d.shells.map((s) => {
            const selected = selectedShell === s.n;
            return (
              <li key={s.n}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSelectShell(selected ? null : s.n)}
                  className={cn(
                    "flex min-h-11 w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors",
                    selected ? "border-amber-500 bg-amber-50 dark:bg-amber-500/10" : "border-line hover:border-ink/30 dark:border-line-dark",
                  )}
                >
                  <span className="w-28 shrink-0 text-sm font-medium text-ink dark:text-bone">{shellLabel(s.n)}</span>
                  <span className="relative h-3 flex-1 overflow-hidden rounded-full bg-ink/10 dark:bg-bone/10" aria-hidden="true">
                    <span className={cn("absolute inset-y-0 left-0 rounded-full", s.full ? "bg-emerald-500" : "bg-[#3D5AFE]")} style={{ width: `${(s.count / s.capacity) * 100}%` }} />
                  </span>
                  <span className="w-14 shrink-0 text-right font-mono text-sm text-ink dark:text-bone">
                    {s.count}/{s.capacity}
                  </span>
                  <span className="sr-only">{s.full ? "full" : "not full"}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <p role="status" aria-live="polite" className="mt-3 min-h-5 text-sm text-ink dark:text-bone">
        {feedback}
      </p>
      {notes.map((n) => (
        <p key={n} className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-950 dark:bg-amber-500/10 dark:text-amber-100">
          {n}
        </p>
      ))}
    </section>
  );
}
