"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MptMockDefinition } from "@/features/mpt-mock/data/mpt-mock-data";
import { asFullTest, getSectionTests, mockLabel, testHref } from "@/features/mpt-mock/test-defs";
import type { MptTest } from "@/features/mpt-mock/test-defs";
import { finalizeStoredSession, readTestStatus } from "@/features/mpt-mock/attempts";
import type { TestStatus } from "@/features/mpt-mock/attempts";
import { clearSession } from "@/features/mpt-mock/storage";

function formatDate(ms: number): string {
  try {
    return new Date(ms).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "";
  }
}

function formatUsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

function StatusBadge({ status }: { status: TestStatus | undefined }) {
  if (!status) return <Badge>Checking…</Badge>;
  if (status.state === "in-progress") return <Badge className="border-amber-500/60 text-amber-700 dark:text-amber-400">In progress</Badge>;
  if (status.state === "completed") return <Badge className="border-emerald-600/50 text-emerald-700 dark:text-emerald-400">Completed</Badge>;
  return <Badge>Not started</Badge>;
}

function ScoreLine({ status }: { status: TestStatus | undefined }) {
  if (!status || !status.last) return null;
  const { last, best } = status;
  return (
    <p className="text-sm text-ink-soft dark:text-bone-soft">
      Last: <strong className="text-ink dark:text-bone">{last.score} / {last.total}</strong>{" "}
      <span className={cn("font-medium", last.passed ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400")}>
        {last.passed ? "PASS" : "FAIL"}
      </span>{" "}
      · {formatDate(last.finishedAt)} · {formatUsed(last.timeUsedSeconds)}
      {best && best.score > last.score ? <> · Best {best.score} / {best.total}</> : null}
    </p>
  );
}

function Actions({ test, status, onRetake, size = "md" }: { test: MptTest; status: TestStatus | undefined; onRetake: (t: MptTest) => void; size?: "sm" | "md" }) {
  const href = testHref(test);
  if (!status || status.state === "not-started") return <Button size={size} href={href}>Start</Button>;
  if (status.state === "in-progress") return <Button size={size} href={href}>Continue</Button>;
  return (
    <div className="flex flex-wrap gap-2">
      <Button size={size} variant="secondary" href={href}>View result</Button>
      <Button size={size} onClick={() => onRetake(test)}>Retake</Button>
    </div>
  );
}

export function CssMptLanding({ mocks }: { mocks: MptMockDefinition[] }) {
  const router = useRouter();
  const [statuses, setStatuses] = useState<Record<string, TestStatus>>({});

  const refresh = useCallback(async () => {
    const tests: MptTest[] = mocks.flatMap((m) => [asFullTest(m), ...getSectionTests(m)]);
    const first: Record<string, TestStatus> = {};
    const pending: MptTest[] = [];
    for (const t of tests) {
      const st = readTestStatus(t.id);
      first[t.id] = st;
      if (st.needsFinalize) pending.push(t);
    }
    setStatuses(first);
    if (pending.length === 0) return;
    // a finished or expired attempt that was never graded into history: grade it now, then re-read
    for (const t of pending) await finalizeStoredSession(t);
    const next = { ...first };
    for (const t of pending) next[t.id] = readTestStatus(t.id);
    setStatuses(next);
  }, [mocks]);

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

  const retake = useCallback(
    (t: MptTest) => {
      clearSession(t.id);
      router.push(testHref(t));
    },
    [router]
  );

  return (
    <div className="space-y-14">
      <section aria-labelledby="full-mocks">
        <h2 id="full-mocks" className="font-display text-2xl text-ink dark:text-bone">Full mock tests</h2>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">
          200 questions · 200 minutes (03:20:00) · passing 66 / 200 · no negative marking. The timer never resets once you start.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {mocks.map((m) => {
            const t = asFullTest(m);
            const st = statuses[t.id];
            return (
              <article key={m.id} id={m.id} className="flex flex-col justify-between gap-4 rounded-xl border border-line p-5 dark:border-line-dark">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display text-xl text-ink dark:text-bone">{m.title}</h3>
                    <StatusBadge status={st} />
                  </div>
                  <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">
                    {m.totalQuestions} Q · {m.timeMinutes} min · pass {m.passMarks}
                  </p>
                  <div className="mt-3 min-h-[1.25rem]"><ScoreLine status={st} /></div>
                </div>
                <Actions test={t} status={st} onRetake={retake} />
              </article>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="section-tests">
        <h2 id="section-tests" className="font-display text-2xl text-ink dark:text-bone">Section tests</h2>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">
          One section of a mock at a time: 1 minute per question, pass mark 33% of the questions rounded up (the same ratio as 66 / 200).
        </p>
        <div className="mt-5 space-y-8">
          {mocks.map((m) => (
            <div key={m.id}>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">{mockLabel(m.id)} sections</h3>
              <ul className="mt-2 divide-y divide-line rounded-xl border border-line dark:divide-line-dark dark:border-line-dark">
                {getSectionTests(m).map((t) => {
                  const st = statuses[t.id];
                  return (
                    <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                      <div className="min-w-0">
                        <p className="font-medium text-ink dark:text-bone">{t.sections[0]?.subject}</p>
                        <p className="text-sm text-ink-soft dark:text-bone-soft">{t.totalQuestions} Q · {t.timeMinutes} min · pass {t.passMarks}</p>
                        <ScoreLine status={st} />
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <StatusBadge status={st} />
                        <Actions test={t} status={st} onRetake={retake} size="sm" />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
