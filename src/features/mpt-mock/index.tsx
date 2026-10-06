"use client";

import { useState } from "react";
import { MPT_MOCKS } from "./engine";
import { useMockSession } from "./use-mock-session";
import { StartScreen } from "./components/start-screen";
import { ExamScreen } from "./components/exam-screen";
import { ResultScreen } from "./components/result-screen";
import { ReviewScreen } from "./components/review-screen";

export function MptMockTest() {
  const mock = MPT_MOCKS[0];
  if (!mock) return null;
  return <Runner mock={mock} />;
}

function Runner({ mock }: { mock: (typeof MPT_MOCKS)[number] }) {
  const s = useMockSession(mock);
  const [reviewing, setReviewing] = useState(false);

  if (s.phase === "loading") {
    return <p className="py-20 text-center text-sm text-ink-soft dark:text-bone-soft">Loading…</p>;
  }
  if (s.phase === "idle" || !s.session) {
    return <StartScreen mock={mock} questions={s.questions} onStart={s.start} />;
  }
  if (s.phase === "running") {
    return (
      <ExamScreen
        mock={mock}
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
    return <ReviewScreen mock={mock} questions={s.questions} session={s.session} result={s.result} onBack={() => setReviewing(false)} />;
  }
  return (
    <ResultScreen
      mock={mock}
      result={s.result}
      timeUsedSeconds={s.timeUsedSeconds}
      autoSubmitted={s.session.autoSubmitted}
      onReview={() => setReviewing(true)}
      onRestart={() => { setReviewing(false); s.reset(); }}
    />
  );
}
