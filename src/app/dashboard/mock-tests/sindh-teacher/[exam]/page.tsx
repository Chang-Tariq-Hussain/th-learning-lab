import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { ExamLanding } from "@/features/teacher-tests/components/exam-landing";
import { TEACHER_BASE, getExamConfig } from "@/features/teacher-tests/config";
import { EXAM_TYPES } from "@/features/teacher-tests/types";

interface Props { params: { exam: string } }
export const dynamicParams = false;
export function generateStaticParams() {
  return EXAM_TYPES.map((exam) => ({ exam }));
}
export function generateMetadata({ params }: Props): Metadata {
  const cfg = getExamConfig(params.exam);
  return cfg ? { title: `${cfg.label} Tests`, description: `${cfg.fullName} practice mocks, syllabus and practice modes.` } : {};
}
export default function ExamPage({ params }: Props) {
  const cfg = getExamConfig(params.exam);
  if (!cfg) notFound();
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Mock Tests", href: "/dashboard/mock-tests" }, { label: "Sindh Teacher Tests", href: TEACHER_BASE }, { label: cfg.label }]} className="mb-6" />
      <h1 className="font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">{cfg.label} · {cfg.fullName}</h1>
      <div className="mt-6"><ExamLanding exam={cfg.id} /></div>
    </Container>
  );
}
