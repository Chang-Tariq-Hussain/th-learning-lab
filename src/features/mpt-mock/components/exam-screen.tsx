"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { MptMockDefinition } from "../data/mpt-mock-data";
import type { RunnerQuestion } from "../engine-types";
import { formatClock } from "../engine";
import type { Letter } from "../engine";
import type { StoredSession } from "../storage";
import { QuestionBody } from "./question-body";
import { QuestionPalette } from "./question-palette";

interface Props {
  mock: MptMockDefinition;
  questions: RunnerQuestion[];
  session: StoredSession;
  remainingSeconds: number;
  onAnswer: (id: string, letter: Letter) => void;
  onClear: (id: string) => void;
  onToggleMark: (id: string) => void;
  onGoTo: (index: number) => void;
  onSubmit: () => void;
}

const LETTERS: Letter[] = ["A", "B", "C", "D"];

export function ExamScreen({ mock, questions, session, remainingSeconds, onAnswer, onClear, onToggleMark, onGoTo, onSubmit }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [jump, setJump] = useState("");
  const index = session.current;
  const q = questions[index];
  const answeredCount = Object.keys(session.answers).length;
  const markedCount = Object.keys(session.marked).length;
  const low = remainingSeconds <= 10 * 60;

  useEffect(() => {
    if (confirming) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const key = e.key.toUpperCase();
      const current = questions[index];
      if (!current) return;
      if ((LETTERS as string[]).includes(key)) onAnswer(current.id, key as Letter);
      else if (e.key === "ArrowRight") onGoTo(index + 1);
      else if (e.key === "ArrowLeft") onGoTo(index - 1);
      else if (key === "M") onToggleMark(current.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirming, index, questions, onAnswer, onGoTo, onToggleMark]);

  if (!q) return null;
  const selected = session.answers[q.id];

  let start = 0;
  const sectionStarts = mock.sections.map((s) => {
    const row = { ...s, start };
    start += s.count;
    return row;
  });

  const submitJump = () => {
    const n = Number.parseInt(jump, 10);
    if (Number.isFinite(n) && n >= 1 && n <= questions.length) {
      onGoTo(n - 1);
      setJump("");
    }
  };

  return (
    <div>
      <div className="sticky top-0 z-20 -mx-5 border-b border-line bg-paper/95 px-5 py-3 backdrop-blur dark:border-line-dark dark:bg-chalkboard/95 sm:-mx-8 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{mock.title}</p>
            <p className="text-sm text-ink dark:text-bone">
              Question <strong>{index + 1}</strong> of {questions.length} · Answered {answeredCount} / {questions.length}
            </p>
          </div>
          <div className="text-center">
            <p className="font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Time Remaining</p>
            <p
              role="timer"
              aria-label={`Time remaining ${formatClock(remainingSeconds)}`}
              className={cn("font-mono text-2xl font-medium tabular-nums", low ? "text-rose-600 dark:text-rose-400" : "text-ink dark:text-bone")}
            >
              {formatClock(remainingSeconds)}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Passing Score</p>
              <p className="text-sm text-ink dark:text-bone">{mock.passMarks} / {mock.totalQuestions}</p>
            </div>
            <Button size="sm" variant="secondary" onClick={() => setConfirming(true)}>Submit Test</Button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section aria-label="Question">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-soft dark:text-bone-soft">
            <span className="font-mono uppercase tracking-wide">{q.subject}</span>
            {session.marked[q.id] ? <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-amber-700 dark:text-amber-400">Marked for review</span> : null}
          </div>
          <QuestionBody q={q} selected={selected} onSelect={(l) => onAnswer(q.id, l)} />
          <div className="mt-6 flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => onGoTo(index - 1)} disabled={index === 0}>Previous</Button>
            <Button variant="secondary" size="sm" onClick={() => onGoTo(index + 1)} disabled={index === questions.length - 1}>Next</Button>
            <Button variant="ghost" size="sm" onClick={() => onToggleMark(q.id)}>{session.marked[q.id] ? "Unmark review" : "Mark for Review"}</Button>
            <Button variant="ghost" size="sm" onClick={() => onClear(q.id)} disabled={selected === undefined}>Clear Answer</Button>
          </div>
        </section>

        <aside aria-label="Question palette" className="lg:sticky lg:top-28 lg:self-start">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {sectionStarts.length > 1 && sectionStarts.map((s) => (
              <button
                key={s.code}
                type="button"
                onClick={() => onGoTo(s.start)}
                className="rounded-full border border-line px-2.5 py-1 text-[11px] text-ink-soft hover:border-pine-500 dark:border-line-dark dark:text-bone-soft"
              >
                {s.code}
              </button>
            ))}
          </div>
          <div className="mb-4 flex items-center gap-2">
            <label htmlFor="mpt-jump" className="text-xs text-ink-soft dark:text-bone-soft">Jump to</label>
            <input
              id="mpt-jump"
              inputMode="numeric"
              value={jump}
              onChange={(e) => setJump(e.target.value.replace(/\D/g, "").slice(0, 3))}
              onKeyDown={(e) => { if (e.key === "Enter") submitJump(); }}
              placeholder={`1-${questions.length}`}
              className="h-8 w-20 rounded border border-line bg-transparent px-2 text-sm text-ink dark:border-line-dark dark:text-bone"
            />
            <Button size="sm" variant="ghost" onClick={submitJump}>Go</Button>
          </div>
          <QuestionPalette mock={mock} questions={questions} answers={session.answers} marked={session.marked} current={index} onJump={onGoTo} />
          <p className="mt-3 text-xs text-ink-soft dark:text-bone-soft">{markedCount} marked for review · {questions.length - answeredCount} unanswered</p>
        </aside>
      </div>

      {confirming ? (
        <div role="dialog" aria-modal="true" aria-label="Submit test" className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-line bg-paper p-6 dark:border-line-dark dark:bg-chalkboard">
            <h2 className="font-display text-xl text-ink dark:text-bone">Submit the test?</h2>
            <p className="mt-2 text-sm text-ink-soft dark:text-bone-soft">
              You have answered {answeredCount} of {questions.length} questions. {questions.length - answeredCount} unanswered and {markedCount} marked for review. You cannot change answers after submitting.
            </p>
            <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">Time left: {formatClock(remainingSeconds)}</p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setConfirming(false)}>Keep working</Button>
              <Button size="sm" onClick={() => { setConfirming(false); onSubmit(); }}>Submit now</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
