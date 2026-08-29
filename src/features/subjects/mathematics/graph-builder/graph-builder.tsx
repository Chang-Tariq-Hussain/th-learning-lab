"use client";

import { useEffect, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GraphDatasetPicker } from "./components/graph-dataset-picker";
import { ValueEditor } from "./components/value-editor";
import { ChartTypeSelector } from "./components/chart-type-selector";
import { BarChartView } from "./components/bar-chart-view";
import { PieChartView } from "./components/pie-chart-view";
import { LineChartView } from "./components/line-chart-view";
import {
  GRAPH_DATASETS,
  VALUE_MAX,
  VALUE_MIN,
  availableChartTypes,
  highest,
  lowest,
  total,
  type ChartType,
  type DataPoint,
} from "./graph-builder-model";

/**
 * Graph Builder — Mathematics Batch 4 topic 5 of 6 (Statistics &
 * Data). Three ready-made datasets (ice cream sales, weekly rainfall,
 * a class pet vote) that the student can directly edit, viewed
 * through whichever chart type suits that dataset (Bar Graph always
 * available; Pie Chart for unordered category data; Line Graph only
 * for the sequential rainfall-by-day dataset — per the batch's
 * "explain when each representation is useful" instruction rather
 * than forcing every chart type onto every dataset).
 *
 * All three chart views (`BarChartView`/`PieChartView`/
 * `LineChartView`) render from the exact same `points` array, so
 * editing a value and switching chart type both visibly update the
 * same underlying data rather than three disconnected demos.
 */
export function GraphBuilder() {
  const [datasetsState, setDatasetsState] = useState(() =>
    Object.fromEntries(GRAPH_DATASETS.map((d) => [d.id, d.points]))
  );
  const [activeDatasetId, setActiveDatasetId] = useState(GRAPH_DATASETS[0]!.id);
  const [chartType, setChartType] = useState<ChartType>("bar");

  const activeDataset = GRAPH_DATASETS.find((d) => d.id === activeDatasetId) ?? GRAPH_DATASETS[0]!;
  const points: DataPoint[] = datasetsState[activeDatasetId] ?? activeDataset.points;
  const options = useMemo(() => availableChartTypes(activeDataset), [activeDataset]);

  // Keep the selected chart type valid whenever the dataset changes
  // (e.g. switching away from the sequential rainfall dataset should
  // fall back to Bar Graph rather than staying on an unavailable
  // Line Graph).
  useEffect(() => {
    if (!options.includes(chartType)) setChartType(options[0]!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDatasetId]);

  const updateValue = (id: string, next: number) => {
    setDatasetsState((prev) => ({
      ...prev,
      [activeDatasetId]: (prev[activeDatasetId] ?? []).map((p) =>
        p.id === id ? { ...p, value: Math.min(VALUE_MAX, Math.max(VALUE_MIN, next)) } : p
      ),
    }));
  };

  const resetDataset = () => {
    setDatasetsState((prev) => ({ ...prev, [activeDatasetId]: activeDataset.points }));
  };

  const top = highest(points);
  const bottom = lowest(points);
  const sum = total(points);

  return (
    <div className="flex flex-col gap-6 py-4">
      <GraphDatasetPicker datasets={GRAPH_DATASETS} activeId={activeDatasetId} onSelect={setActiveDatasetId} />

      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">{activeDataset.title}</p>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">
          Edit the values below and watch every chart type update.
        </p>
      </div>

      <div className="mx-auto w-full max-w-md">
        <ValueEditor points={points} unit={activeDataset.unit} onChange={updateValue} />
        <div className="mt-2 flex justify-center">
          <Button variant="ghost" size="sm" onClick={resetDataset}>
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
            Reset dataset
          </Button>
        </div>
      </div>

      <ChartTypeSelector available={options} active={chartType} onSelect={setChartType} />

      <div className="mx-auto w-full max-w-xl">
        {chartType === "bar" && <BarChartView points={points} />}
        {chartType === "pie" && <PieChartView points={points} />}
        {chartType === "line" && <LineChartView points={points} />}
      </div>

      {top && bottom && (
        <p className="mx-auto max-w-xl text-center text-sm text-ink-soft dark:text-bone-soft">
          Total: <strong className="text-ink dark:text-bone">{sum}</strong> {activeDataset.unit}.{" "}
          <strong className="text-ink dark:text-bone">{top.label}</strong> is highest
          {top.value !== bottom.value ? (
            <>
              , <strong className="text-ink dark:text-bone">{bottom.label}</strong> is lowest
            </>
          ) : null}
          .
        </p>
      )}
    </div>
  );
}
