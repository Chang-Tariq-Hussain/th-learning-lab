import { frac, num } from "../format";
import { int, pick, shuffle } from "../rng";
import type { Generator, Rng } from "../types";

const topic = (id: string, label: string) => ({ id, module: "trigonometry" as const, label });

// Exact-value table in textbook form.
const SIN: Record<number, string> = { 0: "0", 30: "1/2", 45: "1/√2", 60: "√3/2", 90: "1" };
const COS: Record<number, string> = { 0: "1", 30: "√3/2", 45: "1/√2", 60: "1/2", 90: "0" };
const TAN: Record<number, string> = { 0: "0", 30: "1/√3", 45: "1", 60: "√3", 90: "undefined" };
const POOL = ["0", "1/2", "1/√2", "√3/2", "1", "√3", "1/√3", "undefined"];
const FN = { sin: SIN, cos: COS, tan: TAN } as const;
type Fn = keyof typeof FN;

/** Wrong answers from the exact-value pool, with caller's most tempting ones first. */
function poolWrong(rng: Rng, answer: string, tempting: string[]): string[] {
  const rest = shuffle(rng, POOL.filter((v) => v !== answer && !tempting.includes(v)));
  return [...tempting.filter((v) => v !== answer), ...rest];
}

const surd = (coef: number, rad: "" | "√2" | "√3") => (coef === 1 && rad ? rad : `${coef}${rad}`);

// ---------------------------------------------------------------- exact values
const exactValues: Generator = {
  topic: topic("exact-values", "Exact values (0°–90°)"),
  make(rng, d) {
    if (d >= 2) {
      const items: Array<{ expr: string; ans: string; wrong: string[]; steps: string[]; trick: string }> = [
        { expr: "sin 30° + cos 60°", ans: "1", wrong: ["1/2", "0", "√3/2", "2"], steps: ["sin 30° = 1/2, cos 60° = 1/2", "1/2 + 1/2 = 1"], trick: "sin 30° = cos 60° = 1/2 — they are complementary." },
        { expr: "sin 60° × cos 30°", ans: "3/4", wrong: ["√3/2", "1/2", "1", "3/2"], steps: ["sin 60° = √3/2, cos 30° = √3/2", "(√3/2)(√3/2) = 3/4"], trick: "√3 × √3 = 3, 2 × 2 = 4." },
        { expr: "tan 60° × tan 30°", ans: "1", wrong: ["√3", "1/√3", "3", "0"], steps: ["tan 60° = √3, tan 30° = 1/√3", "√3 × 1/√3 = 1"], trick: "tan θ × tan(90° − θ) = 1." },
        { expr: "sin 45° × cos 45°", ans: "1/2", wrong: ["1", "1/√2", "√2", "1/4"], steps: ["Each is 1/√2", "(1/√2)² = 1/2"], trick: "sin 45° = cos 45°, so the product is (1/√2)² = 1/2." },
        { expr: "2 sin 30° cos 30°", ans: "√3/2", wrong: ["1/2", "√3/4", "1", "√3"], steps: ["2 sin θ cos θ = sin 2θ", "= sin 60° = √3/2"], trick: "Double-angle: 2 sin θ cos θ = sin 2θ." },
        { expr: "cos² 45° + sin² 45°", ans: "1", wrong: ["1/2", "0", "2", "√2"], steps: ["cos² θ + sin² θ = 1 for every θ"], trick: "sin² + cos² = 1, whatever the angle." },
        { expr: "cos 60° + tan 45°", ans: "3/2", wrong: ["1", "1/2", "2", "√3/2"], steps: ["cos 60° = 1/2, tan 45° = 1", "1/2 + 1 = 3/2"], trick: "Learn the 3 × 3 table cold; it is worth marks every year." },
        { expr: "4 sin² 30° + 2 cos² 60°", ans: "3/2", wrong: ["3", "1", "2", "5/2"], steps: ["sin² 30° = 1/4, cos² 60° = 1/4", "4(1/4) + 2(1/4) = 1 + 1/2 = 3/2"], trick: "Square first, then multiply by the coefficient." },
        { expr: "sin 30° × tan 60°", ans: "√3/2", wrong: ["1/2", "√3", "1/√3", "1"], steps: ["(1/2)(√3) = √3/2"], trick: "Substitute exact values and keep surds exact." },
      ];
      const it = pick(rng, d === 2 ? items.slice(0, 6) : items.slice(3));
      return { prompt: `Evaluate: ${it.expr}`, answer: it.ans, wrong: it.wrong, steps: it.steps, trick: it.trick, trap: "Mixing up which angle gives 1/2 and which gives √3/2." };
    }
    const fn = pick(rng, ["sin", "cos", "tan"] as Fn[]);
    const ang = pick(rng, fn === "tan" ? [30, 45, 60] : [30, 45, 60, 0, 90]);
    const answer = FN[fn][ang]!;
    const comp = FN[fn][90 - ang]!;
    const other = FN[fn === "sin" ? "cos" : "sin"][ang]!;
    return {
      prompt: `Find the value of ${fn} ${ang}°.`,
      answer,
      wrong: poolWrong(rng, answer, [comp, other]),
      steps: [`From the standard table: ${fn} ${ang}° = ${answer}`],
      trick: fn === "tan" ? "tan θ = sin θ ÷ cos θ. tan 45° = 1 is the anchor." : "Sine rises 0, 1/2, 1/√2, √3/2, 1 across 0°, 30°, 45°, 60°, 90°; cosine is the same list reversed.",
      trap: `${comp} is the value of ${fn} ${90 - ang}°; sin and cos swap at the complementary angle.`,
    };
  },
};

