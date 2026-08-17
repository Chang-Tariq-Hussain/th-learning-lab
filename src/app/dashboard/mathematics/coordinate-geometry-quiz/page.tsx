import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicQuizPage } from "@/components/dashboard/topic-quiz-page";
import { getQuizById } from "@/features/quiz-engine/registry";

export const metadata: Metadata = {
  title: "Coordinate Geometry Quiz",
  description: "Test your understanding of the coordinate plane, quadrants, distance, and midpoint.",
};

export default function Page() {
  const quiz = getQuizById("mathematics-coordinate-geometry");
  if (!quiz) notFound();

  return <TopicQuizPage quiz={quiz} backLabel="Back to Coordinate Geometry" />;
}
