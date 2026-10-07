"""Helpers for Mock 2+ modules. Same schema as helpers.q plus an optional yieldNote."""
VP="Verified Past Paper"; EQB="Existing Question Bank"; GP="Generated Practice"

def q(subj, topic, diff, src, year, also, stem, opts, ans, expl, yn="", note="", passage=None, verif=None):
    assert len(opts) == 4 and ans in "ABCD", stem
    assert len(set(opts)) == 4, ("duplicate options", stem)
    assert diff in ("Easy", "Moderate", "Difficult"), stem
    assert src in (VP, EQB, GP), stem
    if src == GP:
        assert year is None, ("generated items carry no source year", stem)
    return dict(subject=subj, topic=topic, difficulty=diff, sourceType=src, sourceYear=year, alsoIn=also,
                question=stem, passage=passage, options=dict(zip("ABCD", opts)), correctAnswer=ans,
                explanation=expl, sourceNote=note, verifiedNote=verif, yieldNote=yn)
