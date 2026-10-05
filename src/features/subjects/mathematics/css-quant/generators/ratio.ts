import { frac, mixedText, num, ratioText, simplifyRatio } from "../format";
import { int, pick } from "../rng";
import type { Generator } from "../types";

const topic = (id: string, label: string) => ({ id, module: "ratio" as const, label });
const rs = (n: number) => `Rs ${num(n)}`;

// ---------------------------------------------------------------- sharing in a ratio
const shareRatio: Generator = {
  topic: topic("share-ratio", "Sharing in a ratio"),
  make(rng, d) {
    const parts = d === 1 ? [int(rng, 1, 5), int(rng, 2, 6)] : [int(rng, 1, 6), int(rng, 2, 7), int(rng, 3, 9)];
    if (parts.every((p) => p === parts[0])) parts[0] = parts[0]! + 1;
    const sum = parts.reduce((a, b) => a + b, 0);
    const k = pick(rng, [10, 20, 25, 30, 40, 50, 60, 100]);
    const total = sum * k;
    const max = Math.max(...parts);
    const min = Math.min(...parts);
    const rt = parts.join(" : ");
    const asksDiff = d === 3;
    const asksSmall = !asksDiff && rng() < 0.4;
    const target = asksDiff ? max - min : asksSmall ? min : max;
    const answer = k * target;
    const what = asksDiff ? "the difference between the largest and the smallest share" : asksSmall ? "the smallest share" : "the largest share";
    const other = asksSmall ? max : min;
    return {
      prompt: `${rs(total)} is divided among ${parts.length} people in the ratio ${rt}. Find ${what}.`,
      answer: rs(answer),
      wrong: [rs((total / parts.length) * (asksDiff ? max : target)), rs(k * other), rs(total - answer), rs(k * (target + 1))],
      steps: [
        `Total parts = ${parts.join(" + ")} = ${sum}`,
        `1 part = ${total} ÷ ${sum} = ${k}`,
        asksDiff ? `Difference = (${max} − ${min}) parts = ${max - min} × ${k} = ${answer}` : `Share = ${target} × ${k} = ${answer}`,
      ],
      trick: "Divide the total by the SUM of the ratio terms to get one part, then multiply.",
      trap: "Dividing by the number of people instead of the sum of the ratio parts.",
    };
  },
};

// ---------------------------------------------------------------- direct proportion
const directProportion: Generator = {
  topic: topic("direct-proportion", "Direct proportion"),
  make(rng, d) {
    const n = pick(rng, [6, 8, 9, 12, 15, 20]);
    const unit = pick(rng, [5, 8, 12, 15, 18, 25, 30, 45]);
    const m = pick(rng, [4, 5, 10, 14, 18, 24, 30, 36].filter((x) => x !== n));
    const item = pick(rng, ["pens", "notebooks", "oranges", "files"]);
    const C = n * unit;
    const answer = m * unit;
    if (d === 3) {
      // two-step: price per dozen then a quantity in dozens
      const dozens = pick(rng, [2, 3, 4, 5]);
      const perDozen = pick(rng, [60, 96, 120, 180]);
      const want = pick(rng, [5, 7, 9, 11]);
      const cost = dozens * perDozen;
      return {
        prompt: `${dozens} dozen ${item} cost ${rs(cost)}. What is the cost of ${want * 6} ${item}?`,
        answer: rs((want * 6 * perDozen) / 12),
        wrong: [rs(want * perDozen), rs(cost + want * 6 - dozens * 12), rs(((want * 6) / dozens) * perDozen)],
        steps: [`Cost of 1 dozen = ${cost} ÷ ${dozens} = ${perDozen}`, `${want * 6} ${item} = ${num((want * 6) / 12)} dozen`, `Cost = ${num((want * 6) / 12)} × ${perDozen} = ${num((want * 6 * perDozen) / 12)}`],
        trick: "Convert to one common unit (dozen or single) first, then scale.",
        trap: "Treating the number of items as dozens (or the reverse).",
      };
    }
    return {
      prompt: `If ${n} ${item} cost ${rs(C)}, what is the cost of ${m} ${item}?`,
      answer: rs(answer),
      wrong: [rs(C + (m - n)), rs((C * n) / m), rs(answer + unit), rs(C * m)],
      steps: [`Cost of 1 = ${C} ÷ ${n} = ${unit}`, `Cost of ${m} = ${m} × ${unit} = ${answer}`],
      trick: "Unitary method: find the cost of ONE, then multiply.",
      trap: "Adding the difference in quantity to the cost instead of scaling it.",
    };
  },
};

