/**
 * `npm run db:verify` — end-to-end proof of the database layer on a real
 * PostgreSQL (PGlite): migrations, provenance constraints, row-level security,
 * audited role functions, append-only audit log, and the registry import
 * (dry-run, apply, idempotency, never overwriting admin edits) plus parity.
 *
 * Uses the project's real registries as input. Needs no network and no Supabase.
 */
import { loadHealthContext } from "../../src/lib/content-health";
import { applyBundle, buildSeedBundle, bundleCounts, computeParity } from "../../src/lib/db-seed";
import type { SeedBundle } from "../../src/lib/db-seed";
import { ADMIN_ROLES, can, isAdminRole } from "../../src/lib/admin/permissions";
import { createSessionToken, safeNextPath, verifySessionToken } from "../../src/lib/admin/session";
import { csvCell, toCsv } from "../../src/lib/questions/csv";
import { parseNewQuestion, parseProvenance, parseQuestionContent } from "../../src/lib/questions/form";
import { parseFilters } from "../../src/lib/questions/query";
import { asUser, expectFail, newDatabase } from "./pg-harness";

let passed = 0;
const failures: string[] = [];
function check(name: string, ok: boolean, detail = ""): void {
  if (ok) { passed += 1; console.log(`  ✓ ${name}`); }
  else { failures.push(name); console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`); }
}
const section = (s: string): void => console.log(`\n${s}`);

const ids = {
  super: "00000000-0000-0000-0000-000000000001",
  content: "00000000-0000-0000-0000-000000000002",
  question: "00000000-0000-0000-0000-000000000003",
  analyst: "00000000-0000-0000-0000-000000000004",
  learner: "00000000-0000-0000-0000-000000000005",
  super2: "00000000-0000-0000-0000-000000000006",
};

async function main(): Promise<void> {
  const db = await newDatabase();
  const n = async (sql: string): Promise<number> => Number(((await db.query(sql)).rows[0] as { n: number }).n);

  section("1. Build the seed bundle from the real registries");
  const ctx = await loadHealthContext(null);
  const bundle = buildSeedBundle(ctx);
  const expected = bundleCounts(bundle);
  console.log("   ", JSON.stringify(expected));
  check("bundle has subjects/simulations/questions", expected["subjects"] === 5 && expected["simulations"]! > 100 && expected["questions"]! > 4000);
  const droppedTotal = bundle.gle.reduce((a, g) => a + g.dropped_paths.length, 0);
  check("GLE serialisation records what stays in code", droppedTotal > 0, `${droppedTotal} React/function nodes left in code across ${bundle.gle.filter((g) => g.dropped_paths.length).length} topics`);
  console.log(`    (${droppedTotal} diagram/verifier nodes are intentionally not stored)`);

  section("2. Import: dry-run leaves nothing behind");
  const dry = await applyBundle(db, bundle, { apply: false });
  check("dry-run reports inserts for every table", dry.tables["questions"]!.inserted === expected["questions"] && dry.tables["subjects"]!.inserted === 5);
  check("dry-run was rolled back (database still empty)", (await n("select count(*)::int n from public.questions")) === 0 && (await n("select count(*)::int n from public.audit_log")) === 0);

  section("3. Import: apply");
  const applied = await applyBundle(db, bundle, { apply: true, actor: "verify" });
  for (const [t, r] of Object.entries(applied.tables)) console.log(`    ${t.padEnd(16)} +${r.inserted} ~${r.updated} =${r.skipped}`);
  check("every table loaded exactly the expected row count", Object.entries({
    subjects: "subjects", topics: "topics", simulations: "simulations", gle_topics: "gle_topics", learning_paths: "learning_paths",
    question_banks: "question_banks", questions: "questions", exam_types: "exam_types", exams: "exams", connections: "connections",
  }).every(([t]) => applied.tables[t]!.inserted === expected[t]));
  const parity = await computeParity(db, bundle);
  check(`parity = ${parity.percent}% and all child counts match`, parity.ok && parity.percent === 100, JSON.stringify(parity.tables.filter((t) => t.missingCount || t.stale)));
  for (const c of parity.children) check(`child rows: ${c.name} ${c.actual}/${c.expected}`, c.ok);
  check("import wrote an audit entry", (await n("select count(*)::int n from public.audit_log where action = 'content.import'")) === 1);

  section("4. Provenance is structural, and the imported data respects it");
  const mix = (await db.query("select source_system, source_type, answer_check, count(*)::int n from public.questions group by 1,2,3 order by 1,2,3")).rows as { source_system: string; source_type: string; answer_check: string; n: number }[];
  for (const r of mix) console.log(`    ${r.source_system.padEnd(8)} ${r.source_type.padEnd(20)} ${r.answer_check.padEnd(22)} ${r.n}`);
  check("no generated question is checked as a past paper", !mix.some((r) => r.source_type === "generated" && r.answer_check === "independently_checked"));
  check("every verified past paper has a source year", (await n("select count(*)::int n from public.questions where source_type = 'verified_past_paper' and source_year is null")) === 0);
  const baseQ = `insert into public.questions (source_system, legacy_id, exam_subject, stem, options, correct_index, explanation, source_type, answer_check, source_year, content_hash)`;
  await expectFail("generated + independently_checked", () => db.query(`${baseQ} values ('mpt','X1','S','q','["a","b"]',0,'e','generated','independently_checked',null,'h')`), /questions_generated_never_verified/);
  check("DB refuses a generated question marked independently checked", true);
  await expectFail("past paper without year", () => db.query(`${baseQ} values ('mpt','X2','S','q','["a","b"]',0,'e','verified_past_paper','unchecked',null,'h')`), /questions_past_paper_has_year/);
  check("DB refuses a past paper with no source year", true);
  await expectFail("answer index out of range", () => db.query(`${baseQ} values ('mpt','X3','S','q','["a","b"]',5,'e','existing_bank','unchecked',null,'h')`), /questions_correct_in_range/);
  check("DB refuses a correct-answer index outside the options", true);
  await expectFail("published without explanation", () => db.query(`${baseQ} values ('mpt','X4','S','q','["a","b"]',0,'','existing_bank','unchecked',null,'h')`), /questions_published_complete/);
  check("DB refuses a published question with no explanation", true);
  await expectFail("no subject at all", () => db.query(`${baseQ} values ('mpt','X5',null,'q','["a","b"]',0,'e','existing_bank','unchecked',null,'h')`), /questions_one_subject_kind/);
  check("DB refuses a question with neither subject kind", true);

  section("5. Re-import is idempotent");
  const again = await applyBundle(db, bundle, { apply: true });
  check("second apply inserts and updates nothing", Object.values(again.tables).every((r) => r.inserted === 0 && r.updated === 0));
  check("second apply rewrites no child rows", Object.keys(again.childRowsWritten).length === 0 || Object.values(again.childRowsWritten).every((x) => x === 0));

  section("6. Import never overwrites an admin's edit");
  const victim = bundle.questions.find((q) => q.source_system === "quiz")!;
  await db.query("update public.questions set stem = 'EDITED IN ADMIN', content_hash = 'admin-edit' where source_system = 'quiz' and legacy_id = $1", [victim.legacy_id]);
  const changed: SeedBundle = structuredClone(bundle);
  const other = changed.questions.filter((q) => q.source_system === "quiz")[5]!;
  other.stem = `${other.stem} (registry revision)`; other.hash = "registry-v2-other";
  const edited = changed.questions.find((q) => q.legacy_id === victim.legacy_id)!;
  edited.stem = "registry also changed this one"; edited.hash = "registry-v2-victim";
  const r3 = await applyBundle(db, changed, { apply: true });
  check("untouched row picks up the registry change (1 updated)", r3.tables["questions"]!.updated === 1);
  check("edited row is skipped, not overwritten", (await db.query<{ stem: string }>("select stem from public.questions where legacy_id = $1 and source_system='quiz'", [victim.legacy_id])).rows[0]?.stem === "EDITED IN ADMIN");
  check("import reports the admin-edited row", r3.editedInAdmin["questions"] === 1);
  const p3 = await computeParity(db, changed);
  const pq = p3.tables.find((t) => t.table === "questions")!;
  check("parity flags it as edited + stale, and reports nothing missing", pq.editedInAdmin === 1 && pq.stale === 1 && pq.missingCount === 0);
  await db.query(`insert into public.subjects (slug, code, name, tagline, description, sort_order, content_hash) values ('admin-made','AM','Admin made','t','d',99,'x')`);
  const p4 = await computeParity(db, bundle);
  check("admin-created rows are kept and counted as extra, never deleted", p4.tables.find((t) => t.table === "subjects")!.extra === 1 && (await n("select count(*)::int n from public.subjects")) === 6);
  await db.query("delete from public.subjects where slug = 'admin-made'");

  section("7. Audit log is append-only");
  await expectFail("update audit", () => db.query("update public.audit_log set action = 'x'"), /append-only/);
  await expectFail("delete audit", () => db.query("delete from public.audit_log"), /append-only/);
  await expectFail("truncate audit", () => db.query("truncate public.audit_log"), /append-only/);
  check("UPDATE, DELETE and TRUNCATE on audit_log are all refused", true);

  section("8. Row-level security and roles");
  for (const [k, id] of Object.entries(ids)) await db.query("insert into auth.users (id, email) values ($1, $2)", [id, `${k}@example.com`]);
  await db.query("insert into public.admin_roles (user_id, email, role) values ($1,'super@example.com','super_admin'), ($2,'content@example.com','content_manager'), ($3,'question@example.com','question_manager'), ($4,'analyst@example.com','analyst')", [ids.super, ids.content, ids.question, ids.analyst]);

  check("anonymous visitors get no table access at all", await asUser(db, null, async () => { try { await db.query("select * from public.subjects"); return false; } catch (e) { return /permission denied/.test(String(e)); } }));
  check("a signed-in learner (no admin role) sees nothing", await asUser(db, ids.learner, async () => (await n("select count(*)::int n from public.questions")) === 0 && (await n("select count(*)::int n from public.subjects")) === 0));
  check("a learner cannot write", await asUser(db, ids.learner, async () => { try { await db.query("update public.questions set explanation = 'x'"); return (await n("select count(*)::int n from public.questions")) === 0; } catch { return true; } }));
  for (const [who, id] of [["analyst", ids.analyst], ["content_manager", ids.content], ["question_manager", ids.question], ["super_admin", ids.super]] as const) {
    check(`${who} can read questions and subjects`, await asUser(db, id, async () => (await n("select count(*)::int n from public.questions")) === expected["questions"] && (await n("select count(*)::int n from public.subjects")) === 5));
  }
  const canUpdate = async (id: string, table: string, set: string): Promise<boolean> => {
    try {
      return await asUser(db, id, async () => Number((await db.query<{ n: number }>(`with u as (update public.${table} set ${set} returning 1) select count(*)::int n from u`)).rows[0]?.n) > 0);
    } catch (e) {
      if (/permission denied/.test(String(e))) return false; // revoked privilege = cannot
      throw e;
    }
  };
  check("analyst cannot edit anything", !(await canUpdate(ids.analyst, "simulations", "title = title")) && !(await canUpdate(ids.analyst, "questions", "explanation = explanation")));
  check("content_manager edits simulations but not questions", (await canUpdate(ids.content, "simulations", "title = title")) && !(await canUpdate(ids.content, "questions", "explanation = explanation")));
  check("nobody — not even question_manager or super_admin — can write questions directly (audited functions only)",
    !(await canUpdate(ids.question, "questions", "explanation = explanation")) && !(await canUpdate(ids.super, "questions", "explanation = explanation")));
  check("question_manager cannot edit simulations; super_admin can", !(await canUpdate(ids.question, "simulations", "title = title")) && (await canUpdate(ids.super, "simulations", "title = title")));
  check("only super_admin can read the audit log", await asUser(db, ids.super, async () => (await n("select count(*)::int n from public.audit_log")) > 0)
    && await asUser(db, ids.content, async () => (await n("select count(*)::int n from public.audit_log")) === 0)
    && await asUser(db, ids.analyst, async () => (await n("select count(*)::int n from public.audit_log")) === 0));
  check("nobody can insert into the audit log directly", await asUser(db, ids.super, async () => { try { await db.query("insert into public.audit_log (action, entity) values ('forged','x')"); return false; } catch { return true; } }));
  check("an admin sees only their own role row; super_admin sees all", await asUser(db, ids.content, async () => (await n("select count(*)::int n from public.admin_roles")) === 1) && await asUser(db, ids.super, async () => (await n("select count(*)::int n from public.admin_roles")) === 4));
  check("nobody can edit admin_roles directly", await asUser(db, ids.super, async () => { try { await db.query("update public.admin_roles set role = 'analyst'"); return false; } catch { return true; } }));
  check("storage bucket exists and is private", (await n("select count(*)::int n from storage.buckets where id = 'content-media' and public = false")) === 1);

  section("9. Audited role management");
  const call = (id: string, sql: string, params: unknown[] = []): Promise<unknown> => asUser(db, id, () => db.query(sql, params));
  await call(ids.super, "select public.admin_set_role_by_email('learner@example.com', 'analyst')");
  check("super_admin can grant a role", (await n("select count(*)::int n from public.admin_roles where email = 'learner@example.com' and role = 'analyst'")) === 1);
  check("the grant is audited with actor, before and after", (await n("select count(*)::int n from public.audit_log where action = 'admin.role_granted' and actor_id = '" + ids.super + "' and after->>'role' = 'analyst'")) === 1);
  await call(ids.super, "select public.admin_set_role_by_email('learner@example.com', 'content_manager')");
  check("a role change is audited with the previous role", (await n("select count(*)::int n from public.audit_log where action = 'admin.role_changed' and before->>'role' = 'analyst' and after->>'role' = 'content_manager'")) === 1);
  await expectFail("non-super grant", () => call(ids.content, "select public.admin_set_role_by_email('analyst@example.com', 'super_admin')"), /forbidden/);
  check("a content_manager cannot grant roles (nor promote themselves)", true);
  await expectFail("unknown email", () => call(ids.super, "select public.admin_set_role_by_email('nobody@example.com', 'analyst')"), /no account/);
  check("granting to a non-existent account is refused", true);
  await expectFail("demote last super", () => call(ids.super, "select public.admin_set_role_by_email('super@example.com', 'analyst')"), /last super admin/);
  await expectFail("revoke last super", () => call(ids.super, "select public.admin_revoke_role($1)", [ids.super]), /last super admin/);
  check("the last super admin can be neither demoted nor revoked", true);
  await call(ids.super, "select public.admin_set_role_by_email('super2@example.com', 'super_admin')");
  await call(ids.super, "select public.admin_set_role_by_email('super@example.com', 'analyst')");
  check("with two super admins, one may step down", (await n("select count(*)::int n from public.admin_roles where role = 'super_admin'")) === 1);
  await call(ids.super2, "select public.admin_revoke_role($1)", [ids.learner]);
  check("revoking a role works, is audited, and removes access", (await n("select count(*)::int n from public.audit_log where action = 'admin.role_revoked'")) === 1
    && await asUser(db, ids.learner, async () => (await n("select count(*)::int n from public.questions")) === 0));
  check("write_audit records the caller, not a client-supplied actor", await (async () => {
    await call(ids.question, "select public.write_audit('question.edit', 'question', 'q1', null, '{\"a\":1}'::jsonb, '{\"actor_email\":\"spoof@evil\"}'::jsonb)");
    return (await n("select count(*)::int n from public.audit_log where action = 'question.edit' and actor_id = '" + ids.question + "' and actor_email = 'question@example.com' and actor_role = 'question_manager'")) === 1;
  })());
  await expectFail("learner audit write", () => call(ids.learner, "select public.write_audit('x','y')"), /forbidden/);
  check("a user without an admin role cannot write audit entries", true);

  section("11. Question Bank administration (audited functions)");
  const S = ids.super2, QM = ids.question;
  const rows = async (id: string, sql: string, params: unknown[] = []): Promise<Record<string, any>[]> => asUser(db, id, async () => (await db.query(sql, params)).rows as Record<string, any>[]);
  const fn = async (id: string, sql: string, params: unknown[] = []): Promise<any> => (await rows(id, sql, params))[0];
  const one = async (sql: string, params: unknown[] = []): Promise<Record<string, any>> => (await db.query(sql, params)).rows[0] as Record<string, any>;
  const auditCount = async (action?: string): Promise<number> => n(`select count(*)::int n from public.audit_log ${action ? `where action = '${action}'` : ""}`);

  const quizQ = await one("select id, content_hash, explanation from public.questions where source_system='quiz' order by legacy_id limit 1");
  const pastQ = await one("select id, content_hash, stem from public.questions where source_type='verified_past_paper' and answer_check='independently_checked' and source_system='mpt' order by legacy_id limit 1");
  const genQ = await one("select id, content_hash from public.questions where source_type='generated' and source_system='mpt' order by legacy_id limit 1");
  const reviewQ = await one("select id from public.questions where needs_review = true order by legacy_id limit 1");

  // direct writes and role gating
  for (const [who, id] of [["question_manager", QM], ["super_admin", S]] as const) {
    await expectFail(`${who} direct UPDATE`, () => asUser(db, id, () => db.query("update public.questions set stem = 'x'")), /permission denied/);
    await expectFail(`${who} direct DELETE`, () => asUser(db, id, () => db.query("delete from public.questions")), /permission denied/);
    await expectFail(`${who} direct INSERT question_exams`, () => asUser(db, id, () => db.query("insert into public.question_exams (question_id, exam_type_id) select id, (select id from public.exam_types limit 1) from public.questions limit 1")), /permission denied/);
  }
  check("no signed-in user can INSERT/UPDATE/DELETE questions or question_exams directly", true);
  for (const [who, id] of [["content_manager", ids.content], ["analyst", ids.analyst], ["learner", ids.learner]] as const) {
    await expectFail(`${who} question_save`, () => fn(id, "select public.question_save($1, $2, '{\"explanation\":\"x\"}')", [quizQ.id, quizQ.content_hash]), /forbidden/);
    await expectFail(`${who} question_create`, () => fn(id, "select public.question_create('{}')"), /forbidden/);
    await expectFail(`${who} question_set_status`, () => fn(id, "select public.question_set_status(array[$1::uuid], 'archived', 'testing it')", [quizQ.id]), /forbidden/);
    await expectFail(`${who} question_import`, () => fn(id, "select public.question_import('[]', true)"), /forbidden/);
  }
  check("content_manager, analyst and learner cannot use any question write function", true);
  await expectFail("anon save", () => asUser(db, null, () => db.query("select public.question_save($1, $2, '{}')", [quizQ.id, quizQ.content_hash])), /permission denied/);
  check("anonymous callers cannot even execute them", true);

  // save: concurrency, whitelist, audit, no-op, constraint rollback
  await expectFail("stale hash", () => fn(QM, "select public.question_save($1, 'e:stale', '{\"explanation\":\"x\"}')", [quizQ.id]), /changed by someone else/);
  await expectFail("non-content field", () => fn(QM, "select public.question_save($1, $2, '{\"source_type\":\"generated\"}')", [quizQ.id, quizQ.content_hash]), /cannot be edited here/);
  check("a stale edit and an edit to a non-content field are both refused", true);
  const a0 = await auditCount("question.updated");
  const saved = (await fn(QM, "select public.question_save($1, $2, $3::jsonb) r", [quizQ.id, quizQ.content_hash, JSON.stringify({ explanation: "Edited by the question manager." })])).r;
  const afterSave = await one("select content_hash, source_hash, explanation, status from public.questions where id = $1", [quizQ.id]);
  check("a valid edit applies and marks the row as edited since import", saved.changed === true && afterSave.explanation === "Edited by the question manager." && String(afterSave.content_hash).startsWith("e:") && afterSave.content_hash !== afterSave.source_hash);
  const aud = await one("select actor_email, actor_role, before, after, meta from public.audit_log where action = 'question.updated' and entity_id = $1 order by id desc limit 1", [quizQ.id]);
  check("the edit is audited with actor, role and only the changed field before/after", (await auditCount("question.updated")) === a0 + 1 && aud.actor_email === "question@example.com" && aud.actor_role === "question_manager"
    && JSON.stringify(aud.before) === JSON.stringify({ explanation: quizQ.explanation }) && JSON.stringify(aud.after) === '{"explanation":"Edited by the question manager."}');
  await expectFail("replay with the old hash", () => fn(QM, "select public.question_save($1, $2, '{\"explanation\":\"again\"}')", [quizQ.id, quizQ.content_hash]), /changed by someone else/);
  check("replaying the old hash is refused (no lost updates)", true);
  const noop = (await fn(QM, "select public.question_save($1, $2, $3::jsonb) r", [quizQ.id, saved.content_hash, JSON.stringify({ explanation: "Edited by the question manager." })])).r;
  check("saving identical content is a no-op and writes no audit entry", noop.changed === false && (await auditCount("question.updated")) === a0 + 1);
  await expectFail("answer index out of range", () => fn(QM, "select public.question_save($1, $2, '{\"correct_index\": 9}')", [quizQ.id, saved.content_hash]), /questions_correct_in_range/);
  check("a constraint violation is refused and nothing changes", (await one("select correct_index from public.questions where id = $1", [quizQ.id]))["correct_index"] < 4);
  const sv = (await fn(S, "select public.question_save($1, $2, $3::jsonb) r", [pastQ.id, pastQ.content_hash, JSON.stringify({ stem: `${pastQ.stem} (reworded)` })])).r;
  check("changing the substance of a checked past paper resets its answer check and says so", sv.answer_check_reset === true
    && (await one("select answer_check, source_type from public.questions where id = $1", [pastQ.id]))["answer_check"] === "unchecked"
    && (await one("select source_type from public.questions where id = $1", [pastQ.id]))["source_type"] === "verified_past_paper"
    && (await n(`select count(*)::int n from public.audit_log where entity_id = '${pastQ.id}' and meta->>'answer_check_reset' = 'true'`)) === 1);

  // provenance
  await expectFail("generated → past paper", () => fn(S, "select public.question_set_provenance($1, $2, $3::jsonb, 'found it in a real paper')", [genQ.id, genQ.content_hash, JSON.stringify({ source_type: "verified_past_paper", source_year: 2021, source_reference: "FPSC 2021 MPT" })]), /cannot be relabelled as a verified past paper/);
  check("a generated question can NEVER be relabelled a verified past paper (even with year + reference + reason)", true);
  await expectFail("generated → independently_checked", () => fn(S, "select public.question_set_provenance($1, $2, $3::jsonb, 'trying to mark it as checked')", [genQ.id, genQ.content_hash, JSON.stringify({ answer_check: "independently_checked" })]), /questions_generated_never_verified/);
  check("a generated question cannot be marked independently checked", true);
  await expectFail("short reason", () => fn(S, "select public.question_set_provenance($1, $2, '{\"source_note\":\"n\"}', 'short')", [genQ.id, genQ.content_hash]), /reason of at least 10/);
  await expectFail("non-provenance field", () => fn(S, "select public.question_set_provenance($1, $2, '{\"stem\":\"n\"}', 'a long enough reason')", [genQ.id, genQ.content_hash]), /not a provenance field/);
  check("provenance changes need a real reason and only touch provenance fields", true);
  const pv = (await fn(QM, "select public.question_set_provenance($1, $2, $3::jsonb, $4) r", [quizQ.id, saved.content_hash, JSON.stringify({ source_type: "existing_bank", source_note: "Taken from the old class set" }), "Source clarified with the author"])).r;
  const pva = await one("select before, after, meta from public.audit_log where action = 'question.provenance_changed' and entity_id = $1", [quizQ.id]);
  check("a legitimate provenance change works and the audit entry records the reason", pv.changed === true && pva.meta.reason === "Source clarified with the author" && pva.after.source_type === "existing_bank" && pva.before.source_type === "platform_authored");

  // create
  const newQuiz = { source_system: "quiz", subject_slug: "physics", topic: "simple-motion", difficulty: "easy", stem: "What is speed?", options: ["Distance over time", "Mass over volume"], correct_index: 0, explanation: "Speed is distance per unit time." };
  const createdId = (await fn(QM, "select public.question_create($1::jsonb) id", [JSON.stringify(newQuiz)])).id as string;
  const cq = await one("select legacy_id, status, source_hash, content_hash, source_type, answer_check from public.questions where id = $1", [createdId]);
  check("a new question is created as a draft, platform-authored, unchecked, with an admin id and no import hash", cq.status === "draft" && String(cq.legacy_id).startsWith("adm-") && cq.source_hash === null && String(cq.content_hash).startsWith("e:") && cq.source_type === "platform_authored" && cq.answer_check === "unchecked");
  check("creation is audited", (await auditCount("question.created")) >= 1);
  const bad = (obj: object): Promise<any> => fn(QM, "select public.question_create($1::jsonb)", [JSON.stringify({ ...newQuiz, ...obj })]);
  await expectFail("past paper no year", () => bad({ source_type: "verified_past_paper", source_reference: "FPSC" }), /needs a source year/);
  await expectFail("past paper no reference", () => bad({ source_type: "verified_past_paper", source_year: 2020 }), /needs a source year and a source reference/);
  await expectFail("pre-checked answer", () => bad({ answer_check: "independently_checked" }), /start unchecked/);
  await expectFail("unknown subject", () => bad({ subject_slug: "astrology" }), /unknown subject_slug/);
  await expectFail("unknown field", () => bad({ status: "published" }), /unknown field "status"/);
  await expectFail("answer index out of range", () => bad({ correct_index: 7 }), /questions_correct_in_range/);
  check("creation refuses: past paper without evidence, pre-checked answers, unknown subject/field, a self-published status, bad answer index", true);
  const pastNew = (await fn(QM, "select public.question_create($1::jsonb) id", [JSON.stringify({ ...newQuiz, source_type: "verified_past_paper", source_year: 2019, source_reference: "FPSC MPT 2019, Q12", stem: "Past paper stem" })])).id;
  check("a past-paper question with year + reference is accepted (still a draft, still unchecked)", !!pastNew);
  const examQ = (await fn(QM, "select public.question_create($1::jsonb) id", [JSON.stringify({ source_system: "teacher", exam_subject: "Mathematics", stem: "2+2?", options: ["3", "4"], correct_index: 1, explanation: "Arithmetic.", source_type: "generated", exams: [{ exam_slug: "pst", topic: "Number sense", difficulty: "easy" }] })])).id;
  check("an exam question is filed under its exam type", (await n(`select count(*)::int n from public.question_exams qe join public.exam_types et on et.id = qe.exam_type_id where qe.question_id = '${examQ}' and et.slug = 'pst'`)) === 1);

  // status & bulk
  const st = async (ids_: string[], status: string, reason: string | null, dry = false): Promise<any> => (await fn(QM, "select public.question_set_status($1::uuid[], $2::public.publish_status, $3, $4) r", [ids_, status, reason, dry])).r;
  await expectFail("archive without reason", () => st([createdId], "archived", null), /give a reason/);
  await expectFail("unpublish with short reason", () => st([createdId], "draft", "no"), /give a reason/);
  await expectFail("101 ids", () => st(Array.from({ length: 101 }, () => createdId), "published", null), /at most 100/);
  check("archiving/unpublishing needs a reason, and bulk actions are capped at 100", true);
  const incomplete = (await fn(QM, "select public.question_create($1::jsonb) id", [JSON.stringify({ ...newQuiz, explanation: "" })])).id as string;
  const dryRun = await st([createdId, incomplete, reviewQ.id as string], "published", null, true);
  check("dry-run reports what would happen and changes nothing", dryRun.dry_run === true && dryRun.changed === 1 && dryRun.skipped.length === 2 && (await one("select status from public.questions where id = $1", [createdId]))["status"] === "draft");
  const pub = await st([createdId, incomplete], "published", null);
  check("publish: complete draft goes live; a draft with no explanation is skipped with the reason", pub.changed === 1 && pub.skipped[0].why === "needs a stem and an explanation" && (await one("select status from public.questions where id = $1", [createdId]))["status"] === "published");
  await st([reviewQ.id as string], "draft", "Taking it offline for review");
  const pubReview = await st([reviewQ.id as string], "published", null);
  check("a question flagged needs-review cannot be published until the flag is cleared", pubReview.changed === 0 && /needs-review/.test(pubReview.skipped[0].why));
  const arch = await st([createdId], "archived", "Duplicate of another question");
  const archAud = await one("select before, after, meta from public.audit_log where action = 'question.status_changed' and entity_id = $1 order by id desc limit 1", [createdId]);
  check("archiving works and each question gets its own audit entry with the reason", arch.changed === 1 && archAud.before.status === "published" && archAud.after.status === "archived" && archAud.meta.reason === "Duplicate of another question");
  check("questions are never hard-deleted: they stay in the table as archived", (await one("select status from public.questions where id = $1", [createdId]))["status"] === "archived");

  // import
  const goodRows = [newQuiz, { ...newQuiz, stem: "What is velocity?" }, { ...newQuiz, stem: "What is acceleration?" }];
  const before = await n("select count(*)::int n from public.questions");
  const dryImp = (await fn(QM, "select public.question_import($1::jsonb, true) r", [JSON.stringify(goodRows)])).r;
  check("import dry-run validates all rows and creates nothing", dryImp.errors === 0 && dryImp.committed === false && (await n("select count(*)::int n from public.questions")) === before);
  const badImp = (await fn(QM, "select public.question_import($1::jsonb, false) r", [JSON.stringify([...goodRows, { ...newQuiz, source_type: "verified_past_paper" }, { ...newQuiz, subject_slug: "nope" }])])).r;
  check("one bad row fails the whole import (all-or-nothing) and every bad row is reported with its reason",
    badImp.committed === false && badImp.errors === 2 && badImp.created === 0 && badImp.results[3].ok === false && /needs a source year/.test(badImp.results[3].error) && /unknown subject_slug/.test(badImp.results[4].error)
    && (await n("select count(*)::int n from public.questions")) === before);
  const realImp = (await fn(QM, "select public.question_import($1::jsonb, false) r", [JSON.stringify(goodRows)])).r;
  check("a fully valid import commits, as drafts, with one audit entry", realImp.committed === true && realImp.created === 3 && (await n("select count(*)::int n from public.questions")) === before + 3
    && (await auditCount("question.imported")) === 1 && (await n("select count(*)::int n from public.questions where legacy_id like 'adm-%' and status = 'draft'")) >= 3);
  await expectFail("501 rows", () => fn(QM, "select public.question_import($1::jsonb, true)", [JSON.stringify(Array.from({ length: 501 }, () => newQuiz))]), /at most 500/);
  await expectFail("not an array", () => fn(QM, "select public.question_import('{}'::jsonb, true)"), /JSON array/);
  check("import limits: 500 rows, and it must be an array", true);

  // history
  const hist = await rows(QM, "select * from public.question_history($1)", [quizQ.id]);
  check("question managers can read a question's history (newest first) without reading the audit log", hist.length >= 2 && hist[0]!["action"] === "question.provenance_changed"
    && await asUser(db, QM, async () => (await n("select count(*)::int n from public.audit_log")) === 0));
  await expectFail("learner history", () => rows(ids.learner, "select * from public.question_history($1)", [quizQ.id]), /forbidden/);

  // registry re-import must never overwrite these edits
  const reimport = await applyBundle(db, bundle, { apply: true });
  const still = await one("select explanation, source_type from public.questions where id = $1", [quizQ.id]);
  check("re-running the registry import keeps every admin edit", still.explanation === "Edited by the question manager." && still.source_type === "existing_bank" && reimport.editedInAdmin["questions"]! >= 2);
  const par = await computeParity(db, bundle);
  const pq2 = par.tables.find((t) => t.table === "questions")!;
  check("parity: nothing missing, admin edits counted as edited, admin-created questions counted as extra", pq2.missingCount === 0 && pq2.editedInAdmin >= 2 && pq2.extra >= 6);

  section("12. Question Bank app logic (forms, filters, CSV)");
  const form = (o: Record<string, string>): FormData => { const fd = new FormData(); for (const [k, v] of Object.entries(o)) fd.set(k, v); return fd; };
  const okForm = { stem: " What is 2+2? ", option_0: "3", option_2: "4", correct: "2", explanation: "Arithmetic", hints: "think\n\n add " };
  const pc = parseQuestionContent(form(okForm));
  check("form: blank option slots are dropped and the correct SLOT maps to the right index", pc.errors.length === 0 && JSON.stringify(pc.fields["options"]) === '["3","4"]' && pc.fields["correct_index"] === 1 && pc.fields["stem"] === "What is 2+2?");
  check("form: hints become a clean list; no hints become null", JSON.stringify(pc.fields["hints"]) === '["think","add"]' && parseQuestionContent(form({ ...okForm, hints: "" })).fields["hints"] === null);
  check("form: rejects missing question, <2 options, duplicate options, blank/missing correct answer",
    parseQuestionContent(form({ ...okForm, stem: "" })).errors.length === 1 && parseQuestionContent(form({ stem: "q", option_0: "a", correct: "0" })).errors.length >= 1
    && parseQuestionContent(form({ ...okForm, option_2: "3" })).errors.some((e) => /identical/.test(e)) && parseQuestionContent(form({ ...okForm, correct: "1" })).errors.some((e) => /correct/.test(e)) && parseQuestionContent(form({ ...okForm, correct: "" })).errors.some((e) => /correct/.test(e)));
  check("form: rejects an unknown difficulty or language", parseQuestionContent(form({ ...okForm, difficulty: "impossible" })).errors.length === 1 && parseQuestionContent(form({ ...okForm, language: "fr" })).errors.length === 1);
  check("new question: quiz needs a valid subject; exam questions need a subject and exam",
    parseNewQuestion(form({ ...okForm, source_system: "quiz", subject_slug: "astrology" })).errors.length === 1
    && parseNewQuestion(form({ ...okForm, source_system: "quiz", subject_slug: "physics" })).errors.length === 0
    && parseNewQuestion(form({ ...okForm, source_system: "teacher" })).errors.length === 2
    && JSON.stringify((parseNewQuestion(form({ ...okForm, source_system: "teacher", exam_subject: "Maths", exam_slug: "pst", exam_topic: "Algebra" })).fields["exams"] as unknown[])[0]) === '{"exam_slug":"pst","topic":"Algebra","difficulty":"","section_code":""}');
  check("new question: a past paper is refused client-side without year + reference (the database also refuses)",
    parseNewQuestion(form({ ...okForm, source_system: "quiz", subject_slug: "physics", source_type: "verified_past_paper" })).errors.some((e) => /past paper/.test(e))
    && parseNewQuestion(form({ ...okForm, source_system: "quiz", subject_slug: "physics", source_type: "verified_past_paper", source_year: "2020", source_reference: "FPSC 2020" })).errors.length === 0);
  check("provenance form requires a 10+ character reason and a real source", parseProvenance(form({ source_type: "existing_bank", answer_check: "unchecked", reason: "short" })).errors.length === 1
    && parseProvenance(form({ source_type: "existing_bank", answer_check: "unchecked", reason: "Confirmed with the author" })).errors.length === 0 && parseProvenance(form({ source_type: "bogus", reason: "a long enough reason" })).errors.length === 1);
  const fl = parseFilters({ q: "  a%b,c(d) ", system: "mpt", source: "hacked", status: "draft", dir: "asc", sort: "legacy", page: "-4", exam: "pst", subject: "../etc" });
  check("filters: whitelisted, PostgREST-significant characters stripped, bad values ignored, page clamped",
    fl.q === "a b c d" && fl.system === "mpt" && fl.source === "" && fl.status === "draft" && fl.subject === "" && fl.exam === "pst" && fl.page === 1 && fl.sort === "legacy" && fl.dir === "asc");
  check("CSV: quoting and formula-injection protection",
    csvCell('say "hi", ok') === '"say ""hi"", ok"' && csvCell("=HYPERLINK(\"http://x\")") === '"\'=HYPERLINK(""http://x"")"' && csvCell("=1+1") === "'=1+1" && csvCell("+1") === "'+1" && csvCell("@x") === "'@x" && csvCell("-5") === "'-5" && csvCell("line1\nline2") === '"line1\nline2"' && csvCell(null) === "" && csvCell(7) === "7"
    && toCsv(["a", "b"], [[1, "x,y"]]) === 'a,b\r\n1,"x,y"\r\n');
  check("permissions: everyone may view the bank; only super_admin and question_manager may edit",
    ADMIN_ROLES.every((r) => can(r, "questions.view")) && ADMIN_ROLES.every((r) => can(r, "questions.edit") === (r === "super_admin" || r === "question_manager")));

  section("10. App-side rules agree with the database");
  check("UI permission matrix: only super_admin sees audit log and admin users",
    ADMIN_ROLES.every((r) => can(r, "audit.view") === (r === "super_admin") && can(r, "admins.manage") === (r === "super_admin")));
  check("every role may view overview and health", ADMIN_ROLES.every((r) => can(r, "overview.view") && can(r, "health.view")));
  check("isAdminRole rejects unknown roles", isAdminRole("analyst") && !isAdminRole("root") && !isAdminRole(undefined));
  check("post-login redirects stay inside /admin",
    safeNextPath("/admin/health?x=1") === "/admin/health?x=1" && safeNextPath("//evil.com") === "/admin" && safeNextPath("https://evil.com") === "/admin"
    && safeNextPath("/admin\\..\\evil") === "/admin" && safeNextPath("/dashboard") === "/admin" && safeNextPath("/admin/login") === "/admin" && safeNextPath(null) === "/admin");
  const secret = "s".repeat(40);
  const token = await createSessionToken(secret);
  check("session token verifies; tampered, wrong-key and expired tokens do not",
    (await verifySessionToken(token, secret)) && !(await verifySessionToken(token.slice(0, -2) + "xx", secret))
    && !(await verifySessionToken(token, "t".repeat(40))) && !(await verifySessionToken(await createSessionToken(secret, Date.now() - 9 * 3600_000), secret)));

  console.log(`\n${passed} checks passed${failures.length ? `, ${failures.length} FAILED:\n - ${failures.join("\n - ")}` : ", 0 failed"}`);
  process.exit(failures.length ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(2); });
