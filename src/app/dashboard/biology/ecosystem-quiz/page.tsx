import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicQuizPage } from "@/components/dashboard/topic-quiz-page";
import { getQuizById } from "@/features/quiz-engine/registry";

export const metadata: Metadata = {
  title: "Ecosystem Quiz",
  description: "Test your understanding of producers, consumers, decomposers, and energy flow.",
};

export default function Page() {
  const quiz = getQuizById("biology-ecosystem");
  if (!quiz) notFound();

  return <TopicQuizPage quiz={quiz} backLabel="Back to Ecosystem Explorer" />;
}
