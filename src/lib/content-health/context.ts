import type { HealthContext, RouteIndex } from "./types";

/**
 * Loads every registry the checks read. Imports are dynamic so the large
 * question banks (MPT, teacher tests) are only pulled in when a health run
 * actually happens — never into learner bundles.
 */
export async function loadHealthContext(routes: RouteIndex | null): Promise<HealthContext> {
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
  const [pst, jest, jst] = await Promise.all([
    teacherLoader.loadBank("pst"),
    teacherLoader.loadBank("jest"),
    teacherLoader.loadBank("jst"),
  ]);
  return {
    routes,
    subjects: subjects.subjects,
    gle: gle.topicContentList,
    quizzes: quizzes.quizzes,
    paths: paths.learningPathList,
    connections: connections.crossSubjectConnections,
    mpt: { bank: mptData.MPT_QUESTION_BANK, mocks: mptEngine.MPT_MOCKS },
    teacher: { config: teacherConfig.teacherExamConfig, banks: { pst, jest, jst } },
  };
}
