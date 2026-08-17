import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicQuizPage } from "@/components/dashboard/topic-quiz-page";
import { getQuizById } from "@/features/quiz-engine/registry";

export const metadata: Metadata = {
  title: "Reaction Kinetics Quiz",
  description: "Test your understanding of reaction rate, concentration, temperature, surface area, and catalysts.",
};

export default function Page() {
  const quiz = getQuizById("chemistry-reaction-kinetics");
  if (!quiz) notFound();

  return <TopicQuizPage quiz={quiz} backLabel="Back to Reaction Kinetics" />;
}
