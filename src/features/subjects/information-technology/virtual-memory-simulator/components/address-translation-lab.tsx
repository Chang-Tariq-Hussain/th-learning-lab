"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, StepForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { ACCESS_STEPS, type SimProcess, type VirtualRegion } from "../model";

interface AddressTranslationLabProps {
  processes: SimProcess[];
  selectedProcessId: string;
  onSelectProcess: (id: string) => void;
}

const SPEEDS = [
  { id: "slow", label: "Slow", ms: 2200 },
  { id: "normal", label: "Normal", ms: 1400 },
  { id: "fast", label: "Fast", ms: 700 },
];

/**
 * The "Access Memory" scenario: pick a process and one of its
 * virtual regions (standing in for a virtual address inside it),
 * then step through — Process generates → Translation → Residency
 * check → Data accessed/obtained → Process continues — with
 * Play/Pause/Step/Reset/Speed controls. Deliberately stops short of
 * page-table/page-fault mechanics — see `ACCESS_STEPS`' descriptions.
 */
export function AddressTranslationLab({ processes, selectedProcessId, onSelectProcess }: AddressTranslationLabProps) {
  const selectedProcess = processes.find((p) => p.id === selectedProcessId) ?? processes[0]!;
  const mappableRegions = selectedProcess.regions.filter((r) => r.kind !== "free");
  const [selectedRegionId, setSelectedRegionId] = useState<string>(mappableRegions[0]?.id ?? "");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedId, setSpeedId] = useState<string>("normal");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const selectedRegion: VirtualRegion | undefined = mappableRegions.find((r) => r.id === selectedRegionId) ?? mappableRegions[0];
  const resident = selectedRegion?.resident ?? true;
  const step = ACCESS_STEPS[stepIndex]!;
  const speed = SPEEDS.find((s) => s.id === speedId) ?? SPEEDS[1]!;

  useEffect(() => {
    if (!playing) return;
    intervalRef.current = setInterval(() => {
      setStepIndex((i) => {
        if (i >= ACCESS_STEPS.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, speed.ms);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, speed.ms]);

  const reset = () => {
    setPlaying(false);
    setStepIndex(0);
  };

  const changeRegion = (id: string) => {
    setSelectedRegionId(id);
    reset();
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-ink-soft dark:text-bone-soft">
        Pick a process and a virtual address inside one of its regions, then step through what happens when it&apos;s accessed.
      </p>

      <div className="flex flex-wrap gap-2">
        {processes.map((p) => (
          <button
            key={p.id}
            onClick={() => { onSelectProcess(p.id); reset(); }}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium",
              selectedProcessId === p.id ? "border-ink dark:border-bone" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
            )}
          >
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: p.color }} /> {p.name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {mappableRegions.map((r) => (
          <button
            key={r.id}
            onClick={() => changeRegion(r.id)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs font-medium",
              selectedRegionId === r.id
                ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                : "border-line text-ink-soft hover:border-ink/40 dark:border-line-dark dark:text-bone-soft",
            )}
          >
            {r.label} {r.resident ? "· resident" : "· non-resident"}
          </button>
        ))}
      </div>

      <div className="rounded-card border border-line p-4 dark:border-line-dark">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {ACCESS_STEPS.map((s, i) => (
            <div
              key={s.id}
              className={cn("h-2 flex-1 min-w-[16px] rounded-full transition-colors", i <= stepIndex ? "bg-subject-it" : "bg-ink/10 dark:bg-bone/10")}
              aria-hidden
            />
          ))}
        </div>
        <p className="text-xs font-mono uppercase tracking-wide text-subject-it">Step {stepIndex + 1} of {ACCESS_STEPS.length}</p>
        <p className="mt-1 text-sm font-medium text-ink dark:text-bone">{step.title}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{step.description(resident)}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setPlaying((p) => !p)}
            disabled={stepIndex === ACCESS_STEPS.length - 1 && !playing}
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-subject-it px-3 text-xs font-medium text-paper hover:opacity-90 disabled:opacity-40"
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />} {playing ? "Pause" : "Play"}
          </button>
          <button
            onClick={() => setStepIndex((i) => Math.min(ACCESS_STEPS.length - 1, i + 1))}
            disabled={stepIndex === ACCESS_STEPS.length - 1}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-medium text-ink hover:border-ink/40 disabled:opacity-40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40"
          >
            <StepForward className="h-3.5 w-3.5" /> Step
          </button>
          <button
            onClick={reset}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-medium text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
          <div className="ml-auto flex gap-1">
            {SPEEDS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSpeedId(s.id)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium",
                  speedId === s.id ? "border-ink dark:border-bone" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