// ---------------------------------------------------------------- special triangles (30-60-90, 45-45-90)
type Side = "opposite" | "adjacent" | "hypotenuse";
const SIDES: Record<30 | 45 | 60, Record<Side, [number, "" | "√2" | "√3"]>> = {
  30: { opposite: [1, ""], adjacent: [1, "√3"], hypotenuse: [2, ""] },
  60: { opposite: [1, "√3"], adjacent: [1, ""], hypotenuse: [2, ""] },
  45: { opposite: [1, ""], adjacent: [1, ""], hypotenuse: [1, "√2"] },
};

const specialTriangles: Generator = {
  topic: topic("special-triangles", "30-60-90 & 45-45-90 triangles"),
  make(rng, d) {
    const ang = (d === 1 ? pick(rng, [30, 60]) : pick(rng, [30, 45, 60])) as 30 | 45 | 60;
    const t = int(rng, 2, 9);
    const sideText = (s: Side) => {
      const [c, r] = SIDES[ang][s];
      return surd(c * t, r);
    };
    const pairs: Array<[Side, Side]> = d === 1 ? [["hypotenuse", "opposite"], ["hypotenuse", "adjacent"]] : d === 2 ? [["opposite", "hypotenuse"], ["adjacent", "hypotenuse"], ["hypotenuse", "opposite"], ["hypotenuse", "adjacent"]] : [["opposite", "adjacent"], ["adjacent", "opposite"], ["hypotenuse", "opposite"]];
    const [given, ask] = pick(rng, pairs.filter(([g]) => (ang === 45 && g === "hypotenuse" ? d === 3 : true)));
    const answer = sideText(ask);
    const third = (["opposite", "adjacent", "hypotenuse"] as Side[]).find((s) => s !== given && s !== ask)!;
    const phrase = (s: Side) => (s === "hypotenuse" ? "the hypotenuse" : `the side ${s} to the ${ang}° angle`);
    const stepsMap: Record<number, string> = {
      30: "30-60-90 sides are in the ratio 1 : √3 : 2 (opposite 30° : opposite 60° : hypotenuse)",
      60: "30-60-90 sides are in the ratio 1 : √3 : 2 (opposite 30° : opposite 60° : hypotenuse)",
      45: "45-45-90 sides are in the ratio 1 : 1 : √2 (leg : leg : hypotenuse)",
    };
    return {
      prompt: `In a right-angled triangle with an acute angle of ${ang}°, ${phrase(given)} is ${sideText(given)} cm. Find ${phrase(ask)}.`,
      figure: { kind: "right-triangle", angle: `${ang}°`, base: given === "adjacent" ? sideText(given) : ask === "adjacent" ? "?" : undefined, height: given === "opposite" ? sideText(given) : ask === "opposite" ? "?" : undefined, hyp: given === "hypotenuse" ? sideText(given) : ask === "hypotenuse" ? "?" : undefined },
      answer: `${answer} cm`,
      wrong: [`${sideText(third)} cm`, `${surd(t, "√3")} cm`, `${surd(2 * t, "")} cm`, `${surd(t, "√2")} cm`, `${surd(3 * t, "")} cm`],
      steps: [stepsMap[ang]!, `Here one unit is t = ${t}`, `${ask} = ${answer} cm`],
      trick: ang === 45 ? "Isosceles right triangle: legs equal, hypotenuse = leg × √2." : "Shortest side (opposite 30°) = t; other leg = t√3; hypotenuse = 2t.",
      trap: `${sideText(third)} cm is the third side; check which side the question asks for.`,
    };
  },
};

