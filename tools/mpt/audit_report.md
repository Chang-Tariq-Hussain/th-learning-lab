# CSS MPT Question Bank - Audit Report (updated 7 Oct 2026, Mock 1 + Mock 2)

## 1. Existing Question Bank Audit
Source: the five uploaded PDFs (the zip has no MPT question data yet; the 501 Synonym & Antonym PDF was not uploaded in this chat).

| File | Numbered entries | Notes |
|---|---:|---|
| CSS MPT 2026 | 200 | 35 (Urdu 21-40, English 58-72) were prepared by cssaspirants.pk, not original |
| CSS MPT 2025 (scan, OCR) | 180 | cover says 200; pages end at Q180 |
| CSS MPT 2024 | 200 | 50 are marked "duplicate" inside the file; ~82 of the rest also appear in 2026; provenance doubtful |
| CSS MPT 2023 Special | 125 | no Urdu section |
| CSS MPT 2022 | ~114 | many gaps; ~13 English items dropped by the source |

- Total question entries: about 819 numbered (709 were machine-parseable).
- Unique questions: about 560 (estimate, +/-5%).
- Duplicate / near-duplicate entries: about 150-260 (2024 internal duplicates, plus the 2026/2025 overlap of ~49 and 2026/2024 overlap of ~82).
- Per-subject counts for the full 819 were NOT produced: that needs a manual per-question pass. Exact counts exist only for the 200 questions in the bank (below).

## 2. Final bank (this pass)
Question bank size: 200. Mock 1 uses all 200, so no reserve questions exist yet for Mock 2.

| Source type | Count |
|---|---:|
| Verified Past Paper | 163 |
| Existing Question Bank | 12 |
| Generated Practice | 25 |

"Verified Past Paper" here means: the item appears in an uploaded third-party reproduction AND I independently re-checked the answer. FPSC does not release booklets, so none of these is an official copy. No item was taken from the 2024 file (provenance doubt).
"Existing Question Bank" = the 12 Urdu items from the 2026 file that were prepared by cssaspirants.pk.

## 3. Mock 1 (exact)
Islamic Studies 20/20, Urdu 20/20, English 50/50, General Abilities 60/60, GK/CA/PA 50/50. Total 200. Time 200 minutes. Passing 66/200.
Difficulty: Easy 59 (29.5%), Moderate 98 (49%), Difficult 43 (21.5%). Correct-answer letters: A 50, B 50, C 50, D 50.
Section order follows the real papers: Islamic, Urdu, English, General Abilities, then GK (science first, then international, current affairs, Pakistan).

## 4. Things I changed or rejected
Keys I found wrong or unsafe, so those items were NOT used:
- 2025 Q50 (sqrt(-25) = "None of these"; correct answer is 5i, not a real number)
- 2025 Q53 (key says 0; x^(1/2) * x^(-1/2) = 1, flagged by the source itself)
- 2025 Q56 (alcohol/water mixture: correct answer is 42 litres, not among options 18/24/26)
- 2023 Q7 ("Muhammad is the Messenger of Allah" key = Surah Fatiha; wrong, it is Al-Fath 48:29)
- 2025 Q13 / 2026 Q13 (Ibn al-Nafis is credited with pulmonary circulation, not blood pressure)
- Conflicting keys between years: 2025/2026 Q2 (An'am vs None; Isra 17:31 also has it), Q5 (Rasool/Hadi/Sarwar Alam), Q8 (Marfu'), Q18 (Imam-ul-Fuqaha), Q20 (Ijma)
- Ambiguous or multi-correct: 2026 Q51, Q53 grammar items; 2023 subjunctive and tense items; Scraggly, Sobriquet, Metanoia, Lionize, Solipsist
- Time-sensitive 2022-2025 current-affairs items (stale as of Oct 2026)
- The 2022 file's "Corrected" items were re-checked; its Q184 (first female governor) and Q183 (FATA) keys were kept in corrected form.
Edits to kept items: Urdu "sab'-e-tawal" stem reworded; FATF->FATA typo fixed; Winter Olympics changed from "will host" to "hosted"; one English grammar item adapted and relabelled Generated Practice.
Answer options were re-ordered on 72 items (those with no "None of these", numbers or ordered lists) to balance A-D; flagged by optionsReordered=true.

