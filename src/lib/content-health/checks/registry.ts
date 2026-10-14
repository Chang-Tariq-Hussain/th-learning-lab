import { finding, type CheckDefinition, type CheckFn, type Finding } from "../types";
import { allSims, routeExists, subjectOfHref } from "../registry-index";

export const registryChecks: CheckDefinition[] = [
  { id: "registry.duplicate-href", area: "registry", severity: "high", description: "Two simulations share the same route." },
  { id: "registry.duplicate-slug", area: "registry", severity: "high", description: "Two simulations in one subject share a slug." },
  { id: "registry.href-subject-mismatch", area: "registry", severity: "medium", description: "A simulation's route is not under its own subject." },
  { id: "registry.empty-topic", area: "registry", severity: "low", description: "A topic has no simulations (renders as 'coming soon')." },
  { id: "routes.missing-page", area: "routes", severity: "high", description: "A registered simulation has no page.tsx." },
  { id: "routes.orphan-page", area: "routes", severity: "medium", description: "A simulation page exists but is not in the subject registry (not searchable, not listed)." },
];

export const checkRegistry: CheckFn = (ctx) => {
  const out: Finding[] = [];
  const sims = allSims(ctx);

  const byHref = new Map<string, string[]>();
  const bySlug = new Map<string, string[]>();
  for (const s of sims) {
    (byHref.get(s.href) ?? byHref.set(s.href, []).get(s.href)!).push(`${s.subjectSlug}/${s.topicSlug}/${s.slug}`);
    const k = `${s.subjectSlug}:${s.slug}`;
    (bySlug.get(k) ?? bySlug.set(k, []).get(k)!).push(s.topicSlug);
    const sub = subjectOfHref(s.href);
    if (sub && sub !== s.subjectSlug) {
      out.push(finding({ check: "registry.href-subject-mismatch", area: "registry", severity: "medium", subject: s.subjectSlug, entity: s.href,
        title: `"${s.title}" is registered under ${s.subjectSlug} but its route is under ${sub}.`, href: s.href, file: "src/features/subjects/data/subjects.ts" }));
    }
  }
  for (const [href, where] of byHref) {
    if (where.length > 1) out.push(finding({ check: "registry.duplicate-href", area: "registry", severity: "high", entity: href,
      title: `Route ${href} is registered ${where.length} times.`, detail: where.join(", "), href, file: "src/features/subjects/data/subjects.ts" }));
  }
  for (const [key, topics] of bySlug) {
    if (topics.length > 1) out.push(finding({ check: "registry.duplicate-slug", area: "registry", severity: "high", subject: key.split(":")[0], entity: key,
      title: `Slug "${key.split(":")[1]}" is used by ${topics.length} simulations in ${key.split(":")[0]}.`, detail: `Topics: ${topics.join(", ")}`, file: "src/features/subjects/data/subjects.ts" }));
  }
  for (const s of ctx.subjects) for (const t of s.topics) {
    if (t.visualizations.length === 0) out.push(finding({ check: "registry.empty-topic", area: "registry", severity: "low", subject: s.slug, entity: `${s.slug}/${t.slug}`,
      title: `Topic "${t.name}" has no simulations yet.`, href: `/dashboard/${s.slug}/${t.slug}`, file: "src/features/subjects/data/subjects.ts" }));
  }

  if (ctx.routes) {
    const registered = new Set(sims.map((s) => s.href));
    for (const s of sims) {
      if (!routeExists(s.href, ctx.routes)) out.push(finding({ check: "routes.missing-page", area: "routes", severity: "high", subject: s.subjectSlug, entity: s.href,
        title: `"${s.title}" is registered but ${s.href} has no page.`, href: s.href, file: "src/features/subjects/data/subjects.ts" }));
    }
    const topicRoutes = new Set(ctx.subjects.flatMap((s) => s.topics.map((t) => `/dashboard/${s.slug}/${t.slug}`)));
    const subjectSlugs = new Set<string>(ctx.subjects.map((s) => s.slug));
    for (const page of ctx.routes.staticPages) {
      const m = /^\/dashboard\/([^/]+)\/([^/]+)$/.exec(page);
      if (!m || !subjectSlugs.has(m[1]!)) continue;
      const slug = m[2]!;
      // Standalone quiz pages are intentionally outside the simulation registry.
      if (slug.endsWith("-quiz") || registered.has(page) || topicRoutes.has(page)) continue;
      out.push(finding({ check: "routes.orphan-page", area: "routes", severity: "medium", subject: m[1], entity: page,
        title: `${page} exists but is not in the subject registry.`,
        detail: "It will not appear on subject/topic pages or in search. Register it in subjects.ts, or remove the page.", href: page,
        file: `src/app${page}/page.tsx` }));
    }
  }
  return out;
};
