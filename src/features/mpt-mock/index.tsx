"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getTestById } from "./engine";
import { useMockSession } from "./use-mock-session";
import { bestAttempt, loadHistory } from "./storage";
import type { MptTest } from "./test-defs";
import { CSS_MPT_BASE } from "./test-defs";
import { StartScreen } from "./components/start-screen";
import type { StartCopy } from "./components/start-screen";
import type { MockResult } from "./engine";
import type { RunnerQuestion } from "./engine-types";
import { ExamScreen } from "./components/exam-screen";
import { ResultScreen } from "./components/result-screen";
import { ReviewScreen } from "./components/review-screen";

/** Runs one test (a full mock or a single-section test), identified by id such as "mock2" or "mock2-EN". */
export function MptMockTest({ testId }: { testId: string }) {
  const test = useMemo(() => getTestById(testId), [testId]);
  if (!test) return <p className="py-20 text-center text-sm text-ink-soft dark:text-bone-soft">Unknown test.</p>;
  return <MockRunner key={test.id} test={test} backHref={CSS_MPT_BASE} backLabel="All CSS MPT tests" />;
}

export interface MockRunnerProps {
  test: MptTest;
  /** questions for this test; when omitted the CSS MPT bank is used */
  questions?: RunnerQuestion[];
  backHref: string;
  backLabel: string;
  startCopy?: StartCopy;
  /** extra result panels, rendered under the section table */
  renderExtra?: (result: MockResult, questions: RunnerQuestion[]) => ReactNode;
}

/** The shared exam runner: start screen, timed exam, result, review. Used by the CSS MPT and the teacher tests. */
export function MockRunner({ test, questions, backHref, backLabel, startCopy, renderExtra }: MockRunnerProps) {
  const s = useMockSession(test, questions);
  const [reviewing, setReviewing] = useState(false);
  const [history, setHistory] = useState(() => ({ best: null as ReturnType<typeof bestAttempt>, count: 0 }));

  // refresh the saved best score whenever a result is shown
  useEffect(() => {
    if (s.phase !== "submitted") return;
    const list = loadHistory(test.id);
    setHistory({ best: bestAttempt(list), count: list.length });
  }, [s.phase, test.id]);

  if (s.phase === "loading") {
    return <p className="py-20 text-center text-sm text-ink-soft dark:text-bone-soft">Loading…</p>;
  }
  if (s.phase === "idle" || !s.session) {
    return <StartScreen mock={test} test={test} questions={s.questions} onStart={s.start} copy={startCopy} />;
  }
  if (s.phase === "running") {
    return (
      <ExamScreen
        mock={test}
        questions={s.questions}
        session={s.session}
        remainingSeconds={s.remainingSeconds}
        onAnswer={s.answer}
        onClear={s.clearAnswer}
        onToggleMark={s.toggleMark}
        onGoTo={s.goTo}
        onSubmit={() => s.submit(false)}
      />
    );
  }
  if (!s.result) return null;
  if (reviewing) {
    return <ReviewScreen mock={test} questions={s.questions} session={s.session} result={s.result} onBack={() => setReviewing(false)} />;
  }
  return (
    <ResultScreen
      mock={test}
      result={s.result}
      timeUsedSeconds={s.timeUsedSeconds}
      autoSubmitted={s.session.autoSubmitted}
      onReview={() => setReviewing(true)}
      onRestart={() => { setReviewing(false); s.reset(); }}
      backHref={backHref}
      backLabel={backLabel}
      extra={renderExtra ? renderExtra(s.result, s.questions) : undefined}
      best={history.best}
      attempts={history.count}
    />
  );
}
