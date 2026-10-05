# Past-paper questions

Questions from `past-papers/bank.ts` carry a badge; generated questions never do. Two kinds of badge exist:

| Evidence kind | Badge | Meaning |
|---|---|---|
| `fpsc-website`, `official-paper-copy` | green **Verified past paper · year** | Checked against an official FPSC document. |
| `third-party-compilation` | purple **Past paper · year · answer verified** | Taken from a published prep-site compilation. FPSC does not release MPT booklets, so it is **not** checked against an official copy; the answer was independently re-solved. |

## What is in the bank now
24 maths questions (ratio/percentage/arithmetic 17, geometry 7) from the cssaspirants.pk compilations of the
2023 (Special, recalled), 2024, 2025 and 2026 MPT papers. The 2022 file (cssprep.com.pk, "not for redistribution")
had no questions that fit the modules and was not used. The MPT has **no trigonometry** questions in these papers.

Inclusion rule: the question fits a module, **and** the answer key printed in the compilation agrees with an
independent re-solve. Left out because the printed key was wrong: 2023 Q60, Q69, Q73, Q79; 2024 Q122, Q123, Q134;
2025 Q56 (key says 24 L, correct is 42 L). Stems and options are as printed; solutions, fast methods and traps are ours.

## Adding an entry
1. Find the question in the paper; copy the stem and four options exactly, in printed order.
2. Solve it yourself; do not trust the printed key. Write your own steps, fast method and trap.
3. Fill `ref` (year, exam, questionNo, sourceUrl, evidence, verifiedOn, verifiedBy, and `sourceName` for compilations).
   Use `evidence: "fpsc-website"` only with an fpsc.gov.pk URL, and `"official-paper-copy"` only if you hold an official copy.
4. `topic` must be a generator topic id, or `ratio-other` / `geometry-other` / `trigonometry-other`.

Entries failing `validatePastPaperItem` are ignored (with a console warning in development) and never badged.
