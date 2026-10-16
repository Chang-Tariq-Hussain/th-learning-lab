#!/usr/bin/env python3
"""Account-mode end-to-end: the real app -> fake Auth + REAL PostgREST -> REAL Postgres. Ground truth is read straight from Postgres."""
import csv, io, json, os, re, subprocess, sys, tempfile
from urllib.parse import unquote
B = os.environ.get("APP", "http://localhost:3122")
PG = ["psql", "-qAt", "-h", "localhost", "-U", os.environ.get("PGUSER", "postgres"), "-d", os.environ.get("PGDB", "thlab3")]
ENV = {**os.environ, "PGPASSWORD": os.environ.get("PGPASSWORD", "pw")}
failures = []

def sh(*a): return subprocess.run(a, capture_output=True, text=True).stdout
def db(sql): return subprocess.run(PG + ["-c", sql], capture_output=True, text=True, env=ENV).stdout.strip()
def dbi(sql): return int(db(sql) or 0)
def check(name, cond, extra=""):
    print(("  ✓ " if cond else "  ✗ ") + name + (f"   [{extra}]" if (extra and not cond) else ""))
    if not cond: failures.append(name)
def get(jar, path):
    out = subprocess.run(["curl", "-s", "-b", jar, "-c", jar, "-w", "\n__HTTP__%{http_code}", B + path], capture_output=True, text=True).stdout
    body, code = out.rsplit("\n__HTTP__", 1); return body, code
def text(html): return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", html))
def forms(html): return re.findall(r"<form[^>]*>(.*?)</form>", html, re.S)
def aid(f): m = re.search(r'name="(\$ACTION_ID_[0-9a-f]+)"', f); return m.group(1) if m else None
def form_with(html, needle): return next((f for f in forms(html) if needle in f), None)
def post(jar, path, act, fields=(), files=()):
    args = ["curl", "-s", "-o", "/dev/null", "-D", "/tmp/hdr", "-b", jar, "-c", jar, "-F", act + "="]
    for k, v in fields: args += ["-F", f"{k}={v}"]
    for k, v in files: args += ["-F", f"{k}=@{v}"]
    sh(*args, B + path)
    h = open("/tmp/hdr").read(); st = h.split("\r\n")[0]; m = re.search(r"(?im)^location:\s*(.*?)\r?$", h)
    return st, (unquote(m.group(1)) if m else None)
def login(jar, email, pw):
    sh("rm", "-f", jar); html, _ = get(jar, "/admin/login")
    return post(jar, "/admin/login", aid(forms(html)[0]), [("email", email), ("password", pw), ("next", "/admin")])
def rpc_log(): return json.loads(sh("curl", "-s", "localhost:54321/_log"))
def count_rpc(name): return len([l for l in rpc_log() if l.startswith(f"RPC {name} ")])
def msg(loc, kind): m = re.search(rf"[?&]{kind}=([^&]*)", loc or ""); return m.group(1) if m else ""
def nav(html): return sorted(set(re.findall(r'href="(/admin[a-z/]*)"', html)) & {"/admin", "/admin/health", "/admin/questions", "/admin/audit", "/admin/admins"})

S, Q, A, C, L = "/tmp/jS", "/tmp/jQ", "/tmp/jA", "/tmp/jC", "/tmp/jL"
print("== sign-in and navigation")
st, loc = login(S, "super@x.com", "pw1"); check("super admin signs in", loc == "/admin", f"{st} {loc}")
st, loc = login(Q, "qm@x.com", "pw4"); check("question manager signs in", loc == "/admin")
login(A, "analyst@x.com", "pw2"); login(C, "cm@x.com", "pw5")
st, loc = login(L, "learner@x.com", "pw3"); check("learner (no role) refused", loc and "error=noaccess" in loc, loc)
for who, jar, want in (("super", S, ["/admin", "/admin/admins", "/admin/audit", "/admin/health", "/admin/questions"]), ("question manager", Q, ["/admin", "/admin/health", "/admin/questions"]), ("analyst", A, ["/admin", "/admin/health", "/admin/questions"])):
    check(f"nav for {who}: {', '.join(w.replace('/admin/', '') or 'overview' for w in want)}", nav(get(jar, "/admin")[0]) == sorted(want), str(nav(get(jar, "/admin")[0])))

