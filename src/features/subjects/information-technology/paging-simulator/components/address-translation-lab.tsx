"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw, StepForward } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ALGORITHM_LABELS,
  ONLINE_ALGORITHMS,
  maxVirtualAddress,
  splitVirtualAddress,
  accessVirtualAddress,
  type AccessResult,
  type Algorithm,
  type MachineState,
} from "../model";

interface AddressTranslationLabProps {
  machine: MachineState;
  algorithm: Algorithm;
  onChangeAlgorithm: (algorithm: Algorithm) => void;
  onCommit: (next: MachineState) => void;
  onHighlightPage: (page: number | null) => void;
}

const SPEEDS = [
  { id: "slow", label: "Slow", ms: 2400 },
  { id: "normal", label: "Normal", ms: 1400 },
  { id: "fast", label: "Fast", ms: 700 },
];

/**
 * Brief §4, §5, §6, §8: the student picks a virtual address, sees it
 * split into page number + offset, and steps the translation all the
 * way to a physical address — including the page-fault branch when the
 * page is not resident.
 *
 * The run is snapshotted into state when playback starts rather than
 * recomputed from `machine` on every render. That matters because the
 * final step commits the new machine state upward: if the step list
 * were derived live it would rebuild itself mid-animation the instant
 * the commit landed, and the narration would change underneath the
 * student. One interval timer drives playback and is cleared on every
 * dependency change and on unmount.
 */
