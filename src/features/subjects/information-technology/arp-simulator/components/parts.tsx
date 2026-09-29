"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Panel } from "../../osi-model-explorer/components/ui";
import type { PlaySpeed } from "../../osi-model-explorer/hooks/use-step-player";
import type { ArpLab } from "../hooks/use-arp-lab";
import { CHAIN, OUTCOME_LABEL, lookupEntry, nextHopFor, nodeById, scenarioById, type ChainStage, type Outcome, type Run } from "../model";

// ---------------------------------------------------------------------------
// Collapsible — keeps long inspectors out of the way on small screens
// ---------------------------------------------------------------------------

export function Collapsible({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-card border border-line bg-white/60 dark:border-line-dark dark:bg-white/[0.03]">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex min-h-[44px] w-full items-center justify-between gap-2 px-3.5 py-2 text-left"
      >
        <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{title}</span>
        <span className="text-xs text-ink-soft dark:text-bone-soft" aria-hidden>
          {open ? "Hide ▲" : "Show ▼"}
        </span>
      </button>
      {open && <div className="border-t border-line p-3.5 dark:border-line-dark">{children}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// The key chain: Destination IP → ARP Cache → ARP Request → ARP Reply → MAC → Frame → Data
// ---------------------------------------------------------------------------

const SKIPPED: Record<Outcome, ChainStage[]> = {
  resolved: [],
  hit: ["request", "reply"],
  "hit-wrong": ["request", "reply"],
  unanswered: ["reply", "frame", "data"],
};

export function ChainStrip({ run, stage }: { run: Run | null; stage: ChainStage | null }) {
  const skipped = run ? SKIPPED[run.outcome] : [];
  const currentIdx = stage ? CHAIN.findIndex((c) => c.id === stage) : -1;
  return (
    <ol className="flex flex-wrap items-center gap-1.5" aria-label="ARP resolution chain">
      {CHAIN.map((c, i) => {
        const isSkipped = skipped.includes(c.id);
        const isCurrent = i === currentIdx;
        const isDone = currentIdx > i && !isSkipped;
        return (
          <li key={c.id} className="flex items-center gap-1.5">
            <span
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                isCurrent && "border-subject-it bg-subject-it text-paper",
                isDone && "border-emerald-400/70 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300",
                isSkipped && "border-dashed border-line text-ink-soft line-through opacity-60 dark:border-line-dark dark:text-bone-soft",
                !isCurrent && !isDone && !isSkipped && "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
              )}
            >
              {c.label}
              {isSkipped && <span className="sr-only"> (skipped in this run)</span>}
            </span>
            {i < CHAIN.length - 1 && <span className="text-ink-soft/60 dark:text-bone-soft/60" aria-hidden>→</span>}
          </li>
        );
      })}
    </ol>
  );
}

// ---------------------------------------------------------------------------
// "PC-A knows: Destination IP / Destination MAC"
// ---------------------------------------------------------------------------

export function KnowledgeCard({ lab }: { lab: ArpLab }) {
  const src = nodeById(lab.nodes, lab.srcId)!;
  const dest = lab.destCheck.ok ? lab.destCheck.ip : lab.destIp.trim() || "—";
  const hop = lab.destCheck.ok ? nextHopFor(src, lab.destCheck.ip) : null;
  const entry = hop ? lookupEntry(lab.caches[lab.srcId], hop.nextHopIp) : undefined;
  const remote = hop && !hop.local;

  return (
    <Panel title={`${src.name} knows`}>
      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs text-ink-soft dark:text-bone-soft">Destination IP</dt>
          <dd className="font-mono font-semibold text-ink dark:text-bone">{dest}</dd>
        </div>
        <div>
          <dt className="text-xs text-ink-soft dark:text-bone-soft">{remote ? `Destination MAC (needed: gateway ${hop.nextHopIp})` : "Destination MAC"}</dt>
          <dd className={cn("font-mono font-semibold", entry ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300")}>{entry ? entry.mac : "Unknown"}</dd>
        </div>
      </dl>
      {remote && <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">{dest} is on another network, so {src.name} needs the MAC address of its default gateway, not of {dest}.</p>}
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Current step — deliberately large
// ---------------------------------------------------------------------------

export function StepBanner({ lab }: { lab: ArpLab }) {
  const { run, step, stepIndex } = lab;
  if (!run || !step) {
    const preset = scenarioById(lab.scenario);
    return (
      <div className="rounded-card border border-dashed border-line p-4 dark:border-line-dark">
        <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Ready</p>
        <p className="mt-1 text-sm text-ink dark:text-bone">{preset.blurb}</p>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">
          <span className="font-medium text-ink dark:text-bone">What to expect:</span> {preset.expect}
        </p>
      </div>
    );
  }
  const last = stepIndex >= run.steps.length - 1;
  const failed = last && (run.outcome === "unanswered" || run.outcome === "hit-wrong");
  return (
    <div
      className={cn(
        "rounded-card border-2 p-4",
        failed ? "border-red-400/70 bg-red-50 dark:border-red-500/40 dark:bg-red-500/10" : "border-subject-it bg-subject-it-soft dark:bg-subject-it/15",
      )}
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn("rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold text-paper", failed ? "bg-red-500" : "bg-subject-it")}>
          Step {stepIndex + 1} of {run.steps.length}
        </span>
        {last && <span className="text-xs font-medium text-ink-soft dark:text-bone-soft">{OUTCOME_LABEL[run.outcome]}</span>}
      </div>
      <h3 className="mt-2 font-display text-lg font-medium text-ink dark:text-bone sm:text-xl">{step.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{step.explain}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ordered step list
// ---------------------------------------------------------------------------

export function StepList({ run, stepIndex }: { run: Run | null; stepIndex: number }) {
  if (!run) return <p className="text-sm text-ink-soft dark:text-bone-soft">The steps of the run appear here once it starts.</p>;
  return (
    <ol className="flex flex-col gap-1.5">
      {run.steps.map((s, i) => {
        const state = i < stepIndex ? "done" : i === stepIndex ? "current" : "todo";
        return (
          <li
            key={i}
            aria-current={state === "current" ? "step" : undefined}
            className={cn(
              "flex items-start gap-2 rounded-lg border px-2.5 py-1.5 text-xs",
              state === "current" && "border-subject-it bg-subject-it-soft font-medium text-ink dark:bg-subject-it/15 dark:text-bone",
              state === "done" && "border-emerald-400/50 text-ink dark:border-emerald-500/30 dark:text-bone",
              state === "todo" && "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
            )}
          >
            <span className="mt-px font-mono text-[10px]">{state === "done" ? "✓" : i + 1}</span>
            <span>{s.title}</span>
          </li>
        );
      })}
    </ol>
  );
}

// ---------------------------------------------------------------------------
// Play / Pause / Step / Back / Reset
// ---------------------------------------------------------------------------

const SPEEDS: PlaySpeed[] = [0.5, 1, 1.5, 2];

export function Controls({ lab }: { lab: ArpLab }) {
  const { run, player } = lab;
  const canStart = lab.destCheck.ok;
  const finished = !!run && player.isFinished && !player.isPlaying && player.stepIndex >= 0;

  function play() {
    if (!run) lab.start("auto");
    else player.playPause();
  }
  function step() {
    if (!run) lab.start("step");
    else player.stepForward();
  }
  const btn = "min-h-[44px] rounded-full border px-4 text-sm font-medium transition-colors disabled:opacity-40";
  const plain = "border-line text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone";

  return (
    <div className="sticky bottom-2 z-20 flex flex-wrap items-center gap-2 rounded-card border border-line bg-paper/95 p-2.5 shadow-sm backdrop-blur dark:border-line-dark dark:bg-chalkboard/95" role="group" aria-label="Playback controls">
      <button onClick={play} disabled={!canStart} className={cn(btn, "border-subject-it bg-subject-it text-paper")}>
        {run ? (player.isPlaying ? "Pause" : player.playLabel) : "Play"}
      </button>
      <button onClick={player.stepBack} disabled={!run || player.stepIndex <= 0} className={cn(btn, plain)} aria-label="Previous step">
        ◀ Back
      </button>
      <button onClick={step} disabled={!canStart || (!!run && player.isFinished)} className={cn(btn, plain)}>
        Step ▶
      </button>
      <button onClick={lab.resetScenario} className={cn(btn, plain)}>
        Reset
      </button>
      {finished && (
        <button onClick={() => lab.start("auto")} disabled={!canStart} className={cn(btn, "border-emerald-500 text-emerald-700 dark:text-emerald-300")}>
          Send another message
        </button>
      )}
      <label className="ml-auto flex items-center gap-1.5 text-xs text-ink-soft dark:text-bone-soft">
        Speed
        <select
          value={player.speed}
          onChange={(e) => player.setSpeed(Number(e.target.value) as PlaySpeed)}
          className="min-h-[36px] rounded-lg border border-line bg-paper px-2 text-xs text-ink dark:border-line-dark dark:bg-chalkboard dark:text-bone"
        >
          {SPEEDS.map((s) => (
            <option key={s} value={s}>
              {s}×
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