// ---------------------------------------------------------------- trig ratios from a right triangle
const PRIMITIVE: Array<[number, number, number]> = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];

const trigRatios: Generator = {
  topic: topic("trig-ratios", "Trig ratios (SOH-CAH-TOA)"),
  make(rng, d) {
    const [a, b, c] = pick(rng, PRIMITIVE);
    const set = {
      sin: frac(a, c), cos: frac(b, c), tan: frac(a, b),
      cosec: frac(c, a), sec: frac(c, b), cot: frac(b, a),
    };
    if (d === 3) {
      const givenFn = pick(rng, ["sin", "cos", "tan"] as const);
      const given = set[givenFn];
      const ask = pick(rng, (["sin", "cos", "tan", "cosec", "sec", "cot"] as const).filter((f) => f !== givenFn && !(givenFn === "tan" && f === "cot")));
      return {
        prompt: `If ${givenFn} θ = ${given} where θ is acute, find ${ask} θ.`,
        figure: { kind: "right-triangle", angle: "θ", base: String(b), height: String(a), hyp: String(c) },
        answer: set[ask],
        wrong: Array.from(new Set([set.sin, set.cos, set.tan, set.cosec, set.sec, set.cot].filter((v) => v !== set[ask]))),
        steps: [`Draw the right triangle with the given ratio: sides ${a}, ${b}, ${c}`, `sin = ${a}/${c}, cos = ${b}/${c}, tan = ${a}/${b}`, `${ask} θ = ${set[ask]}`],
        trick: "Build the triangle from the given ratio, find the third side with Pythagoras, then read off any ratio.",
        trap: "Reading the reciprocal (sec/cosec/cot) instead of the ratio asked for.",
      };
    }
    const fns = d === 1 ? (["sin", "cos", "tan"] as const) : (["sin", "cos", "tan", "cosec", "sec", "cot"] as const);
    const fn = pick(rng, fns);
    const words: Record<string, string> = { sin: "opposite ÷ hypotenuse", cos: "adjacent ÷ hypotenuse", tan: "opposite ÷ adjacent", cosec: "hypotenuse ÷ opposite", sec: "hypotenuse ÷ adjacent", cot: "adjacent ÷ opposite" };
    return {
      prompt: `In a right-angled triangle, the side opposite θ is ${a}, the side adjacent to θ is ${b} and the hypotenuse is ${c}. Find ${fn} θ.`,
      figure: { kind: "right-triangle", angle: "θ", base: String(b), height: String(a), hyp: String(c) },
      answer: set[fn],
      wrong: Array.from(new Set([set.cos, set.sin, set.tan, set.cot, set.sec, set.cosec].filter((v) => v !== set[fn]))),
      steps: [`${fn} θ = ${words[fn]}`, `= ${set[fn]}`],
      trick: "SOH-CAH-TOA. Sec, cosec, cot are just the reciprocals of cos, sin, tan.",
      trap: "Swapping opposite and adjacent (they are defined relative to θ).",
    };
  },
};