// ---------------------------------------------------------------- inverse proportion / work
const inverseWork: Generator = {
  topic: topic("inverse-work", "Inverse proportion (men & days)"),
  make(rng, d) {
    if (d === 3) {
      const combos: Array<[number, number, number, number]> = [];
      for (const m of [8, 10, 12, 15, 16, 20, 24])
        for (const D of [12, 15, 16, 18, 20, 24, 30])
          for (const x of [3, 4, 5, 6, 8, 10])
            for (const e of [2, 4, 5, 6, 8, 10, 12]) if (x < D && (m * (D - x)) % (m + e) === 0) combos.push([m, D, x, e]);
      const [m, D, x, e] = pick(rng, combos);
      const remaining = m * (D - x);
      const more = remaining / (m + e);
      return {
        prompt: `${m} men can finish a job in ${D} days. After ${x} days, ${e} more men join them. In how many days in total is the job finished?`,
        answer: `${num(x + more)} days`,
        wrong: [`${num(more)} days`, `${num((m * D) / (m + e))} days`, `${num(D - x)} days`, `${num(x + more + 1)} days`],
        steps: [
          `Total work = ${m} × ${D} = ${m * D} man-days`,
          `Work done in ${x} days = ${m} × ${x} = ${m * x}; remaining = ${remaining} man-days`,
          `Now ${m + e} men: ${remaining} ÷ ${m + e} = ${num(more)} days`,
          `Total = ${x} + ${num(more)} = ${num(x + more)} days`,
        ],
        trick: "Work everything in MAN-DAYS: total = men × days. Subtract what is done, then divide by the new crew.",
        trap: `Answering ${num(more)} days forgets the ${x} days already worked.`,
      };
    }
    const m = pick(rng, [6, 8, 12, 15, 20, 24]);
    const days = pick(rng, [10, 12, 15, 18, 20, 30]);
    const total = m * days;
    const cands: number[] = [];
    for (let c = 3; c <= 60; c++) if (total % c === 0 && c !== m) cands.push(c);
    const m2 = pick(rng, cands);
    const answer = total / m2;
    return {
      prompt: `${m} men can complete a piece of work in ${days} days. How many days will ${m2} men take to complete the same work?`,
      answer: `${num(answer)} days`,
      wrong: [`${num((days * m2) / m)} days`, `${num(days + (m2 - m))} days`, `${num(days - (m2 - m))} days`, `${num(answer + 2)} days`],
      steps: [`Total work = ${m} × ${days} = ${total} man-days`, `Days for ${m2} men = ${total} ÷ ${m2} = ${num(answer)}`],
      trick: "More men → FEWER days. Keep men × days constant.",
      trap: "Treating it as direct proportion (more men → more days).",
    };
  },
};

