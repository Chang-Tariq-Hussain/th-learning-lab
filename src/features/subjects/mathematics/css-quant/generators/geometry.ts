import { num, ratioText, simplifyRatio } from "../format";
import { int, pick } from "../rng";
import type { Generator } from "../types";

const topic = (id: string, label: string) => ({ id, module: "geometry" as const, label });
const deg = (n: number) => `${num(n)}°`;

const TRIPLES: Array<[number, number, number]> = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
const SMALL_TRIPLES = TRIPLES.slice(0, 4);

// ---------------------------------------------------------------- angles in a triangle
const triangleAngles: Generator = {
  topic: topic("triangle-angles", "Angles of a triangle"),
  make(rng, d) {
    if (d === 2) {
      const e = int(rng, 100, 150);
      const a = int(rng, 30, e - 40);
      const other = e - a;
      return {
        prompt: `The exterior angle at one vertex of a triangle is ${deg(e)} and one of the two interior opposite angles is ${deg(a)}. Find the other interior opposite angle.`,
        figure: { kind: "triangle", a: deg(a), b: "?", c: `ext ${deg(e)}` },
        answer: deg(other),
        wrong: [deg(180 - e), deg(180 - a), deg(e + a), deg(180 - other)],
        steps: [`Exterior angle = sum of the two interior opposite angles`, `${e} = ${a} + x → x = ${e} − ${a} = ${other}`],
        trick: "Exterior angle theorem: exterior = sum of the two FAR interior angles. No need for 180.",
        trap: `${deg(180 - e)} is the interior angle ADJACENT to the exterior angle, not the opposite one.`,
      };
    }
    const sets: Array<[number, number, number]> = [[1, 2, 3], [2, 3, 4], [3, 4, 5], [1, 3, 5], [2, 3, 5], [4, 5, 6], [1, 4, 7], [1, 2, 6]];
    const parts = pick(rng, sets);
    const sum = parts[0] + parts[1] + parts[2];
    const k = 180 / sum;
    const [mn, md, mx] = parts;
    const rt = parts.join(" : ");
    if (d === 3) {
      const answer = 180 - k * mx;
      return {
        prompt: `The angles of a triangle are in the ratio ${rt}. Find its smallest exterior angle.`,
        figure: { kind: "triangle", a: `${mn}x`, b: `${md}x`, c: `${mx}x` },
        answer: deg(answer),
        wrong: [deg(180 - k * mn), deg(k * mx), deg(k * mn), deg(180 - k * md)],
        steps: [`${mn}x + ${md}x + ${mx}x = 180 → x = ${num(k)}`, `Angles: ${deg(k * mn)}, ${deg(k * md)}, ${deg(k * mx)}`, `Exterior = 180° − interior; smallest exterior comes from the LARGEST interior: 180 − ${k * mx} = ${answer}`],
        trick: "Smallest exterior ↔ largest interior (they sum to 180°).",
        trap: `${deg(180 - k * mn)} is the LARGEST exterior angle.`,
      };
    }
    return {
      prompt: `The angles of a triangle are in the ratio ${rt}. Find the largest angle.`,
      figure: { kind: "triangle", a: `${mn}x`, b: `${md}x`, c: `${mx}x` },
      answer: deg(k * mx),
      wrong: [deg(k * md), deg(k * mn), deg(60), deg(k * mx + 10)],
      steps: [`${mn}x + ${md}x + ${mx}x = 180°`, `${sum}x = 180 → x = ${num(k)}`, `Largest = ${mx} × ${num(k)} = ${deg(k * mx)}`],
      trick: "Angle sum = 180°. Divide 180 by the sum of the ratio parts.",
      trap: "Using 360° (quadrilateral) or dividing by the number of angles.",
    };
  },
};

