"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  DELETE_DISCLAIMER,
  DELETE_FILE_STEPS,
  OPEN_FILE_STEPS,
  OPEN_LOAD_DISCLAIMER,
  ORGANIZATION_CONCEPTS,
  ORGANIZATION_DISCLAIMER,
  SAVE_FILE_STEPS,
  type OperationStep,
} from "../model";

type OperationKind = "open" | "save" | "delete";

const OPERATIONS: { id: OperationKind; label: string; steps: OperationStep[]; note?: string }[] = [
  { id: "open", label: "Open File", steps: OPEN_FILE_STEPS, note: OPEN_LOAD_DISCLAIMER },
  { id: "save", label: "Save File", steps: SAVE_FILE_STEPS },
  { id: "delete", label: "Delete File", steps: DELETE_FILE_STEPS, note: DELETE_DISCLAIMER },
];

export function FileOperationsLab() {
  const [operation, setOperation] = useState<OperationKind>("open");
  const [stepIndex, setStepIndex] = useState(0);

  const current = OPERATIONS.find((o) => o.id === operation)!;
  const step = current.steps[stepIndex]!;

  const selectOperation = (id: OperationKind) => {
    setOperation(id);
    setStepIndex(0);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-sm font-medium text-ink dark:text-bone">File system organization</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {ORGANIZATION_CONCEPTS.map((c) => (
            <div key={c.id} className="rounded-md border border-line p-3 text-sm dark:border-line-dark">
              <p className="font-medium text-ink dark:text-bone">{c.title}</p>
              <p className="mt-0.5 text-ink-soft dark:text-bone-soft">{c.description}</p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">{ORGANIZATION_DISCLAIMER}</p>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ink dark:text-bone">Trace an operation</p>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="File operation">
          {OPERATIONS.map((o) => (
            <button
              key={o.id}
              role="tab"
              aria-selected={operation === o.id}
              onClick={() => selectOperation(o.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                operation === o.id
                  ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                  : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-card border border-line p-4 dark:border-line-dark">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {current.steps.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setStepIndex(i)}
                className={cn(
                  "h-2 flex-1 min-w-[16px] rounded-full transition-colors",
                  i <= stepIndex ? "bg-subject-it" : "bg-ink/10 dark:bg-bone/10",
                )}
                aria-label={`Step ${i + 1}: ${s.title}`}
              />
            ))}
          </div>
          <p className="text-xs font-mono uppercase tracking-wide text-subject-it">Step {stepIndex + 1} of {current.steps.length}</p>
          <p className="mt-1 text-sm font-medium text-ink dark:text-bone">{step.title}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{step.description}</p>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
              disabled={stepIndex === 0}
              className="inline-flex h-8 items-center rounded-full border border-line px-3 text-xs font-medium text-ink hover:border-ink/40 disabled:opacity-40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40"
            >
              Back
            </button>
            <button
              onClick={() => setStepIndex((i) => Math.min(current.steps.length - 1, i + 1))}
              disabled={stepIndex === current.steps.length - 1}
              className="inline-flex h-8 items-center rounded-full bg-subject-it px-3 text-xs font-medium text-paper hover:opacity-90 disabled:opacity-40"
            >
              Next step
            </button>
          </div>
        </div>
        {current.note && <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">{current.note}</p>}
      </div>
    </div>
  );
}
