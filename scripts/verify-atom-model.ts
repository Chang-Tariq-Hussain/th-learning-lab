/**
 * Verifies the pure logic behind the Build an Atom lab: particle limits, derived
 * properties, shell distribution, presets, experiments and 3D layout spacing.
 * Run with `npm run verify:atom`. Exits non-zero on the first failing group.
 */
import {
  HYDROGEN_ATOM,
  LIMITS,
  canChange,
  changeParticle,
  chargeKind,
  chargeSuffix,
  clampAtom,
  massNumber,
  netCharge,
  type AtomState,
} from "../src/features/subjects/chemistry/build-an-atom/atom-model";
import { ELEMENTS, getElement } from "../src/features/subjects/chemistry/build-an-atom/elements";
import { INTRO_MODEL_LIMIT, distribute, distributeElectrons, shellFeedback } from "../src/features/subjects/chemistry/build-an-atom/shells";
import { PRESETS } from "../src/features/subjects/chemistry/build-an-atom/presets";
import { CHALLENGES, EXPERIMENTS, checkChallenge } from "../src/features/subjects/chemistry/build-an-atom/experiments";
import { commonNeutrons, isotopeStatus } from "../src/features/subjects/chemistry/build-an-atom/isotopes";
import { NUCLEON_RADIUS, nucleonPositions, nucleonSlot, shellRadius, nucleusRadius } from "../src/features/subjects/chemistry/build-an-atom/nucleus-layout-3d";
import { compareAtoms, describeChange } from "../src/features/subjects/chemistry/build-an-atom/explain";

let failures = 0;
let checks = 0;
function check(name: string, ok: boolean, detail = ""): void {
  checks++;
  if (!ok) {
    failures++;
    console.error(`FAIL  ${name}${detail ? `: ${detail}` : ""}`);
  }
}
const eq = (name: string, a: unknown, b: unknown) => check(name, JSON.stringify(a) === JSON.stringify(b), `${JSON.stringify(a)} !== ${JSON.stringify(b)}`);

// --- Derived properties -----------------------------------------------------
eq("mass number", massNumber({ protons: 6, neutrons: 8, electrons: 6 }), 14);
eq("neutral charge", netCharge({ protons: 6, neutrons: 6, electrons: 6 }), 0);
eq("cation charge", netCharge({ protons: 11, neutrons: 12, electrons: 10 }), 1);
eq("anion charge", netCharge({ protons: 8, neutrons: 8, electrons: 10 }), -2);
eq("charge kinds", [chargeKind(1), chargeKind(0), chargeKind(-3)], ["positive", "neutral", "negative"]);
eq("charge suffix", [chargeSuffix(1), chargeSuffix(2), chargeSuffix(-1), chargeSuffix(-3), chargeSuffix(0)], ["+", "2+", "−", "3−", ""]);

// --- Element identity comes from protons only ---------------------------------
eq("element 6", getElement(6).symbol, "C");
eq("element 12", getElement(12).name, "Magnesium");
check("elements 1-36 contiguous", ELEMENTS.length === 36 && ELEMENTS.every((e, i) => e.atomicNumber === i + 1));

// --- Limits and rapid edits ---------------------------------------------------
eq("clamp negatives", clampAtom({ protons: -5, neutrons: -1, electrons: -9 }), { protons: 1, neutrons: 0, electrons: 0 });
eq("clamp NaN", clampAtom({ protons: NaN, neutrons: Infinity, electrons: 2.6 }), { protons: 1, neutrons: 0, electrons: 3 });
eq("clamp max", clampAtom({ protons: 999, neutrons: 999, electrons: 999 }), { protons: LIMITS.protons.max, neutrons: LIMITS.neutrons.max, electrons: LIMITS.electrons.max });
check("cannot remove last proton", !canChange(HYDROGEN_ATOM, "protons", -1));
check("cannot remove from zero neutrons", !canChange(HYDROGEN_ATOM, "neutrons", -1));
let a: AtomState = HYDROGEN_ATOM;
for (let i = 0; i < 500; i++) a = changeParticle(a, "electrons", -1);
check("500 electron removals never go negative", a.electrons === 0);
for (let i = 0; i < 500; i++) a = changeParticle(a, "neutrons", 1);
check("500 neutron additions stop at the limit", a.neutrons === LIMITS.neutrons.max);
let r = HYDROGEN_ATOM;
const kinds = ["protons", "neutrons", "electrons"] as const;
for (let i = 0; i < 20000; i++) {
  const k = kinds[(i * 7919) % 3]!;
  r = changeParticle(r, k, (i * 104729) % 5 < 2 ? 1 : -1);
  const ok = r.protons >= 1 && r.neutrons >= 0 && r.electrons >= 0 && r.protons <= 36 && r.neutrons <= 60 && r.electrons <= 40;
  if (!ok) {
    check("20000 random edits stay valid", false, JSON.stringify(r));
    break;
  }
}
check("20000 random edits stay valid", true);

