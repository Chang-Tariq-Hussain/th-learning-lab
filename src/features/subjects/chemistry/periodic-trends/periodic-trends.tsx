"use client";

import { useState } from "react";
import { Rows3, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ELEMENTS, getElement, type ElementDef, type TrendId } from "./periodic-trends-model";
import { TrendSelector } from "./components/trend-selector";
import { TrendExplanation } from "./components/trend-explanation";
import { PeriodicTableGrid } from "./components/periodic-table-grid";
import { ElementInfoPanel } from "./components/element-info-panel";
import { ComparePanel } from "./components/compare-panel";
import { TrendChallenge } from "./components/trend-challenge";
import { TrendConceptNote } from "./components/trend-concept-note";

const DEFAULT_TREND: TrendId = "atomic-radius";

export function PeriodicTrends() {
  const [trend, setTrend] = useState<TrendId>(DEFAULT_TREND);
  const [selected, setSelected] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareSelection, setCompareSelection] = useState<string[]>([]);

  const selectedElement: ElementDef | null = selected ? getElement(selected) ?? null : null;
  const compareElements = compareSelection.map((s) => getElement(s)!).filter(Boolean);

  const handleSelect = (element: ElementDef) => {
    if (compareMode) {
      setCompareSelection((prev) => {
        if (prev.includes(element.symbol)) return prev.filter((s) => s !== element.symbol);
        if (prev.length >= 2) return [prev[1]!, element.symbol];
        return [...prev, element.symbol];
      });
      return;
    }
    setSelected(element.symbol);
  };

  const handleReset = () => {
    setTrend(DEFAULT_TREND);
    setSelected(null);
    setCompareSelection([]);
    setCompareMode(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TrendSelector trend={trend} onChange={setTrend} />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCompareMode((v) => !v)}
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

      <TrendExplanation trend={trend} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_1fr]">
        {/* Left: table */}
        <div className="flex flex-col gap-3">
          <PeriodicTableGrid
            trend={trend}
            selected={selected}
            compareSelection={compareSelection}
            onSelect={handleSelect}
          />
          {compareMode ? (
            <p className="text-center text-xs text-ink-soft dark:text-bone-soft">
              Tap up to two elements on the table to compare them.
            </p>
          ) : null}
        </div>

        {/* Right: panels */}
        <div className="flex flex-col gap-4">
          {compareMode ? (
            <ComparePanel
              a={compareElements[0] ?? null}
              b={compareElements[1] ?? null}
              onReset={() => setCompareSelection([])}
            />
          ) : (
            <ElementInfoPanel element={selectedElement} trend={trend} />
          )}
          <TrendChallenge trend={trend} />
        </div>
      </div>

      <TrendConceptNote />

      <p className="text-center text-xs text-ink-soft/80 dark:text-bone-soft/80">
        Showing main-group elements ({ELEMENTS.length} total) — transition metals, lanthanides, and actinides are
        left out to keep the trends easy to see.
      </p>
    </div>
  );
}
