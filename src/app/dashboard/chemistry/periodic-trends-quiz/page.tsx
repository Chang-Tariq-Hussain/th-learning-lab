import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicQuizPage } from "@/components/dashboard/topic-quiz-page";
import { getQuizById } from "@/features/quiz-engine/registry";

export const metadata: Metadata = {
  title: "Periodic Trends Quiz",
  description: "Test your understanding of periodic trends and atomic properties.",
};

export default function Page() {
  const quiz = getQuizById("chemistry-periodic-trends");
  if (!quiz) notFound();

  return <TopicQuizPage quiz={quiz} backLabel="Back to Periodic Trends" />;
}
