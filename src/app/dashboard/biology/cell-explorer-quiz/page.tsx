import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicQuizPage } from "@/components/dashboard/topic-quiz-page";
import { getQuizById } from "@/features/quiz-engine/registry";

export const metadata: Metadata = {
  title: "Cell Explorer Quiz",
  description: "Test your understanding of organelles and plant vs animal cells.",
};

export default function Page() {
  const quiz = getQuizById("biology-cell-explorer");
  if (!quiz) notFound();

  return <TopicQuizPage quiz={quiz} backLabel="Back to Cell Explorer" />;
}
