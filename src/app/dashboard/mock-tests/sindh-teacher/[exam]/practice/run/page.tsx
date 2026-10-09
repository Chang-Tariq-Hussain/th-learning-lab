import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { getExamConfig } from "@/features/teacher-tests/config";
import { EXAM_TYPES } from "@/features/teacher-tests/types";
import { PracticeRunClient } from "./run-client";

interface Props { params: { exam: string } }
export const dynamicParams = false;
export const metadata = { title: "Practice session" };
export function generateStaticParams() {
  return EXAM_TYPES.map((exam) => ({ exam }));
}
export default function RunPage({ params }: Props) {
  const cfg = getExamConfig(params.exam);
  if (!cfg) notFound();
  return (
    <Container className="py-8">
      <PracticeRunClient exam={cfg.id} />
    </Container>
  );
}