// ---------------------------------------------------------------- mixtures
const mixture: Generator = {
  topic: topic("mixture", "Mixture & alligation"),
  make(rng, d) {
    if (d >= 2 && rng() < 0.55) {
      let found: { M: number; W: number; p: number; q: number; x: number } | null = null;
      for (let i = 0; i < 60 && !found; i++) {
        const a = int(rng, 2, 7);
        const b = int(rng, 1, 5);
        const k = pick(rng, [4, 5, 6, 8, 10]);
        const [p, q] = pick(rng, [[3, 2], [2, 1], [4, 3], [5, 3], [3, 1], [5, 4]]);
        const M = a * k;
        const W = b * k;
        if ((M * q) % p === 0 && (M * q) / p - W > 0 && a !== b) found = { M, W, p, q, x: (M * q) / p - W };
      }
      const f = found ?? { M: 30, W: 10, p: 3, q: 2, x: 10 };
      const T = f.M + f.W;
      return {
        prompt: `A ${T}-litre mixture contains ${f.M} L of milk and ${f.W} L of water. How much water must be added to make the ratio of milk to water ${f.p} : ${f.q}?`,
        answer: `${num(f.x)} litres`,
        wrong: [`${num(f.M - f.W)} litres`, `${num((f.M * f.p) / f.q - f.W)} litres`, `${num(f.x * 2)} litres`, `${num((f.M * f.q) / f.p)} litres`],
        steps: [
          `Milk stays ${f.M} L. New water = ${f.M} × ${f.q} ÷ ${f.p} = ${num((f.M * f.q) / f.p)} L`,
          `Water to add = ${num((f.M * f.q) / f.p)} − ${f.W} = ${num(f.x)} L`,
        ],
        trick: "Only the water changes. Keep milk fixed, scale it to the new ratio, subtract the old water.",
        trap: `${num((f.M * f.q) / f.p)} L is the NEW water amount, not the amount added.`,
      };
    }
    const p1 = pick(rng, [20, 30, 40, 50, 60, 80]);
    const gap = pick(rng, [20, 30, 40, 50, 60]);
    const p2 = p1 + gap;
    const mean = p1 + pick(rng, [5, 10, 15, 20, 25, 30].filter((x) => x < gap && x * 2 !== gap));
    const cheap = p2 - mean;
    const dear = mean - p1;
    const [a, b] = simplifyRatio([cheap, dear]);
    const [ra, rb] = simplifyRatio([dear, cheap]);
    return {
      prompt: `Rice at Rs ${p1}/kg is mixed with rice at Rs ${p2}/kg so that the mixture is worth Rs ${mean}/kg. In what ratio (cheaper : dearer) are they mixed?`,
      answer: ratioText([a!, b!]),
      wrong: [ratioText([ra!, rb!]), ratioText(simplifyRatio([mean - p1, p2 - p1])), ratioText(simplifyRatio([p2 - mean, p2 - p1])), ratioText([a! + 1, b!])],
      steps: [`Cheaper : Dearer = (dearer − mean) : (mean − cheaper)`, `= (${p2} − ${mean}) : (${mean} − ${p1}) = ${cheap} : ${dear}`, `Simplify → ${ratioText([a!, b!])}`],
      trick: "Alligation cross: each quantity is proportional to the OPPOSITE price gap.",
      trap: "Reversing the ratio — the cheaper rice is the one CLOSER to the other side of the mean.",
    };
  },
};

// ---------------------------------------------------------------- compound ratio
const compoundRatio: Generator = {
  topic: topic("compound-ratio", "Compound ratio"),
  make(rng, d) {
    const count = d === 1 ? 2 : 3;
    const rs_: Array<[number, number]> = [];
    while (rs_.length < count) {
      const a = int(rng, 1, 9);
      const b = int(rng, 2, 9);
      if (a !== b && !rs_.some((r) => r[0] === a && r[1] === b)) rs_.push([a, b]);
    }
    const num_ = rs_.reduce((x, r) => x * r[0], 1);
    const den = rs_.reduce((x, r) => x * r[1], 1);
    const [sa, sb] = simplifyRatio([num_, den]);
    const sumA = rs_.reduce((x, r) => x + r[0], 0);
    const sumB = rs_.reduce((x, r) => x + r[1], 0);
    const first = rs_[0]!;
    const wrong = [
      ratioText(simplifyRatio([sumA, sumB])),
      ratioText([sb!, sa!]),
      ratioText(simplifyRatio([first[0] * first[0], first[1] * first[1]])),
      ratioText(simplifyRatio([rs_[0]![0] * rs_[1]![0], rs_[0]![1] * rs_[1]![1]])),
    ];
    wrong.push(ratioText([sa! + 1, sb!]), ratioText([sa!, sb! + 1]));
    return {
      prompt: `Find the compound ratio of ${rs_.map((r) => `${r[0]} : ${r[1]}`).join(", ")}.`,
      answer: ratioText([sa!, sb!]),
      wrong,
      steps: [`Multiply all first terms: ${rs_.map((r) => r[0]).join(" × ")} = ${num_}`, `Multiply all second terms: ${rs_.map((r) => r[1]).join(" × ")} = ${den}`, `Ratio = ${num_} : ${den} → simplified ${ratioText([sa!, sb!])}`],
      trick: "Compound ratio = (product of antecedents) : (product of consequents). Cancel across before multiplying.",
      trap: "Adding the terms, or squaring one ratio (that is the DUPLICATE ratio, a different thing).",
    };
  },
};

