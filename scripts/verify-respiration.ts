/**
 * Verifies the Cellular Respiration, ATP & Energy Release and Introduction to Cellular Energy models:
 * stage/beat structure, per-glucose yields, carbon accounting, proton accounting, ATP yield range, ATP/ΔG facts,
 * question banks (one correct option, unique ids) and activity logic. Run with `npm run verify:energy`.
 */
import { ATOM_FLOW, BEAT_COUNT, BEAT_STAGE, CITRIC_PER_GLUCOSE, CYCLE_NODES, EQUATION_ATOMS, H_PER_FADH2, H_PER_NADH, STAGES, STAGE_FIRST_BEAT, STAGE_LAST_BEAT, SUBSTRATE_ATP, TOTAL_CO2, TOTAL_FADH2, TOTAL_NADH, YIELD, atpYield, carbonLedger, carbonTotal, cycleTally, glycolysisTally } from "../src/features/subjects/biology/cellular-respiration/model";
import { CHALLENGE_BANK as RESP_BANK, PREDICT_EVENTS, SORT_LOCATION } from "../src/features/subjects/biology/cellular-respiration/activities";
import { CENTRES, CHALLENGE_BANK as ATP_CH, COMPARE_BANK, CYCLE_STEPS, DELTA_G_CELL, DELTA_G_STANDARD, HYDROLYSIS_BEATS, IDENTIFY, NET_CHARGE, PARTS, PART_ORDER, PHOSPHATE_COUNT, PREDICT_BANK as ATP_PR, WORK, WORK_BANK, atpFraction, project } from "../src/features/subjects/biology/atp-energy-release/model";
import { CHALLENGE_BANK as INTRO_CH, FLOW_STEPS, IDENTIFY_BANK, PREDICT_BANK as INTRO_PR, SORT_COUPLING, SORT_FREE, SORT_META } from "../src/features/subjects/biology/cellular-energy/model";
import type { Q } from "../src/features/subjects/biology/cellular-energy-shared/quiz-model";
import { newRound, roundReducer } from "../src/features/subjects/biology/cellular-energy-shared/quiz-model";
import { arrangeReducer, newArrange } from "../src/features/subjects/biology/meiosis/activities/model";

