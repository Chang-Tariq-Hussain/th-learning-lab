"use client";

import { getAnyComponentDef, type ComponentId, type PhysicalComponentId } from "../model";

export function InspectPanel({ id }: { id: ComponentId | PhysicalComponentId | null }) {
  if (!id) return null;
  const def = getAnyComponentDef(id);
  return (
    <div className="rounded-card border border-line p-4 dark:border-line-dark">
      <p className="font-mono text-xs uppercase tracking-wide text-subject-it">
        {def.group} · {def.label}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-ink dark:text-bone">{def.description}</p>
    </div>
  );
}
