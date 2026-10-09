"""Compact helpers for writing teacher-test questions as data.

q(ex, subj, topic, d, stem, ok, bad, why, ...)
  ex   : which exams may use it - letters P (PST), J (JEST), S (JST), e.g. "PJ"
  subj : English | Mathematics | Science | Computer | Islamiat | Social Studies | Urdu | Sindhi
  d    : e / m / d  (easy / moderate / difficult)
  ok   : the correct option text;  bad : the three wrong options
  why  : explanation (required)
Keyword options: src ("S" syllabus, "X" existing, "L" similar, "V" verified past paper), chk (an independently
computed value that must equal `ok`), passage, ref, year, sub (subtopic), cls (class band), review (needs native check).
qf() is the same but the options are given in display order with `ans` the index of the correct one (fixed order).
"""
EXAMS = {"P": "pst", "J": "jest", "S": "jst"}
DIFF = {"e": "easy", "m": "moderate", "d": "difficult"}
SRC = {"S": "generated_syllabus", "X": "existing_question", "L": "generated_similar", "V": "verified_past_paper"}
LANG = {"English": "en", "Mathematics": "en", "Science": "en", "Computer": "en", "Islamiat": "en", "Social Studies": "en", "Urdu": "ur", "Sindhi": "sd"}
DEFAULT_CLASS = {"pst": "Classes I-VIII (estimated level)", "jest": "Classes VI-X (estimated level)", "jst": None}


def _base(ex, subj, topic, d, stem, why, src, kw):
    assert why and len(why) > 12, (stem, "explanation too short")
    assert d in DIFF and src in SRC and set(ex) <= set(EXAMS), (stem, ex, d, src)
    exams = [EXAMS[c] for c in ex]
    row = {
        "exams": exams, "subject": subj, "topic": topic, "subtopic": kw.get("sub"), "difficulty": DIFF[d],
        "question": stem.strip(), "passage": kw.get("passage"), "explanation": why.strip(),
        "sourceType": SRC[src], "sourceYear": kw.get("year"), "sourceReference": kw.get("ref"),
        "language": LANG[subj], "needsReview": bool(kw.get("review", subj in ("Urdu", "Sindhi"))),
        "classes": kw.get("cls"),
    }
    return row


def q(ex, subj, topic, d, stem, ok, bad, why, src="S", **kw):
    assert len(bad) == 3, (stem, "need three wrong options")
    row = _base(ex, subj, topic, d, stem, why, src, kw)
    if "chk" in kw:
        assert str(kw["chk"]) == str(ok), (stem, "answer check failed", kw["chk"], ok)
        row["checked"] = True
    row["fixed"] = False
    row["correctText"] = str(ok)
    row["wrongTexts"] = [str(b) for b in bad]
    return row


def qf(ex, subj, topic, d, stem, opts, ans, why, src="S", **kw):
    assert len(opts) == 4 and 0 <= ans < 4, (stem, "bad fixed options")
    row = _base(ex, subj, topic, d, stem, why, src, kw)
    if "chk" in kw:
        assert str(kw["chk"]) == str(opts[ans]), (stem, "answer check failed", kw["chk"], opts[ans])
        row["checked"] = True
    row["fixed"] = True
    row["options"] = [str(o) for o in opts]
    row["answer"] = ans
    return row


