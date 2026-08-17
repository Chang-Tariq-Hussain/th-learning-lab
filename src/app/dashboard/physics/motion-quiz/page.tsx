import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicQuizPage } from "@/components/dashboard/topic-quiz-page";
import { getQuizById } from "@/features/quiz-engine/registry";

export const metadata: Metadata = {
  title: "Motion Basics Quiz",
  description: "Test your understanding of distance, displacement, speed, velocity, and acceleration.",
};

export default function Page() {
  const quiz = getQuizById("physics-motion");
  if (!quiz) notFound();

  return <TopicQuizPage quiz={quiz} backLabel="Back to Motion" />;
}
