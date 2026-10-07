/**
 * Pure helpers for "tests": a full mock (200 questions) or a single-section test cut from one mock.
 * This file must NOT import the question bank as a value, so light pages (hub, landing) can use it without shipping 400 questions.
 */
import type { MptMockDefinition } from "./data/mpt-mock-data";

export const CSS_MPT_BASE = "/dashboard/mock-tests/css-mpt";

export type SectionCode = "IS" | "UR" | "EN" | "GA" | "GK";

export interface MptTest extends MptMockDefinition {
  kind: "full" | "section";
  /** id of the mock this test belongs to (same as `id` for full mocks) */
  mockId: string;
  mockTitle: string;
  sectionCode?: SectionCode;
}

/** 33% of the questions, rounded up, using integer maths so 200 gives exactly 66 and there is no float drift. */
export function sectionPassMarks(count: number): number {
  return Math.ceil((count * 33) / 100);
}

export function asFullTest(mock: MptMockDefinition): MptTest {
  return { ...mock, kind: "full", mockId: mock.id, mockTitle: mock.title };
}

/** One section of a mock as its own test: 1 minute per question, pass mark 33% rounded up, no negative marking. */
export function buildSectionTest(mock: MptMockDefinition, code: string): MptTest | null {
  let offset = 0;
  for (const sec of mock.sections) {
    if (sec.code === code) {
      const count = sec.count;
      return {
        id: `${mock.id}-${sec.code}`,
        kind: "section",
        mockId: mock.id,
        mockTitle: mock.title,
        sectionCode: sec.code as SectionCode,
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

export function getSectionTests(mock: MptMockDefinition): MptTest[] {
  return mock.sections.map((s) => buildSectionTest(mock, s.code)).filter((t): t is MptTest => t !== null);
}

export function testHref(test: Pick<MptTest, "kind" | "id" | "mockId" | "sectionCode">): string {
  return test.kind === "full" ? `${CSS_MPT_BASE}/${test.id}` : `${CSS_MPT_BASE}/section/${test.mockId}/${test.sectionCode}`;
}

/** "mock2" -> "Mock 2" */
export function mockLabel(mockId: string): string {
  const m = /^mock(\d+)$/.exec(mockId);
  return m ? `Mock ${m[1]}` : mockId;
}

export function isSectionCode(code: string): code is SectionCode {
  return ["IS", "UR", "EN", "GA", "GK"].includes(code);
}
