"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, Database, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ALGORITHM_LABELS,
  ONLINE_ALGORITHMS,
  PAGE_FAULT_NOTE,
  accessVirtualAddress,
  type AccessResult,
  type Algorithm,
  type MachineState,
} from "../model";

interface DemandPagingLabProps {
  machine: MachineState;
  algorithm: Algorithm;
  onChangeAlgorithm: (algorithm: Algorithm) => void;
  onCommit: (next: MachineState) => void;
  onReset: () => void;
}

const STEP_MS = 900;

/**
 * Brief §8, §9, §10: request any page and watch what happens. Pages
 * that are not resident produce a page fault, get fetched from
 * backing storage, and — once RAM is full — evict a victim chosen by
 * the selected policy.
 *
 * Playback advances a stored step list on a single timer. The new
 * machine state is committed upward on the final step, so the Pages &
 * Frames view and this one never disagree about what is in RAM.
 */
export function DemandPagingLab({ machine, algorithm, onChangeAlgorithm, onCommit, onReset }: DemandPagingLabProps) {
  const { entries, frames, config } = machine;
  const [run, setRun] = useState<AccessResult | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const committedRef = useRef(false);

  const request = useCallback(
    (page: number) => {
      const address = page * config.pageSizeBytes;
      const result = accessVirtualAddress(machine, address, { algorithm });
      committedRef.current = false;
      setRun(result);
      setStepIndex(0);
    },
    [machine, algorithm, config.pageSizeBytes],
  );

  // Auto-advance through the narration of the access that was just
  // requested, then stop. One timer, cleared on unmount or restart.
  useEffect(() => {
    if (!run) return;
    if (stepIndex >= run.steps.length - 1) return;
    const id = setTimeout(() => setStepIndex((i) => i + 1), STEP_MS);
    return () => clearTimeout(id);
  }, [run, stepIndex]);

  useEffect(() => {
    if (!run || committedRef.current) return;
    if (stepIndex < run.steps.length - 1) return;
    committedRef.current = true;
    onCommit(run.next);
  }, [run, stepIndex, onCommit]);

  const currentStep = run?.steps[stepIndex];
  const faultRate = machine.accesses === 0 ? 0 : machine.faults / machine.accesses;
  const activePage = currentStep?.highlight.page ?? null;
  const activeFrame = currentStep?.highlight.frame ?? null;
  const victimPage = currentStep?.highlight.victimPage ?? null;
  const storageActive = currentStep?.highlight.storage ?? false;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-ink-soft dark:text-bone-soft">
        Demand paging means a page is loaded into RAM at the moment it is first needed, not when the program starts. Request
        pages below and watch physical memory fill up — then keep going once every frame is taken.
      </p>

      {/* ---------------- Request buttons ---------------- */}
      <div>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
          Program pages — tap one to have the CPU request it
        </p>
        <div className="flex flex-wrap gap-1.5">
          {entries.map((entry) => (
            <button
              key={entry.page}
              onClick={() => request(entry.page)}
              className={cn(
                "min-w-[68px] rounded-lg border px-3 py-2 text-left transition-colors",
                entry.present
                  ? "border-subject-it bg-subject-it-soft dark:bg-subject-it/20"
                  : "border-dashed border-line dark:border-line-dark",
                activePage === entry.page && "ring-2 ring-subject-it ring-offset-1 ring-offset-paper dark:ring-offset-chalkboard",
              )}
            >
              <span className="block font-mono text-xs font-semibold text-ink dark:text-bone">Page {entry.page}</span>
              <span className="block font-mono text-[9px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
                {entry.present ? `frame ${entry.frame}` : "on storage"}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* ---------------- Physical RAM ---------------- */}
        <section aria-label="Physical RAM contents">
          <h3 className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-subject-it">Physical RAM</h3>
          <ul className="flex flex-col gap-1.5">
            {frames.map((page, frameIndex) => (
              <li
                key={frameIndex}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-lg border px-3 py-2 transition-colors",
                  activeFrame === frameIndex
                    ? "border-subject-it bg-subject-it-soft dark:bg-subject-it/20"
                    : page === null
                      ? "border-dashed border-line dark:border-line-dark"
                      : "border-line dark:border-line-dark",
                  victimPage !== null && page === victimPage && "border-amber-500 bg-amber-500/10",
                )}
              >
                <span className="font-mono text-xs font-semibold text-ink dark:text-bone">Frame {frameIndex}</span>
                <span className="font-mono text-[11px] text-ink-soft dark:text-bone-soft">
                  {page === null ? "free" : `page ${page}`}
                  {victimPage !== null && page === victimPage ? " · being replaced" : ""}
                </span>
              </li>
            ))}
          </ul>
          <div
            className={cn(
              "mt-3 flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors",
              storageActive ? "border-subject-it bg-subject-it-soft dark:bg-subject-it/20" : "border-dashed border-line dark:border-line-dark",
            )}
          >
            <Database className="h-4 w-4 shrink-0 text-ink-soft dark:text-bone-soft" aria-hidden />
            <span className="font-mono text-[11px] text-ink-soft dark:text-bone-soft">
              Backing storage · holds every page not currently in a frame
            </span>
          </div>
        </section>

        {/* ---------------- Narration + stats ---------------- */}
        <section aria-label="Access narration and statistics" className="flex flex-col gap-3">
          <div
            className={cn(
              "min-h-[132px] rounded-card border p-4",
              run?.fault ? "border-amber-500/60 bg-amber-500/5" : "border-line dark:border-line-dark",
            )}
          >
            {run && currentStep ? (
              <>
                <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-subject-it">
                  {currentStep.phase === "fault" && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" aria-hidden />}
                  Step {stepIndex + 1} of {run.steps.length} · {run.fault ? "page fault" : "page hit"}
                </p>
                <p className="mt-1 text-sm font-medium text-ink dark:text-bone">{currentStep.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{currentStep.description}</p>
              </>
            ) : (
              <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
                Only some pages start out in RAM — that is the whole point of demand paging. Request a page that is currently
                on storage and watch the operating system bring it in.
              </p>
            )}
          </div>

          <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: "Accesses", value: machine.accesses },
              { label: "Page hits", value: machine.hits },
              { label: "Page faults", value: machine.faults },
              { label: "Fault rate", value: `${Math.round(faultRate * 100)}%` },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-line px-3 py-2 dark:border-line-dark">
                <dt className="font-mono text-[9px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{stat.label}</dt>
                <dd className="font-mono text-base font-semibold text-ink dark:text-bone">{stat.value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Replacement policy:</span>
            {ONLINE_ALGORITHMS.map((id) => (
              <button
                key={id}
                onClick={() => onChangeAlgorithm(id)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium",
                  algorithm === id
                    ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                    : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
                )}
              >
                {ALGORITHM_LABELS[id]}
              </button>
            ))}
            <button
              onClick={() => {
                setRun(null);
                setStepIndex(0);
                committedRef.current = false;
                onReset();
              }}
              className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-medium text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset memory
            </button>
          </div>
          <p className="text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
            Optimal replacement is not offered here: it needs to know which pages will be referenced in the future, and an
            interactive one-access-at-a-time lab has no future to look at. Compare it against FIFO and LRU in the Reference
            String tab instead.
          </p>
        </section>
      </div>

      <p className="rounded-card border border-dashed border-line px-4 py-3 text-sm leading-relaxed text-ink-soft dark:border-line-dark dark:text-bone-soft">
        {PAGE_FAULT_NOTE}
      </p>
    </div>
  );
}
