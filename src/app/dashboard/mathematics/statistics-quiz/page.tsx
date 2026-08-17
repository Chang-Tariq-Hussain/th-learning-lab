import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicQuizPage } from "@/components/dashboard/topic-quiz-page";
import { getQuizById } from "@/features/quiz-engine/registry";

export const metadata: Metadata = {
  title: "Statistics Quiz",
  description: "Test your understanding of mean, median, mode, range, and standard deviation.",
};

export default function Page() {
  const quiz = getQuizById("mathematics-statistics");
  if (!quiz) notFound();

  return <TopicQuizPage quiz={quiz} backLabel="Back to Statistics" />;
}
