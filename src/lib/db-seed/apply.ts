import { bundleCounts } from "./bundle";
import { asJson, cast, insertRows, jsonb, selectMap, textArray, upsertEntities, type Col, type SqlClient, type UpsertResult } from "./sql";
import type { SeedBundle } from "./types";

export interface TableReport { inserted: number; updated: number; skipped: number }
export interface ApplyReport {
  mode: "dry-run" | "apply";
  expected: Record<string, number>;
  tables: Record<string, TableReport>;
  /** Child-row sets (nodes, bank items, sections, exam questions, question_exams) rewritten because their parent changed. */
  childRowsWritten: Record<string, number>;
  /** Rows an admin has edited since import (content_hash <> source_hash). Never overwritten. */
  editedInAdmin: Record<string, number>;
}

const HASHED_TABLES = ["subjects", "topics", "simulations", "gle_topics", "learning_paths", "question_banks", "exam_types", "questions", "exams", "connections"] as const;

const tally = (r: UpsertResult): TableReport => ({ inserted: r.inserted, updated: r.updated, skipped: r.skipped });
const need = (m: Map<string, string>, key: string, what: string): string => {
  const v = m.get(key);
  if (!v) throw new Error(`Import: cannot resolve ${what} "${key}" — referenced data is missing from the database.`);
  return v;
};

/**
 * Loads a SeedBundle into Postgres inside ONE transaction.
 *   dry-run → everything runs, the outcome is reported, then it is rolled back.
 *   apply   → committed, with an audit_log entry.
 * Idempotent: running it twice changes nothing the second time. Never deletes.
 */
