"use client";

import { cn } from "@/lib/utils";
import { ION_COLOR, type IonKind } from "../arrhenius-model";
import { IonCloud } from "./ion-cloud";

interface DissociationContainerProps {
  role: "acid" | "base";
  formula: string;
  featuredIon: IonKind;
  spectatorLabel: string;
  dose: number;
  active: boolean;
}

const ROLE_LABEL: Record<"acid" | "base", string> = { acid: "ACID", base: "BASE" };

/** One side of the two-container view — "HCl + H₂O" (or "NaOH + H₂O") splitting into its ions, with a simple particle cloud showing how much of the featured ion is present. */
export function DissociationContainer({ role, formula, featuredIon, spectatorLabel, dose, active }: DissociationContainerProps) {
  const color = ION_COLOR[featuredIon];

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-card border p-4 transition-colors sm:p-5",
        active ? "border-transparent bg-white dark:bg-white/[0.06]" : "border-line bg-white/40 dark:border-line-dark dark:bg-white/[0.02]",
      )}
      style={active ? { boxShadow: `0 0 0 2px ${color}` } : undefined}
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color }}>
          {ROLE_LABEL[role]}
        </p>
      </div>

      <p className="font-display text-lg font-medium text-ink dark:text-bone">
        {formula} + H₂O <span className="text-ink-soft dark:text-bone-soft">&rarr;</span>
      </p>

      <IonCloud featuredIon={featuredIon} spectatorLabel={spectatorLabel} dose={dose} />

      <p className="text-center font-mono text-xs text-ink-soft dark:text-bone-soft">
        {dose} &times; <span style={{ color }}>{featuredIon === "h-plus" ? "H⁺" : "OH⁻"}</span> · {dose} &times; {spectatorLabel}
      </p>
    </div>
  );
}
