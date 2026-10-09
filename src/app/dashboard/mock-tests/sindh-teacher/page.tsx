import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { BANK_STATS } from "@/features/teacher-tests/data/bank-stats";
import { TEACHER_BASE, teacherExamConfig } from "@/features/teacher-tests/config";
import { EXAM_TYPES } from "@/features/teacher-tests/types";

export const metadata: Metadata = {
  title: "Sindh Teacher Tests",
  description: "Practice mocks and topic practice for PST, JEST and JST (Junior Science Teacher) recruitment tests.",
};

export default function SindhTeacherHub() {
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Mock Tests", href: "/dashboard/mock-tests" }, { label: "Sindh Teacher Tests" }]} className="mb-6" />
      <h1 className="font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">Sindh Teacher Tests</h1>
      <p className="mt-2 mb-8 max-w-2xl text-base text-ink-soft dark:text-bone-soft">
        Choose your exam. All questions are original practice material written for this site; none are labelled as past papers.
      </p>
      <ul className="grid gap-5 md:grid-cols-3">
        {EXAM_TYPES.map((e) => {
          const cfg = teacherExamConfig[e];
          const st = BANK_STATS[e];
          return (
            <li key={e} className="rounded-lg border border-ink/10 p-5 dark:border-bone/15">
              <p className="text-xs uppercase tracking-wide text-ink/60 dark:text-bone/60">{cfg.level}</p>
              <h2 className="font-display text-2xl text-ink dark:text-bone">{cfg.label}</h2>
              <p className="text-sm text-ink-soft dark:text-bone-soft">{cfg.fullName}</p>
              <ul className="mt-3 space-y-1 text-sm text-ink/80 dark:text-bone/80">
                <li>{st.total} questions in the bank</li>
                <li>{cfg.mock.mockCount} mocks · {cfg.mock.questions} questions · {cfg.mock.durationMinutes} min</li>
                <li>Subject, topic, difficulty and mixed practice</li>
              </ul>
              <Link className="mt-4 inline-block text-sm font-medium underline" href={`${TEACHER_BASE}/${e}`}>Open {cfg.label}</Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-8 text-sm"><Link className="underline" href={`${TEACHER_BASE}/audit`}>Question bank audit (developer)</Link></p>
    </Container>
  );
}
