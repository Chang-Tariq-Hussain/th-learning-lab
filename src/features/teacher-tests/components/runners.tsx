"use client";

import { useEffect, useMemo, useState } from "react";
import { MockRunner } from "@/features/mpt-mock";
import type { StartCopy } from "@/features/mpt-mock/components/start-screen";
import type { RunnerQuestion } from "@/features/mpt-mock/engine-types";
import { rebuildTest } from "../attempts";
import { teacherExamConfig, TEACHER_BASE } from "../config";
import type { TeacherTest } from "../tests";
import { SOURCE_LABELS } from "../tests";
import type { ExamType } from "../types";
import { AnalysisPanel } from "./analysis-panel";

type Built = { test: TeacherTest; questions: RunnerQuestion[] };

function Message({ children }: { children: React.ReactNode }) {
  return <p className="py-20 text-center text-sm text-ink-soft dark:text-bone-soft">{children}</p>;
}

function copyFor(exam: ExamType, test: TeacherTest, questions: RunnerQuestion[]): StartCopy {
  const cfg = teacherExamConfig[exam];
  const counts = new Map<string, number>();
  for (const q of questions) counts.set(q.sourceType, (counts.get(q.sourceType) ?? 0) + 1);
  const order = Object.values(SOURCE_LABELS);
  const parts = order.filter((l) => (counts.get(l) ?? 0) > 0).map((l) => `${counts.get(l)} ${l}`);
  const practice = test.mode === "practice";
  return {
    eyebrow: `Sindh Teacher Test · ${cfg.label}${practice ? " · Practice" : ""}`,
    intro: practice
      ? `A practice set of ${test.totalQuestions} questions with one minute per question. The timer keeps running if you leave the page, and the set is submitted automatically at 00:00:00.`
      : `${cfg.fullName}: ${cfg.mock.questions} questions in ${cfg.mock.durationMinutes} minutes, in the order mother tongue, social studies, Islamiat, English, mathematics, science and computer. ${cfg.pattern.status === "verified" ? "" : "The pattern is not officially confirmed; see the note on the exam page."}`,
    passText: "No official pass mark set",
    sourceSummary: `Question sources in this ${practice ? "set" : "mock"}: ${parts.join(", ") || "none"}. Each question's source is shown again in review. Generated questions are never presented as past papers.`,
    startLabel: practice ? "Start practice" : "Start mock test",
    notes: ["Option order is shuffled for this paper and stays the same when you come back to it."],
  };
}

function Runner({ exam, built, backHref, backLabel }: { exam: ExamType; built: Built; backHref: string; backLabel: string }) {
  const startCopy = useMemo(() => copyFor(exam, built.test, built.questions), [exam, built]);
  return (
    <MockRunner
      key={built.test.id}
      test={built.test}
      questions={built.questions}
      backHref={backHref}
      backLabel={backLabel}
      startCopy={startCopy}
      renderExtra={(result, qs) => <AnalysisPanel result={result} questions={qs} />}
    />
  );
}

export function TeacherMockTest({ exam, index }: { exam: ExamType; index: number }) {
  const [built, setBuilt] = useState<Built | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let live = true;
    rebuildTest(exam, `${exam}-mock${index}`)
      .then((b) => {
        if (!live) return;
        if (b) setBuilt({ test: b.test, questions: b.questions });
        else setError(true);
      })
      .catch(() => live && setError(true));
    return () => {
      live = false;
    };
  }, [exam, index]);
  if (error) return <Message>This mock could not be built.</Message>;
  if (!built) return <Message>Preparing your mock…</Message>;
  return <Runner exam={exam} built={built} backHref={`${TEACHER_BASE}/${exam}`} backLabel={`All ${teacherExamConfig[exam].label} tests`} />;
}

export function TeacherPracticeTest({ exam, testId }: { exam: ExamType; testId: string }) {
  const [built, setBuilt] = useState<Built | null>(null);
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    let live = true;
    if (!new RegExp(`^${exam}-p-[a-z0-9]+$`).test(testId)) {
      setMissing(true);
      return;
    }
    rebuildTest(exam, testId)
      .then((b) => {
        if (!live) return;
        if (b) setBuilt({ test: b.test, questions: b.questions });
        else setMissing(true);
      })
      .catch(() => live && setMissing(true));
    return () => {
      live = false;
    };
  }, [exam, testId]);
  if (missing) return <Message>This practice set was not found on this device. Start a new one from the practice page.</Message>;
  if (!built) return <Message>Preparing your practice set…</Message>;
  return <Runner exam={exam} built={built} backHref={`${TEACHER_BASE}/${exam}/practice`} backLabel="Back to practice" />;
}
