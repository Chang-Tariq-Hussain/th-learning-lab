/**
 * Verifies the Mitosis lab's model: the plan, the animation geometry (chromatid counts, sister cohesion until
 * anaphase, one copy of every chromosome to each daughter, nothing drawn outside its cell), the count table
 * re-derived from that geometry, and the activity logic.
 * Run with `npm run verify:mitosis`. Exits non-zero if any check fails.
 */
import { BEAT_COUNT, BEAT_STAGE, CX, CY, STAGE_FIRST_BEAT, STAGE_LAST_BEAT, buildBeats, chIndex, sceneAt } from "../src/features/subjects/biology/mitosis/engine/beats";
import { COUNT_ROWS, beatCounts, rowCounts, stageCounts } from "../src/features/subjects/biology/mitosis/engine/counts";
import { PAIR_COUNTS, allChromatids, chromatidKey, daughterOf, makePlan, sideOf } from "../src/features/subjects/biology/mitosis/engine/plan";
import { chromatidPoints, toGlobal, widthOf } from "../src/features/subjects/biology/mitosis/engine/shapes";
import { buildLabels } from "../src/features/subjects/biology/mitosis/engine/labels";
import { BEATS, STAGES, structuresAt } from "../src/features/subjects/biology/mitosis/data/stages";
import {
  CHALLENGE_BANK,
  PREDICT_EVENTS,
  arrangeReducer,
  buildIdentifyQuestions,
  challengeReducer,
  checkPick,
  newArrange,
  newChallengeRound,
  questionsFor,
} from "../src/features/subjects/biology/mitosis/activities/model";
import { cellContents } from "../src/features/subjects/biology/mitosis/engine/cells";

