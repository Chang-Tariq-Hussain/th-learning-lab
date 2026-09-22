"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { checkProblemAnswer, generateProblem, type Level, type Problem } from "../model";
import { Btn, Panel, SectionHeading, TextField } from "./ui-bits";

const ANSWER_HINT: Record<Problem["answerIn"], string> = {
  decimal: "Type your answer in decimal.",
  binary: "Type your answer in binary (0s and 1s).",
  octal: "Type your answer in octal (digits 0–7).",
  hex: "Type your answer in hexadecimal (0–9, A–F).",
  twos: "Type the 8-bit pattern (0s and 1s).",
  signed: "Type a signed decimal value, e.g. -5.",
};

export function PracticeLab({ level }: { level: Level }) {
  const [problem, setProblem] = useState<Problem>(() => generateProblem(level));
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ correct: boolean; message?: string } | null>(null);
  const [showSteps, setShowSteps] = useState(false);
  const [streak, setStreak] = useState(0);

  const newQuestion = () => {
    setProblem((prev) => generateProblem(level, Math.random, prev.kind));
    setInput("");
    setResult(null);
    setShowSteps(false);
  };

  const check = () => {
    const outcome = checkProblemAnswer(problem, input);
    if (outcome.correct) {
      setResult({ correct: true });
      setStreak((s) => s + 1);
    } else {
      setResult({ correct: false, message: outcome.message });
      setStreak(0);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Number system practice lab">
        Fresh, exact problems on demand — reason it out, then check your work or peek at the steps.
      </SectionHeading>

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-display text-lg font-medium text-ink dark:text-bone">{problem.question}</p>
          {streak > 1 && <span className="rounded-full bg-subject-it-soft px-3 py-1 text-xs font-medium text-subject-it dark:bg-subject-it/20">Streak: {streak}</span>}
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
          <TextField
            id="practice-answer"
            label={ANSWER_HINT[problem.answerIn]}
            value={input}
            onChange={setInput}
            onSubmit={check}
            error={result && !result.correct ? result.message : null}
            className="flex-1"
          />
          <Btn variant="solid" onClick={check} disabled={input.trim() === ""}>
            Check answer
          </Btn>
        </div>

        {result?.correct && (
          <p className="mt-3 font-medium text-emerald-700 dark:text-emerald-300" aria-live="polite">
            Correct! {problem.answer && <span className="font-mono">({problem.answer})</span>}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <Btn onClick={() => setShowSteps((s) => !s)}>{showSteps ? "Hide steps" : "Show steps"}</Btn>
          <Btn onClick={newQuestion}>
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} /> New question
          </Btn>
        </div>

        {showSteps && (
          <div className={cn("mt-4 flex flex-col gap-1 rounded-card bg-ink/[0.03] p-3 font-mono text-sm text-ink-soft dark:bg-bone/[0.05] dark:text-bone-soft")}>
            {problem.steps.map((s, i) => (
              <p key={i}>{s}</p>
            ))}
            <p className="mt-1 font-semibold text-subject-it">Answer: {problem.answer}</p>
          </div>
        )}
      </Panel>
    </div>
  );
}
