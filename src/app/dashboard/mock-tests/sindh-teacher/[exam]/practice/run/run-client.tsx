"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TeacherPracticeTest } from "@/features/teacher-tests/components/runners";
import type { ExamType } from "@/features/teacher-tests/types";

function Inner({ exam }: { exam: ExamType }) {
  const id = useSearchParams().get("t") ?? "";
  return <TeacherPracticeTest exam={exam} testId={id} />;
}

export function PracticeRunClient({ exam }: { exam: ExamType }) {
  return (
    <Suspense fallback={<p className="py-10 text-center text-sm">Loading…</p>}>
      <Inner exam={exam} />
    </Suspense>
  );
}
