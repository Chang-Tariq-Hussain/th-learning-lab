"use client";

import { cn } from "@/lib/utils";
import { ACID_COLOR, BASE_COLOR, PAIRS, type ConjugatePair } from "../model";

interface PairPickerProps {
  selectedPairSlug: string | null;
  selectedMember: "acid" | "base" | null;
  onSelect: (pair: ConjugatePair, member: "acid" | "base") => void;
}

/** Every pair, both members clickable. Clicking either member selects the whole pair — the conjugate partner lights up automatically in the diagram below. */
export function PairPicker({ selectedPairSlug, selectedMember, onSelect }: PairPickerProps) {
  return (
    <div role="group" aria-label="Choose a conjugate pair" className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {PAIRS.map((pair) => {
        const isActivePair = pair.slug === selectedPairSlug;
        return (
          <div
            key={pair.slug}
            className={cn(
              "flex items-center justify-center gap-2 rounded-card border p-3 transition-colors",
              "border-line dark:border-line-dark",
              isActivePair ? "bg-white dark:bg-white/[0.06]" : "bg-white/40 dark:bg-white/[0.02]",
            )}
          >
            <MemberButton
              formula={pair.acid}
              color={ACID_COLOR}
              isSelected={isActivePair && selectedMember === "acid"}
              onClick={() => onSelect(pair, "acid")}
            />
            <span className="text-ink-soft/50 dark:text-bone-soft/40">/</span>
            <MemberButton
              formula={pair.conjugateBase}
              color={BASE_COLOR}
              isSelected={isActivePair && selectedMember === "base"}
              onClick={() => onSelect(pair, "base")}
            />
          </div>
        );
      })}
    </div>
  );
}

function MemberButton({ formula, color, isSelected, onClick }: { formula: string; color: string; isSelected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className="rounded-full border-2 px-3 py-1 font-mono text-sm font-semibold transition-colors"
      style={{
        borderColor: color,
        color: isSelected ? "#FFFBF6" : color,
        background: isSelected ? color : "transparent",
      }}
    >
      {formula}
    </button>
  );
}
