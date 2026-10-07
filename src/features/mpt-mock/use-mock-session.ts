"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MptMockDefinition } from "./data/mpt-mock-data";
import { getMockQuestions, gradeMock } from "./engine";
import type { Letter } from "./engine";
import { attemptFromResult } from "./attempts";
import { clearSession, loadSession, recordAttempt, saveSession } from "./storage";
import type { StoredSession } from "./storage";

export type Phase = "loading" | "idle" | "running" | "submitted";

/**
 * One session per test (full mock or section test). The countdown is derived from a fixed `endsAt`
 * stored with the session, so navigating away, refreshing or re-opening never resets it.
 */
export function useMockSession(mock: MptMockDefinition) {
  const questions = useMemo(() => getMockQuestions(mock), [mock]);
  const [session, setSession] = useState<StoredSession | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [now, setNow] = useState<number>(() => Date.now());
  const sessionRef = useRef<StoredSession | null>(null);
  sessionRef.current = session;

  const commit = useCallback(
    (next: StoredSession | null) => {
      setSession(next);
      if (next) saveSession(next);
      else clearSession(mock.id);
    },
    [mock.id]
  );

  /** Writes the finished attempt into the per-test history (deduplicated by start time). */
  const recordFinished = useCallback(
    (finished: StoredSession) => {
      const result = gradeMock(mock, questions, finished.answers);
      recordAttempt(mock.id, attemptFromResult(result, finished));
    },
    [mock, questions]
  );

  const submit = useCallback(
    (auto: boolean) => {
      const s = sessionRef.current;
      if (!s || s.submittedAt !== null) return;
      const finishedAt = auto ? Math.min(Date.now(), s.endsAt) : Date.now();
      const done: StoredSession = { ...s, submittedAt: finishedAt, autoSubmitted: auto };
      commit(done);
      recordFinished(done);
      setPhase("submitted");
    },
    [commit, recordFinished]
  );

  // restore an earlier attempt after a refresh (also migrates the old Mock 1 key)
  useEffect(() => {
    const stored = loadSession(mock.id);
    if (!stored) {
      setPhase("idle");
      return;
    }
    setSession(stored);
    if (stored.submittedAt !== null) {
      recordFinished(stored);
      setPhase("submitted");
    } else if (Date.now() >= stored.endsAt) {
      const done: StoredSession = { ...stored, submittedAt: stored.endsAt, autoSubmitted: true };
      setSession(done);
      saveSession(done);
      recordFinished(done);
      setPhase("submitted");
    } else {
      setPhase("running");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mock.id]);

  // the countdown is derived from a fixed end time, so navigating never resets it
  useEffect(() => {
    if (phase !== "running") return;
    const tick = () => {
      const t = Date.now();
      setNow(t);
      const s = sessionRef.current;
      if (s && t >= s.endsAt) submit(true);
    };
    tick();
    const id = window.setInterval(tick, 500);
    return () => window.clearInterval(id);
  }, [phase, submit]);

  const start = useCallback(() => {
    const t = Date.now();
    const fresh: StoredSession = {
      mockId: mock.id,
      startedAt: t,
      endsAt: t + mock.timeMinutes * 60_000,
      answers: {},
      marked: {},
      current: 0,
      submittedAt: null,
      autoSubmitted: false,
    };
    setNow(t);
    commit(fresh);
    setPhase("running");
  }, [commit, mock.id, mock.timeMinutes]);

  const mutate = useCallback(
    (fn: (s: StoredSession) => StoredSession) => {
      const s = sessionRef.current;
      // no answering once the test is submitted or the time has expired
      if (!s || s.submittedAt !== null || Date.now() >= s.endsAt) return;
      commit(fn(s));
    },
    [commit]
  );

  const answer = useCallback(
    (id: string, letter: Letter) => mutate((s) => ({ ...s, answers: { ...s.answers, [id]: letter } })),
    [mutate]
  );
  const clearAnswer = useCallback(
    (id: string) =>
      mutate((s) => {
        const answers = { ...s.answers };
        delete answers[id];
        return { ...s, answers };
      }),
    [mutate]
  );
  const toggleMark = useCallback(
    (id: string) =>
      mutate((s) => {
        const marked = { ...s.marked };
        if (marked[id]) delete marked[id];
        else marked[id] = true;
        return { ...s, marked };
      }),
    [mutate]
  );
  const goTo = useCallback(
    (index: number) => mutate((s) => ({ ...s, current: Math.min(Math.max(index, 0), questions.length - 1) })),
    [mutate, questions.length]
  );
  const reset = useCallback(() => {
    commit(null);
    setPhase("idle");
  }, [commit]);

  const remainingSeconds =
    session && phase === "running" ? Math.max(0, Math.ceil((session.endsAt - now) / 1000)) : mock.timeMinutes * 60;
  const result = useMemo(
    () => (session && phase === "submitted" ? gradeMock(mock, questions, session.answers) : null),
    [session, phase, mock, questions]
  );
  const timeUsedSeconds =
    session && session.submittedAt !== null ? Math.round((session.submittedAt - session.startedAt) / 1000) : 0;

  return {
    questions, session, phase, remainingSeconds, result, timeUsedSeconds,
    start, submit, answer, clearAnswer, toggleMark, goTo, reset,
  };
}
