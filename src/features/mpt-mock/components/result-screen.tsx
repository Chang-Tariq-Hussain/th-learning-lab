"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { MptMockDefinition } from "../data/mpt-mock-data";
import { formatClock } from "../engine";
import type { MockResult } from "../engine";

interface Props {
  mock: MptMockDefinition;
  result: MockResult;
  timeUsedSeconds: number;
  autoSubmitted: boolean;
  onReview: () => void;
  onRestart: () => void;
}

export function ResultScreen({ mock, result, timeUsedSeconds, autoSubmitted, onReview, onRestart }: Props) {
  return (
    <div className="mx-auto max-w-4xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">{mock.title}</p>
      <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone">CSS MPT MOCK RESULT</h1>
      {autoSubmitted ? (
        <p className="mt-3 rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-2 text-sm text-ink dark:text-bone">
          Time expired - the test was submitted automatically.
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-line p-5 dark:border-line-dark">
          <p className="font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Score</p>
          <p className="mt-1 font-display text-4xl text-ink dark:text-bone">{result.score} / {result.total}</p>
          <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">Percentage: {result.percentage}%</p>
        </div>
        <div className="rounded-xl border border-line p-5 dark:border-line-dark">
          <p className="font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Status</p>
          <p className={cn("mt-1 font-display text-4xl", result.passed ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>
            {result.passed ? "PASS" : "FAIL"}
          </p>
          <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">
            Passing Marks: {result.passMarks}{result.passed ? "" : ` · ${result.passMarks - result.score} short`}
          </p>
        </div>
        <div className="rounded-xl border border-line p-5 dark:border-line-dark">
          <p className="font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Time Used</p>
          <p className="mt-1 font-mono text-3xl tabular-nums text-ink dark:text-bone">{formatClock(timeUsedSeconds)}</p>
          <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">of {formatClock(mock.timeMinutes * 60)}</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-ink dark:text-bone">
        Correct: <strong>{result.correct}</strong> · Incorrect: <strong>{result.incorrect}</strong> · Unanswered: <strong>{result.unanswered}</strong>
      </p>

      <h2 className="mt-8 font-display text-xl text-ink dark:text-bone">Performance by section</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-ink-soft dark:border-line-dark dark:text-bone-soft">
              <th className="py-2 font-medium">Section</th>
              <th className="py-2 text-right font-medium">Score</th>
              <th className="py-2 text-right font-medium">Accuracy</th>
              <th className="py-2 text-right font-medium">Correct</th>
              <th className="py-2 text-right font-medium">Incorrect</th>
              <th className="py-2 text-right font-medium">Unanswered</th>
            </tr>
          </thead>
          <tbody className="text-ink dark:text-bone">
            {result.sections.map((s) => (
              <tr key={s.code} className="border-b border-line/60 dark:border-line-dark/60">
                <td className="py-2">{s.subject}</td>
                <td className="py-2 text-right font-medium">{s.correct} / {s.total}</td>
                <td className="py-2 text-right">{s.accuracy}%</td>
                <td className="py-2 text-right">{s.correct}</td>
                <td className="py-2 text-right">{s.incorrect}</td>
                <td className="py-2 text-right">{s.unanswered}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">Accuracy = correct ÷ attempted.</p>

      <h2 className="mt-8 font-display text-xl text-ink dark:text-bone">Weak areas</h2>
      {result.weakAreas.length === 0 ? (
        <p className="mt-2 text-sm text-ink-soft dark:text-bone-soft">No topic with two or more questions fell below 60%.</p>
      ) : (
        <ul className="mt-3 space-y-1.5 text-sm text-ink dark:text-bone">
          {result.weakAreas.map((w) => (
            <li key={`${w.subject}-${w.topic}`} className="flex justify-between gap-4 border-b border-line/60 py-1.5 dark:border-line-dark/60">
              <span><span className="text-ink-soft dark:text-bone-soft">{w.subject}:</span> {w.topic}</span>
              <span className="tabular-nums">{w.correct} / {w.total} ({w.percent}%)</span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">Topics with at least 2 questions under 60%, counting unanswered as missed.</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={onReview}>Review all questions</Button>
        <Button variant="secondary" onClick={onRestart}>Start a new attempt</Button>
      </div>
    </div>
  );
}
