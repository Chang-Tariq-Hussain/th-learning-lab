"use client";

import { cn } from "@/lib/utils";
import { ACCESSORY_ORGANS } from "../digestive-model";
import type { AccessoryOrganId } from "../types";

interface AccessoryOrgansProps {
  activeId: AccessoryOrganId | null;
  onSelect: (id: AccessoryOrganId | null) => void;
}

export function AccessoryOrgans({ activeId, onSelect }: AccessoryOrgansProps) {
  const active = ACCESSORY_ORGANS.find((o) => o.id === activeId) ?? null;

  return (
    <div className="rounded-card border border-dashed border-subject-biology/40 bg-white/60 p-4 dark:bg-white/[0.03]">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
          Accessory Organs
        </p>
        <p className="text-[11px] text-ink-soft dark:text-bone-soft">
          Food does not pass through these organs
        </p>
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {ACCESSORY_ORGANS.map((organ) => (
          <button
            key={organ.id}
            type="button"
            onClick={() => onSelect(activeId === organ.id ? null : organ.id)}
            className={cn(
              "rounded-full border border-dashed px-3.5 py-1.5 text-sm font-medium transition-colors",
              activeId === organ.id
                ? "border-subject-biology bg-subject-biology text-paper dark:text-chalkboard"
                : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone",
            )}
          >
            {organ.label}
          </button>
        ))}
      </div>

      <p className="mt-3 min-h-[3rem] text-center text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
        {active ? (
          <>
            <span className="font-semibold text-ink dark:text-bone">
              {active.function}
            </span>{" "}
            {active.explanation}
          </>
        ) : (
          "Click an organ to see how it supports digestion."
        )}
      </p>
    </div>
  );
}
