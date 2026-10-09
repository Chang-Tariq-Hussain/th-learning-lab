import json, random, re, os
import data_is_ur, data_en, data_ga, data_gk
OUT="/mnt/user-data/outputs/mpt"; os.makedirs(OUT,exist_ok=True)
SECTIONS=[("Islamic Studies","IS",20),("Urdu","UR",20),("English","EN",50),("General Abilities","GA",60),("GK / Current Affairs / Pakistan Affairs","GK",50)]
allq=data_is_ur.items+data_en.items+data_ga.items+data_gk.items

def find(sub):
    m=[i for i in allq if sub in i['question'] or any(sub in v for v in i['options'].values())]
    assert len(m)==1,(sub,len(m)); return m[0]
# honest difficulty re-tags (reflect actual solving difficulty)
for s in ["A new number is added to the series 3, 4, 4","Ali was 40 years old","Evaluate: 4^(1/2)","Pearl Tower is taller","Which country won the 2026 FIFA","Which team won the ICC Men's T20 World Cup 2026","In September 2025 Pakistan signed","COP30, the UN climate","Neither of the boys"]: find(s)['difficulty']="Easy"
for s in ["Antonym of Cajole","When someone declares his wife","How many members of the National Assembly","What was the real name of the Holy Prophet's (SAW) uncle","Which is the oldest barrage","The third most common gas"]: find(s)['difficulty']="Difficult"
# CA verification notes
for s,n in [("COP30, the UN climate","Generated for this mock. Fact checked by web search on 5 Oct 2026 (COP30 held in Belém, Brazil, 10-21 Nov 2025)."),("Pakistan's current term as a non-permanent member","Generated for this mock. Fact checked by web search on 5 Oct 2026 (elected June 2024, term 1 Jan 2025 - 31 Dec 2026).")]: find(s)['sourceNote']=n
find("Choose the sentence that is grammatically correct.\n" if False else "Walking down the street, I noticed")  if False else None
d=[i for i in allq if i['question']=="Choose the sentence that is grammatically correct." and "Walking down the street, I noticed the trees swaying in the wind." in i['options'].values()][0]
d['explanation']="The opening participle phrase must modify the person walking. Only 'Walking down the street, I noticed the trees swaying in the wind.' has 'I' as its subject; the other three leave the modifier dangling."
# --- balance answer letters on eligible items
def eligible(it):
    vals=list(it['options'].values())
    if any(re.search(r'\d',v) for v in vals): return False
    if any(re.search(r'None of|Both|All of|Neither|Only \(|no article|ان میں سے',v,re.I) for v in vals): return False
    if all(re.fullmatch(r'[ivx, ]+',v) for v in vals): return False
    return True
rng=random.Random(2026)
fixed=[i for i in allq if not eligible(i)]; elig=[i for i in allq if eligible(i)]
cnt={l:sum(1 for i in fixed if i['correctAnswer']==l) for l in "ABCD"}
rng.shuffle(elig); total=len(allq)
for it in elig:
    tgt=min("ABCD",key=lambda l:(cnt[l]+rng.random()*0.1))
    correct=it['options'][it['correctAnswer']]; others=[v for k,v in it['options'].items() if k!=it['correctAnswer']]; rng.shuffle(others)
    new=[]; 
    for l in "ABCD": new.append(correct if l==tgt else others.pop())
    it['options']=dict(zip("ABCD",new)); it['correctAnswer']=tgt; cnt[tgt]+=1; it['optionsReordered']=True
for i in allq: i.setdefault('optionsReordered',False)
for i in allq:
    assert not re.search(r'\([A-D]\)|option ',i['explanation']) or not i['optionsReordered'], i['question'][:50]