print("== admin users (real database through real PostgREST)")
html, _ = get(S, "/admin/admins"); grant = aid(form_with(html, 'name="email"')); revoke = aid(form_with(html, 'name="user_id"'))
st, loc = post(S, "/admin/admins", grant, [("email", "nobody-yet@x.com"), ("role", "analyst")]); check("grant a role", "ok=" in (loc or ""), loc)
check("  → row exists in admin_roles", db("select role from public.admin_roles where email='nobody-yet@x.com'") == "analyst")
check("  → audited in the database with the actor", dbi("select count(*) from public.audit_log where action='admin.role_granted' and actor_email='super@x.com' and after->>'role'='analyst'") == 1)
st, loc = post(S, "/admin/admins", grant, [("email", "ghost@x.com"), ("role", "analyst")]); check("unknown email → error from the database", "no account" in unquote(msg(loc, "error")), loc)
st, loc = post(S, "/admin/admins", revoke, [("user_id", "00000000-0000-0000-0000-0000000000a1")]); check("the last super admin cannot be revoked", "last super admin" in unquote(msg(loc, "error")), loc)
st, loc = post(S, "/admin/admins", revoke, [("user_id", "00000000-0000-0000-0000-0000000000a6")]); check("revoke works", "ok=" in (loc or "") and dbi("select count(*) from public.admin_roles where email='nobody-yet@x.com'") == 0, loc)
for p in ("/admin/audit", "/admin/admins", "/admin/questions/new", "/admin/questions/import"):
    out = sh("curl", "-s", "-o", "/dev/null", "-w", "%{http_code} %{redirect_url}", "-b", A, B + p).split()
    check(f"analyst → {p}: real 307 to /admin", out[0] == "307" and out[1].endswith("/admin"), " ".join(out))
check("super admin sees sign-ins and role changes in the audit log page", all(w in text(get(S, "/admin/audit")[0]) for w in ("admin.login", "admin.role_granted")))

print("== question bank: list, filters, sort, pagination")
body, code = get(Q, "/admin/questions"); t = text(body); total = dbi("select count(*) from public.questions")
check("list renders with the full count", code == "200" and f"of {total}" in t, f"HTTP {code}")
def listed(qs): b, _ = get(Q, "/admin/questions?" + qs); t = text(b); m = re.search(r"Showing \d+–\d+ of (\d+)", t); return int(m.group(1)) if m else (0 if "No results" in t else -1)
check("filter: verified past papers matches the database", listed("source=verified_past_paper") == dbi("select count(*) from public.questions where source_type='verified_past_paper'"))
check("filter: generated + CSS MPT matches", listed("source=generated&system=mpt") == dbi("select count(*) from public.questions where source_type='generated' and source_system='mpt'"))
check("filter: exam=pst (joined through question_exams) matches", listed("exam=pst") == dbi("select count(*) from public.question_exams qe join public.exam_types et on et.id=qe.exam_type_id where et.slug='pst'"))
check("filter: subject=physics matches", listed("subject=physics") == dbi("select count(*) from public.questions q join public.subjects s on s.id=q.subject_id where s.slug='physics'"))
check("filter: needs review matches", listed("review=yes") == dbi("select count(*) from public.questions where needs_review"))
check("filter: text search matches", listed("q=photosynthesis") == dbi("select count(*) from public.questions where stem ilike '%photosynthesis%' or legacy_id ilike '%photosynthesis%'"))
check("filter: hostile input is neutralised (no error, no injection)", listed("q=a%2Cb)%2Cstatus.eq.archived&source=%27%3Bdrop") >= 0)
b, _ = get(Q, "/admin/questions?sort=legacy&dir=asc"); first = re.findall(r'href="/admin/questions/[0-9a-f-]{36}"[^>]*>([^<]+)</a>', b)
check("sort by ID ascending: first row is the database's first", bool(first) and first[0] == db("select legacy_id from public.questions order by legacy_id asc, id asc limit 1"), str(first[:2]))
check("pagination: page 3 shows rows 51–75", "Showing 51–75" in text(get(Q, "/admin/questions?page=3")[0]))
check("pagination beyond the end is clamped, not an error", get(Q, "/admin/questions?page=99999")[1] == "200")

