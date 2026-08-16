"use client";

import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ValueNumberLine } from "./value-number-line";
import {
  MEDIAN_EVEN_DATASET,
  MEDIAN_ODD_DATASET,
  MEDIAN_UNSORTED_DATASET,
  formatNumber,
  median,
  sortedValues,
} from "../central-tendency-model";

type View = "odd" | "even" | "sort";

const VIEWS: { id: View; label: string }[] = [
  { id: "odd", label: "Odd Dataset" },
  { id: "even", label: "Even Dataset" },
  { id: "sort", label: "Sort to Find It" },
];

function OddExample() {
  const s = sortedValues(MEDIAN_ODD_DATASET);
  const midIndex = Math.floor(s.length / 2);
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-center text-sm text-ink-soft dark:text-bone-soft">
        The median is the middle value once the data is arranged in order.
      </p>
      <ValueNumberLine
        values={s}
        highlightIndices={new Set([midIndex])}
        highlightColor="#E8B923"
        markers={[{ value: s[midIndex]!, label: "Median", color: "#E8B923" }]}
      />
    </div>
  );
}

function EvenExample() {
  const s = sortedValues(MEDIAN_EVEN_DATASET);
  const upper = s.length / 2;
  const lower = upper - 1;
  const m = median(s);
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-center text-sm text-ink-soft dark:text-bone-soft">
        With an even count, there are two middle values — average them to find the median.
      </p>
      <ValueNumberLine
        values={s}
        highlightIndices={new Set([lower, upper])}
        highlightColor="#E8B923"
        markers={[{ value: m, label: "Median", color: "#E8B923" }]}
      />
      <p className="font-mono text-sm text-ink dark:text-bone">
        Median = ({s[lower]} + {s[upper]}) ÷ 2 = {formatNumber(m)}
      </p>
    </div>
  );
}

function SortExample() {
  const [isSorted, setIsSorted] = useState(false);
  const values = isSorted ? sortedValues(MEDIAN_UNSORTED_DATASET) : MEDIAN_UNSORTED_DATASET;
  const midIndex = Math.floor(values.length / 2);

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center text-sm text-ink-soft dark:text-bone-soft">
        Median requires ordered data. Sort this dataset first, then find the middle two values.
      </p>
      <ValueNumberLine
        values={values}
        highlightIndices={isSorted ? new Set([midIndex - 1, midIndex]) : undefined}
        highlightColor="#E8B923"
        markers={isSorted ? [{ value: median(values), label: "Median", color: "#E8B923" }] : []}
      />
      <div className="flex gap-2">
        <Button variant="primary" size="sm" onClick={() => setIsSorted(true)} disabled={isSorted}>
          Sort Data
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setIsSorted(false)} disabled={!isSorted}>
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
          Unsort
        </Button>
      </div>
    </div>
  );
}

/** Level 3 — Median. Odd vs even middle-value cases (Section 4), plus the sort-first activity (Section 5), one toggle apart. */
export function MedianPanel() {
  const [view, setView] = useState<View>("odd");

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6">
      <div className="flex flex-wrap justify-center gap-2">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setView(v.id)}
            aria-pressed={view === v.id}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              view === v.id
                ? "border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft",
            )}
          >
            {v.label}
          </button>
        ))}
      </div>

      {view === "odd" ? <OddExample /> : null}
      {view === "even" ? <EvenExample /> : null}
      {view === "sort" ? <SortExample /> : null}
    </div>
  );
}
