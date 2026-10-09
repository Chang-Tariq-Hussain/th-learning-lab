export type Letter = "A" | "B" | "C" | "D";
export type AnswerMap = Record<string, Letter>;

/**
 * The shape the exam screens need. MptQuestion (CSS MPT) satisfies it as is; other exams
 * (e.g. the Sindh teacher tests) adapt their own questions into this shape.
 */
export interface RunnerQuestion {
  id: string;
  subject: string;
  subjectCode: string;
  topic: string;
  difficulty: string;
  question: string;
  passage: string | null;
  options: Record<Letter, string>;
  correctAnswer: Letter;
  explanation: string;
  sourceType: string;
  sourceYear: number | null;
  verified: boolean;
  /** right-to-left text (Urdu, Sindhi). When absent, Urdu is detected from subjectCode "UR". */
  rtl?: boolean;
}
