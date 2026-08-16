"use client";

import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RulerTrack } from "./ruler-track";
import { OBJECT_ICONS } from "./object-icons";
import { LAB_OBJECTS, formatLength } from "../measurement-model";

type Phase = "estimate" | "measure" | "result";

interface RecordedResult {
  estimate: number;
  measured: number;
}

/**
 * Level 9 — Measurement Lab. Pick an object, estimate its length,
 * then measure it for real with the draggable ruler — Section 11's
 * lab and Section 12's "estimate vs measure" comparison are the same
 * flow, so they're implemented as one three-step sequence per object.
 */
export function MeasurementLabPanel() {
  const [objectIndex, setObjectIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("estimate");
  const [results, setResults] = useState<Record<string, RecordedResult>>({});
  const [pendingMeasured, setPendingMeasured] = useState<number | null>(null);

  const object = LAB_OBJECTS[objectIndex]!;
  const Icon = OBJECT_ICONS[object.icon];
  const recorded = results[object.id];

  const handleEstimate = (estimate: number) => {
    setResults((prev) => ({ ...prev, [object.id]: { estimate, measured: prev[object.id]?.measured ?? 0 } }));
    setPhase("measure");
  };

  const handleRecordMeasurement = () => {
    if (pendingMeasured === null) return;
    setResults((prev) => ({
      ...prev,
      [object.id]: { estimate: prev[object.id]?.estimate ?? 0, measured: pendingMeasured },
    }));
    setPhase("result");
  };

  const goToObject = (index: number) => {
    setObjectIndex(index);
    setPendingMeasured(null);
    setPhase(results[LAB_OBJECTS[index]!.id] ? "result" : "estimate");
  };

  const handleRestart = () => {
    setResults({});
    setPendingMeasured(null);
    setObjectIndex(0);
    setPhase("estimate");
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="flex flex-wrap justify-center gap-2">
        {LAB_OBJECTS.map((obj, i) => (
          <button
            key={obj.id}
            type="button"
            onClick={() => goToObject(i)}
            aria-pressed={i === objectIndex}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              i === objectIndex
                ? "border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft",
            )}
          >
            {obj.name}
            {results[obj.id] ? <span className="text-pine-600 dark:text-pine-300">✓</span> : null}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2">
        <Icon className="h-8 w-8 text-subject-math" strokeWidth={1.5} />
        <p className="font-display text-lg font-medium text-ink dark:text-bone">{object.name}</p>
      </div>

      {phase === "estimate" ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-sm text-ink-soft dark:text-bone-soft">Estimate the length before measuring.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {object.estimateOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleEstimate(opt)}
                className="rounded-card border border-line px-4 py-2 font-mono text-sm text-ink transition-colors hover:border-subject-math hover:text-subject-math dark:border-line-dark dark:text-bone"
              >
                {opt} cm
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {phase === "measure" ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-sm text-ink-soft dark:text-bone-soft">
            Now drag the {object.name.toLowerCase()} into place and measure it.
          </p>
          <RulerTrack
            maxCm={object.rulerMaxCm}
            objectLengthCm={object.actualCm}
            objectLabel={object.name}
            showCalculation
            onMeasure={(_start, _end, length) => setPendingMeasured(length)}
          />
          <Button variant="primary" size="sm" onClick={handleRecordMeasurement} disabled={pendingMeasured === null}>
            Record Measurement
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
          </Button>
        </div>
      ) : null}

      {phase === "result" && recorded ? (
        <div className="flex flex-col items-center gap-3">
          <div className="grid w-full max-w-sm grid-cols-3 gap-3 text-center">
            <div className="flex flex-col gap-1 rounded-card border border-line bg-white/60 px-2 py-3 dark:border-line-dark dark:bg-white/[0.03]">
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft dark:text-bone-soft">Estimated</p>
              <p className="font-display text-base font-medium text-ink dark:text-bone">{formatLength(recorded.estimate)} cm</p>
            </div>
            <div className="flex flex-col gap-1 rounded-card border border-line bg-white/60 px-2 py-3 dark:border-line-dark dark:bg-white/[0.03]">
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft dark:text-bone-soft">Measured</p>
              <p className="font-display text-base font-medium text-subject-math">{formatLength(recorded.measured)} cm</p>
            </div>
            <div className="flex flex-col gap-1 rounded-card border border-line bg-white/60 px-2 py-3 dark:border-line-dark dark:bg-white/[0.03]">
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft dark:text-bone-soft">Difference</p>
              <p className="font-display text-base font-medium text-ink dark:text-bone">
                {formatLength(Math.abs(recorded.measured - recorded.estimate))} cm
              </p>
            </div>
          </div>
          {objectIndex < LAB_OBJECTS.length - 1 ? (
            <Button variant="primary" size="sm" onClick={() => goToObject(objectIndex + 1)}>
              Next Object
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={handleRestart}>
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
              Restart Lab
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
