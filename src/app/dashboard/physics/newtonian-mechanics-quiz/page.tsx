import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicQuizPage } from "@/components/dashboard/topic-quiz-page";
import { getQuizById } from "@/features/quiz-engine/registry";

export const metadata: Metadata = {
  title: "Newtonian Mechanics Quiz",
  description:
    "Test your understanding of Newton's three laws, net force, balanced and unbalanced forces, and potential and kinetic energy.",
};

export default function Page() {
  const quiz = getQuizById("physics-newtonian-mechanics");
  if (!quiz) notFound();

  return <TopicQuizPage quiz={quiz} backLabel="Back to Newton's Laws" />;
}