print("== question bank: edit, concurrency, provenance")
qid = db("select id from public.questions where source_system='quiz' and source_type='platform_authored' order by legacy_id limit 1")
body, _ = get(Q, f"/admin/questions/{qid}"); f_save = form_with(body, 'name="expected_hash"'); save_act = aid(f_save)
h0 = re.search(r'name="expected_hash" value="([^"]+)"', f_save).group(1)
check("detail page shows the editor, history and 'unchanged since import'", "Save changes" in body and "unchanged since import" in text(body))
def content(**over):
    d = dict(stem=re.search(r'<textarea id="stem"[^>]*>(.*?)</textarea>', f_save, re.S).group(1).strip(), option_0="Alpha", option_1="Beta", correct="0", explanation="Original explanation", difficulty="easy")
    d.update(over); return [(k, v) for k, v in d.items()]
n_save = count_rpc("question_save")
st, loc = post(Q, f"/admin/questions/{qid}", save_act, [("id", qid), ("expected_hash", h0)] + content(stem="", explanation="x")); check("blank question text is rejected before reaching the database", "required" in unquote(msg(loc, "error")) and count_rpc("question_save") == n_save, loc)
st, loc = post(Q, f"/admin/questions/{qid}", save_act, [("id", qid), ("expected_hash", h0)] + content(explanation="Rewritten by the question manager")); check("save succeeds", msg(loc, "ok") == "Saved.", loc)
check("  → database holds the edit and marks it edited since import", db(f"select explanation from public.questions where id='{qid}'") == "Rewritten by the question manager" and db(f"select content_hash like 'e:%' and content_hash <> source_hash from public.questions where id='{qid}'") == "t")
check("  → audit row names the actor and records before/after", dbi(f"select count(*) from public.audit_log where entity_id='{qid}' and action='question.updated' and actor_email='qm@x.com' and after ? 'explanation'") >= 1)
st, loc = post(Q, f"/admin/questions/{qid}", save_act, [("id", qid), ("expected_hash", h0)] + content(explanation="Stale overwrite attempt")); check("a stale edit is refused (no lost update)", "changed by someone else" in unquote(msg(loc, "error")), loc)
check("  → the database still holds the earlier edit", db(f"select explanation from public.questions where id='{qid}'") == "Rewritten by the question manager")
check("detail page now says it was edited in admin and shows the history", "edited in admin" in text(get(Q, f"/admin/questions/{qid}")[0]) and "question.updated" in text(get(Q, f"/admin/questions/{qid}")[0]))