// ---------------------------------------------------------------- Pythagoras
const pythagoras: Generator = {
  topic: topic("pythagoras", "Pythagoras theorem"),
  make(rng, d) {
    const [a0, b0, c0] = pick(rng, d === 1 ? SMALL_TRIPLES : TRIPLES);
    const k = d === 1 ? int(rng, 1, 3) : int(rng, 1, 4);
    const a = a0 * k;
    const b = b0 * k;
    const c = c0 * k;
    if (d === 3) {
      const [p, q, r] = pick(rng, SMALL_TRIPLES);
      const d1 = 2 * p * k;
      const d2 = 2 * q * k;
      const side = r * k;
      return {
        prompt: `The diagonals of a rhombus are ${d1} cm and ${d2} cm. Find its perimeter.`,
        figure: { kind: "right-triangle", base: `${d2 / 2}`, height: `${d1 / 2}`, hyp: "side" },
        answer: `${4 * side} cm`,
        wrong: [`${side} cm`, `${2 * (d1 + d2)} cm`, `${(d1 * d2) / 2} cm`, `${4 * (p + q) * k} cm`],
        steps: [`Diagonals of a rhombus bisect each other at right angles`, `Half-diagonals: ${d1 / 2} and ${d2 / 2}`, `Side = √(${d1 / 2}² + ${d2 / 2}²) = ${side}`, `Perimeter = 4 × ${side} = ${4 * side} cm`],
        trick: "Rhombus: four right triangles with legs = half-diagonals. Side = hypotenuse; perimeter = 4 × side.",
        trap: `${(d1 * d2) / 2} cm² is the AREA, not the perimeter.`,
      };
    }
    if (d === 2 && rng() < 0.5) {
      return {
        prompt: `A ladder ${c} m long rests against a vertical wall and reaches a height of ${b} m. How far is its foot from the wall?`,
        figure: { kind: "right-triangle", base: "?", height: `${b} m`, hyp: `${c} m` },
        answer: `${a} m`,
        wrong: [`${c - b} m`, `${num(Math.sqrt(c * c + b * b), 1)} m`, `${a + 1} m`, `${b - a} m`],
        steps: [`Ladder = hypotenuse = ${c}, wall height = ${b}`, `Foot distance² = ${c}² − ${b}² = ${c * c - b * b}`, `Distance = ${a} m`],
        trick: `Spot the triple ${a0}-${b0}-${c0}${k > 1 ? ` (×${k})` : ""}: if you recognise it, no squaring needed.`,
        trap: `Subtracting lengths (${c} − ${b}) instead of subtracting SQUARES.`,
      };
    }
    const findHyp = d === 1 || rng() < 0.5;
    if (findHyp) {
      return {
        prompt: `The two perpendicular sides of a right-angled triangle are ${a} cm and ${b} cm. Find the hypotenuse.`,
        figure: { kind: "right-triangle", base: `${a}`, height: `${b}`, hyp: "?" },
        answer: `${c} cm`,
        wrong: [`${a + b} cm`, `${num(Math.sqrt(Math.abs(b * b - a * a)), 1)} cm`, `${c + 1} cm`, `${(a * b) / 2} cm`],
        steps: [`c² = a² + b² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b}`, `c = √${a * a + b * b} = ${c} cm`],
        trick: `Memorise triples: 3-4-5, 5-12-13, 8-15-17, 7-24-25, 20-21-29 (and their multiples).`,
        trap: "Adding the sides, or subtracting squares when you need to ADD them.",
      };
    }
    return {
      prompt: `The hypotenuse of a right-angled triangle is ${c} cm and one side is ${a} cm. Find the third side.`,
      figure: { kind: "right-triangle", base: `${a}`, height: "?", hyp: `${c}` },
      answer: `${b} cm`,
      wrong: [`${c - a} cm`, `${num(Math.sqrt(a * a + c * c), 1)} cm`, `${b + 1} cm`, `${a + c} cm`],
      steps: [`b² = c² − a² = ${c * c} − ${a * a} = ${c * c - a * a}`, `b = √${c * c - a * a} = ${b} cm`],
      trick: "Hypotenuse is the LONGEST side: subtract squares to find a leg.",
      trap: `${num(Math.sqrt(a * a + c * c), 1)} cm adds the squares — only correct when finding the hypotenuse.`,
    };
  },
};