// ---------------------------------------------------------------- heights & distances
const heightsDistances: Generator = {
  topic: topic("heights-distances", "Heights & distances"),
  make(rng, d) {
    if (d === 3) {
      const t = int(rng, 3, 15);
      const x = 2 * t;
      return {
        prompt: `A man stands at some distance from a tower and sees its top at an angle of elevation of 30°. He walks ${x} m towards the tower and now sees the top at an elevation of 60°. Find the height of the tower.`,
        figure: { kind: "elevation", height: "h", distance: `${x} m closer`, angle: "30° → 60°" },
        answer: `${surd(t, "√3")} m`,
        wrong: [`${surd(x, "√3")} m`, `${t} m`, `${x} m`, `${surd(t, "√2")} m`],
        steps: [`Let height = h. At 30°: distance₁ = h√3. At 60°: distance₂ = h/√3`, `Walked = h√3 − h/√3 = 2h/√3 = ${x}`, `h = ${x}√3 ÷ 2 = ${surd(t, "√3")} m`],
        trick: "30° → 60° with a walked distance x: height = (x√3)/2. For 45° → 60° use x(3+√3)/2.",
        trap: `${surd(x, "√3")} m comes from treating the walked distance as the whole base.`,
      };
    }
    const mode = pick(rng, ["elevation", "depression", "shadow"] as const);
    const t = int(rng, 5, 40);
    if (mode === "depression") {
      return {
        prompt: `From the top of a cliff ${t} m high, the angle of depression of a boat is 30°. How far is the boat from the foot of the cliff?`,
        figure: { kind: "elevation", height: `${t} m`, distance: "?", angle: "30° (depression)" },
        answer: `${surd(t, "√3")} m`,
        wrong: [`${t} m`, `${surd(t * 2, "")} m`, `${num(t / 2)}√3 m`, `${surd(t, "√2")} m`],
        steps: [`Angle of depression = angle of elevation from the boat = 30°`, `tan 30° = height ÷ distance → 1/√3 = ${t} ÷ distance`, `distance = ${t}√3 m`],
        trick: "Angle of depression from above = angle of elevation from below (alternate angles).",
        trap: "Measuring the depression angle from the vertical instead of the horizontal.",
      };
    }
    if (mode === "shadow") {
      return {
        prompt: `A vertical pole's shadow is ${t} m long when the sun's elevation is 60°. Find the height of the pole.`,
        figure: { kind: "elevation", height: "?", distance: `${t} m`, angle: "60°" },
        answer: `${surd(t, "√3")} m`,
        wrong: [`${num(t)}/√3 m`, `${t} m`, `${surd(2 * t, "")} m`, `${surd(t, "√2")} m`],
        steps: [`tan 60° = height ÷ shadow`, `√3 = h ÷ ${t} → h = ${surd(t, "√3")} m`],
        trick: "tan = opposite ÷ adjacent = height ÷ ground distance. tan 60° = √3.",
        trap: `${t}/√3 uses tan 30° — the angle is at the SUN's side, 60° from the ground.`,
      };
    }
    const ang = pick(rng, [30, 45, 60]);
    const tH = d === 1 ? 10 * int(rng, 1, 8) : t;
    const dist = ang === 45 ? `${tH} m` : ang === 30 ? `${surd(tH, "√3")} m` : `${num(tH)}/√3 m`;
    const wrongs = ang === 45 ? [`${surd(tH, "√2")} m`, `${surd(tH, "√3")} m`, `${2 * tH} m`] : ang === 30 ? [`${tH} m`, `${num(tH)}/√3 m`, `${surd(tH * 2, "")} m`] : [`${surd(tH, "√3")} m`, `${tH} m`, `${surd(2 * tH, "")} m`];
    return {
      prompt: `A tower is ${tH} m high. The angle of elevation of its top from a point on the ground is ${ang}°. How far is the point from the foot of the tower?`,
      figure: { kind: "elevation", height: `${tH} m`, distance: "?", angle: `${ang}°` },
      answer: dist,
      wrong: wrongs,
      steps: [`tan ${ang}° = height ÷ distance`, `distance = ${tH} ÷ tan ${ang}° = ${tH} ÷ ${TAN[ang]}`, `= ${dist}`],
      trick: "distance = height ÷ tan θ. At 45° the distance equals the height; smaller angle → farther away.",
      trap: ang === 30 ? "Using tan 60° (√3 in the numerator is the wrong way round)." : "Multiplying instead of dividing by tan θ.",
    };
  },
};