# A question shared between exams keeps the topic name of its first exam; the other exams' syllabus lists use
# slightly different names for the same area, so it is mapped here (only when the name is not in that exam's list).
ALIAS = {
    "English": {
        "Synonyms": "Synonyms and Antonyms", "Antonyms": "Synonyms and Antonyms", "Active and Passive Voice": "Voice",
        "Direct and Indirect Speech": "Narration", "Reading Comprehension": "Comprehension", "Parts of Speech": "Grammar",
        "Pronouns": "Grammar", "Adjectives": "Grammar", "Adverbs": "Grammar", "Literature Basics": "Comprehension",
        "Tenses": "Grammar", "Voice": "Grammar", "Narration": "Grammar", "Prepositions": "Grammar", "Articles": "Grammar",
        "Subject-Verb Agreement": "Grammar", "One-Word Substitution": "Vocabulary", "Sentence Completion": "Vocabulary",
        "Error Detection": "Sentence Correction", "Subject-Verb Agreement ": "Grammar",
    },
    "Mathematics": {
        "Basic Arithmetic": "Arithmetic", "Number Systems": "Arithmetic", "Factors and Multiples": "Arithmetic", "Fractions": "Arithmetic",
        "Decimals": "Arithmetic", "Percentages": "Arithmetic", "Ratio and Proportion": "Ratios", "Average": "Averages", "Simple Interest": "Interest",
        "Basic Algebra": "Algebra", "Data Handling": "Statistics", "Time and Work": "Arithmetic", "Time, Speed and Distance": "Arithmetic",
        "Profit and Loss": "Arithmetic", "Linear Equations": "Algebra", "Ratios": "Arithmetic", "Averages": "Arithmetic", "Interest": "Arithmetic",
        "Statistics": "Statistics and Probability", "Probability": "Statistics and Probability", "Sets and Relations": "Algebra",
    },
    "Science": {
        "Biology Basics": "Biology", "Human Body": "Human Biology", "Force and Motion": "Force", "Heat": "Physics", "Animals": "Biology",
        "Environment": "Ecology", "Human Biology": "Biology: Human Physiology", "Plants": "Plants",
    },
    "Computer": {
        "Hardware": "Hardware and Software", "Software": "Hardware and Software", "Input and Output Devices": "Computer Fundamentals",
        "Storage": "Computer Fundamentals", "Networking Basics": "Networking", "Digital Literacy": "Information Technology",
        "Cybersecurity Awareness": "Cybersecurity Basics", "Hardware and Software": "Computer Fundamentals", "Networking": "Networking",
    },
    "Social Studies": {
        "Pakistan Geography": "Geography", "History": "Pakistan History", "Provinces": "Geography", "Important Places": "Geography",
        "National Symbols": "Culture", "Constitution and Civics": "Constitution", "Independence Movement": "Pakistan History",
        "Geography of Sindh": "Sindh History and Geography", "Basic Current Affairs": "National Events",
        "Pakistan History": "History", "Geography": "Pakistan Geography", "Constitution": "Constitution and Civics", "Civics": "Constitution and Civics",
        "Sindh History and Geography": "Geography of Sindh", "National Events": "Basic Current Affairs", "Culture": "Culture",
        "Economy Basics": "Basic Current Affairs",
    },
    "Islamiat": {
        "Prophets": "Islamic Personalities", "Khulafa-e-Rashideen": "Khulafa", "Islamic Terminology": "Islamic Concepts",
        "Pillars of Islam": "Islamic Concepts", "Basic Beliefs": "Islamic Concepts", "Islamic Ethics": "Ethics and Social Principles",
        "Important Islamic Events": "Battles and Events", "Khulafa": "Khulafa-e-Rashideen", "Islamic Concepts": "Basic Beliefs",
        "Battles and Events": "Important Islamic Events", "Ethics and Social Principles": "Islamic Ethics", "Islamic Personalities": "Prophets",
        "Islamic Civilization": "Islamic History", "Jurisprudence Basics": "Islamic Concepts",
    },
    "Urdu": {
        "Synonyms": "Synonyms and Antonyms", "Antonyms": "Synonyms and Antonyms", "Sentence Structure": "Grammar", "Singular and Plural": "Grammar",
        "Masculine and Feminine": "Grammar", "Spelling": "Correct Usage", "Meaning": "Vocabulary", "Synonyms and Antonyms": "Synonyms",
        "Correct Usage": "Spelling", "Literature": "Vocabulary", "Sentence Correction": "Grammar", "Translation": "Meaning",
    },
}
ALIAS["Sindhi"] = ALIAS["Urdu"]


def map_topic(topic, subject, valid):
    """Topic name as it appears in an exam whose syllabus list is `valid`; None if it cannot be mapped."""
    if topic in valid:
        return topic
    t = ALIAS.get(subject, {}).get(topic)
    seen = set()
    while t is not None and t not in valid and t not in seen:
        seen.add(t)
        t = ALIAS.get(subject, {}).get(t)
    return t if t in valid else None
