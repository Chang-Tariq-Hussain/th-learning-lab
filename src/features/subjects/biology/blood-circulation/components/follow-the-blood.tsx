"use client";

import { cn } from "@/lib/utils";
import { ROUTE_STAGES } from "../circulation-model";

interface FollowTheBloodProps {
  activeId: string | null;
  onSelect: (id: string | null) => void;
}

export function FollowTheBlood({ activeId, onSelect }: FollowTheBloodProps) {
  const active = ROUTE_STAGES.find((s) => s.id === activeId) ?? null;

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">Follow the Blood</p>

      <ol className="mt-3 flex flex-col items-center gap-0.5">
        {ROUTE_STAGES.map((stage, i) => (
          <li key={`${stage.id}-${i}`} className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => onSelect(activeId === stage.id ? null : stage.id)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                activeId === stage.id
                  ? "border-subject-biology bg-subject-biology text-paper dark:text-chalkboard"
                  : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone"
              )}
            >
              {stage.label}
            </button>
            {i < ROUTE_STAGES.length - 1 ? <span className="my-0.5 text-ink-soft/40 dark:text-bone-soft/40">↓</span> : null}
          </li>
        ))}
      </ol>

      <p className="mt-3 min-h-[2.5rem] text-center text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
        {active ? active.caption : "Click a stage to highlight it on the diagram."}
      </p>
    </div>
  );
}
