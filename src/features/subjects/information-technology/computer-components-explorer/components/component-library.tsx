"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CATEGORY_ORDER, componentsByCategory, type ComponentId } from "../model";
import { InspectorPanel } from "./inspector-panel";
import type { DetailLevel } from "../model";

export function ComponentLibrary({ detailLevel }: { detailLevel: DetailLevel }) {
  const [selected, setSelected] = useState<ComponentId | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-ink-soft dark:text-bone-soft">
        Every component organized by category. Not every real computer contains every component listed here — click
        any card for a plain-language explanation.
      </p>

      {CATEGORY_ORDER.map((category) => {
        const items = componentsByCategory(category);
        if (items.length === 0) return null;
        return (
          <div key={category}>
            <p className="font-mono text-xs uppercase tracking-wide text-subject-it">{category}</p>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {items.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  className={cn(
                    "rounded-card border px-3 py-2 text-left text-sm transition-colors",
                    selected === c.id
                      ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                      : "border-line text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40"
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      <InspectorPanel id={selected} detailLevel={detailLevel} />
    </div>
  );
}
