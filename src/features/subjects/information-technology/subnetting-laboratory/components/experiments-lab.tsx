"use client";

import { Panel, SectionHeading } from "../../osi-model-explorer/components/ui";
import { EXPERIMENTS, type Experiment } from "../model";

/** Section 18: five guided experiments (objective, starting state, task, hint, observation, explanation). */
export function ExperimentsLab({ onStart }: { onStart: (exp: Experiment) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="Guided experiments">Five short experiments. &quot;Set up &amp; open&quot; loads the starting state and jumps to the right tab.</SectionHeading>
      <div className="grid gap-4 sm:grid-cols-2">
        {EXPERIMENTS.map((exp) => (
          <Panel key={exp.id} title={exp.title}>
            <div className="flex flex-col gap-2 text-sm">
              {([["Objective", exp.objective], ["Starting state", exp.startingState], ["Your task", exp.task]] as const).map(([l, t]) => (
                <p key={l}><span className="font-medium text-ink dark:text-bone">{l}:</span> <span className="text-ink-soft dark:text-bone-soft">{t}</span></p>
              ))}
              <details className="rounded-card border border-dashed border-line p-2 dark:border-line-dark">
                <summary className="min-h-[36px] cursor-pointer select-none text-xs font-medium text-ink dark:text-bone">Hint</summary>
                <p className="mt-1 text-ink-soft dark:text-bone-soft">{exp.hint}</p>
              </details>
              <details className="rounded-card border border-dashed border-line p-2 dark:border-line-dark">
                <summary className="min-h-[36px] cursor-pointer select-none text-xs font-medium text-ink dark:text-bone">Observation and explanation (after you have tried it)</summary>
                <p className="mt-1"><span className="font-medium text-ink dark:text-bone">Observation:</span> <span className="text-ink-soft dark:text-bone-soft">{exp.observation}</span></p>
                <p className="mt-1"><span className="font-medium text-ink dark:text-bone">Why:</span> <span className="text-ink-soft dark:text-bone-soft">{exp.explanation}</span></p>
              </details>
              <button onClick={() => onStart(exp)} className="mt-1 min-h-[44px] self-start rounded-full border border-subject-it bg-subject-it-soft px-4 py-2 text-xs font-medium text-subject-it dark:bg-subject-it/20">
                Set up &amp; open — {exp.goToLabel}
              </button>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
