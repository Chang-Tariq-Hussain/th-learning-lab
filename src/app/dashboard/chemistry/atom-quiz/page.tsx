import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicQuizPage } from "@/components/dashboard/topic-quiz-page";
import { getQuizById } from "@/features/quiz-engine/registry";

export const metadata: Metadata = {
  title: "Atom Quiz",
  description: "Test your understanding of protons, neutrons, electrons, atomic number, and isotopes.",
};

export default function Page() {
  const quiz = getQuizById("chemistry-atom");
  if (!quiz) notFound();

  return <TopicQuizPage quiz={quiz} backLabel="Back to Atomic Structure" />;
}
