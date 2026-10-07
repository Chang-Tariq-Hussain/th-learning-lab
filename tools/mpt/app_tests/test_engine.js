const E=require('./out/features/mpt-mock/engine.js'),T=require('./out/features/mpt-mock/test-defs.js'),St=require('./out/features/mpt-mock/storage.js');
let fail=0;const ok=(n,c,d='')=>{console.log((c?'PASS':'FAIL'),n,d);if(!c)fail++};
const m1=E.getMockById('mock1'),m2=E.getMockById('mock2');
for(const m of [m1,m2]){
 const qs=E.getMockQuestions(m);ok(m.id+' 200 questions',qs.length===200);
 ok(m.id+' time 200min',m.durationMinutes===200||m.timeMinutes===200,JSON.stringify(Object.keys(m)));
 const mk=n=>{const a={};qs.forEach((q,i)=>{if(i<n)a[q.id]=q.correctAnswer;else a[q.id]=['A','B','C','D'].find(l=>l!==q.correctAnswer)});return a};
 let r=E.gradeMock(m,qs,mk(65));ok(m.id+' 65/200 fails',r.score===65&&!r.passed&&r.passMarks===66);
 r=E.gradeMock(m,qs,mk(66));ok(m.id+' 66/200 passes',r.score===66&&r.passed);
 ok(m.id+' section totals sum 200',r.sections.reduce((a,s)=>a+s.total,0)===200,r.sections.map(s=>s.code+':'+s.total).join(','));
 ok(m.id+' c+i+u=200',r.correct+r.incorrect+r.unanswered===200);
 r=E.gradeMock(m,qs,{});ok(m.id+' blank all unanswered',r.unanswered===200&&r.score===0);
 const secs=T.getSectionTests(m);const pm=secs.map(s=>s.passMarks);
 ok(m.id+' section pass marks',JSON.stringify(pm)==='[7,7,17,20,17]',JSON.stringify(pm));
 ok(m.id+' section times = counts',secs.every(s=>(s.durationMinutes??s.timeMinutes)===s.questionIds.length));
 // section analysis only own section
 for(const s of secs){const sq=E.getMockQuestions(s);const rr=E.gradeMock(s,sq,{});ok(m.id+' '+s.id+' own section only',rr.total===sq.length&&rr.sections.length===1&&rr.sections.every(x=>x.total===sq.length)&&rr.weakAreas.every(w=>w.subject===s.sections[0].subject));}
 ok(m.id+' getTestById section',E.getTestById(m.id+'-GA')?.kind==='section'&&E.getTestById(m.id)?.kind==='full'&&E.getTestById(m.id+'-XX')===null);
}
ok('clock 12000s = 03:20:00',E.formatClock(12000)==='03:20:00');
ok('clock 0',E.formatClock(-5)==='00:00:00');
ok('getTestById unknown',E.getTestById('mock9')===null&&E.getTestById('mock1-IS-x')===null);
// storage with simulated localStorage
const mem={};global.window={localStorage:{getItem:k=>k in mem?mem[k]:null,setItem:(k,v)=>{mem[k]=String(v)},removeItem:k=>{delete mem[k]}}};global.localStorage=window.localStorage;
const now=Date.now();
mem['th-mpt-mock-session-v1']=JSON.stringify({mockId:'mock1',startedAt:now-1000,endsAt:now+12000000-1000,answers:{},flagged:[],currentIndex:0,submitted:false});
console.log('legacy session keys test, raw:',Object.keys(mem));
const s=St.loadSession('mock1');console.log('migrated:',!!s, s&&Object.keys(s).join(','));
console.log('mock1 key after:',Object.keys(mem));

process.exit(fail?1:0);
