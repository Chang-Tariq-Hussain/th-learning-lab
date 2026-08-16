"use client";

import { useMemo, useState } from "react";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DotGrid } from "./dot-grid";
import {
  SAMPLING_METHODS,
  SAMPLING_POPULATION_SIZE,
  STRATIFIED_GROUPS,
  pickRandomIndices,
  type SamplingMethodId,
} from "../statistics-model";

const GROUP_SIZE = SAMPLING_POPULATION_SIZE / STRATIFIED_GROUPS.length; // 25 each
const SYSTEMATIC_INTERVAL = 5;
const CONVENIENCE_COUNT = 12;
const PER_GROUP_SAMPLE = 3;

function SimpleRandomView() {
  const [seed, setSeed] = useState(0);
  const highlighted = useMemo(
    () => pickRandomIndices(SAMPLING_POPULATION_SIZE, 15),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed],
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <DotGrid total={SAMPLING_POPULATION_SIZE} highlighted={highlighted} className="max-w-md justify-center" />
      <Button variant="secondary" size="sm" onClick={() => setSeed((s) => s + 1)}>
        <Shuffle className="h-3.5 w-3.5" strokeWidth={1.75} />
        Resample
      </Button>
    </div>
  );
}

function SystematicView() {
  const highlighted = useMemo(() => {
    const set = new Set<number>();
    for (let i = SYSTEMATIC_INTERVAL - 1; i < SAMPLING_POPULATION_SIZE; i += SYSTEMATIC_INTERVAL) set.add(i);
    return set;
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <DotGrid total={SAMPLING_POPULATION_SIZE} highlighted={highlighted} className="max-w-md justify-center" />
      <p className="font-mono text-xs text-ink-soft dark:text-bone-soft">
        Every {SYSTEMATIC_INTERVAL}th person selected: 5, 10, 15, 20, ...
      </p>
    </div>
  );
}

function StratifiedView() {
  const [seed, setSeed] = useState(0);
  const groupSelections = useMemo(
    () => STRATIFIED_GROUPS.map(() => pickRandomIndices(GROUP_SIZE, PER_GROUP_SAMPLE)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed],
  );

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex w-full max-w-md flex-col gap-3">
        {STRATIFIED_GROUPS.map((group, gi) => (
          <div key={group.id} className="flex items-center gap-3">
            <span className="w-16 shrink-0 font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
              {group.label}
            </span>
            <DotGrid total={GROUP_SIZE} highlighted={groupSelections[gi]} dotSize="sm" className="flex-1" />
          </div>
        ))}
      </div>
      <Button variant="secondary" size="sm" onClick={() => setSeed((s) => s + 1)}>
        <Shuffle className="h-3.5 w-3.5" strokeWidth={1.75} />
        Resample
      </Button>
    </div>
  );
}

function ConvenienceView() {
  const highlighted = useMemo(() => {
    const set = new Set<number>();
    for (let i = 0; i < CONVENIENCE_COUNT; i++) set.add(i);
    return set;
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <DotGrid total={SAMPLING_POPULATION_SIZE} highlighted={highlighted} className="max-w-md justify-center" />
      <p className="rounded-card border border-amber-500/40 bg-amber-50 px-4 py-2 text-center text-sm text-amber-700 dark:border-amber-400/30 dark:bg-amber-900/15 dark:text-amber-300">
        Convenient does not necessarily mean representative.
      </p>
    </div>
  );
}

/** Level 7 — Sampling Methods. Four tabs, each demonstrating one method over the same ~100-dot population. */
export function SamplingMethodsPanel() {
  const [methodId, setMethodId] = useState<SamplingMethodId>("random");
  const method = SAMPLING_METHODS.find((m) => m.id === methodId)!;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-5">
      <div className="flex flex-wrap justify-center gap-2">
        {SAMPLING_METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMethodId(m.id)}
            aria-pressed={methodId === m.id}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              methodId === m.id
                ? "border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {methodId === "random" ? <SimpleRandomView key="random" /> : null}
      {methodId === "systematic" ? <SystematicView key="systematic" /> : null}
      {methodId === "stratified" ? <StratifiedView key="stratified" /> : null}
      {methodId === "convenience" ? <ConvenienceView key="convenience" /> : null}

      <p className="max-w-md text-center text-sm text-ink-soft dark:text-bone-soft">{method.explanation}</p>
    </div>
  );
}