// ---------------------------------------------------------------- successive percentage change
const percentChange: Generator = {
  topic: topic("percent-change", "Successive percentage change"),
  make(rng, d) {
    const pairs: Array<[number, number]> = [[10, 10], [20, 20], [25, 20], [20, 10], [50, 20], [10, 20], [30, 10], [40, 25], [20, 25]];
    const [x, y] = pick(rng, pairs);
    const sx = d === 1 ? 1 : pick(rng, [1, -1]);
    const syy: 1 | -1 = d >= 3 && rng() < 0.5 ? 1 : -1;
    const n = (100 + sx * x) * (100 + syy * y) - 10000;
    const net = n / 100;
    const word = (v: number) => (v === 0 ? "no change" : `${num(Math.abs(v))}% ${v > 0 ? "increase" : "decrease"}`);
    const naive = sx * x + syy * y;
    const thing = pick(rng, ["price of a shirt", "salary", "population of a town", "price of sugar"]);
    const first = `${sx > 0 ? "increased" : "decreased"} by ${x}%`;
    const second = `${syy > 0 ? "increased" : "decreased"} by ${y}%`;
    return {
      prompt: `The ${thing} is first ${first} and then ${second}. What is the net change?`,
      answer: word(net),
      wrong: [word(naive), word(-net === 0 ? naive + 1 : -net), word(net + (net >= 0 ? 1 : -1)), word(naive + (naive >= 0 ? 2 : -2))].filter((w) => w !== word(net)),
      steps: [`Start with 100`, `After first change: 100 × ${num((100 + sx * x) / 100)} = ${num(100 + sx * x)}`, `After second change: ${num(100 + sx * x)} × ${num((100 + syy * y) / 100)} = ${num((100 + sx * x) * (100 + syy * y) / 100)}`, `Net = ${num((100 + sx * x) * (100 + syy * y) / 100)} − 100 = ${num(net)}%`],
      trick: `Net % = a + b + ab/100 (use signs). Here ${sx * x} + (${syy * y}) + (${sx * x}×${syy * y})/100 = ${num(net)}.`,
      trap: "Adding or subtracting the two percentages directly — each % applies to a DIFFERENT base.",
    };
  },
};

