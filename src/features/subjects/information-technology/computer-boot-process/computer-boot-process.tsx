"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Play, Pause, RotateCcw, StepForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { StageTimeline } from "./components/stage-timeline";
import { ComputerDiagram } from "./components/computer-diagram";
import {
  BOOT_STAGES,
  BOOT_SEQUENCE_DISCLAIMER,
  BOOT_PROBLEM_SCENARIOS,
  BOOT_PROBLEM_DISCLAIMER,
  getStageByOrder,
  type BootStageId,
} from "./model";

const STEP_DURATION_MS = 2600;

type LabMode = "step-through" | "identify-stage" | "next-stage" | "boot-problems";

const LAB_MODES: { id: LabMode; label: string; blurb: string }[] = [
  { id: "step-through", label: "Step Through Boot", blurb: "Start, pause, step, or reset the full startup sequence and inspect any stage." },
  { id: "identify-stage", label: "Identify the Stage", blurb: "The simulation pauses at a random point — say what's happening right now." },
  { id: "next-stage", label: "What Comes Next?", blurb: "Given a stage, predict which one runs immediately after it." },
  { id: "boot-problems", label: "Boot Problems", blurb: "Match a startup symptom to the stage it points to (educational only, not real troubleshooting)." },
];

export function ComputerBootProcess() {
  const [mode, setMode] = useState<LabMode>("step-through");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Computer Startup Laboratory mode">
        {LAB_MODES.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={mode === m.id}
            onClick={() => setMode(m.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              mode === m.id
                ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-ink-soft dark:text-bone-soft">{LAB_MODES.find((m) => m.id === mode)!.blurb}</p>

      <div className="rounded-card border border-line bg-paper p-3 dark:border-line-dark dark:bg-chalkboard sm:p-5">
        {mode === "step-through" && <StepThroughMode />}
        {mode === "identify-stage" && <IdentifyStageMode />}
        {mode === "next-stage" && <NextStageMode />}
        {mode === "boot-problems" && <BootProblemsMode />}
      </div>

      <p className="text-xs text-ink-soft dark:text-bone-soft">{BOOT_SEQUENCE_DISCLAIMER}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step Through Boot — the main simulation
// ---------------------------------------------------------------------------

function StepThroughMode() {
  const [stageOrder, setStageOrder] = useState(-1); // -1 = not started
  const [isPlaying, setIsPlaying] = useState(false);
  const [inspectedId, setInspectedId] = useState<BootStageId | null>(null);

  const isFinished = stageOrder >= BOOT_STAGES.length - 1;
  const currentStage = stageOrder >= 0 ? getStageByOrder(stageOrder) : null;
  const inspectedStage = inspectedId ? BOOT_STAGES.find((s) => s.id === inspectedId) ?? null : currentStage;

  useEffect(() => {
    if (!isPlaying) return;
    if (isFinished) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => setStageOrder((o) => Math.min(o + 1, BOOT_STAGES.length - 1)), STEP_DURATION_MS);
    return () => clearTimeout(timer);
  }, [isPlaying, stageOrder, isFinished]);

  const handlePlayPause = () => {
    if (stageOrder === -1 || isFinished) {
      setStageOrder(0);
      setIsPlaying(true);
      setInspectedId(null);
      return;
    }
    setIsPlaying((p) => !p);
  };

  const handleStep = () => {
    setIsPlaying(false);
    setInspectedId(null);
    setStageOrder((o) => (o === -1 ? 0 : Math.min(o + 1, BOOT_STAGES.length - 1)));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStageOrder(-1);
    setInspectedId(null);
  };

  const playLabel = stageOrder === -1 ? "Start" : isFinished && !isPlaying ? "Replay" : isPlaying ? "Pause" : "Resume";

  return (
    <div className="flex flex-col gap-6">
      <StageTimeline
        reachedOrder={stageOrder + 1}
        activeStageId={inspectedId ?? currentStage?.id ?? null}
        onSelectStage={(id) => setInspectedId(id)}
      />

      <ComputerDiagram activeStageId={inspectedStage?.id ?? null} />

      <div aria-live="polite" className="rounded-card bg-ink/[0.03] p-4 dark:bg-bone/[0.05]">
        {inspectedStage ? (
          <div className="flex flex-col gap-2">
            <p className="font-mono text-xs uppercase tracking-wide text-subject-it">
              Stage {inspectedStage.order + 1} of {BOOT_STAGES.length} · {inspectedStage.label}
            </p>
            <p className="text-sm leading-relaxed text-ink dark:text-bone">
              <span className="font-medium">What happens: </span>
              {inspectedStage.whatHappens}
            </p>
            <p className="text-sm leading-relaxed text-ink dark:text-bone">
              <span className="font-medium">Why it happens: </span>
              {inspectedStage.whyItHappens}
            </p>
            <p className="text-sm leading-relaxed text-ink dark:text-bone">
              <span className="font-medium">Involved: </span>
              {inspectedStage.component}
            </p>
            {inspectedStage.whatComesNext && (
              <p className="text-sm leading-relaxed text-ink dark:text-bone">
                <span className="font-medium">What&apos;s next: </span>
                {inspectedStage.whatComesNext}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-ink-soft dark:text-bone-soft">
            Press Start to boot the system, step by step, or click any stage above at any time to inspect it.
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handlePlayPause}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-subject-it px-5 text-sm font-medium text-paper hover:opacity-90"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {playLabel}
        </button>
        <button
          onClick={handleStep}
          disabled={isFinished}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium text-ink hover:border-ink/40 disabled:opacity-40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40"
        >
          <StepForward className="h-4 w-4" />
          Step
        </button>
        <button
          onClick={handleReset}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Experiment 2 — Identify the Stage
// ---------------------------------------------------------------------------

function randomStageOrder(exclude?: number) {
  let n = Math.floor(Math.random() * BOOT_STAGES.length);
  if (exclude !== undefined && BOOT_STAGES.length > 1) {
    while (n === exclude) n = Math.floor(Math.random() * BOOT_STAGES.length);
  }
  return n;
}

function buildStageChoices(correctOrder: number) {
  const correct = getStageByOrder(correctOrder);
  const pool = BOOT_STAGES.filter((s) => s.id !== correct.id);
  const distractors = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
  return [...distractors, correct].sort(() => Math.random() - 0.5);
}

function IdentifyStageMode() {
  const [targetOrder, setTargetOrder] = useState(() => randomStageOrder());
  const [choices, setChoices] = useState(() => buildStageChoices(targetOrder));
  const [selected, setSelected] = useState<BootStageId | null>(null);
  const [checked, setChecked] = useState(false);

  const target = getStageByOrder(targetOrder);
  const isCorrect = selected === target.id;

  const next = () => {
    const n = randomStageOrder(targetOrder);
    setTargetOrder(n);
    setChoices(buildStageChoices(n));
    setSelected(null);
    setChecked(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <ComputerDiagram activeStageId={target.id} />
      <div className="rounded-card bg-ink/[0.03] p-4 text-center dark:bg-bone/[0.05]">
        <p className="text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">What is happening right now?</p>
        <p className="mt-1 text-sm leading-relaxed text-ink dark:text-bone">{target.whatHappens}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {choices.map((c) => (
          <button
            key={c.id}
            onClick={() => !checked && setSelected(c.id)}
            disabled={checked}
            className={cn(
              "rounded-full border-2 px-3 py-1.5 text-sm font-medium",
              selected === c.id
                ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                : "border-line text-ink dark:border-line-dark dark:text-bone",
              checked && c.id === target.id && "border-emerald-500",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-3">
        {!checked ? (
          <button
            onClick={() => setChecked(true)}
            disabled={!selected}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-subject-it px-4 text-sm font-medium text-paper disabled:opacity-40"
          >
            Check
          </button>
        ) : (
          <button
            onClick={next}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium hover:border-ink/40 dark:border-line-dark dark:hover:border-bone/40"
          >
            Next
          </button>
        )}
      </div>
      {checked && (
        <p className={cn("text-center text-sm font-medium", isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")} aria-live="polite">
          {isCorrect ? "Correct!" : `Not quite — this is the ${target.label} stage.`}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Experiment 3 — What Comes Next?
// ---------------------------------------------------------------------------

function NextStageMode() {
  const [order, setOrder] = useState(() => randomStageOrder(BOOT_STAGES.length - 1));
  const [choices, setChoices] = useState(() => buildStageChoices(Math.min(order + 1, BOOT_STAGES.length - 1)));
  const [selected, setSelected] = useState<BootStageId | null>(null);
  const [checked, setChecked] = useState(false);

  const current = getStageByOrder(order);
  const correctNext = getStageByOrder(Math.min(order + 1, BOOT_STAGES.length - 1));
  const isCorrect = selected === correctNext.id;

  const next = () => {
    // Any order except the final stage (which has no "next" to ask about).
    let n = Math.floor(Math.random() * (BOOT_STAGES.length - 1));
    if (n === order && BOOT_STAGES.length > 2) n = (n + 1) % (BOOT_STAGES.length - 1);
    setOrder(n);
    setChoices(buildStageChoices(n + 1));
    setSelected(null);
    setChecked(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <ComputerDiagram activeStageId={current.id} />
      <div className="rounded-card bg-ink/[0.03] p-4 text-center dark:bg-bone/[0.05]">
        <p className="text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">Current stage</p>
        <p className="font-display text-2xl font-semibold text-subject-it">{current.label}</p>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">Which stage runs immediately after this one?</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {choices.map((c) => (
          <button
            key={c.id}
            onClick={() => !checked && setSelected(c.id)}
            disabled={checked}
            className={cn(
              "rounded-full border-2 px-3 py-1.5 text-sm font-medium",
              selected === c.id
                ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                : "border-line text-ink dark:border-line-dark dark:text-bone",
              checked && c.id === correctNext.id && "border-emerald-500",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-3">
        {!checked ? (
          <button
            onClick={() => setChecked(true)}
            disabled={!selected}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-subject-it px-4 text-sm font-medium text-paper disabled:opacity-40"
          >
            Check
          </button>
        ) : (
          <button
            onClick={next}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium hover:border-ink/40 dark:border-line-dark dark:hover:border-bone/40"
          >
            Next
          </button>
        )}
      </div>
      {checked && (
        <p className={cn("text-center text-sm font-medium", isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")} aria-live="polite">
          {isCorrect ? "Correct!" : `Not quite — ${correctNext.label} runs next.`}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Experiment 4 — Boot Problem Concept
// ---------------------------------------------------------------------------

function BootProblemsMode() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<BootStageId | null>(null);
  const [checked, setChecked] = useState(false);

  const scenario = BOOT_PROBLEM_SCENARIOS[index]!;
  const choices = useMemo(() => buildStageChoices(BOOT_STAGES.find((s) => s.id === scenario.affectedStageId)!.order), [scenario]);
  const isCorrect = selected === scenario.affectedStageId;

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % BOOT_PROBLEM_SCENARIOS.length);
    setSelected(null);
    setChecked(false);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-card bg-ink/[0.03] p-4 dark:bg-bone/[0.05]">
        <p className="text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">{scenario.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink dark:text-bone">{scenario.symptom}</p>
      </div>
      <p className="text-center text-sm text-ink-soft dark:text-bone-soft">Which stage does this problem point to?</p>
      <div className="flex flex-wrap justify-center gap-2">
        {choices.map((c) => (
          <button
            key={c.id}
            onClick={() => !checked && setSelected(c.id)}
            disabled={checked}
            className={cn(
              "rounded-full border-2 px-3 py-1.5 text-sm font-medium",
              selected === c.id
                ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                : "border-line text-ink dark:border-line-dark dark:text-bone",
              checked && c.id === scenario.affectedStageId && "border-emerald-500",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-3">
        {!checked ? (
          <button
            onClick={() => setChecked(true)}
            disabled={!selected}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-subject-it px-4 text-sm font-medium text-paper disabled:opacity-40"
          >
            Check
          </button>
        ) : (
          <button
            onClick={next}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium hover:border-ink/40 dark:border-line-dark dark:hover:border-bone/40"
          >
            Next Scenario
          </button>
        )}
      </div>
      {checked && (
        <p className={cn("text-center text-sm font-medium", isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")} aria-live="polite">
          {scenario.explanation}
        </p>
      )}
      <p className="text-center text-xs text-ink-soft dark:text-bone-soft">{BOOT_PROBLEM_DISCLAIMER}</p>
    </div>
  );
}
