"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { MptMockDefinition } from "../data/mpt-mock-data";
import type { RunnerQuestion } from "../engine-types";
import { sourceLabel } from "../engine";
import type { MockResult } from "../engine";
import type { StoredSession } from "../storage";
import { QuestionBody } from "./question-body";

type Filter = "all" | "correct" | "incorrect" | "unanswered" | "marked";
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "incorrect", label: "Incorrect" },
  { id: "unanswered", label: "Unanswered" },
  { id: "correct", label: "Correct" },
  { id: "marked", label: "Marked" },
];

interface Props {
  mock: MptMockDefinition;
  questions: RunnerQuestion[];
  session: StoredSession;
  result: MockResult;
  onBack: () => void;
}

export function ReviewScreen({ mock, questions, session, result, onBack }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [section, setSection] = useState<string>("all");

  const rows = useMemo(
    () =>
      questions
        .map((q, i) => ({ q, number: i + 1 }))
        .filter(({ q }) => section === "all" || q.subjectCode === section)
        .filter(({ q }) => {
          if (filter === "all") return true;
          if (filter === "marked") return session.marked[q.id] === true;
          return result.status[q.id] === filter;
        }),
    [questions, section, filter, session.marked, result.status]
  );

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-medium text-ink dark:text-bone">Review</h1>
        <Button variant="secondary" size="sm" onClick={onBack}>Back to result</Button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by result">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={cn("rounded-full border px-3 py-1 text-xs", filter === f.id ? "border-pine-600 bg-pine-600 text-paper" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft")}
          >
            {f.label}
          </button>
        ))}
      </div>
      {mock.sections.length > 1 ? (
      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Filter by section">
        <button type="button" onClick={() => setSection("all")} aria-pressed={section === "all"} className={cn("rounded-full border px-3 py-1 text-xs", section === "all" ? "border-ink bg-ink text-paper dark:border-bone dark:bg-bone dark:text-chalkboard" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft")}>All sections</button>
        {mock.sections.map((s) => (
          <button key={s.code} type="button" onClick={() => setSection(s.code)} aria-pressed={section === s.code} className={cn("rounded-full border px-3 py-1 text-xs", section === s.code ? "border-ink bg-ink text-paper dark:border-bone dark:bg-bone dark:text-chalkboard" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft")}>{s.subject.split(" / ")[0]}</button>
        ))}
      </div>
      ) : null}
      <p className="mt-3 text-xs text-ink-soft dark:text-bone-soft">{rows.length} question{rows.length === 1 ? "" : "s"} shown</p>

      <div className="mt-4 space-y-6">
        {rows.map(({ q, number }) => {
          const state = result.status[q.id] ?? "unanswered";
          const given = session.answers[q.id];
          return (
            <article key={q.id} className="rounded-xl border border-line p-5 dark:border-line-dark">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-mono text-ink-soft dark:text-bone-soft">Q{number}</span>
                <span className={cn("rounded-full px-2 py-0.5 font-medium", state === "correct" && "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400", state === "incorrect" && "bg-rose-500/15 text-rose-700 dark:text-rose-400", state === "unanswered" && "bg-ink/10 text-ink-soft dark:bg-bone/10 dark:text-bone-soft")}>
                  {state === "correct" ? "Correct" : state === "incorrect" ? "Incorrect" : "Unanswered"}
                </span>
                {session.marked[q.id] ? <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-amber-700 dark:text-amber-400">Marked</span> : null}
              </div>
              <QuestionBody q={q} selected={given} reveal />
              <p className="mt-4 text-sm text-ink dark:text-bone">
                Your answer: <strong>{given ?? "None"}</strong> · Correct answer: <strong>{q.correctAnswer}</strong>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-bone-soft"><span className="font-medium text-ink dark:text-bone">Explanation: </span>{q.explanation}</p>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
                {q.subject} · {q.topic} · {q.difficulty} · {sourceLabel(q)}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
