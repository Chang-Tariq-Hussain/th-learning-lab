import { finding, type CheckDefinition, type CheckFn, type Finding } from "../types";
import { allSims, simsByHref } from "../registry-index";

export const pathChecks: CheckDefinition[] = [
  { id: "paths.href-not-in-registry", area: "paths", severity: "high", description: "A learning-path node links to a route that is not in the subject registry." },
  { id: "paths.prereq-not-in-path", area: "paths", severity: "high", description: "A node's prerequisite is not part of the same path." },
  { id: "paths.prereq-cycle", area: "paths", severity: "high", description: "A path's prerequisites form a cycle, so nodes can never unlock." },
  { id: "paths.duplicate-node", area: "paths", severity: "high", description: "A topic appears twice in one path." },
  { id: "paths.node-without-gle", area: "paths", severity: "medium", description: "A node has no learning experience, so its completion signal is weaker." },
  { id: "paths.slug-mismatch", area: "paths", severity: "medium", description: "A node's topic slug differs from its simulation's registry slug." },
  { id: "paths.sim-off-path", area: "paths", severity: "low", description: "Simulations that are on no learning path." },
];

export const checkPaths: CheckFn = (ctx) => {
  const out: Finding[] = [];
  const sims = simsByHref(ctx);
  const gle = new Set(ctx.gle.map((t) => `${t.subjectSlug}:${t.topicSlug}`));
  const onPath = new Set<string>();

  for (const p of ctx.paths) {
    const file = `src/features/learning-path/data/${p.id}.ts`;
    const keys = new Set<string>();
    const nodeKeys = new Set(p.topics.map((t) => `${t.subjectSlug}:${t.topicSlug}`));
    for (const t of p.topics) {
      const key = `${t.subjectSlug}:${t.topicSlug}`;
      onPath.add(t.href);
      if (keys.has(key)) out.push(finding({ check: "paths.duplicate-node", area: "paths", severity: "high", subject: p.subjectSlug, entity: `${p.id}/${key}`, title: `"${t.title}" appears twice in path "${p.id}".`, file }));
      keys.add(key);
      const sim = sims.get(t.href);
      if (!sim) {
        out.push(finding({ check: "paths.href-not-in-registry", area: "paths", severity: "high", subject: p.subjectSlug, entity: `${p.id}/${key}`,
          title: `Path "${p.id}" node "${t.title}" links to ${t.href}, which is not in the subject registry.`, href: t.href, file }));
      } else if (sim.slug !== t.topicSlug) {
        out.push(finding({ check: "paths.slug-mismatch", area: "paths", severity: "medium", subject: p.subjectSlug, entity: `${p.id}/${key}`,
          title: `Path "${p.id}" node "${t.title}" uses slug "${t.topicSlug}" but the registry slug is "${sim.slug}".`, href: t.href, file }));
      }
      if (!gle.has(key)) out.push(finding({ check: "paths.node-without-gle", area: "paths", severity: "medium", subject: p.subjectSlug, entity: `${p.id}/${key}`,
        title: `Path "${p.id}" node "${t.title}" has no registered learning experience.`, href: t.href, file }));
      for (const pre of t.prerequisites ?? []) {
        if (!nodeKeys.has(`${pre.subjectSlug}:${pre.topicSlug}`)) {
          out.push(finding({ check: "paths.prereq-not-in-path", area: "paths", severity: "high", subject: p.subjectSlug, entity: `${p.id}/${key}->${pre.topicSlug}`,
            title: `"${t.title}" requires ${pre.topicSlug}, which is not in path "${p.id}".`, file }));
        }
      }
    }
    // Cycle detection over explicit prerequisites plus the default "previous node" chain.
    const deps = new Map<string, string[]>();
    p.topics.forEach((t, i) => {
      const key = `${t.subjectSlug}:${t.topicSlug}`;
      const explicit = t.prerequisites;
      const list = explicit ? explicit.map((x) => `${x.subjectSlug}:${x.topicSlug}`) : i > 0 ? [`${p.topics[i - 1]!.subjectSlug}:${p.topics[i - 1]!.topicSlug}`] : [];
      deps.set(key, list.filter((k) => nodeKeys.has(k)));
    });
    const state = new Map<string, 1 | 2>();
    let cyclic: string | null = null;
    const visit = (k: string): void => {
      if (cyclic) return;
      state.set(k, 1);
      for (const d of deps.get(k) ?? []) {
        const s = state.get(d);
        if (s === 1) { cyclic = d; return; }
        if (!s) visit(d);
      }
      state.set(k, 2);
    };
    for (const k of deps.keys()) if (!state.get(k)) visit(k);
    if (cyclic) out.push(finding({ check: "paths.prereq-cycle", area: "paths", severity: "high", subject: p.subjectSlug, entity: p.id, title: `Path "${p.id}" has a prerequisite cycle involving ${cyclic}.`, file }));
  }

  const off = new Map<string, string[]>();
  for (const s of allSims(ctx)) if (!onPath.has(s.href)) (off.get(s.subjectSlug) ?? off.set(s.subjectSlug, []).get(s.subjectSlug)!).push(s.slug);
  for (const [subject, slugs] of off) {
    out.push(finding({ check: "paths.sim-off-path", area: "paths", severity: "low", subject, entity: subject,
      title: `${slugs.length} ${subject} simulation(s) are on no learning path.`, detail: slugs.join(", ") }));
  }
  return out;
};