// ---------------------------------------------------------------- identities
const identities: Generator = {
  topic: topic("identities", "Trigonometric identities"),
  make(rng, d) {
    if (d === 1) {
      const items: Array<{ expr: string; ans: string; wrong: string[]; steps: string[]; trick: string }> = [
        { expr: "sin²θ + cos²θ", ans: "1", wrong: ["0", "2", "sin θ cos θ", "tan θ"], steps: ["Pythagorean identity"], trick: "sin² + cos² = 1 — the parent of all the others." },
        { expr: "1 + tan²θ", ans: "sec²θ", wrong: ["cosec²θ", "cot²θ", "sin²θ", "cos²θ"], steps: ["Divide sin² + cos² = 1 by cos²θ", "tan²θ + 1 = sec²θ"], trick: "Divide by cos² → tan and sec; divide by sin² → cot and cosec." },
        { expr: "1 + cot²θ", ans: "cosec²θ", wrong: ["sec²θ", "tan²θ", "cos²θ", "sin²θ"], steps: ["Divide sin² + cos² = 1 by sin²θ", "1 + cot²θ = cosec²θ"], trick: "Divide by sin² → cot and cosec." },
        { expr: "sin θ · cosec θ", ans: "1", wrong: ["0", "sin²θ", "tan θ", "cos θ"], steps: ["cosec θ = 1/sin θ", "sin θ × (1/sin θ) = 1"], trick: "Reciprocal pairs multiply to 1: sin·cosec, cos·sec, tan·cot." },
        { expr: "sec²θ − tan²θ", ans: "1", wrong: ["0", "sec θ", "cos²θ", "-1"], steps: ["From 1 + tan²θ = sec²θ"], trick: "Rearrange 1 + tan² = sec²." },
        { expr: "(1 + sin θ)(1 − sin θ)", ans: "cos²θ", wrong: ["sin²θ", "1", "cos θ", "1 − cos θ"], steps: ["Difference of squares: 1 − sin²θ", "= cos²θ"], trick: "(1 + x)(1 − x) = 1 − x²; then 1 − sin² = cos²." },
      ];
      const it = pick(rng, items);
      return { prompt: `Simplify: ${it.expr}`, answer: it.ans, wrong: it.wrong, steps: it.steps, trick: it.trick, trap: "Confusing sec/cosec or tan/cot when applying the identity." };
    }
    const [a, b, c] = pick(rng, PRIMITIVE);
    if (d === 2) {
      if (rng() < 0.5) {
        return {
          prompt: `If sin θ = ${frac(a, c)} and θ is acute, find cos θ.`,
          answer: frac(b, c),
          wrong: [frac(a, b), frac(c, b), frac(a, c), frac(c * c - a * a, c * c)],
          steps: [`cos²θ = 1 − sin²θ = 1 − ${a * a}/${c * c} = ${b * b}/${c * c}`, `cos θ = ${frac(b, c)} (positive, θ acute)`],
          trick: "Spot the Pythagorean triple: the missing side gives the ratio directly.",
          trap: `${frac(c * c - a * a, c * c)} is cos²θ — you still have to take the square root.`,
        };
      }
      return {
        prompt: `If tan θ = ${frac(a, b)} and θ is acute, find sin θ + cos θ.`,
        answer: frac(a + b, c),
        wrong: [frac(a * b, c * c), frac(a + b, b), frac(1, 1), frac(a + b + c, c)],
        steps: [`tan θ = ${a}/${b} → hypotenuse = ${c}`, `sin θ = ${frac(a, c)}, cos θ = ${frac(b, c)}`, `Sum = ${frac(a + b, c)}`],
        trick: "tan θ = opposite/adjacent → build the triangle, find the hypotenuse, read the ratios.",
        trap: "Adding fractions with different denominators without a common one — here both are over the hypotenuse.",
      };
    }
    return {
      prompt: `If cos θ = ${frac(b, c)} and θ is acute, find 1 + tan²θ.`,
      answer: frac(c * c, b * b),
      wrong: [frac(c, b), frac(b * b, c * c), frac(a * a, b * b), frac(c * c, a * a)],
      steps: [`1 + tan²θ = sec²θ = 1 / cos²θ`, `= (${c}/${b})² = ${frac(c * c, b * b)}`],
      trick: "1 + tan²θ = sec²θ = 1/cos²θ — no need to find tan θ at all.",
      trap: `${frac(c, b)} is sec θ; the question asks for sec²θ.`,
    };
  },
};

// ---------------------------------------------------------------- radians & arcs
const piText = (n: number, dd: number): string => {
  const t = frac(n, dd);
  const [p, q] = t.includes("/") ? t.split("/").map(Number) : [Number(t), 1];
  const numPart = p === 1 ? "π" : `${p}π`;
  return q === 1 ? numPart : `${numPart}/${q}`;
};

