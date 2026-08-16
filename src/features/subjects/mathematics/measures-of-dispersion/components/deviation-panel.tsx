"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ValueNumberLine } from "../../central-tendency/components/value-number-line";
import {
  DEVIATION_DATASET_MAX_SIZE,
  DEVIATION_DATASET_MIN_SIZE,
  DEVIATION_STARTER_DATASET,
  DEVIATION_VALUE_MAX,
  DEVIATION_VALUE_MIN,
  deviations,
  formatNumber,
  mean,
} from "../dispersion-model";

/**
 * Level 2 — Deviation from the Mean. An editable dataset (folding in
 * Section 8's "drag a point, watch it update" spec — steppable cards
 * rather than pointer-drag, matching Central Tendency's Level 1
 * editor) with a deviation ladder below the number line: one row per
 * value showing its signed distance from the mean as a colored bar.
 */
export function DeviationPanel() {
  const [values, setValues] = useState<number[]>(DEVIATION_STARTER_DATASET);

  const updateAt = (index: number, next: number) => {
    setValues((prev) => prev.map((v, i) => (i === index ? Math.min(DEVIATION_VALUE_MAX, Math.max(DEVIATION_VALUE_MIN, next)) : v)));
  };
  const removeAt = (index: number) => {
    setValues((prev) => (prev.length <= DEVIATION_DATASET_MIN_SIZE ? prev : prev.filter((_, i) => i !== index)));
  };
  const addValue = () => {
    setValues((prev) => (prev.length >= DEVIATION_DATASET_MAX_SIZE ? prev : [...prev, Math.round(mean(prev))]));
  };
  const handleReset = () => setValues(DEVIATION_STARTER_DATASET);

  const m = mean(values);
  const devs = deviations(values, m);
  const maxAbsDev = Math.max(1, ...devs.map((d) => Math.abs(d)));

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <p className="text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Nudge a value and watch its distance from the mean — its <span className="font-semibold text-ink dark:text-bone">deviation</span> —
        update immediately.
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {values.map((v, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 rounded-card border border-line bg-white/60 px-2.5 py-1.5 dark:border-line-dark dark:bg-white/[0.03]"
          >
            <span className="min-w-[1.5rem] text-center font-mono text-sm font-semibold text-ink dark:text-bone">{v}</span>
            <div className="flex flex-col">
              <button type="button" aria-label={`Increase value ${i + 1}`} onClick={() => updateAt(i, v + 1)} className="text-ink-soft hover:text-subject-math dark:text-bone-soft">
                <ChevronUp className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
              <button type="button" aria-label={`Decrease value ${i + 1}`} onClick={() => updateAt(i, v - 1)} className="text-ink-soft hover:text-subject-math dark:text-bone-soft">
                <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </div>
            <button
              type="button"
              aria-label={`Remove value ${i + 1}`}
              onClick={() => removeAt(i)}
              disabled={values.length <= DEVIATION_DATASET_MIN_SIZE}
              className="ml-0.5 text-ink-soft/60 hover:text-rose-500 disabled:pointer-events-none disabled:opacity-30 dark:text-bone-soft/60"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addValue}
          disabled={values.length >= DEVIATION_DATASET_MAX_SIZE}
          className={cn(
            "flex items-center gap-1 rounded-card border border-dashed border-line px-3 py-1.5 text-sm text-ink-soft transition-colors dark:border-line-dark dark:text-bone-soft",
            values.length < DEVIATION_DATASET_MAX_SIZE && "hover:border-subject-math hover:text-subject-math",
            values.length >= DEVIATION_DATASET_MAX_SIZE && "opacity-40",
          )}
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          Add
        </button>
      </div>

      <ValueNumberLine values={values} markers={[{ value: m, label: "Mean", color: "#3D5AFE" }]} />

      <div className="flex flex-col gap-2">
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">
          Deviations from the mean
        </p>
        {values.map((v, i) => {
          const d = devs[i]!;
          const isPositive = d >= 0;
          const widthPct = (Math.abs(d) / maxAbsDev) * 100;
          return (
            <div key={i} className="flex items-center gap-3">
              <span className="w-10 shrink-0 text-right font-mono text-sm text-ink dark:text-bone">{v}</span>
              <div className="relative h-3 flex-1 rounded-full bg-ink/5 dark:bg-bone/10">
                <div
                  className={cn("absolute top-0 h-3 rounded-full transition-all duration-300", isPositive ? "left-1/2 bg-[#3D5AFE]" : "right-1/2 bg-[#E0524F]")}
                  style={{ width: `${widthPct / 2}%` }}
                />
                <div className="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-ink/25 dark:bg-bone/30" />
              </div>
              <span className={cn("w-14 shrink-0 font-mono text-sm", isPositive ? "text-[#3D5AFE]" : "text-[#E0524F]")}>
                {isPositive ? "+" : ""}
                {formatNumber(d)}
              </span>
            </div>
          );
        })}
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