// ---------------------------------------------------------------- circle mensuration (π = 22/7)
const circleMensuration: Generator = {
  topic: topic("circle-mensuration", "Circle: area & circumference"),
  make(rng, d) {
    const k = int(rng, 1, 5);
    const r = 7 * k;
    if (d === 3) {
      const N = pick(rng, [100, 200, 250, 500, 1000]);
      const distM = (44 * k * N) / 100;
      return {
        prompt: `A wheel has radius ${r} cm. How many complete revolutions does it make in covering ${num(distM)} m? (Use π = 22/7)`,
        figure: { kind: "circle", radius: `${r} cm` },
        answer: `${N}`,
        wrong: [`${N * 2}`, `${num(N / 2)}`, `${num((distM * 100) / r)}`, `${N + 50}`],
        steps: [`Circumference = 2πr = 2 × 22/7 × ${r} = ${44 * k} cm`, `Distance = ${num(distM)} m = ${num(distM * 100)} cm`, `Revolutions = ${num(distM * 100)} ÷ ${44 * k} = ${N}`],
        trick: "One revolution = one circumference. Convert distance to the SAME unit first.",
        trap: "Dividing by the radius or diameter instead of the circumference; or mixing m and cm.",
      };
    }
    if (d === 2) {
      return {
        prompt: `The circumference of a circle is ${44 * k} cm. Find its area. (Use π = 22/7)`,
        figure: { kind: "circle", label: `C = ${44 * k} cm` },
        answer: `${154 * k * k} cm²`,
        wrong: [`${44 * k} cm²`, `${154 * k} cm²`, `${308 * k * k} cm²`, `${77 * k * k} cm²`],
        steps: [`2πr = ${44 * k} → r = ${44 * k} ÷ (2 × 22/7) = ${r} cm`, `Area = πr² = 22/7 × ${r}² = ${154 * k * k} cm²`],
        trick: "Circumference first gives radius; for r = 7k: C = 44k and Area = 154k².",
        trap: "Using the diameter as the radius (gives 4× the area).",
      };
    }
    return {
      prompt: `Find the area of a circle of radius ${r} cm. (Use π = 22/7)`,
      figure: { kind: "circle", radius: `${r} cm` },
      answer: `${154 * k * k} cm²`,
      wrong: [`${44 * k} cm²`, `${308 * k * k} cm²`, `${154 * k} cm²`, `${num(154 * k * k * 2 * 7 / 22)} cm²`],
      steps: [`Area = πr² = 22/7 × ${r} × ${r}`, `= 22 × ${k} × ${r} = ${154 * k * k} cm²`],
      trick: "Cancel the 7 in π = 22/7 against the radius (a multiple of 7) before multiplying.",
      trap: `${44 * k} cm is the circumference (2πr), not the area.`,
    };
  },
};

// ---------------------------------------------------------------- rectangle & square area
const rectangleArea: Generator = {
  topic: topic("rectangle-area", "Rectangles & percentage change"),
  make(rng, d) {
    if (d === 3) {
      const x = pick(rng, [10, 20, 30, 40, 50]);
      const inc = (2 * x * 100 + x * x) / 100;
      return {
        prompt: `The side of a square is increased by ${x}%. By what percent does its area increase?`,
        figure: { kind: "rectangle", w: "s", h: "s" },
        answer: `${num(inc)}%`,
        wrong: [`${x}%`, `${2 * x}%`, `${num((x * x) / 100)}%`, `${num(inc + x)}%`],
        steps: [`New side = ${100 + x}% of s = ${num((100 + x) / 100)}s`, `New area = ${num(((100 + x) / 100) ** 2)}s²`, `Increase = ${num(inc)}%`],
        trick: `Area change % = 2x + x²/100 = ${2 * x} + ${num((x * x) / 100)} = ${num(inc)}.`,
        trap: `${2 * x}% forgets the extra x²/100 term from the corner piece.`,
      };
    }
    if (d === 2) {
      const [x, y] = pick(rng, [[20, 20], [25, 20], [10, 10], [50, 20], [30, 10]] as Array<[number, number]>);
      const net = ((100 + x) * (100 - y) - 10000) / 100;
      const word = (v: number) => (v === 0 ? "no change" : `${num(Math.abs(v))}% ${v > 0 ? "increase" : "decrease"}`);
      return {
        prompt: `The length of a rectangle is increased by ${x}% and its breadth is decreased by ${y}%. What happens to its area?`,
        figure: { kind: "rectangle", w: `l +${x}%`, h: `b −${y}%` },
        answer: word(net),
        wrong: [word(x - y), word(-net === 0 ? 1 : -net), word(net + 2), word((x + y) / 2)].filter((w) => w !== word(net)),
        steps: [`New area = l(${100 + x}/100) × b(${100 - y}/100)`, `= ${num(((100 + x) * (100 - y)) / 10000)} lb`, `Change = ${num(net)}%`],
        trick: `Net % = x + y + xy/100 with signs: ${x} + (−${y}) + (${x}×−${y})/100 = ${num(net)}.`,
        trap: `Simply subtracting the percentages (${x} − ${y}) ignores the cross term.`,
      };
    }
    const [p, q] = pick(rng, [[5, 3], [4, 3], [3, 2], [7, 5], [5, 4]] as Array<[number, number]>);
    const k = int(rng, 2, 6);
    const P = 2 * (p + q) * k;
    const area = p * q * k * k;
    return {
      prompt: `The length and breadth of a rectangle are in the ratio ${p} : ${q} and its perimeter is ${P} cm. Find its area.`,
      figure: { kind: "rectangle", w: `${p}x`, h: `${q}x` },
      answer: `${area} cm²`,
      wrong: [`${p * q * k} cm²`, `${area * 2} cm²`, `${(P * P) / 16} cm²`, `${num(area / 2)} cm²`],
      steps: [`Let sides be ${p}x and ${q}x`, `Perimeter = 2(${p}x + ${q}x) = ${2 * (p + q)}x = ${P} → x = ${k}`, `Sides = ${p * k} cm and ${q * k} cm`, `Area = ${p * k} × ${q * k} = ${area} cm²`],
      trick: "Perimeter = 2(l + b) → l + b is HALF the perimeter. Split that half in the ratio.",
      trap: "Using the full perimeter as l + b.",
    };
  },
};

