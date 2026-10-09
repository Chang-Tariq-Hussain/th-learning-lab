import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { PracticeBuilder } from "@/features/teacher-tests/components/practice-builder";
import { TEACHER_BASE, getExamConfig } from "@/features/teacher-tests/config";
import { EXAM_TYPES } from "@/features/teacher-tests/types";

interface Props { params: { exam: string } }
export const dynamicParams = false;
export function generateStaticParams() {
  return EXAM_TYPES.map((exam) => ({ exam }));
}
export function generateMetadata({ params }: Props): Metadata {
  const cfg = getExamConfig(params.exam);
  return cfg ? { title: `${cfg.label} Practice` } : {};
}
export default function PracticePage({ params }: Props) {
  const cfg = getExamConfig(params.exam);
  if (!cfg) notFound();
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Mock Tests", href: "/dashboard/mock-tests" }, { label: "Sindh Teacher Tests", href: TEACHER_BASE }, { label: cfg.label, href: `${TEACHER_BASE}/${cfg.id}` }, { label: "Practice" }]} className="mb-6" />
      <h1 className="mb-6 font-display text-3xl font-medium text-ink dark:text-bone">{cfg.label} practice</h1>
      <PracticeBuilder exam={cfg.id} />
    </Container>
  );
}
