"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSession = loadSession;
exports.saveSession = saveSession;
exports.clearSession = clearSession;
exports.loadHistory = loadHistory;
exports.recordAttempt = recordAttempt;
exports.bestAttempt = bestAttempt;
const SESSION_PREFIX = "th-mpt-session-v2:";
const HISTORY_PREFIX = "th-mpt-history-v1:";
/** Key used before tests were generalised; only ever held a Mock 1 attempt. */
const LEGACY_KEY = "th-mpt-mock-session-v1";
const MAX_HISTORY = 25;
const sessionKey = (testId) => SESSION_PREFIX + testId;
const historyKey = (testId) => HISTORY_PREFIX + testId;
function isSession(x) {
    if (!x || typeof x !== "object")
        return false;
    const s = x;
    return (typeof s.mockId === "string" &&
        typeof s.startedAt === "number" &&
        typeof s.endsAt === "number" &&
        !!s.answers && typeof s.answers === "object" &&
        !!s.marked && typeof s.marked === "object" &&
        typeof s.current === "number" &&
        (s.submittedAt === null || typeof s.submittedAt === "number"));
}
/** Move an in-progress (or finished) Mock 1 attempt from the old single key to the new per-test key, once. */
function migrateLegacy(testId) {
    if (testId !== "mock1")
        return;
    try {
        const raw = window.localStorage.getItem(LEGACY_KEY);
        if (!raw)
            return;
        const parsed = JSON.parse(raw);
        if (isSession(parsed) && parsed.mockId === "mock1" && window.localStorage.getItem(sessionKey("mock1")) === null) {
            window.localStorage.setItem(sessionKey("mock1"), JSON.stringify({ ...parsed, autoSubmitted: parsed.autoSubmitted === true }));
        }
        window.localStorage.removeItem(LEGACY_KEY);
    }
    catch {
        /* storage unavailable or corrupt: nothing to migrate */
    }
}
function loadSession(testId) {
    try {
        migrateLegacy(testId);
        const raw = window.localStorage.getItem(sessionKey(testId));
        if (!raw)
            return null;
        const parsed = JSON.parse(raw);
        return isSession(parsed) && parsed.mockId === testId ? parsed : null;
    }
    catch {
        return null;
    }
}
function saveSession(s) {
    try {
        window.localStorage.setItem(sessionKey(s.mockId), JSON.stringify(s));
    }
    catch {
        /* storage unavailable: the exam still works in memory */
    }
}
function clearSession(testId) {
    try {
        window.localStorage.removeItem(sessionKey(testId));
    }
    catch {
        /* ignore */
    }
}
// ---- attempt history (score, date, time used), newest first
function loadHistory(testId) {
    try {
        const raw = window.localStorage.getItem(historyKey(testId));
        if (!raw)
            return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed))
            return [];
        return parsed.filter((r) => !!r && typeof r === "object" && typeof r.score === "number" && typeof r.startedAt === "number");
    }
    catch {
        return [];
    }
}
/** Adds an attempt unless one with the same startedAt is already stored (so re-opening a finished test never double counts). */
function recordAttempt(testId, rec) {
    try {
        const list = loadHistory(testId);
        if (list.some((r) => r.startedAt === rec.startedAt))
            return;
        const next = [rec, ...list].sort((a, b) => b.finishedAt - a.finishedAt).slice(0, MAX_HISTORY);
        window.localStorage.setItem(historyKey(testId), JSON.stringify(next));
    }
    catch {
        /* ignore: history is a convenience */
    }
}
function bestAttempt(list) {
    let best = null;
    for (const r of list)
        if (!best || r.score > best.score)
            best = r;
    return best;
}