let failures = 0;
function check(name: string, ok: boolean, detail = ""): void {
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : `  (${detail})`}`);
}

check("seven stages and fifteen beats", STAGES.length === 7 && BEATS.length === BEAT_COUNT && BEAT_STAGE.length === BEAT_COUNT);
check("beat to stage map matches stage first/last beats", STAGES.every((_, s) => BEAT_STAGE[STAGE_FIRST_BEAT[s]!] === s && BEAT_STAGE[STAGE_LAST_BEAT[s]!] === s));
check("beat captions agree with the beat to stage map", BEATS.every((b, i) => b.stage === BEAT_STAGE[i]));
check("stage order is the biological sequence", STAGES.map((s) => s.id).join() === "interphase,prophase,prometaphase,metaphase,anaphase,telophase,cytokinesis");
check("interphase is before mitosis and cytokinesis is separate", STAGES[0]!.phase === "prep" && STAGES[6]!.phase === "C" && STAGES.slice(1, 6).every((s) => s.phase === "M"));

const dist = (a: [number, number], b: [number, number]) => Math.hypot(a[0] - b[0], a[1] - b[1]);

for (const plant of [false, true]) {
  for (const pairs of PAIR_COUNTS) {
    const bad: Record<string, string[]> = { plan: [], seq: [], outside: [], counts: [], cells: [] };
    for (let seed = 1; seed <= 25; seed++) {
      const plan = makePlan(pairs, plant, seed);
      const ids = allChromatids(plan);
      const n = 2 * pairs;
      const tag = `${plant ? "plant" : "animal"}/p${pairs}/s${seed}`;
      if (plan.n !== n || plan.leftSister.length !== n) bad.plan!.push(`${tag}: plan size`);
      if (new Set(plan.slot).size !== n || Math.max(...plan.slot) !== n - 1) bad.plan!.push(`${tag}: slots are not a permutation`);
      for (let k = 0; k < n; k++) {
        const d = ([0, 1] as const).map((s) => daughterOf(plan, { k, s }));
        if (d[0] === d[1]) bad.cells!.push(`${tag}: chromosome ${k} sisters go to the same daughter`);
      }
      const beats = buildBeats(plan);
      if (beats.length !== BEAT_COUNT) {
        bad.seq!.push(`${tag}: ${beats.length} beats`);
        continue;
      }
      for (let b = 0; b < BEAT_COUNT; b++) if (sceneAt(beats, b) !== beats[b]) bad.seq!.push(`${tag}: sceneAt(${b}) is not the keyframe`);

      for (let b = 0; b < BEAT_COUNT; b++) {
        const st = beats[b]!;
        const visible = ids.filter((id) => st.ch[chIndex(id)]!.op > 0.5);
        const expect = b === 0 ? n : 2 * n;
        if (visible.length !== expect) bad.seq!.push(`${tag}: beat ${b} shows ${visible.length} chromatids, expected ${expect}`);

        // chromatid end points lie inside the cell(s)
        const s = st.s;
        const p = plant ? 4 : 2;
        const gap = plant ? 4 : 18;
        const inCell = (x: number, y: number): boolean => {
          const test = (cx: number, rx: number, e: number) => Math.pow(Math.abs(x - cx) / (rx * 1.02), e) + Math.pow(Math.abs(y - CY) / (s.b * 1.02), e) <= 1;
          if (s.sep > 0.5) return [-1, 1].some((side) => test(CX + side * (s.a / 2 + gap), s.a / 2, p));
          return test(CX, s.a, p);
        };
        for (const id of visible) {
          const ch = st.ch[chIndex(id)]!;
          const pts = chromatidPoints(plan, id, ch);
          for (const q of [pts[0]!, pts[pts.length - 1]!, pts[Math.floor(pts.length / 2)]!]) {
            // loose chromatin wiggles a few units; allow it, and ignore the slightly blurred middle of a half-done interpolation
            const [x, y] = toGlobal(q, ch);
            if (!inCell(x, y)) bad.outside!.push(`${tag} beat ${b} ${chromatidKey(id)} at (${x.toFixed(0)}, ${y.toFixed(0)})`);
          }
        }
        // the parent nucleus holds everything until its envelope breaks
        if (b <= 2) {
          for (const id of visible) {
            const ch = st.ch[chIndex(id)]!;
            const dx = (ch.x - CX) / s.nrx;
            const dy = (ch.y - CY) / s.nry;
            if (dx * dx + dy * dy > 1) bad.outside!.push(`${tag} beat ${b} centromere of ${chromatidKey(id)} is outside the nucleus`);
          }
        }
      }

      const centromereDist = (b: number, k: number) => {
        const a = beats[b]!.ch[chIndex({ k, s: 0 })]!;
        const c = beats[b]!.ch[chIndex({ k, s: 1 })]!;
        return dist([a.x, a.y], [c.x, c.y]);
      };
      // sister chromatids: joined through metaphase, separated from late anaphase on
      for (const b of [1, 2, 3, 4, 5, 6, 7]) for (let k = 0; k < n; k++) if (centromereDist(b, k) > widthOf(1) + 3) bad.seq!.push(`${tag}: beat ${b} sisters of chromosome ${k} are ${centromereDist(b, k).toFixed(0)} apart (should stay joined)`);
      for (const b of [9, 10, 11, 12, 13, 14]) for (let k = 0; k < n; k++) if (centromereDist(b, k) < 120) bad.seq!.push(`${tag}: beat ${b} sisters of chromosome ${k} are not separated`);
      // anaphase onward: each chromosome has one chromatid at each pole, on the side it was pulled to
      for (const b of [9, 10, 11, 12, 13, 14]) {
        for (const id of ids) {
          const ch = beats[b]!.ch[chIndex(id)]!;
          const side = sideOf(plan, id);
          if (side === -1 ? ch.x >= CX : ch.x <= CX) bad.cells!.push(`${tag}: beat ${b} ${chromatidKey(id)} is on the wrong side`);
        }
      }
      // all chromosomes on the plate at metaphase
      for (const b of [6, 7]) for (const id of ids) if (Math.abs(beats[b]!.ch[chIndex(id)]!.x - CX) > 30) bad.seq!.push(`${tag}: beat ${b} ${chromatidKey(id)} is off the plate`);
      // chromosomes stay individual on the plate: no two centromere rows closer than a chromatid width in the same column
      for (let b of [6, 7]) {
        const rows = ids.filter((i) => i.s === 0).map((i) => beats[b]!.ch[chIndex(i)]!);
        for (let i = 0; i < rows.length; i++) for (let j = i + 1; j < rows.length; j++) if (Math.hypot(rows[i]!.x - rows[j]!.x, rows[i]!.y - rows[j]!.y) < widthOf(1) * 1.5) bad.seq!.push(`${tag}: beat ${b} chromosomes overlap on the plate`);
        b = b;
      }
      // furrow only in animal cells, cell plate only in plant cells
      const last = beats[BEAT_COUNT - 1]!.s;
      if (plant && last.fur !== 0) bad.seq!.push(`${tag}: plant cell has a furrow`);
      if (!plant && last.fur !== 1) bad.seq!.push(`${tag}: animal cell has no furrow`);
      if (last.sep !== 1 || beats[12]!.s.sep !== 0) bad.seq!.push(`${tag}: daughters must separate only at the very end`);

      // counts: derive from geometry and compare with the table
      COUNT_ROWS.forEach((row, ri) => {
        const st = beats[row.beat]!;
        const cells = st.s.sep > 0.5 ? 2 : 1;
        const exp = rowCounts(ri, pairs);
        if (cells !== exp.cells) bad.counts!.push(`${tag} ${row.id}: ${cells} cells, table ${exp.cells}`);
        for (let c = 0; c < cells; c++) {
          const members = ids.filter((id) => st.ch[chIndex(id)]!.op > 0.5 && (cells === 1 || (st.ch[chIndex(id)]!.x < CX ? 0 : 1) === c));
          const seen = new Set<string>();
          let chromosomes = 0;
          for (const id of members) {
            const key = chromatidKey(id);
            if (seen.has(key)) continue;
            seen.add(key);
            const sis = members.find((m) => m.k === id.k && m.s !== id.s);
            const a = st.ch[chIndex(id)]!;
            if (sis) {
              const b2 = st.ch[chIndex(sis)]!;
              if (dist([a.x, a.y], [b2.x, b2.y]) <= widthOf(1) + 3) seen.add(chromatidKey(sis));
            }
            chromosomes++;
          }
          if (chromosomes !== exp.chromosomes) bad.counts!.push(`${tag} ${row.id} cell ${c}: ${chromosomes} chromosomes from geometry, table ${exp.chromosomes}`);
          if (members.length !== exp.chromatids) bad.counts!.push(`${tag} ${row.id} cell ${c}: ${members.length} chromatids, table ${exp.chromatids}`);
          if (members.length / pairs !== exp.dnaC) bad.counts!.push(`${tag} ${row.id}: DNA ${members.length / pairs}C from geometry, table ${exp.dnaC}C`);
        }
      });
      // the counting lab draws the same thing as the table says
      COUNT_ROWS.forEach((row, ri) => {
        const exp = rowCounts(ri, pairs);
        const cells = cellContents(plan, ri);
        const perCell = cells.map((c) => c.groups.reduce((t, g) => t + g.length, 0));
        const chromatidsPerCell = cells.map((c) => c.groups.reduce((t, g) => t + g.reduce((u, gl) => u + gl.sisters.length, 0), 0));
        if (cells.length !== exp.cells) bad.counts!.push(`${tag} lab ${row.id}: ${cells.length} cells drawn`);
        if (!perCell.every((v) => v === exp.chromosomes) && !(row.id === "anaphase" || row.id === "telophase")) bad.counts!.push(`${tag} lab ${row.id}: glyph count ${perCell.join()} vs ${exp.chromosomes}`);
        if (!chromatidsPerCell.every((v) => v === exp.chromatids)) bad.counts!.push(`${tag} lab ${row.id}: chromatids ${chromatidsPerCell.join()} vs ${exp.chromatids}`);
      });
      // labels always have an anchor inside the picture
      for (let b = 0; b < BEAT_COUNT; b++) for (const l of buildLabels(plan, beats[b]!, b)) if (!Number.isFinite(l.ax) || !Number.isFinite(l.ay)) bad.seq!.push(`${tag}: label ${l.id} at beat ${b} has no anchor`);
    }
    for (const [group, list] of Object.entries(bad)) check(`${plant ? "plant" : "animal"} 2n=${2 * pairs}: ${group}`, list.length === 0, list.slice(0, 3).join("; "));
  }
}

// table sanity
for (const p of PAIR_COUNTS) {
  const n = 2 * p;
  const g1 = rowCounts(0, p);
  const g2 = rowCounts(1, p);
  const meta = stageCounts(3, p);
  const ana = stageCounts(4, p);
  const fin = stageCounts(6, p);
  check(`2n=${n}: replication doubles DNA and chromatids but not chromosomes`, g1.chromosomes === n && g2.chromosomes === n && g2.dnaC === 2 * g1.dnaC && g2.chromatids === 2 * g1.chromatids);
  check(`2n=${n}: metaphase has ${n} chromosomes of two chromatids`, meta.chromosomes === n && meta.chromatids === 2 * n && meta.chromatidsPerChromosome === 2);
  check(`2n=${n}: anaphase momentarily has ${2 * n} chromosomes in the cell`, ana.chromosomes === 2 * n && ana.transient === true && ana.cells === 1);
  check(`2n=${n}: two daughters with ${n} chromosomes each, 2C`, fin.cells === 2 && fin.chromosomes === n && fin.chromatids === n && fin.dnaC === 2);
  check(`2n=${n}: beatCounts is monotone with the rows`, [0, 1, 3, 5, 7, 9, 11, 14].every((b, i) => beatCounts(b, p).chromosomes === rowCounts(i, p).chromosomes));
}
check("structures: furrow in animal cells only, cell plate in plant cells only", structuresAt(13, false).some((s) => s.id === "furrow") && !structuresAt(13, false).some((s) => s.id === "cellplate") && structuresAt(13, true).some((s) => s.id === "cellplate") && !structuresAt(13, true).some((s) => s.id === "centrosome"));

// activities
const ids = PREDICT_EVENTS.map((e) => e.id);
check("predict: unique ids, beats inside the animation, correct option present", new Set(ids).size === ids.length && PREDICT_EVENTS.every((e) => e.beat >= 1 && e.beat < BEAT_COUNT && e.options.some((o) => o.id === e.correct) && e.options.length === 4));
check("predict: events are in beat order", PREDICT_EVENTS.every((e, i) => i === 0 || PREDICT_EVENTS[i - 1]!.beat < e.beat));
const plan = makePlan(3);
const idq = buildIdentifyQuestions(plan);
check("identify: questions in range with a correct name option", idq.every((q) => q.beat >= 0 && q.beat < BEAT_COUNT && (q.kind !== "name" || q.options.some((o) => o.id === q.correct))));
check("identify: plant cells drop the centrosome question and rename the furrow one", questionsFor(makePlan(3, true)).every((q) => !(q.kind === "structure" && q.target === "centrosome")) && questionsFor(makePlan(3, true)).length === idq.length - 1);
const sis = idq.find((q) => q.kind === "sister")!;
if (sis.kind === "sister") {
  const [k, s] = sis.correct.split("-").map(Number) as [number, 0 | 1];
  check("identify: the sister chromatid is accepted, the glowing one and others are not", checkPick(sis, { kind: "chromatid", k, s }, false).ok && !checkPick(sis, { kind: "chromatid", k: 1, s: 0 }, false).ok && !checkPick(sis, { kind: "structure", id: "plate" }, false).ok);
}
const cent = idq.find((q) => q.kind === "structure" && q.target === "centromere")!;
check("identify: a structure pick is judged by structure id", checkPick(cent, { kind: "structure", id: "centromere" }, false).ok && !checkPick(cent, { kind: "structure", id: "kinetochore" }, false).ok && !checkPick(cent, { kind: "fiber" }, false).ok);
const names = idq.filter((q) => q.kind === "name");
check("identify: name questions explain every wrong answer", names.every((q) => q.kind === "name" && q.options.every((o) => o.id === q.correct || o.why.length > 20)));

let st = newArrange(3, STAGES.length);
check("arrange: seven cards, not solved at the start", st.pool.length === 7 && !st.pool.every((v, i) => v === i));
for (const s of [0, 1, 2, 3, 4, 5, 6]) st = arrangeReducer(st, { type: "place", stage: s });
st = arrangeReducer(st, { type: "check" });
check("arrange: the correct order is solved", st.solved);
let st2 = newArrange(3, STAGES.length);
for (const s of [1, 0, 2, 3, 4, 5, 6]) st2 = arrangeReducer(st2, { type: "place", stage: s });
st2 = arrangeReducer(st2, { type: "check" });
check("arrange: a wrong order is not solved and can retry", !st2.solved && st2.checked && arrangeReducer(st2, { type: "retry" }).placed.length === 0 && arrangeReducer(st2, { type: "retry" }).pool.length === 7);

const qids = CHALLENGE_BANK.map((q) => q.id);
check("challenge: unique ids", new Set(qids).size === qids.length);
check("challenge: four options, exactly one correct, every wrong answer explained", CHALLENGE_BANK.every((q) => q.options.length === 4 && q.options.filter((o) => o.id === q.correct).length === 1 && q.options.every((o) => o.id === q.correct || o.why.length > 15) && q.explanation.length > 20));
check("challenge: every question points at a real stage and beat of that stage-or-nearby", CHALLENGE_BANK.every((q) => q.stage >= 0 && q.stage < 7 && q.beat >= 0 && q.beat < BEAT_COUNT && Math.abs(BEAT_STAGE[q.beat]! - q.stage) <= 1));
check("challenge: at least 15 questions", CHALLENGE_BANK.length >= 15);
let r: ReturnType<typeof challengeReducer> = newChallengeRound(5);
for (let i = 0; i < r.questions.length; i++) {
  r = challengeReducer(r, { type: "pick", option: r.questions[i]!.correct });
  r = challengeReducer(r, { type: "next" });
}
check("challenge: a perfect round scores full marks and finishes", r.finished && r.results.every(Boolean) && r.results.length === r.questions.length);
let r2: ReturnType<typeof challengeReducer> = newChallengeRound(5);
const wrong = r2.questions[0]!.options.find((o) => o.id !== r2.questions[0]!.correct)!;
r2 = challengeReducer(r2, { type: "pick", option: wrong.id });
check("challenge: a wrong answer is recorded as wrong", r2.results[0] === false);

if (failures > 0) {
  console.error(`\n${failures} mitosis check(s) failed.`);
  process.exit(1);
}
console.log("\nAll mitosis checks passed.");
