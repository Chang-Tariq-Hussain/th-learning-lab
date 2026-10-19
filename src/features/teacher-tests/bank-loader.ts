import { applyTeacherOverlay } from "@/lib/content-overlay/apply";
import { overlay } from "@/lib/content-overlay/current";
import type { ExamType, TeacherQuestion } from "./types";

/** The bank as written in code, before any published database edits. Used by the importer. */
export async function loadCodeBank(exam: ExamType): Promise<TeacherQuestion[]> {
  switch (exam) {
    case "pst":
      return (await import("./data/pst-bank")).PST_BANK;
    case "jest":
      return (await import("./data/jest-bank")).JEST_BANK;
    case "jst":
      return (await import("./data/jst-bank")).JST_BANK;
  }
}

/**
 * Loads one exam's bank on demand so the other exams' questions are never downloaded.
 * Returns what learners should see: the code bank with the published content overlay applied
 * (an empty overlay returns the code bank unchanged).
 */
export async function loadBank(exam: ExamType): Promise<TeacherQuestion[]> {
  return applyTeacherOverlay(exam, await loadCodeBank(exam), overlay.teacher);
}
