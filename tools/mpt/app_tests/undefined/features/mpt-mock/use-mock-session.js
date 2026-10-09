"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMockSession = useMockSession;
const react_1 = require("react");
const engine_1 = require("./engine");
const attempts_1 = require("./attempts");
const storage_1 = require("./storage");
/**
 * One session per test (full mock or section test). The countdown is derived from a fixed `endsAt`
 * stored with the session, so navigating away, refreshing or re-opening never resets it.
 */
function useMockSession(mock, provided) {
    const questions = (0, react_1.useMemo)(() => provided ?? (0, engine_1.getMockQuestions)(mock), [mock, provided]);
    const [session, setSession] = (0, react_1.useState)(null);
    const [phase, setPhase] = (0, react_1.useState)("loading");
    const [now, setNow] = (0, react_1.useState)(() => Date.now());
    const sessionRef = (0, react_1.useRef)(null);
    sessionRef.current = session;
    const commit = (0, react_1.useCallback)((next) => {
        setSession(next);
        if (next)
            (0, storage_1.saveSession)(next);
        else
            (0, storage_1.clearSession)(mock.id);
    }, [mock.id]);
    /** Writes the finished attempt into the per-test history (deduplicated by start time). */
    const recordFinished = (0, react_1.useCallback)((finished) => {
        const result = (0, engine_1.gradeMock)(mock, questions, finished.answers);
        (0, storage_1.recordAttempt)(mock.id, (0, attempts_1.attemptFromResult)(result, finished));
    }, [mock, questions]);
    const submit = (0, react_1.useCallback)((auto) => {
        const s = sessionRef.current;
        if (!s || s.submittedAt !== null)
            return;
        const finishedAt = auto ? Math.min(Date.now(), s.endsAt) : Date.now();
        const done = { ...s, submittedAt: finishedAt, autoSubmitted: auto };
        commit(done);
        recordFinished(done);
        setPhase("submitted");
    }, [commit, recordFinished]);
    // restore an earlier attempt after a refresh (also migrates the old Mock 1 key)
    (0, react_1.useEffect)(() => {
        const stored = (0, storage_1.loadSession)(mock.id);
        if (!stored) {
            setPhase("idle");
            return;
        }
        setSession(stored);
        if (stored.submittedAt !== null) {
            recordFinished(stored);
            setPhase("submitted");
        }
        else if (Date.now() >= stored.endsAt) {
            const done = { ...stored, submittedAt: stored.endsAt, autoSubmitted: true };
            setSession(done);
            (0, storage_1.saveSession)(done);
            recordFinished(done);
            setPhase("submitted");
        }
        else {
            setPhase("running");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mock.id]);
    // the countdown is derived from a fixed end time, so navigating never resets it
    (0, react_1.useEffect)(() => {
        if (phase !== "running")
            return;
        const tick = () => {
            const t = Date.now();
            setNow(t);
            const s = sessionRef.current;
            if (s && t >= s.endsAt)
                submit(true);
        };
        tick();
        const id = window.setInterval(tick, 500);
        return () => window.clearInterval(id);
    }, [phase, submit]);
    const start = (0, react_1.useCallback)(() => {
        const t = Date.now();
        const fresh = {
            mockId: mock.id,
            startedAt: t,
            endsAt: t + mock.timeMinutes * 60000,
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
    const mutate = (0, react_1.useCallback)((fn) => {
        const s = sessionRef.current;
        // no answering once the test is submitted or the time has expired
        if (!s || s.submittedAt !== null || Date.now() >= s.endsAt)
            return;
        commit(fn(s));
    }, [commit]);
    const answer = (0, react_1.useCallback)((id, letter) => mutate((s) => ({ ...s, answers: { ...s.answers, [id]: letter } })), [mutate]);
    const clearAnswer = (0, react_1.useCallback)((id) => mutate((s) => {
        const answers = { ...s.answers };
        delete answers[id];
        return { ...s, answers };
    }), [mutate]);
    const toggleMark = (0, react_1.useCallback)((id) => mutate((s) => {
        const marked = { ...s.marked };
        if (marked[id])
            delete marked[id];
        else
            marked[id] = true;
        return { ...s, marked };
    }), [mutate]);
    const goTo = (0, react_1.useCallback)((index) => mutate((s) => ({ ...s, current: Math.min(Math.max(index, 0), questions.length - 1) })), [mutate, questions.length]);
    const reset = (0, react_1.useCallback)(() => {
        commit(null);
        setPhase("idle");
    }, [commit]);
    const remainingSeconds = session && phase === "running" ? Math.max(0, Math.ceil((session.endsAt - now) / 1000)) : mock.timeMinutes * 60;
    const result = (0, react_1.useMemo)(() => (session && phase === "submitted" ? (0, engine_1.gradeMock)(mock, questions, session.answers) : null), [session, phase, mock, questions]);
    const timeUsedSeconds = session && session.submittedAt !== null ? Math.round((session.submittedAt - session.startedAt) / 1000) : 0;
    return {
        questions, session, phase, remainingSeconds, result, timeUsedSeconds,
        start, submit, answer, clearAnswer, toggleMark, goTo, reset,
    };
}