# ids & metadata
code={s:c for s,c,_ in SECTIONS}; ctr={}
for n,i in enumerate(allq,1):
    c=code[i['subject']]; ctr[c]=ctr.get(c,0)+1
    i['id']=f"{c}-{ctr[c]:03d}"; i['subjectCode']=c; i['mockNumber']={'mock1':n}
    i['usedInMocks']=["mock1"]; i['verified']=True
    if i['sourceType']=="Verified Past Paper": i['verifiedNote']="Appears in an uploaded third-party reproduction of the FPSC paper; answer independently re-checked. FPSC does not release booklets, so this is not an official copy."
    elif i['sourceType']=="Existing Question Bank": i['verifiedNote']="From the 2026 file but prepared by cssaspirants.pk (not an original FPSC item); answer checked by me; native-speaker review recommended."
    elif i['subjectCode']=="GA": i['verifiedNote']="Generated; answer re-computed in verify_math.py."
    elif i['subjectCode']=="UR": i['verifiedNote']="Generated; answer checked by me; native-speaker review recommended."
    else: i['verifiedNote']=i['sourceNote'] or "Generated; answer checked."
    if i['sourceType']!="Verified Past Paper": i['sourceYear']=i['sourceYear'] if i['sourceType']=="Existing Question Bank" else None
order=['id','subject','subjectCode','topic','difficulty','question','passage','options','correctAnswer','explanation','sourceType','sourceYear','alsoIn','sourceNote','verified','verifiedNote','optionsReordered','usedInMocks','mockNumber']
bank=[{k:i[k] for k in order} for i in allq]
json.dump(bank,open(f"{OUT}/mpt_question_bank.json","w"),ensure_ascii=False,indent=1)
mock=dict(id="mock1",title="CSS MPT Mock Test 1",totalQuestions=200,timeMinutes=200,passMarks=66,negativeMarking=False,
  sections=[dict(subject=s,code=c,count=n) for s,c,n in SECTIONS],questionIds=[i['id'] for i in bank])
json.dump(mock,open(f"{OUT}/mock1.json","w"),ensure_ascii=False,indent=1)
ts="""// Auto-generated by build_mpt.py - do not edit by hand.
export type MptSourceType = "Verified Past Paper" | "Existing Question Bank" | "Generated Practice";
export type MptDifficulty = "Easy" | "Moderate" | "Difficult";
export interface MptQuestion {
  id: string; subject: string; subjectCode: "IS"|"UR"|"EN"|"GA"|"GK"; topic: string; difficulty: MptDifficulty;
  question: string; passage: string | null; options: Record<"A"|"B"|"C"|"D", string>; correctAnswer: "A"|"B"|"C"|"D";
  explanation: string; sourceType: MptSourceType; sourceYear: number | null; alsoIn: number[]; sourceNote: string;
  verified: boolean; verifiedNote: string; optionsReordered: boolean; usedInMocks: string[]; mockNumber: Record<string, number>;
}
export interface MptMockDefinition { id: string; title: string; totalQuestions: number; timeMinutes: number; passMarks: number; negativeMarking: boolean; sections: {subject:string;code:string;count:number}[]; questionIds: string[]; }
export const MPT_QUESTION_BANK: MptQuestion[] = """+json.dumps(bank,ensure_ascii=False,indent=1)+""";
export const MPT_MOCK_1: MptMockDefinition = """+json.dumps(mock,ensure_ascii=False,indent=1)+""";
"""
open(f"{OUT}/mpt-mock-data.ts","w").write(ts)
# paper + key
P=["# CSS MPT MOCK TEST 1\n","**Total Questions: 200 | Time: 200 minutes | Passing marks: 66 / 200 | No negative marking**\n"]
K=["# CSS MPT Mock Test 1 - Answer Key & Explanations\n"]
seen=None; n=0
for s,c,cnt in SECTIONS:
    P.append(f"\n## {s.upper()} ({cnt} questions)\n"); K.append(f"\n## {s}\n")
    for i in [b for b in bank if b['subjectCode']==c]:
        n+=1
        if i['passage'] and i['passage']!=seen: P.append(f"\n> **Passage:** {i['passage']}\n"); seen=i['passage']
        q=i['question'].replace("\n","  \n")
        P.append(f"\n**{n}.** {q}\n"+"".join(f"- {l}. {v}\n" for l,v in i['options'].items()))
        src=i['sourceType']+(f" {i['sourceYear']}" if i['sourceYear'] else "")
        K.append(f"\n**{n}. [{i['id']}] Answer: {i['correctAnswer']}** - {i['explanation']}  \n*{i['topic']} | {i['difficulty']} | {src}*\n")
open(f"{OUT}/mock1_paper.md","w").write("\n".join(P)); open(f"{OUT}/mock1_answer_key.md","w").write("\n".join(K))
print("built",len(bank))
