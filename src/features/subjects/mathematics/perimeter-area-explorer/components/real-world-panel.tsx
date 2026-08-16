"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { RectShape } from "./rect-shape";
import {
  CLASSIFY_SCENARIOS,
  REAL_WORLD_SCENARIOS,
  rectangleArea,
  rectanglePerimeter,
  type MeasureKind,
} from "../perimeter-area-model";

type Tab = "classify" | "units" | "lab";
const TABS: { id: Tab; label: string }[] = [
  { id: "classify", label: "Perimeter or Area?" },
  { id: "units", label: "Units" },
  { id: "lab", label: "Mini Lab" },
];

function ClassifyView() {
  const [answers, setAnswers] = useState<Record<string, MeasureKind>>({});

  return (
    <div className="flex flex-col gap-3">
      {CLASSIFY_SCENARIOS.map((s) => {
        const answered = answers[s.id];
        return (
          <div
            key={s.id}
            className="flex flex-col items-center justify-between gap-2 rounded-card border border-line px-4 py-2.5 dark:border-line-dark sm:flex-row"
          >
            <p className="text-sm text-ink dark:text-bone">{s.prompt}</p>
            <div className="flex gap-1.5">
              {(["perimeter", "area"] as MeasureKind[]).map((kind) => {
                const isChosen = answered === kind;
                const isCorrectChoice = answered && kind === s.correct;
                return (
                  <button
                    key={kind}
                    type="button"
                    onClick={() => setAnswers((prev) => ({ ...prev, [s.id]: kind }))}
                    className={cn(
                      "flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors",
                      answered
                        ? isCorrectChoice
                          ? "border-pine-500 bg-pine-50 text-pine-700 dark:border-pine-300 dark:bg-pine-900/20 dark:text-pine-300"
                          : isChosen
                            ? "border-amber-500 bg-amber-50 text-amber-700 dark:border-amber-400 dark:bg-amber-900/15 dark:text-amber-300"
                            : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft"
                        : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft",
                    )}
                  >
                    {kind}
                    {isChosen ? isCorrectChoice ? <Check className="h-3 w-3" strokeWidth={2.5} /> : <X className="h-3 w-3" strokeWidth={2.5} /> : null}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function UnitsView() {
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="max-w-md text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Length and perimeter use ordinary units. Area uses <em>square</em> units.
      </p>

      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="h-2 w-8 bg-subject-math/40" />
          ))}
        </div>
        <p className="font-mono text-sm text-ink dark:text-bone">5 cm — a length</p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="grid grid-cols-5 gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="h-8 w-8 border border-subject-math bg-subject-math/15" />
          ))}
        </div>
        <p className="font-mono text-sm text-ink dark:text-bone">5 cm² — five 1 cm × 1 cm squares of area</p>
      </div>
    </div>
  );
}

function LabView() {
  const [scenarioId, setScenarioId] = useState(REAL_WORLD_SCENARIOS[0]!.id);
  const [ask, setAsk] = useState<MeasureKind | null>(null);
  const scenario = REAL_WORLD_SCENARIOS.find((s) => s.id === scenarioId)!;
  const perimeter = rectanglePerimeter(scenario.length, scenario.width);
  const area = rectangleArea(scenario.length, scenario.width);

  const handlePick = (id: string) => {
    setScenarioId(id);
    setAsk(null);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-wrap justify-center gap-2">
        {REAL_WORLD_SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => handlePick(s.id)}
            aria-pressed={scenarioId === s.id}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              scenarioId === s.id
                ? "border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <RectShape
        length={scenario.length}
        width={scenario.width}
        showDimensionLabels
        fillArea={ask === "area"}
        boundaryReveal={ask !== "area" ? 1 : undefined}
        maxPixelWidth={220}
        unitPx={20}
        ariaLabel={`${scenario.label}, ${scenario.length} by ${scenario.width} ${scenario.lengthUnit}`}
      />

      <p className="text-sm text-ink-soft dark:text-bone-soft">What do you need to calculate?</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setAsk("perimeter")}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            ask === "perimeter" ? "border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
          )}
        >
          Perimeter
        </button>
        <button
          type="button"
          onClick={() => setAsk("area")}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            ask === "area" ? "border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
          )}
        >
          Area
        </button>
      </div>

      {ask ? (
        <p className="rounded-card border border-line bg-white/50 px-4 py-3 text-center font-mono text-sm text-ink dark:border-line-dark dark:bg-white/[0.03] dark:text-bone">
          {ask === scenario.needs ? (
            <>
              {scenario.needLabel}: {ask === "perimeter" ? perimeter : area} {scenario.lengthUnit}
              {ask === "area" ? "²" : ""}
            </>
          ) : (
            <>For {scenario.label.toLowerCase()}, you actually need {scenario.needs} — {scenario.needLabel.toLowerCase()}.</>
          )}
        </p>
      ) : null}
    </div>
  );
}

/** Level 12 — Real-World Applications. Merges Sections 13 (classify), 14 (units), and 15 (mini lab) behind one tab switcher. */
export function RealWorldPanel() {
  const [tab, setTab] = useState<Tab>("classify");

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6">
      <div className="flex flex-wrap justify-center gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              tab === t.id
                ? "border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "classify" ? <ClassifyView /> : null}
      {tab === "units" ? <UnitsView /> : null}
      {tab === "lab" ? <LabView /> : null}
    </div>
  );
}
