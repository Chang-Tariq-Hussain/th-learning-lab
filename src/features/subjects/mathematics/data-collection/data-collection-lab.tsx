"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Shuffle, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatasetPicker } from "./components/dataset-picker";
import { CategoryButton } from "./components/category-button";
import { RawDataList } from "./components/raw-data-list";
import { FrequencyTable } from "./components/frequency-table";
import { FrequencyBarChart } from "./components/frequency-bar-chart";
import { DATASET_PRESETS, buildFrequencyTable, mostFrequent, leastFrequent } from "./data-collection-model";

/**
 * Data Collection Lab — Mathematics Batch 4, Statistics topic
 * "Data Collection & Representation". An Interactive Data Lab (per
 * the batch's design principle) rather than a static lesson: the
 * student collects observations one at a time into three ready-made
 * survey datasets (fruit / pet / weather), and watches the exact
 * same data simultaneously become a raw list, a frequency table
 * (with tally marks), and a bar chart — making the RAW DATA -> TABLE
 * -> GRAPH pipeline visible rather than assumed.
 *
 * State is kept independently per dataset (`observationsByDataset`)
 * so switching tabs to explore a different survey never loses
 * progress on the others. Reused as-is by both the Explore section
 * (embedded in the Golden Learning Experience) and the standalone
 * simulation page, matching every other Mathematics topic's
 * `index.ts` dynamic-import convention.
 */
export function DataCollectionLab() {
  const [activePresetId, setActivePresetId] = useState(DATASET_PRESETS[0]!.id);
  const [observationsByDataset, setObservationsByDataset] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(DATASET_PRESETS.map((preset) => [preset.id, preset.seed]))
  );
  const [view, setView] = useState<"raw" | "table" | "graph">("table");

  const activePreset = DATASET_PRESETS.find((p) => p.id === activePresetId) ?? DATASET_PRESETS[0]!;
  const observations = useMemo(
    () => observationsByDataset[activePresetId] ?? [],
    [observationsByDataset, activePresetId]
  );

  const rows = useMemo(
    () => buildFrequencyTable(activePreset.categories, observations),
    [activePreset, observations]
  );
  const total = observations.length;
  const top = mostFrequent(rows);
  const bottom = leastFrequent(rows);

  const addObservation = (categoryId: string) => {
    setObservationsByDataset((prev) => ({
      ...prev,
      [activePresetId]: [...(prev[activePresetId] ?? []), categoryId],
    }));
  };

  const undoLast = () => {
    setObservationsByDataset((prev) => ({
      ...prev,
      [activePresetId]: (prev[activePresetId] ?? []).slice(0, -1),
    }));
  };

  const addRandom = () => {
    const category = activePreset.categories[Math.floor(Math.random() * activePreset.categories.length)]!;
    addObservation(category.id);
  };

  const resetDataset = () => {
    setObservationsByDataset((prev) => ({ ...prev, [activePresetId]: activePreset.seed }));
  };

  return (
    <div className="flex flex-col gap-6 py-4">
      <DatasetPicker presets={DATASET_PRESETS} activeId={activePresetId} onSelect={setActivePresetId} />

      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">{activePreset.title}</p>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">{activePreset.question}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {activePreset.categories.map((category) => (
          <CategoryButton
            key={category.id}
            category={category}
            count={rows.find((r) => r.category.id === category.id)?.count ?? 0}
            onAdd={() => addObservation(category.id)}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button variant="secondary" size="sm" onClick={addRandom}>
          <Shuffle className="h-3.5 w-3.5" strokeWidth={1.75} />
          Add random observation
        </Button>
        <Button variant="ghost" size="sm" onClick={undoLast} disabled={total === 0}>
          <Undo2 className="h-3.5 w-3.5" strokeWidth={1.75} />
          Undo last
        </Button>
        <Button variant="ghost" size="sm" onClick={resetDataset}>
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
          Reset
        </Button>
      </div>

      <div className="flex justify-center gap-1 rounded-full border border-ink/10 p-1 dark:border-bone/10" role="tablist" aria-label="Choose a view of the data">
        {(
          [
            { id: "raw", label: "Raw Data" },
            { id: "table", label: "Frequency Table" },
            { id: "graph", label: "Bar Graph" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={view === tab.id}
            onClick={() => setView(tab.id)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              view === tab.id
                ? "bg-subject-math text-white"
                : "text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mx-auto w-full max-w-xl">
        {view === "raw" && <RawDataList categories={activePreset.categories} observations={observations} />}
        {view === "table" && <FrequencyTable rows={rows} total={total} />}
        {view === "graph" && <FrequencyBarChart rows={rows} />}
      </div>

      {total > 0 && top && bottom && (
        <p className="mx-auto max-w-xl text-center text-sm text-ink-soft dark:text-bone-soft">
          {total} observation{total === 1 ? "" : "s"} collected so far. <strong className="text-ink dark:text-bone">{top.category.label}</strong> is
          currently the most common
          {top.count !== bottom.count ? (
            <>
              {" "}
              and <strong className="text-ink dark:text-bone">{bottom.category.label}</strong> the least
            </>
          ) : null}
          .
        </p>
      )}
    </div>
  );
}
