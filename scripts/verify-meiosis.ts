/**
 * Verifies the Meiosis lab's model: the genetics plan, the animation geometry (chromosome counts, which cell each
 * chromosome is in, whether anything sticks out of its cell), the stage count table, and the activity logic.
 * Run with `npm run verify:meiosis`. Exits non-zero if any check fails.
 */
import { BEAT_COUNT, BEAT_STAGE, STAGE_FIRST_BEAT, STAGE_LAST_BEAT, buildBeats, chIndex, sceneAt, CX } from "../src/features/subjects/biology/meiosis/engine/beats";
import { stageCounts } from "../src/features/subjects/biology/meiosis/engine/counts";
import {
  PAIR_COUNTS,
  allChromatids,
  allelesOf,
  chromatidKey,
  finalCellOf,
  finalCells,
  isCrossing,
  makePlan,
  sideOf,
  tetradLanes,
  vertOf,
} from "../src/features/subjects/biology/meiosis/engine/plan";
import { cellCentres, centromereOf, rodPoints, toGlobal } from "../src/features/subjects/biology/meiosis/engine/shapes";
import { BEATS, STAGES } from "../src/features/subjects/biology/meiosis/data/stages";
import {
  CHALLENGE_BANK,
  PREDICT_EVENTS,
  arrangeReducer,
  buildIdentifyQuestions,
  challengeReducer,
  checkChromatidPick,
  newArrange,
  newChallengeRound,
} from "../src/features/subjects/biology/meiosis/activities/model";