gen = db("select id from public.questions where source_type='generated' and source_system='mpt' order by legacy_id limit 1"); gb, _ = get(Q, f"/admin/questions/{gen}")
prov_f = form_with(gb, 'name="answer_check"'); prov_act = aid(prov_f); gh = re.search(r'name="expected_hash" value="([^"]+)"', prov_f).group(1)
def prov(**o): d = dict(source_type="verified_past_paper", source_year="2021", source_reference="FPSC 2021 Q1", answer_check="unchecked", reason="Found it in the real paper"); d.update(o); return [("id", gen), ("expected_hash", gh)] + list(d.items())
st, loc = post(Q, f"/admin/questions/{gen}", prov_act, prov()); check("a generated question can NOT be relabelled a verified past paper", "cannot be relabelled" in unquote(msg(loc, "error")), loc)
check("  → still generated in the database", db(f"select source_type from public.questions where id='{gen}'") == "generated")
st, loc = post(Q, f"/admin/questions/{gen}", prov_act, prov(source_type="generated", answer_check="independently_checked", reason="Marking it checked anyway")); check("a generated question cannot be marked independently checked", "questions_generated_never_verified" in unquote(msg(loc, "error")) or "violates check" in unquote(msg(loc, "error")), loc)
st, loc = post(Q, f"/admin/questions/{gen}", prov_act, prov(source_type="generated", answer_check="recomputed", reason="short")); check("a reason of under 10 characters is refused", "10 characters" in unquote(msg(loc, "error")), loc)
st, loc = post(Q, f"/admin/questions/{gen}", prov_act, prov(source_type="generated", answer_check="recomputed", reason="Re-derived the answer by hand", source_year="")); check("a legitimate provenance change works", "ok=" in (loc or "") and db(f"select answer_check from public.questions where id='{gen}'") == "recomputed", loc)
check("  → the reason is stored in the audit log", dbi(f"select count(*) from public.audit_log where entity_id='{gen}' and action='question.provenance_changed' and meta->>'reason'='Re-derived the answer by hand'") == 1)
pp = db("select id from public.questions where source_type='verified_past_paper' and answer_check='independently_checked' order by legacy_id limit 1"); pb, _ = get(Q, f"/admin/questions/{pp}")
pf = form_with(pb, 'name="expected_hash"'); ph = re.search(r'name="expected_hash" value="([^"]+)"', pf).group(1)
opts = re.findall(r'name="option_(\d)"[^>]*value="([^"]*)"', pf); cur = re.search(r'name="correct" value="(\d)" checked', pf)
d = [("id", pp), ("expected_hash", ph), ("stem", "Reworded stem for the check reset test?"), ("explanation", "e"), ("correct", cur.group(1) if cur else "0")] + [(f"option_{i}", v) for i, v in opts]
st, loc = post(Q, f"/admin/questions/{pp}", aid(pf), d); check("changing a checked past paper tells the editor its check was reset", "reset" in unquote(msg(loc, "ok")), loc)
check("  → still a past paper, answer check back to Unchecked", db(f"select source_type||'/'||answer_check from public.questions where id='{pp}'") == "verified_past_paper/unchecked")

print("== question bank: status and bulk actions")
html, _ = get(Q, f"/admin/questions/{qid}"); stat_f = [f for f in forms(html) if 'name="status" value="draft"' in f][0]; stat_act = aid(stat_f)
st, loc = post(Q, f"/admin/questions/{qid}", stat_act, [("id", qid), ("status", "draft"), ("reason", "")]); check("unpublishing without a reason is refused", "give a reason" in unquote(msg(loc, "error")), loc)
st, loc = post(Q, f"/admin/questions/{qid}", stat_act, [("id", qid), ("status", "draft"), ("reason", "Checking wording with the author")]); check("unpublish with a reason works", db(f"select status from public.questions where id='{qid}'") == "draft", loc)
check("  → audited with the reason", dbi(f"select count(*) from public.audit_log where entity_id='{qid}' and action='question.status_changed' and meta->>'reason'='Checking wording with the author'") == 1)
lb, _ = get(Q, "/admin/questions"); bulk_f = form_with(lb, 'name="confirm"'); bulk_act = aid(bulk_f)
ids3 = db("select id from public.questions where source_system='quiz' and status='published' order by legacy_id desc limit 3").split("\n")
def bulk(ids, status, reason="", confirm=False): return post(Q, "/admin/questions", bulk_act, [("back", "/admin/questions"), ("status", status), ("reason", reason)] + [("ids", i) for i in ids] + ([("confirm", "on")] if confirm else []))
st, loc = bulk(ids3, "archived", "Duplicates of other questions", confirm=False); check("bulk archive without the confirmation box is refused", "confirmation" in unquote(msg(loc, "error")), loc)
st, loc = bulk([], "published"); check("bulk with nothing selected is refused", "Select at least one" in unquote(msg(loc, "error")), loc)
all101 = db("select id from public.questions limit 101").split("\n"); st, loc = bulk(all101, "published"); check("bulk is capped at 100 questions", "between 1 and 100" in unquote(msg(loc, "error")), loc)
st, loc = bulk(ids3, "archived", "Duplicates of other questions", confirm=True); check("bulk archive (3) succeeds", "3 question(s) set to archived" in unquote(msg(loc, "ok")), loc)
check("  → exactly those 3 are archived, each with its own audit entry", dbi("select count(*) from public.questions where status='archived'") == 3 and dbi("select count(*) from public.audit_log where action='question.status_changed' and after->>'status'='archived'") == 3)
st, loc = bulk(ids3, "published"); check("bulk restore (publish) works", "3 question(s) set to published" in unquote(msg(loc, "ok")), loc)
rv = db("select id from public.questions where needs_review and status='published' limit 1")
bulk([rv], "draft", "Taking it offline to review it", confirm=True); st, loc = bulk([rv], "published")
check("publishing a 'needs review' question is skipped, with the reason", "needs-review" in unquote(msg(loc, "error")) and db(f"select status from public.questions where id='{rv}'") == "draft", loc)

