import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicQuizPage } from "@/components/dashboard/topic-quiz-page";
import { getQuizById } from "@/features/quiz-engine/registry";

export const metadata: Metadata = {
  title: "Wave Motion Quiz",
  description: "Test your understanding of wavelength, amplitude, frequency, period, and wave speed.",
};

export default function Page() {
  const quiz = getQuizById("physics-wave-motion");
  if (!quiz) notFound();

  return <TopicQuizPage quiz={quiz} backLabel="Back to Wave Motion" />;
}
