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


import html as _html
def collect_form(f):
    """Current values of every field in an HTML form (what a browser would submit), as a dict."""
    d = {}
    for m in re.finditer(r"<input([^>]*)>", f):
        a = m.group(1); name = re.search(r'name="([^"]+)"', a)
        if not name or name.group(1).startswith("$"): continue
        typ = (re.search(r'type="([^"]+)"', a) or [None, "text"])[1]; val = re.search(r'value="([^"]*)"', a)
        if typ in ("checkbox", "radio"):
            if "checked" in a: d[name.group(1)] = _html.unescape(val.group(1)) if val else "on"
        elif typ != "submit": d[name.group(1)] = _html.unescape(val.group(1)) if val else ""
    for m in re.finditer(r"<textarea[^>]*name=\"([^\"]+)\"[^>]*>(.*?)</textarea>", f, re.S): d[m.group(1)] = _html.unescape(m.group(2)).strip()
    for m in re.finditer(r"<select[^>]*name=\"([^\"]+)\"[^>]*>(.*?)</select>", f, re.S):
        sel = re.search(r'<option value="([^"]*)"[^>]*selected', m.group(2)); d[m.group(1)] = _html.unescape(sel.group(1)) if sel else ""
    return d
def edit(jar, qid, **over):
    body, _ = get(jar, f"/admin/questions/{qid}"); f = form_with(body, 'name="expected_hash"' )
    f = [x for x in forms(body) if 'name="expected_hash"' in x and 'name="stem"' in x][0]
    d = collect_form(f); d.update(over)
    return post(jar, f"/admin/questions/{qid}", aid(f), list(d.items()))
def cli(*args, content=None):
    env = {**os.environ, "DATABASE_URL": "postgresql://postgres:pw@localhost:5432/thlab3", "PATH": os.getcwd() + "/node_modules/.bin:" + os.environ["PATH"]}
    if content: env["CONTENT_DIR"] = content
    r = subprocess.run(["tsx", "--tsconfig", "scripts/tsconfig.health.json", "scripts/db/content-publish.ts", *args], capture_output=True, text=True, env=env)
    return r.returncode, r.stdout + r.stderr

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
body_after_fail, _ = get(Q, f"/admin/questions/{qid}")
check("  → the failed save keeps what the admin typed (form refilled, with a notice) instead of discarding it", "Stale overwrite attempt" in body_after_fail and "your unsaved edits" in text(body_after_fail))
st, loc = post(Q, f"/admin/questions/{qid}", save_act, [("id", qid), ("expected_hash", re.search(r'name="expected_hash" value="([^"]+)"', body_after_fail).group(1))] + content(explanation="Rewritten by the question manager")); 
body_ok, _ = get(Q, f"/admin/questions/{qid}")
check("  → a later successful save clears the kept draft", "your unsaved edits" not in text(body_ok))
check("detail page now says it was edited in admin and shows the history", "edited in admin" in text(get(Q, f"/admin/questions/{qid}")[0]) and "question.updated" in text(get(Q, f"/admin/questions/{qid}")[0]))

gen = db("select id from public.questions where source_type='generated' and source_system='mpt' order by legacy_id limit 1"); gb, _ = get(Q, f"/admin/questions/{gen}")
prov_f = form_with(gb, 'name="answer_check"'); prov_act = aid(prov_f); gh = re.search(r'name="expected_hash" value="([^"]+)"', prov_f).group(1)
def prov(**o): d = dict(source_type="verified_past_paper", source_year="2021", source_reference="FPSC 2021 Q1", answer_check="unchecked", reason="Found it in the real paper"); d.update(o); return [("id", gen), ("expected_hash", gh)] + list(d.items())
st, loc = post(Q, f"/admin/questions/{gen}", prov_act, prov()); check("a generated question can NOT be relabelled a verified past paper", "cannot be relabelled" in unquote(msg(loc, "error")), loc)
check("  → still generated in the database", db(f"select source_type from public.questions where id='{gen}'") == "generated")
st, loc = post(Q, f"/admin/questions/{gen}", prov_act, prov(source_type="generated", answer_check="independently_checked", reason="Marking it checked anyway")); check("a generated question cannot be marked independently checked", "cannot be marked as independently checked" in unquote(msg(loc, "error")) and "violates" not in unquote(msg(loc, "error")), loc)
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


