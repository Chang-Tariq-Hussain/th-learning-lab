/** Data model for the Sindh teacher recruitment tests (PST, JEST, JST). One bank schema, one config per exam. */

export type ExamType = "pst" | "jest" | "jst";
export const EXAM_TYPES: ExamType[] = ["pst", "jest", "jst"];

export type TeacherSubject =
  | "English"
  | "Mathematics"
  | "Science"
  | "Computer"
  | "Islamiat"
  | "Social Studies"
  | "Sindhi"
  | "Urdu";

export const TEACHER_SUBJECTS: TeacherSubject[] = ["English", "Mathematics", "Science", "Computer", "Islamiat", "Social Studies", "Sindhi", "Urdu"];

export type TeacherDifficulty = "easy" | "moderate" | "difficult";
export const DIFFICULTIES: TeacherDifficulty[] = ["easy", "moderate", "difficult"];

/**
 * verified_past_paper  - copied from a past paper whose origin was actually checked
 * existing_question    - taken from a question bank that already existed in this project (origin in sourceReference)
 * generated_similar    - written to mirror a specific, named existing/past question (named in sourceReference)
 * generated_syllabus   - written from the syllabus, not modelled on any particular earlier question
 */
export type TeacherSourceType = "verified_past_paper" | "existing_question" | "generated_similar" | "generated_syllabus";
export const SOURCE_TYPES: TeacherSourceType[] = ["verified_past_paper", "existing_question", "generated_similar", "generated_syllabus"];

export type QuestionLanguage = "en" | "ur" | "sd";

export interface TeacherQuestion {
  id: string;
  /** exam this copy of the question belongs to */
  examType: ExamType;
  /** every exam this question may appear in (always includes examType) */
  examTypes: ExamType[];
  question: string;
  passage: string | null;
  options: [string, string, string, string];
  /** index into options, 0-3 */
  correctAnswer: number;
  explanation: string;
  subject: TeacherSubject;
  topic: string;
  subtopic: string | null;
  difficulty: TeacherDifficulty;
  sourceType: TeacherSourceType;
  sourceYear: number | null;
  /** past-paper name (e.g. "STS PST 2021") or the id of the question this was taken from / modelled on */
  sourceReference: string | null;
  verified: boolean;
  /** why `verified` has the value it has */
  verificationNote: string;
  /** e.g. "Classes VI-VIII"; null when the question is not tied to a class band */
  syllabusClass: string | null;
  language: QuestionLanguage;
  /** keep option order as written (set when options refer to each other, or are an ordered list) */
  fixedOrder: boolean;
  /** true when the question needs a native-speaker check before it is relied on */
  needsReview: boolean;
  /** set at generation time; real usage is tracked per device (see exposure.ts) */
  timesUsed?: number;
  lastUsed?: string | null;
}

export interface SectionConfig {
  code: string;
  title: string;
  /** "MotherTongue" resolves to the exam's configured language (Urdu or Sindhi) */
  subject: TeacherSubject | "MotherTongue";
  count: number;
  /** optional quota per branch, matched against the topic prefix before ":" (e.g. Science: Physics / Chemistry / Biology) */
  branches?: Record<string, number>;
}

export interface Fractions {
  easy: number;
  moderate: number;
  difficult: number;
}

export interface ExamConfig {
  id: ExamType;
  label: string;
  fullName: string;
  level: string;
  /** the curriculum band the test is said to cover */
  syllabusClasses: string;
  motherTongue: "ur" | "sd";
  mock: {
    questions: number;
    durationMinutes: number;
    /** null = no official pass mark known, so no PASS / FAIL is shown */
    passMarks: number | null;
    negativeMarking: boolean;
    sections: SectionConfig[];
    difficulty: Fractions;
    /** share of each source type wanted in a mock; unavailable types are made up from the others */
    sourceMix: Partial<Record<TeacherSourceType, number>>;
    /** how many numbered mocks (Mock 1..n) are offered */
    mockCount: number;
    randomizeQuestions: boolean;
    randomizeOptions: boolean;
  };
  practice: { defaultCount: number; maxCount: number; minutesPerQuestion: number };
  /** whether current-affairs questions may be used for this exam */
  currentAffairs: boolean;
  /** how well the pattern and syllabus above are confirmed */
  pattern: {
    status: "unverified" | "partially-verified" | "verified";
    note: string;
    sources: { title: string; url: string }[];
  };
}
