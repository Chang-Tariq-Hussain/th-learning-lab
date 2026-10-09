"use client";

import { useEffect, useState } from "react";
import { loadBank } from "../bank-loader";
import { auditBank } from "../audit";
import type { AuditReport } from "../audit";
import { teacherExamConfig } from "../config";
import { SOURCE_LABELS } from "../tests";
import { EXAM_TYPES, SOURCE_TYPES, TEACHER_SUBJECTS } from "../types";
import type { ExamType } from "../types";

type Reports = Partial<Record<ExamType, AuditReport>>;

function Cell({ children, warn }: { children: React.ReactNode; warn?: boolean }) {
  return <td className={`py-2 text-right tabular-nums ${warn ? "font-medium text-rose-700 dark:text-rose-400" : ""}`}>{children}</td>;
}

export function AuditView() {
  const [reports, setReports] = useState<Reports>({});
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        for (const exam of EXAM_TYPES) {
          const rep = auditBank(await loadBank(exam));
          if (!live) return;
          setReports((prev) => ({ ...prev, [exam]: rep }));
        }
      } catch {
        if (live) setFailed(true);
      }
    })();
    return () => {
      live = false;
    };
  }, []);
  if (failed) return <p className="text-sm text-rose-700 dark:text-rose-400">The audit could not load the question banks.</p>;
  const done = EXAM_TYPES.every((e) => reports[e]);
  const rows: { label: string; get: (r: AuditReport) => number; warn?: boolean }[] = [
    { label: "Total questions", get: (r) => r.total },
    { label: "Shared with another exam", get: (r) => r.shared },
    ...SOURCE_TYPES.map((s) => ({ label: SOURCE_LABELS[s], get: (r: AuditReport) => r.bySource[s] })),
    { label: "Easy", get: (r) => r.byDifficulty.easy },
    { label: "Moderate", get: (r) => r.byDifficulty.moderate },
    { label: "Difficult", get: (r) => r.byDifficulty.difficult },
    ...TEACHER_SUBJECTS.map((s) => ({ label: s, get: (r: AuditReport) => r.bySubject[s] ?? 0 })),
    { label: "Duplicate ids", get: (r) => r.duplicateIds, warn: true },
    { label: "Exact duplicates", get: (r) => r.exactDuplicates, warn: true },
    { label: "Near duplicates", get: (r) => r.nearDuplicates, warn: true },
    { label: "Missing explanations", get: (r) => r.missingExplanations, warn: true },
    { label: "Unverified past-paper claims", get: (r) => r.unverifiedPastPaperClaims, warn: true },
    { label: "Non-past-paper marked verified", get: (r) => r.generatedMarkedVerified, warn: true },
    { label: "Invalid answers", get: (r) => r.invalidAnswers, warn: true },
    { label: "Duplicate options", get: (r) => r.duplicateOptions, warn: true },
    { label: "Incomplete metadata", get: (r) => r.incompleteMetadata, warn: true },
    { label: "Needs native-speaker review", get: (r) => r.needsReview },
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] text-left text-sm text-ink dark:text-bone">
        <caption className="sr-only">Question bank audit by exam</caption>
        <thead>
          <tr className="border-b border-line text-ink-soft dark:border-line-dark dark:text-bone-soft">
            <th scope="col" className="py-2 font-medium">Measure</th>
            {EXAM_TYPES.map((e) => (
              <th key={e} scope="col" className="py-2 text-right font-medium">{teacherExamConfig[e].label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-line/60 dark:border-line-dark/60">
              <td className="py-2">{row.label}</td>
              {EXAM_TYPES.map((e) => {
                const rep = reports[e];
                return <Cell key={e} warn={row.warn && !!rep && row.get(rep) > 0}>{rep ? row.get(rep) : "…"}</Cell>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {!done ? <p className="mt-3 text-sm text-ink-soft dark:text-bone-soft">Loading banks…</p> : null}
    </div>
  );
}
