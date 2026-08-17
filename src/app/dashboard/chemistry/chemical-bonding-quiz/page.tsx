import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicQuizPage } from "@/components/dashboard/topic-quiz-page";
import { getQuizById } from "@/features/quiz-engine/registry";

export const metadata: Metadata = {
  title: "Chemical Bonding Quiz",
  description: "Test your understanding of ionic and covalent bonding.",
};

export default function Page() {
  const quiz = getQuizById("chemistry-chemical-bonding");
  if (!quiz) notFound();

  return <TopicQuizPage quiz={quiz} backLabel="Back to Chemical Bonding" />;
}
