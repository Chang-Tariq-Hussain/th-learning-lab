/**
 * Builds the overlay from the database. Node-only (operator script + tests); never imported by the learner app.
 *
 * It compares the PUBLISHED view of the database with the code registries and records only the differences.
 * It refuses (returns `problems`) rather than publish anything that could hurt learners:
 *   - a code question that is missing from the database entirely (the database was never imported, or rows were
 *     deleted) — publishing would otherwise silently drop it;
 *   - a quiz bank left with no published questions;
 *   - a question used by a stored mock that is no longer published;
 *   - an overlay that does not reproduce the database's view when applied to the code (self-check).
 */
import { stableStringify } from "@/lib/db-seed/hash";
import type { SqlClient } from "@/lib/db-seed/sql";
import type { QuizMeta, QuizQuestion } from "@/features/quiz-engine/types";
import type { MptQuestion } from "@/features/mpt-mock/data/mpt-mock-data";
import type { ExamType, TeacherQuestion } from "@/features/teacher-tests/types";
import { applyMptOverlay, applyQuizOverlay, applyTeacherOverlay } from "./apply";
import { toMptQuestion, toQuizQuestion, toTeacherQuestion, type DbExamLink, type DbQuestion } from "./from-db";
import type { ContentOverlay, Manifest, QuizBankOverlay, ListOverlay } from "./types";

export interface Baseline {
  quiz: QuizMeta[];
  mpt: MptQuestion[];
  /** ids used by the stored MPT mocks (a mock can't lose a question) */
  mockQuestionIds: string[];
  teacher: Record<ExamType, TeacherQuestion[]>;
}

export interface PublishReport {
  quiz: { replaced: number; removed: number; added: number; banksTouched: number };
  mpt: { replaced: number; dbOnly: number };
  teacher: Record<ExamType, { replaced: number; removed: number; added: number }>;
  questionsInDatabase: number;
}
export interface PublishResult { overlay: ContentOverlay; manifest: Manifest; report: PublishReport; problems: string[] }

const EXAMS: ExamType[] = ["pst", "jest", "jst"];
const same = (a: unknown, b: unknown): boolean => stableStringify(a) === stableStringify(b);
const sortedObject = <T>(o: Record<string, T>): Record<string, T> => Object.fromEntries(Object.entries(o).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));

type Row = DbQuestion & Record<string, unknown>;
type LinkRow = Row & { link_topic: string | null; link_subtopic: string | null; link_difficulty: string | null; link_section: string | null; exam_slug: string };

function asQuestion(r: Row): DbQuestion {
  return { ...(r as unknown as DbQuestion), options: r.options as string[], extra: (r.extra ?? {}) as Record<string, unknown> };
}

