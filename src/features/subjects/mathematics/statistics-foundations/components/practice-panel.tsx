"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { QuizPanel } from "./quiz-panel";
import { CLASSIFICATION_QUESTIONS, SAMPLING_QUESTIONS } from "../statistics-model";

type View = "classify" | "sampling";

const VIEWS: { id: View; label: string }[] = [
  { id: "classify", label: "Classify the Data" },
  { id: "sampling", label: "Choose the Best Sampling Method" },
];

/** Level 10 — Practice. Section 10's classification game and Section 11's sampling-method game, one toggle apart. */
export function PracticePanel() {
  const [view, setView] = useState<View>("classify");

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap justify-center gap-2">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setView(v.id)}
            aria-pressed={view === v.id}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              view === v.id
                ? "border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft",
            )}
          >
            {v.label}
          </button>
        ))}
      </div>

      {view === "classify" ? (
        <QuizPanel key="classify" questions={CLASSIFICATION_QUESTIONS} restartLabel="Restart Practice" />
      ) : (
        <QuizPanel key="sampling" questions={SAMPLING_QUESTIONS} restartLabel="Restart Practice" />
      )}
    </div>
  );
}
