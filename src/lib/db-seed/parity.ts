import { bundleCounts } from "./bundle";
import type { SqlClient } from "./sql";
import type { SeedBundle } from "./types";

export interface ParityTable {
  table: string;
  expected: number;
  /** DB row exists and was imported from exactly this registry version. */
  matching: number;
  /** In registries but not in the database. */
  missing: string[];
  missingCount: number;
  /** In both, but imported from a different registry version (registry changed since; re-import). */
  stale: number;
  /** Edited in admin since import (content_hash differs) — expected after Phase 3, never overwritten. */
  editedInAdmin: number;
  /** In the database but no longer in any registry (admin-created or removed from code). */
  extra: number;
}
export interface ParityChild { name: string; expected: number; actual: number; ok: boolean }
export interface ParityReport {
  ok: boolean;
  percent: number;
  tables: ParityTable[];
  children: ParityChild[];
  problems: string[];
}

interface Spec { table: string; sql: string; expected: { key: string; hash: string }[] }

export async function computeParity(client: SqlClient, b: SeedBundle): Promise<ParityReport> {
  const specs: Spec[] = [
    { table: "subjects", sql: "select slug as k, source_hash, content_hash from public.subjects", expected: b.subjects.map((x) => ({ key: x.slug, hash: x.hash })) },
    { table: "topics", sql: "select s.slug || ':' || t.slug as k, t.source_hash, t.content_hash from public.topics t join public.subjects s on s.id = t.subject_id", expected: b.topics.map((x) => ({ key: `${x.subject_slug}:${x.slug}`, hash: x.hash })) },
    { table: "simulations", sql: "select href as k, source_hash, content_hash from public.simulations", expected: b.simulations.map((x) => ({ key: x.href, hash: x.hash })) },
    { table: "gle_topics", sql: "select s.href as k, g.source_hash, g.content_hash from public.gle_topics g join public.simulations s on s.id = g.simulation_id", expected: b.gle.map((x) => ({ key: x.href, hash: x.hash })) },
    { table: "learning_paths", sql: "select slug as k, source_hash, content_hash from public.learning_paths", expected: b.paths.map((x) => ({ key: x.slug, hash: x.hash })) },
    { table: "question_banks", sql: "select slug as k, source_hash, content_hash from public.question_banks", expected: b.banks.map((x) => ({ key: x.slug, hash: x.hash })) },
    { table: "questions", sql: "select source_system || ':' || legacy_id as k, source_hash, content_hash from public.questions", expected: b.questions.map((x) => ({ key: `${x.source_system}:${x.legacy_id}`, hash: x.hash })) },
    { table: "exam_types", sql: "select slug as k, source_hash, content_hash from public.exam_types", expected: b.examTypes.map((x) => ({ key: x.slug, hash: x.hash })) },
    { table: "exams", sql: "select et.slug || ':' || e.slug as k, e.source_hash, e.content_hash from public.exams e join public.exam_types et on et.id = e.exam_type_id", expected: b.exams.map((x) => ({ key: `${x.exam_type_slug}:${x.slug}`, hash: x.hash })) },
    { table: "connections", sql: "select legacy_id as k, source_hash, content_hash from public.connections", expected: b.connections.map((x) => ({ key: x.legacy_id, hash: x.hash })) },
  ];

  const tables: ParityTable[] = [];
  for (const s of specs) {
    const db = new Map<string, { source: string | null; content: string }>();
    for (const r of (await client.query(s.sql)).rows) db.set(String(r["k"]), { source: r["source_hash"] as string | null, content: String(r["content_hash"]) });
    const want = new Set(s.expected.map((e) => e.key));
    let matching = 0, stale = 0, edited = 0;
    const missing: string[] = [];
    let missingCount = 0;
    for (const e of s.expected) {
      const row = db.get(e.key);
      if (!row) { missingCount += 1; if (missing.length < 10) missing.push(e.key); continue; }
      if (row.content !== row.source) edited += 1;
      if (row.source === e.hash) matching += 1; else stale += 1;
    }
    let extra = 0;
    for (const k of db.keys()) if (!want.has(k)) extra += 1;
    tables.push({ table: s.table, expected: s.expected.length, matching, missing, missingCount, stale, editedInAdmin: edited, extra });
  }

  const counts = bundleCounts(b);
  const n = async (sql: string): Promise<number> => Number((await client.query(sql)).rows[0]?.["n"] ?? 0);
  const children: ParityChild[] = [
    ["learning_path_nodes", counts["learning_path_nodes"]!, await n("select count(*)::int n from public.learning_path_nodes")],
    ["learning_path_prereqs", b.paths.reduce((a, p) => a + p.nodes.reduce((m, x) => m + x.prereqs.length, 0), 0), await n("select count(*)::int n from public.learning_path_prereqs")],
    ["question_bank_items", counts["question_bank_items"]!, await n("select count(*)::int n from public.question_bank_items")],
    ["question_exams", counts["question_exams"]!, await n("select count(*)::int n from public.question_exams")],
    ["exam_sections", counts["exam_sections"]!, await n("select count(*)::int n from public.exam_sections")],
    ["exam_questions", counts["exam_questions"]!, await n("select count(*)::int n from public.exam_questions")],
  ].map(([name, expected, actual]) => ({ name: name as string, expected: expected as number, actual: actual as number, ok: expected === actual }));

  const problems: string[] = [];
  const unlinked = await n("select count(*)::int n from public.learning_path_nodes where simulation_id is null");
  const expectedUnlinked = b.paths.reduce((a, p) => a + p.nodes.filter((x) => !b.simulations.some((s) => s.href === x.href)).length, 0);
  if (unlinked !== expectedUnlinked) problems.push(`${unlinked} learning-path node(s) have no linked simulation (expected ${expectedUnlinked}).`);

  const total = tables.reduce((a, t) => a + t.expected, 0);
  const good = tables.reduce((a, t) => a + t.matching, 0);
  const tableOk = tables.every((t) => t.missingCount === 0 && t.stale === 0);
  const ok = tableOk && children.every((c) => c.ok) && problems.length === 0;
  return { ok, percent: total === 0 ? 100 : Math.round((good / total) * 10000) / 100, tables, children, problems };
}
