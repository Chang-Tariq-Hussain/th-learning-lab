/** Normalised rows built from the code registries; one per database entity. */
export interface Hashed { hash: string }

export interface SubjectSeed extends Hashed { slug: string; code: string; name: string; tagline: string; description: string; notation: string; sort_order: number }
export interface TopicSeed extends Hashed { subject_slug: string; slug: string; name: string; sort_order: number }
export interface SimulationSeed extends Hashed { subject_slug: string; topic_slug: string; slug: string; content_slug: string; title: string; description: string; href: string; sort_order: number }
export interface GleSeed extends Hashed { href: string; content: unknown; dropped_paths: string[]; schema_version: number }

export interface PathNodeSeed {
  position: number; subject_slug: string; topic_slug: string; href: string; title: string; description: string;
  is_challenge: boolean; prereq_mode: "previous" | "explicit"; prereqs: { subject_slug: string; topic_slug: string }[];
}
export interface PathSeed extends Hashed { slug: string; subject_slug: string; title: string; description: string; color_token: string; nodes: PathNodeSeed[] }

export interface BankSeed extends Hashed {
  slug: string; subject_slug: string; title: string; description: string; subject_label: string; topic_label: string;
  back_href: string; difficulty: string; estimated_time: number; question_ids: string[]; // legacy ids, in order
}

export type QuestionSystem = "quiz" | "mpt" | "teacher";
export interface QuestionExamSeed { exam_slug: string; topic: string | null; subtopic: string | null; difficulty: string | null; section_code: string | null }
export interface QuestionSeed extends Hashed {
  source_system: QuestionSystem; legacy_id: string;
  subject_slug: string | null; exam_subject: string | null;
  topic: string | null; concept: string | null; difficulty: string | null;
  stem: string; passage: string | null; options: string[]; correct_index: number; fixed_order: boolean;
  explanation: string; hints: string[] | null; misconception_tag: string | null; language: string | null;
  source_type: "verified_past_paper" | "existing_bank" | "generated" | "platform_authored";
  source_detail: string | null; source_exam: string | null; source_year: number | null; source_reference: string | null; source_note: string | null;
  answer_check: "unchecked" | "self_checked" | "recomputed" | "independently_checked";
  verified_note: string | null; needs_review: boolean; extra: Record<string, unknown>;
  exams: QuestionExamSeed[];
}

export interface SectionSeed { code: string; title: string; subject: string; question_count: number; position: number; branches: Record<string, number> | null }
export interface ExamTypeSeed extends Hashed { slug: string; name: string; config: unknown; sections: SectionSeed[] }
export interface ExamSeed extends Hashed {
  exam_type_slug: string; slug: string; title: string; total_questions: number; time_minutes: number;
  pass_marks: number | null; negative_marking: boolean;
  questions: { position: number; legacy_id: string; section_code: string }[]; // MPT question legacy ids
}
export interface ConnectionSeed extends Hashed { legacy_id: string; data: unknown }

export interface SeedBundle {
  subjects: SubjectSeed[]; topics: TopicSeed[]; simulations: SimulationSeed[]; gle: GleSeed[];
  paths: PathSeed[]; banks: BankSeed[]; questions: QuestionSeed[];
  examTypes: ExamTypeSeed[]; exams: ExamSeed[]; connections: ConnectionSeed[];
}