let failures = 0;
function check(name: string, ok: boolean, detail = ""): void {
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : `  (${detail})`}`);
}

/* ---- respiration structure */
check("five stages in order", STAGES.map((s) => s.id).join() === "glycolysis,pyruvate,citric,etc,chemi");
check("locations: cytosol, matrix, matrix, inner, inner", STAGES.map((s) => s.location).join() === "cytosol,matrix,matrix,inner,inner");
check("beat map consistent", BEAT_STAGE.length === BEAT_COUNT && STAGES.every((s, i) => BEAT_STAGE[STAGE_FIRST_BEAT[i]!] === i && BEAT_STAGE[STAGE_LAST_BEAT[i]!] === i && STAGE_LAST_BEAT[i]! - STAGE_FIRST_BEAT[i]! + 1 === s.beats.length));
/* ---- yields per glucose */
check("glycolysis: 2 pyruvate, net 2 ATP (4 − 2), 2 NADH", YIELD.glycolysis.pyruvate === 2 && YIELD.glycolysis.atpNet === 2 && YIELD.glycolysis.atpProduced - YIELD.glycolysis.atpInvested === 2 && YIELD.glycolysis.nadh === 2);
check("pyruvate oxidation per glucose: 2 acetyl-CoA, 2 CO₂, 2 NADH", YIELD.pyruvate.acetylCoA === 2 && YIELD.pyruvate.co2 === 2 && YIELD.pyruvate.nadh === 2);
check("citric acid cycle per turn: 2 CO₂, 3 NADH, 1 FADH₂, 1 ATP", YIELD.citricPerTurn.co2 === 2 && YIELD.citricPerTurn.nadh === 3 && YIELD.citricPerTurn.fadh2 === 1 && YIELD.citricPerTurn.atp === 1);
check("citric acid cycle per glucose: 4 CO₂, 6 NADH, 2 FADH₂, 2 ATP", CITRIC_PER_GLUCOSE.co2 === 4 && CITRIC_PER_GLUCOSE.nadh === 6 && CITRIC_PER_GLUCOSE.fadh2 === 2 && CITRIC_PER_GLUCOSE.atp === 2);
check("totals: 10 NADH, 2 FADH₂, 6 CO₂, 4 substrate-level ATP", TOTAL_NADH === 10 && TOTAL_FADH2 === 2 && TOTAL_CO2 === 6 && SUBSTRATE_ATP === 4);
/* ---- carbon accounting */
check("carbon: 6 → 2×3 → 2×2+2 → 6 CO₂", [-1, 0, 1, 2].every((s) => carbonTotal(carbonLedger(s)) === 6));
const c = CYCLE_NODES.map((n) => n.carbons);
check("cycle carbon counts 4,6,6,5,4,4,4,4", c.join() === "4,6,6,5,4,4,4,4");
check("cycle: two CO₂ leave per turn (6→5→4) and acetyl's 2 C balance them", c[2]! - c[3]! === 1 && c[3]! - c[4]! === 1 && c[0]! + 2 === c[1]!);
const t9 = cycleTally(8);
check("cycle tally after a full turn", t9.co2 === 2 && t9.nadh === 3 && t9.fadh2 === 1 && t9.atp === 1);
check("glycolysis tally at the end", glycolysisTally(5).atpMade - glycolysisTally(5).atpSpent === 2 && glycolysisTally(5).nadh === 2);
/* ---- protons and yield */
check("H⁺ per NADH 10, per FADH₂ 6 (Complex II pumps none)", H_PER_NADH === 10 && H_PER_FADH2 === 6);
const modern = atpYield({ shuttle: "malate-aspartate", ratios: "modern", leak: 0 });
const g3p = atpYield({ shuttle: "glycerol-phosphate", ratios: "modern", leak: 0 });
check("yield 32 with malate–aspartate shuttle (2.5/1.5)", modern.total === 32, String(modern.total));
check("yield 30 with glycerol-phosphate shuttle", g3p.total === 30, String(g3p.total));
check("commonly taught range 30–32 is spanned", g3p.total === 30 && modern.total === 32);
check("oxidative phosphorylation 26–28", g3p.oxidative === 26 && modern.oxidative === 28);
check("proton arithmetic matches: 112 H⁺ ÷ 4 = 28", (TOTAL_NADH * H_PER_NADH + TOTAL_FADH2 * H_PER_FADH2) / 4 === modern.oxidative);
check("classic (3/2) gives 38", atpYield({ shuttle: "malate-aspartate", ratios: "classic", leak: 0 }).total === 38);
check("leak lowers the yield", atpYield({ shuttle: "malate-aspartate", ratios: "modern", leak: 0.2 }).total < 32);
check("equation atoms balance", (["C", "H", "O"] as const).every((a) => EQUATION_ATOMS.left[a] === EQUATION_ATOMS.right[a]));
check("atom flow texts present", Object.keys(ATOM_FLOW).length === 3);

/* ---- banks */
function bank(name: string, b: Q[]) {
  const ids = new Set(b.map((q) => q.id));
  const ok = ids.size === b.length && b.every((q) => q.options.filter((o) => o.id === q.correct).length === 1 && new Set(q.options.map((o) => o.id)).size === q.options.length && q.options.length >= 2 && q.why.length > 0);
  check(`${name}: ${b.length} questions, unique ids, exactly one correct option`, ok);
}
bank("respiration challenge", RESP_BANK);
bank("ATP compare", COMPARE_BANK);
bank("ATP predict", ATP_PR);
bank("ATP work", WORK_BANK);
bank("ATP challenge", ATP_CH);
bank("intro identify", IDENTIFY_BANK);
bank("intro predict", INTRO_PR);
bank("intro challenge", INTRO_CH);
check("predict events reference valid, distinct beats", PREDICT_EVENTS.every((e) => e.beat > 0 && e.beat < BEAT_COUNT && e.options.some((o) => o.id === e.correct)) && new Set(PREDICT_EVENTS.map((e) => e.beat)).size === PREDICT_EVENTS.length);
const sorts = [...SORT_LOCATION, ...SORT_META, ...SORT_FREE, ...SORT_COUPLING];
check("sort items have unique ids", new Set(sorts.map((s) => s.id)).size === sorts.length);

/* ---- ATP facts */
check("ΔG standard −30.5, cell −50 to −65 kJ/mol", DELTA_G_STANDARD === -30.5 && DELTA_G_CELL[0] === -65 && DELTA_G_CELL[1] === -50);
check("ATP 3 phosphates, ADP 2; charges −4 / −3", PHOSPHATE_COUNT.ATP === 3 && PHOSPHATE_COUNT.ADP === 2 && NET_CHARGE.ATP === -4 && NET_CHARGE.ADP === -3);
check("ATP parts: adenine, ribose, α, β, γ; ADP lacks γ", PART_ORDER.ATP.length === 5 && !PART_ORDER.ADP.includes("pGamma") && PART_ORDER.ATP.every((p) => p in PARTS));
check("identify questions target parts of the shown molecule", IDENTIFY.every((q) => PART_ORDER[q.molecule].includes(q.target)));
check("hydrolysis has 7 beats; cycle 5 steps", HYDROLYSIS_BEATS.length === 7 && CYCLE_STEPS.length === 5);
check("four work examples with 5 beats each", WORK.length === 4 && WORK.every((w) => w.beats.length === 5));
check("pump is 3 Na⁺ out / 2 K⁺ in", WORK[0]!.summary.includes("3 Na⁺ out and 2 K⁺ in"));
check("ATP fraction responds to supply/demand", atpFraction(0, 5) <= 0.05 && atpFraction(8, 2) > atpFraction(2, 8));
const p0 = project(CENTRES.pGamma, 0, 0);
const p1 = project(CENTRES.pGamma, Math.PI, 0);
check("3D projection rotates (x flips under 180° turn)", Math.sign(p0.x) !== Math.sign(p1.x));
check("intro has five flow steps", FLOW_STEPS.length === 5);

/* ---- activity logic */
let r = newRound(RESP_BANK.length, 5, 3);
const q0 = RESP_BANK[r.order[0]!]!;
r = roundReducer(r, { type: "pick", option: q0.correct, correct: q0.correct });
check("round scores a correct pick once", r.score === 1 && r.answered === 1 && roundReducer(r, { type: "pick", option: "x", correct: q0.correct }).answered === 1);
let a = newArrange(1, 5);
a = arrangeReducer(a, { type: "check" });
check("arrange cannot be checked until complete", a.checked === false);

console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) FAILED.`);
process.exit(failures === 0 ? 1 - 1 : 1);
