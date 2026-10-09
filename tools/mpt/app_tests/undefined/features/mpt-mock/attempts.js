"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attemptFromResult = attemptFromResult;
exports.readTestStatus = readTestStatus;
exports.finalizeStoredSession = finalizeStoredSession;
const storage_1 = require("./storage");
function attemptFromResult(result, session) {
    const finishedAt = session.submittedAt ?? Date.now();
    return {
        startedAt: session.startedAt,
        finishedAt,
        score: result.score,
        total: result.total,
        passMarks: result.passMarks,
        passed: result.passed,
        timeUsedSeconds: Math.max(0, Math.round((finishedAt - session.startedAt) / 1000)),
        autoSubmitted: session.autoSubmitted,
    };
}
/** Cheap read used by the landing page. Does not import the question bank. */
function readTestStatus(testId, now = Date.now()) {
    const session = (0, storage_1.loadSession)(testId);
    const history = (0, storage_1.loadHistory)(testId);
    const last = history[0] ?? null;
    const best = (0, storage_1.bestAttempt)(history);
    const base = { last, best, attempts: history.length };
    if (session) {
        if (session.submittedAt === null && now < session.endsAt)
            return { ...base, state: "in-progress", needsFinalize: false };
        const recorded = history.some((r) => r.startedAt === session.startedAt);
        if (!recorded)
            return { ...base, state: last ? "completed" : "in-progress", needsFinalize: true };
    }
    return { ...base, state: history.length > 0 ? "completed" : "not-started", needsFinalize: false };
}
/**
 * Grades a finished-or-expired stored session into the attempt history (e.g. the time ran out while the person was elsewhere).
 * The engine (and so the question bank) is loaded on demand, only when this is actually needed.
 */
async function finalizeStoredSession(test) {
    const session = (0, storage_1.loadSession)(test.id);
    if (!session)
        return;
    const now = Date.now();
    if (session.submittedAt === null) {
        if (now < session.endsAt)
            return;
        const done = { ...session, submittedAt: session.endsAt, autoSubmitted: true };
        (0, storage_1.saveSession)(done);
        await finalizeStoredSession(test);
        return;
    }
    const { getMockQuestions, gradeMock } = await Promise.resolve().then(() => require("./engine"));
    const result = gradeMock(test, getMockQuestions(test), session.answers);
    (0, storage_1.recordAttempt)(test.id, attemptFromResult(result, session));
}
