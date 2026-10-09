/** Developer audit of a teacher question bank. Everything here is computed from the questions themselves. */
import type { TeacherDifficulty, TeacherQuestion, TeacherSourceType } from "./types";

export interface AuditReport {
  total: number;
  shared: number;
  bySource: Record<TeacherSourceType, number>;
  byDifficulty: Record<TeacherDifficulty, number>;
  bySubject: Record<string, number>;
  duplicateIds: number;
  exactDuplicates: number;
  nearDuplicates: number;
  missingExplanations: number;
  unverifiedPastPaperClaims: number;
  invalidAnswers: number;
  duplicateOptions: number;
  incompleteMetadata: number;
  needsReview: number;
  generatedMarkedVerified: number;
}

const words = (s: string): Set<string> => new Set(s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean));

function jaccard(a: Set<string>, b: Set<string>): number {
  let inter = 0;
  for (const w of a) if (b.has(w)) inter += 1;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

export function auditBank(bank: TeacherQuestion[]): AuditReport {
  const r: AuditReport = {
    total: bank.length,
    shared: bank.filter((q) => q.examTypes.length > 1).length,
    bySource: { verified_past_paper: 0, existing_question: 0, generated_similar: 0, generated_syllabus: 0 },
    byDifficulty: { easy: 0, moderate: 0, difficult: 0 },
    bySubject: {},
    duplicateIds: 0,
    exactDuplicates: 0,
    nearDuplicates: 0,
    missingExplanations: 0,
    unverifiedPastPaperClaims: 0,
    invalidAnswers: 0,
    duplicateOptions: 0,
    incompleteMetadata: 0,
    needsReview: 0,
    generatedMarkedVerified: 0,
  };
  const ids = new Set<string>();
  const keys = new Set<string>();
  for (const q of bank) {
    if (ids.has(q.id)) r.duplicateIds += 1;
    ids.add(q.id);
    r.bySource[q.sourceType] += 1;
    r.byDifficulty[q.difficulty] += 1;
    r.bySubject[q.subject] = (r.bySubject[q.subject] ?? 0) + 1;
    if (!q.explanation || q.explanation.trim().length === 0) r.missingExplanations += 1;
    if (q.sourceType === "verified_past_paper" && !(q.verified && q.sourceYear && q.sourceReference)) r.unverifiedPastPaperClaims += 1;
    if (q.sourceType !== "verified_past_paper" && q.verified) r.generatedMarkedVerified += 1;
    if (!Number.isInteger(q.correctAnswer) || q.correctAnswer < 0 || q.correctAnswer > 3 || q.options.length !== 4) r.invalidAnswers += 1;
    if (new Set(q.options.map((o) => o.trim().toLowerCase())).size !== q.options.length) r.duplicateOptions += 1;
    if (!q.subject || !q.topic || !q.difficulty || !q.sourceType || !q.language || !q.verificationNote) r.incompleteMetadata += 1;
    if (q.needsReview) r.needsReview += 1;
    const key = `${q.question.trim().toLowerCase()}|${[...q.options].map((o) => o.trim().toLowerCase()).sort().join("|")}`;
    if (keys.has(key)) r.exactDuplicates += 1;
    keys.add(key);
  }
  const bySubject = new Map<string, { q: TeacherQuestion; w: Set<string> }[]>();
  for (const q of bank) {
    const list = bySubject.get(q.subject) ?? [];
    list.push({ q, w: words(`${q.question} ${q.options.join(" ")}`) });
    bySubject.set(q.subject, list);
  }
  for (const list of bySubject.values()) {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];
        if (a && b && jaccard(a.w, b.w) >= 0.9) r.nearDuplicates += 1;
      }
    }
  }
  return r;
}
