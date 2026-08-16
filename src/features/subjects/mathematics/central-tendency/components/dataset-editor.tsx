"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ValueNumberLine } from "./value-number-line";
import {
  DATASET_MAX_SIZE,
  DATASET_MIN_SIZE,
  STARTER_DATASET,
  VALUE_MAX,
  VALUE_MIN,
  formatNumber,
  mean,
  median,
  modes,
  range,
} from "../central-tendency-model";

const STAT_CARDS = [
  { id: "mean", label: "Mean", color: "#3D5AFE" },
  { id: "median", label: "Median", color: "#E8B923" },
  { id: "mode", label: "Mode", color: "#2E9E6C" },
  { id: "range", label: "Range", color: "#E0524F" },
] as const;

/**
 * Level 1 — Understanding the Center. A small editable dataset (Section
 * 1) doubles as the always-on "Statistics Dashboard" (Section 10) and
 * dataset editor (Section 11): every card is steppable in place, values
 * can be added/removed within a 3–12 range, and all four measures plus
 * the number line update immediately from the same state.
 */
export function DatasetEditor() {
  const [values, setValues] = useState<number[]>(STARTER_DATASET);

  const updateAt = (index: number, next: number) => {
    setValues((prev) => prev.map((v, i) => (i === index ? Math.min(VALUE_MAX, Math.max(VALUE_MIN, next)) : v)));
  };
  const removeAt = (index: number) => {
    setValues((prev) => (prev.length <= DATASET_MIN_SIZE ? prev : prev.filter((_, i) => i !== index)));
  };
  const addValue = () => {
    setValues((prev) => (prev.length >= DATASET_MAX_SIZE ? prev : [...prev, mean(prev) ? Math.round(mean(prev)) : 5]));
  };
  const handleReset = () => setValues(STARTER_DATASET);

  const modeValues = modes(values);
  const modeLabel = modeValues.length === 0 ? "No mode" : modeValues.map(formatNumber).join(", ");

  const statValue: Record<(typeof STAT_CARDS)[number]["id"], string> = {
    mean: formatNumber(mean(values)),
    median: formatNumber(median(values)),
    mode: modeLabel,
    range: formatNumber(range(values)),
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <p className="text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        This is your dataset. Nudge a value up or down, add or remove a card, and watch every measure recalculate.
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {values.map((v, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 rounded-card border border-line bg-white/60 px-2.5 py-1.5 dark:border-line-dark dark:bg-white/[0.03]"
          >
            <span className="min-w-[1.5rem] text-center font-mono text-sm font-semibold text-ink dark:text-bone">{v}</span>
            <div className="flex flex-col">
              <button
                type="button"
                aria-label={`Increase value ${i + 1}`}
                onClick={() => updateAt(i, v + 1)}
                className="text-ink-soft hover:text-subject-math dark:text-bone-soft"
              >
                <ChevronUp className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
              <button
                type="button"
                aria-label={`Decrease value ${i + 1}`}
                onClick={() => updateAt(i, v - 1)}
                className="text-ink-soft hover:text-subject-math dark:text-bone-soft"
              >
                <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </div>
            <button
              type="button"
              aria-label={`Remove value ${i + 1}`}
              onClick={() => removeAt(i)}
              disabled={values.length <= DATASET_MIN_SIZE}
              className="ml-0.5 text-ink-soft/60 hover:text-rose-500 disabled:pointer-events-none disabled:opacity-30 dark:text-bone-soft/60"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addValue}
          disabled={values.length >= DATASET_MAX_SIZE}
          className={cn(
            "flex items-center gap-1 rounded-card border border-dashed border-line px-3 py-1.5 text-sm text-ink-soft transition-colors dark:border-line-dark dark:text-bone-soft",
            values.length < DATASET_MAX_SIZE && "hover:border-subject-math hover:text-subject-math",
            values.length >= DATASET_MAX_SIZE && "opacity-40",
          )}
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          Add
        </button>
      </div>

      <ValueNumberLine values={values} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STAT_CARDS.map((card) => (
          <div key={card.id} className="flex flex-col items-center gap-1 rounded-card border border-line bg-white/60 px-3 py-3 text-center dark:border-line-dark dark:bg-white/[0.03]">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">{card.label}</p>
            <p className="font-display text-lg font-medium" style={{ color: card.color }}>
              {statValue[card.id]}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
          Reset Dataset
        </Button>
      </div>
    </div>
  );
}
