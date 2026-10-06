"use client";

import { cn } from "@/lib/utils";
import type { MptMockDefinition, MptQuestion } from "../data/mpt-mock-data";
import type { AnswerMap } from "../engine";

interface Props {
  mock: MptMockDefinition;
  questions: MptQuestion[];
  answers: AnswerMap;
  marked: Record<string, true>;
  current: number;
  onJump: (index: number) => void;
}

export function QuestionPalette({ mock, questions, answers, marked, current, onJump }: Props) {
  let offset = 0;
  return (
    <div className="space-y-4">
      {mock.sections.map((sec) => {
        const start = offset;
        offset += sec.count;
        const items = questions.slice(start, start + sec.count);
        return (
          <div key={sec.code}>
            <p className="mb-1.5 font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
              {sec.subject} · {sec.count}
            </p>
            <div className="grid grid-cols-10 gap-1">
              {items.map((q, i) => {
                const index = start + i;
                const answered = answers[q.id] !== undefined;
                const isMarked = marked[q.id] === true;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => onJump(index)}
                    aria-label={`Question ${index + 1}${answered ? ", answered" : ", unanswered"}${isMarked ? ", marked for review" : ""}`}
                    aria-current={index === current ? "true" : undefined}
                    className={cn(
                      "relative h-7 rounded text-[11px] font-medium transition",
                      answered
                        ? "bg-pine-600 text-paper dark:bg-pine-500 dark:text-chalkboard"
                        : "border border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
                      index === current && "ring-2 ring-ink dark:ring-bone",
                      isMarked && "outline outline-2 outline-amber-500"
                    )}
                  >
                    {index + 1}
                    {isMarked ? <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-amber-500" /> : null}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-ink-soft dark:text-bone-soft">
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-pine-600" /> Answered</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded border border-line dark:border-line-dark" /> Unanswered</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded outline outline-2 outline-amber-500" /> Marked</span>
      </div>
    </div>
  );
}
