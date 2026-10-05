import type { PastPaperItem } from "./types";

/**
 * Curated bank of questions that appeared in CSS MPT papers. See PAST_PAPERS.md for the rules.
 *
 * Provenance: FPSC does not publish MPT booklets, so these come from cssaspirants.pk compilations (2023 Special, 2024,
 * 2025, 2026). A question is included only when (a) it fits the Ratio / Geometry modules and (b) the answer key printed
 * in the compilation agrees with an independent re-solve. Questions whose printed key was wrong or ambiguous were left
 * out. Stems and options are as printed; the worked solutions, fast methods and traps are written by us.
 */

const SRC = "https://cssaspirants.pk/";
const NAME = "cssaspirants.pk";
const CHECK = { verifiedOn: "2026-10-05", verifiedBy: "Claude (independent re-solve)", evidence: "third-party-compilation" as const, sourceUrl: SRC };
const ref = (year: number, exam: string, questionNo: number, sourceName: string) => ({ year, exam, questionNo, sourceName, ...CHECK });

const GA26 = (n: number) => ref(2026, "CSS MPT 2026 — General Abilities", n, `${NAME} “CSS MPT 2026 Solved Past Paper”`);
const GA25 = (n: number) => ref(2025, "CSS MPT 2025 — General Abilities", n, `${NAME} “CSS MPT 2025 Solved Past Paper” (scanned booklet)`);
const GA24 = (n: number) => ref(2024, "CSS MPT 2024 — Mathematics", n, `${NAME} “CSS MPT Solved Past Paper 2024”`);
const GA23 = (n: number) => ref(2023, "CSS MPT 2023 (Special) — General Abilities", n, `${NAME} “CSS MPT 2023 (Special) Solved Past Paper” (recalled paper)`);

