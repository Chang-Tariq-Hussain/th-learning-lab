"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSS_MPT_BASE = void 0;
exports.sectionPassMarks = sectionPassMarks;
exports.asFullTest = asFullTest;
exports.buildSectionTest = buildSectionTest;
exports.getSectionTests = getSectionTests;
exports.testHref = testHref;
exports.mockLabel = mockLabel;
exports.isSectionCode = isSectionCode;
exports.CSS_MPT_BASE = "/dashboard/mock-tests/css-mpt";
/** 33% of the questions, rounded up, using integer maths so 200 gives exactly 66 and there is no float drift. */
function sectionPassMarks(count) {
    return Math.ceil((count * 33) / 100);
}
function asFullTest(mock) {
    return { ...mock, kind: "full", mockId: mock.id, mockTitle: mock.title };
}
/** One section of a mock as its own test: 1 minute per question, pass mark 33% rounded up, no negative marking. */
function buildSectionTest(mock, code) {
    let offset = 0;
    for (const sec of mock.sections) {
        if (sec.code === code) {
            const count = sec.count;
            return {
                id: `${mock.id}-${sec.code}`,
                kind: "section",
                mockId: mock.id,
                mockTitle: mock.title,
                sectionCode: sec.code,
                title: `${mock.title} - ${sec.subject.split(" / ")[0] ?? sec.subject}`,
                totalQuestions: count,
                timeMinutes: count,
                passMarks: sectionPassMarks(count),
                negativeMarking: mock.negativeMarking,
                sections: [sec],
                questionIds: mock.questionIds.slice(offset, offset + count),
            };
        }
        offset += sec.count;
    }
    return null;
}
function getSectionTests(mock) {
    return mock.sections.map((s) => buildSectionTest(mock, s.code)).filter((t) => t !== null);
}
function testHref(test) {
    return test.kind === "full" ? `${exports.CSS_MPT_BASE}/${test.id}` : `${exports.CSS_MPT_BASE}/section/${test.mockId}/${test.sectionCode}`;
}
/** "mock2" -> "Mock 2" */
function mockLabel(mockId) {
    const m = /^mock(\d+)$/.exec(mockId);
    return m ? `Mock ${m[1]}` : mockId;
}
function isSectionCode(code) {
    return ["IS", "UR", "EN", "GA", "GK"].includes(code);
}
