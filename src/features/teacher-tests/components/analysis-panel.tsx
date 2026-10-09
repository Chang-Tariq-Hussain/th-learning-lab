"use client";

import type { ReactNode } from "react";
import type { MockResult } from "@/features/mpt-mock/engine";
import type { RunnerQuestion } from "@/features/mpt-mock/engine-types";
import { analyse } from "../analysis";
import type { Row } from "../analysis";

function Table({ title, rows, note }: { title: string; rows: Row[]; note?: string }) {
  return (
    <div className="mt-8">
      <h2 className="font-display text-xl text-ink dark:text-bone">{title}</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[360px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-ink-soft dark:border-line-dark dark:text-bone-soft">
              <th scope="col" className="py-2 font-medium">Group</th>
              <th scope="col" className="py-2 text-right font-medium">Correct</th>
              <th scope="col" className="py-2 text-right font-medium">Score</th>
            </tr>
          </thead>
          <tbody className="text-ink dark:text-bone">
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-line/60 dark:border-line-dark/60">
                <td className="py-2">{r.label}</td>
                <td className="py-2 text-right tabular-nums">{r.correct} / {r.total}</td>
                <td className="py-2 text-right tabular-nums">{r.percent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note ? <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">{note}</p> : null}
    </div>
  );
}

/** Extra result panels for the teacher tests: difficulty, source, and strong topics. Weak topics come from the shared result screen. */
export function AnalysisPanel({ result, questions }: { result: MockResult; questions: RunnerQuestion[] }): ReactNode {
  const a = analyse(questions, result.status);
  return (
    <>
      <Table title="Difficulty-wise performance" rows={a.byDifficulty} />
      <Table
        title="Question source"
        rows={a.bySource}
        note={
          a.pastVsGenerated.some((r) => r.label === "Verified past paper")
            ? undefined
            : "This test contained no verified past-paper questions, so there is no past-paper comparison."
        }
      />
      {a.pastVsGenerated.some((r) => r.label === "Verified past paper") ? <Table title="Past paper vs practice" rows={a.pastVsGenerated} /> : null}
      <h2 className="mt-8 font-display text-xl text-ink dark:text-bone">Strong areas</h2>
      {a.strong.length === 0 ? (
        <p className="mt-2 text-sm text-ink-soft dark:text-bone-soft">No topic with two or more questions reached 80%.</p>
      ) : (
        <ul className="mt-3 space-y-1.5 text-sm text-ink dark:text-bone">
          {a.strong.map((r) => (
            <li key={r.label} className="flex justify-between gap-4 border-b border-line/60 py-1.5 dark:border-line-dark/60">
              <span>{r.label}</span>
              <span className="tabular-nums">{r.correct} / {r.total} ({r.percent}%)</span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">Topics with at least 2 questions scoring 80% or more.</p>
    </>
  );
}
