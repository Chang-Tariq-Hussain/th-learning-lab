#!/usr/bin/env python3
"""One-click publish button, against a FAKE GitHub (the real GitHub is never contacted). Run against the dev server started with
GITHUB_PUBLISH_TOKEN=tok-secret-123 GITHUB_PUBLISH_REPO=acme/lab GITHUB_API_URL=http://127.0.0.1:4010  (see README)."""
import json, os, re, subprocess, threading
from http.server import BaseHTTPRequestHandler, HTTPServer
B = os.environ.get("APP", "http://localhost:3122")
PG = ["psql", "-qAt", "-h", "localhost", "-U", "postgres", "-d", os.environ.get("PGDB", "thlab3")]; ENV = {**os.environ, "PGPASSWORD": "pw"}
fails = []; calls = []; state = {"run": None, "dispatch_status": 204}
def sh(*a): return subprocess.run(a, capture_output=True, text=True).stdout
def db(sql): return subprocess.run(PG + ["-c", sql], capture_output=True, text=True, env=ENV).stdout.strip()
def ok(n, c, e=""):
    print(("  ✓ " if c else "  ✗ ") + n + (f"  [{e}]" if e and not c else "")); fails.append(n) if not c else None
class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def do_GET(self):
        calls.append(("GET", self.path, self.headers.get("Authorization")))
        runs = [state["run"]] if state["run"] else []
        b = json.dumps({"workflow_runs": runs}).encode(); self.send_response(200); self.send_header("content-type", "application/json"); self.end_headers(); self.wfile.write(b)
    def do_POST(self):
        n = int(self.headers.get("content-length", 0)); body = json.loads(self.rfile.read(n) or b"{}")
        calls.append(("POST", self.path, self.headers.get("Authorization"), body)); self.send_response(state["dispatch_status"]); self.end_headers()
srv = HTTPServer(("127.0.0.1", 4010), H); threading.Thread(target=srv.serve_forever, daemon=True).start()
def get(jar, path): return sh("curl", "-s", "-b", jar, "-c", jar, B + path)
def text(h): return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", h))
def forms(h): return re.findall(r"<form[^>]*>(.*?)</form>", h, re.S)
def aid(f): m = re.search(r'name="(\$ACTION_ID_[0-9a-f]+)"', f); return m.group(1) if m else None
def post(jar, path, act, fields=()):
    a = ["curl", "-s", "-o", "/dev/null", "-D", "/tmp/hdrB", "-b", jar, "-c", jar, "-F", act + "="] + [x for k, v in fields for x in ("-F", f"{k}={v}")]
    sh(*a, B + path); h = open("/tmp/hdrB").read(); m = re.search(r"(?im)^location:\s*(.*?)\r?$", h)
    from urllib.parse import unquote; return unquote(m.group(1)) if m else ""
def login(jar, email, pw):
    sh("rm", "-f", jar); html = get(jar, "/admin/login")
    post(jar, "/admin/login", aid(forms(html)[0]), [("email", email), ("password", pw), ("next", "/admin")])
PUB = "/admin/publishing"
print("== one-click publish")
QM, AN = "/tmp/jbQM", "/tmp/jbAN"
login(QM, "qm@x.com", "pw4"); login(AN, "analyst@x.com", "pw2")
page = get(QM, PUB)
ok("a question manager sees the Publish button", "Publish to learners" in page and "Where a change is" in page)
ok("the page explains saved → waiting → live", all(x in text(page) for x in ["1. Saved", "2. Waiting to be published", "3. Live"]))
ok("the GitHub token never reaches the browser", "tok-secret-123" not in page)
ok("the command-line steps are kept for developers, folded away", "Advanced: publish from the command line" in page)
ap = get(AN, PUB)
ok("an analyst sees the page but no button and a clear reason", "cannot publish" in text(ap) and "Publish to learners</button>" not in ap and "Publish to learners" in text(ap))
f = [x for x in forms(page) if "Publish to learners" in x][0]; act = aid(f)
before = int(db("select count(*) from audit_log where action='content.publish_requested'") or 0)
loc = post(AN, PUB, act)
ok("an analyst replaying the form is refused and nothing is sent to GitHub", not any(c[0] == "POST" for c in calls) and "ok=" not in loc, loc)
loc = post(QM, PUB, act)
posts = [c for c in calls if c[0] == "POST"]
ok("clicking Publish asks GitHub to run the workflow on the right repo and branch", len(posts) == 1 and posts[0][1] == "/repos/acme/lab/actions/workflows/publish-content.yml/dispatches" and posts[0][3]["ref"] == "main", str(posts))
ok("  → it sends the token, and names who asked", posts[0][2] == "Bearer tok-secret-123" and posts[0][3]["inputs"]["requested_by"] == "qm@x.com")
ok("  → the page says publishing started", "Publishing started" in loc)
ok("  → the request is recorded in the audit log", int(db("select count(*) from audit_log where action='content.publish_requested' and actor_email='qm@x.com'") or 0) == before + 1)
state["run"] = {"status": "in_progress", "conclusion": None, "html_url": "https://github.com/acme/lab/actions/runs/1", "created_at": "2026-10-20T08:00:00Z"}
page = get(QM, PUB)
ok("while a publish runs, the button is disabled and says so", "Publishing in progress" in page and "disabled" in page)
n = len([c for c in calls if c[0] == "POST"]); loc = post(QM, PUB, act)
ok("a second click during a run is refused (no second dispatch)", len([c for c in calls if c[0] == "POST"]) == n and "already running" in loc, loc)
state["run"] = {"status": "completed", "conclusion": "failure", "html_url": "https://github.com/acme/lab/actions/runs/1", "created_at": "2026-10-20T08:00:00Z"}
ok("a failed run is reported plainly: nothing changed for learners", "FAILED" in text(get(QM, PUB)) and "nothing was changed" in text(get(QM, PUB)))
state["run"]["conclusion"] = "success"
ok("a successful run is reported", "finished" in text(get(QM, PUB)))
state["dispatch_status"] = 403; loc = post(QM, PUB, act)
ok("a rejected token gives a plain message and leaks nothing", "rejected the publishing token" in loc and "tok-secret" not in loc, loc)
state["dispatch_status"] = 404; loc = post(QM, PUB, act)
ok("a missing workflow gives a plain message", "could not find the publishing workflow" in loc, loc)
print("\nALL OK" if not fails else f"\n{len(fails)} FAILURE(S):\n - " + "\n - ".join(fails)); raise SystemExit(1 if fails else 0)
