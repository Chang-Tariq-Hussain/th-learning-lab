import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicQuizPage } from "@/components/dashboard/topic-quiz-page";
import { getQuizById } from "@/features/quiz-engine/registry";

export const metadata: Metadata = {
  title: "Measurement Quiz",
  description: "Test your understanding of units, perimeter, and area.",
};

export default function Page() {
  const quiz = getQuizById("mathematics-measurement");
  if (!quiz) notFound();

  return <TopicQuizPage quiz={quiz} backLabel="Back to Measurement" />;
}
