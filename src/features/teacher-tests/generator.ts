/**
 * Mock generator for the teacher tests. Pure and deterministic: Mock N for an exam is always the same paper,
 * and each mock prefers questions that earlier mocks have not used (exposure control).
 */
import { apportion, hashString, mulberry32, seededShuffle } from "./random";
import type { ExamConfig, SectionConfig, TeacherDifficulty, TeacherQuestion, TeacherSourceType, TeacherSubject } from "./types";
import { DIFFICULTIES, SOURCE_TYPES } from "./types";

export interface Exposure {
  timesUsed: number;
  /** 1-based index of the last mock that used the question, 0 if never */
  lastIndex: number;
  mockIds: string[];
}
export type ExposureMap = Map<string, Exposure>;

export interface PlannedSection {
  code: string;
  title: string;
  requested: number;
  ids: string[];
}

export interface PlannedMock {
  index: number;
  id: string;
  sections: PlannedSection[];
  questionIds: string[];
  /** human-readable notes when the bank could not fill a section as configured */
  warnings: string[];
}

export function resolveSectionSubject(section: SectionConfig, cfg: ExamConfig): TeacherSubject {
  if (section.subject !== "MotherTongue") return section.subject;
  return cfg.motherTongue === "sd" ? "Sindhi" : "Urdu";
}

export function mockIdFor(exam: string, index: number): string {
  return `${exam}-mock${index}`;
}

interface PickState {
  rnd: () => number;
  rank: Map<string, number>;
  exposure: ExposureMap;
  mockIndex: number;
  topicCount: Map<string, number>;
  chosen: TeacherQuestion[];
  taken: Set<string>;
}

function sortKey(q: TeacherQuestion, st: PickState): [number, number, number, number] {
  const e = st.exposure.get(q.id);
  const recent = e && e.lastIndex > 0 && st.mockIndex - e.lastIndex <= 1 ? 1 : 0;
  return [recent, e?.timesUsed ?? 0, st.topicCount.get(q.topic) ?? 0, st.rank.get(q.id) ?? 0];
}

function wasInPreviousMock(q: TeacherQuestion, st: PickState): boolean {
  const e = st.exposure.get(q.id);
  return !!e && e.lastIndex > 0 && st.mockIndex - e.lastIndex <= 1;
}

function cmp(a: number[], b: number[]): number {
  for (let i = 0; i < a.length; i++) {
    const d = (a[i] ?? 0) - (b[i] ?? 0);
    if (d !== 0) return d;
  }
  return 0;
}

/** Repeatedly takes the best-ranked candidate: not used in the previous mock, least used, from the least-covered topic, then random. */
function pickGreedy(cands: TeacherQuestion[], n: number, st: PickState): void {
  for (let k = 0; k < n; k++) {
    let best: TeacherQuestion | null = null;
    let bestKey: number[] = [];
    for (const q of cands) {
      if (st.taken.has(q.id)) continue;
      const key = sortKey(q, st);
      if (!best || cmp(key, bestKey) < 0) {
        best = q;
        bestKey = key;
      }
    }
    if (!best) return;
    st.taken.add(best.id);
    st.chosen.push(best);
    st.topicCount.set(best.topic, (st.topicCount.get(best.topic) ?? 0) + 1);
  }
}

