import type { HealthContext } from "./types";

/** Flat views over the subject registry, shared by several checks. */
export interface SimEntry {
  subjectSlug: string;
  topicSlug: string;
  slug: string;
  title: string;
  href: string;
}

export function allSims(ctx: Pick<HealthContext, "subjects">): SimEntry[] {
  return ctx.subjects.flatMap((s) =>
    s.topics.flatMap((t) =>
      t.visualizations.map((v) => ({ subjectSlug: s.slug, topicSlug: t.slug, slug: v.slug, title: v.title, href: v.href })),
    ),
  );
}

export function simsByHref(ctx: Pick<HealthContext, "subjects">): Map<string, SimEntry> {
  return new Map(allSims(ctx).map((s) => [s.href, s]));
}

/** "/dashboard/physics/simple-motion" -> "physics". */
export function subjectOfHref(href: string): string | undefined {
  const m = /^\/dashboard\/([^/]+)\//.exec(href);
  return m ? m[1] : undefined;
}

/** True when `href` resolves to a page: a static page, or a dynamic route whose shape matches. */
export function routeExists(href: string, routes: NonNullable<HealthContext["routes"]>): boolean {
  const path = href.split("#")[0]!.split("?")[0]!.replace(/\/+$/, "") || "/";
  if (routes.staticPages.has(path)) return true;
  const segs = path.split("/").filter(Boolean);
  return routes.dynamicPages.some((pattern) => {
    const ps = pattern.split("/").filter(Boolean);
    if (ps.length !== segs.length) return false;
    return ps.every((p, i) => (p.startsWith("[") && p.endsWith("]")) || p === segs[i]);
  });
}
