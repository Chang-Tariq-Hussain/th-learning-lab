"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FunctionGraph } from "../../calculus-foundations/components/function-graph";
import { buildColoredSegments, POINT_CHALLENGE_QUESTIONS, type PointClassification } from "../applications-model";

const OPTIONS: { id: PointClassification; label: string }[] = [
  { id: "maximum", label: "Maximum" },
  { id: "minimum", label: "Minimum" },
  { id: "neither", label: "Neither" },
];

/** Section 11 — "Find the Maximum/Minimum". A static graph with one marked point per question; the student classifies it before moving on. */
export function PointChallengePanel() {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<PointClassification | null>(null);

  const question = POINT_CHALLENGE_QUESTIONS[index]!;
  const isLast = index === POINT_CHALLENGE_QUESTIONS.length - 1;
  const y = question.fn.evaluate(question.pointX);

  const handlePick = (id: PointClassification) => {
    if (picked) return;
    setPicked(id);
  };
  const handleNext = () => {
    setPicked(null);
    setIndex((i) => Math.min(POINT_CHALLENGE_QUESTIONS.length - 1, i + 1));
  };
  const handleRestart = () => {
    setPicked(null);
    setIndex(0);
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-5">
      <p className="max-w-md text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Is this point a maximum, minimum, or neither?
      </p>
      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">
        Question {index + 1} of {POINT_CHALLENGE_QUESTIONS.length}
      </span>

      <BlockMath math={question.fn.latex} />

      <div className="aspect-square w-full max-w-sm">
        <FunctionGraph
          segments={buildColoredSegments(question.fn)}
          trackedPoint={{ x: question.pointX, y }}
          ariaLabel="A graph with one marked point to classify."
        />
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {OPTIONS.map((opt) => {
          const isChosen = picked === opt.id;
          const revealCorrect = picked !== null && opt.id === question.correct;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handlePick(opt.id)}
              disabled={picked !== null}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                revealCorrect
                  ? "border-pine-500 bg-pine-50 text-pine-700 dark:border-pine-300 dark:bg-pine-900/30 dark:text-pine-300"
                  : isChosen
                    ? "border-amber-500 bg-amber-50 text-amber-700 dark:border-amber-400 dark:bg-amber-900/20 dark:text-amber-300"
                    : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
                picked !== null && "cursor-default",
              )}
            >
              {opt.label}
              {revealCorrect ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : null}
              {isChosen && !revealCorrect ? <X className="h-3.5 w-3.5" strokeWidth={2.5} /> : null}
            </button>
          );
        })}
      </div>

      {picked !== null ? (
        <p
          className={cn(
            "rounded-card border px-4 py-2.5 text-center text-sm",
            picked === question.correct
              ? "border-pine-500/40 bg-pine-50 text-pine-700 dark:border-pine-300/30 dark:bg-pine-900/20 dark:text-pine-300"
              : "border-amber-500/40 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-900/15 dark:text-amber-300",
          )}
        >
          {picked === question.correct ? "Correct! " : "Not quite. "}
          {question.explanation}
        </p>
      ) : null}

      {isLast && picked !== null ? (
        <Button variant="primary" size="sm" onClick={handleRestart}>
          Restart
        </Button>
      ) : (
        <Button variant="secondary" size="sm" onClick={handleNext} disabled={picked === null}>
          Next Question
        </Button>
      )}
    </div>
  );
}
