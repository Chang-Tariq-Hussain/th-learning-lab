"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { readTestStatus } from "@/features/mpt-mock/attempts";
import type { TestStatus } from "@/features/mpt-mock/attempts";
import { clearSession, loadHistory } from "@/features/mpt-mock/storage";
import { BANK_STATS } from "../data/bank-stats";
import { finalizeTeacherSession, mockTestId } from "../attempts";
import { teacherExamConfig, TEACHER_BASE } from "../config";
import { loadPracticeIndex } from "../storage";
import { SOURCE_LABELS, mockHref } from "../tests";
import { SOURCE_TYPES } from "../types";
import type { ExamType } from "../types";

function formatDate(ms: number): string {
  try {
    return new Date(ms).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "";
  }
}

function StatusBadge({ status }: { status: TestStatus | undefined }) {
  if (!status) return <Badge>Checking…</Badge>;
  if (status.state === "in-progress") return <Badge className="border-amber-500/60 text-amber-700 dark:text-amber-400">In progress</Badge>;
  if (status.state === "completed") return <Badge className="border-emerald-600/50 text-emerald-700 dark:text-emerald-400">Completed</Badge>;
  return <Badge>Not started</Badge>;
}

export function ExamLanding({ exam }: { exam: ExamType }) {
  const router = useRouter();
  const cfg = teacherExamConfig[exam];
  const stats = BANK_STATS[exam];
  const ids = Array.from({ length: cfg.mock.mockCount }, (_, i) => mockTestId(exam, i + 1));
  const [statuses, setStatuses] = useState<Record<string, TestStatus>>({});
  const [practiceCount, setPracticeCount] = useState(0);

  const refresh = useCallback(async () => {
    const first: Record<string, TestStatus> = {};
    const pending: string[] = [];
    for (const id of ids) {
      const st = readTestStatus(id);
      first[id] = st;
      if (st.needsFinalize) pending.push(id);
    }
    setStatuses(first);
    setPracticeCount(loadPracticeIndex(exam).filter((p) => loadHistory(p).length > 0).length);
    if (pending.length === 0) return;
    for (const id of pending) await finalizeTeacherSession(exam, id);
    const next = { ...first };
    for (const id of pending) next[id] = readTestStatus(id);
    setStatuses(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam]);

  useEffect(() => {
    void refresh();
    const onShow = () => void refresh();
    window.addEventListener("pageshow", onShow);
    window.addEventListener("focus", onShow);
    return () => {
      window.removeEventListener("pageshow", onShow);
      window.removeEventListener("focus", onShow);
    };
  }, [refresh]);

  const retake = (id: string, index: number) => {
    clearSession(id);
    router.push(mockHref(exam, index));
  };

  const done = ids.filter((id) => statuses[id]?.state === "completed").length;
  const best = ids.reduce<number | null>((acc, id) => {
    const b = statuses[id]?.best;
    if (!b || b.total === 0) return acc;
    const pct = Math.round((b.score / b.total) * 100);
    return acc === null || pct > acc ? pct : acc;
  }, null);
  const past = stats.bySource["verified_past_paper"] ?? 0;

  return (
    <div className="space-y-14">
      <section aria-labelledby="syllabus">
        <h2 id="syllabus" className="font-display text-2xl text-ink dark:text-bone">Syllabus and pattern</h2>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">{cfg.fullName} · {cfg.syllabusClasses}</p>
        <div className={cn("mt-4 rounded-lg border px-4 py-3 text-sm text-ink dark:text-bone", cfg.pattern.status === "verified" ? "border-emerald-600/50" : "border-amber-500/50 bg-amber-500/10")}>
          <p className="font-medium">Pattern status: {cfg.pattern.status.replace("-", " ")}</p>
          <p className="mt-1 text-ink-soft dark:text-bone-soft">{cfg.pattern.note}</p>
          <ul className="mt-2 list-disc pl-5 text-xs text-ink-soft dark:text-bone-soft">
            {cfg.pattern.sources.map((s) => (
              <li key={s.url}><a className="underline" href={s.url} target="_blank" rel="noreferrer">{s.title}</a></li>
            ))}
          </ul>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <caption className="sr-only">Mock test sections</caption>
            <thead>
              <tr className="border-b border-line text-ink-soft dark:border-line-dark dark:text-bone-soft">
                <th scope="col" className="py-2 font-medium">Section</th>
                <th scope="col" className="py-2 text-right font-medium">Questions</th>
              </tr>
            </thead>
            <tbody className="text-ink dark:text-bone">
              {cfg.mock.sections.map((s) => (
                <tr key={s.code} className="border-b border-line/60 dark:border-line-dark/60">
                  <td className="py-2">{s.title}</td>
                  <td className="py-2 text-right tabular-nums">{s.count}</td>
                </tr>
              ))}
              <tr className="font-medium">
                <td className="py-2">Total · {cfg.mock.durationMinutes} minutes · no negative marking</td>
                <td className="py-2 text-right tabular-nums">{cfg.mock.questions}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="bank">
        <h2 id="bank" className="font-display text-2xl text-ink dark:text-bone">Question bank</h2>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">
          {stats.total} questions for {cfg.label}. Every question carries its source type so you always know what you are practising.
        </p>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Questions by source">
          {SOURCE_TYPES.map((s) => (
            <li key={s}><Badge>{SOURCE_LABELS[s]}: {stats.bySource[s] ?? 0}</Badge></li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="progress">
        <h2 id="progress" className="font-display text-2xl text-ink dark:text-bone">Your progress</h2>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">
          {done} of {ids.length} mocks completed{best !== null ? ` · best mock score ${best}%` : ""} · {practiceCount} practice set{practiceCount === 1 ? "" : "s"} finished. Saved on this device only.
        </p>
      </section>

      <section aria-labelledby="mocks">
        <h2 id="mocks" className="font-display text-2xl text-ink dark:text-bone">Full mock tests</h2>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">
          {cfg.mock.questions} questions · {cfg.mock.durationMinutes} minutes. Each mock prefers questions the earlier mocks did not use, and the timer never resets once started.
        </p>
        <ul className="mt-5 divide-y divide-line rounded-xl border border-line dark:divide-line-dark dark:border-line-dark">
          {ids.map((id, i) => {
            const st = statuses[id];
            const index = i + 1;
            const href = mockHref(exam, index);
            return (
              <li key={id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="font-medium text-ink dark:text-bone">{cfg.label} Mock {index}</p>
                  {st?.last ? (
                    <p className="text-sm text-ink-soft dark:text-bone-soft">
                      Last: <strong className="text-ink dark:text-bone">{st.last.score} / {st.last.total}</strong> ({Math.round((st.last.score / Math.max(1, st.last.total)) * 100)}%) · {formatDate(st.last.finishedAt)}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={st} />
                  {!st || st.state === "not-started" ? (
                    <Button size="sm" href={href}>Start</Button>
                  ) : st.state === "in-progress" ? (
                    <Button size="sm" href={href}>Continue</Button>
                  ) : (
                    <>
                      <Button size="sm" variant="secondary" href={href}>View result</Button>
                      <Button size="sm" onClick={() => retake(id, index)}>Retake</Button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="practice">
        <h2 id="practice" className="font-display text-2xl text-ink dark:text-bone">Practice</h2>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">
          Practise by subject, topic or difficulty, with mixed questions from the whole syllabus, or with verified past papers only
          {past === 0 ? " (none are in the bank yet)" : ""}.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button href={`${TEACHER_BASE}/${exam}/practice`}>Open practice</Button>
        </div>
      </section>
    </div>
  );
}
