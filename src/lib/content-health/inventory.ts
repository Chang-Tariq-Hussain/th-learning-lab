import type { HealthContext } from "./types";
import { allSims } from "./registry-index";

/** Real counts taken straight from the registries. No activity or user numbers — none exist yet. */
export interface Inventory {
  subjects: { slug: string; name: string; topics: number; simulations: number; gle: number; quizBanks: number; questions: number; paths: number }[];
  totals: {
    subjects: number; topics: number; simulations: number; gle: number; gleChallenges: number;
    quizBanks: number; quizQuestions: number; paths: number; pathNodes: number; connections: number;
  };
  mpt: { questions: number; mocks: number; bySource: Record<string, number>; verified: number };
  teacher: { exam: string; label: string; questions: number; unique: number; bySource: Record<string, number>; verified: number; mocks: number; needsReview: number }[];
}

export function computeInventory(ctx: HealthContext): Inventory {
  const sims = allSims(ctx);
  const subjects = ctx.subjects.map((s) => ({
    slug: s.slug,
    name: s.name,
    topics: s.topics.length,
    simulations: sims.filter((x) => x.subjectSlug === s.slug).length,
    gle: ctx.gle.filter((t) => t.subjectSlug === s.slug).length,
    quizBanks: ctx.quizzes.filter((q) => q.subjectSlug === s.slug).length,
    questions: ctx.quizzes.filter((q) => q.subjectSlug === s.slug).reduce((n, q) => n + q.questions.length, 0),
    paths: ctx.paths.filter((p) => p.subjectSlug === s.slug).length,
  }));
  const tally = <T,>(list: T[], key: (x: T) => string): Record<string, number> => {
    const m: Record<string, number> = {};
    for (const x of list) m[key(x)] = (m[key(x)] ?? 0) + 1;
    return m;
  };
  const labels = { pst: "PST", jest: "JEST", jst: "JST" } as const;
  const teacher = (["pst", "jest", "jst"] as const).map((exam) => {
    const bank = ctx.teacher.banks[exam];
    return {
      exam,
      label: labels[exam],
      questions: bank.length,
      unique: new Set(bank.map((q) => q.id)).size,
      bySource: tally(bank, (q) => q.sourceType),
      verified: bank.filter((q) => q.verified).length,
      mocks: ctx.teacher.config[exam].mock.mockCount,
      needsReview: bank.filter((q) => q.needsReview).length,
    };
  });
  return {
    subjects,
    totals: {
      subjects: ctx.subjects.length,
      topics: ctx.subjects.reduce((n, s) => n + s.topics.length, 0),
      simulations: sims.length,
      gle: ctx.gle.length,
      gleChallenges: ctx.gle.reduce((n, t) => n + (t.challenge?.scenarios.length ?? 0), 0),
      quizBanks: ctx.quizzes.length,
      quizQuestions: ctx.quizzes.reduce((n, q) => n + q.questions.length, 0),
      paths: ctx.paths.length,
      pathNodes: ctx.paths.reduce((n, p) => n + p.topics.length, 0),
      connections: ctx.connections.length,
    },
    mpt: {
      questions: ctx.mpt.bank.length,
      mocks: ctx.mpt.mocks.length,
      bySource: tally(ctx.mpt.bank, (q) => q.sourceType),
      verified: ctx.mpt.bank.filter((q) => q.verified).length,
    },
    teacher,
  };
}
