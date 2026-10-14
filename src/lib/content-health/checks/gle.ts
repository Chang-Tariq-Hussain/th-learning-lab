import { finding, type CheckDefinition, type CheckFn, type Finding } from "../types";
import { allSims, simsByHref } from "../registry-index";

export const gleChecks: CheckDefinition[] = [
  { id: "gle.duplicate-key", area: "gle", severity: "high", description: "Two learning experiences share one (subject, topic) key." },
  { id: "gle.href-not-in-registry", area: "gle", severity: "high", description: "A learning experience points at a route that is not in the subject registry." },
  { id: "gle.quiz-missing", area: "gle", severity: "high", description: "A learning experience's Practice step references a quiz bank that does not exist." },
  { id: "gle.slug-mismatch", area: "gle", severity: "medium", description: "A learning experience's topic slug differs from its simulation's registry slug." },
  { id: "gle.missing", area: "gle", severity: "low", description: "A registered simulation has no learning experience (may be intentional)." },
  { id: "gle.no-challenge", area: "gle", severity: "low", description: "A learning experience has no Challenge section." },
];

export const checkGle: CheckFn = (ctx) => {
  const out: Finding[] = [];
  const sims = simsByHref(ctx);
  const quizIds = new Set(ctx.quizzes.map((q) => q.id));
  const keys = new Map<string, number>();

  for (const t of ctx.gle) {
    const key = `${t.subjectSlug}:${t.topicSlug}`;
    keys.set(key, (keys.get(key) ?? 0) + 1);
    const sim = sims.get(t.simulationHref);
    if (!sim) {
      out.push(finding({ check: "gle.href-not-in-registry", area: "gle", severity: "high", subject: t.subjectSlug, entity: key,
        title: `"${t.title}" points at ${t.simulationHref}, which is not in the subject registry.`, href: t.simulationHref,
        file: `src/features/learning/data/${t.subjectSlug}-${t.topicSlug}.tsx` }));
    } else if (sim.slug !== t.topicSlug) {
      out.push(finding({ check: "gle.slug-mismatch", area: "gle", severity: "medium", subject: t.subjectSlug, entity: key,
        title: `"${t.title}" uses content slug "${t.topicSlug}" but its simulation's registry slug is "${sim.slug}".`,
        detail: "Progress is keyed by the content slug. Keep a mapping when this data moves to a database.", href: t.simulationHref }));
    }
    if (t.practice && !quizIds.has(t.practice.quizId)) {
      out.push(finding({ check: "gle.quiz-missing", area: "gle", severity: "high", subject: t.subjectSlug, entity: key,
        title: `"${t.title}" Practice references quiz "${t.practice.quizId}", which is not registered.`, href: t.simulationHref }));
    }
    if (!t.challenge) {
      out.push(finding({ check: "gle.no-challenge", area: "gle", severity: "low", subject: t.subjectSlug, entity: key,
        title: `"${t.title}" has no Challenge section.`, href: t.simulationHref }));
    }
  }
  for (const [key, n] of keys) {
    if (n > 1) out.push(finding({ check: "gle.duplicate-key", area: "gle", severity: "high", subject: key.split(":")[0], entity: key,
      title: `${n} learning experiences are registered for ${key}.`, file: "src/features/learning/registry.ts" }));
  }

  const have = new Set(ctx.gle.map((t) => t.simulationHref));
  for (const s of allSims(ctx)) {
    if (!have.has(s.href)) out.push(finding({ check: "gle.missing", area: "gle", severity: "low", subject: s.subjectSlug, entity: s.href,
      title: `"${s.title}" has no learning experience.`, href: s.href }));
  }
  return out;
};
