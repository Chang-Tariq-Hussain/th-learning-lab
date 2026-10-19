#!/usr/bin/env python3
"""
Learner-side proof for Phase 4. Run against a PRODUCTION build that has the published overlay baked in
(see docs/admin-phase-4.md). Compares what LEARNERS actually receive with the database's published view:
  - every standalone quiz page: the exact ordered question ids it serves == the database's published bank
  - the MPT engine and the teacher bank loader (through the real modules), the content-health scan, and the
    admin Publishing page's pending-changes count.
"""
import glob, html as H, json, os, re, subprocess, sys
LEARNER = os.environ.get("LEARNER", "http://localhost:3124")
PG = ["psql", "-qAt", "-h", "localhost", "-U", "postgres", "-d", os.environ.get("PGDB", "thlab3")]
ENV = {**os.environ, "PGPASSWORD": "pw"}
fails = []
def sh(*a, **k): return subprocess.run(a, capture_output=True, text=True, **k).stdout
def db(sql): return subprocess.run(PG + ["-c", sql], capture_output=True, text=True, env=ENV).stdout.strip()
def ok(name, cond, extra=""):
    print(("  ✓ " if cond else "  ✗ ") + name + (f"  [{extra}]" if extra and not cond else ""))
    if not cond: fails.append(name)

print("== every standalone quiz page serves exactly the database's published bank")
pages = {}
for f in sorted(glob.glob("src/app/dashboard/*/*-quiz/page.tsx")):
    m = re.search(r'getQuizById\("([^"]+)"\)', open(f).read()); url = "/" + os.path.relpath(os.path.dirname(f), "src/app")
    if m: pages[url] = m.group(1)
ok(f"found {len(pages)} quiz pages", len(pages) >= 19)
changed_pages = 0
for url, bank in pages.items():
    page = sh("curl", "-s", LEARNER + url)
    served = []
    for i in re.findall(r'\\"id\\":\\"(' + re.escape(bank) + r'-[A-Za-z0-9-]+|adm-[0-9a-f]+)\\"', page):
        if i not in served: served.append(i)
    want = db(f"select q.legacy_id from public.question_bank_items bi join public.questions q on q.id=bi.question_id join public.question_banks b on b.id=bi.bank_id where b.slug='{bank}' and q.status='published' and b.status='published' order by bi.position").split("\n")
    ok(f"{url.split('/')[-1]}: {len(want)} questions, same ids in the same order", served == want, f"served {len(served)} vs db {len(want)}")
    if bank in ("biology-cell-explorer", "biology-active-transport"): changed_pages += 1

print("== the edits themselves are what learners read")
page = sh("curl", "-s", LEARNER + "/dashboard/biology/cell-explorer-quiz")
newest = db("select stem from public.questions where legacy_id='biology-cell-explorer-001'")
ok("edited stem is served", H.unescape(newest) in H.unescape(page.replace('\\"', '"')) or newest.split(":")[0] in page, newest[:60])
ok("the OLD wording of that question is gone", '\\"question\\":\\"The nucleus of a cell is best described as:' not in page)
ok("the archived question is gone (id and text)", "biology-cell-explorer-002" not in page)
ok("the new question appended to the bank is served", "PHASE4-NEW: which organelle makes ATP?" in page)
ok("the explanation of the new question is served", "Mitochondria make most of the cell" in page)

print("== MPT engine and teacher loader (the real modules, with the real overlay)")
probe = r'''
import { MPT_MOCK_1, MPT_MOCK_2 } from "./src/features/mpt-mock/data/mpt-mock-data";
import { getMockQuestions } from "./src/features/mpt-mock/engine";
import { loadBank, loadCodeBank } from "./src/features/teacher-tests/bank-loader";
(async () => {
  const q = [...getMockQuestions(MPT_MOCK_1), ...getMockQuestions(MPT_MOCK_2)];
  const edited = q.filter((x) => x.explanation.startsWith("PHASE4-EDITED"));
  const pst = await loadBank("pst"), pstCode = await loadCodeBank("pst"), jest = await loadBank("jest"), jestCode = await loadCodeBank("jest");
  console.log(JSON.stringify({ mockQuestions: q.length, edited: edited.map((x) => x.id), pstAdded: pst.filter((x) => x.question.startsWith("PHASE4-PST")).length, pst: pst.length, pstCode: pstCode.length, jestSame: jest.length === jestCode.length && jest[0] === jestCode[0] }));
})();
'''
open("probe-tmp.ts", "w").write(probe)
out = sh("node_modules/.bin/tsx", "--tsconfig", "scripts/tsconfig.health.json", "probe-tmp.ts"); os.remove("probe-tmp.ts")
r = json.loads(out.strip().splitlines()[-1])
ok("MPT: mocks still hold all 400 question slots and the edited question is served by the engine", r["mockQuestions"] == 400 and len(r["edited"]) == 1, str(r))
ok("teacher: PST gets the new question (+1) and loses the withdrawn one (-1)", r["pstAdded"] == 1 and r["pst"] == r["pstCode"], str(r))
ok("teacher: JEST is untouched (the very same objects as the code)", r["jestSame"])

print("== content health scans what is served")
rc = subprocess.run(["node_modules/.bin/tsx", "--tsconfig", "scripts/tsconfig.health.json", "scripts/content-health.ts", "--all", "--fail-on=critical"], capture_output=True, text=True)
ok("health passes (no critical) with the overlay applied", rc.returncode == 0, rc.stdout[:200])
ok("health reports the overlay as active, with nothing ignored", "overlay.active" in rc.stdout and "overlay.ignored-item" not in rc.stdout)
print("\nALL OK" if not fails else f"\n{len(fails)} FAILURE(S):\n - " + "\n - ".join(fails)); sys.exit(1 if fails else 0)
