"use client";

import { COMPONENTS, type ComponentId, type DetailLevel } from "../model";

export function InspectorPanel({ id, detailLevel }: { id: ComponentId | null; detailLevel: DetailLevel }) {
  if (!id) {
    return (
      <div className="rounded-card border border-dashed border-line p-4 text-sm text-ink-soft dark:border-line-dark dark:text-bone-soft">
        Click or tap any part of the motherboard to inspect it here.
      </div>
    );
  }

  const def = COMPONENTS[id];

  return (
    <div className="rounded-card border border-line p-4 dark:border-line-dark">
      <p className="font-mono text-xs uppercase tracking-wide text-subject-it">{def.category} · {def.label}</p>

      <div className="mt-2 space-y-2 text-sm leading-relaxed text-ink dark:text-bone">
        <p>
          <span className="font-semibold">What it is: </span>
          {def.whatItIs}
        </p>
        <p>
          <span className="font-semibold">Main role: </span>
          {def.mainRole}
        </p>

        {detailLevel !== "beginner" && (
          <p>
            <span className="font-semibold">Connected to: </span>
            {def.connectedTo.map((c) => COMPONENTS[c].label).join(", ")}
          </p>
        )}

        <p>
          <span className="font-semibold">Key concepts: </span>
          {def.keyConcepts.join(", ")}
        </p>

        {detailLevel === "technical" && def.technicalExample && (
          <div className="mt-2 rounded-md border border-line/70 bg-paper/60 p-2 dark:border-line-dark/70 dark:bg-chalkboard/60">
            <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
              Educational example values
            </p>
            <ul className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs">
              {def.technicalExample.map((row) => (
                <li key={row.label} className="flex justify-between gap-2">
                  <span className="text-ink-soft dark:text-bone-soft">{row.label}</span>
                  <span className="font-mono">{row.value}</span>
                </li>
              ))}
            </ul>
            <p className="mt-1 text-[10px] text-ink-soft dark:text-bone-soft">
              Simulated example values — not a reading of your actual device.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
