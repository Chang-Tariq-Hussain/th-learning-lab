import { loadCodeBank } from "../../src/features/teacher-tests/bank-loader";
import { codeQuizzes } from "../../src/features/quiz-engine/registry";
import { MPT_MOCK_1, MPT_MOCK_2, MPT_QUESTION_BANK } from "../../src/features/mpt-mock/data/mpt-mock-data";
import type { Baseline } from "../../src/lib/content-overlay/publish";

/** The code registries exactly as written (no overlay): what the database is compared against. */
export async function loadBaseline(): Promise<Baseline> {
  return {
    quiz: codeQuizzes,
    mpt: MPT_QUESTION_BANK,
    mockQuestionIds: [...new Set([...MPT_MOCK_1.questionIds, ...MPT_MOCK_2.questionIds])],
    teacher: { pst: await loadCodeBank("pst"), jest: await loadCodeBank("jest"), jst: await loadCodeBank("jst") },
  };
}
