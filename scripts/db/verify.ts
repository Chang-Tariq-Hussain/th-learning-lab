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
  const canUpdate = async (id: string, table: string, set: string): Promise<boolean> =>
    asUser(db, id, async () => Number((await db.query<{ n: number }>(`with u as (update public.${table} set ${set} returning 1) select count(*)::int n from u`)).rows[0]?.n) > 0);
  check("analyst cannot edit anything", !(await canUpdate(ids.analyst, "simulations", "title = title")) && !(await canUpdate(ids.analyst, "questions", "explanation = explanation")));
  check("content_manager edits simulations but not questions", (await canUpdate(ids.content, "simulations", "title = title")) && !(await canUpdate(ids.content, "questions", "explanation = explanation")));
  check("question_manager edits questions but not simulations", (await canUpdate(ids.question, "questions", "explanation = explanation")) && !(await canUpdate(ids.question, "simulations", "title = title")));
  check("super_admin edits both", (await canUpdate(ids.super, "simulations", "title = title")) && (await canUpdate(ids.super, "questions", "explanation = explanation")));
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