print("== publishing: bank membership, guards, and the publish step")
OUT = "/tmp/content-out"; sh("rm", "-rf", OUT); sh("cp", "-r", "src/content", OUT)
check("Publishing page: before any publish it says learners see the code as written", "Nothing has been published yet" in text(get(Q, "/admin/publishing")[0]))
BANK = "biology-cell-explorer"
first, second = db(f"select q.id from public.question_bank_items bi join public.questions q on q.id=bi.question_id join public.question_banks b on b.id=bi.bank_id where b.slug='{BANK}' order by bi.position limit 2").split("\n")
first_legacy = db(f"select legacy_id from public.questions where id='{first}'"); second_legacy = db(f"select legacy_id from public.questions where id='{second}'")
st, loc = edit(Q, first, stem="PHASE4-EDITED: The nucleus of a cell is best described as:"); check("edit the first question of a bank", msg(loc, "ok") == "Saved.", loc)
body, _ = get(Q, f"/admin/questions/{first}"); check("detail page says the change has not reached learners yet (publish state)", "Quiz banks" in body)
html2, _ = get(Q, f"/admin/questions/{second}"); stat_f = [f for f in forms(html2) if 'name="status" value="archived"' in f][0]
st, loc = post(Q, f"/admin/questions/{second}", aid(stat_f), [("id", second), ("status", "archived"), ("reason", "Phase 4 test: withdrawn question")]); check("archive the second question of the bank", db(f"select status from public.questions where id='{second}'") == "archived", loc)
nf = form_with(get(Q, "/admin/questions/new")[0], 'name="source_system"'); new_act = aid(nf)
quiz_new = [("source_system", "quiz"), ("subject_slug", "biology"), ("bank_slug", BANK), ("stem", "PHASE4-NEW: which organelle makes ATP?"), ("option_0", "Mitochondrion"), ("option_1", "Ribosome"), ("option_2", "Golgi body"), ("correct", "0"), ("explanation", "Mitochondria make most of the cell's ATP."), ("source_type", "platform_authored"), ("difficulty", "easy"), ("topic", "cell-structure")]
st, loc = post(Q, "/admin/questions/new", new_act, quiz_new); newq = (re.search(r"/admin/questions/([0-9a-f-]{36})", loc or "") or [None, None])[1]
check("create a quiz question straight into a bank", bool(newq) and dbi(f"select count(*) from public.question_bank_items bi join public.question_banks b on b.id=bi.bank_id where bi.question_id='{newq}' and b.slug='{BANK}'") == 1, loc)
nh, _ = get(Q, f"/admin/questions/{newq}"); pub_f = [f for f in forms(nh) if 'name="status" value="published"' in f][0]
post(Q, f"/admin/questions/{newq}", aid(pub_f), [("id", newq), ("status", "published")]); check("publish it", db(f"select status from public.questions where id='{newq}'") == "published")
check("its page lists the bank and offers other banks of the same subject only", BANK in text(get(Q, f"/admin/questions/{newq}")[0]) or "Cell Explorer" in text(get(Q, f"/admin/questions/{newq}")[0]))
phys_bank = db("select b.slug from public.question_banks b join public.subjects s on s.id=b.subject_id where s.slug='chemistry' order by b.slug limit 1")
add_f = [f for f in forms(get(Q, f"/admin/questions/{newq}")[0]) if re.search(r'<select[^>]*name="bank"', f)][0]; add_act = aid(add_f)
st, loc = post(Q, f"/admin/questions/{newq}", add_act, [("id", newq), ("bank", phys_bank)]); check("adding to another subject's bank is refused by the database", "different subject" in unquote(msg(loc, "error")) or "does not exist" in unquote(msg(loc, "error")), loc)
html3, _ = get(Q, f"/admin/questions/{newq}"); rem_f = [f for f in forms(html3) if 'name="bank"' in f and 'name="reason"' in f][0]
st, loc = post(Q, f"/admin/questions/{newq}", aid(rem_f), [("id", newq), ("bank", BANK), ("reason", "")]); check("removing from a bank needs a reason", "reason" in unquote(msg(loc, "error")).lower(), loc)
# exam questions
t3 = [("source_system", "teacher"), ("exam_subject", "Mathematics"), ("exam_slug", "pst"), ("stem", "Three options only?"), ("option_0", "a"), ("option_1", "b"), ("option_2", "c"), ("correct", "0"), ("explanation", "x"), ("source_type", "generated")]
st, loc = post(Q, "/admin/questions/new", new_act, t3); check("an exam question with 3 options is refused", "exactly 4" in unquote(msg(loc, "error")), loc)
m_nosec = [("source_system", "mpt"), ("exam_subject", "General Knowledge"), ("stem", "MPT no section?"), ("option_0", "a"), ("option_1", "b"), ("option_2", "c"), ("option_3", "d"), ("correct", "0"), ("explanation", "x"), ("source_type", "generated")]
st, loc = post(Q, "/admin/questions/new", new_act, m_nosec); check("an MPT question without a section is refused", "section" in unquote(msg(loc, "error")).lower(), loc)
t4 = [("source_system", "teacher"), ("exam_subject", "Mathematics"), ("exam_slug", "pst"), ("exam_topic", "Number sense"), ("exam_difficulty", "easy"), ("stem", "PHASE4-PST: what is 6 x 7?"), ("option_0", "42"), ("option_1", "36"), ("option_2", "48"), ("option_3", "13"), ("correct", "0"), ("explanation", "6 x 7 = 42."), ("source_type", "generated")]
st, loc = post(Q, "/admin/questions/new", new_act, t4); pstq = (re.search(r"/admin/questions/([0-9a-f-]{36})", loc or "") or [None, None])[1]
ph, _ = get(Q, f"/admin/questions/{pstq}"); pf = [f for f in forms(ph) if 'name="status" value="published"' in f][0]
post(Q, f"/admin/questions/{pstq}", aid(pf), [("id", pstq), ("status", "published")]); check("create and publish a PST question", dbi(f"select count(*) from public.question_exams qe join public.exam_types et on et.id=qe.exam_type_id where qe.question_id='{pstq}' and et.slug='pst'") == 1 and db(f"select status from public.questions where id='{pstq}'") == "published")
mpt_id = db("select q.id from public.questions q join public.exam_questions eq on eq.question_id=q.id where q.source_system='mpt' order by q.legacy_id limit 1"); mpt_legacy = db(f"select legacy_id from public.questions where id='{mpt_id}'")
st, loc = edit(Q, mpt_id, explanation="PHASE4-EDITED explanation for a question inside a stored mock."); check("edit an MPT question that is part of a stored mock", msg(loc, "ok") == "Saved.", loc)
lb, _ = get(Q, "/admin/questions"); bulk_act2 = aid(form_with(lb, 'name="confirm"'))
st, loc = post(Q, "/admin/questions", bulk_act2, [("back", "/admin/questions"), ("status", "archived"), ("reason", "Trying to archive a mock question"), ("confirm", "on"), ("ids", mpt_id)])
check("archiving a question that a live mock uses is refused, naming the mock", "live mock" in unquote(msg(loc, "error")) and db(f"select status from public.questions where id='{mpt_id}'") == "published", loc)

