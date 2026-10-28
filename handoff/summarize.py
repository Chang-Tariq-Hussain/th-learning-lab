import json,sys,collections
ph=sys.argv[1]
rows=[json.loads(l) for l in open(f"results-{ph}.jsonl")]
VPS=["320x640","375x700","430x900","768x1024","1024x768","1280x800","1440x900","1366x680","844x390"]
by=collections.OrderedDict()
for r in rows: by.setdefault(r["slug"],{})[r["vp"]]=r
def cell(r):
    if r.get("error") or not r.get("stageFound"): return "ERR"
    a="Y" if r["a_stageVisibleWithCtrl"] else "n"
    b="Y" if r["b_stageVisibleAfterStart"] else "n"
    return a+b+("!" if r.get("clickErr") else "")+("*" if r.get("docOverflowPx",0)>0 else "")
print("sim".ljust(30)+" ".join(v.rjust(8) for v in VPS))
for s,d in by.items():
    print(s.ljust(30)+" ".join(cell(d[v]).rjust(8) if v in d else "-".rjust(8) for v in VPS))
print("\n(a)(b): Y=stage fully visible with control / after Start; ! click failed; * page h-overflow")
tot=sum(1 for r in rows if r.get("stageFound")); good=sum(1 for r in rows if r.get("b_stageVisibleAfterStart"))
print("cases",len(rows),"stage found",tot,"visible after Start",good)
print("stage taller than viewport:",[ (r['slug'],r['vp']) for r in rows if r.get('stageTallerThanVp')][:20])
ov=[(r['slug'],r['vp'],r['d_overlaps']) for r in rows if r.get('d_overlaps')]
print("overlap/clip flags:",len(ov)); [print(" ",o) for o in ov[:12]]
