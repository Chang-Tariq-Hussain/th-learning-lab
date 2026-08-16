"use client";

import { useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SortItem } from "../statistics-model";

export interface SortBinDef<Bin extends string> {
  id: Bin;
  label: string;
  description: string;
}

export interface SortActivityProps<Bin extends string> {
  items: SortItem<Bin>[];
  bins: [SortBinDef<Bin>, SortBinDef<Bin>];
  title: string;
}

/**
 * Tap-to-sort activity shared by Level 3 (Categorical vs Numerical)
 * and Level 4 (Discrete vs Continuous). Tapping a card selects it, then
 * tapping a bin places it — a click-only interaction (no native drag)
 * so it works the same with mouse or touch, per the brief's mobile
 * requirement.
 */
export function SortActivity<Bin extends string>({ items, bins, title }: SortActivityProps<Bin>) {
  const [placements, setPlacements] = useState<Record<string, Bin>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);

  const unsorted = items.filter((item) => !(item.id in placements));
  const correctCount = Object.entries(placements).filter(
    ([id, bin]) => items.find((i) => i.id === id)?.correctBin === bin,
  ).length;
  const allSorted = unsorted.length === 0;

  const handlePlace = (bin: Bin) => {
    if (!selectedId) return;
    const item = items.find((i) => i.id === selectedId);
    if (!item) return;

    if (item.correctBin === bin) {
      setPlacements((prev) => ({ ...prev, [selectedId]: bin }));
      setSelectedId(null);
    } else {
      setWrongFlash(selectedId);
      setTimeout(() => setWrongFlash(null), 500);
    }
  };

  const handleReset = () => {
    setPlacements({});
    setSelectedId(null);
    setWrongFlash(null);
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-5">
      <p className="text-center text-sm text-ink-soft dark:text-bone-soft">
        {title} — tap a card, then tap the bin it belongs in.
      </p>

      <div className="flex min-h-[52px] flex-wrap justify-center gap-2">
        {unsorted.length > 0 ? (
          unsorted.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId((cur) => (cur === item.id ? null : item.id))}
              aria-pressed={selectedId === item.id}
              className={cn(
                "rounded-card border px-3.5 py-2 text-sm font-medium transition-all",
                selectedId === item.id
                  ? "border-subject-math bg-subject-math-soft text-subject-math shadow-sm dark:bg-subject-math/15"
                  : "border-line text-ink hover:border-ink/30 dark:border-line-dark dark:text-bone dark:hover:border-bone/30",
                wrongFlash === item.id && "animate-pulse border-rose-500 bg-rose-50 text-rose-700 dark:border-rose-400 dark:bg-rose-900/20 dark:text-rose-300",
              )}
            >
              {item.label}
            </button>
          ))
        ) : (
          <p className="rounded-card border border-pine-500/40 bg-pine-50 px-4 py-2 text-sm text-pine-700 dark:border-pine-300/30 dark:bg-pine-900/20 dark:text-pine-300">
            All sorted! {correctCount} of {items.length} correct on the first try.
          </p>
        )}
      </div>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {bins.map((bin) => {
          const binItems = items.filter((item) => placements[item.id] === bin.id);
          return (
            <button
              key={bin.id}
              type="button"
              onClick={() => handlePlace(bin.id)}
              disabled={!selectedId}
              className={cn(
                "flex min-h-[140px] flex-col gap-2 rounded-card border-2 border-dashed p-4 text-left transition-colors",
                selectedId
                  ? "border-subject-math/50 hover:border-subject-math hover:bg-subject-math-soft/40 dark:hover:bg-subject-math/10"
                  : "border-line dark:border-line-dark",
              )}
            >
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-ink dark:text-bone">
                {bin.label}
              </p>
              <p className="text-xs text-ink-soft dark:text-bone-soft">{bin.description}</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {binItems.map((item) => (
                  <span
                    key={item.id}
                    className="flex items-center gap-1 rounded-full border border-pine-500/40 bg-pine-50 px-2.5 py-1 text-xs text-pine-700 dark:border-pine-300/30 dark:bg-pine-900/20 dark:text-pine-300"
                  >
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                    {item.label}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {wrongFlash ? (
        <p className="flex items-center gap-1.5 text-sm text-rose-600 dark:text-rose-400">
          <X className="h-4 w-4" strokeWidth={2.5} /> Not quite — try the other bin.
        </p>
      ) : null}

      {allSorted ? (
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
          Sort Again
        </Button>
      ) : null}
    </div>
  );
}