// ---------------------------------------------------------------- profit & loss
const profitLoss: Generator = {
  topic: topic("profit-loss", "Profit & loss"),
  make(rng, d) {
    if (d === 3) {
      const x = pick(rng, [5, 10, 15, 20, 25, 30, 40]);
      const loss = (x * x) / 100;
      return {
        prompt: `Two articles are sold at the same price. One is sold at a gain of ${x}% and the other at a loss of ${x}%. What is the overall result?`,
        answer: `${num(loss)}% loss`,
        wrong: ["No profit, no loss", `${x}% loss`, `${num(loss)}% profit`, `${num(loss * 2)}% loss`],
        steps: [`When two articles are sold at the same price with equal gain% and loss% (= ${x}%),`, `Overall loss % = x² ÷ 100 = ${x}² ÷ 100 = ${num(loss)}%`],
        trick: "Same SP, equal gain% and loss% → ALWAYS a loss of x²/100 %. Memorise it.",
        trap: "Assuming the gain and loss cancel. They don't: the loss is on a larger cost price.",
      };
    }
    const CP = pick(rng, [200, 240, 300, 400, 500, 600, 800, 1200, 1600]);
    const p = pick(rng, [5, 10, 15, 20, 25, 30, 40]);
    if (d === 1) {
      const profit = rng() < 0.5;
      const SP = (CP * (100 + (profit ? p : -p))) / 100;
      const amt = Math.abs(SP - CP);
      const opposite = profit ? "loss" : "profit";
      return {
        prompt: `An article bought for ${rs(CP)} is sold for ${rs(SP)}. Find the ${profit ? "profit" : "loss"} percentage.`,
        answer: `${p}%`,
        wrong: [`${num((amt / SP) * 100)}%`, `${num(amt)}%`, `${num(p + 5)}%`, `${num(Math.max(1, p - 5))}%`],
        steps: [`${profit ? "Profit" : "Loss"} = ${SP} − ${CP} = ${num(SP - CP)} → ${num(amt)}`, `% = ${num(amt)} ÷ ${CP} × 100 = ${p}%`],
        trick: `Profit/loss % is ALWAYS on the cost price. (${opposite} labels are a trap — read which is bigger.)`,
        trap: `Dividing by the selling price (${num((amt / SP) * 100)}%) instead of the cost price.`,
      };
    }
    const SP = (CP * (100 + p)) / 100;
    return {
      prompt: `A trader sells an article for ${rs(SP)} and makes a profit of ${p}%. What was the cost price?`,
      answer: rs(CP),
      wrong: [rs((SP * (100 - p)) / 100), rs(SP - p), rs((SP * (100 + p)) / 100), rs(SP - (CP * p) / 200)],
      steps: [`SP = CP × (100 + ${p})/100`, `CP = ${SP} × 100 ÷ ${100 + p} = ${CP}`],
      trick: `CP = SP × 100/(100 + profit%). The answer must be LESS than SP.`,
      trap: `Taking ${p}% off the selling price. The ${p}% is of the cost price, not of SP.`,
    };
  },
};

// ---------------------------------------------------------------- ages
const ages: Generator = {
  topic: topic("ages", "Ratio of ages"),
  make(rng) {
    const [a, b] = pick(rng, [[4, 1], [3, 1], [5, 2], [7, 3], [5, 1], [5, 3], [8, 3], [7, 2]]);
    const k = int(rng, 3, 10);
    const n = int(rng, 4, 10);
    const father = a * k;
    const son = b * k;
    const [c, dd] = simplifyRatio([father + n, son + n]);
    const askSon = rng() < 0.5;
    const target = askSon ? son : father;
    return {
      prompt: `The ratio of the ages of a father and his son is ${a} : ${b}. After ${n} years the ratio will be ${c} : ${dd}. What is the ${askSon ? "son's" : "father's"} present age?`,
      answer: `${target} years`,
      wrong: [`${(askSon ? father : son)} years`, `${target + n} years`, `${k} years`, `${target - n > 0 ? target - n : target + 2 * n} years`],
      steps: [`Let ages be ${a}k and ${b}k`, `(${a}k + ${n}) ÷ (${b}k + ${n}) = ${c} ÷ ${dd}`, `${dd}(${a}k + ${n}) = ${c}(${b}k + ${n}) → k = ${k}`, `${askSon ? "Son" : "Father"} = ${askSon ? b : a} × ${k} = ${target}`],
      trick: "Write ages as ak and bk, form the future ratio equation, cross-multiply, solve for k.",
      trap: `${target + n} is the age AFTER ${n} years, not now.`,
    };
  },
};

