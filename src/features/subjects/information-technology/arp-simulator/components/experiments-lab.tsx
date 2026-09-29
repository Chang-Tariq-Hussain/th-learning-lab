"use client";

import { Panel, SectionHeading } from "../../osi-model-explorer/components/ui";
import { EXPERIMENTS, type DetailLevel, type Experiment } from "../model";

const LEVEL_ORDER: DetailLevel[] = ["beginner", "intermediate", "technical"];

/** Guided experiments — objective, starting state, task, hint, observation, explanation. */
export function ExperimentsLab({ level, onStart }: { level: DetailLevel; onStart: (exp: Experiment) => void }) {
  const visible = EXPERIMENTS.filter((e) => LEVEL_ORDER.indexOf(e.minLevel) <= LEVEL_ORDER.indexOf(level));
  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="Guided experiments">
        Five short experiments. &quot;Set up &amp; open&quot; prepares the starting state and jumps to the right tab.
      </SectionHeading>
      <div className="grid gap-4 sm:grid-cols-2">
        {visible.map((exp) => (
          <Panel key={exp.id} title={exp.title}>
            <div className="flex flex-col gap-2 text-sm">
              {(
                [
                  ["Objective", exp.objective],
                  ["Starting state", exp.startingState],
                  ["Your task", exp.task],
                ] as const
              ).map(([label, text]) => (
                <p key={label}>
                  <span className="font-medium text-ink dark:text-bone">{label}:</span> <span className="text-ink-soft dark:text-bone-soft">{text}</span>
                </p>
              ))}
              <details className="rounded-lg border border-line px-3 py-2 dark:border-line-dark">
                <summary className="cursor-pointer text-xs font-medium text-ink dark:text-bone">Hint, observation and explanation</summary>
                <div className="mt-2 flex flex-col gap-2">
                  {(
                    [
                      ["Hint", exp.hint],
                      ["Observation", exp.observation],
                      ["Why", exp.explanation],
                    ] as const
                  ).map(([label, text]) => (
                    <p key={label}>
                      <span className="font-medium text-ink dark:text-bone">{label}:</span> <span className="text-ink-soft dark:text-bone-soft">{text}</span>
                    </p>
                  ))}
                </div>
              </details>
              <button
                onClick={() => onStart(exp)}
                className="mt-1 min-h-[44px] self-start rounded-full border border-subject-it bg-subject-it-soft px-4 py-2 text-xs font-medium text-subject-it dark:bg-subject-it/20"
              >
                Set up &amp; open — {exp.goToLabel}
              </button>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
