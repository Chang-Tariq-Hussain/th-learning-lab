"use client";

import { cn } from "@/lib/utils";
import { ROLE_MESSAGES } from "../ecosystem-model";
import type { ExploreRoleId } from "../types";

interface RolePickerProps {
  active: ExploreRoleId | null;
  onSelect: (id: ExploreRoleId | null) => void;
}

const IDS: ExploreRoleId[] = ["producer", "consumer", "decomposer"];

export function RolePicker({ active, onSelect }: RolePickerProps) {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
        Explore Roles
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(active === id ? null : id)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              active === id
                ? "border-subject-biology bg-subject-biology text-paper dark:text-chalkboard"
                : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone",
            )}
          >
            {ROLE_MESSAGES[id].label}
          </button>
        ))}
      </div>
      <p className="mt-3 min-h-[2.5rem] text-center text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
        {active ? ROLE_MESSAGES[active].caption : "Select a role to highlight matching components on the scene."}
      </p>
    </div>
  );
}
