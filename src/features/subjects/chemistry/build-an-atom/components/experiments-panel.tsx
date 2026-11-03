"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Circle, Lightbulb, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AtomState } from "../atom-model";
import { CHALLENGES, EXPERIMENTS, checkChallenge, type ChallengeResult, type ExperimentId } from "../experiments";
import { ComparePanel } from "./compare-panel";
import type { ShellModelId } from "../shells";

interface ExperimentsPanelProps {
  atom: AtomState;
  shellModel: ShellModelId;
  /** Puts the atom back to hydrogen; used by "Reset experiment". */
  onResetAtom: () => void;
}

const TABS: { id: ExperimentId; short: string }[] = [
  { id: "A", short: "A · Element" },
  { id: "B", short: "B · Isotope" },
  { id: "C", short: "C · Ion" },
  { id: "D", short: "D · Compare" },
  { id: "E", short: "E · Challenge" },
];

const btn = "min-h-11 rounded-full border px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";
const btnOutline = `${btn} border-line text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone`;
const btnPrimary = `${btn} border-pine-500 bg-pine-600 text-paper hover:opacity-90 dark:border-pine-300 dark:bg-pine-300 dark:text-chalkboard`;

/**
 * Optional guided experiments. They never block the simulation: every task is checked against the live atom,
 * so learners can also just play and see the tasks tick off.
 */