// ---------------------------------------------------------------- polygons
const polygonAngles: Generator = {
  topic: topic("polygon-angles", "Polygons & angle sums"),
  make(rng, d) {
    const ns = [5, 6, 8, 9, 10, 12];
    const n = pick(rng, ns);
    const names: Record<number, string> = { 5: "pentagon", 6: "hexagon", 8: "octagon", 9: "nonagon", 10: "decagon", 12: "dodecagon" };
    if (d === 1) {
      const asksSum = rng() < 0.4;
      if (asksSum) {
        const s = (n - 2) * 180;
        return {
          prompt: `Find the sum of the interior angles of a ${names[n]} (${n} sides).`,
          answer: deg(s),
          wrong: [deg((n - 1) * 180), deg(n * 180), deg(360), deg(s - 180)],
          steps: [`Sum = (n − 2) × 180° = (${n} − 2) × 180°`, `= ${s}°`],
          trick: "Split from one vertex into (n − 2) triangles, each 180°.",
          trap: `${deg(360)} is the sum of the EXTERIOR angles — true for every polygon.`,
        };
      }
      const each = ((n - 2) * 180) / n;
      return {
        prompt: `Find each interior angle of a regular ${names[n]}.`,
        answer: deg(each),
        wrong: [deg(360 / n), deg(((n - 1) * 180) / n), deg(each + 10), deg(180 - each + 10)],
        steps: [`Exterior angle = 360° ÷ ${n} = ${num(360 / n)}°`, `Interior = 180° − ${num(360 / n)}° = ${deg(each)}`],
        trick: "Interior = 180° − (360° ÷ n). Faster than (n − 2) × 180 ÷ n.",
        trap: `${deg(360 / n)} is the exterior angle.`,
      };
    }
    if (d === 2) {
      if (rng() < 0.5) {
        const e = pick(rng, [30, 36, 40, 45, 60, 72]);
        return {
          prompt: `Each exterior angle of a regular polygon is ${deg(e)}. How many sides does it have?`,
          answer: `${360 / e}`,
          wrong: [`${180 / e}`, `${360 / e + 2}`, `${num(360 / (180 - e))}`, `${360 / e - 1}`],
          steps: [`Sum of exterior angles = 360°`, `n = 360 ÷ ${e} = ${360 / e}`],
          trick: "n = 360 ÷ exterior angle. If given the INTERIOR angle, subtract from 180 first.",
          trap: "Dividing 180 or the interior angle into 360.",
        };
      }
      const diag = (n * (n - 3)) / 2;
      return {
        prompt: `How many diagonals does a polygon with ${n} sides have?`,
        answer: `${diag}`,
        wrong: [`${n * (n - 3)}`, `${(n * (n - 1)) / 2}`, `${n * (n - 2)}`, `${diag + n}`],
        steps: [`Diagonals = n(n − 3) ÷ 2`, `= ${n} × ${n - 3} ÷ 2 = ${diag}`],
        trick: "n(n − 3)/2. The (n − 3) removes the vertex itself and its two neighbours.",
        trap: `${(n * (n - 1)) / 2} counts every pair of vertices, including the sides.`,
      };
    }
    const asksFromInterior = rng() < 0.5;
    if (asksFromInterior) {
      const interior = ((n - 2) * 180) / n;
      return {
        prompt: `Each interior angle of a regular polygon is ${deg(interior)}. How many sides does the polygon have?`,
        answer: `${n}`,
        wrong: [`${n + 2}`, `${n - 1}`, `${num(360 / interior)}`, `${n * 2}`],
        steps: [`Exterior = 180° − ${interior}° = ${num(180 - interior)}°`, `n = 360 ÷ ${num(180 - interior)} = ${n}`],
        trick: "Interior → exterior (180 − interior) → n = 360 ÷ exterior.",
        trap: "Dividing 360 by the INTERIOR angle.",
      };
    }
    const S = (n - 2) * 180;
    return {
      prompt: `The sum of the interior angles of a polygon is ${deg(S)}. How many sides does it have?`,
      answer: `${n}`,
      wrong: [`${n - 2}`, `${n + 1}`, `${num(S / 180)}`, `${n - 1}`],
      steps: [`(n − 2) × 180 = ${S}`, `n − 2 = ${S / 180} → n = ${n}`],
      trick: "n = S ÷ 180 + 2. Don't forget the +2.",
      trap: `${S / 180} is the number of triangles, n − 2, not n.`,
    };
  },
};