print("== question bank: create and import")
nf = form_with(get(Q, "/admin/questions/new")[0], 'name="source_system"'); new_act = aid(nf)
newq = [("source_system", "quiz"), ("subject_slug", "physics"), ("stem", "Created via the form: what is velocity?"), ("option_0", "Speed with direction"), ("option_1", "Mass"), ("correct", "0"), ("explanation", "Velocity is a vector."), ("source_type", "platform_authored")]
st, loc = post(Q, "/admin/questions/new", new_act, newq); newid = (re.search(r"/admin/questions/([0-9a-f-]{36})", loc or "") or [None, None])[1]
check("create → lands on the new question's page", bool(newid) and "ok=" in loc, loc)
check("  → draft, platform-authored, unchecked, admin id, no import hash", db(f"select status||'/'||source_type||'/'||answer_check||'/'||(legacy_id like 'adm-%')||'/'||(source_hash is null) from public.questions where id='{newid}'") == "draft/platform_authored/unchecked/true/true")
st, loc = post(Q, "/admin/questions/new", new_act, [x for x in newq if x[0] != "source_type"] + [("source_type", "verified_past_paper")]); check("create a past paper with no year/reference → refused", "past paper" in unquote(msg(loc, "error")), loc)
imp_f = form_with(get(Q, "/admin/questions/import")[0], 'name="validate_only"'); imp_act = aid(imp_f)
good = [{"source_system": "quiz", "subject_slug": "physics", "stem": f"Imported question {i}", "options": ["a", "b"], "correct_index": 0, "explanation": "because"} for i in range(3)]
before = dbi("select count(*) from public.questions")
st, loc = post(Q, "/admin/questions/import", imp_act, [("json", json.dumps(good)), ("validate_only", "on")]); check("import validate-only passes and saves nothing", "All 3 rows are valid" in unquote(msg(loc, "ok")) and dbi("select count(*) from public.questions") == before, loc)
bad = good + [{**good[0], "source_type": "verified_past_paper"}, {**good[0], "subject_slug": "nope"}]
st, loc = post(Q, "/admin/questions/import", imp_act, [("json", json.dumps(bad))]); errs = re.findall(r"err=([^&]*)", loc or "")
check("a file with bad rows imports NOTHING and lists every problem", dbi("select count(*) from public.questions") == before and len(errs) == 2 and "row 4" in unquote(errs[0]) and "row 5" in unquote(errs[1]), loc)
tmp = tempfile.NamedTemporaryFile("w", suffix=".json", delete=False); json.dump(good + [{**good[0], "stem": "=HYPERLINK(\"http://evil\",\"x\")"}], tmp); tmp.close()
st, loc = post(Q, "/admin/questions/import", imp_act, [], files=[("file", tmp.name)]); check("a valid file upload imports as drafts", "Imported 4" in unquote(msg(loc, "ok")) and dbi("select count(*) from public.questions") == before + 4, loc)
check("  → audited once", dbi("select count(*) from public.audit_log where action='question.imported'") == 1)
st, loc = post(Q, "/admin/questions/import", imp_act, [("json", "not json")]); check("garbage input is refused with a clear message", "not valid JSON" in unquote(msg(loc, "error")), loc)

