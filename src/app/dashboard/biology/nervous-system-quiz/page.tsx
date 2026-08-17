import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicQuizPage } from "@/components/dashboard/topic-quiz-page";
import { getQuizById } from "@/features/quiz-engine/registry";

export const metadata: Metadata = {
  title: "Nervous System Quiz",
  description: "Test your understanding of neurons, signal transmission, the CNS, and reflexes.",
};

export default function Page() {
  const quiz = getQuizById("biology-nervous-system");
  if (!quiz) notFound();

  return <TopicQuizPage quiz={quiz} backLabel="Back to Nervous System" />;
}
