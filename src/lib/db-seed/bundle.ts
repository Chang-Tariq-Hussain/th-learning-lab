import type { HealthContext } from "@/lib/content-health";
import { hashOf } from "./hash";
import { toSerializable } from "./serialize";
import type {
  BankSeed, ConnectionSeed, ExamSeed, ExamTypeSeed, GleSeed, PathSeed, QuestionExamSeed, QuestionSeed,
  SeedBundle, SimulationSeed, SubjectSeed, TopicSeed,
} from "./types";

const normDifficulty = (d: string): string => {
  const x = d.toLowerCase();
  if (x === "easy") return "easy";
  if (x === "medium" || x === "moderate") return "medium";
  if (x === "hard" || x === "difficult") return "hard";
  throw new Error(`Unknown difficulty "${d}"`);
};

const withHash = <T extends object>(row: T): T & { hash: string } => ({ ...row, hash: hashOf(row) });

/**
 * Builds the complete, normalised picture of what the code registries contain.
 * Pure: no database, no side effects. Throws on data that could never be stored
 * (e.g. a quiz answer that matches none of its options) rather than importing it.
 */
export function buildSeedBundle(ctx: HealthContext): SeedBundle {
  // ------------------------------------------------------- subject tree ----
  const gleByHref = new Map(ctx.gle.map((t) => [t.simulationHref, t]));
  const subjects: SubjectSeed[] = [];
  const topics: TopicSeed[] = [];
  const simulations: SimulationSeed[] = [];
  ctx.subjects.forEach((s, si) => {
    subjects.push(withHash({ slug: s.slug, code: s.code, name: s.name, tagline: s.tagline, description: s.description, notation: s.notation, sort_order: si }));
    s.topics.forEach((t, ti) => {
      topics.push(withHash({ subject_slug: s.slug, slug: t.slug, name: t.name, sort_order: ti }));
      t.visualizations.forEach((v, vi) => {
        simulations.push(withHash({
          subject_slug: s.slug, topic_slug: t.slug, slug: v.slug,
          content_slug: gleByHref.get(v.href)?.topicSlug ?? v.slug,
          title: v.title, description: v.description, href: v.href, sort_order: vi,
        }));
      });
    });
  });

  // --------------------------------------------------------------- GLE -----
  const gle: GleSeed[] = ctx.gle.map((t) => {
    const { value, dropped } = toSerializable(t);
    return withHash({ href: t.simulationHref, content: value, dropped_paths: dropped, schema_version: 1 });
  });

  // ------------------------------------------------------ learning paths ----
  const paths: PathSeed[] = ctx.paths.map((p) =>
    withHash({
      slug: p.id, subject_slug: p.subjectSlug, title: p.title, description: p.description, color_token: p.colorToken,
      nodes: p.topics.map((n, i) => ({
        position: i, subject_slug: n.subjectSlug, topic_slug: n.topicSlug, href: n.href, title: n.title, description: n.description,
        is_challenge: n.isChallenge === true,
        prereq_mode: n.prerequisites !== undefined ? ("explicit" as const) : ("previous" as const),
        prereqs: (n.prerequisites ?? []).map((q) => ({ subject_slug: q.subjectSlug, topic_slug: q.topicSlug })),
      })),
    }),
  );

  // ---------------------------------------------------------- questions ----
  const questions: QuestionSeed[] = [];
  const banks: BankSeed[] = [];

  for (const quiz of ctx.quizzes) {
    banks.push(withHash({
      slug: quiz.id, subject_slug: quiz.subjectSlug, title: quiz.title, description: quiz.description,
      subject_label: quiz.subjectLabel, topic_label: quiz.topicLabel, back_href: quiz.backHref,
      difficulty: normDifficulty(quiz.difficulty), estimated_time: quiz.estimatedTime,
      question_ids: quiz.questions.map((q) => q.id),
    }));
    for (const q of quiz.questions) {
      const idx = q.options.indexOf(q.correctAnswer);
      if (idx < 0) throw new Error(`Quiz question ${q.id} (bank ${quiz.id}): correct answer matches no option — fix the data before importing.`);
      questions.push(withHash({
        source_system: "quiz" as const, legacy_id: q.id, subject_slug: q.subject, exam_subject: null,
        topic: q.topic, concept: q.concept ?? null, difficulty: normDifficulty(q.difficulty),
        stem: q.question, passage: null, options: [...q.options], correct_index: idx, fixed_order: false,
        explanation: q.explanation, hints: q.hints?.length ? [...q.hints] : null, misconception_tag: q.misconceptionTag ?? null,
        language: "en", source_type: "platform_authored" as const, source_detail: null, source_exam: null, source_year: null,
        source_reference: null, source_note: null, answer_check: "unchecked" as const, verified_note: null, needs_review: false,
        extra: {}, exams: [] as QuestionExamSeed[],
      }));
    }
  }

  // CSS MPT ------------------------------------------------------------------
  const mptSource = { "Verified Past Paper": "verified_past_paper", "Existing Question Bank": "existing_bank", "Generated Practice": "generated" } as const;
  for (const q of ctx.mpt.bank) {
    const source = mptSource[q.sourceType];
    const letters = ["A", "B", "C", "D"] as const;
    const pastPaper = source === "verified_past_paper";
    questions.push(withHash({
      source_system: "mpt" as const, legacy_id: q.id, subject_slug: null, exam_subject: q.subject,
      topic: null, concept: null, difficulty: null,
      stem: q.question, passage: q.passage, options: letters.map((l) => q.options[l]), correct_index: letters.indexOf(q.correctAnswer),
      fixed_order: false, explanation: q.explanation, hints: null, misconception_tag: null, language: null,
      source_type: source, source_detail: q.sourceType, source_exam: pastPaper ? "CSS MPT" : null,
      source_year: q.sourceYear, source_reference: null, source_note: q.sourceNote,
      answer_check: pastPaper && q.verified ? ("independently_checked" as const) : ("unchecked" as const),
      verified_note: q.verifiedNote || null, needs_review: false,
      extra: { alsoIn: q.alsoIn, optionsReordered: q.optionsReordered, yieldNote: q.yieldNote ?? null, usedInMocks: q.usedInMocks, mockNumber: q.mockNumber },
      exams: [{ exam_slug: "css-mpt", topic: q.topic, subtopic: null, difficulty: normDifficulty(q.difficulty), section_code: q.subjectCode }],
    }));
  }

  // Teacher tests (PST / JEST / JST): one row per distinct question id; each exam bank's
  // copy contributes its own topic/difficulty as a question_exams entry.
  const teacherSource = {
    verified_past_paper: "verified_past_paper", existing_question: "existing_bank",
    generated_similar: "generated", generated_syllabus: "generated",
  } as const;
  const teacherRows = new Map<string, QuestionSeed>();
  const teacherExams = new Map<string, QuestionExamSeed[]>();
  for (const exam of ["pst", "jest", "jst"] as const) {
    for (const q of ctx.teacher.banks[exam]) {
      (teacherExams.get(q.id) ?? teacherExams.set(q.id, []).get(q.id)!).push({
        exam_slug: exam, topic: q.topic, subtopic: q.subtopic, difficulty: normDifficulty(q.difficulty), section_code: null,
      });
      if (teacherRows.has(q.id)) continue;
      const source = teacherSource[q.sourceType];
      teacherRows.set(q.id, {
        hash: "", source_system: "teacher", legacy_id: q.id, subject_slug: null, exam_subject: q.subject,
        topic: null, concept: null, difficulty: null,
        stem: q.question, passage: q.passage, options: [...q.options], correct_index: q.correctAnswer, fixed_order: q.fixedOrder,
        explanation: q.explanation, hints: null, misconception_tag: null, language: q.language,
        source_type: source, source_detail: q.sourceType, source_exam: null, source_year: q.sourceYear,
        source_reference: q.sourceReference, source_note: null,
        answer_check: source === "verified_past_paper" && q.verified ? "independently_checked" : "unchecked",
        verified_note: q.verificationNote || null, needs_review: q.needsReview,
        extra: { syllabusClass: q.syllabusClass }, exams: [],
      });
    }
  }
  for (const [id, row] of teacherRows) {
    row.exams = teacherExams.get(id) ?? [];
    const { hash: _unused, ...rest } = row;
    void _unused;
    questions.push({ ...rest, hash: hashOf(rest) });
  }

  // --------------------------------------------------------------- exams ----
  const examTypes: ExamTypeSeed[] = [];
  const exams: ExamSeed[] = [];

  const mockSections = ctx.mpt.mocks[0]?.sections ?? [];
  for (const m of ctx.mpt.mocks) {
    if (JSON.stringify(m.sections) !== JSON.stringify(mockSections)) throw new Error(`MPT mock ${m.id} has different sections from the first mock; sections are modelled per exam type.`);
  }
  examTypes.push(withHash({
    slug: "css-mpt", name: "CSS MPT", config: {},
    sections: mockSections.map((s, i) => ({ code: s.code, title: s.subject, subject: s.subject, question_count: s.count, position: i, branches: null })),
  }));
  for (const m of ctx.mpt.mocks) {
    const bySection: { position: number; legacy_id: string; section_code: string }[] = [];
    let offset = 0;
    for (const s of m.sections) {
      m.questionIds.slice(offset, offset + s.count).forEach((id, i) => bySection.push({ position: offset + i, legacy_id: id, section_code: s.code }));
      offset += s.count;
    }
    exams.push(withHash({
      exam_type_slug: "css-mpt", slug: m.id, title: m.title, total_questions: m.totalQuestions, time_minutes: m.timeMinutes,
      pass_marks: m.passMarks, negative_marking: m.negativeMarking, questions: bySection,
    }));
  }
  for (const id of ["pst", "jest", "jst"] as const) {
    const cfg = ctx.teacher.config[id];
    examTypes.push(withHash({
      slug: id, name: cfg.label, config: toSerializable(cfg).value,
      sections: cfg.mock.sections.map((s, i) => ({ code: s.code, title: s.title, subject: s.subject, question_count: s.count, position: i, branches: s.branches ?? null })),
    }));
  }

  const connections: ConnectionSeed[] = ctx.connections.map((c) => withHash({ legacy_id: c.id, data: toSerializable(c).value }));

  return { subjects, topics, simulations, gle, paths, banks, questions, examTypes, exams, connections };
}

export function bundleCounts(b: SeedBundle): Record<string, number> {
  return {
    subjects: b.subjects.length, topics: b.topics.length, simulations: b.simulations.length, gle_topics: b.gle.length,
    learning_paths: b.paths.length, learning_path_nodes: b.paths.reduce((n, p) => n + p.nodes.length, 0),
    question_banks: b.banks.length, questions: b.questions.length,
    question_bank_items: b.banks.reduce((n, x) => n + x.question_ids.length, 0),
    question_exams: b.questions.reduce((n, q) => n + q.exams.length, 0),
    exam_types: b.examTypes.length, exam_sections: b.examTypes.reduce((n, t) => n + t.sections.length, 0),
    exams: b.exams.length, exam_questions: b.exams.reduce((n, e) => n + e.questions.length, 0),
    connections: b.connections.length,
  };
}
