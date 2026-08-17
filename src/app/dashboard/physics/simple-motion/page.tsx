import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { QuizCta } from "@/components/dashboard/quiz-cta";
import { getQuizById } from "@/features/quiz-engine/registry";
import { SimpleMotion } from "@/features/subjects/physics/simple-motion";

export const metadata: Metadata = {
  title: "Simple Motion",
  description:
    "Move a car along a track and see how speed, distance, and time connect.",
};

export default function SimpleMotionPage() {
  const quiz = getQuizById("physics-motion");
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/physics/simple-motion" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Physics", href: "/dashboard/physics" },
          { label: "Kinematics", href: "/dashboard/physics/kinematics" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">
          Physics · Kinematics
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Simple Motion
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Set a speed, press start, and watch the car move — then see how
          distance, time, and speed all connect.
        </p>
      </div>

      <SimpleMotion />

      {quiz && (
        <QuizCta href="/dashboard/physics/motion-quiz" colorToken="physics" questionCount={quiz.questions.length} className="mx-auto max-w-2xl" />
      )}
    </Container>
  );
}
