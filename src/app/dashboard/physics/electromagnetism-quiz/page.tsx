import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicQuizPage } from "@/components/dashboard/topic-quiz-page";
import { getQuizById } from "@/features/quiz-engine/registry";

export const metadata: Metadata = {
  title: "Electromagnetism Quiz",
  description: "Test your understanding of magnetic poles, fields, current, and electromagnets.",
};

export default function Page() {
  const quiz = getQuizById("physics-electromagnetism");
  if (!quiz) notFound();

  return <TopicQuizPage quiz={quiz} backLabel="Back to Electromagnetism" />;
}
