export type SubjectSlug = "physics" | "chemistry" | "biology" | "mathematics";

/**
 * One interactive page. This is the only thing that ever needs a new
 * object added to it as the platform grows — everything above it
 * (topic cards, activity counts, the subject hub) is derived from
 * however many of these exist, never hand-maintained.
 */
export interface Visualization {
  /** Unique within its topic; used as the card's React key only — the page it links to is `href`, not derived from this. */
  slug: string;
  title: string;
  /** One sentence, shown on the card exactly as written. */
  description: string;
  /** Full route to the existing visualization page, e.g. "/dashboard/mathematics/equation-playground". */
  href: string;
}

/**
 * A topic groups any number of visualizations (zero, while a topic is
 * still a placeholder, up through however many a subject eventually
 * has). `slug` doubles as both this topic's URL segment
 * (`/dashboard/{subject}/{slug}`) and its icon lookup key in
 * `topic-icons.tsx` — one identifier, not two to keep in sync.
 *
 * Convention: a topic's `slug` must not collide with any *visualization*
 * `href`'s final path segment within the same subject, since existing
 * visualization pages live at `/dashboard/{subject}/{visualizationSlug}`
 * (one level, unchanged) while topic pages live at
 * `/dashboard/{subject}/{topicSlug}` (also one level) — Next.js resolves
 * the static visualization routes first, so this only matters if a new
 * topic is ever named exactly the same as an existing visualization's
 * URL segment.
 */
export interface Topic {
  slug: string;
  name: string;
  visualizations: Visualization[];
}

/**
 * Plain, serializable subject data. Kept free of component references
 * so it can safely cross the server/client boundary as props; the
 * matching glyph is looked up by `slug` from `glyphs.tsx`, and each
 * topic's icon by `slug` from `topic-icons.tsx`, both at render time.
 */
export interface Subject {
  slug: SubjectSlug;
  /** Short lab-notebook style code shown on the specimen-card tab, e.g. "PHY·01" */
  code: string;
  name: string;
  tagline: string;
  description: string;
  /** Tailwind color token suffix, matches tailwind.config.ts `subject.*` colors */
  colorToken: string;
  /** A short characteristic notation shown on hover, e.g. "F = ma" */
  notation: string;
  topics: Topic[];
}
