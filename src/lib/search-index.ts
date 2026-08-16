import { subjects } from "@/features/subjects/data/subjects";

export interface SearchEntry {
  id: string;
  /** What shows as the result's main line. */
  label: string;
  /** A short second line — the topic or a one-line description. */
  subtitle: string;
  subjectName: string;
  subjectSlug: string;
  href: string;
  kind: "subject" | "topic" | "visualization";
}

/**
 * Flattened once, at module load, straight from the existing
 * Subject -> Topic -> Visualization registry — the same data the
 * dashboard/subject/topic pages already render from. Nothing here
 * duplicates simulation names by hand; add a visualization to
 * `subjects.ts` and it's searchable automatically.
 */
export const SEARCH_INDEX: SearchEntry[] = subjects.flatMap((subject): SearchEntry[] => {
  const subjectEntry: SearchEntry = {
    id: `subject:${subject.slug}`,
    label: subject.name,
    subtitle: subject.tagline,
    subjectName: subject.name,
    subjectSlug: subject.slug,
    href: `/dashboard/${subject.slug}`,
    kind: "subject",
  };

  const topicAndVizEntries = subject.topics.flatMap((topic): SearchEntry[] => {
    const topicEntry: SearchEntry = {
      id: `topic:${subject.slug}:${topic.slug}`,
      label: topic.name,
      subtitle: subject.name,
      subjectName: subject.name,
      subjectSlug: subject.slug,
      href: `/dashboard/${subject.slug}/${topic.slug}`,
      kind: "topic",
    };

    const vizEntries: SearchEntry[] = topic.visualizations.map((viz) => ({
      id: `viz:${subject.slug}:${topic.slug}:${viz.slug}`,
      label: viz.title,
      subtitle: `${subject.name} · ${topic.name}`,
      subjectName: subject.name,
      subjectSlug: subject.slug,
      href: viz.href,
      kind: "visualization",
    }));

    return [topicEntry, ...vizEntries];
  });

  return [subjectEntry, ...topicAndVizEntries];
});

export interface SearchMatch extends SearchEntry {
  score: number;
}

/**
 * Plain substring scoring — no fuzzy-matching library, per the
 * brief's "no backend search engine" note. Matches on label first
 * (weighted highest, extra weight for a prefix match), then subtitle.
 */
export function searchIndex(query: string, limit = 8): SearchMatch[] {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return [];

  const matches: SearchMatch[] = [];
  for (const entry of SEARCH_INDEX) {
    const label = entry.label.toLowerCase();
    const subtitle = entry.subtitle.toLowerCase();

    let score = 0;
    if (label === q) score = 100;
    else if (label.startsWith(q)) score = 80;
    else if (label.includes(q)) score = 60;
    else if (subtitle.includes(q)) score = 30;

    if (score > 0) matches.push({ ...entry, score });
  }

  matches.sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));
  return matches.slice(0, limit);
}

/** Groups matches by subject, in `subjects` registry order, for the mobile results view. */
export function groupBySubject(matches: SearchMatch[]): { subjectName: string; entries: SearchMatch[] }[] {
  const order = subjects.map((s) => s.name);
  const groups = new Map<string, SearchMatch[]>();
  for (const match of matches) {
    const list = groups.get(match.subjectName) ?? [];
    list.push(match);
    groups.set(match.subjectName, list);
  }
  return order.filter((name) => groups.has(name)).map((subjectName) => ({ subjectName, entries: groups.get(subjectName)! }));
}
