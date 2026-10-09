/** Grades teacher-test sessions that finished (or ran out of time) while the person was elsewhere. The bank is loaded only when needed. */
import { gradeMock } from "@/features/mpt-mock/engine";
import { attemptFromResult } from "@/features/mpt-mock/attempts";
import { loadSession, recordAttempt, saveSession } from "@/features/mpt-mock/storage";
import type { StoredSession } from "@/features/mpt-mock/storage";
import { loadBank } from "./bank-loader";
import { teacherExamConfig } from "./config";
import { planMocks } from "./generator";
import { loadPracticeRecord } from "./storage";
import { buildMockTest, buildPracticeTest, toRunnerQuestions } from "./tests";
import type { TeacherTest } from "./tests";
import type { ExamType, TeacherQuestion } from "./types";

export function mockTestId(exam: ExamType, index: number): string {
  return `${exam}-mock${index}`;
}

/** Rebuilds the test and its questions for a stored test id ("pst-mock3" or "pst-p-xxxx"), or null if it cannot be rebuilt. */
export async function rebuildTest(exam: ExamType, testId: string, bankIn?: TeacherQuestion[]) {
  const cfg = teacherExamConfig[exam];
  const bank = bankIn ?? (await loadBank(exam));
  const m = /^[a-z]+-mock(\d+)$/.exec(testId);
  let test: TeacherTest | null = null;
  if (m && m[1]) {
    const n = Number(m[1]);
    if (n >= 1 && n <= cfg.mock.mockCount) {
      const planned = planMocks(cfg, bank, n)[n - 1];
      if (planned) test = buildMockTest(cfg, planned);
    }
  } else {
    const rec = loadPracticeRecord(testId);
    if (rec) {
      const byId = new Map(bank.map((q) => [q.id, q] as const));
      const qs = rec.questionIds.map((id) => byId.get(id)).filter((q): q is TeacherQuestion => !!q);
      if (qs.length > 0) test = buildPracticeTest(cfg, testId, rec.spec, qs);
    }
  }
  if (!test) return null;
  return { cfg, bank, test, questions: toRunnerQuestions(test, cfg, bank) };
}

/** Writes a finished or expired stored session into the attempt history. */
export async function finalizeTeacherSession(exam: ExamType, testId: string): Promise<void> {
  const session = loadSession(testId);
  if (!session) return;
  let s: StoredSession = session;
  if (s.submittedAt === null) {
    if (Date.now() < s.endsAt) return;
    s = { ...s, submittedAt: s.endsAt, autoSubmitted: true };
    saveSession(s);
  }
  const built = await rebuildTest(exam, testId);
  if (!built) return;
  const result = gradeMock(built.test, built.questions, s.answers);
  recordAttempt(testId, attemptFromResult(result, s));
}
