import { auditBank } from "@/features/teacher-tests/audit";
import { EXAM_TYPES, type ExamType, type TeacherQuestion } from "@/features/teacher-tests/types";
import { finding, type CheckDefinition, type CheckFn, type Finding, type Severity } from "../types";

export const teacherChecks: CheckDefinition[] = [
  { id: "teacher.bank-integrity", area: "teacher", severity: "critical", description: "Duplicate ids, invalid answers, unverified past-paper claims, or non-past-paper questions marked verified (from the bank's own audit)." },
  { id: "teacher.bank-quality", area: "teacher", severity: "high", description: "Duplicate options, missing explanations, or incomplete metadata." },
  { id: "teacher.bank-duplicates", area: "teacher", severity: "medium", description: "Exact or near-duplicate questions." },
  { id: "teacher.needs-review", area: "teacher", severity: "medium", description: "Questions flagged as needing a native-speaker / expert check." },
  { id: "teacher.copy-inconsistent", area: "teacher", severity: "high", description: "A question shared between exam banks differs between copies." },
  { id: "teacher.config-total-mismatch", area: "teacher", severity: "critical", description: "An exam's section sizes do not add up to its question count." },
  { id: "teacher.branch-quota-mismatch", area: "teacher", severity: "high", description: "A section's branch quotas do not add up to its size." },
  { id: "teacher.section-no-questions", area: "teacher", severity: "high", description: "A section has no questions in the bank." },
  { id: "teacher.bank-too-small", area: "teacher", severity: "medium", description: "The bank cannot supply the configured number of non-overlapping mocks for a subject." },
  { id: "teacher.no-past-papers", area: "teacher", severity: "info", description: "The bank contains no verified past-paper questions." },
  { id: "teacher.pattern-unverified", area: "teacher", severity: "info", description: "The exam pattern is not fully verified against an official source." },
  { id: "teacher.no-pass-mark", area: "teacher", severity: "info", description: "No official pass mark is configured, so results show no pass/fail." },
];

const BANK_FILE: Record<ExamType, string> = {
  pst: "src/features/teacher-tests/data/pst-bank.ts",
  jest: "src/features/teacher-tests/data/jest-bank.ts",
  jst: "src/features/teacher-tests/data/jst-bank.ts",
};