rc, out = cli("--dry-run", content=OUT); before_files = (open(f"{OUT}/overlay.json").read(), open(f"{OUT}/manifest.json").read())
check("content:publish --dry-run reports the changes and writes nothing", rc == 0 and "DRY RUN" in out and "added" in out and before_files == (open("src/content/overlay.json").read(), open("src/content/manifest.json").read()), out[-300:])
rc, out = cli(content=OUT); ov = json.load(open(f"{OUT}/overlay.json")); mf = json.load(open(f"{OUT}/manifest.json"))
check("content:publish writes the overlay and manifest", rc == 0 and "Published" in out and ov["generatedAt"] and mf["generatedAt"], out[-300:])
qb = ov["quiz"].get(BANK, {})
check("overlay: the edited question is a replacement carrying the new text", qb.get("replace", {}).get(first_legacy, {}).get("question", "").startswith("PHASE4-EDITED"))
check("overlay: the archived question is removed from its bank", second_legacy in qb.get("remove", []))
check("overlay: the new question is appended to the bank", [a["question"] for a in qb.get("add", [])] == ["PHASE4-NEW: which organelle makes ATP?"])
check("overlay: the edited MPT question is replaced", ov["mpt"].get("replace", {}).get(mpt_legacy, {}).get("explanation", "").startswith("PHASE4-EDITED"))
check("overlay: the new teacher question reaches PST only", [a["question"] for a in ov["teacher"].get("pst", {}).get("add", [])] == ["PHASE4-PST: what is 6 x 7?"] and not ov["teacher"].get("jest", {}).get("add") and not ov["teacher"].get("jst", {}).get("add"))
check("overlay stays small (it is the diff)", len(json.dumps(ov)) < 20000, str(len(json.dumps(ov))))
check("manifest records every question; the publish is audited", len(mf["questions"]) == dbi("select count(*) from public.questions") and dbi("select count(*) from public.audit_log where action='content.published'") == 1)
rc, out = cli("--check", content=OUT); check("--check passes right after a publish", rc == 0 and "Nothing to publish" in out, out[-200:])
edit(Q, first, stem="PHASE4-EDITED AGAIN: The nucleus of a cell is best described as:")
rc, out = cli("--check", content=OUT); check("--check fails once the database has moved on (unpublished changes)", rc == 1 and "UNPUBLISHED CHANGES" in out, out[-200:])
db(f"update public.questions set status='archived' where id='{mpt_id}'")
rc, out = cli(content=OUT); db(f"update public.questions set status='published' where id='{mpt_id}'")
check("publish REFUSES, and writes nothing, if a stored mock would lose a question", rc == 1 and "stored mock" in out and open(f"{OUT}/overlay.json").read() == json.dumps(ov, indent=2) + "\n", out[-250:])
rc, out = cli(content=OUT); check("publish works again once the problem is fixed", rc == 0, out[-200:])

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