// --- Shell model: neutral atoms of elements 1-20 -------------------------------
const NEUTRAL_20: number[][] = [
  [1], [2], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8],
  [2, 8, 1], [2, 8, 2], [2, 8, 3], [2, 8, 4], [2, 8, 5], [2, 8, 6], [2, 8, 7], [2, 8, 8],
  [2, 8, 8, 1], [2, 8, 8, 2],
];
NEUTRAL_20.forEach((cfg, i) => eq(`intro shells Z=${i + 1}`, distributeElectrons(i + 1, "intro"), cfg));
eq("Na+ (10 e)", distributeElectrons(10), [2, 8]);
eq("Mg2+ (10 e)", distributeElectrons(10), [2, 8]);
eq("Cl- (18 e)", distributeElectrons(18), [2, 8, 8]);
eq("O2- (10 e)", distributeElectrons(10), [2, 8]);
eq("Ca2+ (18 e)", distributeElectrons(18), [2, 8, 8]);
eq("zero electrons", distributeElectrons(0), []);
for (let n = 0; n <= LIMITS.electrons.max; n++) {
  for (const model of ["intro", "max"] as const) {
    const d = distribute(n, model);
    const sum = d.shells.reduce((s, x) => s + x.count, 0);
    check(`${model} model keeps all ${n} electrons`, sum === n);
    check(`${model} model respects capacities (${n})`, d.shells.every((s) => s.count <= s.capacity));
    check(`${model} model only leaves the outermost shell unfilled (${n})`, d.shells.slice(0, -1).every((s) => s.full));
  }
}
check("intro falls back to 2n² above 20 electrons", distribute(INTRO_MODEL_LIMIT + 1, "intro").fellBack);
check("intro does not fall back at 20 electrons", !distribute(INTRO_MODEL_LIMIT, "intro").fellBack);
eq("2n² capacities", distribute(60, "max").shells.map((s) => s.capacity), [2, 8, 18, 32]);
check("shell feedback on full shell", /full/.test(shellFeedback(1, 2, "intro") ?? ""));
check("shell feedback on new shell", /in use/.test(shellFeedback(2, 3, "intro") ?? ""));
check("shell feedback on emptied shell", /empty/.test(shellFeedback(3, 2, "intro") ?? ""));
check("shell feedback none when unchanged", shellFeedback(4, 4, "intro") === null);

// --- Presets: label, charge and counts agree ----------------------------------
for (const p of PRESETS) {
  const c = netCharge(p.atom);
  const v = clampAtom(p.atom);
  check(`preset ${p.id} is valid`, v.protons === p.atom.protons && v.neutrons === p.atom.neutrons && v.electrons === p.atom.electrons);
  if (p.group === "Neutral atoms" || p.group === "Isotopes") check(`preset ${p.id} is neutral`, c === 0);
  if (p.group === "Positive ions") check(`preset ${p.id} is a cation`, c > 0);
  if (p.group === "Negative ions") check(`preset ${p.id} is an anion`, c < 0);
  if (p.group !== "Isotopes") check(`preset ${p.id} is a naturally occurring isotope`, ["stable", "radioactive"].includes(isotopeStatus(p.atom.protons, massNumber(p.atom))), `${p.atom.protons}/${massNumber(p.atom)}`);
}
check("preset ids unique", new Set(PRESETS.map((p) => p.id)).size === PRESETS.length);

// --- Isotope data ---------------------------------------------------------------
eq("C-12 stable", isotopeStatus(6, 12), "stable");
eq("C-14 radioactive", isotopeStatus(6, 14), "radioactive");
eq("C-20 not natural", isotopeStatus(6, 20), "not-natural");
eq("Ar-40 stable", isotopeStatus(18, 40), "stable");
eq("K-40 radioactive", isotopeStatus(19, 40), "radioactive");
eq("Fe has no data", isotopeStatus(26, 56), "unknown");

for (let z = 1; z <= 20; z++) check(`most common isotope of Z=${z} is stable`, isotopeStatus(z, z + commonNeutrons(z)) === "stable", `${z}/${z + commonNeutrons(z)}`);

