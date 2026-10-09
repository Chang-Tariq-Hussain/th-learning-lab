VP="Verified Past Paper"; EQB="Existing Question Bank"; GP="Generated Practice"
def q(subj,topic,diff,src,year,also,stem,opts,ans,expl,note="",passage=None,verif=None):
    assert len(opts)==4 and ans in "ABCD", stem
    return dict(subject=subj,topic=topic,difficulty=diff,sourceType=src,sourceYear=year,alsoIn=also,
                question=stem,passage=passage,options=dict(zip("ABCD",opts)),correctAnswer=ans,
                explanation=expl,sourceNote=note,verifiedNote=verif)