const radiansArcs: Generator = {
  topic: topic("radians-arcs", "Radians, arcs & sectors"),
  make(rng, d) {
    if (d === 1) {
      if (rng() < 0.5) {
        const deg = pick(rng, [30, 45, 60, 90, 120, 135, 150, 210, 225, 240, 270, 300]);
        return {
          prompt: `Convert ${deg}° to radians.`,
          answer: piText(deg, 180),
          wrong: [piText(deg, 360), piText(deg, 90), piText(deg + 30, 180), piText(180, deg)],
          steps: [`radians = degrees × π/180`, `= ${deg} × π/180 = ${piText(deg, 180)}`],
          trick: "π rad = 180°. Treat π as 180° and simplify the fraction.",
          trap: "Using 360° instead of 180° in the conversion.",
        };
      }
      const [n, dd] = pick(rng, [[1, 6], [1, 4], [1, 3], [1, 2], [2, 3], [3, 4], [5, 6], [5, 4], [3, 2]] as Array<[number, number]>);
      const degrees = (180 * n) / dd;
      return {
        prompt: `Convert ${piText(n, dd)} radians to degrees.`,
        answer: `${num(degrees)}°`,
        wrong: [`${num(degrees * 2)}°`, `${num(degrees / 2)}°`, `${num(degrees + 30)}°`, `${num(360 - degrees)}°`],
        steps: [`degrees = radians × 180/π`, `= ${piText(n, dd)} × 180/π = ${num(degrees)}°`],
        trick: "Replace π with 180°: π/3 → 180/3 = 60°.",
        trap: "Replacing π with 360° (that gives double).",
      };
    }
    const r = pick(rng, [6, 9, 12, 18, 21, 24]);
    const deg = pick(rng, [30, 45, 60, 90, 120, 150]);
    if (d === 2) {
      return {
        prompt: `Find the length of an arc of a circle of radius ${r} cm that subtends an angle of ${deg}° at the centre. (Leave π in the answer)`,
        figure: { kind: "circle", radius: `${r} cm`, angle: `${deg}°` },
        answer: `${piText(r * deg, 180)} cm`,
        wrong: [`${piText(r * deg, 360)} cm`, `${piText(r * deg * 2, 180)} cm`, `${piText(r * r * deg, 360)} cm`, `${piText(deg, 180)} cm`],
        steps: [`Arc = (θ/360°) × 2πr = (${deg}/360) × 2π × ${r}`, `= ${piText(r * deg, 180)} cm`],
        trick: "Arc = r × θ (θ in radians). Convert θ = deg × π/180 first.",
        trap: `${piText(r * r * deg, 360)} is the sector AREA formula, not the arc length.`,
      };
    }
    return {
      prompt: `Find the area of a sector of a circle of radius ${r} cm with a central angle of ${deg}°. (Leave π in the answer)`,
      figure: { kind: "circle", radius: `${r} cm`, angle: `${deg}°` },
      answer: `${piText(r * r * deg, 360)} cm²`,
      wrong: [`${piText(r * deg, 180)} cm²`, `${piText(r * r * deg, 180)} cm²`, `${piText(r * r * deg, 720)} cm²`, `${piText(r * r, 1)} cm²`],
      steps: [`Sector area = (θ/360°) × πr² = (${deg}/360) × π × ${r}²`, `= ${piText(r * r * deg, 360)} cm²`],
      trick: "Sector = ½ r² θ with θ in radians — or the fraction θ/360 of the full circle.",
      trap: "Using the arc-length formula (r not squared).",
    };
  },
};

// ---------------------------------------------------------------- complementary angles
const complementary: Generator = {
  topic: topic("complementary", "Complementary angle tricks"),
  make(rng, d) {
    if (d === 1) {
      const A = pick(rng, [15, 20, 25, 35, 40, 55, 65, 70]);
      const f = pick(rng, ["sin", "tan", "sec"] as const);
      const co = f === "sin" ? "cos" : f === "tan" ? "cot" : "cosec";
      return {
        prompt: `${f} ${A}° = ${co} (?)°. Find the missing angle.`,
        answer: `${90 - A}°`,
        wrong: [`${A}°`, `${180 - A}°`, `${90 + A}°`, `${A + 5}°`],
        steps: [`${f} θ = ${co}(90° − θ)`, `Missing = 90° − ${A}° = ${90 - A}°`],
        trick: "Co-function rule: f(θ) = cofunction(90° − θ).",
        trap: `${180 - A}° uses the supplementary rule (180°) instead of the complementary one (90°).`,
      };
    }
    if (d === 2) {
      const A = pick(rng, [20, 25, 35, 40, 55, 65]);
      const B = pick(rng, [15, 30, 50, 60, 70].filter((x) => x !== A));
      return {
        prompt: `Evaluate: sin ${A}° / cos ${90 - A}° + cos ${B}° / sin ${90 - B}°`,
        answer: "2",
        wrong: ["1", "0", "1/2", "√3"],
        steps: [`cos ${90 - A}° = sin ${A}° so the first term is 1`, `sin ${90 - B}° = cos ${B}° so the second term is 1`, `1 + 1 = 2`],
        trick: "Rewrite each denominator with the co-function; every fraction collapses to 1.",
        trap: "Computing decimals instead of spotting the complementary pair.",
      };
    }
    const a = pick(rng, [10, 15, 20, 25]);
    const b = pick(rng, [30, 35, 40].filter((x) => x !== a));
    return {
      prompt: `Evaluate: tan ${a}° · tan ${b}° · tan 45° · tan ${90 - b}° · tan ${90 - a}°`,
      answer: "1",
      wrong: ["0", "2", "1/2", "undefined"],
      steps: [`tan θ · tan(90° − θ) = 1`, `tan ${a}° · tan ${90 - a}° = 1 and tan ${b}° · tan ${90 - b}° = 1`, `tan 45° = 1 → product = 1`],
      trick: "Pair the angles that add to 90°. Each pair gives 1, and tan 45° is 1.",
      trap: "Multiplying out values — it is hopeless without a calculator.",
    };
  },
};