export async function buildOverlay(client: SqlClient, base: Baseline, generatedAt: string = new Date().toISOString()): Promise<PublishResult> {
  const problems: string[] = [];
  const q = async (sql: string): Promise<Row[]> => (await client.query(sql)).rows as unknown as Row[];

  // Every question and its state (status + hash) at publish time.
  const all = (await client.query("select source_system, legacy_id, status, content_hash from public.questions")).rows as { source_system: string; legacy_id: string; status: string; content_hash: string }[];
  const status = new Map(all.map((r) => [`${r.source_system}:${r.legacy_id}`, r.status] as const));
  const manifest: Manifest = { version: 1, generatedAt, questions: sortedObject(Object.fromEntries(all.map((r) => [`${r.source_system}:${r.legacy_id}`, `${r.status}|${r.content_hash}`]))) };

  const missing = (system: string, ids: string[]): string[] => ids.filter((id) => !status.has(`${system}:${id}`));
  const reportMissing = (scope: string, ids: string[]): void => {
    if (ids.length) problems.push(`${scope}: ${ids.length} question(s) in the code are missing from the database (e.g. ${ids.slice(0, 3).join(", ")}). Run \`npm run db:import\` first — publishing now would silently drop them.`);
  };

  // ------------------------------------------------------------------ quiz ---
  const quizRows = await q(`
    select b.slug as bank_slug, bi.position, qq.*, s.slug as subject_slug
    from public.question_banks b
    join public.question_bank_items bi on bi.bank_id = b.id
    join public.questions qq on qq.id = bi.question_id
    left join public.subjects s on s.id = qq.subject_id
    where b.status = 'published' and qq.status = 'published' and qq.source_system = 'quiz'
    order by b.slug, bi.position`);
  const byBank = new Map<string, QuizQuestion[]>();
  for (const r of quizRows) (byBank.get(String(r["bank_slug"])) ?? byBank.set(String(r["bank_slug"]), []).get(String(r["bank_slug"]))!).push(toQuizQuestion(asQuestion(r)));

  const quizOverlay: Record<string, QuizBankOverlay> = {};
  const report: PublishReport = { quiz: { replaced: 0, removed: 0, added: 0, banksTouched: 0 }, mpt: { replaced: 0, dbOnly: 0 }, teacher: { pst: { replaced: 0, removed: 0, added: 0 }, jest: { replaced: 0, removed: 0, added: 0 }, jst: { replaced: 0, removed: 0, added: 0 } }, questionsInDatabase: all.length };
  reportMissing("quiz", missing("quiz", base.quiz.flatMap((b) => b.questions.map((x) => x.id))));
  for (const bank of base.quiz) {
    const dbList = byBank.get(bank.id) ?? [];
    if (dbList.length === 0) { problems.push(`quiz bank "${bank.id}" would have no published questions.`); continue; }
    const dbById = new Map(dbList.map((x) => [x.id, x] as const));
    const codeIds = new Set(bank.questions.map((x) => x.id));
    const o: QuizBankOverlay = {};
    const replace: Record<string, QuizQuestion> = {};
    for (const cq of bank.questions) { const d = dbById.get(cq.id); if (d && !same(cq, d)) replace[cq.id] = d; }
    const remove = bank.questions.filter((x) => !dbById.has(x.id)).map((x) => x.id).sort();
    const add = dbList.filter((x) => !codeIds.has(x.id));
    if (Object.keys(replace).length) o.replace = sortedObject(replace);
    if (remove.length) o.remove = remove;
    if (add.length) o.add = add;
    // Reproduce the database order exactly; add an explicit order only if the default doesn't match.
    const applied = applyQuizOverlay([bank], { [bank.id]: o })[0]!.questions.map((x) => x.id);
    const want = dbList.map((x) => x.id);
    if (!same(applied, want)) o.order = want;
    if (Object.keys(o).length) {
      quizOverlay[bank.id] = o;
      report.quiz.replaced += Object.keys(replace).length; report.quiz.removed += remove.length; report.quiz.added += add.length; report.quiz.banksTouched += 1;
    }
  }

  // ------------------------------------------------------------------- MPT ---
  const mptRows = (await q(`
    select qq.*, qe.topic as link_topic, qe.subtopic as link_subtopic, qe.difficulty as link_difficulty, qe.section_code as link_section, et.slug as exam_slug
    from public.questions qq join public.question_exams qe on qe.question_id = qq.id join public.exam_types et on et.id = qe.exam_type_id
    where qq.source_system = 'mpt' and et.slug = 'css-mpt' and qq.status = 'published' order by qq.legacy_id`)) as LinkRow[];
  const mptById = new Map(mptRows.map((r) => [r.legacy_id, toMptQuestion(asQuestion(r), { exam_slug: r.exam_slug, topic: r.link_topic, subtopic: r.link_subtopic, difficulty: r.link_difficulty, section_code: r.link_section })] as const));
  reportMissing("mpt", missing("mpt", base.mpt.map((x) => x.id)));
  const inMock = new Set(base.mockQuestionIds);
  const mptReplace: Record<string, MptQuestion> = {};
  for (const cq of base.mpt) {
    const d = mptById.get(cq.id);
    if (!d) { if (status.has(`mpt:${cq.id}`) && inMock.has(cq.id)) problems.push(`mpt question ${cq.id} is used by a stored mock but is no longer published.`); continue; }
    if (!same(cq, d)) mptReplace[cq.id] = d;
  }
  report.mpt.replaced = Object.keys(mptReplace).length;
  const codeMptIds = new Set(base.mpt.map((x) => x.id));
  report.mpt.dbOnly = mptRows.filter((r) => !codeMptIds.has(r.legacy_id)).length;

  // --------------------------------------------------------------- teacher ---
  const tRows = (await q(`
    select qq.*, qe.topic as link_topic, qe.subtopic as link_subtopic, qe.difficulty as link_difficulty, qe.section_code as link_section, et.slug as exam_slug
    from public.questions qq join public.question_exams qe on qe.question_id = qq.id join public.exam_types et on et.id = qe.exam_type_id
    where qq.source_system = 'teacher' and qq.status = 'published' order by qq.legacy_id, et.slug`)) as LinkRow[];
  const memberships = new Map<string, string[]>();
  for (const r of tRows) (memberships.get(r.legacy_id) ?? memberships.set(r.legacy_id, []).get(r.legacy_id)!).push(r.exam_slug);
  const teacherOverlay: Partial<Record<ExamType, ListOverlay<TeacherQuestion>>> = {};
  for (const exam of EXAMS) {
    reportMissing(`teacher ${exam}`, missing("teacher", base.teacher[exam].map((x) => x.id)));
    const dbList = tRows.filter((r) => r.exam_slug === exam).map((r) => toTeacherQuestion(asQuestion(r), exam, { exam_slug: r.exam_slug, topic: r.link_topic, subtopic: r.link_subtopic, difficulty: r.link_difficulty, section_code: r.link_section }, memberships.get(r.legacy_id) ?? []));
    if (dbList.length === 0) { problems.push(`teacher bank "${exam}" would have no published questions.`); continue; }
    const dbById = new Map(dbList.map((x) => [x.id, x] as const));
    const codeIds = new Set(base.teacher[exam].map((x) => x.id));
    const replace: Record<string, TeacherQuestion> = {};
    for (const cq of base.teacher[exam]) { const d = dbById.get(cq.id); if (d && !same(cq, d)) replace[cq.id] = d; }
    const remove = base.teacher[exam].filter((x) => !dbById.has(x.id)).map((x) => x.id).sort();
    const add = dbList.filter((x) => !codeIds.has(x.id));
    const o: ListOverlay<TeacherQuestion> = {};
    if (Object.keys(replace).length) o.replace = sortedObject(replace);
    if (remove.length) o.remove = remove;
    if (add.length) o.add = add;
    if (Object.keys(o).length) teacherOverlay[exam] = o;
    report.teacher[exam] = { replaced: Object.keys(replace).length, removed: remove.length, added: add.length };
  }

  const overlay: ContentOverlay = { version: 1, generatedAt, quiz: sortedObject(quizOverlay), mpt: Object.keys(mptReplace).length ? { replace: sortedObject(mptReplace) } : {}, teacher: teacherOverlay };

  // Self-check: applying the overlay to the code must reproduce the database's view exactly.
  const skipped: { scope: string; id: string; why: string }[] = [];
  const quizApplied = applyQuizOverlay(base.quiz, overlay.quiz, skipped);
  for (const b of quizApplied) { const want = byBank.get(b.id); if (want && !same(b.questions, want)) problems.push(`self-check: quiz bank "${b.id}" does not reproduce the database view.`); }
  const mptApplied = new Map(applyMptOverlay(base.mpt, overlay.mpt, skipped).map((x) => [x.id, x] as const));
  for (const [id, d] of mptById) if (codeMptIds.has(id) && !same(mptApplied.get(id), d)) problems.push(`self-check: mpt question ${id} does not reproduce the database view.`);
  for (const exam of EXAMS) {
    const applied = new Map(applyTeacherOverlay(exam, base.teacher[exam], overlay.teacher, skipped).map((x) => [x.id, x] as const));
    for (const r of tRows.filter((x) => x.exam_slug === exam)) {
      const d = toTeacherQuestion(asQuestion(r), exam, { exam_slug: r.exam_slug, topic: r.link_topic, subtopic: r.link_subtopic, difficulty: r.link_difficulty, section_code: r.link_section }, memberships.get(r.legacy_id) ?? []);
      if (!same(applied.get(d.id), d)) problems.push(`self-check: teacher ${exam} question ${d.id} does not reproduce the database view.`);
    }
  }
  for (const s of skipped) problems.push(`the overlay contains an invalid item (${s.scope} ${s.id}: ${s.why}) — fix the question, then publish again.`);

  return { overlay, manifest, report, problems };
}

/** The overlay with its timestamp removed — used to tell whether a publish would change anything. */
export const canonicalOverlay = (o: ContentOverlay): string => stableStringify({ ...o, generatedAt: null });
/** Timestamp and the human-readable `report` are excluded: only the question states decide whether a publish is needed. */
export const canonicalManifest = (m: Manifest): string => stableStringify({ ...m, generatedAt: null, report: undefined });
