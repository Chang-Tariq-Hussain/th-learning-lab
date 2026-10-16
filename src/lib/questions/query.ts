import { EXAM_SLUGS, SOURCE_TYPES, STATUSES, SYSTEMS, ANSWER_CHECKS, SUBJECT_SLUGS, isOneOf } from "./types";

export const PAGE_SIZE = 25;
export const EXPORT_LIMIT = 10_000;

export interface QuestionFilters {
  q: string; system: string; source: string; status: string; check: string; review: string; exam: string; subject: string;
  sort: "updated" | "legacy" | "system"; dir: "asc" | "desc"; page: number;
}

/** Whitelists every value, so nothing from the URL reaches a query unchecked. */
export function parseFilters(sp: Record<string, string | undefined>): QuestionFilters {
  const pick = <T extends string>(list: readonly T[], v: string | undefined): string => (isOneOf(list, v) ? v : "");
  return {
    // Strip characters with meaning inside a PostgREST filter expression.
    q: (sp["q"] ?? "").replace(/[,()%*_\\"'`]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80),
    system: pick(SYSTEMS, sp["system"]),
    source: pick(SOURCE_TYPES, sp["source"]),
    status: pick(STATUSES, sp["status"]),
    check: pick(ANSWER_CHECKS, sp["check"]),
    review: sp["review"] === "yes" || sp["review"] === "no" ? sp["review"] : "",
    exam: pick(EXAM_SLUGS, sp["exam"]),
    subject: pick(SUBJECT_SLUGS, sp["subject"]),
    sort: sp["sort"] === "legacy" || sp["sort"] === "system" ? sp["sort"] : "updated",
    dir: sp["dir"] === "asc" ? "asc" : "desc",
    page: Math.max(1, Number.parseInt(sp["page"] ?? "1", 10) || 1),
  };
}

/** The columns the list needs; the exam filter adds an inner join (so it filters AND avoids duplicate rows). */
export function listSelect(f: QuestionFilters): string {
  const base = "id, legacy_id, source_system, exam_subject, stem, source_type, answer_check, status, needs_review, updated_at, content_hash, source_hash, subjects(slug)";
  return f.exam ? `${base}, question_exams!inner(exam_types!inner(slug))` : base;
}

// The Supabase filter builder is a deeply generic chain; a structural type keeps this helper reusable for list + export.
export function applyFilters<Q>(query: Q, f: QuestionFilters): Q {
  let b = query as any;
  if (f.system) b = b.eq("source_system", f.system);
  if (f.source) b = b.eq("source_type", f.source);
  if (f.status) b = b.eq("status", f.status);
  if (f.check) b = b.eq("answer_check", f.check);
  if (f.review) b = b.eq("needs_review", f.review === "yes");
  if (f.subject) b = b.eq("subjects.slug", f.subject).not("subjects", "is", null);
  if (f.exam) b = b.eq("question_exams.exam_types.slug", f.exam);
  if (f.q) b = b.or(`stem.ilike.%${f.q}%,legacy_id.ilike.%${f.q}%`);
  const column = f.sort === "legacy" ? "legacy_id" : f.sort === "system" ? "source_system" : "updated_at";
  b = b.order(column, { ascending: f.dir === "asc" }).order("id", { ascending: true });
  return b as Q;
}

/** Same filters as query-string params, for links (pagination, sort, export). */
export function filterParams(f: QuestionFilters): Record<string, string | undefined> {
  return {
    q: f.q || undefined, system: f.system || undefined, source: f.source || undefined, status: f.status || undefined, check: f.check || undefined,
    review: f.review || undefined, exam: f.exam || undefined, subject: f.subject || undefined,
    sort: f.sort === "updated" ? undefined : f.sort, dir: f.dir === "desc" ? undefined : f.dir,
  };
}
