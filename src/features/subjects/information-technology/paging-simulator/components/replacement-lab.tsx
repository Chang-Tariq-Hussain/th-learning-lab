"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw, StepForward } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ALGORITHM_DESCRIPTIONS,
  ALGORITHM_LABELS,
  DEFAULT_REFERENCE_STRING,
  OPTIMAL_NOTE,
  compareAlgorithms,
  parseReferenceString,
  runReferenceString,
  type Algorithm,
} from "../model";

const SPEEDS = [
  { id: "slow", label: "Slow", ms: 1600 },
  { id: "normal", label: "Normal", ms: 900 },
  { id: "fast", label: "Fast", ms: 450 },
];

const FRAME_COUNT_OPTIONS = [2, 3, 4];

/**
 * Brief §10, §11, §12: the reference-string laboratory. The whole run
 * is computed by the pure `runReferenceString` in the model and
 * memoized on its three inputs, so stepping forwards and backwards is
 * just moving an index — no mutable simulation object, and no
 * recomputation while the student scrubs through a trace.
 *
 * The comparison table runs all three policies over the same string.
 * It deliberately does not crown a winner: the takeaway is that
 * results depend on the workload, and that Optimal is a benchmark
 * rather than something a real OS can run.
 */
export function ReplacementLab() {
  const [rawInput, setRawInput] = useState(DEFAULT_REFERENCE_STRING.join(" "));
  const [frameCount, setFrameCount] = useState(3);
  const [algorithm, setAlgorithm] = useState<Algorithm>("fifo");
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [speedId, setSpeedId] = useState("normal");
  const [showComparison, setShowComparison] = useState(false);

  const references = useMemo(() => parseReferenceString(rawInput), [rawInput]);
  const run = useMemo(() => runReferenceString(references, frameCount, algorithm), [references, frameCount, algorithm]);
  const comparison = useMemo(
    () => (showComparison ? compareAlgorithms(references, frameCount) : []),
    [showComparison, references, frameCount],
  );

  const speed = SPEEDS.find((s) => s.id === speedId) ?? SPEEDS[1]!;
  const lastIndex = run.steps.length - 1;
  const atEnd = stepIndex >= lastIndex;
  const currentStep = stepIndex >= 0 ? run.steps[stepIndex] : undefined;

  // Any change to the string, frame count, or policy invalidates the
  // position in the old trace.
  useEffect(() => {
    setStepIndex(-1);
    setPlaying(false);
  }, [references, frameCount, algorithm]);

  useEffect(() => {
    if (!playing) return;
    if (run.steps.length === 0) {
      setPlaying(false);
      return;
    }
    const id = setInterval(() => {
      setStepIndex((i) => {
        if (i >= run.steps.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, speed.ms);
    return () => clearInterval(id);
  }, [playing, run.steps.length, speed.ms]);

  const shownFaults = currentStep?.faultsSoFar ?? 0;
  const shownHits = currentStep?.hitsSoFar ?? 0;
  const shownTotal = stepIndex + 1;
  const shownRate = shownTotal <= 0 ? 0 : shownFaults / shownTotal;
  const frames = currentStep?.frames ?? Array.from({ length: frameCount }, () => null);

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-ink-soft dark:text-bone-soft">
        A reference string is just the sequence of pages a program touches. Feed one in, pick how many frames RAM has, and
        step through to see exactly where the page faults land and which page gets replaced.
      </p>

      {/* ---------------- Controls ---------------- */}
      <div className="rounded-card border border-line p-4 dark:border-line-dark">
        <label className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
            Reference string (page numbers 0–15, spaces or commas)
          </span>
          <input
            type="text"
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            inputMode="numeric"
            className="h-11 w-full rounded-lg border border-line bg-transparent px-3 font-mono text-sm text-ink dark:border-line-dark dark:text-bone"
          />
        </label>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {[
            { label: "Classic 7 0 1 2 0 3 0 4", value: "7 0 1 2 0 3 0 4 2 3 0 3 2" },
            { label: "Looping 1 2 3 4 1 2 5", value: "1 2 3 4 1 2 5 1 2 3 4 5" },
            { label: "Locality-heavy", value: "0 1 0 1 2 0 1 2 3 2 1 0" },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => setRawInput(preset.value)}
              className="rounded-full border border-line px-3 py-1 text-[11px] font-medium text-ink-soft hover:border-ink/40 dark:border-line-dark dark:text-bone-soft"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Frames in RAM</span>
            <div className="flex gap-1">
              {FRAME_COUNT_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => setFrameCount(n)}
                  className={cn(
                    "h-10 w-10 rounded-lg border font-mono text-sm font-medium",
                    frameCount === n
                      ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                      : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Replacement algorithm</span>
            <div className="flex flex-wrap gap-1">
              {(["fifo", "lru", "optimal"] as Algorithm[]).map((id) => (
                <button
                  key={id}
                  onClick={() => setAlgorithm(id)}
                  className={cn(
                    "h-10 rounded-lg border px-3 text-xs font-medium",
                    algorithm === id
                      ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                      : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
                  )}
                >
                  {ALGORITHM_LABELS[id]}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">{ALGORITHM_DESCRIPTIONS[algorithm]}</p>
      </div>

      {/* ---------------- Trace ---------------- */}
      <div className="rounded-card border border-line p-4 dark:border-line-dark">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-center font-mono text-xs">
            <caption className="sr-only">Frame contents after each memory reference</caption>
            <thead>
              <tr>
                <th scope="col" className="px-2 py-1 text-left text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Ref</th>
                {run.steps.map((step) => (
                  <th
                    key={step.index}
                    scope="col"
                    className={cn(
                      "min-w-[30px] px-1 py-1 text-ink dark:text-bone",
                      step.index === stepIndex && "bg-subject-it-soft dark:bg-subject-it/20",
                      step.index > stepIndex && "opacity-35",
                    )}
                  >
                    {step.page}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: frameCount }, (_, frameIndex) => (
                <tr key={frameIndex}>
                  <th scope="row" className="whitespace-nowrap px-2 py-1 text-left text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
                    Frame {frameIndex}
                  </th>
                  {run.steps.map((step) => {
                    const value = step.frames[frameIndex];
                    const changed = step.index > 0 && run.steps[step.index - 1]?.frames[frameIndex] !== value;
                    return (
                      <td
                        key={step.index}
                        className={cn(
                          "border border-line px-1 py-1 text-ink dark:border-line-dark dark:text-bone",
                          step.index === stepIndex && "bg-subject-it-soft dark:bg-subject-it/20",
                          step.index > stepIndex && "opacity-25",
                          changed && step.index <= stepIndex && "font-semibold text-subject-it",
                        )}
                      >
                        {value === null ? "·" : value}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <th scope="row" className="px-2 py-1 text-left text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Fault</th>
                {run.steps.map((step) => (
                  <td
                    key={step.index}
                    className={cn(
                      "px-1 py-1",
                      step.index > stepIndex ? "opacity-25" : step.fault ? "text-amber-600 dark:text-amber-400" : "text-ink-soft dark:text-bone-soft",
                    )}
                  >
                    {step.fault ? "F" : "·"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-3 min-h-[44px] text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          {currentStep ? (
            <>
              <span className="font-mono text-[11px] uppercase tracking-wide text-subject-it">
                Reference {stepIndex + 1} of {run.steps.length} · page {currentStep.page} · {currentStep.fault ? "PAGE FAULT" : "page hit"}
              </span>
              <p className="mt-1">{currentStep.note}</p>
            </>
          ) : (
            <p>Press Play or Step to walk the reference string one memory reference at a time.</p>
          )}
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: "References so far", value: Math.max(0, shownTotal) },
            { label: "Page hits", value: shownHits },
            { label: "Page faults", value: shownFaults },
            { label: "Fault rate", value: `${Math.round(shownRate * 100)}%` },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-line px-3 py-2 dark:border-line-dark">
              <dt className="font-mono text-[9px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{stat.label}</dt>
              <dd className="font-mono text-base font-semibold text-ink dark:text-bone">{stat.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              if (playing) {
                setPlaying(false);
                return;
              }
              if (atEnd) setStepIndex(-1);
              setPlaying(true);
            }}
            disabled={run.steps.length === 0}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-subject-it px-4 text-xs font-medium text-paper hover:opacity-90 disabled:opacity-40"
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />} {playing ? "Pause" : atEnd ? "Replay" : "Run"}
          </button>
          <button
            onClick={() => setStepIndex((i) => Math.min(lastIndex, i + 1))}
            disabled={atEnd}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-4 text-xs font-medium text-ink hover:border-ink/40 disabled:opacity-40 dark:border-line-dark dark:text-bone"
          >
            <StepForward className="h-3.5 w-3.5" /> Step
          </button>
          <button
            onClick={() => {
              setPlaying(false);
              setStepIndex(-1);
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-4 text-xs font-medium text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
          <div className="ml-auto flex gap-1">
            {SPEEDS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSpeedId(s.id)}
                className={cn(
                  "h-9 rounded-full border px-3 text-[11px] font-medium",
                  speedId === s.id ? "border-ink dark:border-bone" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-3 font-mono text-[11px] text-ink-soft dark:text-bone-soft">
          Whole run: {run.faults} faults, {run.hits} hits, {Math.round(run.faultRate * 100)}% fault rate over {references.length} references.
        </p>
        <p className="mt-1 font-mono text-[11px] text-ink-soft dark:text-bone-soft">
          Current frame contents: {frames.map((f) => (f === null ? "—" : f)).join(" · ")}
        </p>
      </div>

      {/* ---------------- Comparison ---------------- */}
      <div className="rounded-card border border-line p-4 dark:border-line-dark">
        <button
          onClick={() => setShowComparison((v) => !v)}
          className="rounded-full border border-line px-4 py-1.5 text-xs font-medium text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone"
        >
          {showComparison ? "Hide" : "Compare"} FIFO, LRU and Optimal on this string
        </button>

        {showComparison && (
          <>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[320px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-ink/[0.04] dark:bg-bone/[0.06]">
                    <th scope="col" className="px-3 py-2 font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Algorithm</th>
                    <th scope="col" className="px-3 py-2 font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Page faults</th>
                    <th scope="col" className="px-3 py-2 font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Hits</th>
                    <th scope="col" className="px-3 py-2 font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Fault rate</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((result) => (
                    <tr key={result.algorithm} className="border-t border-line font-mono dark:border-line-dark">
                      <td className="px-3 py-2 text-ink dark:text-bone">{ALGORITHM_LABELS[result.algorithm]}</td>
                      <td className="px-3 py-2 text-ink dark:text-bone">{result.faults}</td>
                      <td className="px-3 py-2 text-ink dark:text-bone">{result.hits}</td>
                      <td className="px-3 py-2 text-ink dark:text-bone">{Math.round(result.faultRate * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
              No policy here is universally best. Which one performs better depends entirely on the workload — try the three
              presets above and watch the ordering change. {OPTIMAL_NOTE}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