export const PAST_PAPER_BANK: readonly PastPaperItem[] = [
  // ───────────── 2026 ─────────────
  {
    id: "mpt-2026-q93", module: "ratio", topic: "inverse-work",
    prompt: "Several number of cows on a farm consume the food in 150 days. If we reduce the number of cows by 10, then the food lasts for 160 days. How many cows were there on the farm in the beginning?",
    options: ["150", "160", "100", "None of these"], correct: 1,
    steps: ["Total food is fixed, so cows × days is constant.", "Let n cows: 150n = 160(n − 10).", "150n = 160n − 1600, so 10n = 1600 and n = 160."],
    trick: "Food = cows × days is constant, so the ratio of days 150 : 160 = 15 : 16 means cows are in the ratio 16 : 15. A drop of 10 cows is one part, so 16 parts = 160.",
    trap: "Treating it as direct proportion, or answering with the reduced herd (150).",
    ref: GA26(93),
  },
  {
    id: "mpt-2026-q94", module: "ratio", topic: "speed-train",
    prompt: "A train of length 99m takes 11 seconds to pass completely through a station of length 231m. What is the speed of the train in km/h?",
    options: ["108", "75.6", "30", "None of these"], correct: 0,
    steps: ["To pass completely through the station the train covers its own length plus the station: 99 + 231 = 330 m.", "Speed = 330 ÷ 11 = 30 m/s.", "Convert: 30 × 18/5 = 108 km/h."],
    trick: "Distance = train + platform. Then m/s × 18/5 gives km/h; 30 m/s is 108 km/h.",
    trap: "Forgetting to convert (30 is a listed option) or using only the train length.",
    ref: GA26(94),
  },
  {
    id: "mpt-2026-q95", module: "ratio", topic: "share-ratio",
    prompt: "A, B and C share $112. B receives $12 less than A and C gets twice as much as B. How much does C get?",
    options: ["34", "44", "50", "None of these"], correct: 2,
    steps: ["Let A = a. Then B = a − 12 and C = 2(a − 12).", "Total: a + (a − 12) + 2(a − 12) = 112, so 4a − 36 = 112 and a = 37.", "B = 25, so C = 2 × 25 = 50 (check: 37 + 25 + 50 = 112)."],
    trick: "Write everything in terms of B: A = B + 12, C = 2B, so 4B + 12 = 112 and B = 25, C = 50.",
    trap: "Giving B's share (25) or A's share (37) instead of C's.",
    ref: GA26(95),
  },
  {
    id: "mpt-2026-q97", module: "ratio", topic: "ages",
    prompt: "Zaid is six times as old as his daughter Zoya. How old was Zaid when Zoya was born if the sum of their ages will be 49 in 7 years?",
    options: ["25", "35", "42", "None of these"], correct: 0,
    steps: ["Let Zoya be z now, Zaid 6z.", "In 7 years: (z + 7) + (6z + 7) = 49, so 7z = 35 and z = 5.", "Zaid is 30 now and Zoya is 5, so when Zoya was born Zaid was 30 − 5 = 25."],
    trick: "The age gap never changes: gap = 6z − z = 5z = 25. That gap is Zaid's age at Zoya's birth.",
    trap: "Answering with Zaid's present age (30), or his age in 7 years.",
    ref: GA26(97),
  },
  {
    id: "mpt-2026-q99", module: "ratio", topic: "percent-change",
    prompt: "A light shop sells lights; they sold 25 percent of the lights and still had 1500 lights left. How many lights were there in the beginning?",
    options: ["2500", "2250", "2000", "None of these"], correct: 2,
    steps: ["After selling 25%, 75% remain.", "0.75 × total = 1500, so total = 1500 ÷ 0.75 = 2000."],
    trick: "75% = 3/4 of the total, so one quarter is 500 and the whole is 4 × 500 = 2000.",
    trap: "Adding 25% of 1500 (which gives 1875) instead of dividing by 0.75.",
    ref: GA26(99),
  },
  {
    id: "mpt-2026-q104", module: "geometry", topic: "triangle-angles",
    prompt: "If one angle of an isosceles triangle is 68 degrees, then possible values of the second angle are:",
    options: ["Any value between 68 and 180 degrees", "Any value between 68 and 112 degrees", "Any value between 1 and 112 degrees", "None of these"], correct: 3,
    steps: ["Case 1: 68° is a base angle, so the other base angle is 68° and the apex is 180 − 136 = 44°.", "Case 2: 68° is the apex, so each base angle is (180 − 68) ÷ 2 = 56°.", "So the second angle can only be 68°, 44° or 56°: three specific values, not a range. None of the ranges in A–C is right."],
    trick: "An isosceles triangle has only two possible shapes for a given angle, so the answer is a short list of values, never a continuous range.",
    trap: "Assuming 68° must be a base angle and ignoring the apex case.",
    ref: GA26(104),
  },
  {
    id: "mpt-2026-q105", module: "geometry", topic: "circle-mensuration",
    prompt: "The total perimeter of a semicircle is 20.6 cm. What is the approximate radius of the semi-circle?",
    options: ["4 cm", "5 cm", "6.6 cm", "None of these"], correct: 0,
    steps: ["Perimeter of a semicircle = πr + 2r = r(π + 2).", "With π = 22/7: π + 2 = 36/7, so r = 20.6 × 7/36 ≈ 4.0 cm.", "With π = 3.14 the answer is also ≈ 4.0 cm."],
    trick: "(π + 2) ≈ 5.14, and 20.6 ÷ 5.14 = 4. Do not forget the diameter edge.",
    trap: "Using only the curved part πr, which would give r = 6.56 ≈ 6.6 cm.",
    ref: GA26(105),
  },
  {
    id: "mpt-2026-q106", module: "geometry", topic: "solids",
    prompt: "A water tank in the shape of a cuboid has length 1.5 metres and width 1.0 metre. How many litres of water are in the tank if the water is 60 centimetres deep?",
    options: ["9000 litres", "900 litres", "90 litres", "None of these"], correct: 1,
    steps: ["Depth of water = 60 cm = 0.6 m.", "Volume = 1.5 × 1.0 × 0.6 = 0.9 m³.", "1 m³ = 1000 litres, so 0.9 m³ = 900 litres."],
    trick: "Work in metres, then multiply by 1000 to get litres.",
    trap: "Slipping a factor of ten when converting cm to m or m³ to litres.",
    ref: GA26(106),
  },
  {
    id: "mpt-2026-q107", module: "geometry", topic: "circle-mensuration",
    prompt: "The inner circumference of a circular race track is 440m. If the width of the track is 14m, what is the radius of the outer circle?",
    options: ["70m", "77m", "84m", "None of these"], correct: 2,
    steps: ["Inner radius: 2πr = 440, so with π = 22/7, r = 440 × 7 ÷ 44 = 70 m.", "Outer radius = inner radius + track width = 70 + 14 = 84 m."],
    trick: "C = 2πr = 44r/7, so r = 440 ÷ (44/7) = 70. Then add the track width.",
    trap: "Stopping at the inner radius (70 m is an option).",
    ref: GA26(107),
  },
  {
    id: "mpt-2026-q117", module: "ratio", topic: "speed-train",
    prompt: "Roni and Willy had a 100m race. Roni covered the distance in 45 secs and Willy covered the distance in 36 secs. Willy beats Roni by how much distance?",
    options: ["20m", "22.5m", "25m", "None of these"], correct: 0,
    steps: ["When Willy finishes, 36 s have passed.", "Roni's speed = 100 ÷ 45 m/s, so in 36 s he covers 100 × 36/45 = 80 m.", "Willy beats Roni by 100 − 80 = 20 m."],
    trick: "Distance covered in the same time is proportional to speed: Roni runs 36/45 = 4/5 of 100 m, which is 80 m. The gap is 20 m.",
    trap: "Using the 9 s time gap directly as a distance.",
    ref: GA26(117),
  },
  {
    id: "mpt-2026-q123", module: "ratio", topic: "inverse-work",
    prompt: "The forest workers plant 200 trees in one month (30 days). When 20 workers were sent away, 200 trees were planted in 40 days by this second group. How many workers were there in the first group?",
    options: ["60", "70", "80", "None of these"], correct: 2,
    steps: ["Same work (200 trees), so workers × days is constant.", "Let the first group be n: 30n = 40(n − 20).", "30n = 40n − 800, so n = 80."],
    trick: "Days 30 : 40 = 3 : 4, so workers are in the ratio 4 : 3. The 20 removed workers are one part, so the first group is 4 × 20 = 80.",
    trap: "Treating it as direct proportion, or answering with the second group's size (60).",
    ref: GA26(123),
  },
  {
    id: "mpt-2026-q130", module: "ratio", topic: "percent-change",
    prompt: "A student spends 15% of his scholarship grant on food and 45% on tuition. After spending 50% of the remaining grant on his hostel fee, he is left with Rs 8,000 only. How much is his scholarship grant?",
    options: ["32,000", "40,000", "45,000", "None of these"], correct: 1,
    steps: ["Food + tuition = 15% + 45% = 60%, leaving 40% of the grant.", "He spends half of that on the hostel, leaving 20% of the grant.", "20% of the grant = 8,000, so the grant = 8,000 ÷ 0.2 = 40,000."],
    trick: "Work with the grant as 100: 100 → 40 → 20. If 20 units = 8,000 then 100 units = 40,000.",
    trap: "Taking 50% of the whole grant for the hostel fee instead of 50% of the remainder.",
    ref: { ...GA26(130), exam: "CSS MPT 2026 — General Abilities (also in the 2024 paper, Q116)" },
  },
  // ───────────── 2025 ─────────────
  {
    id: "mpt-2025-q54", module: "ratio", topic: "share-ratio",
    prompt: "The ratio of boys and girls in a school is 9 : 5. If the total number of students in the school is 1050, then the number of boys is",
    options: ["785", "890", "675", "None of these"], correct: 2,
    steps: ["Total parts = 9 + 5 = 14.", "One part = 1050 ÷ 14 = 75.", "Boys = 9 × 75 = 675."],
    trick: "Boys = 9/14 of the total: 1050 ÷ 14 = 75, then × 9 = 675.",
    trap: "Dividing by 9 + 5 but then multiplying by the girls' share (5 × 75 = 375).",
    ref: GA25(54),
  },
  {
    id: "mpt-2025-q55", module: "ratio", topic: "share-ratio",
    prompt: "When x is added to each term of 7 : 13 the ratio becomes 2 : 3. The value of x is",
    options: ["7", "11", "5", "None of these"], correct: 2,
    steps: ["(7 + x) ÷ (13 + x) = 2/3.", "Cross-multiply: 3(7 + x) = 2(13 + x), so 21 + 3x = 26 + 2x.", "x = 5. Check: 12 : 18 = 2 : 3."],
    trick: "The difference between the terms never changes: 13 − 7 = 6. In 2 : 3 the difference is 1 part, so 1 part = 6, and the smaller term is 2 × 6 = 12. So x = 12 − 7 = 5.",
    trap: "Adding x to only one term, or subtracting instead of adding.",
    ref: GA25(55),
  },
  {
    id: "mpt-2025-q58", module: "ratio", topic: "ages",
    prompt: "Ali was 40 years old when his son Asim was born. How old was Ali when he was 5 times as old as Asim?",
    options: ["40", "45", "50", "60"], correct: 2,
    steps: ["The gap is always 40 years.", "When Ali is 5 times Asim's age: 5a − a = 40, so a = 10.", "Ali is then 5 × 10 = 50."],
    trick: "Age gap = (5 − 1) × Asim's age, so Asim = 40 ÷ 4 = 10 and Ali = 50.",
    trap: "Giving Asim's age (10) or the gap itself (40).",
    ref: GA25(58),
  },
  // ───────────── 2024 ─────────────
  {
    id: "mpt-2024-q121", module: "geometry", topic: "polygon-angles",
    prompt: "Name the regular polygon that has an exterior angle of 36.",
    options: ["Pentagon", "Hexagon", "Decagon", "None of these"], correct: 2,
    steps: ["Exterior angles of any polygon add up to 360°, and in a regular polygon they are equal.", "Number of sides n = 360 ÷ 36 = 10.", "A 10-sided polygon is a decagon."],
    trick: "n = 360 ÷ exterior angle. Pentagon is 72°, hexagon 60°, decagon 36°.",
    trap: "Dividing by 180 (interior angle sum formula) instead of 360.",
    ref: GA24(121),
  },
  // ───────────── 2023 (Special) ─────────────
  {
    id: "mpt-2023-q61", module: "ratio", topic: "direct-proportion",
    prompt: "Saba and Nida do their assignment together. The ratio of time taken by Saba to Nida is 6:5. If Saba takes 90 minutes to complete the assignment, how much time does Nida require?",
    options: ["75 minutes", "96 minutes", "108 minutes", "None of these"], correct: 0,
    steps: ["Time ratio Saba : Nida = 6 : 5.", "Saba's 6 parts = 90 minutes, so 1 part = 15 minutes.", "Nida = 5 × 15 = 75 minutes."],
    trick: "Nida's time is 5/6 of Saba's: 90 × 5/6 = 75.",
    trap: "Inverting the ratio (90 × 6/5 = 108).",
    ref: GA23(61),
  },
  {
    id: "mpt-2023-q67", module: "geometry", topic: "triangle-angles",
    prompt: "The exterior angle of a triangle is 80 degrees and the interior opposite angles are in the ratio 1:3. The interior angles measure:",
    options: ["30 and 90 degrees", "25 and 75 degrees", "20 and 60 degrees", "None of these"], correct: 2,
    steps: ["An exterior angle equals the sum of the two interior opposite angles, so they add up to 80°.", "Ratio 1 : 3 gives 4 parts = 80°, so 1 part = 20°.", "The angles are 20° and 60°."],
    trick: "Exterior angle = sum of the two remote interior angles. Then just split 80 in the ratio 1 : 3.",
    trap: "Using 180° as the total instead of the 80° exterior angle.",
    ref: GA23(67),
  },
  {
    id: "mpt-2023-q68", module: "ratio", topic: "percent-change",
    prompt: "A watchmaker sold 40 percent of his watches and still has 420 watches left. How many did he have to begin with?",
    options: ["672", "700", "1050", "None of these"], correct: 1,
    steps: ["After selling 40%, 60% remain.", "0.6 × total = 420, so total = 420 ÷ 0.6 = 700."],
    trick: "60% = 3/5, so one fifth is 140 and the whole is 5 × 140 = 700.",
    trap: "Adding 40% of 420 (which gives 588) instead of dividing by 0.6.",
    ref: GA23(68),
  },
  {
    id: "mpt-2023-q77", module: "ratio", topic: "share-ratio",
    prompt: "The difference of two integers is 36. The smaller integer is 60% smaller than the larger integer. What is the sum of the two?",
    options: ["54", "60", "21", "None of these"], correct: 3,
    steps: ["“60% smaller” means the smaller number is 40% of the larger: s = 0.4L.", "L − s = 0.6L = 36, so L = 60 and s = 24.", "Sum = 60 + 24 = 84, which is not among options A–C."],
    trick: "The difference is 60% of the larger number, so the larger is 36 ÷ 0.6 = 60. The smaller is 24 and the sum is 84.",
    trap: "Reading “60% smaller” as 60% of the larger number: that gives 90 and 54, and 54 is a tempting option.",
    ref: GA23(77),
  },
  {
    id: "mpt-2023-q66", module: "geometry", topic: "geometry-other",
    prompt: "The perimeter of an equilateral triangle is 24 cm. What is the length of one side of the triangle?",
    options: ["12 cm", "6 cm", "80 mm", "None of these"], correct: 2,
    steps: ["An equilateral triangle has three equal sides, so one side = 24 ÷ 3 = 8 cm.", "8 cm = 80 mm, which is option C."],
    trick: "Perimeter ÷ 3, then check the units: the options mix cm and mm.",
    trap: "Not noticing that 80 mm is the same as 8 cm.",
    ref: GA23(66),
  },
  {
    id: "mpt-2023-q64", module: "ratio", topic: "ratio-other",
    prompt: "A new number is added to the series 3, 4, 4, 5, 6, 8 such that the average of the series does not change. What is the new number?",
    options: ["5", "6", "7", "None of these"], correct: 0,
    steps: ["Sum = 3 + 4 + 4 + 5 + 6 + 8 = 30 and there are 6 numbers, so the average is 5.", "Adding a number equal to the current average leaves the average unchanged, so the new number is 5."],
    trick: "To keep an average the same, add a number equal to that average.",
    trap: "Trying to balance the sum instead of recognising the average itself is the answer.",
    ref: GA23(64),
  },
  {
    id: "mpt-2023-q70", module: "ratio", topic: "ratio-other",
    prompt: "A sum of money at simple interest amounts to Rs. 815 in 3 years and to Rs. 854 in 4 years. The sum is:",
    options: ["641", "698", "737", "None of these"], correct: 1,
    steps: ["The extra year adds simple interest of 854 − 815 = Rs. 39.", "Interest for 3 years = 3 × 39 = 117.", "Principal = 815 − 117 = Rs. 698."],
    trick: "Yearly interest = difference of the two amounts = 39. Principal = amount after 3 years − 3 × 39.",
    trap: "Subtracting only one year's interest (815 − 39 = 776).",
    ref: GA23(70),
  },
  {
    id: "mpt-2023-q78", module: "ratio", topic: "ratio-other",
    prompt: "The average age of 5 children born at intervals of 2 years is 18 years. What is the age of the youngest child?",
    options: ["12", "13", "14", "None of these"], correct: 2,
    steps: ["Ages form an arithmetic sequence with common difference 2, so the average equals the middle (third) child's age: 18.", "The youngest is two steps below: 18 − 2 × 2 = 14."],
    trick: "In an evenly spaced list the average is the middle term. Step down from the middle.",
    trap: "Stepping down once or three times instead of twice.",
    ref: GA23(78),
  },
];
