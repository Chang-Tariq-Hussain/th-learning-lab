/**
 * The single place where each exam's pattern, syllabus and mock settings live.
 * Change a number here and the generator, landing pages, practice builder and audit follow; the question bank is untouched.
 */
import syllabusJson from "./syllabus.json";
import type { ExamConfig, ExamType, TeacherSubject } from "./types";

export const SYLLABUS = syllabusJson as Record<ExamType, Record<TeacherSubject, string[]>>;

const STS_PST_SAMPLE = {
  title: "STS sample test paper for PST (official SIBA Testing Services sample, hosted by testpreparation.com.pk)",
  url: "https://testpreparation.com.pk/wp-content/uploads/2020/12/PST-Sample-Paper-2020.pdf",
};
const STS_JEST_SAMPLE = {
  title: "STS sample test paper for JEST (official SIBA Testing Services sample, hosted by testpreparation.com.pk)",
  url: "https://testpreparation.com.pk/wp-content/uploads/2020/12/Sample_Paper-JEST-Related_RSU.pdf",
};
const STS_JST_SPEC = {
  title: "SIBA Testing Services: Test Specifications, Recruitment Test for Junior Science Teacher (BPS-14), School Education & Literacy Department, Government of Sindh (official PDF supplied by the project owner)",
};

const MIX_FIRST_PASS = { verified_past_paper: 0.15, existing_question: 0.1, generated_similar: 0.15, generated_syllabus: 0.6 };

/** Section sizes follow the official STS sample papers (PST, JEST) and the official STS test specification (JST). */
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
        { code: "MTL", title: "Mother Tongue", subject: "MotherTongue", count: 15 },
        { code: "ISL", title: "Islamiat and Ethics", subject: "Islamiat", count: 5 },
        { code: "CMP", title: "Computer Knowledge", subject: "Computer", count: 5 },
        { code: "SOC", title: "Social Studies, Current Affairs and General Knowledge", subject: "Social Studies", count: 5 },
        { code: "ENG", title: "English", subject: "English", count: 20 },
        { code: "MAT", title: "Mathematics", subject: "Mathematics", count: 25 },
        { code: "SCI", title: "General Science", subject: "Science", count: 25 },
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
      status: "partially-verified",
      note:
        "Part sizes (Mother Tongue 15, Social Studies / Current Affairs / GK / Islamiat / Ethics / Computer knowledge 15, English 20, Mathematics 25, General Science 25 = 100) come from the official STS sample paper for PST. The sample does not split the 15-question third part: the 5 + 5 + 5 split between Islamiat, Computer and Social Studies is an assumption (the sample shows the three groups with equal weight). The 90-minute duration, no negative marking and absence of a pass mark are not stated in the sample and are assumptions; one news report mentions 100 minutes for the 2021 written test. Edit this object when an official notice is available.",
      sources: [STS_PST_SAMPLE],
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
        { code: "ENG", title: "Part I: English", subject: "English", count: 20 },
        { code: "MAT", title: "Part I: Mathematics", subject: "Mathematics", count: 20 },
        { code: "SCI", title: "Part I: General Science", subject: "Science", count: 20 },
        { code: "CMP", title: "Part I: Computer", subject: "Computer", count: 10 },
        { code: "SOC", title: "Part II: General Knowledge", subject: "Social Studies", count: 10 },
        { code: "PED", title: "Part III: Pedagogy, Assessment and Education", subject: "Pedagogy", count: 20 },
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
        "Part sizes (Part I subject-related 70, Part II General Knowledge / I.Q 10, Part III Pedagogy / Assessment / Education 20 = 100) come from the official STS sample paper for JEST. The sample does not split Part I: English 20, Mathematics 20, General Science 20 and Computer 10 is an assumption, and the sample has no Mother Tongue or Islamiat section. It does not state the class band; the Classes VI-X band comes from the brief supplied earlier. The 90-minute duration, no negative marking and absence of a pass mark are assumptions. Edit this object when an official notice is available.",
      sources: [STS_JEST_SAMPLE],
    },
  },
  jst: {
    id: "jst",
    label: "JST",
    fullName: "Junior Science Teacher",
    level: "Junior secondary (science)",
    syllabusClasses: "Graduation level (STS test paper level); topics as listed in the official specification",
    motherTongue: "ur",
    mock: {
      questions: 100,
      durationMinutes: 90,
      passMarks: null,
      negativeMarking: false,
      sections: [
        { code: "ENG", title: "English", subject: "English", count: 10 },
        { code: "SOC", title: "General Knowledge (Social Studies, Pakistan Studies)", subject: "Social Studies", count: 10 },
        { code: "PED", title: "Teaching and Learning Pedagogies", subject: "Pedagogy", count: 20 },
        { code: "SCI", title: "Science (Biology, Chemistry, Physics)", subject: "Science", count: 36, branches: { Biology: 12, Chemistry: 12, Physics: 12 } },
        { code: "MAT", title: "Mathematics", subject: "Mathematics", count: 12 },
        { code: "CMP", title: "Computer", subject: "Computer", count: 12 },
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
      status: "partially-verified",
      note:
        "Section weights and topic lists follow the official STS test specification for Junior Science Teacher (BPS-14), graduation level: English 10%, General Knowledge 10%, Teaching and Learning Pedagogies 20%, Biology 12%, Chemistry 12%, Physics 12%, Mathematics 12%, Computer 12%. Duration (90 minutes), no negative marking and absence of a pass mark are not in the specification and are assumptions. Biology, Chemistry and Physics are drawn as one Science section of 12 + 12 + 12 and the questions are shuffled within it.",
      sources: [STS_JST_SPEC],
    },
  },
};

export function getExamConfig(exam: string): ExamConfig | null {
  return exam === "pst" || exam === "jest" || exam === "jst" ? teacherExamConfig[exam] : null;
}

export const TEACHER_BASE = "/dashboard/mock-tests/sindh-teacher";
