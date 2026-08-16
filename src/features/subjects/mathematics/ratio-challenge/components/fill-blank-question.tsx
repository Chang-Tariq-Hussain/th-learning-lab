"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MissingValueQuestion, SimplifyQuestion } from "../types";

export interface FillBlankQuestionProps {
  question: SimplifyQuestion | MissingValueQuestion;
  locked: boolean;
  correct: boolean | null;
  onSubmit: (correct: boolean) => void;
}

function Term({
  value,
  editable,
  wrong,
  locked,
  onChange,
  label,
}: {
  value: string;
  editable: boolean;
  wrong: boolean;
  locked: boolean;
  onChange?: (value: string) => void;
  label: string;
}) {
  if (!editable) {
    return (
      <span className="flex h-14 min-w-14 items-center justify-center px-2 font-display text-3xl font-medium tabular-nums text-ink dark:text-bone">
        {value}
      </span>
    );
  }

  return (
    <input
      type="number"
      inputMode="numeric"
      value={value}
      disabled={locked}
      onChange={(event) => onChange?.(event.target.value)}
      aria-label={label}
      className={cn(
        "h-14 w-16 rounded-xl border-2 bg-transparent text-center font-display text-3xl font-medium tabular-nums outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-pine-500 disabled:opacity-80",
        "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
        wrong
          ? "border-subject-physics text-subject-physics"
          : locked
            ? "border-subject-chemistry text-subject-chemistry"
            : "border-ink/20 text-subject-math dark:border-bone/25",
      )}
    />
  );
}

export function FillBlankQuestion({ question, locked, correct, onSubmit }: FillBlankQuestionProps) {
  const isSimplify = question.kind === "simplify";
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");

  const filled = isSimplify ? left.trim() !== "" && right.trim() !== "" : left.trim() !== "";

  const handleCheck = () => {
    if (!filled || locked) return;
    if (isSimplify) {
      const q = question as SimplifyQuestion;
      const ok = Number(left) === q.answerA && Number(right) === q.answerB;
      onSubmit(ok);
    } else {
      const q = question as MissingValueQuestion;
      const ok = Number(left) === q.answer;
      onSubmit(ok);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {isSimplify ? (
        <div className="flex items-center gap-3">
          <Term
            value={left}
            editable
            wrong={correct === false}
            locked={locked}
            onChange={setLeft}
            label="First term of simplified ratio"
          />
          <span className="font-display text-3xl font-medium text-ink-soft dark:text-bone-soft">:</span>
          <Term
            value={right}
            editable
            wrong={correct === false}
            locked={locked}
            onChange={setRight}
            label="Second term of simplified ratio"
          />
        </div>
      ) : (
        <MissingValueRow
          question={question as MissingValueQuestion}
          value={left}
          wrong={correct === false}
          locked={locked}
          onChange={setLeft}
        />
      )}

      {!locked && (
        <Button size="sm" onClick={handleCheck} disabled={!filled}>
          Check answer
        </Button>
      )}
    </div>
  );
}

function MissingValueRow({
  question,
  value,
  wrong,
  locked,
  onChange,
}: {
  question: MissingValueQuestion;
  value: string;
  wrong: boolean;
  locked: boolean;
  onChange: (value: string) => void;
}) {
  const slots: Array<"a" | "b" | "c" | "d"> = ["a", "b", "c", "d"];
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {slots.map((slot, i) => (
        <div key={slot} className="flex items-center gap-2 sm:gap-3">
          {slot === question.missing ? (
            <Term value={value} editable wrong={wrong} locked={locked} onChange={onChange} label="Missing value" />
          ) : (
            <Term value={String(question[slot])} editable={false} wrong={false} locked={locked} label={slot} />
          )}
          {i === 1 ? (
            <span className="px-1 font-display text-2xl font-medium text-ink-soft dark:text-bone-soft">=</span>
          ) : i < 3 ? (
            <span className="font-display text-2xl font-medium text-ink-soft dark:text-bone-soft">:</span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