let failures = 0;
function check(name: string, ok: boolean, detail = ""): void {
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : `  (${detail})`}`);
}

check("nine stages and sixteen beats", STAGES.length === 9 && BEATS.length === BEAT_COUNT && BEAT_STAGE.length === BEAT_COUNT);
check("beat → stage map matches stage first/last beats", STAGES.every((_, s) => BEAT_STAGE[STAGE_FIRST_BEAT[s]!] === s && BEAT_STAGE[STAGE_LAST_BEAT[s]!] === s));
check("beat captions agree with beat → stage map", BEATS.every((b, i) => b.stage === BEAT_STAGE[i]));

const dist = (a: [number, number], b: [number, number]) => Math.hypot(a[0] - b[0], a[1] - b[1]);

for (const pairs of PAIR_COUNTS) {
  const badPlans: string[] = [];
  const badCells: string[] = [];
  const outside: string[] = [];
  const badCounts: string[] = [];
  const badSeq: string[] = [];

  for (let seed = 1; seed <= 40; seed++) {
    const plan = makePlan(pairs, seed);
    const ids = allChromatids(plan);
    const tag = `p${pairs}/s${seed}`;

    // --- plan invariants
    if (!plan.cross.some(Boolean)) badPlans.push(`${tag}: no crossover at all`);
    plan.cross.forEach((c, i) => {
      if (!c) return;
      const spec = plan.specs[i]!;
      if (Math.abs(c.at - spec.centromere) < 0.1) badPlans.push(`${tag}: crossover at centromere`);
      const m = ids.filter((x) => x.pair === i && x.homolog === 0 && isCrossing(plan, x));
      const p = ids.filter((x) => x.pair === i && x.homolog === 1 && isCrossing(plan, x));
      if (m.length !== 1 || p.length !== 1) badPlans.push(`${tag}: pair ${i} crossing chromatids not exactly one maternal + one paternal`);
      const lanes = tetradLanes(plan, i);
      if (!(isCrossing(plan, lanes[1]!) && isCrossing(plan, lanes[2]!) && lanes[1]!.homolog !== lanes[2]!.homolog)) badPlans.push(`${tag}: pair ${i} crossing chromatids are not the inner, adjacent lanes`);
      // exchange conserves alleles: the four chromatids together still hold two of each allele
      const letters = lanes.flatMap((l) => allelesOf(plan, l));
      for (const g of spec.genes) {
        const up = letters.filter((x) => x === g).length;
        const lo = letters.filter((x) => x === g.toLowerCase()).length;
        if (up !== 2 || lo !== 2) badPlans.push(`${tag}: pair ${i} gene ${g} not conserved`);
      }
    });
    const cells = finalCells(plan);
    for (const c of cells) {
      const perPair = new Set(c.chromatids.map((x) => x.pair));
      if (c.chromatids.length !== pairs || perPair.size !== pairs) badCells.push(`${tag}: cell ${c.index} does not hold exactly one chromatid per pair`);
    }
    for (let i = 0; i < pairs; i++) {
      const homologsSeen = new Set<number>();
      const cellsOfPair = ids.filter((x) => x.pair === i).map((x) => finalCellOf(plan, x));
      if (new Set(cellsOfPair).size !== 4) badCells.push(`${tag}: pair ${i} chromatids do not go to four different cells`);
      // meiosis I: both sisters of a homolog go to the same side; the two homologs go to opposite sides
      for (const h of [0, 1] as const) {
        if (sideOf(plan, i, h) === sideOf(plan, i, (1 - h) as 0 | 1)) badCells.push(`${tag}: pair ${i} homologs on same side`);
        const v0 = vertOf(plan, { pair: i, homolog: h, sister: 0 });
        const v1 = vertOf(plan, { pair: i, homolog: h, sister: 1 });
        if (v0 === v1) badCells.push(`${tag}: pair ${i} sisters not split in meiosis II`);
        homologsSeen.add(sideOf(plan, i, h));
      }
    }

    // --- geometry
    const beats = buildBeats(plan);
    check_beats: {
      if (beats.length !== BEAT_COUNT) {
        badSeq.push(`${tag}: ${beats.length} beats`);
        break check_beats;
      }
      // continuous interpolation reaches the keyframes exactly
      for (let b = 0; b < BEAT_COUNT; b++) if (sceneAt(beats, b) !== beats[b]) badSeq.push(`${tag}: sceneAt(${b}) is not the keyframe`);

      for (let b = 0; b < BEAT_COUNT; b++) {
        const st = beats[b]!;
        const centres = cellCentres(st.s);
        const visible = ids.filter((id) => st.ch[chIndex(id)]!.op > 0.5);
        // replication happens once: unduplicated before beat 1, duplicated from beat 1 on, never more
        const expect = b === 0 ? 2 * pairs : 4 * pairs;
        if (visible.length !== expect) badSeq.push(`${tag}: beat ${b} shows ${visible.length} chromatids, expected ${expect}`);

        // every chromatid (whole rod) lies inside a cell
        for (const id of visible) {
          const ch = st.ch[chIndex(id)]!;
          const spec = plan.specs[id.pair]!;
          const pts = rodPoints(spec, ch, null, 0).filter((_, i, a) => i === 0 || i === a.length - 1);
          for (const p of pts) {
            const [x, y] = toGlobal(p, ch);
            const inside = centres.some((c) => ((x - c.x) / (c.rx * 1.015)) ** 2 + ((y - c.y) / (c.ry * 1.015)) ** 2 <= 1);
            if (!inside) outside.push(`${tag} beat ${b} ${chromatidKey(id)} at (${x.toFixed(0)}, ${y.toFixed(0)})`);
          }
        }
      }

      // sister chromatids: joined through metaphase II, separated by anaphase II
      for (const b of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
        for (const id of ids.filter((x) => x.sister === 0)) {
          const a = centromereOf(beats[b]!.ch[chIndex(id)]!);
          const s = centromereOf(beats[b]!.ch[chIndex({ ...id, sister: 1 })]!);
          if (dist(a, s) > 34) badSeq.push(`${tag}: beat ${b} sisters of ${chromatidKey(id)} are ${dist(a, s).toFixed(0)} apart (should stay joined)`);
        }
      }
      for (const b of [13, 14, 15]) {
        for (const id of ids.filter((x) => x.sister === 0)) {
          const a = centromereOf(beats[b]!.ch[chIndex(id)]!);
          const s = centromereOf(beats[b]!.ch[chIndex({ ...id, sister: 1 })]!);
          if (dist(a, s) < 40) badSeq.push(`${tag}: beat ${b} sisters of ${chromatidKey(id)} not separated`);
        }
      }
      // homologs separate to opposite sides in anaphase I and stay apart
      for (const b of [8, 9, 10, 11, 12]) {
        for (let i = 0; i < pairs; i++) {
          const xs = ([0, 1] as const).map((h) => centromereOf(beats[b]!.ch[chIndex({ pair: i, homolog: h, sister: 0 })]!)[0]);
          const sides = ([0, 1] as const).map((h) => (sideOf(plan, i, h) === 0 ? xs[h]! < CX : xs[h]! > CX));
          if (!sides.every(Boolean)) badSeq.push(`${tag}: beat ${b} pair ${i} homologs are not on opposite sides`);
        }
      }
      // in metaphase I both homologs of every pair are still together on the plate
      for (let i = 0; i < pairs; i++) {
        const xs = ids.filter((x) => x.pair === i).map((x) => centromereOf(beats[7]!.ch[chIndex(x)]!)[0]);
        if (Math.max(...xs) - Math.min(...xs) > 90) badSeq.push(`${tag}: metaphase I pair ${i} is not a tight tetrad`);
      }

      // derive counts from the geometry at the last beat of each stage and compare with the table
      for (let s = 0; s < 9; s++) {
        const st = beats[STAGE_LAST_BEAT[s]!]!;
        const centres = cellCentres(st.s);
        const members: number[][] = centres.map(() => []);
        for (const id of ids) {
          const ch = st.ch[chIndex(id)]!;
          if (ch.op < 0.5) continue;
          const [x, y] = centromereOf(ch);
          let best = 0;
          let bestD = Infinity;
          centres.forEach((c, i) => {
            const d = ((x - c.x) / c.rx) ** 2 + ((y - c.y) / c.ry) ** 2;
            if (d < bestD) (bestD = d), (best = i);
          });
          members[best]!.push(chIndex(id));
        }
        const exp = stageCounts(s, pairs);
        if (centres.length !== exp.cells) badCounts.push(`${tag} stage ${s + 1}: ${centres.length} cells, table says ${exp.cells}`);
        members.forEach((m, ci) => {
          // chromosomes = groups of sister chromatids (same pair and homolog) whose centromeres are still joined (within 34 units)
          const seen = new Set<number>();
          let chroms = 0;
          for (const a of m) {
            if (seen.has(a)) continue;
            chroms++;
            seen.add(a);
            for (const b of m) {
              if (!seen.has(b) && Math.floor(a / 2) === Math.floor(b / 2) && dist(centromereOf(st.ch[a]!), centromereOf(st.ch[b]!)) <= 34) seen.add(b);
            }
          }
          if (m.length !== exp.chromatids) badCounts.push(`${tag} stage ${s + 1} cell ${ci}: ${m.length} chromatids, table says ${exp.chromatids}`);
          if (chroms !== exp.chromosomes) badCounts.push(`${tag} stage ${s + 1} cell ${ci}: ${chroms} chromosomes, table says ${exp.chromosomes}`);
        });
      }
    }
  }
  check(`2n=${2 * pairs}: plans valid over 40 seeds (non-sister crossovers, none at centromere, alleles conserved)`, badPlans.length === 0, badPlans.slice(0, 3).join("; "));
  check(`2n=${2 * pairs}: each final cell has one chromatid of every pair; sisters/homologs split correctly`, badCells.length === 0, badCells.slice(0, 3).join("; "));
  check(`2n=${2 * pairs}: nothing sticks out of its cell in any beat`, outside.length === 0, `${outside.length} e.g. ${outside.slice(0, 3).join("; ")}`);
  check(`2n=${2 * pairs}: sequence (replication once, sisters joined until anaphase II, homologs apart after anaphase I)`, badSeq.length === 0, badSeq.slice(0, 3).join("; "));
  check(`2n=${2 * pairs}: counts table equals counts derived from the animation geometry`, badCounts.length === 0, badCounts.slice(0, 3).join("; "));
}

// --- counts table facts
for (const p of PAIR_COUNTS) {
  const c = (s: number) => stageCounts(s, p);
  check(`2n=${2 * p}: chromosome number halves in meiosis I only`, c(0).chromosomes === 2 * p && c(4).chromosomes === p && c(8).chromosomes === p && c(5).chromosomes === p);
  check(`2n=${2 * p}: DNA per cell 4C → 2C (after I) → 1C (after II)`, c(2).dnaC === 4 && c(4).dnaC === 2 && c(8).dnaC === 1);
  check(`2n=${2 * p}: total DNA is conserved (4C) through every stage`, [0, 1, 2, 3, 4, 5, 6, 7, 8].every((s) => c(s).cells * c(s).dnaC === 4));
  check(`2n=${2 * p}: chromatids per cell = DNA copies (dnaC × p)`, [0, 1, 2, 3, 4, 5, 6, 7, 8].every((s) => c(s).chromatids === c(s).dnaC * p));
}

// --- activities
check("predict events are ordered by beat, unique and have exactly one correct option", PREDICT_EVENTS.every((e, i, a) => (i === 0 || a[i - 1]!.beat < e.beat) && e.options.filter((o) => o.id === e.correct).length === 1 && new Set(e.options.map((o) => o.id)).size === e.options.length));
check("every predict event pauses on a beat that exists and follows the previous beat", PREDICT_EVENTS.every((e) => e.beat >= 1 && e.beat < BEAT_COUNT));
{
  const plan = makePlan(2, 1);
  const qs = buildIdentifyQuestions(plan);
  check("identify: every question has a valid beat", qs.every((q) => q.beat >= 0 && q.beat < BEAT_COUNT));
  check("identify: name questions have one correct option and a reason for each wrong one", qs.every((q) => q.kind !== "name" || (q.options.filter((o) => o.id === q.correct).length === 1 && q.options.filter((o) => o.id !== q.correct).every((o) => o.why.length > 10))));
  const sister = qs.find((q) => q.kind === "sister")!;
  const homolog = qs.find((q) => q.kind === "homolog")!;
  check("identify: sister question accepts the sister, rejects a homolog and another pair", checkChromatidPick(sister, { pair: 0, homolog: 0, sister: 1 }).ok && !checkChromatidPick(sister, { pair: 0, homolog: 1, sister: 0 }).ok && !checkChromatidPick(sister, { pair: 1, homolog: 0, sister: 1 }).ok && !checkChromatidPick(sister, { pair: 0, homolog: 0, sister: 0 }).ok);
  check("identify: homolog question accepts the partner, rejects own sister and other pair", checkChromatidPick(homolog, { pair: 0, homolog: 1, sister: 1 }).ok && !checkChromatidPick(homolog, { pair: 0, homolog: 0, sister: 1 }).ok && !checkChromatidPick(homolog, { pair: 1, homolog: 1, sister: 0 }).ok);
}
{
  let s = newArrange(4);
  check("arrange: starts shuffled with nothing placed", s.placed.length === 0 && s.pool.length === 9 && !s.pool.every((v, i) => v === i));
  for (const st of [...s.pool].reverse()) s = arrangeReducer(s, { type: "place", stage: st });
  s = arrangeReducer(s, { type: "check" });
  check("arrange: wrong order is not solved and can be retried", s.checked && !s.solved && s.attempts === 1);
  s = arrangeReducer(s, { type: "retry" });
  check("arrange: retry returns every card", s.placed.length === 0 && s.pool.length === 9 && !s.solved);
  for (let i = 0; i < 9; i++) s = arrangeReducer(s, { type: "place", stage: i });
  s = arrangeReducer(s, { type: "check" });
  check("arrange: correct order is solved", s.solved);
}
{
  const ok = CHALLENGE_BANK.every((q) => q.options.filter((o) => o.id === q.correct).length === 1 && q.options.filter((o) => o.id !== q.correct).every((o) => o.why.length > 15) && new Set(q.options.map((o) => o.id)).size === q.options.length && q.explanation.length > 20);
  check(`challenge: ${CHALLENGE_BANK.length} questions, one correct answer each, every wrong answer explained`, ok && CHALLENGE_BANK.length >= 12);
  check("challenge: unique question ids", new Set(CHALLENGE_BANK.map((q) => q.id)).size === CHALLENGE_BANK.length);
  let r = newChallengeRound(9);
  for (let i = 0; i < r.questions.length; i++) {
    r = challengeReducer(r, { type: "pick", option: r.questions[i]!.correct });
    r = challengeReducer(r, { type: "pick", option: "zzz" }); // a second pick must be ignored
    r = challengeReducer(r, { type: "next" });
  }
  check("challenge: a perfect round scores full marks and finishes", r.finished && r.results.length === r.questions.length && r.results.every(Boolean));
  let w = newChallengeRound(9);
  w = challengeReducer(w, { type: "pick", option: "nope" });
  check("challenge: a wrong answer is recorded as wrong", w.results[0] === false);
}

console.log(failures === 0 ? "\nAll meiosis checks passed." : `\n${failures} check(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
