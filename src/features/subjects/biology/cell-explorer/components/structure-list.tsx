"use client";

import { cn } from "@/lib/utils";
import { organellesFor, PRESENCE_SHORT } from "../data/organelles";
import type { CellKind } from "../types";
import { OrganelleGlyph } from "./organelle-glyph";

export interface StructureListProps {
  kind: CellKind;
  selectedId: string | null;
  /** When given, each item is a button that selects the structure (a keyboard-friendly alternative to clicking the diagram). Otherwise the list is a plain legend. */
  onSelect?: (id: string) => void;
}

/** Legend of every structure in the current cell: shape icon + colour + name. Doubles as an accessible way to choose a structure. */
export function StructureList({ kind, selectedId, onSelect }: StructureListProps) {
  const items = organellesFor(kind);
  return (
    <section aria-label={`Structures in the ${kind} cell`}>
      <h3 className="mb-2 font-mono text-label uppercase tracking-eyebrow text-ink-soft dark:text-bone-soft">
        Legend · {items.length} structures{onSelect ? " (select one)" : ""}
      </h3>
      <ul className="grid grid-cols-1 gap-1.5 min-[420px]:grid-cols-2">
        {items.map((o) => {
          const on = selectedId === o.id;
          const content = (
            <>
              <OrganelleGlyph id={o.id} />
              <span className="min-w-0 flex-1 text-left leading-tight">
                {o.name}
                {o.presence !== "both" ? <span className="block text-helper text-ink-soft dark:text-bone-soft">{PRESENCE_SHORT[o.presence]}</span> : null}
              </span>
            </>
          );
          const base = "flex min-h-11 w-full items-center gap-2 rounded-xl border px-2.5 py-1.5 text-sm";
          return (
            <li key={o.id}>
              {onSelect ? (
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => onSelect(o.id)}
                  data-legend-id={o.id}
                  className={cn(
                    base,
                    "text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink dark:text-bone dark:focus-visible:outline-bone",
                    on ? "border-subject-biology bg-subject-biology-soft font-medium dark:bg-subject-biology/15" : "border-line bg-white/60 hover:bg-ink/[0.04] dark:border-line-dark dark:bg-white/[0.03] dark:hover:bg-bone/[0.06]",
                  )}
                >
                  {content}
                </button>
              ) : (
                <div className={cn(base, "border-line bg-white/60 text-ink dark:border-line-dark dark:bg-white/[0.03] dark:text-bone")}>{content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
