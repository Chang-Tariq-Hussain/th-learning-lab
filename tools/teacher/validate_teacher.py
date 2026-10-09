"""Quality checks for the teacher question bank. Exit code 1 if any hard check fails."""
import json, os, re, sys, difflib, collections
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from helpers import map_topic

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
bank = json.load(open(os.path.join(HERE, "teacher_bank.json")))
syl = json.load(open(os.path.join(ROOT, "src", "features", "teacher-tests", "syllabus.json")))
errors, warns = [], []
E = errors.append
SUBJ = {"English", "Mathematics", "Science", "Computer", "Islamiat", "Social Studies", "Sindhi", "Urdu"}
SRC = {"verified_past_paper", "existing_question", "generated_similar", "generated_syllabus"}
norm = lambda s: re.sub(r"[^\w؀-ۿ]+", " ", s.lower()).strip()
full = lambda q: norm(q["question"]) + " | " + " ".join(sorted(norm(o) for o in q["options"]))

ids = [q["id"] for q in bank]
if len(ids) != len(set(ids)):
    E("duplicate ids: " + str([i for i, c in collections.Counter(ids).items() if c > 1][:5]))
for q in bank:
    i = q["id"]
    o = q["options"]
    if len(o) != 4 or len({x.strip().lower() for x in o}) != 4 or any(not x.strip() for x in o):
        E(f"{i}: options not 4 distinct non-empty")
    if not (isinstance(q["correctAnswer"], int) and 0 <= q["correctAnswer"] < 4):
        E(f"{i}: invalid correctAnswer")
    if not q["explanation"].strip():
        E(f"{i}: missing explanation")
    if q["subject"] not in SUBJ or q["sourceType"] not in SRC or q["difficulty"] not in ("easy", "moderate", "difficult"):
        E(f"{i}: bad subject/source/difficulty")
    for ex in q["examTypes"]:
        if map_topic(q["topic"], q["subject"], syl[ex][q["subject"]]) is None:
            E(f"{i}: topic '{q['topic']}' cannot be mapped into the {ex} syllabus for {q['subject']}")
    if q["sourceType"] == "verified_past_paper" and not (q["verified"] and q["sourceReference"] and q["sourceYear"]):
        E(f"{i}: past-paper claim without reference/year/verified")
    if q["sourceType"] != "verified_past_paper" and q["verified"]:
        E(f"{i}: verified=true on non-past-paper")
    if q["sourceType"] in ("existing_question", "generated_similar") and not q["sourceReference"]:
        E(f"{i}: {q['sourceType']} needs sourceReference")
    if re.search(r"\b(all|none) of the above\b", " ".join(o), re.I) and not q["fixedOrder"]:
        E(f"{i}: all/none of the above must be fixedOrder")
    if re.search(r"\boption\s+[A-D]\b|\b\([A-D]\)", q["explanation"]):
        E(f"{i}: explanation refers to an option letter (breaks after option shuffling)")
    if q["language"] == "en" and q["subject"] in ("Urdu", "Sindhi"):
        E(f"{i}: language mismatch")
    # the correct option must not be the longest in an obviously leaky way is only a warning
# near duplicates per exam
for ex in ("pst", "jest", "jst"):
    qs = [q for q in bank if ex in q["examTypes"]]
    seen = {}
    for q in qs:
        k = full(q)
        if k in seen:
            E(f"exact duplicate (stem and options) in {ex}: {q['id']} == {seen[k]}")
        seen[k] = q["id"]
    by = collections.defaultdict(list)
    for q in qs:
        by[q["subject"]].append(q)
    for s, lst in by.items():
        for a in range(len(lst)):
            na = full(lst[a])
            for b in range(a + 1, len(lst)):
                nb = full(lst[b])
                if abs(len(na) - len(nb)) > 40:
                    continue
                if difflib.SequenceMatcher(None, na, nb).ratio() > 0.9:
                    warns.append(f"near-duplicate in {ex}: {lst[a]['id']} ~ {lst[b]['id']}")
    # difficulty mix and letters
    c = collections.Counter(q["difficultyByExam"][ex] for q in qs)
    L = collections.Counter("ABCD"[q["correctAnswer"]] for q in qs)
    n = max(1, len(qs))
    print(f"{ex.upper()}: {len(qs)} questions | easy {c['easy']/n:.0%} moderate {c['moderate']/n:.0%} difficult {c['difficult']/n:.0%} | answers A{L['A']} B{L['B']} C{L['C']} D{L['D']}")
    if len(qs) >= 40 and max(L.values()) / n > 0.32:
        E(f"{ex}: answer letters badly unbalanced {dict(L)}")
for w in warns[:30]:
    print("WARN", w)
print(f"{len(warns)} near-duplicate warnings")
if errors:
    print(f"\n{len(errors)} ERRORS")
    for e in errors[:60]:
        print(" -", e)
    sys.exit(1)
print("\nALL HARD CHECKS PASSED")
