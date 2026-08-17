import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicQuizPage } from "@/components/dashboard/topic-quiz-page";
import { getQuizById } from "@/features/quiz-engine/registry";

export const metadata: Metadata = {
  title: "Equation of a Straight Line Quiz",
  description: "Test your understanding of slope and the slope-intercept form of a line.",
};

export default function Page() {
  const quiz = getQuizById("mathematics-straight-line");
  if (!quiz) notFound();

  return <TopicQuizPage quiz={quiz} backLabel="Back to Equation of a Straight Line" />;
}