print("== question bank: export")
raw = subprocess.run(["curl", "-s", "-D", "/tmp/eh", "-b", Q, f"{B}/admin/questions/export?source=verified_past_paper&format=csv"], capture_output=True).stdout.decode("utf-8")
hd = open("/tmp/eh").read().lower()
rows = list(csv.reader(io.StringIO(raw.lstrip("\ufeff"))))
check("CSV: attachment with a UTF-8 BOM and the documented columns", "attachment" in hd and "text/csv" in hd and raw.startswith("\ufeff") and rows[0][:3] == ["id", "legacy_id", "source_system"])
check("CSV: row count equals the filtered count in the database", len(rows) - 1 == dbi("select count(*) from public.questions where source_type='verified_past_paper'"), f"{len(rows)-1}")
craw = subprocess.run(["curl", "-s", "-b", Q, f"{B}/admin/questions/export?q=HYPERLINK&format=csv"], capture_output=True).stdout.decode("utf-8")
check("CSV: a stem starting with '=' is neutralised so it can't run as a formula", "'=HYPERLINK" in craw and ",=HYPERLINK" not in craw and '"=HYPERLINK' not in craw, craw[-200:])
js = json.loads(subprocess.run(["curl", "-s", "-b", Q, f"{B}/admin/questions/export?system=teacher&status=published&format=json"], capture_output=True).stdout)
check("JSON export parses and matches the database count", len(js) == dbi("select count(*) from public.questions where source_system='teacher' and status='published'"))
check("exports are audited with format and row count", dbi("select count(*) from public.audit_log where action='question.exported' and (meta->>'rows')::int > 0") >= 3)
check("export requires sign-in", sh("curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", f"{B}/admin/questions/export?format=csv") in ("307", "401"))

print("== read-only roles")
for who, jar in (("analyst", A), ("content manager", C)):
    body, code = get(jar, "/admin/questions"); t = text(body)
    check(f"{who}: can browse the bank but sees no edit controls", code == "200" and "Apply to selected" not in t and "New question" not in t)
    d, _ = get(jar, f"/admin/questions/{qid}"); check(f"{who}: detail is read-only", "Save changes" not in d and "read-only access" in text(d))
    out = subprocess.run(["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", "-b", jar, f"{B}/admin/questions/export?format=csv"], capture_output=True, text=True).stdout
    check(f"{who}: can export", out == "200")
    before_h = db(f"select content_hash from public.questions where id='{qid}'"); a0 = dbi("select count(*) from public.audit_log")
    st, loc = post(jar, f"/admin/questions/{qid}", save_act, [("id", qid), ("expected_hash", before_h)] + content(explanation="Attempted by a read-only role"))
    post(jar, "/admin/questions", bulk_act, [("back", "/admin/questions"), ("status", "archived"), ("reason", "replayed bulk form"), ("confirm", "on"), ("ids", qid)])
    check(f"{who}: replaying the editor's forms changes nothing in the database", db(f"select content_hash from public.questions where id='{qid}'") == before_h and db(f"select status from public.questions where id='{qid}'") == "draft" and dbi("select count(*) from public.audit_log") == a0)

print("\nALL OK" if not failures else f"\n{len(failures)} FAILURE(S):\n - " + "\n - ".join(failures)); sys.exit(1 if failures else 0)
