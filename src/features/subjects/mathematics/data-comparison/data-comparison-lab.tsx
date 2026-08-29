"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PairPicker } from "./components/pair-picker";
import { StatCard } from "./components/stat-card";
import { DualBarChart } from "./components/dual-bar-chart";
import { COMPARISON_PRESETS, computeStats, moreConsistent, formatNumber } from "./data-comparison-model";

const VALUE_MIN = 0;
const VALUE_MAX = 100;

/**
 * Data Comparison Lab — Mathematics Batch 4 topic 6 of 6 (Statistics
 * & Data), the application-focused capstone of the batch. Three
 * ready-made dataset pairs (two classes' test scores, two cities'
 * rainfall, two players' points per game) shown side by side with
 * every statistic — mean, median, range, min, max — computed for
 * both at once, plus a shared-scale bar chart so spread is visible,
 * not just calculable.
 *
 * The point of this topic is answering "what does the data tell us,"
 * not just "what calculation can we perform" — so alongside the raw
 * numbers, the lab highlights which dataset is more *consistent*
 * (smaller range) directly on the stat cards, modeling the kind of
 * comparison-and-conclusion reasoning the Challenge section asks
 * students to do themselves.
 *
 * Reuses `mean`/`median`/`range` from Central Tendency
 * (`data-comparison-model.ts`) rather than reimplementing them,
 * matching the precedent Measures of Dispersion already set.
 */
export function DataComparisonLab() {
  const [pairsState, setPairsState] = useState(() =>
    Object.fromEntries(COMPARISON_PRESETS.map((p) => [p.id, { a: p.a.values, b: p.b.values }]))
  );
  const [activePairId, setActivePairId] = useState(COMPARISON_PRESETS[0]!.id);

  const activePreset = COMPARISON_PRESETS.find((p) => p.id === activePairId) ?? COMPARISON_PRESETS[0]!;
  const currentValues = pairsState[activePairId] ?? { a: activePreset.a.values, b: activePreset.b.values };

  const datasetA = { ...activePreset.a, values: currentValues.a };
  const datasetB = { ...activePreset.b, values: currentValues.b };

  const statsA = useMemo(() => computeStats(datasetA.values), [datasetA.values]);
  const statsB = useMemo(() => computeStats(datasetB.values), [datasetB.values]);
  const consistent = moreConsistent(statsA, statsB);

  const updateValue = (side: "a" | "b", index: number, next: number) => {
    setPairsState((prev) => {
      const pair = prev[activePairId] ?? currentValues;
      const nextValues = pair[side].map((v, i) => (i === index ? Math.min(VALUE_MAX, Math.max(VALUE_MIN, next)) : v));
      return { ...prev, [activePairId]: { ...pair, [side]: nextValues } };
    });
  };

  const resetPair = () => {
    setPairsState((prev) => ({ ...prev, [activePairId]: { a: activePreset.a.values, b: activePreset.b.values } }));
  };

  const editableRow = (side: "a" | "b", dataset: typeof datasetA) => (
    <div className="flex flex-wrap justify-center gap-1.5">
      {dataset.values.map((v, i) => (
        <div key={i} className="flex items-center gap-0.5 rounded-lg border border-ink/10 bg-white px-1 py-0.5 dark:border-bone/10 dark:bg-white/[0.04]">
          <button
            type="button"
            onClick={() => updateValue(side, i, v - 1)}
            className="flex h-5 w-5 items-center justify-center rounded text-ink-soft hover:text-ink dark:text-bone-soft"
            aria-label={`Decrease ${dataset.label} value ${i + 1}`}
          >
            <Minus className="h-3 w-3" strokeWidth={2} />
          </button>
          <span className="w-7 text-center font-mono text-xs tabular-nums text-ink dark:text-bone">{v}</span>
          <button
            type="button"
            onClick={() => updateValue(side, i, v + 1)}
            className="flex h-5 w-5 items-center justify-center rounded text-ink-soft hover:text-ink dark:text-bone-soft"
            aria-label={`Increase ${dataset.label} value ${i + 1}`}
          >
            <Plus className="h-3 w-3" strokeWidth={2} />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-6 py-4">
      <PairPicker presets={COMPARISON_PRESETS} activeId={activePairId} onSelect={setActivePairId} />

      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">{activePreset.title}</p>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">{activePreset.question}</p>
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
        {editableRow("a", datasetA)}
        {editableRow("b", datasetB)}
        <div className="flex justify-center">
          <Button variant="ghost" size="sm" onClick={resetPair}>
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
            Reset both datasets
          </Button>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 sm:flex-row">
        <StatCard dataset={datasetA} stats={statsA} highlightConsistent={consistent === "a"} />
        <StatCard dataset={datasetB} stats={statsB} highlightConsistent={consistent === "b"} />
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <DualBarChart a={datasetA} b={datasetB} />
      </div>

      <p className="mx-auto max-w-xl text-center text-sm text-ink-soft dark:text-bone-soft">
        {statsA.mean === statsB.mean ? (
          <>
            Both datasets share a mean of <strong className="text-ink dark:text-bone">{formatNumber(statsA.mean)}</strong>, but their ranges (
            <strong className="text-ink dark:text-bone">{formatNumber(statsA.range)}</strong> vs{" "}
            <strong className="text-ink dark:text-bone">{formatNumber(statsB.range)}</strong>) tell a different story.
          </>
        ) : (
          <>
            <strong className="text-ink dark:text-bone">{datasetA.label}</strong> averages{" "}
            {formatNumber(statsA.mean)} {datasetA.unit}, <strong className="text-ink dark:text-bone">{datasetB.label}</strong> averages{" "}
            {formatNumber(statsB.mean)} {datasetB.unit}.
          </>
        )}
      </p>
    </div>
  );
}
