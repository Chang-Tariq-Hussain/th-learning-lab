"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RULE_LABELS, RULE_SELECTOR_QUESTIONS, type RuleId } from "../derivative-rules-model";

const RULE_IDS = Object.keys(RULE_LABELS) as RuleId[];

export function RuleSelectorPanel() {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<RuleId | null>(null);

  const question = RULE_SELECTOR_QUESTIONS[index]!;
  const isLast = index === RULE_SELECTOR_QUESTIONS.length - 1;

  const handlePick = (id: RuleId) => {
    if (picked) return;
    setPicked(id);
  };

  const handleNext = () => {
    setPicked(null);
    setIndex((i) => Math.min(RULE_SELECTOR_QUESTIONS.length - 1, i + 1));
  };
  const handleRestart = () => {
    setPicked(null);
    setIndex(0);
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-5">
      <p className="max-w-xl text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Recognizing the structure of an expression is the real skill — once you know which rule applies,
        the calculation is the easy part.
      </p>

      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">
        Expression {index + 1} of {RULE_SELECTOR_QUESTIONS.length}
      </span>

      <div className="rounded-card border border-line bg-white/60 px-6 py-4 dark:border-line-dark dark:bg-white/[0.03]">
        <BlockMath math={question.latex} />
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {RULE_IDS.map((id) => {
          const isChosen = picked === id;
          const revealCorrect = picked !== null && id === question.correct;
          return (
            <button
              key={id}
              type="button"
              onClick={() => handlePick(id)}
              disabled={picked !== null}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                revealCorrect
                  ? "border-pine-500 bg-pine-50 text-pine-700 dark:border-pine-300 dark:bg-pine-900/30 dark:text-pine-300"
                  : isChosen
                    ? "border-amber-500 bg-amber-50 text-amber-700 dark:border-amber-400 dark:bg-amber-900/20 dark:text-amber-300"
                    : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
                picked !== null && "cursor-default",
              )}
            >
              {RULE_LABELS[id]}
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
          This needs the {RULE_LABELS[question.correct]}.
        </p>
      ) : null}

      {isLast && picked !== null ? (
        <Button variant="primary" size="sm" onClick={handleRestart}>
          Restart
        </Button>
      ) : (
        <Button variant="secondary" size="sm" onClick={handleNext} disabled={picked === null}>
          Next Expression
        </Button>
      )}
    </div>
  );
}
