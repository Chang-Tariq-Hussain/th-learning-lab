"""Prints the bank audit: counts per exam by subject, difficulty, source, topic coverage and how many mocks each section can fill without repeats."""
import json, os, collections, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
bank = json.load(open(os.path.join(HERE, "teacher_bank.json")))
sys.path.insert(0, HERE)
from helpers import map_topic
syl = json.load(open(os.path.join(ROOT, "src/features/teacher-tests/syllabus.json")))
SEC = {"pst": {"Urdu": 20, "Social Studies": 5, "Islamiat": 5, "English": 20, "Mathematics": 20, "Science": 20, "Computer": 10},
       "jest": {"Urdu": 20, "Social Studies": 5, "Islamiat": 5, "English": 20, "Mathematics": 20, "Science": 20, "Computer": 10},
       "jst": {"Urdu": 5, "Social Studies": 5, "Islamiat": 5, "English": 15, "Mathematics": 20, "Science": 45, "Computer": 5}}
TARGET = {"pst": (.30, .50, .20), "jest": (.22, .50, .28), "jst": (.20, .50, .30)}
for ex in ("pst", "jest", "jst"):
    qs = [q for q in bank if ex in q["examTypes"]]
    print(f"\n=== {ex.upper()} : {len(qs)} ===")
    print(f"{'subject':16}{'total':>6}{'easy':>6}{'mod':>6}{'diff':>6}{'per mock':>10}{'mocks':>7}")
    for s, per in SEC[ex].items():
        sq = [q for q in qs if q["subject"] == s]
        c = collections.Counter(q["difficultyByExam"][ex] for q in sq)
        print(f"{s:16}{len(sq):>6}{c['easy']:>6}{c['moderate']:>6}{c['difficult']:>6}{per:>10}{len(sq)//per:>7}")
    t = collections.Counter(q["difficultyByExam"][ex] for q in qs); n = len(qs)
    print("overall", {k: f"{v/n:.0%}" for k, v in t.items()}, "target", TARGET[ex])
    if ex == "jst":
        for b in ("Physics", "Chemistry", "Biology"):
            sq = [q for q in qs if q["topic"].startswith(b + ":")]
            c = collections.Counter(q["difficultyByExam"][ex] for q in sq)
            print(f"  {b}: {len(sq)} {dict(c)}")
    # topics with no question
    for s in SEC[ex]:
        have = {map_topic(q["topic"], s, syl[ex][s]) for q in qs if q["subject"] == s}
        miss = [t for t in syl[ex][s] if t not in have]
        if miss: print(f"  no questions yet ({s}): {', '.join(miss)}")
