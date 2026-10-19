import type { HealthContext, RouteIndex } from "./types";

/**
 * Loads every registry the checks read. Imports are dynamic so the large
 * question banks (MPT, teacher tests) are only pulled in when a health run
 * actually happens — never into learner bundles.
 *
 * By default the registries are as LEARNERS see them (code + published overlay), so health checks validate
 * what is actually served. `raw: true` returns the code as written — the baseline the importer and publisher
 * compare the database against.
 */
import { applyMptOverlay, applyQuizOverlay, applyTeacherOverlay, overlayIsEmpty } from "@/lib/content-overlay/apply";
import { overlay } from "@/lib/content-overlay/current";
import type { SkippedItem } from "@/lib/content-overlay/types";

export async function loadHealthContext(routes: RouteIndex | null, opts: { raw?: boolean } = {}): Promise<HealthContext> {
  const [subjects, gle, quizzes, paths, connections, mptData, mptEngine, teacherConfig, teacherLoader] = await Promise.all([
    import("@/features/subjects/data/subjects"),
    import("@/features/learning/registry"),
    import("@/features/quiz-engine/registry"),
    import("@/features/learning-path/registry"),
    import("@/features/cross-subject-connections/data/connections"),
    import("@/features/mpt-mock/data/mpt-mock-data"),
    import("@/features/mpt-mock/engine"),
    import("@/features/teacher-tests/config"),
    import("@/features/teacher-tests/bank-loader"),
  ]);
  const load = opts.raw ? teacherLoader.loadCodeBank : teacherLoader.loadBank;
  const [pst, jest, jst] = await Promise.all([load("pst"), load("jest"), load("jst")]);
  // Anything in the published overlay that the learner app would IGNORE (invalid, stale or unknown): reported, never served.
  const ignored: SkippedItem[] = [];
  applyQuizOverlay(quizzes.codeQuizzes, overlay.quiz, ignored);
  applyMptOverlay(mptData.MPT_QUESTION_BANK, overlay.mpt, ignored);
  for (const exam of ["pst", "jest", "jst"] as const) applyTeacherOverlay(exam, await teacherLoader.loadCodeBank(exam), overlay.teacher, ignored);
  return {
    routes,
    overlay: { generatedAt: overlay.generatedAt, empty: overlayIsEmpty(overlay), ignored },
    subjects: subjects.subjects,
    gle: gle.topicContentList,
    quizzes: opts.raw ? quizzes.codeQuizzes : quizzes.quizzes,
    paths: paths.learningPathList,
    connections: connections.crossSubjectConnections,
    mpt: { bank: mptData.MPT_QUESTION_BANK, mocks: mptEngine.MPT_MOCKS },
    teacher: { config: teacherConfig.teacherExamConfig, banks: { pst, jest, jst } },
  };
}
