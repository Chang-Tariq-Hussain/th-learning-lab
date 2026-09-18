"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { COMPONENT_ORDER, COMPONENTS, RELATIONSHIP_FLOWS, type ComponentId } from "../model";

const HAS_FLOW: ComponentId[] = COMPONENT_ORDER.filter((id) => RELATIONSHIP_FLOWS[id]);

export function RelationshipsPanel() {
  const [selected, setSelected] = useState<ComponentId>("cpu");
  const flow = RELATIONSHIP_FLOWS[selected];

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-ink-soft dark:text-bone-soft">
        Select a component to see its most important relationships — a simplified teaching path, not the complete
        wiring of a real motherboard.
      </p>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Select a component">
        {HAS_FLOW.map((id) => (
          <button
            key={id}
            onClick={() => setSelected(id)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              selected === id
                ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30"
            )}
          >
            {COMPONENTS[id].label}
          </button>
        ))}
      </div>

      {flow && (
        <div className="rounded-card border border-line p-4 dark:border-line-dark">
          <div className="flex flex-col items-center gap-1 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
            {flow.steps.map((step, i) => (
              <div key={`${step}-${i}`} className="flex flex-col items-center gap-1 sm:flex-row sm:gap-3">
                <div className="rounded-full border border-subject-it bg-subject-it-soft px-3 py-1.5 text-center font-mono text-xs text-subject-it dark:bg-subject-it/20">
                  {step}
                </div>
                {i < flow.steps.length - 1 && (
                  <span className="text-ink-soft dark:text-bone-soft" aria-hidden>
                    <span className="hidden sm:inline">→</span>
                    <span className="sm:hidden">↓</span>
                  </span>
                )}
              </div>
            ))}
          </div>
          {flow.caveat && <p className="mt-4 text-xs text-ink-soft dark:text-bone-soft">{flow.caveat}</p>}
        </div>
      )}
    </div>
  );
}
