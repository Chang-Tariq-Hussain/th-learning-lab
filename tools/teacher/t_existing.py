"""Questions taken from the CSS MPT bank already in this project (tools/mpt), kept only where the topic and level suit a teacher test.
They are labelled existing_question; their original source type and year are recorded in sourceReference. They are NOT teacher past papers."""
import json, os, re
from helpers import q

HERE = os.path.dirname(os.path.abspath(__file__))
BANK = json.load(open(os.path.join(HERE, "..", "mpt", "mpt_question_bank.json")))
TOPICS = {
    ("EN", "Synonyms"): ("English", "Synonyms"), ("EN", "Antonyms"): ("English", "Antonyms"), ("EN", "Grammar"): ("English", "Grammar"),
    ("EN", "Prepositions"): ("English", "Prepositions"), ("EN", "Idioms"): ("English", "Idioms"),
    ("EN", "One-word Substitution"): ("English", "One-Word Substitution"), ("EN", "Parts of Speech"): ("English", "Parts of Speech"),
    ("EN", "Sentence Correction"): ("English", "Sentence Correction"), ("EN", "Sentence Completion"): ("English", "Sentence Completion"),
    ("EN", "Vocabulary"): ("English", "Vocabulary"),
    ("IS", "Seerah"): ("Islamiat", "Seerah"), ("IS", "Quran"): ("Islamiat", "Quran"), ("IS", "Khulafa-e-Rashidee"): ("Islamiat", "Khulafa-e-Rashideen"),
    ("GK", "Pakistan Geography"): ("Social Studies", "Pakistan Geography"), ("GK", "Pakistan Movement"): ("Social Studies", "Independence Movement"),
    ("GK", "Biology"): ("Science", "Biology Basics"),
    ("GA", "Averages"): ("Mathematics", "Average"), ("GA", "Percentages"): ("Mathematics", "Percentages"),
    ("GA", "Ratio & Proportion"): ("Mathematics", "Ratio and Proportion"), ("GA", "Profit & Loss"): ("Mathematics", "Profit and Loss"),
    ("GA", "Time & Work"): ("Mathematics", "Time and Work"), ("GA", "Mensuration"): ("Mathematics", "Mensuration"),
    ("GA", "Probability"): ("Mathematics", "Probability"),
}
BAD = re.compile(r"none of|all of|both|neither|above", re.I)
rows = []
for c in BANK:
    key = (c["subjectCode"], c["topic"])
    if key not in TOPICS or c["difficulty"] not in ("Easy", "Moderate") or c["passage"] is not None:
        continue
    if "mock1" not in c["mockNumber"] and "mock2" not in c["mockNumber"]:
        continue
    opts = c["options"]
    if any(BAD.search(v) for v in opts.values()) or re.search(r"\b20(2[3-9])\b", c["question"]):
        continue
    subj, topic = TOPICS[key]
    ok = opts[c["correctAnswer"]]
    bad = [v for k, v in opts.items() if k != c["correctAnswer"]]
    easy = c["difficulty"] == "Easy"
    # CSS items are written for graduates, so only the easy ones are offered to PST; moderate ones go to JEST/JST.
    ex = "PJ" if easy and subj != "Mathematics" else "J"
    d = "e" if easy else "m"
    yr = f" {c['sourceYear']}" if c["sourceYear"] else ""
    rows.append(q(ex, subj, topic, d, c["question"], ok, bad, c["explanation"], src="X",
                  ref=f"CSS MPT question bank {c['id']} ({c['sourceType']}{yr})"))
