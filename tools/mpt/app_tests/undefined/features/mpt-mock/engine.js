"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUrdu = exports.MPT_MOCKS = void 0;
exports.getMockById = getMockById;
exports.getTestById = getTestById;
exports.getMockQuestions = getMockQuestions;
exports.formatClock = formatClock;
exports.gradeMock = gradeMock;
exports.sourceLabel = sourceLabel;
const mpt_mock_data_1 = require("./data/mpt-mock-data");
const test_defs_1 = require("./test-defs");
/** Registry of full mocks. Add a new mock here once its question ids exist in the data file. */
exports.MPT_MOCKS = [mpt_mock_data_1.MPT_MOCK_1, mpt_mock_data_1.MPT_MOCK_2];
function getMockById(id) {
    return exports.MPT_MOCKS.find((m) => m.id === id) ?? null;
}
/** Resolves "mock2" (full test) or "mock2-IS" (section test) to a test definition, or null if unknown. */
function getTestById(testId) {
    const full = getMockById(testId);
    if (full)
        return (0, test_defs_1.asFullTest)(full);
    const m = /^(mock\d+)-([A-Z]{2})$/.exec(testId);
    if (!m || !m[1] || !m[2] || !(0, test_defs_1.isSectionCode)(m[2]))
        return null;
    const mock = getMockById(m[1]);
    return mock ? (0, test_defs_1.buildSectionTest)(mock, m[2]) : null;
}
let bankIndex = null;
function bankById() {
    if (!bankIndex)
        bankIndex = new Map(mpt_mock_data_1.MPT_QUESTION_BANK.map((q) => [q.id, q]));
    return bankIndex;
}
function getMockQuestions(mock) {
    const byId = bankById();
    const out = [];
    for (const id of mock.questionIds) {
        const q = byId.get(id);
        if (q)
            out.push(q);
    }
    return out;
}
function formatClock(totalSeconds) {
    const s = Math.max(0, Math.floor(totalSeconds));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return [h, m, sec].map((n) => String(n).padStart(2, "0")).join(":");
}
function gradeMock(mock, questions, answers) {
    const status = {};
    const bySubject = new Map();
    const byTopic = new Map();
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    for (const q of questions) {
        const given = answers[q.id];
        const state = given === undefined ? "unanswered" : given === q.correctAnswer ? "correct" : "incorrect";
        status[q.id] = state;
        if (state === "correct")
            correct += 1;
        else if (state === "incorrect")
            incorrect += 1;
        else
            unanswered += 1;
        const s = bySubject.get(q.subject) ?? { total: 0, correct: 0, incorrect: 0, unanswered: 0 };
        s.total += 1;
        s[state] += 1;
        bySubject.set(q.subject, s);
        const key = `${q.subject}||${q.topic}`;
        const t = byTopic.get(key) ?? { subject: q.subject, topic: q.topic, correct: 0, total: 0, percent: 0 };
        t.total += 1;
        if (state === "correct")
            t.correct += 1;
        byTopic.set(key, t);
    }
    const sections = mock.sections.map((sec) => {
        const b = bySubject.get(sec.subject) ?? { total: sec.count, correct: 0, incorrect: 0, unanswered: sec.count };
        const attempted = b.correct + b.incorrect;
        return {
            subject: sec.subject,
            code: sec.code,
            ...b,
            accuracy: attempted === 0 ? 0 : Math.round((b.correct / attempted) * 100),
        };
    });
    // Weak areas: topics with at least 2 questions scoring under 60% (unanswered counts as missed),
    // lowest first, at most 3 per subject.
    const weakAreas = [];
    for (const sec of mock.sections) {
        const rows = [...byTopic.values()]
            .filter((t) => t.subject === sec.subject && t.total >= 2)
            .map((t) => ({ ...t, percent: Math.round((t.correct / t.total) * 100) }))
            .filter((t) => t.percent < 60)
            .sort((a, b) => a.percent - b.percent || b.total - a.total)
            .slice(0, 3);
        weakAreas.push(...rows);
    }
    const score = correct; // 1 mark each, no negative marking
    return {
        total: questions.length,
        correct,
        incorrect,
        unanswered,
        score,
        percentage: questions.length === 0 ? 0 : Math.round((score / questions.length) * 1000) / 10,
        passMarks: mock.passMarks,
        passed: score >= mock.passMarks,
        sections,
        weakAreas,
        status,
    };
}
function sourceLabel(q) {
    return q.sourceYear ? `${q.sourceType} · ${q.sourceYear}` : q.sourceType;
}
const isUrdu = (q) => q.rtl ?? q.subjectCode === "UR";
exports.isUrdu = isUrdu;
