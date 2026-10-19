#!/usr/bin/env python3
"""Admin Publishing page against a PRODUCTION build (accounts mode) whose baked manifest matches the database."""
import html as H, os, re, subprocess, sys
APP = os.environ.get("ADMIN_APP", "http://localhost:3124"); J = "/tmp/jPub"
PG = ["psql", "-qAt", "-h", "localhost", "-U", "postgres", "-d", os.environ.get("PGDB", "thlab3")]; ENV = {**os.environ, "PGPASSWORD": "pw"}
fails = []
def sh(*a): return subprocess.run(a, capture_output=True, text=True).stdout
def db(sql): return subprocess.run(PG + ["-c", sql], capture_output=True, text=True, env=ENV).stdout.strip()
def ok(n, c, e=""):
    print(("  ✓ " if c else "  ✗ ") + n + (f"  [{e}]" if e and not c else "")); fails.append(n) if not c else None
def get(path): return sh("curl", "-s", "-b", J, "-c", J, APP + path)
def text(h): return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", h))
def forms(h): return re.findall(r"<form[^>]*>(.*?)</form>", h, re.S)
def aid(f): m = re.search(r'name="(\$ACTION_ID_[0-9a-f]+)"', f); return m.group(1) if m else None
def post(path, act, fields):
    a = ["curl", "-s", "-o", "/dev/null", "-D", "/tmp/hdrP", "-b", J, "-c", J, "-F", act + "="] + [x for k, v in fields for x in ("-F", f"{k}={v}")]
    sh(*a, APP + path); return open("/tmp/hdrP").read().split("\r\n")[0]
def collect(f):
    d = {}
    for m in re.finditer(r"<input([^>]*)>", f):
        a = m.group(1); n = re.search(r'name="([^"]+)"', a)
        if not n or n.group(1).startswith("$"): continue
        t = (re.search(r'type="([^"]+)"', a) or [0, "text"])[1]; v = re.search(r'value="([^"]*)"', a)
        if t in ("checkbox", "radio"):
            if "checked" in a: d[n.group(1)] = H.unescape(v.group(1)) if v else "on"
        elif t != "submit": d[n.group(1)] = H.unescape(v.group(1)) if v else ""
    for m in re.finditer(r'<textarea[^>]*name="([^"]+)"[^>]*>(.*?)</textarea>', f, re.S): d[m.group(1)] = H.unescape(m.group(2)).strip()
    for m in re.finditer(r'<select[^>]*name="([^"]+)"[^>]*>(.*?)</select>', f, re.S):
        s = re.search(r'<option value="([^"]*)"[^>]*selected', m.group(2)); d[m.group(1)] = H.unescape(s.group(1)) if s else ""
    return d

sh("rm", "-f", J); lg = get("/admin/login"); la = aid(forms(lg)[0])
post("/admin/login", la, [("email", "qm@x.com"), ("password", "pw4"), ("next", "/admin")])
MANIFEST = os.environ.get("MANIFEST", "src/content/manifest.json")
import json
def expected():
    """What the page SHOULD report, computed independently from the baked manifest and the database."""
    man = json.load(open(MANIFEST))["questions"]; c = dict(edited=0, new=0, live=0, offline=0)
    for line in db("select source_system||':'||legacy_id||'|'||status||'|'||content_hash from public.questions").split("\n"):
        key, status, h = line.split("|", 2); was = man.get(key)
        if was is None: c["new"] += 1
        elif was == f"{status}|{h}": pass
        elif was.split("|")[0] != "published" and status == "published": c["live"] += 1
        elif was.split("|")[0] == "published" and status != "published": c["offline"] += 1
        else: c["edited"] += 1
    return c
def shown(t):
    g = lambda label: int((re.search(label + r"\s+(\d+)", t) or [0, -1])[1])
    return dict(edited=g("Edited"), new=g("New in the database"), live=g("Went live"), offline=g("Taken offline"))
page = text(get("/admin/publishing")); exp0 = expected()
ok("Publishing page renders in the production build", "Waiting to be published" in page)
ok(f"its four counters equal an independent recount from the manifest and the database {exp0}", shown(page) == exp0, f"page {shown(page)}")
ok("it summarises what the last publish contains (quiz, MPT, PST, JEST, JST)", all(re.search(w + r"\s*:", page) for w in ("Quiz", "CSS MPT", "PST", "JEST", "JST")))
ok("it says how to publish and how to undo", "content:publish" in page and "revert that commit" in page)
qid = db("select id from public.questions where legacy_id='biology-cell-explorer-002'")
body = get(f"/admin/questions/{qid}"); f = [x for x in forms(body) if 'name="expected_hash"' in x and 'name="stem"' in x]
ok("found an editable question to change", bool(f))
d = collect(f[0]); d["explanation"] = "Changed after the publish, to test the pending marker " + str(os.getpid()) + "."
post(f"/admin/questions/{qid}", aid(f[0]), list(d.items()))
exp1 = expected(); page2 = text(get("/admin/publishing"))
ok("an edit after the publish raises the page's count to match a fresh recount", exp1["edited"] + exp1["new"] + exp1["live"] + exp1["offline"] > exp0["edited"] + exp0["new"] + exp0["live"] + exp0["offline"] and shown(page2) == exp1, f"expected {exp1} page {shown(page2)}")
ok("the question's own page says learners don't see the change yet", "learners do not see this yet" in text(get(f"/admin/questions/{qid}")))
ok("the list marks it 'not yet published to learners'", "not yet published to learners" in text(get("/admin/questions?q=biology-cell-explorer-002")))
print("\nALL OK" if not fails else f"\n{len(fails)} FAILURE(S): " + "; ".join(fails)); sys.exit(1 if fails else 0)