// ---------------------------------------------------------------- quadrants & reference angles
const quadrantSigns: Generator = {
  topic: topic("quadrant-signs", "Quadrants & signs (CAST)"),
  make(rng, d) {
    if (d === 1) {
      const items: Array<{ q: string; ans: string; wrong: string[] }> = [
        { q: "sin θ is positive and cos θ is negative", ans: "Second", wrong: ["First", "Third", "Fourth"] },
        { q: "sin θ and cos θ are both negative", ans: "Third", wrong: ["First", "Second", "Fourth"] },
        { q: "tan θ is negative and cos θ is positive", ans: "Fourth", wrong: ["First", "Second", "Third"] },
        { q: "all three ratios (sin, cos, tan) are positive", ans: "First", wrong: ["Second", "Third", "Fourth"] },
        { q: "tan θ is positive and sin θ is negative", ans: "Third", wrong: ["First", "Second", "Fourth"] },
      ];
      const it = pick(rng, items);
      return {
        prompt: `In which quadrant does θ lie if ${it.q}?`,
        answer: `${it.ans} quadrant`,
        wrong: it.wrong.map((w) => `${w} quadrant`),
        steps: ["CAST rule, anticlockwise from the fourth quadrant: C (cos) — A (all) — S (sin) — T (tan)", `The quadrant where this combination holds is the ${it.ans.toLowerCase()}`],
        trick: "All Students Take Chemistry: I = All, II = Sin, III = Tan, IV = Cos positive.",
        trap: "Counting quadrants clockwise.",
      };
    }
    const fn = pick(rng, ["sin", "cos", "tan"] as Fn[]);
    const ang = pick(rng, d === 2 ? [120, 135, 150, 210, 225, 240] : [120, 135, 150, 210, 225, 240, 300, 315, 330]);
    const quad = ang < 180 ? 2 : ang < 270 ? 3 : 4;
    const ref = quad === 2 ? 180 - ang : quad === 3 ? ang - 180 : 360 - ang;
    const mag = FN[fn][ref]!;
    const positive = fn === "sin" ? quad === 2 : fn === "cos" ? quad === 4 : quad === 3;
    const signed = (positive || mag === "0") ? mag : `−${mag}`;
    const flip = positive ? `−${mag}` : mag;
    return {
      prompt: `Find the exact value of ${fn} ${ang}°.`,
      answer: signed,
      wrong: [flip, ...poolWrong(rng, mag, [FN[fn === "sin" ? "cos" : "sin"][ref]!]).slice(0, 3).map((v) => (positive ? v : `−${v}`))],
      steps: [`${ang}° is in quadrant ${quad === 2 ? "II" : quad === 3 ? "III" : "IV"}; reference angle = ${ref}°`, `|${fn} ${ref}°| = ${mag}`, `${fn} is ${positive ? "positive" : "negative"} there → ${signed}`],
      trick: "Reduce to the reference angle, take its value, then apply the CAST sign.",
      trap: `Dropping the sign (${mag}) — only quadrant I has all positives.`,
    };
  },
};

export const TRIG_GENERATORS: Generator[] = [exactValues, specialTriangles, trigRatios, heightsDistances, identities, radiansArcs, complementary, quadrantSigns];