export function AddressTranslationLab({
  machine,
  algorithm,
  onChangeAlgorithm,
  onCommit,
  onHighlightPage,
}: AddressTranslationLabProps) {
  const { pageSizeBytes } = machine.config;
  const maxAddress = maxVirtualAddress(machine.config);

  const [virtualAddress, setVirtualAddress] = useState(() => Math.min(13, maxAddress));
  const [write, setWrite] = useState(false);
  const [run, setRun] = useState<AccessResult | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedId, setSpeedId] = useState("normal");
  const committedRef = useRef(false);

  const preview = useMemo(
    () => splitVirtualAddress(Math.min(virtualAddress, maxAddress), pageSizeBytes),
    [virtualAddress, maxAddress, pageSizeBytes],
  );
  const speed = SPEEDS.find((s) => s.id === speedId) ?? SPEEDS[1]!;
  const steps = run?.steps ?? [];
  const currentStep = steps[stepIndex];
  const atEnd = run !== null && stepIndex >= steps.length - 1;

  const reset = useCallback(() => {
    setPlaying(false);
    setRun(null);
    setStepIndex(0);
    committedRef.current = false;
    onHighlightPage(null);
  }, [onHighlightPage]);

  // Reconfiguring the machine (page size, frame count) invalidates any
  // in-flight run, since its narration quotes the old numbers.
  useEffect(() => {
    reset();
  }, [pageSizeBytes, machine.config.frameCount, reset]);

  useEffect(() => {
    if (virtualAddress > maxAddress) setVirtualAddress(maxAddress);
  }, [virtualAddress, maxAddress]);

  const startRun = useCallback((): AccessResult => {
    const result = accessVirtualAddress(machine, Math.min(virtualAddress, maxAddress), { algorithm, write });
    setRun(result);
    setStepIndex(0);
    committedRef.current = false;
    return result;
  }, [machine, virtualAddress, maxAddress, algorithm, write]);

  const handleStep = () => {
    if (!run) {
      startRun();
      return;
    }
    setStepIndex((i) => Math.min(run.steps.length - 1, i + 1));
  };

  const handlePlay = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (!run || atEnd) {
      if (!run) startRun();
      else {
        setStepIndex(0);
        committedRef.current = false;
      }
    }
    setPlaying(true);
  };

  // Playback timer. `run` is stable while playing, so the interval is
  // installed once per play/speed change rather than per step.
  useEffect(() => {
    if (!playing || !run) return;
    const total = run.steps.length;
    const id = setInterval(() => {
      setStepIndex((i) => {
        if (i >= total - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, speed.ms);
    return () => clearInterval(id);
  }, [playing, run, speed.ms]);

  // Commit exactly once, when the run reaches its final step, so the
  // page table and RAM the other tabs show reflect what just happened.
  useEffect(() => {
    if (!run || committedRef.current) return;
    if (stepIndex < run.steps.length - 1) return;
    committedRef.current = true;
    onCommit(run.next);
  }, [run, stepIndex, onCommit]);

  useEffect(() => {
    if (!currentStep) return;
    onHighlightPage(currentStep.highlight.page ?? null);
  }, [currentStep, onHighlightPage]);

  const resultFrame = run && stepIndex >= (run.steps.findIndex((s) => s.phase === "hit" || s.phase === "retry") ?? 0) ? run.frame : null;
  const showPhysical = run !== null && atEnd && run.physicalAddress >= 0;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-ink-soft dark:text-bone-soft">
        Choose a virtual address, then run the translation one step at a time. If the page is not in RAM you will see the
        page-fault path instead of the direct path — both end at a real physical address.
      </p>

      {/* ---------------- Address chooser ---------------- */}
      <div className="rounded-card border border-line p-4 dark:border-line-dark">
        <div className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
              Virtual address (0–{maxAddress})
            </span>
            <input
              type="number"
              min={0}
              max={maxAddress}
              value={virtualAddress}
              onChange={(e) => {
                const next = Number.parseInt(e.target.value, 10);
                if (Number.isNaN(next)) return;
                setVirtualAddress(Math.max(0, Math.min(maxAddress, next)));
                reset();
              }}
              className="h-10 w-28 rounded-lg border border-line bg-transparent px-3 font-mono text-sm text-ink dark:border-line-dark dark:text-bone"
            />
          </label>

          <label className="flex min-w-[180px] flex-1 flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Drag to choose</span>
            <input
              type="range"
              min={0}
              max={maxAddress}
              value={virtualAddress}
              onChange={(e) => {
                setVirtualAddress(Number.parseInt(e.target.value, 10));
                reset();
              }}
              className="h-10 w-full accent-subject-it"
              aria-label="Virtual address"
            />
          </label>

          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Access type</span>
            <div className="flex gap-1">
              {[
                { id: false, label: "Read" },
                { id: true, label: "Write" },
              ].map((option) => (
                <button
                  key={String(option.id)}
                  onClick={() => {
                    setWrite(option.id);
                    reset();
                  }}
                  className={cn(
                    "h-10 rounded-lg border px-3 text-xs font-medium",
                    write === option.id
                      ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                      : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">If RAM is full, replace using</span>
            <div className="flex gap-1">
              {ONLINE_ALGORITHMS.map((id) => (
                <button
                  key={id}
                  onClick={() => {
                    onChangeAlgorithm(id);
                    reset();
                  }}
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

        {/* ---------------- Virtual address breakdown ---------------- */}
        <div className="mt-4">
          <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Virtual address = page number + offset</p>
          <div className="mt-2 flex overflow-hidden rounded-lg border border-subject-it/50">
            <div className="flex-1 bg-subject-it-soft px-3 py-2 dark:bg-subject-it/20">
              <p className="font-mono text-[10px] uppercase tracking-wide text-subject-it">Page number</p>
              <p className="font-mono text-lg font-semibold text-ink dark:text-bone">{preview.pageOrFrameNumber}</p>
              <p className="font-mono text-[10px] text-ink-soft dark:text-bone-soft">{preview.address} ÷ {pageSizeBytes}</p>
            </div>
            <div className="flex-1 border-l border-subject-it/50 px-3 py-2">
              <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Offset</p>
              <p className="font-mono text-lg font-semibold text-ink dark:text-bone">{preview.offset}</p>
              <p className="font-mono text-[10px] text-ink-soft dark:text-bone-soft">{preview.address} mod {pageSizeBytes}</p>
            </div>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
            The page number identifies which page of the virtual address space the data is in. The offset identifies the exact
            byte inside that page. Only the page number gets translated — the offset is carried through unchanged.
          </p>
        </div>
      </div>

      {/* ---------------- Step machine ---------------- */}
      <div className="rounded-card border border-line p-4 dark:border-line-dark">
        <div className="mb-3 flex flex-wrap gap-1.5" aria-hidden>
          {(run ? steps : Array.from({ length: 5 })).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 min-w-[14px] flex-1 rounded-full transition-colors",
                run && i <= stepIndex
                  ? currentStep?.phase === "fault"
                    ? "bg-amber-500"
                    : "bg-subject-it"
                  : "bg-ink/10 dark:bg-bone/10",
              )}
            />
          ))}
        </div>

        {run && currentStep ? (
          <>
            <p className="font-mono text-[11px] uppercase tracking-wide text-subject-it">
              Step {stepIndex + 1} of {steps.length}
              {run.fault ? " · page-fault path" : " · direct path"}
            </p>
            <p className="mt-1 text-sm font-medium text-ink dark:text-bone">{currentStep.title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{currentStep.description}</p>
          </>
        ) : (
          <>
            <p className="font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Ready</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
              Press Play or Step to translate virtual address {Math.min(virtualAddress, maxAddress)}. The page table is consulted
              first — whether this takes the direct path or the page-fault path depends on page {preview.pageOrFrameNumber}&apos;s
              present bit.
            </p>
          </>
        )}

        {showPhysical && run && (
          <div className="mt-4 rounded-lg border border-subject-it/50 bg-subject-it-soft/50 p-3 dark:bg-subject-it/10">
            <p className="font-mono text-[10px] uppercase tracking-wide text-subject-it">Physical address = frame number + offset</p>
            <div className="mt-2 flex overflow-hidden rounded-lg border border-subject-it/50">
              <div className="flex-1 bg-subject-it-soft px-3 py-2 dark:bg-subject-it/20">
                <p className="font-mono text-[10px] uppercase tracking-wide text-subject-it">Frame number</p>
                <p className="font-mono text-lg font-semibold text-ink dark:text-bone">{run.frame}</p>
              </div>
              <div className="flex-1 border-l border-subject-it/50 bg-paper px-3 py-2 dark:bg-chalkboard">
                <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Offset (unchanged)</p>
                <p className="font-mono text-lg font-semibold text-ink dark:text-bone">{run.offset}</p>
              </div>
            </div>
            <p className="mt-2 font-mono text-sm text-ink dark:text-bone">
              {run.frame} × {pageSizeBytes} + {run.offset} = physical address {run.physicalAddress}
            </p>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={handlePlay}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-subject-it px-4 text-xs font-medium text-paper hover:opacity-90"
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />} {playing ? "Pause" : atEnd ? "Replay" : "Play"}
          </button>
          <button
            onClick={handleStep}
            disabled={atEnd}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-4 text-xs font-medium text-ink hover:border-ink/40 disabled:opacity-40 dark:border-line-dark dark:text-bone"
          >
            <StepForward className="h-3.5 w-3.5" /> Step
          </button>
          <button
            onClick={reset}
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
        {resultFrame !== null && !showPhysical && (
          <p className="mt-2 font-mono text-[11px] text-ink-soft dark:text-bone-soft">Frame so far: {resultFrame}</p>
        )}
      </div>
    </div>
  );
}
