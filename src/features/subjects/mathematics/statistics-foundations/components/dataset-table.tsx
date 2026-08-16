"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { COLUMNS, STUDENTS, type ColumnId } from "../statistics-model";

/**
 * Level 1 — What is Data. The classroom dataset as a scrollable table;
 * clicking a header highlights that column and surfaces which variable
 * it represents underneath, per the brief's "click Age -> show Variable:
 * Age" spec.
 */
export function DatasetTable() {
  const [activeColumn, setActiveColumn] = useState<ColumnId>("age");
  const activeDef = COLUMNS.find((c) => c.id === activeColumn)!;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <p className="text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        A dataset is a collection of information gathered about individuals or objects. Tap a column to explore it.
      </p>

      <div className="overflow-x-auto rounded-card border border-line dark:border-line-dark">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.id}
                  scope="col"
                  onClick={() => setActiveColumn(col.id)}
                  className={cn(
                    "cursor-pointer select-none border-b border-line px-3 py-2.5 text-left font-mono text-[11px] uppercase tracking-wide transition-colors dark:border-line-dark",
                    activeColumn === col.id
                      ? "bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
                      : "text-ink-soft hover:bg-ink/[0.03] dark:text-bone-soft dark:hover:bg-bone/[0.06]",
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STUDENTS.map((student, rowIndex) => (
              <tr key={student.name} className={rowIndex % 2 === 1 ? "bg-ink/[0.015] dark:bg-bone/[0.02]" : undefined}>
                <td
                  onClick={() => setActiveColumn("name")}
                  className={cn(
                    "cursor-pointer border-b border-line/60 px-3 py-2 text-ink dark:border-line-dark/60 dark:text-bone",
                    activeColumn === "name" && "bg-subject-math-soft/60 dark:bg-subject-math/10",
                  )}
                >
                  {student.name}
                </td>
                <td
                  onClick={() => setActiveColumn("age")}
                  className={cn(
                    "cursor-pointer border-b border-line/60 px-3 py-2 font-mono text-ink dark:border-line-dark/60 dark:text-bone",
                    activeColumn === "age" && "bg-subject-math-soft/60 dark:bg-subject-math/10",
                  )}
                >
                  {student.age}
                </td>
                <td
                  onClick={() => setActiveColumn("subject")}
                  className={cn(
                    "cursor-pointer border-b border-line/60 px-3 py-2 text-ink dark:border-line-dark/60 dark:text-bone",
                    activeColumn === "subject" && "bg-subject-math-soft/60 dark:bg-subject-math/10",
                  )}
                >
                  {student.subject}
                </td>
                <td
                  onClick={() => setActiveColumn("studyHours")}
                  className={cn(
                    "cursor-pointer border-b border-line/60 px-3 py-2 font-mono text-ink dark:border-line-dark/60 dark:text-bone",
                    activeColumn === "studyHours" && "bg-subject-math-soft/60 dark:bg-subject-math/10",
                  )}
                >
                  {student.studyHours}
                </td>
                <td
                  onClick={() => setActiveColumn("testScore")}
                  className={cn(
                    "cursor-pointer border-b border-line/60 px-3 py-2 font-mono text-ink dark:border-line-dark/60 dark:text-bone",
                    activeColumn === "testScore" && "bg-subject-math-soft/60 dark:bg-subject-math/10",
                  )}
                >
                  {student.testScore}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-card border border-line bg-white/50 px-4 py-3 text-center dark:border-line-dark dark:bg-white/[0.03]">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-subject-math">{activeDef.header}</p>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">{activeDef.description}</p>
      </div>
    </div>
  );
}