## 5. Verification done
- All numeric/logic General Abilities answers re-computed independently in verify_math.py (49 checks, including an exhaustive check of the timetable puzzle).
- Current affairs checked by web search on 5 Oct 2026: FIFA World Cup 2026 (Spain), T20 World Cup 2026 (India), Nobel Peace 2025 (Machado), Nobel Literature 2025 (Krasznahorkai), 27th Amendment (Federal Constitutional Court, Chief of Defence Forces), Saudi-Pakistan defence agreement (17 Sep 2025), COP30 (Belem), UNSC 2025-26 term. The Winter Olympics 2026 item (Italy) was not searched; it is a long-settled event.
- Urdu: checked by me only. Please have a native speaker skim the 20 Urdu items (14 are flagged for it).
- Islamic Studies / GK facts: checked from my own knowledge, not against primary sources.

## 6. Earlier next-pass list (superseded by section 7)
1. Parse the unused past-paper items (2025 Q94-180, 2022, 2023 remainder) into a reserve bank so Mock 2/3 can draw without repeats.
2. Build the exam UI (timer 03:20:00, palette, review, analysis) inside src/features/mpt-mock/ using mpt-mock-data.ts.


## 7. Mock 2 (added 7 Oct 2026)
Bank size now 400 (Mock 1 = 200 frozen, Mock 2 = 200 new). Zero shared ids, zero near-duplicate text (difflib > 0.8) and zero same-answer/same-stem-word pairs between the two mocks (validate_mock.py).

| Source type (Mock 2) | Count |
|---|---:|
| Verified Past Paper | 50 |
| Existing Question Bank | 6 |
| Generated Practice | 144 |

| Subject | VP | EQB | GP | Total |
|---|---:|---:|---:|---:|
| Islamic Studies | 8 | 0 | 12 | 20 |
| Urdu | 7 | 6 | 7 | 20 |
| English | 16 | 0 | 34 | 50 |
| General Abilities | 1 | 0 | 59 | 60 |
| GK / CA / PA | 18 | 0 | 32 | 50 |

Difficulty: Easy 57 (28.5%), Moderate 100 (50%), Difficult 43 (21.5%). Correct letters: A 50, B 50, C 50, D 50. 200 minutes, pass 66/200, no negative marking.
Most clean past-paper items were already used in Mock 1, so Mock 2 is mostly Generated Practice. "Verified Past Paper" has the same meaning as in section 2 (third-party reproduction + my own re-check of the key; never an official FPSC booklet).

### Yield notes
Every Mock 2 item carries a yieldNote. "High-yield" = topic/pattern recurs across the 2022/2023/2025/2026 reproductions, counted approximately by keyword (Urdu: by reading page images). It is not a prediction of what will appear.

### Web-verified current affairs (6 Oct 2026)
Checked against search results on the date above; each item's verifiedNote says what was checked. Facts already used in Mock 1 (FIFA WC 2026, T20 WC 2026, Nobel Peace/Literature 2025, 27th Amendment/FCC/CDF, Pakistan-Saudi pact, COP30, UNSC 2025-26) are excluded.

### Independent checks
- verify_math.py (Mock 1, 49 checks) and verify_math2.py (Mock 2, 60/60 GA items recomputed by brute force or a different method) pass.
- validate_mock.py: ALL CHECKS PASSED (200 ids, 20/20/50/60/50 split and order, difficulty bands, letters 45-55, within- and cross-mock duplicates).
- app_tests/ (node scripts): grading, 03:20:00 clock, section pass marks 7/7/17/20/17, legacy-key migration, history dedupe/cap, throwing localStorage.

### NOT independently verified
- Urdu (all 20 Mock 2 items): written/checked by me only; needs a native-speaker review (all flagged).
- Islamic Studies and Pakistan/science GK facts: from my own knowledge, not primary sources. Hisham I and the first-naval-expedition-under-Uthman items are reasoned from history and should be double-checked.
- Past-paper keys: third-party reproductions, re-derived by me; 2025 PDF was OCR'd (tesseract).
- Current-affairs items are only as fresh as 6 Oct 2026.
- Letter order was shuffled on items without "None of these"/numbers/ordered lists (optionsReordered=true).
