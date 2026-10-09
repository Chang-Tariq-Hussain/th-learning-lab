"""Builds the teacher question bank: reads the t_*.py data modules, assigns ids and answer positions,
writes tools/teacher/teacher_bank.json and the per-exam TypeScript files in src/features/teacher-tests/data/."""
import importlib, json, os, random, re, sys, glob, hashlib

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
OUT_TS = os.path.join(ROOT, "src", "features", "teacher-tests", "data")
sys.path.insert(0, HERE)
from helpers import DEFAULT_CLASS, map_topic  # noqa: E402
SYL = json.load(open(os.path.join(ROOT, "src", "features", "teacher-tests", "syllabus.json")))

SUBJ_CODE = {"English": "eng", "Mathematics": "mat", "Science": "sci", "Computer": "cmp", "Islamiat": "isl", "Social Studies": "soc", "Urdu": "urd", "Sindhi": "snd"}
EXAM_ORDER = ["pst", "jest", "jst"]
UNSAFE = re.compile(r"\b(all|none|both|neither|any)\s+of\b|\babove\b|\bboth\b|\b[abcd]\s*(and|&)\s*[abcd]\b", re.I)


def load_rows():
    rows = []
    for path in sorted(glob.glob(os.path.join(HERE, "t_*.py"))):
        mod = importlib.import_module(os.path.basename(path)[:-3])
        rows.extend(mod.rows)
    return rows


