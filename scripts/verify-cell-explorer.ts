/**
 * Verifies the Cell Explorer's content and activity logic: every structure is complete, plant-only structures never
 * appear in animal-cell activities, question rounds are well formed (one correct answer, no overlapping options),
 * and the round state machine handles wrong answers, retries, hints, reveals and scoring.
 * Run with `npm run verify:cell`. Exits non-zero on the first failing group.
 */
import { ORGANELLES, ORGANELLE_ORDER, isPresent, organellesFor } from "../src/features/subjects/biology/cell-explorer/data/organelles";
import {
  buildFunctionQuestions,
  buildIdentifyQuestions,
  buildSortQuestions,
  roundReducer,
  seededRng,
  startRound,
} from "../src/features/subjects/biology/cell-explorer/activities/model";
import type { CellKind, OrganelleId } from "../src/features/subjects/biology/cell-explorer/types";

let failures = 0;
function check(name: string, ok: boolean, detail = ""): void {
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : `  (${detail})`}`);
}

const PLANT_ONLY: OrganelleId[] = ["cellWall", "chloroplast", "largeVacuole", "plasmodesmata"];
const REQUIRED_BOTH: OrganelleId[] = ["cellMembrane", "cytoplasm", "nucleus", "nuclearEnvelope", "nucleolus", "mitochondria", "ribosomes", "roughER", "smoothER", "golgi", "vesicles", "vacuole"];

// ---- content
const ids = Object.keys(ORGANELLES) as OrganelleId[];
check("order list covers every structure exactly once", ORGANELLE_ORDER.length === ids.length && new Set(ORGANELLE_ORDER).size === ids.length && ids.every((i) => ORGANELLE_ORDER.includes(i)));
const fields = ["name", "function", "explanation", "contribution", "analogy", "appearance", "where", "deeper", "fact"] as const;
const incomplete = ids.filter((id) => fields.some((f) => !ORGANELLES[id][f] || ORGANELLES[id][f].trim().length < (f === "name" ? 3 : 10)));
check("every structure has all text fields", incomplete.length === 0, incomplete.join(", "));
check("plant-only structures are marked plant", PLANT_ONLY.every((id) => ORGANELLES[id].presence === "plant"));
check("shared structures are marked both", REQUIRED_BOTH.every((id) => ORGANELLES[id].presence === "both"));
check("animal cell excludes plant-only structures", PLANT_ONLY.every((id) => !isPresent(id, "animal") && !organellesFor("animal").some((o) => o.id === id)));
check("plant cell includes every structure", ids.every((id) => organellesFor("plant").some((o) => o.id === id)));
check("function sentences are distinct", new Set(ids.map((id) => ORGANELLES[id].function)).size === ids.length);
check("colours are distinct", new Set(ids.map((id) => ORGANELLES[id].color)).size === ids.length);

// ---- builders
for (const kind of ["animal", "plant"] as CellKind[]) {
  for (let seed = 1; seed <= 25; seed++) {
    const rng = seededRng(seed);
    const identify = buildIdentifyQuestions(kind, rng);
    const fn = buildFunctionQuestions(kind, rng);
    const present = new Set(organellesFor(kind).map((o) => o.id));
    const bad: string[] = [];
    if (new Set(identify.map((q) => q.id)).size !== identify.length) bad.push("identify duplicates");
    if (identify.some((q) => !present.has(q.id))) bad.push("identify asks about an absent structure");
    for (const q of fn) {
      const opts = q.options ?? [];
      if (opts.length !== 4) bad.push(`function ${q.id}: ${opts.length} options`);
      if (opts.filter((o) => o.value === q.answer).length !== 1) bad.push(`function ${q.id}: answer count`);
      if (new Set(opts.map((o) => o.label)).size !== opts.length) bad.push(`function ${q.id}: duplicate options`);
      if (opts.some((o) => !present.has(o.value as OrganelleId))) bad.push(`function ${q.id}: option from absent structure`);
      const vac = opts.filter((o) => o.value === "vacuole" || o.value === "largeVacuole");
      if (vac.length > 1) bad.push(`function ${q.id}: both vacuole options`);
      if (opts.find((o) => o.value === q.answer)?.label !== ORGANELLES[q.id].function) bad.push(`function ${q.id}: wrong label`);
    }
    if (bad.length) {
      check(`${kind} rounds well formed (seed ${seed})`, false, bad.join("; "));
      break;
    }
    if (seed === 25) check(`${kind}: identify and function rounds well formed over 25 seeds`, true);
  }
}
const sort = buildSortQuestions(seededRng(7), 20);
check("sort answers match presence", sort.every((q) => q.answer === (ORGANELLES[q.id].presence === "plant" ? "plant" : "both")));
check("sort never asks about cytoplasm", sort.every((q) => q.id !== "cytoplasm"));

// ---- state machine
{
  const qs = buildFunctionQuestions("plant", seededRng(3), 3);
  let s = startRound(qs);
  const wrong = qs[0]!.options!.find((o) => o.value !== qs[0]!.answer)!.value;
  s = roundReducer(s, { type: "answer", value: wrong });
  check("wrong answer keeps asking and records it", s.status === "asking" && s.wrong.length === 1);
  s = roundReducer(s, { type: "answer", value: wrong });
  check("same wrong answer is not recorded twice", s.wrong.length === 1);
  s = roundReducer(s, { type: "answer", value: qs[0]!.answer });
  check("correct after a miss is correct but not first-try, and is queued for review", s.status === "correct" && s.firstTry === 0 && s.missed.includes(qs[0]!.id));
  s = roundReducer(s, { type: "answer", value: "x" });
  check("answers are ignored once answered", s.status === "correct" && s.wrong.length === 1);
  s = roundReducer(s, { type: "next" });
  check("next moves on and clears the question state", s.index === 1 && s.status === "asking" && s.wrong.length === 0 && s.hints === 0);
  s = roundReducer(s, { type: "answer", value: qs[1]!.answer });
  check("clean answer counts as first try", s.firstTry === 1);
  s = roundReducer(s, { type: "next" });
  s = roundReducer(s, { type: "hint" });
  s = roundReducer(s, { type: "hint" });
  s = roundReducer(s, { type: "hint" });
  check("hints are capped", s.hints === 2);
  s = roundReducer(s, { type: "reveal" });
  check("reveal ends the question without credit", s.status === "revealed" && s.firstTry === 1 && s.missed.includes(qs[2]!.id));
  s = roundReducer(s, { type: "next" });
  check("round finishes after the last question", s.finished);
  const again = roundReducer(s, { type: "restart", questions: buildIdentifyQuestions("animal", seededRng(1)) });
  check("restart resets the round", !again.finished && again.index === 0 && again.firstTry === 0 && again.missed.length === 0);
  check("cannot skip a question with next", roundReducer(startRound(qs), { type: "next" }).index === 0);
}

if (failures) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log("\nAll Cell Explorer checks passed");
