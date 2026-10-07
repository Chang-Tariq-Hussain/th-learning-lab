const St=require('./out/features/mpt-mock/storage.js');let fail=0;const ok=(n,c)=>{console.log(c?'PASS':'FAIL',n);if(!c)fail++};
const mem={};global.window={localStorage:{getItem:k=>k in mem?mem[k]:null,setItem:(k,v)=>{mem[k]=String(v)},removeItem:k=>{delete mem[k]}}};
const now=Date.now();
const legacy={mockId:'mock1',startedAt:now-1000,endsAt:now+12e6,answers:{'IS-001':'A'},marked:{'IS-002':true},current:3,submittedAt:null,autoSubmitted:false};
mem['th-mpt-mock-session-v1']=JSON.stringify(legacy);
let s=St.loadSession('mock1');
ok('legacy migrated, endsAt preserved',!!s&&s.endsAt===legacy.endsAt&&s.answers['IS-001']==='A'&&s.current===3);
ok('new key written, legacy removed',!!mem['th-mpt-session-v2:mock1']&&!('th-mpt-mock-session-v1' in mem));
ok('mock2 unaffected',St.loadSession('mock2')===null);
// legacy must not overwrite an existing v2 session
mem['th-mpt-mock-session-v1']=JSON.stringify({...legacy,current:9});
s=St.loadSession('mock1');ok('v2 wins over legacy',s.current===3);
// corrupt json
mem['th-mpt-session-v2:mock1-IS']='{bad';ok('corrupt -> null',St.loadSession('mock1-IS')===null);
// mismatched id
mem['th-mpt-session-v2:mock2']=JSON.stringify({...legacy,mockId:'mock1'});ok('id mismatch -> null',St.loadSession('mock2')===null);
// history
const rec=(st,sc)=>({startedAt:st,finishedAt:st+10,score:sc,total:200,passMarks:66,passed:sc>=66,timeUsedSeconds:5,autoSubmitted:false});
St.recordAttempt('mock1',rec(1,50));St.recordAttempt('mock1',rec(1,50));St.recordAttempt('mock1',rec(2,70));
let h=St.loadHistory('mock1');ok('dedupe by startedAt',h.length===2&&h[0].startedAt===2);
ok('best attempt',St.bestAttempt(h).score===70);
for(let i=10;i<50;i++)St.recordAttempt('mock1',rec(i,i));ok('capped at 25',St.loadHistory('mock1').length===25);
// storage throwing
global.window={localStorage:{getItem(){throw new Error('x')},setItem(){throw new Error('x')},removeItem(){throw new Error('x')}}};
ok('throwing storage safe',St.loadSession('mock1')===null&&St.loadHistory('mock1').length===0);St.saveSession(legacy);St.recordAttempt('mock1',rec(1,1));St.clearSession('mock1');ok('no throw on save/clear',true);
process.exit(fail?1:0);
