"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { LEVELS, type Level } from "../model";
import { EXPERIMENTS, type Experiment } from "../experiments";
import { Btn, Panel, SectionHeading } from "./ui-bits";

function LevelBadge({ level }: { level: Level }) {
  const meta = LEVELS.find((l) => l.id === level)!;
  return <span className="rounded-full border border-line px-2 py-0.5 text-[11px] text-ink-soft dark:border-line-dark dark:text-bone-soft">{meta.label}</span>;
}

function ExperimentCard({ exp, onOpen }: { exp: Experiment; onOpen: (e: Experiment) => void }) {
  const [answer, setAnswer] = useState<number | null>(null);
  return (
    <Panel>
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="font-display text-base font-medium text-ink dark:text-bone">{exp.title}</h4>
        <LevelBadge level={exp.level} />
      </div>
      <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">{exp.goal}</p>
      <ol className="mt-2 list-decimal pl-5 text-sm text-ink-soft dark:text-bone-soft">
        {exp.steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      <div className="mt-3">
        <Btn variant="solid" onClick={() => onOpen(exp)}>
          Open in lab
        </Btn>
      </div>
      <div className="mt-4 border-t border-line pt-3 dark:border-line-dark">
        <p className="text-sm font-medium text-ink dark:text-bone">Check your observation</p>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">{exp.check.question}</p>
        <div className="mt-2 flex flex-col gap-1.5" role="group" aria-label={exp.check.question}>
          {exp.check.options.map((o, i) => (
            <button
              key={o}
              type="button"
              onClick={() => setAnswer(i)}
              className={cn(
                "min-h-[40px] rounded-md border px-3 py-1.5 text-left text-sm transition-colors",
                answer === null
                  ? "border-line text-ink hover:border-subject-it dark:border-line-dark dark:text-bone"
                  : i === exp.check.correct
                    ? "border-emerald-500 bg-emerald-500/10 text-ink dark:text-bone"
                    : answer === i
                      ? "border-rose-500 bg-rose-500/10 text-ink dark:text-bone"
                      : "border-line text-ink-soft opacity-70 dark:border-line-dark dark:text-bone-soft",
              )}
            >
              {o}
            </button>
          ))}
        </div>
        {answer !== null && (
          <p className="mt-2 text-sm text-ink-soft dark:text-bone-soft" aria-live="polite">
            {answer === exp.check.correct ? "Correct. " : "Not quite. "}
            {exp.check.explanation}
          </p>
        )}
      </div>
    </Panel>
  );
}

export function ExperimentsTab({ onOpen }: { onOpen: (e: Experiment) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <SectionHeading title="Guided experiments">
        Six short experiments. Each one opens the lab pre-configured (and switches to the level it needs). Read the goal, run it, then check what you observed.
      </SectionHeading>
      <div className="grid gap-4 lg:grid-cols-2">
        {EXPERIMENTS.map((e) => (
          <ExperimentCard key={e.id} exp={e} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}
