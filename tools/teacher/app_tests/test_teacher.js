// Run: node transpile_teacher.js <outdir> && node test_teacher.js <outdir>
const out = process.argv[2];
const G = require(out + '/features/teacher-tests/generator.js');
const C = require(out + '/features/teacher-tests/config.js');
const T = require(out + '/features/teacher-tests/tests.js');
const R = require(out + '/features/teacher-tests/random.js');
const P = require(out + '/features/teacher-tests/practice.js');
const banks = { pst: require(out + '/features/teacher-tests/data/pst-bank.js').PST_BANK, jest: require(out + '/features/teacher-tests/data/jest-bank.js').JEST_BANK, jst: require(out + '/features/teacher-tests/data/jst-bank.js').JST_BANK };
let fail = 0; const ok = (n, c, d = '') => { console.log((c ? 'PASS ' : 'FAIL ') + n + (d ? '  ' + d : '')); if (!c) fail++; };
for (const ex of ['pst', 'jest', 'jst']) {
  const cfg = C.teacherExamConfig[ex], bank = banks[ex];
  const mocks = G.planMocks(cfg, bank, cfg.mock.mockCount);
  const byId = new Map(bank.map(q => [q.id, q]));
  ok(ex + ' bank ids unique', new Set(bank.map(q => q.id)).size === bank.length);
  mocks.forEach(m => {
    ok(`${ex} mock${m.index} has ${cfg.mock.questions} questions`, m.questionIds.length === cfg.mock.questions, m.warnings.join('; '));
    ok(`${ex} mock${m.index} no duplicate ids`, new Set(m.questionIds).size === m.questionIds.length);
    cfg.mock.sections.forEach((s, i) => ok(`${ex} mock${m.index} ${s.code} = ${s.count}`, m.sections[i].ids.length === s.count));
    const qs = m.questionIds.map(i => byId.get(i));
    ok(`${ex} mock${m.index} correct language per section`, m.sections.every((s, i) => { const subj = G.resolveSectionSubject(cfg.mock.sections[i], cfg); return s.ids.every(id => byId.get(id).subject === subj); }));
    const d = {}; qs.forEach(q => d[q.difficulty] = (d[q.difficulty] || 0) + 1);
    console.log('   difficulty', JSON.stringify(d), ' source', JSON.stringify(G.sourceCounts(qs)));
  });
  for (let i = 1; i < mocks.length; i++) { const a = new Set(mocks[i - 1].questionIds); const rep = mocks[i].questionIds.filter(x => a.has(x)).length; ok(`${ex} mock${i}->mock${i + 1} repeated questions`, rep === 0, 'repeats=' + rep); }
  const all = mocks.flatMap(m => m.questionIds); const uniq = new Set(all).size; console.log(`   ${ex}: ${all.length} slots, ${uniq} distinct questions across ${mocks.length} mocks`);
  const again = G.planMocks(cfg, bank, 3); ok(ex + ' deterministic mocks', JSON.stringify(again.map(m => m.questionIds)) === JSON.stringify(mocks.slice(0, 3).map(m => m.questionIds)));
  const test = T.buildMockTest(cfg, mocks[0]); const rq = T.toRunnerQuestions(test, cfg, bank);
  ok(ex + ' runner questions = ' + cfg.mock.questions, rq.length === cfg.mock.questions);
  let bad = 0, moved = 0; const L = { A: 0, B: 0, C: 0, D: 0 };
  rq.forEach(r => { const q = byId.get(r.id); if (r.options[r.correctAnswer] !== q.options[q.correctAnswer]) bad++; if (r.options.A !== q.options[0]) moved++; L[r.correctAnswer]++; if (new Set(Object.values(r.options)).size !== 4) bad++; });
  ok(ex + ' correct answer preserved after option shuffle', bad === 0, `moved ${moved}/${rq.length}, letters ${JSON.stringify(L)}`);
  const sec = test.sections.reduce((a, s) => a + s.count, 0); ok(ex + ' sections sum to total', sec === test.totalQuestions);
  ok(ex + ' no pass mark when unknown', test.passMarks === 0);
  ok(ex + ' fixedOrder respected', bank.filter(q => q.fixedOrder).every(q => { const a = T.arrangeOptions(q, 'x', true); return a.order.join() === '0,1,2,3'; }));
  const specs = [{ mode: 'mixed', count: 20 }, { mode: 'subject', subject: 'English', count: 15 }, { mode: 'difficulty', difficulty: 'difficult', count: 10 }, { mode: 'past-paper', count: 10 }, { mode: 'topic', subject: 'Mathematics', topic: ex === 'pst' ? 'Fractions' : 'Arithmetic', count: 5 }];
  for (const s of specs) { const sel = P.selectPractice(cfg, bank, s, {}, 'seed1'); ok(`${ex} practice ${s.mode}`, s.mode === 'past-paper' ? sel.length === 0 : (sel.length > 0 && sel.length <= s.count && new Set(sel.map(q => q.id)).size === sel.length), 'n=' + sel.length); }
}
ok('apportion sums', R.apportion(20, [0.3, 0.5, 0.2]).reduce((a, b) => a + b) === 20 && R.apportion(45, [1, 1, 1]).join() === '15,15,15');
const jst = C.teacherExamConfig.jst; const jm = G.planMocks(jst, banks.jst, 1)[0]; const jb = new Map(banks.jst.map(q => [q.id, q]));
const br = {}; jm.sections.find(s => s.code === 'SCI').ids.forEach(id => { const b = jb.get(id).topic.split(':')[0]; br[b] = (br[b] || 0) + 1; });
ok('JST science 15/15/15 by branch', br.Physics === 15 && br.Chemistry === 15 && br.Biology === 15, JSON.stringify(br));
process.exit(fail ? 1 : 0);
