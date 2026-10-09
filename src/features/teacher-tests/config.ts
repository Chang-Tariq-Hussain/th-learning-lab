/**
 * The single place where each exam's pattern, syllabus and mock settings live.
 * Change a number here and the generator, landing pages, practice builder and audit follow; the question bank is untouched.
 */
import syllabusJson from "./syllabus.json";
import type { ExamConfig, ExamType, TeacherSubject } from "./types";

export const SYLLABUS = syllabusJson as Record<ExamType, Record<TeacherSubject, string[]>>;

const THIRD_PARTY_PATTERN = {
  title: "TestPoint: JEST syllabus and pattern (third-party, cites no official source)",
  url: "https://testpointpk.com/paper-mcqs/1749/jest-syllabus-(updated)-download-pdf",
};

const MIX_FIRST_PASS = { verified_past_paper: 0.15, existing_question: 0.1, generated_similar: 0.15, generated_syllabus: 0.6 };

/** Parts follow the order of the third-party description: mother tongue, social studies / Islamiat, English, maths, science, computer. */
export const teacherExamConfig: Record<ExamType, ExamConfig> = {
  pst: {
    id: "pst",
    label: "PST",
    fullName: "Primary School Teacher",
    level: "Primary",
    syllabusClasses: "Sindh Textbook Board books, about Classes I-VIII",
    motherTongue: "ur",
    mock: {
      questions: 100,
      durationMinutes: 90,
      passMarks: null,
      negativeMarking: false,
      sections: [
        { code: "MTL", title: "Mother Tongue", subject: "MotherTongue", count: 20 },
        { code: "SOC", title: "Social Studies and General Knowledge", subject: "Social Studies", count: 5 },
        { code: "ISL", title: "Islamiat", subject: "Islamiat", count: 5 },
        { code: "ENG", title: "English", subject: "English", count: 20 },
        { code: "MAT", title: "Mathematics", subject: "Mathematics", count: 20 },
        { code: "SCI", title: "Science", subject: "Science", count: 20 },
        { code: "CMP", title: "Computer", subject: "Computer", count: 10 },
      ],
      difficulty: { easy: 0.3, moderate: 0.5, difficult: 0.2 },
      sourceMix: MIX_FIRST_PASS,
      mockCount: 5,
      randomizeQuestions: true,
      randomizeOptions: true,
    },
    practice: { defaultCount: 20, maxCount: 50, minutesPerQuestion: 1 },
    currentAffairs: false,
    pattern: {
      status: "unverified",
      note:
        "100 MCQs, 90 minutes, no negative marking and the part sizes come from a third-party page describing the JEST 2023 paper; no official STS/SIBA or Sindh SELD document was found, and it is applied to PST here as an assumption. The 5 + 5 split of the 10-question social studies / Islamiat part and the absence of a pass mark are also assumptions. Edit this object when the official notice is available.",
      sources: [THIRD_PARTY_PATTERN],
    },
  },
  jest: {
    id: "jest",
    label: "JEST",
    fullName: "Junior Elementary School Teacher",
    level: "Elementary",
    syllabusClasses: "Sindh Textbook Board books, Classes VI-X",
    motherTongue: "ur",
    mock: {
      questions: 100,
      durationMinutes: 90,
      passMarks: null,
      negativeMarking: false,
      sections: [
        { code: "MTL", title: "Mother Tongue", subject: "MotherTongue", count: 20 },
        { code: "SOC", title: "Social Studies and General Knowledge", subject: "Social Studies", count: 5 },
        { code: "ISL", title: "Islamiat", subject: "Islamiat", count: 5 },
        { code: "ENG", title: "English", subject: "English", count: 20 },
        { code: "MAT", title: "Mathematics", subject: "Mathematics", count: 20 },
        { code: "SCI", title: "Science", subject: "Science", count: 20 },
        { code: "CMP", title: "Computer", subject: "Computer", count: 10 },
      ],
      difficulty: { easy: 0.22, moderate: 0.5, difficult: 0.28 },
      sourceMix: MIX_FIRST_PASS,
      mockCount: 5,
      randomizeQuestions: true,
      randomizeOptions: true,
    },
    practice: { defaultCount: 20, maxCount: 50, minutesPerQuestion: 1 },
    currentAffairs: false,
    pattern: {
      status: "partially-verified",
      note:
        "The 100 MCQ / 90 minute / six-part pattern matches a third-party description of the JEST 2023 paper, but it cites no official source. The Classes VI-X syllabus band comes from the brief you supplied (an official Sindh circular), which I could not locate myself. The 5 + 5 social studies / Islamiat split and the missing pass mark are assumptions.",
      sources: [THIRD_PARTY_PATTERN],
    },
  },
  jst: {
    id: "jst",
    label: "JST",
    fullName: "Junior Science Teacher",
    level: "Junior secondary (science)",
    syllabusClasses: "Science-graduate level subject content with school-level maths and English (assumed)",
    motherTongue: "ur",
    mock: {
      questions: 100,
      durationMinutes: 90,
      passMarks: null,
      negativeMarking: false,
      sections: [
        { code: "MTL", title: "Mother Tongue", subject: "MotherTongue", count: 5 },
        { code: "SOC", title: "Social Studies and General Knowledge", subject: "Social Studies", count: 5 },
        { code: "ISL", title: "Islamiat", subject: "Islamiat", count: 5 },
        { code: "ENG", title: "English", subject: "English", count: 15 },
        { code: "MAT", title: "Mathematics", subject: "Mathematics", count: 20 },
        { code: "SCI", title: "Science (Physics, Chemistry, Biology)", subject: "Science", count: 45, branches: { Physics: 15, Chemistry: 15, Biology: 15 } },
        { code: "CMP", title: "Computer", subject: "Computer", count: 5 },
      ],
      difficulty: { easy: 0.2, moderate: 0.5, difficult: 0.3 },
      sourceMix: MIX_FIRST_PASS,
      mockCount: 5,
      randomizeQuestions: true,
      randomizeOptions: true,
    },
    practice: { defaultCount: 20, maxCount: 50, minutesPerQuestion: 1 },
    currentAffairs: false,
    pattern: {
      status: "unverified",
      note:
        "Every source found says the Sindh JST is the Junior Science Teacher (BPS-14, science graduates) recruited through SIBA Testing Service, but none states a test pattern or syllabus. The section sizes here are a placeholder I designed (science-heavy), not an official pattern. Replace them when the notice is available.",
      sources: [
        { title: "GoTest: Sindh JST jobs 2026 (eligibility only, no test pattern)", url: "https://gotest.com.pk/latest-jobs/sts-jst-sindh-jobs/" },
      ],
    },
  },
};

export function getExamConfig(exam: string): ExamConfig | null {
  return exam === "pst" || exam === "jest" || exam === "jst" ? teacherExamConfig[exam] : null;
}

export const TEACHER_BASE = "/dashboard/mock-tests/sindh-teacher";
