/**
 * Content Health — shared types.
 *
 * Everything in `src/lib/content-health` is framework-free: it reads the
 * platform's existing registries (subjects, GLE, quizzes, learning paths,
 * connections, MPT, teacher tests) and reports cross-reference problems.
 * It never writes anything and never needs a database. The same code backs
 * `npm run health` (CLI / CI) and the `/admin/health` page.
 */

export type Severity = "critical" | "high" | "medium" | "low" | "info";

export const SEVERITIES: Severity[] = ["critical", "high", "medium", "low", "info"];

export const SEVERITY_LABEL: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
  info: "Info",
};

/** Lower number = more severe. */
export const SEVERITY_RANK: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };

export type Area = "overlay" | "registry" | "routes" | "gle" | "quiz" | "paths" | "connections" | "mpt" | "teacher";

export const AREA_LABEL: Record<Area, string> = {
  overlay: "Published content",
  registry: "Subject registry",
  routes: "Routes",
  gle: "Learning experiences (GLE)",
  quiz: "Quiz & practice banks",
  paths: "Learning paths",
  connections: "Cross-subject connections",
  mpt: "CSS MPT",
  teacher: "Teacher tests (PST / JEST / JST)",
};

export interface Finding {
  /** Stable across runs for the same problem: `${check}::${entity}`. */
  id: string;
  /** Machine id of the check, e.g. "quiz.answer-not-in-options". */
  check: string;
  area: Area;
  severity: Severity;
  /** Subject slug when the finding belongs to one (used for filtering). */
  subject?: string;
  /** What is wrong, in one sentence. */
  title: string;
  /** Extra context: ids, counts, how to fix. */
  detail?: string;
  /** What the finding is about, e.g. a question id or a route. */
  entity: string;
  /** Learner-facing route that is affected, when there is one. */
  href?: string;
  /** Source file to open, relative to the project root, when known. */
  file?: string;
}

export interface CheckDefinition {
  id: string;
  area: Area;
  severity: Severity;
  description: string;
}

/** Pages found under `src/app`, as URL paths. `null` when the filesystem isn't readable (e.g. serverless runtime). */
export interface RouteIndex {
  /** Concrete static page routes, e.g. "/dashboard/physics/newtons-laws". */
  staticPages: Set<string>;
  /** Patterns for dynamic routes, e.g. "/dashboard/[subject]/[topic]". */
  dynamicPages: string[];
}

export interface HealthContext {
  routes: RouteIndex | null;
  overlay: { generatedAt: string | null; empty: boolean; ignored: { scope: string; id: string; why: string }[] };
  subjects: typeof import("@/features/subjects/data/subjects").subjects;
  gle: typeof import("@/features/learning/registry").topicContentList;
  quizzes: typeof import("@/features/quiz-engine/registry").quizzes;
  paths: typeof import("@/features/learning-path/registry").learningPathList;
  connections: typeof import("@/features/cross-subject-connections/data/connections").crossSubjectConnections;
  mpt: {
    bank: typeof import("@/features/mpt-mock/data/mpt-mock-data").MPT_QUESTION_BANK;
    mocks: typeof import("@/features/mpt-mock/engine").MPT_MOCKS;
  };
  teacher: {
    config: typeof import("@/features/teacher-tests/config").teacherExamConfig;
    banks: Record<"pst" | "jest" | "jst", import("@/features/teacher-tests/types").TeacherQuestion[]>;
  };
}

export type CheckFn = (ctx: HealthContext) => Finding[];

export interface HealthReport {
  generatedAt: string;
  durationMs: number;
  routeChecksRan: boolean;
  findings: Finding[];
  counts: Record<Severity, number>;
  byArea: Record<Area, Record<Severity, number>>;
  checksRun: CheckDefinition[];
}

/** Helper: a Finding with its id filled in. */
export function finding(f: Omit<Finding, "id">): Finding {
  return { ...f, id: `${f.check}::${f.entity}` };
}