// ---------------------------------------------------------------- time & work, pipes
const timeWork: Generator = {
  topic: topic("time-work", "Time, work & pipes"),
  make(rng, d) {
    if (d >= 2 && rng() < 0.4) {
      const [a, b] = pick(rng, [[6, 12], [10, 15], [12, 18], [20, 30], [8, 12], [15, 30]]);
      const t = (a * b) / (b - a);
      return {
        prompt: `A pipe fills a tank in ${a} hours and a leak empties the full tank in ${b} hours. If both work together, how long will the empty tank take to fill?`,
        answer: `${num(t)} hours`,
        wrong: [`${mixedText(a * b, a + b)} hours`, `${b - a} hours`, `${num((a + b) / 2)} hours`, `${num(t + a)} hours`],
        steps: [`Net rate = 1/${a} − 1/${b} = ${b - a}/${a * b} = ${frac(b - a, a * b)} per hour`, `Time = ${frac(a * b, b - a)} = ${num(t)} hours`],
        trick: "Filling adds, leaking subtracts: time = ab ÷ (b − a).",
        trap: "Adding both rates, as if the leak were a second filling pipe.",
      };
    }
    const nice: Array<[number, number]> = [[10, 15], [12, 24], [20, 30], [6, 12], [15, 30], [9, 18], [18, 36], [8, 24], [30, 60]];
    const odd: Array<[number, number]> = [[8, 12], [10, 12], [6, 9], [12, 20], [15, 20]];
    const [a, b] = pick(rng, d === 1 ? nice : [...nice, ...odd]);
    const t = mixedText(a * b, a + b);
    return {
      prompt: `A can do a job in ${a} days and B can do it in ${b} days. Working together, in how many days will they finish it?`,
      answer: `${t} days`,
      wrong: [`${num((a + b) / 2)} days`, `${a + b} days`, `${num(Math.abs(a - b))} days`, `${mixedText(a * b, Math.abs(a - b) || 1)} days`],
      steps: [`A's rate = 1/${a}, B's rate = 1/${b}`, `Together = 1/${a} + 1/${b} = ${a + b}/${a * b} per day`, `Time = ${a * b}/${a + b} = ${t} days`],
      trick: "Two workers: time together = (a × b) ÷ (a + b) (product over sum).",
      trap: "Averaging the two times. Together they MUST be faster than the faster worker alone.",
    };
  },
};

// ---------------------------------------------------------------- speed, distance, trains
const speedTrain: Generator = {
  topic: topic("speed-train", "Speed, distance & trains"),
  make(rng, d) {
    if (d === 3) {
      const [v1, v2] = pick(rng, [[36, 54], [72, 18], [45, 45], [54, 36]]);
      const ms = ((v1 + v2) * 5) / 18;
      const t = int(rng, 4, 12);
      const total = ms * t;
      const L1 = Math.round((total * pick(rng, [0.4, 0.5, 0.6])) / 10) * 10 || 10;
      const L2 = total - L1;
      if (L2 <= 0) return speedTrain.make(rng, 2);
      const diffMs = (Math.abs(v1 - v2) * 5) / 18;
      return {
        prompt: `Two trains of length ${L1} m and ${L2} m run towards each other on parallel tracks at ${v1} km/h and ${v2} km/h. How long do they take to cross each other completely?`,
        answer: `${t} seconds`,
        wrong: [diffMs > 0 ? `${num(total / diffMs)} seconds` : `${t * 2} seconds`, `${num(total / (v1 + v2))} seconds`, `${num(total / (((v1 + v2) * 18) / 5))} seconds`, `${num((total / ms) * 3.6)} seconds`],
        steps: [`Relative speed (opposite) = ${v1} + ${v2} = ${v1 + v2} km/h = ${v1 + v2} × 5/18 = ${num(ms)} m/s`, `Distance to cover = ${L1} + ${L2} = ${total} m`, `Time = ${total} ÷ ${num(ms)} = ${t} s`],
        trick: "Opposite directions: ADD speeds. Same direction: SUBTRACT. Convert km/h → m/s by × 5/18.",
        trap: "Leaving speeds in km/h while lengths are in metres.",
      };
    }
    if (d === 2 || rng() < 0.4) {
      const L = pick(rng, [100, 150, 200, 250, 300, 400]);
      const t = pick(rng, [5, 6, 8, 10, 12, 15, 20]);
      const kmh = (L / t) * 3.6;
      return {
        prompt: `A train ${L} m long passes a telegraph pole in ${t} seconds. Find its speed in km/h.`,
        answer: `${num(kmh)} km/h`,
        wrong: [`${num(L / t)} km/h`, `${num((L / t) * (5 / 18))} km/h`, `${num((L / 1000) / (t / 3600) + 5)} km/h`, `${num(kmh * 2)} km/h`],
        steps: [`Distance = length of train = ${L} m`, `Speed = ${L} ÷ ${t} = ${num(L / t)} m/s`, `In km/h: ${num(L / t)} × 18/5 = ${num(kmh)} km/h`],
        trick: "Passing a POLE: distance = the train's own length. m/s → km/h: × 18/5.",
        trap: `${num(L / t)} is in m/s — the question asks for km/h.`,
      };
    }
    const [u, v] = pick(rng, [[40, 60], [30, 60], [60, 90], [20, 30], [50, 75], [40, 120]]);
    const avg = (2 * u * v) / (u + v);
    return {
      prompt: `A car goes from city A to city B at ${u} km/h and returns along the same road at ${v} km/h. What is its average speed for the whole journey?`,
      answer: `${num(avg)} km/h`,
      wrong: [`${num((u + v) / 2)} km/h`, `${num(Math.sqrt(u * v))} km/h`, `${num(avg + 2)} km/h`, `${u + v} km/h`],
      steps: [`Take distance each way = D`, `Total time = D/${u} + D/${v} = D(${u + v})/${u * v}`, `Average = 2D ÷ total time = 2×${u}×${v} ÷ ${u + v} = ${num(avg)} km/h`],
      trick: "Equal distances: average speed = 2uv ÷ (u + v) (harmonic mean) — never the plain average.",
      trap: `${num((u + v) / 2)} km/h is the simple average; the car spends MORE time at the slower speed.`,
    };
  },
};

