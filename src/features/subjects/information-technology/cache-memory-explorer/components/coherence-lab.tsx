"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { COHERENCE_STEPS } from "../content";
import { ActionButton, Callout, LABEL_CLASS, Panel, Segmented } from "./ui-bits";

function CacheSlot({ value, state }: { value: number | null; state: "empty" | "valid" | "invalid" | "stale" }) {
  const label = state === "empty" ? "empty" : state === "invalid" ? "invalid" : `X = ${value}`;
  return (
    <div
      className={cn(
        "mt-2 flex min-h-[52px] flex-col items-center justify-center rounded-lg border-2 px-2 py-1.5 text-center font-mono text-sm transition-colors",
        state === "empty" && "border-dashed border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
        state === "valid" && "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-200",
        state === "invalid" && "border-dashed border-amber-500 bg-amber-50 text-amber-900 line-through dark:bg-amber-500/10 dark:text-amber-200",
        state === "stale" && "border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-500/10 dark:text-rose-200",
      )}
    >
      <span>{label}</span>
      {state === "stale" ? <span className="text-[10px] font-semibold tracking-wide">STALE ✕</span> : null}
      {state === "invalid" ? <span className="text-[10px] font-semibold tracking-wide no-underline">DON’T USE</span> : null}
    </div>
  );
}

export function CoherenceLab() {
  const [step, setStep] = useState(0);
  const [on, setOn] = useState(false);
  const s = COHERENCE_STEPS[step]!;
  const mode = on ? "on" : "off";

  const core2Value = s.core2[mode];
  const core2State: "empty" | "valid" | "invalid" | "stale" =
    core2Value === null ? (on && step === 3 ? "invalid" : "empty") : !on && s.staleRead ? "stale" : !on && step === 3 ? "stale" : "valid";
  const core1State = s.core1 === null ? "empty" : "valid";

  return (
    <div className="flex flex-col gap-5">
      <Callout title="Advanced concept: cache coherence (introduction only)">
        With several CPU cores, each core has its own cache. Multiple caches may hold copies of the same data, so systems need mechanisms to keep those copies coherent. This lab is a conceptual picture — it is not a protocol simulator.
      </Callout>

      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <Segmented
          label="Coherence mechanism"
          options={[
            { value: "off", label: "Off — copies drift apart" },
            { value: "on", label: "On — copies kept coherent" },
          ]}
          value={mode}
          onChange={(v) => setOn(v === "on")}
        />
      </div>

      <Panel title={`Step ${step + 1} of ${COHERENCE_STEPS.length}: ${s.title}`}>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-line p-3 dark:border-line-dark">
            <p className={LABEL_CLASS}>Core 1</p>
            <p className="text-xs text-ink-soft dark:text-bone-soft">its own cache</p>
            <CacheSlot value={s.core1} state={core1State} />
          </div>
          <div className="rounded-lg border border-line p-3 dark:border-line-dark">
            <p className={LABEL_CLASS}>Core 2</p>
            <p className="text-xs text-ink-soft dark:text-bone-soft">its own cache</p>
            <CacheSlot value={core2Value} state={core2State} />
          </div>
        </div>
        <div className="mx-auto h-4 w-0.5 bg-line dark:bg-line-dark" aria-hidden="true" />
        <div className="rounded-lg border border-line p-3 text-center dark:border-line-dark">
          <p className={LABEL_CLASS}>Shared memory (RAM)</p>
          <p className="mt-1 font-mono text-sm text-ink dark:text-bone">X = {s.ramValue}</p>
          <p className="text-[11px] text-ink-soft dark:text-bone-soft">Whether RAM is updated straight away depends on the write policy, which this lab doesn’t model.</p>
        </div>

        <p className={cn("mt-4 rounded-lg border-l-4 px-3 py-2 text-sm", !on && s.staleRead ? "border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-500/10 dark:text-rose-200" : "border-subject-it bg-subject-it-soft text-ink dark:bg-subject-it/10 dark:text-bone")} aria-live="polite">
          {s.note[mode]}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <ActionButton variant="ghost" disabled={step === 0} onClick={() => setStep((n) => Math.max(0, n - 1))}>
            <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Back
          </ActionButton>
          <ActionButton disabled={step === COHERENCE_STEPS.length - 1} onClick={() => setStep((n) => Math.min(COHERENCE_STEPS.length - 1, n + 1))}>
            Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </ActionButton>
          <ActionButton variant="ghost" onClick={() => setStep(0)}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Restart
          </ActionButton>
        </div>
      </Panel>

      <Callout tone="neutral">
        Real multi-core processors keep caches coherent in hardware using protocols that track the state of each cached line. Those protocols are far more detailed than this picture, and they’re not simulated here.
      </Callout>
    </div>
  );
}
