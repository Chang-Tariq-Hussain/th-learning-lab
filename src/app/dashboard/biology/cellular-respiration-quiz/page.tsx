import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicQuizPage } from "@/components/dashboard/topic-quiz-page";
import { getQuizById } from "@/features/quiz-engine/registry";

export const metadata: Metadata = {
  title: "Cellular Respiration Quiz",
  description: "Test your understanding of glucose, oxygen, ATP, and aerobic respiration.",
};

export default function Page() {
  const quiz = getQuizById("biology-cellular-respiration");
  if (!quiz) notFound();

  return <TopicQuizPage quiz={quiz} backLabel="Back to Cellular Respiration" />;
}