// ---------------------------------------------------------------- map scale
const mapScale: Generator = {
  topic: topic("map-scale", "Map scale"),
  make(rng, d) {
    const n = pick(rng, [25000, 50000, 100000, 200000, 500000]);
    const cm = int(rng, 2, 12);
    const km = (cm * n) / 100000;
    if (d === 3) {
      const actualKm = pick(rng, [4, 6, 12, 15, 18, 24]);
      const mapCm = (actualKm * 100000) / n;
      return {
        prompt: `On a map drawn to the scale 1 : ${n.toLocaleString("en-US")}, two towns are ${actualKm} km apart. How far apart are they on the map?`,
        answer: `${num(mapCm)} cm`,
        wrong: [`${num(mapCm * 10)} cm`, `${num(mapCm / 10)} cm`, `${num((actualKm * 1000) / n)} cm`, `${num(actualKm / n)} cm`],
        steps: [`${actualKm} km = ${actualKm} × 100 000 = ${num(actualKm * 100000)} cm`, `Map distance = ${num(actualKm * 100000)} ÷ ${n} = ${num(mapCm)} cm`],
        trick: "1 km = 100 000 cm. Scale 1 : N means 1 cm on map = N cm on ground.",
        trap: "Mixing km, m and cm — convert everything to cm first.",
      };
    }
    return {
      prompt: `On a map with scale 1 : ${n.toLocaleString("en-US")}, two cities are ${cm} cm apart. What is the actual distance between them?`,
      answer: `${num(km)} km`,
      wrong: [`${num(km * 10)} km`, `${num(km / 10)} km`, `${num((cm * n) / 1000)} km`, `${num(cm * n)} km`],
      steps: [`Actual = ${cm} × ${n.toLocaleString("en-US")} = ${(cm * n).toLocaleString("en-US")} cm`, `÷ 100 000 to get km = ${num(km)} km`],
      trick: "cm → km: divide by 100 000 (drop five zeros).",
      trap: "Dividing by 1 000 (that converts to metres) or by 10 000.",
    };
  },
};

export const RATIO_GENERATORS: Generator[] = [shareRatio, directProportion, inverseWork, mixture, compoundRatio, percentChange, profitLoss, ages, timeWork, speedTrain, mapScale];