export async function applyBundle(client: SqlClient, bundle: SeedBundle, opts: { apply: boolean; actor?: string }): Promise<ApplyReport> {
  const report: ApplyReport = { mode: opts.apply ? "apply" : "dry-run", expected: bundleCounts(bundle), tables: {}, childRowsWritten: {}, editedInAdmin: {} };
  const child = (name: string, n: number): void => { report.childRowsWritten[name] = (report.childRowsWritten[name] ?? 0) + n; };

  await client.query("begin");
  try {
    // 1 ── subjects, topics, simulations ───────────────────────────────────
    report.tables["subjects"] = tally(await upsertEntities(client, "subjects",
      [{ name: "slug" }, { name: "code" }, { name: "name" }, { name: "tagline" }, { name: "description" }, { name: "notation" }, { name: "sort_order" }, { name: "content_hash" }, { name: "source_hash" }],
      bundle.subjects.map((s) => [s.slug, s.code, s.name, s.tagline, s.description, s.notation, s.sort_order, s.hash, s.hash]),
      ["slug"], ["id"]));
    const subjectId = await selectMap(client, "select id, slug from public.subjects", ["slug"]);

    report.tables["topics"] = tally(await upsertEntities(client, "topics",
      [{ name: "subject_id" }, { name: "slug" }, { name: "name" }, { name: "sort_order" }, { name: "content_hash" }, { name: "source_hash" }],
      bundle.topics.map((t) => [need(subjectId, t.subject_slug, "subject"), t.slug, t.name, t.sort_order, t.hash, t.hash]),
      ["subject_id", "slug"], ["id"]));
    const topicId = await selectMap(client, "select t.id, s.slug as s, t.slug as t from public.topics t join public.subjects s on s.id = t.subject_id", ["s", "t"]);

    report.tables["simulations"] = tally(await upsertEntities(client, "simulations",
      [{ name: "subject_id" }, { name: "topic_id" }, { name: "slug" }, { name: "content_slug" }, { name: "title" }, { name: "description" }, { name: "href" }, { name: "sort_order" }, { name: "content_hash" }, { name: "source_hash" }],
      bundle.simulations.map((s) => [need(subjectId, s.subject_slug, "subject"), need(topicId, `${s.subject_slug}:${s.topic_slug}`, "topic"), s.slug, s.content_slug, s.title, s.description, s.href, s.sort_order, s.hash, s.hash]),
      ["subject_id", "slug"], ["id"]));
    const simId = await selectMap(client, "select id, href from public.simulations", ["href"]);

    // 2 ── GLE content ───────────────────────────────────────────────────────
    report.tables["gle_topics"] = tally(await upsertEntities(client, "gle_topics",
      [{ name: "simulation_id" }, jsonb("content"), textArray("dropped_paths"), { name: "schema_version" }, { name: "content_hash" }, { name: "source_hash" }],
      bundle.gle.map((g) => [need(simId, g.href, "simulation"), asJson(g.content), asJson(g.dropped_paths), g.schema_version, g.hash, g.hash]),
      ["simulation_id"], ["id"]));

    // 3 ── exam types (+ sections) ───────────────────────────────────────────
    const etRes = await upsertEntities(client, "exam_types",
      [{ name: "slug" }, { name: "name" }, jsonb("config"), { name: "content_hash" }, { name: "source_hash" }],
      bundle.examTypes.map((t) => [t.slug, t.name, asJson(t.config), t.hash, t.hash]), ["slug"], ["id", "slug"]);
    report.tables["exam_types"] = tally(etRes);
    const examTypeId = await selectMap(client, "select id, slug from public.exam_types", ["slug"]);
    for (const ch of etRes.changed) {
      const t = bundle.examTypes.find((x) => x.slug === ch["slug"])!;
      await client.query("delete from public.exam_sections where exam_type_id = $1", [ch["id"]]);
      await insertRows(client, "exam_sections",
        [{ name: "exam_type_id" }, { name: "code" }, { name: "title" }, { name: "subject" }, { name: "question_count" }, { name: "position" }, jsonb("branches")],
        t.sections.map((s) => [ch["id"], s.code, s.title, s.subject, s.question_count, s.position, s.branches ? asJson(s.branches) : null]));
      child("exam_sections", t.sections.length);
    }

    // 4 ── questions (+ per-exam metadata) ──────────────────────────────────
    const qCols: Col[] = [
      { name: "source_system" }, { name: "legacy_id" }, { name: "subject_id" }, { name: "exam_subject" }, { name: "topic" }, { name: "concept" }, { name: "difficulty" },
      { name: "stem" }, { name: "passage" }, jsonb("options"), { name: "correct_index" }, { name: "fixed_order" }, { name: "explanation" }, jsonb("hints"),
      { name: "misconception_tag" }, { name: "language" }, cast("source_type", "public.question_source"), { name: "source_detail" }, { name: "source_exam" },
      { name: "source_year" }, { name: "source_reference" }, { name: "source_note" }, cast("answer_check", "public.answer_check"), { name: "verified_note" },
      { name: "needs_review" }, jsonb("extra"), { name: "content_hash" }, { name: "source_hash" },
    ];
    const qByKey = new Map(bundle.questions.map((q) => [`${q.source_system}:${q.legacy_id}`, q]));
    const qRes = await upsertEntities(client, "questions", qCols,
      bundle.questions.map((q) => [
        q.source_system, q.legacy_id, q.subject_slug ? need(subjectId, q.subject_slug, "subject") : null, q.exam_subject, q.topic, q.concept, q.difficulty,
        q.stem, q.passage, asJson(q.options), q.correct_index, q.fixed_order, q.explanation, q.hints ? asJson(q.hints) : null,
        q.misconception_tag, q.language, q.source_type, q.source_detail, q.source_exam,
        q.source_year, q.source_reference, q.source_note, q.answer_check, q.verified_note,
        q.needs_review, asJson(q.extra), q.hash, q.hash,
      ]), ["source_system", "legacy_id"], ["id", "source_system", "legacy_id"]);
    report.tables["questions"] = tally(qRes);
    const questionId = await selectMap(client, "select id, source_system, legacy_id from public.questions", ["source_system", "legacy_id"]);

    const qeRows: unknown[][] = [];
    const changedIds: unknown[] = [];
    for (const ch of qRes.changed) {
      const q = qByKey.get(`${ch["source_system"]}:${ch["legacy_id"]}`)!;
      changedIds.push(ch["id"]);
      for (const e of q.exams) qeRows.push([ch["id"], need(examTypeId, e.exam_slug, "exam type"), e.topic, e.subtopic, e.difficulty, e.section_code]);
    }
    for (let i = 0; i < changedIds.length; i += 1000) {
      await client.query("delete from public.question_exams where question_id = any($1::uuid[])", [changedIds.slice(i, i + 1000)]);
    }
    await insertRows(client, "question_exams", [{ name: "question_id" }, { name: "exam_type_id" }, { name: "topic" }, { name: "subtopic" }, { name: "difficulty" }, { name: "section_code" }], qeRows);
    child("question_exams", qeRows.length);

    // 5 ── quiz banks (+ ordered items) ──────────────────────────────────────
    const bankRes = await upsertEntities(client, "question_banks",
      [{ name: "slug" }, { name: "subject_id" }, { name: "title" }, { name: "description" }, { name: "subject_label" }, { name: "topic_label" }, { name: "back_href" }, { name: "difficulty" }, { name: "estimated_time" }, { name: "content_hash" }, { name: "source_hash" }],
      bundle.banks.map((b) => [b.slug, need(subjectId, b.subject_slug, "subject"), b.title, b.description, b.subject_label, b.topic_label, b.back_href, b.difficulty, b.estimated_time, b.hash, b.hash]),
      ["slug"], ["id", "slug"]);
    report.tables["question_banks"] = tally(bankRes);
    for (const ch of bankRes.changed) {
      const b = bundle.banks.find((x) => x.slug === ch["slug"])!;
      await client.query("delete from public.question_bank_items where bank_id = $1", [ch["id"]]);
      await insertRows(client, "question_bank_items", [{ name: "bank_id" }, { name: "question_id" }, { name: "position" }],
        b.question_ids.map((qid, i) => [ch["id"], need(questionId, `quiz:${qid}`, "question"), i]));
      child("question_bank_items", b.question_ids.length);
    }

    // 6 ── stored exams (+ ordered questions) ────────────────────────────────
    const exRes = await upsertEntities(client, "exams",
      [{ name: "exam_type_id" }, { name: "slug" }, { name: "title" }, { name: "total_questions" }, { name: "time_minutes" }, { name: "pass_marks" }, { name: "negative_marking" }, { name: "content_hash" }, { name: "source_hash" }],
      bundle.exams.map((e) => [need(examTypeId, e.exam_type_slug, "exam type"), e.slug, e.title, e.total_questions, e.time_minutes, e.pass_marks, e.negative_marking, e.hash, e.hash]),
      ["exam_type_id", "slug"], ["id", "slug"]);
    report.tables["exams"] = tally(exRes);
    for (const ch of exRes.changed) {
      const e = bundle.exams.find((x) => x.slug === ch["slug"])!;
      await client.query("delete from public.exam_questions where exam_id = $1", [ch["id"]]);
      await insertRows(client, "exam_questions", [{ name: "exam_id" }, { name: "position" }, { name: "question_id" }, { name: "section_code" }],
        e.questions.map((q) => [ch["id"], q.position, need(questionId, `mpt:${q.legacy_id}`, "question"), q.section_code]));
      child("exam_questions", e.questions.length);
    }

    // 7 ── learning paths (+ nodes, prerequisites) ───────────────────────────
    const pathRes = await upsertEntities(client, "learning_paths",
      [{ name: "slug" }, { name: "subject_id" }, { name: "title" }, { name: "description" }, { name: "color_token" }, { name: "content_hash" }, { name: "source_hash" }],
      bundle.paths.map((p) => [p.slug, need(subjectId, p.subject_slug, "subject"), p.title, p.description, p.color_token, p.hash, p.hash]),
      ["slug"], ["id", "slug"]);
    report.tables["learning_paths"] = tally(pathRes);
    for (const ch of pathRes.changed) {
      const p = bundle.paths.find((x) => x.slug === ch["slug"])!;
      await client.query("delete from public.learning_path_nodes where path_id = $1", [ch["id"]]);
      await insertRows(client, "learning_path_nodes",
        [{ name: "path_id" }, { name: "position" }, { name: "subject_slug" }, { name: "topic_slug" }, { name: "simulation_id" }, { name: "href" }, { name: "title" }, { name: "description" }, { name: "is_challenge" }, { name: "prereq_mode" }],
        p.nodes.map((n) => [ch["id"], n.position, n.subject_slug, n.topic_slug, simId.get(n.href) ?? null, n.href, n.title, n.description, n.is_challenge, n.prereq_mode]));
      const nodeId = await selectMap(client, `select id, subject_slug as s, topic_slug as t from public.learning_path_nodes where path_id = '${String(ch["id"])}'`, ["s", "t"]);
      const pre: unknown[][] = [];
      for (const n of p.nodes) for (const q of n.prereqs) pre.push([need(nodeId, `${n.subject_slug}:${n.topic_slug}`, "path node"), need(nodeId, `${q.subject_slug}:${q.topic_slug}`, "prerequisite node")]);
      await insertRows(client, "learning_path_prereqs", [{ name: "node_id" }, { name: "requires_node_id" }], pre);
      child("learning_path_nodes", p.nodes.length);
      child("learning_path_prereqs", pre.length);
    }

    // 8 ── connections ───────────────────────────────────────────────────────
    report.tables["connections"] = tally(await upsertEntities(client, "connections",
      [{ name: "legacy_id" }, jsonb("data"), { name: "content_hash" }, { name: "source_hash" }],
      bundle.connections.map((c) => [c.legacy_id, asJson(c.data), c.hash, c.hash]), ["legacy_id"], ["id"]));

    // Rows edited in admin since a previous import (informational).
    for (const t of HASHED_TABLES) {
      const r = await client.query(`select count(*)::int as n from public.${t} where content_hash <> source_hash`);
      report.editedInAdmin[t] = Number(r.rows[0]?.["n"] ?? 0);
    }

    if (opts.apply) {
      await client.query(
        "insert into public.audit_log (actor_email, actor_role, action, entity, meta) values ($1, 'operator-script', 'content.import', 'registries', $2::jsonb)",
        [opts.actor ?? "cli", asJson({ tables: report.tables, childRowsWritten: report.childRowsWritten })]);
      await client.query("commit");
    } else {
      await client.query("rollback");
    }
  } catch (e) {
    await client.query("rollback").catch(() => undefined);
    throw e;
  }
  return report;
}
