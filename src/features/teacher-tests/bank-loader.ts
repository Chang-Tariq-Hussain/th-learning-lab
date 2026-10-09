import type { ExamType, TeacherQuestion } from "./types";

/** Loads one exam's bank on demand so the other exams' questions are never downloaded. */
export async function loadBank(exam: ExamType): Promise<TeacherQuestion[]> {
  switch (exam) {
    case "pst":
      return (await import("./data/pst-bank")).PST_BANK;
    case "jest":
      return (await import("./data/jest-bank")).JEST_BANK;
    case "jst":
      return (await import("./data/jst-bank")).JST_BANK;
  }
}