export const checkTeacher: CheckFn = (ctx) => {
  const out: Finding[] = [];
  const add = (check: string, severity: Severity, exam: ExamType, title: string, detail?: string, entityExtra = ""): void => {
    out.push(finding({ check, area: "teacher", severity, subject: exam, entity: `${exam}${entityExtra}`, title, detail, file: BANK_FILE[exam] }));
  };

  for (const exam of EXAM_TYPES) {
    const bank = ctx.teacher.banks[exam];
    const cfg = ctx.teacher.config[exam];
    const a = auditBank(bank);
    const integrity = [
      a.duplicateIds && `${a.duplicateIds} duplicate id(s)`,
      a.invalidAnswers && `${a.invalidAnswers} invalid answer(s)`,
      a.unverifiedPastPaperClaims && `${a.unverifiedPastPaperClaims} past-paper claim(s) without year/reference/verification`,
      a.generatedMarkedVerified && `${a.generatedMarkedVerified} non-past-paper question(s) marked verified`,
    ].filter(Boolean);
    if (integrity.length) add("teacher.bank-integrity", "critical", exam, `${cfg.label} bank: ${integrity.join("; ")}.`);
    const quality = [
      a.duplicateOptions && `${a.duplicateOptions} with repeated options`,
      a.missingExplanations && `${a.missingExplanations} without explanation`,
      a.incompleteMetadata && `${a.incompleteMetadata} with incomplete metadata`,
    ].filter(Boolean);
    if (quality.length) add("teacher.bank-quality", "high", exam, `${cfg.label} bank: ${quality.join("; ")}.`);
    if (a.exactDuplicates + a.nearDuplicates > 0) add("teacher.bank-duplicates", "medium", exam, `${cfg.label} bank: ${a.exactDuplicates} exact and ${a.nearDuplicates} near-duplicate question(s).`);
    if (a.needsReview > 0) add("teacher.needs-review", "medium", exam, `${cfg.label} bank: ${a.needsReview} question(s) flagged needsReview (native-speaker check recommended).`);
    if (a.bySource.verified_past_paper === 0) add("teacher.no-past-papers", "info", exam, `${cfg.label} bank has no verified past-paper questions; every question is generated or taken from the existing bank.`);
    if (cfg.pattern.status !== "verified") add("teacher.pattern-unverified", "info", exam, `${cfg.label} exam pattern is "${cfg.pattern.status}".`, cfg.pattern.note);
    if (cfg.mock.passMarks === null) add("teacher.no-pass-mark", "info", exam, `${cfg.label} has no official pass mark configured.`);

    for (const q of bank) {
      if (q.examType !== exam) { add("teacher.copy-inconsistent", "high", exam, `${q.id} is stored in the ${exam.toUpperCase()} bank but its examType is "${q.examType}".`, undefined, `/${q.id}`); }
    }

    const sectionSum = cfg.mock.sections.reduce((n, s) => n + s.count, 0);
    if (sectionSum !== cfg.mock.questions) add("teacher.config-total-mismatch", "critical", exam, `${cfg.label}: sections sum to ${sectionSum} but the mock is configured for ${cfg.mock.questions} questions.`);

    const have = new Map<string, number>();
    for (const q of bank) have.set(q.subject, (have.get(q.subject) ?? 0) + 1);
    const need = new Map<string, number>();
    for (const s of cfg.mock.sections) {
      const subject = s.subject === "MotherTongue" ? (cfg.motherTongue === "sd" ? "Sindhi" : "Urdu") : s.subject;
      need.set(subject, (need.get(subject) ?? 0) + s.count * cfg.mock.mockCount);
      if ((have.get(subject) ?? 0) === 0) add("teacher.section-no-questions", "high", exam, `${cfg.label} section ${s.code} (${subject}) has no questions in the bank.`, undefined, `/${s.code}`);
      if (s.branches) {
        const q = Object.values(s.branches).reduce((a, b) => a + b, 0);
        if (q !== s.count) add("teacher.branch-quota-mismatch", "high", exam, `${cfg.label} section ${s.code}: branch quotas sum to ${q}, section size is ${s.count}.`, undefined, `/${s.code}`);
      }
    }
    for (const [subject, n] of need) {
      const h = have.get(subject) ?? 0;
      if (h > 0 && h < n) add("teacher.bank-too-small", "medium", exam, `${cfg.label} ${subject}: ${h} questions available, ${n} needed for ${cfg.mock.mockCount} fully distinct mocks.`,
        "Later mocks will reuse questions from earlier ones until the bank grows.", `/${subject}`);
    }
  }

  // Questions shared between exam banks must have identical content in every copy (topic and difficulty may differ per exam).
  const copies = new Map<string, TeacherQuestion[]>();
  for (const exam of EXAM_TYPES) for (const q of ctx.teacher.banks[exam]) (copies.get(q.id) ?? copies.set(q.id, []).get(q.id)!).push(q);
  let inconsistent = 0;
  const examples: string[] = [];
  for (const [id, list] of copies) {
    if (list.length < 2) continue;
    const sig = (q: TeacherQuestion): string => JSON.stringify([q.question, q.passage, q.options, q.correctAnswer, q.explanation, q.sourceType, q.sourceYear, q.verified, q.language]);
    const first = sig(list[0]!);
    if (list.some((q) => sig(q) !== first)) { inconsistent += 1; if (examples.length < 6) examples.push(id); }
  }
  if (inconsistent > 0) out.push(finding({ check: "teacher.copy-inconsistent", area: "teacher", severity: "high", entity: "shared-copies",
    title: `${inconsistent} shared question(s) differ between exam banks.`, detail: `Examples: ${examples.join(", ")}` }));
  return out;
};
