"use client";

import { useState } from "react";
import { Rows3, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getSubstance, type Substance } from "./acids-bases-model";
import { SubstancePicker } from "./components/substance-picker";
import { PhScale } from "./components/ph-scale";
import { SubstanceInfoPanel } from "./components/substance-info-panel";
import { ComparePanel } from "./components/compare-panel";
import { LearnPanel } from "./components/learn-panel";

export function AcidsBasesBasics() {
  const [selected, setSelected] = useState<string[]>([]);
  const [compareMode, setCompareMode] = useState(false);

  const selectedSubstances = selected.map((slug) => getSubstance(slug)!).filter(Boolean);
  const primary: Substance | null = selectedSubstances[0] ?? null;

  const handleSelect = (substance: Substance) => {
    if (compareMode) {
      setSelected((prev) => {
        if (prev.includes(substance.slug)) return prev.filter((s) => s !== substance.slug);
        if (prev.length >= 2) return [prev[1]!, substance.slug];
        return [...prev, substance.slug];
      });
      return;
    }
    setSelected([substance.slug]);
  };

  const handleReset = () => {
    setSelected([]);
    setCompareMode(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SubstancePicker selected={selected} compareMode={compareMode} onSelect={handleSelect} />
        <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setCompareMode((v) => !v);
              setSelected([]);
            }}
            aria-pressed={compareMode}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              compareMode
                ? "border-pine-500 bg-pine-600 text-paper dark:border-pine-300 dark:bg-pine-300 dark:text-chalkboard"
                : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone"
            )}
          >
            <Rows3 className="h-3.5 w-3.5" strokeWidth={1.75} />
            Compare
          </button>
          <Button variant="secondary" size="sm" onClick={handleReset}>
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
            Reset
          </Button>
        </div>
      </div>

      {/* Scale + result */}
      {!compareMode ? (
        <div className="rounded-card border border-line bg-white/40 p-4 dark:border-line-dark dark:bg-white/[0.02] sm:p-6">
          <PhScale markers={primary ? [{ substance: primary, label: primary.name }] : []} />
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {compareMode ? (
          <div className="lg:col-span-2">
            <ComparePanel a={selectedSubstances[0] ?? null} b={selectedSubstances[1] ?? null} />
          </div>
        ) : (
          <div className="lg:col-span-2">
            <SubstanceInfoPanel substance={primary} />
          </div>
        )}
      </div>

      <LearnPanel />
    </div>
  );
}