def main():
    rows = load_rows()
    # JST (Junior Science Teacher) draws its non-science sections from the JEST-level pool: science-graduate candidates
    # sit the same kind of school-level English, maths, Urdu, Islamiat, social studies and computer questions.
    # Science itself is separate (JST has its own physics / chemistry / biology questions).
    for r in rows:
        if "jest" in r["exams"] and "jst" not in r["exams"] and r["subject"] != "Science":
            r["exams"] = r["exams"] + ["jst"]
    counters = {}
    questions = []
    free = []  # rows whose option order may be balanced
    for r in rows:
        primary = r["exams"][0]
        key = (primary, r["subject"])
        counters[key] = counters.get(key, 0) + 1
        r["id"] = f"{primary}-{SUBJ_CODE[r['subject']]}-{counters[key]:04d}"
        if not r["fixed"] and not any(UNSAFE.search(t) for t in [r["correctText"]] + r["wrongTexts"]):
            free.append(r)
    # balanced answer positions: shuffled blocks of 0..3, seeded, assigned once per unique question
    rnd = random.Random(2028)
    pos = []
    while len(pos) < len(free):
        blk = [0, 1, 2, 3]
        rnd.shuffle(blk)
        pos.extend(blk)
    for r, p in zip(free, pos):
        wrong = r["wrongTexts"][:]
        rnd.shuffle(wrong)
        opts = wrong[:p] + [r["correctText"]] + wrong[p:]
        r["options"], r["answer"] = opts, p
    for r in rows:
        if "options" not in r:  # unsafe-but-not-declared-fixed rows keep author order: correct first is NOT acceptable, so place by hash
            wrong = r["wrongTexts"][:]
            p = int(hashlib.md5(r["id"].encode()).hexdigest(), 16) % 4
            r["options"] = wrong[:p] + [r["correctText"]] + wrong[p:]
            r["answer"] = p
            r["fixed"] = True
    for r in rows:
        src = r["sourceType"]
        verified = src == "verified_past_paper"
        if src == "generated_syllabus":
            note = "Written from the syllabus topic list; not taken from any past paper. Answer checked by the author, not by an official source."
        elif src == "existing_question":
            note = "Taken from a question bank already present in this project; its original source is in sourceReference. Not verified as a teacher-test past paper."
        elif src == "generated_similar":
            note = "Written to mirror a named earlier question (see sourceReference). Not a past paper."
        else:
            note = "Verified past-paper question (see sourceReference)."
        if r.get("checked"):
            note += " The numeric answer was recomputed independently in code."
        if r["needsReview"]:
            note += " Needs a native-speaker check."
        exams = [e for e in EXAM_ORDER if e in r["exams"]]
        # Difficulty is relative to the exam. A question written for PST level and rated difficult is rated moderate in JEST and JST.
        by_exam = {e: ("moderate" if (r["difficulty"] == "difficult" and "pst" in r["exams"] and e != "pst") else r["difficulty"]) for e in exams}
        questions.append({"difficultyByExam": by_exam,
            "id": r["id"], "examType": exams[0], "examTypes": exams, "question": r["question"], "passage": r["passage"],
            "options": r["options"], "correctAnswer": r["answer"], "explanation": r["explanation"],
            "subject": r["subject"], "topic": r["topic"], "subtopic": r["subtopic"], "difficulty": r["difficulty"],
            "sourceType": src, "sourceYear": r["sourceYear"], "sourceReference": r["sourceReference"],
            "verified": verified, "verificationNote": note,
            "syllabusClass": r["classes"] if r["classes"] else DEFAULT_CLASS[exams[0]],
            "language": r["language"], "fixedOrder": r["fixed"], "needsReview": r["needsReview"],
        })
    json.dump(questions, open(os.path.join(HERE, "teacher_bank.json"), "w"), ensure_ascii=False, indent=1)
    os.makedirs(OUT_TS, exist_ok=True)
    for ex in EXAM_ORDER:
        sel = []
        for q in questions:
            if ex in q["examTypes"]:
                c = dict(q)
                c["examType"] = ex
                mapped = map_topic(q["topic"], q["subject"], SYL[ex][q["subject"]])
                assert mapped, (q["id"], q["topic"], ex)
                c["topic"] = mapped
                c["difficulty"] = q["difficultyByExam"][ex]
                del c["difficultyByExam"]
                sel.append(c)
        name = ex.upper() + "_BANK"
        body = json.dumps(sel, ensure_ascii=False, indent=1)
        open(os.path.join(OUT_TS, f"{ex}-bank.ts"), "w").write(
            '// Auto-generated by tools/teacher/build_teacher.py - do not edit by hand.\nimport type { TeacherQuestion } from "../types";\n\n'
            f"export const {name}: TeacherQuestion[] = {body} as TeacherQuestion[];\n")
        print(ex, len(sel))
    stats = {}
    for ex in EXAM_ORDER:
        sel = [q for q in questions if ex in q["examTypes"]]
        topics = {}
        bysrc, bydiff, bysub = {}, {}, {}
        for q in sel:
            d = q["difficultyByExam"][ex]
            bysrc[q["sourceType"]] = bysrc.get(q["sourceType"], 0) + 1
            bydiff[d] = bydiff.get(d, 0) + 1
            bysub[q["subject"]] = bysub.get(q["subject"], 0) + 1
            tp = map_topic(q["topic"], q["subject"], SYL[ex][q["subject"]])
            topics.setdefault(q["subject"], {})
            topics[q["subject"]][tp] = topics[q["subject"]].get(tp, 0) + 1
        stats[ex] = {"total": len(sel), "bySource": bysrc, "byDifficulty": bydiff, "bySubject": bysub, "topics": topics,
                     "shared": sum(1 for q in sel if len(q["examTypes"]) > 1)}
    stats["unique"] = len(questions)
    open(os.path.join(OUT_TS, "bank-stats.ts"), "w").write(
        "// Auto-generated by tools/teacher/build_teacher.py - do not edit by hand.\n"
        "// Counts only, so landing pages can show bank sizes without downloading the questions.\n"
        "export interface ExamStats { total: number; bySource: Record<string, number>; byDifficulty: Record<string, number>; bySubject: Record<string, number>; topics: Record<string, Record<string, number>>; shared: number }\n"
        f"export const BANK_STATS: {{ pst: ExamStats; jest: ExamStats; jst: ExamStats; unique: number }} = {json.dumps(stats, ensure_ascii=False, indent=1)};\n")
    print("unique questions", len(questions))


if __name__ == "__main__":
    main()