export function planMock(cfg: ExamConfig, bank: TeacherQuestion[], mockIndex: number, exposure: ExposureMap): PlannedMock {
  const id = mockIdFor(cfg.id, mockIndex);
  const warnings: string[] = [];
  const sections: PlannedSection[] = [];
  const used = new Set<string>();

  for (const section of cfg.mock.sections) {
    const subject = resolveSectionSubject(section, cfg);
    const lang = subject === "Sindhi" ? "sd" : subject === "Urdu" ? "ur" : "en";
    const pool = bank.filter((q) => q.subject === subject && q.language === lang && !used.has(q.id));
    const rnd = mulberry32(hashString(`${id}|${section.code}`));
    const rank = new Map(pool.map((q) => [q.id, rnd()] as const));
    const st: PickState = { rnd, rank, exposure, mockIndex, topicCount: new Map(), chosen: [], taken: new Set() };

    if (section.branches) {
      for (const [branch, n] of Object.entries(section.branches)) {
        const sub = pool.filter((q) => q.topic.startsWith(`${branch}:`));
        const before = st.chosen.length;
        pickByDifficultyAndSource(sub, n, cfg, st);
        if (st.chosen.length - before < n) warnings.push(`${section.code}: only ${st.chosen.length - before} of ${n} ${branch} questions available`);
      }
      if (st.chosen.length < section.count) pickGreedy(pool, section.count - st.chosen.length, st);
    } else {
      pickByDifficultyAndSource(pool, section.count, cfg, st);
    }
    if (st.chosen.length < section.count) warnings.push(`${section.code}: ${st.chosen.length} of ${section.count} questions available`);

    const ordered = cfg.mock.randomizeQuestions ? seededShuffle(st.chosen, mulberry32(hashString(`${id}|${section.code}|order`))) : st.chosen;
    const ids = ordered.map((q) => q.id);
    ids.forEach((qid) => used.add(qid));
    sections.push({ code: section.code, title: section.title, requested: section.count, ids });
  }

  const questionIds = sections.flatMap((s) => s.ids);
  for (const qid of questionIds) {
    const e = exposure.get(qid) ?? { timesUsed: 0, lastIndex: 0, mockIds: [] };
    exposure.set(qid, { timesUsed: e.timesUsed + 1, lastIndex: mockIndex, mockIds: [...e.mockIds, id] });
  }
  return { index: mockIndex, id, sections, questionIds, warnings };
}

/** Fills `count` questions (per difficulty target, then per source mix) and only counts what it adds, so it also works for one branch of a section. */
function pickByDifficultyAndSource(pool: TeacherQuestion[], count: number, cfg: ExamConfig, st: PickState): void {
  const start = st.chosen.length;
  const diffTargets = apportion(count, DIFFICULTIES.map((d) => cfg.mock.difficulty[d]));
  DIFFICULTIES.forEach((d, i) => {
    const want = diffTargets[i] ?? 0;
    const inDiff = pool.filter((q) => q.difficulty === d && !st.taken.has(q.id));
    const before = st.chosen.length;
    const types = SOURCE_TYPES.filter((t) => (cfg.mock.sourceMix[t] ?? 0) > 0 && inDiff.some((q) => q.sourceType === t));
    const srcTargets = apportion(want, types.map((t) => cfg.mock.sourceMix[t] ?? 0));
    // per-type quotas only use questions the previous mock did not use; anything left is made up from the whole difficulty pool below
    types.forEach((t, j) => pickGreedy(inDiff.filter((q) => q.sourceType === t && !wasInPreviousMock(q, st)), srcTargets[j] ?? 0, st));
    const got = st.chosen.length - before;
    if (got < want) pickGreedy(inDiff, want - got, st);
  });
  for (const d of ["moderate", "easy", "difficult"] as TeacherDifficulty[]) {
    const added = st.chosen.length - start;
    if (added >= count) break;
    pickGreedy(pool.filter((q) => q.difficulty === d), count - added, st);
  }
}

/** Plans Mock 1..upTo in order so each mock sees the exposure left by the ones before it. */
export function planMocks(cfg: ExamConfig, bank: TeacherQuestion[], upTo: number): PlannedMock[] {
  const exposure: ExposureMap = new Map();
  const out: PlannedMock[] = [];
  for (let i = 1; i <= upTo; i++) out.push(planMock(cfg, bank, i, exposure));
  return out;
}

export function exposureAfter(cfg: ExamConfig, bank: TeacherQuestion[], upTo: number): { mocks: PlannedMock[]; exposure: ExposureMap } {
  const exposure: ExposureMap = new Map();
  const mocks: PlannedMock[] = [];
  for (let i = 1; i <= upTo; i++) mocks.push(planMock(cfg, bank, i, exposure));
  return { mocks, exposure };
}

export function sourceCounts(questions: TeacherQuestion[]): Record<TeacherSourceType, number> {
  const out = { verified_past_paper: 0, existing_question: 0, generated_similar: 0, generated_syllabus: 0 };
  for (const q of questions) out[q.sourceType] += 1;
  return out;
}