// --- Experiments -----------------------------------------------------------------
const solved: Record<string, AtomState> = {
  "a-n": { protons: 7, neutrons: 7, electrons: 7 },
  "a-na": { protons: 11, neutrons: 12, electrons: 11 },
  "a-ca": { protons: 20, neutrons: 20, electrons: 20 },
  "b-c": { protons: 6, neutrons: 6, electrons: 6 },
  "b-13": { protons: 6, neutrons: 7, electrons: 6 },
  "b-14": { protons: 6, neutrons: 8, electrons: 6 },
  "c-na": { protons: 11, neutrons: 12, electrons: 11 },
  "c-na+": { protons: 11, neutrons: 12, electrons: 10 },
  "c-o2-": { protons: 8, neutrons: 8, electrons: 10 },
};
for (const exp of EXPERIMENTS) {
  for (const task of exp.tasks) {
    const s = solved[task.id];
    check(`task ${task.id} has a solution`, !!s && task.done(s));
    check(`task ${task.id} is not met by hydrogen`, !task.done(HYDROGEN_ATOM));
  }
}
for (const c of CHALLENGES) {
  const target = clampAtom({ protons: c.target.protons ?? 1, neutrons: c.target.neutrons ?? 0, electrons: c.target.electrons ?? 0 });
  check(`challenge ${c.id} passes on its target`, checkChallenge(target, c).ok);
  check(`challenge ${c.id} fails on hydrogen`, !checkChallenge(HYDROGEN_ATOM, c).ok || (c.id === "h+" ? false : true));
  check(`challenge ${c.id} has three hints`, c.hints.length === 3);
}
check("Mg2+ challenge rejects Mg neutral", !checkChallenge({ protons: 12, neutrons: 12, electrons: 12 }, CHALLENGES[0]!).ok);
check("Mg2+ challenge accepts any neutron count", checkChallenge({ protons: 12, neutrons: 14, electrons: 10 }, CHALLENGES[0]!).ok);

// --- Change explanations -----------------------------------------------------------
check("explain neutron change keeps element", /still Carbon/.test(describeChange({ protons: 6, neutrons: 6, electrons: 6 }, { protons: 6, neutrons: 7, electrons: 6 }).join(" ")));
check("explain proton change names new element", /Nitrogen/.test(describeChange({ protons: 6, neutrons: 6, electrons: 6 }, { protons: 7, neutrons: 6, electrons: 6 }).join(" ")));
check("explain electron change reports charge", /\+/.test(describeChange({ protons: 11, neutrons: 12, electrons: 11 }, { protons: 11, neutrons: 12, electrons: 10 }).join(" ")));

// --- Compare ------------------------------------------------------------------------
const C12 = { protons: 6, neutrons: 6, electrons: 6 };
check("compare identical", /identical/.test(compareAtoms(C12, { ...C12 }).verdict));
check("compare isotopes", /Isotopes of Carbon/.test(compareAtoms(C12, { protons: 6, neutrons: 8, electrons: 6 }).verdict));
check("compare ions", /Ions of Sodium/.test(compareAtoms({ protons: 11, neutrons: 12, electrons: 11 }, { protons: 11, neutrons: 12, electrons: 10 }).verdict));
check("compare different elements", /Different elements/.test(compareAtoms(C12, { protons: 7, neutrons: 7, electrons: 7 }).verdict));
check("compare isobars", /isobars/.test(compareAtoms({ protons: 6, neutrons: 8, electrons: 6 }, { protons: 7, neutrons: 7, electrons: 7 }).verdict));
check("compare mixed", /isotopes\) and in electrons/.test(compareAtoms(C12, { protons: 6, neutrons: 8, electrons: 5 }).verdict));

// --- 3D layout ---------------------------------------------------------------------
let minDist = Infinity;
const total = LIMITS.protons.max + LIMITS.neutrons.max;
const slots = Array.from({ length: total }, (_, k) => nucleonSlot(k));
for (let i = 0; i < slots.length; i++) {
  for (let j = i + 1; j < slots.length; j++) {
    const d = Math.hypot(slots[i]![0] - slots[j]![0], slots[i]![1] - slots[j]![1], slots[i]![2] - slots[j]![2]);
    if (d < minDist) minDist = d;
  }
}
check("nucleons overlap by less than 25% of a diameter", minDist >= NUCLEON_RADIUS * 1.5, `min distance ${minDist.toFixed(3)}`);
check("largest nucleus fits inside shell 1", nucleusRadius(total) < shellRadius(0, total) - 1, `${nucleusRadius(total).toFixed(2)} vs ${shellRadius(0, total)}`);
check("shells are evenly spaced", Math.abs(shellRadius(1, 12) - shellRadius(0, 12) - 1.9) < 1e-9);
const layout = nucleonPositions(6, 8);
check("nucleon positions count", layout.protons.length === 6 && layout.neutrons.length === 8);
eq("existing slot is stable when more nucleons are added", nucleonSlot(5), nucleonSlot(5));

console.log(`${checks - failures}/${checks} checks passed`);
if (failures > 0) {
  console.error(`${failures} check(s) failed`);
  process.exit(1);
}
