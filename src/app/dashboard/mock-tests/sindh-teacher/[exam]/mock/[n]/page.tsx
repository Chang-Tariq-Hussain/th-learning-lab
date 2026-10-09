import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { TeacherMockTest } from "@/features/teacher-tests/components/runners";
import { TEACHER_BASE, getExamConfig, teacherExamConfig } from "@/features/teacher-tests/config";
import { EXAM_TYPES } from "@/features/teacher-tests/types";

interface Props { params: { exam: string; n: string } }
export const dynamicParams = false;
export function generateStaticParams() {
  return EXAM_TYPES.flatMap((exam) => Array.from({ length: teacherExamConfig[exam].mock.mockCount }, (_, i) => ({ exam, n: String(i + 1) })));
}
export function generateMetadata({ params }: Props): Metadata {
  const cfg = getExamConfig(params.exam);
  return cfg ? { title: `${cfg.label} Mock ${params.n}` } : {};
}
export default function MockPage({ params }: Props) {
  const cfg = getExamConfig(params.exam);
  const n = /^[1-9]\d*$/.test(params.n) ? Number(params.n) : 0;
  if (!cfg || n < 1 || n > cfg.mock.mockCount) notFound();
  return (
    <Container className="py-8">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Mock Tests", href: "/dashboard/mock-tests" }, { label: "Sindh Teacher Tests", href: TEACHER_BASE }, { label: cfg.label, href: `${TEACHER_BASE}/${cfg.id}` }, { label: `Mock ${n}` }]} className="mb-4" />
      <TeacherMockTest exam={cfg.id} index={n} />
    </Container>
  );
}