// ---------------------------------------------------------------- similar figures
const similarFigures: Generator = {
  topic: topic("similar-figures", "Similar triangles & scale"),
  make(rng, d) {
    const [p, q] = pick(rng, [[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [5, 7]] as Array<[number, number]>);
    if (d === 3) {
      const small = p * int(rng, 3, 8) * 2;
      const large = (small * q) / p;
      return {
        prompt: `The areas of two similar triangles are in the ratio ${p * p} : ${q * q}. If the perimeter of the smaller is ${small} cm, find the perimeter of the larger.`,
        figure: { kind: "similar", small: `${p}`, large: `${q}` },
        answer: `${num(large)} cm`,
        wrong: [`${num((small * q * q) / (p * p))} cm`, `${num(small + (q * q - p * p))} cm`, `${num((small * (q + 1)) / p)} cm`, `${num(small * q)} cm`],
        steps: [`Ratio of areas = ${p * p} : ${q * q} → ratio of sides = ${p} : ${q}`, `Perimeters are in the same ratio as sides`, `Larger = ${small} × ${q}/${p} = ${num(large)} cm`],
        trick: "Area ratio = (side ratio)². Take the SQUARE ROOT to get the side or perimeter ratio.",
        trap: "Using the area ratio directly on the perimeter.",
      };
    }
    const sSmall = p * int(rng, 2, 6);
    const areaSmall = int(rng, 2, 6) * p * p;
    const areaLarge = (areaSmall * q * q) / (p * p);
    if (d === 1) {
      const sLarge = (sSmall * q) / p;
      return {
        prompt: `Two similar triangles have corresponding sides ${sSmall} cm and ${num(sLarge)} cm. Find the ratio of their areas (smaller : larger).`,
        figure: { kind: "similar", small: `${sSmall} cm`, large: `${num(sLarge)} cm` },
        answer: ratioText([p * p, q * q]),
        wrong: [ratioText([p, q]), ratioText([q * q, p * p]), ratioText([p * p, q]), ratioText(simplifyRatio([p * p + 1, q * q]))],
        steps: [`Side ratio = ${sSmall} : ${num(sLarge)} = ${p} : ${q}`, `Area ratio = ${p}² : ${q}² = ${p * p} : ${q * q}`],
        trick: "Similar figures: ratio of areas = SQUARE of the ratio of sides.",
        trap: `${p} : ${q} is the ratio of the SIDES.`,
      };
    }
    return {
      prompt: `Two similar triangles have corresponding sides in the ratio ${p} : ${q}. If the area of the smaller triangle is ${areaSmall} cm², find the area of the larger.`,
      figure: { kind: "similar", small: `${p}`, large: `${q}` },
      answer: `${num(areaLarge)} cm²`,
      wrong: [`${num((areaSmall * q) / p)} cm²`, `${num(areaSmall + (q - p))} cm²`, `${num((areaSmall * p * p) / (q * q))} cm²`, `${num((areaSmall * q * q) / p)} cm²`],
      steps: [`Area ratio = ${p}² : ${q}² = ${p * p} : ${q * q}`, `Larger area = ${areaSmall} × ${q * q}/${p * p} = ${num(areaLarge)} cm²`],
      trick: "Scale factor k for lengths → k² for areas → k³ for volumes.",
      trap: "Forgetting to square the ratio (gives the answer for a LENGTH, not an area).",
    };
  },
};

// ---------------------------------------------------------------- solids
const solids: Generator = {
  topic: topic("solids", "Cubes, cylinders & spheres"),
  make(rng, d) {
    if (d === 1) {
      const a = pick(rng, [3, 4, 5, 6, 7, 8, 9, 10]);
      const askVolume = rng() < 0.5;
      return {
        prompt: `A cube has an edge of ${a} cm. Find its ${askVolume ? "volume" : "total surface area"}.`,
        answer: askVolume ? `${a ** 3} cm³` : `${6 * a * a} cm²`,
        wrong: askVolume ? [`${6 * a * a} cm³`, `${a * a} cm³`, `${3 * a * a} cm³`, `${a ** 3 + a} cm³`] : [`${a ** 3} cm²`, `${4 * a * a} cm²`, `${a * a} cm²`, `${12 * a} cm²`],
        steps: askVolume ? [`Volume = a³ = ${a}³ = ${a ** 3} cm³`] : [`A cube has 6 equal square faces`, `Total surface area = 6a² = 6 × ${a * a} = ${6 * a * a} cm²`],
        trick: "Volume = a³, total surface = 6a², lateral = 4a², diagonal = a√3.",
        trap: "Mixing volume (cm³) and area (cm²), or using 4 faces instead of 6.",
      };
    }
    if (d === 2) {
      const k = int(rng, 1, 3);
      const r = 7 * k;
      const h = int(rng, 4, 20);
      const csa = rng() < 0.5;
      return {
        prompt: `A cylinder has radius ${r} cm and height ${h} cm. Find its ${csa ? "curved surface area" : "volume"}. (Use π = 22/7)`,
        answer: csa ? `${44 * k * h} cm²` : `${154 * k * k * h} cm³`,
        wrong: csa ? [`${154 * k * k * h} cm²`, `${44 * k * (h + r)} cm²`, `${22 * k * h} cm²`, `${88 * k * h} cm²`] : [`${44 * k * h} cm³`, `${154 * k * h} cm³`, `${308 * k * k * h} cm³`, `${154 * k * k + h} cm³`],
        steps: csa ? [`CSA = 2πrh = 2 × 22/7 × ${r} × ${h}`, `= ${44 * k} × ${h} = ${44 * k * h} cm²`] : [`Volume = πr²h = 22/7 × ${r}² × ${h}`, `= ${154 * k * k} × ${h} = ${154 * k * k * h} cm³`],
        trick: "CSA = 2πrh (a rolled-up rectangle). Volume = πr²h (base area × height).",
        trap: csa ? "Using πr²h (the volume formula) for a surface area." : "Forgetting to square the radius.",
      };
    }
    const variant = rng();
    if (variant < 0.5) {
      const big = pick(rng, [6, 8, 9, 12, 15]);
      const smallEdge = pick(rng, [2, 3].filter((s) => big % s === 0));
      const n = (big / smallEdge) ** 3;
      return {
        prompt: `A solid metal cube of edge ${big} cm is melted and recast into small cubes of edge ${smallEdge} cm. How many small cubes are made?`,
        answer: `${n}`,
        wrong: [`${(big / smallEdge) ** 2}`, `${big / smallEdge}`, `${n * 2}`, `${n - (big / smallEdge)}`],
        steps: [`Volume is conserved`, `Number = ${big}³ ÷ ${smallEdge}³ = ${big ** 3} ÷ ${smallEdge ** 3} = ${n}`],
        trick: "Number of pieces = (edge ratio)³. Here (" + big + "/" + smallEdge + ")³.",
        trap: "Dividing lengths (or areas) instead of volumes.",
      };
    }
    const [p, q] = pick(rng, [[1, 2], [2, 3], [3, 4], [1, 3]] as Array<[number, number]>);
    return {
      prompt: `The radii of two spheres are in the ratio ${p} : ${q}. Find the ratio of their volumes.`,
      figure: { kind: "circle", label: `r₁ : r₂ = ${p} : ${q}` },
      answer: ratioText([p ** 3, q ** 3]),
      wrong: [ratioText([p * p, q * q]), ratioText([p, q]), ratioText([p ** 3, q * q]), ratioText([q ** 3, p ** 3])],
      steps: [`Volume of a sphere = 4/3 πr³`, `Ratio = ${p}³ : ${q}³ = ${p ** 3} : ${q ** 3}`],
      trick: "Length ratio k → area ratio k² → volume ratio k³.",
      trap: `${p * p} : ${q * q} is the ratio of SURFACE AREAS.`,
    };
  },
};

// ---------------------------------------------------------------- triangle area
const triangleArea: Generator = {
  topic: topic("triangle-area", "Area of a triangle"),
  make(rng, d) {
    if (d === 1) {
      const b = pick(rng, [6, 8, 10, 12, 14, 16, 20]);
      const h = pick(rng, [5, 7, 9, 11, 13]);
      return {
        prompt: `Find the area of a triangle with base ${b} cm and perpendicular height ${h} cm.`,
        figure: { kind: "right-triangle", base: `${b}`, height: `${h}` },
        answer: `${num((b * h) / 2)} cm²`,
        wrong: [`${b * h} cm²`, `${b + h} cm²`, `${num((b * h) / 3)} cm²`, `${num((b + h) / 2)} cm²`],
        steps: [`Area = ½ × base × height`, `= ½ × ${b} × ${h} = ${num((b * h) / 2)} cm²`],
        trick: "Triangle = half of the rectangle on the same base and height.",
        trap: "Forgetting the ½ (that is the area of the rectangle).",
      };
    }
    if (d === 2 && rng() < 0.5) {
      const a = pick(rng, [4, 6, 8, 10, 12]);
      const coef = (a * a) / 4;
      return {
        prompt: `Find the area of an equilateral triangle of side ${a} cm.`,
        figure: { kind: "triangle", a: `${a}`, b: `${a}`, c: `${a}` },
        answer: `${num(coef)}√3 cm²`,
        wrong: [`${num(coef * 2)}√3 cm²`, `${num(coef / 2)}√3 cm²`, `${num(a * a)} cm²`, `${num((a * a * 3) / 4)} cm²`],
        steps: [`Area = (√3/4) a² = (√3/4) × ${a}²`, `= ${num(coef)}√3 cm²`],
        trick: "Equilateral: area = (√3/4)a². Height = (√3/2)a.",
        trap: "Using a²√3/2 or leaving out the √3.",
      };
    }
    const sets: Array<[number, number, number, number]> = [[13, 14, 15, 84], [5, 5, 6, 12], [10, 10, 12, 48], [13, 13, 10, 60], [9, 10, 17, 36], [17, 25, 26, 204], [15, 15, 24, 108]];
    const [a, b, c, area] = pick(rng, sets);
    const s = (a + b + c) / 2;
    return {
      prompt: `Find the area of a triangle with sides ${a} cm, ${b} cm and ${c} cm.`,
      figure: { kind: "triangle", a: `${a}`, b: `${b}`, c: `${c}` },
      answer: `${area} cm²`,
      wrong: [`${num((a * b) / 2)} cm²`, `${num(s)} cm²`, `${area + 6} cm²`, `${area - 6 > 0 ? area - 6 : area + 12} cm²`],
      steps: [`s = (${a} + ${b} + ${c}) ÷ 2 = ${s}`, `Area = √[s(s−a)(s−b)(s−c)] = √[${s} × ${s - a} × ${s - b} × ${s - c}]`, `= √${s * (s - a) * (s - b) * (s - c)} = ${area} cm²`],
      trick: "Heron's formula when no height is given. Start with the semi-perimeter s.",
      trap: "Using ½ × two sides — only valid if they meet at a right angle.",
    };
  },
};

// ---------------------------------------------------------------- circle theorems
const circleTheorems: Generator = {
  topic: topic("circle-theorems", "Circle theorems"),
  make(rng, d) {
    const v = d === 1 ? 0 : int(rng, 0, 2);
    if (v === 0) {
      const insc = pick(rng, [20, 25, 30, 35, 40, 45, 55]);
      const askCentral = d === 1 || rng() < 0.5;
      return {
        prompt: askCentral
          ? `An arc of a circle subtends an angle of ${deg(insc)} at a point on the remaining part of the circle. What angle does it subtend at the centre?`
          : `An arc subtends an angle of ${deg(insc * 2)} at the centre of a circle. What angle does it subtend at a point on the remaining part of the circle?`,
        figure: { kind: "circle", angle: askCentral ? `${insc}° (circumference)` : `${insc * 2}° (centre)` },
        answer: askCentral ? deg(insc * 2) : deg(insc),
        wrong: askCentral ? [deg(insc), deg(180 - insc), deg(insc * 3), deg(90 - insc)] : [deg(insc * 2 * 2), deg(180 - insc), deg(insc * 2), deg(90 - insc)],
        steps: [`Angle at the centre = 2 × angle at the circumference (same arc)`, askCentral ? `Centre = 2 × ${insc} = ${insc * 2}°` : `Circumference = ${insc * 2} ÷ 2 = ${insc}°`],
        trick: "Centre angle is DOUBLE the circumference angle on the same arc.",
        trap: "Halving when you should double (or vice versa).",
      };
    }
    if (v === 1) {
      const a = pick(rng, [20, 25, 30, 35, 40, 55, 60]);
      return {
        prompt: `AB is a diameter of a circle and C is a point on the circle. If ∠BAC = ${deg(a)}, find ∠ABC.`,
        figure: { kind: "circle", label: "AB diameter" },
        answer: deg(90 - a),
        wrong: [deg(90), deg(180 - a), deg(a), deg(90 + a)],
        steps: [`Angle in a semicircle: ∠ACB = 90°`, `∠ABC = 180° − 90° − ${a}° = ${90 - a}°`],
        trick: "Diameter ⇒ 90° at C. Then the other two angles add to 90°.",
        trap: `90° is ∠ACB, the angle in the semicircle.`,
      };
    }
    const a = int(rng, 55, 115);
    return {
      prompt: `ABCD is a cyclic quadrilateral. If ∠A = ${deg(a)}, find the opposite angle ∠C.`,
      figure: { kind: "circle", label: "cyclic quadrilateral ABCD" },
      answer: deg(180 - a),
      wrong: [deg(360 - a), deg(a), deg(90), deg(180 + a)].filter((x) => x !== deg(180 - a)),
      steps: [`Opposite angles of a cyclic quadrilateral sum to 180°`, `∠C = 180° − ${a}° = ${180 - a}°`],
      trick: "Cyclic quadrilateral: opposite angles = 180° (supplementary).",
      trap: "Using 360° minus the angle, as if it were any quadrilateral.",
    };
  },
};

// ---------------------------------------------------------------- trapezium, rhombus, parallelogram
const quadrilateralArea: Generator = {
  topic: topic("quadrilateral-area", "Trapezium, rhombus & parallelogram"),
  make(rng, d) {
    if (d === 1) {
      const a = pick(rng, [6, 8, 10, 12]);
      const b = a + pick(rng, [4, 6, 8]);
      const h = pick(rng, [4, 5, 6, 8]);
      const area = ((a + b) * h) / 2;
      return {
        prompt: `The parallel sides of a trapezium are ${a} cm and ${b} cm and the distance between them is ${h} cm. Find its area.`,
        figure: { kind: "rectangle", w: `${a} / ${b}`, h: `${h}` },
        answer: `${num(area)} cm²`,
        wrong: [`${(a + b) * h} cm²`, `${a * b * h} cm²`, `${num((a * b * h) / 2)} cm²`, `${num(area + h)} cm²`],
        steps: [`Area = ½ × (sum of parallel sides) × height`, `= ½ × (${a} + ${b}) × ${h} = ${num(area)} cm²`],
        trick: "Trapezium = average of the parallel sides × height.",
        trap: "Forgetting the ½ or multiplying the two parallel sides.",
      };
    }
    if (d === 2) {
      const d1 = pick(rng, [8, 10, 12, 16, 18, 20]);
      const d2 = pick(rng, [6, 9, 14, 15, 24]);
      return {
        prompt: `The diagonals of a rhombus are ${d1} cm and ${d2} cm. Find its area.`,
        figure: { kind: "rectangle", w: `${d1}`, h: `${d2}`, diagonal: "diagonals" },
        answer: `${num((d1 * d2) / 2)} cm²`,
        wrong: [`${d1 * d2} cm²`, `${2 * (d1 + d2)} cm²`, `${num((d1 + d2) / 2)} cm²`, `${num((d1 * d2) / 4)} cm²`],
        steps: [`Area of a rhombus = ½ × d₁ × d₂`, `= ½ × ${d1} × ${d2} = ${num((d1 * d2) / 2)} cm²`],
        trick: "Rhombus or kite: half the product of the diagonals.",
        trap: "Multiplying the diagonals without halving.",
      };
    }
    const [p, q, r] = pick(rng, SMALL_TRIPLES);
    const k = int(rng, 1, 3);
    const dgiven = 2 * p * k;
    const dother = 2 * q * k;
    const side = r * k;
    return {
      prompt: `A rhombus has side ${side} cm and one diagonal ${dgiven} cm. Find its area.`,
      figure: { kind: "right-triangle", base: "?", height: `${dgiven / 2}`, hyp: `${side}` },
      answer: `${(dgiven * dother) / 2} cm²`,
      wrong: [`${side * dgiven} cm²`, `${dgiven * dother} cm²`, `${side * side} cm²`, `${(dgiven * dother) / 4} cm²`],
      steps: [`Half-diagonal = ${dgiven / 2}; side = ${side} (hypotenuse)`, `Other half-diagonal = √(${side}² − ${dgiven / 2}²) = ${dother / 2}`, `Other diagonal = ${dother}`, `Area = ½ × ${dgiven} × ${dother} = ${(dgiven * dother) / 2} cm²`],
      trick: "Half-diagonals and the side make a right triangle. Find the other diagonal, then ½ d₁d₂.",
      trap: `${side * side} cm² would be the area of a SQUARE with that side.`,
    };
  },
};

export const GEOMETRY_GENERATORS: Generator[] = [triangleAngles, pythagoras, circleMensuration, rectangleArea, polygonAngles, similarFigures, solids, triangleArea, circleTheorems, quadrilateralArea];