export function ExperimentsPanel({ atom, shellModel, onResetAtom }: ExperimentsPanelProps) {
  const [active, setActive] = useState<ExperimentId>("A");
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [hintShown, setHintShown] = useState<Record<string, boolean>>({});

  const [challengeIndex, setChallengeIndex] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [result, setResult] = useState<ChallengeResult | null>(null);
  const [attempts, setAttempts] = useState(0);
  const challenge = CHALLENGES[challengeIndex % CHALLENGES.length]!;

  const experiment = EXPERIMENTS.find((e) => e.id === active);
  // Tasks are done in order: only the first unfinished task is checked, so a later task cannot be ticked by accident.
  const currentTask = useMemo(() => experiment?.tasks.find((t) => !done[t.id]) ?? null, [experiment, done]);

  useEffect(() => {
    if (currentTask && currentTask.done(atom)) setDone((d) => ({ ...d, [currentTask.id]: true }));
  }, [atom, currentTask]);

  // Editing the atom clears an old challenge verdict, so feedback always matches what is on screen.
  useEffect(() => setResult(null), [atom]);

  const resetExperiment = () => {
    if (experiment) {
      setDone((d) => {
        const next = { ...d };
        for (const t of experiment.tasks) delete next[t.id];
        return next;
      });
      setHintShown({});
    }
    setResult(null);
    setHintLevel(0);
    setAttempts(0);
    onResetAtom();
  };

  return (
    <section aria-label="Guided experiments" className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <h3 className="font-display text-base font-medium text-ink dark:text-bone">Guided experiments</h3>
      <p className="mt-1 text-helper text-ink-soft dark:text-bone-soft">Optional. The simulation above works the same with or without them.</p>

      <div role="tablist" aria-label="Experiments" className="-mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`exp-tab-${t.id}`}
            aria-selected={active === t.id}
            aria-controls={`exp-panel-${t.id}`}
            onClick={() => setActive(t.id)}
            className={cn(
              "min-h-11 shrink-0 rounded-full border px-3 text-sm font-medium transition-colors",
              active === t.id ? "border-pine-500 bg-pine-600 text-paper dark:border-pine-300 dark:bg-pine-300 dark:text-chalkboard" : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft",
            )}
          >
            {t.short}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`exp-panel-${active}`} aria-labelledby={`exp-tab-${active}`} className="mt-3 flex flex-col gap-3">
        {experiment ? (
          <>
            <p className="text-sm text-ink-soft dark:text-bone-soft">{experiment.summary}</p>
            <ol className="flex flex-col gap-2">
              {experiment.tasks.map((task) => {
                const complete = !!done[task.id];
                const isCurrent = currentTask?.id === task.id;
                return (
                  <li key={task.id} className={cn("rounded-lg border px-3 py-2", complete ? "border-emerald-500/50 bg-emerald-50 dark:bg-emerald-500/10" : isCurrent ? "border-pine-500/60" : "border-line opacity-70 dark:border-line-dark")}>
                    <div className="flex items-start gap-2">
                      {complete ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" /> : <Circle className="mt-0.5 h-4 w-4 shrink-0 text-ink-soft dark:text-bone-soft" aria-hidden="true" />}
                      <p className="text-sm text-ink dark:text-bone">
                        {task.prompt}
                        <span className="sr-only">{complete ? " Completed." : isCurrent ? " Current task." : " Not started."}</span>
                      </p>
                    </div>
                    {complete ? <p className="mt-1 pl-6 text-sm text-ink-soft dark:text-bone-soft">{task.why}</p> : null}
                    {isCurrent ? (
                      <div className="mt-1 pl-6">
                        {hintShown[task.id] ? (
                          <p className="flex items-start gap-1.5 text-sm text-pine-900 dark:text-pine-50">
                            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                            {task.hint}
                          </p>
                        ) : (
                          <button type="button" onClick={() => setHintShown((h) => ({ ...h, [task.id]: true }))} className="min-h-11 text-sm font-medium text-pine-700 underline decoration-dotted dark:text-pine-300">
                            Show a hint
                          </button>
                        )}
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ol>
            {!currentTask ? (
              <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100">
                Experiment complete. You can reset it to try again, or keep exploring.
              </p>
            ) : null}
            <div>
              <button type="button" onClick={resetExperiment} className={btnOutline}>
                <RotateCcw className="mr-1.5 inline h-4 w-4" aria-hidden="true" />
                Reset experiment
              </button>
            </div>
          </>
        ) : null}

        {active === "D" ? <ComparePanel atom={atom} shellModel={shellModel} /> : null}

        {active === "E" ? (
          <>
            <p className="text-sm text-ink-soft dark:text-bone-soft">Build the target using any combination of the controls, then check it. You can ask for up to three hints.</p>
            <p className="rounded-lg border border-pine-500/50 px-3 py-2 text-base font-medium text-ink dark:text-bone">
              Challenge {(challengeIndex % CHALLENGES.length) + 1} of {CHALLENGES.length}: {challenge.prompt}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={btnPrimary}
                onClick={() => {
                  setResult(checkChallenge(atom, challenge));
                  setAttempts((n) => n + 1);
                }}
              >
                Check my atom
              </button>
              <button type="button" className={btnOutline} disabled={hintLevel >= 3} onClick={() => setHintLevel((h) => Math.min(3, h + 1))}>
                {hintLevel === 0 ? "Hint" : hintLevel >= 3 ? "No more hints" : "Another hint"}
              </button>
              <button
                type="button"
                className={btnOutline}
                onClick={() => {
                  setResult(null);
                  setHintLevel(0);
                  setAttempts(0);
                  onResetAtom();
                }}
              >
                Try again
              </button>
              <button
                type="button"
                className={btnOutline}
                onClick={() => {
                  setChallengeIndex((i) => i + 1);
                  setResult(null);
                  setHintLevel(0);
                  setAttempts(0);
                }}
              >
                Next challenge
              </button>
            </div>
            {hintLevel > 0 ? (
              <ul className="flex flex-col gap-1 text-sm text-pine-900 dark:text-pine-50">
                {challenge.hints.slice(0, hintLevel).map((h, i) => (
                  <li key={h} className="flex items-start gap-1.5">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>
                      <span className="font-medium">Hint {i + 1}:</span> {h}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
            <div role="status" aria-live="polite">
              {result ? (
                result.ok ? (
                  <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100">
                    Correct{attempts > 1 ? ` after ${attempts} tries` : " on the first try"}. Press Next challenge for another target.
                  </p>
                ) : (
                  <ul className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-950 dark:bg-amber-500/10 dark:text-amber-100">
                    {result.messages.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                    <li className="mt-1 font-medium">Not quite yet. Adjust your atom and check again.</li>
                  </ul>
                )
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
