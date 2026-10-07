"""Standalone QC for the CSS MPT bank and every mock. Usage: python3 validate_mock.py [dir]
For each mockN.json in dir: exact size and section split, 4 distinct options, one valid key, source types, difficulty and letter balance,
and zero overlap with every other mock (shared ids, and near-duplicate question text)."""
import difflib, glob, json, os, re, sys
from collections import Counter
D = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))
bank = json.load(open(f"{D}/mpt_question_bank.json", encoding="utf8"))
mocks = {os.path.basename(p)[:-5]: json.load(open(p, encoding="utf8")) for p in sorted(glob.glob(f"{D}/mock[0-9]*.json"))}
byid = {q["id"]: q for q in bank}
fails = []
def chk(c, m):
    print(("PASS " if c else "FAIL ") + m)
    if not c: fails.append(m)
NEED = {"Islamic Studies": 20, "Urdu": 20, "English": 50, "General Abilities": 60, "GK / Current Affairs / Pakistan Affairs": 50}
ORDER = list(NEED)
SRC = ("Verified Past Paper", "Existing Question Bank", "Generated Practice")
def norm(q): return re.sub(r"[^\w ]", "", (q["question"] + " " + " ".join(q["options"].values())).lower())

chk(len(set(q["id"] for q in bank)) == len(bank), f"bank has {len(bank)} unique ids")
chk(all(list(q["options"]) == list("ABCD") for q in bank), "every question has exactly 4 options A-D")
chk(all(len(set(q["options"].values())) == 4 for q in bank), "no duplicate options within a question")
chk(all(q["correctAnswer"] in q["options"] for q in bank), "exactly one valid correct answer per question")
chk(all(q["explanation"].strip() for q in bank), "every question has an explanation")
chk(all(q["sourceType"] in SRC for q in bank), "valid sourceType values")
chk(all(q["sourceYear"] is None for q in bank if q["sourceType"] == "Generated Practice"), "no source year on generated items")
chk(all(q["sourceYear"] in (2022, 2023, 2024, 2025, 2026) for q in bank if q["sourceType"] == "Verified Past Paper"), "past-paper items carry a real source year")
chk(all(isinstance(q["alsoIn"], list) and isinstance(q["sourceNote"], str) for q in bank), "alsoIn is a list and sourceNote a string on every item")
chk(not any(q["optionsReordered"] and re.search(r"\([A-D]\)", q["explanation"]) for q in bank), "no explanation points at option letters after reordering")
chk(all((q.get("verifiedNote") or "").strip() for q in bank), "every item has a verifiedNote")
chk(all(q.get("yieldNote") for q in bank if "mock2" in q["usedInMocks"]), "every Mock 2 item has a yieldNote")

allq = {}
for name, m in mocks.items():
    print(f"\n=== {name} ===")
    ids = m["questionIds"]; qs = [byid[i] for i in ids]
    chk(len(ids) == 200 == len(set(ids)), f"{name}: exactly 200 unique question ids")
    chk(m["timeMinutes"] == 200 and m["passMarks"] == 66 and m["negativeMarking"] is False, f"{name}: 200 minutes, 66 passing marks, no negative marking")
    got = Counter(q["subject"] for q in qs)
    chk(dict(got) == NEED, f"{name}: subject split {dict(got)}")
    chk([s["count"] for s in m["sections"]] == list(NEED.values()), f"{name}: section definition matches 20/20/50/60/50")
    seq = [q["subject"] for q in qs]; chk(seq == sorted(seq, key=ORDER.index), f"{name}: real paper order (IS, UR, EN, GA, GK)")
    chk(all(name in q["usedInMocks"] for q in qs), f"{name}: usedInMocks recorded on every item")
    d = Counter(q["difficulty"] for q in qs); print("    difficulty", {k: f"{v} ({v/2:.1f}%)" for k, v in d.items()})
    chk(50 <= d["Easy"] <= 60 and 90 <= d["Moderate"] <= 100 and 40 <= d["Difficult"] <= 50, f"{name}: difficulty within 25-30 / 45-50 / 20-25 %")
    L = Counter(q["correctAnswer"] for q in qs); print("    answer letters", dict(sorted(L.items())))
    chk(all(45 <= L[l] <= 55 for l in "ABCD"), f"{name}: each answer letter between 45 and 55")
    print("    sources", dict(Counter(q["sourceType"] for q in qs)))
    for sec in NEED: print("       ", sec, dict(Counter(q["sourceType"] for q in qs if q["subject"] == sec)))
    allq[name] = qs
    # within-mock duplicates
    dups = [(a["id"], b["id"]) for n, a in enumerate(qs) for b in qs[n + 1:] if a["subjectCode"] == b["subjectCode"] and difflib.SequenceMatcher(None, norm(a), norm(b)).ratio() > 0.85]
    chk(not dups, f"{name}: no near-duplicate questions inside the mock {dups}")

print("\n=== overlap between mocks ===")
names = list(allq)
for i, a in enumerate(names):
    for b in names[i + 1:]:
        shared = set(q["id"] for q in allq[a]) & set(q["id"] for q in allq[b])
        chk(not shared, f"{a} vs {b}: zero shared ids {sorted(shared)[:5]}")
        near = []
        for x in allq[a]:
            nx = norm(x)
            for y in allq[b]:
                if x["subjectCode"] == y["subjectCode"] and difflib.SequenceMatcher(None, nx, norm(y)).ratio() > 0.8:
                    near.append((x["id"], y["id"]))
        chk(not near, f"{a} vs {b}: zero near-duplicate question text {near}")
        # same answer text + overlapping stem words (catches reworded stems / shuffled options)
        def toks(q): return set(re.findall(r"[a-z0-9؀-ۿ]{4,}", q["question"].lower()))
        sus = []
        for x in allq[a]:
            for y in allq[b]:
                if x["subjectCode"] != y["subjectCode"]: continue
                if x["options"][x["correctAnswer"]].strip().lower() == y["options"][y["correctAnswer"]].strip().lower():
                    tx, ty = toks(x), toks(y)
                    if tx and ty and len(tx & ty) / min(len(tx), len(ty)) >= 0.5: sus.append((x["id"], y["id"]))
        chk(not sus, f"{a} vs {b}: no same-answer / same-stem-words pairs {sus}")
print("\nRESULT:", "ALL CHECKS PASSED" if not fails else f"{len(fails)} FAILED: {fails}")
sys.exit(1 if fails else 0)
