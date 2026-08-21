import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { QuizCta } from "@/components/dashboard/quiz-cta";
import { getQuizById } from "@/features/quiz-engine/registry";
import { NewtonsLaws } from "@/features/subjects/physics/newtons-laws";
import { TopicLearningExperience, getTopicContent } from "@/features/learning";

export const metadata: Metadata = {
  title: "Newton's Laws of Motion",
  description:
    "An interactive laboratory for Newton's Three Laws of Motion — inertia, F = ma, and action-reaction, explored through experimentation rather than memorization.",
};

export default function NewtonsLawsPage() {
  const quiz = getQuizById("physics-newtonian-mechanics");
  const content = getTopicContent("physics", "newtons-laws");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/physics/newtons-laws" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Physics", href: "/dashboard/physics" },
          { label: "Newtonian Mechanics", href: "/dashboard/physics/newtonian-mechanics" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">
          Physics · Newtonian Mechanics
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Newton&apos;s Laws of Motion
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Inertia, F = ma, and action-reaction — pushed, pulled, and collided
          with in real time. Three laws, one shared physics engine, built to be
          experimented with rather than memorized.
        </p>
      </div>

      {content ? (
        <TopicLearningExperience content={content} simulation={<NewtonsLaws />} />
      ) : (
        <NewtonsLaws />
      )}

      {quiz && (
        <QuizCta
          href="/dashboard/physics/newtonian-mechanics-quiz"
          colorToken="physics"
          questionCount={quiz.questions.length}
          className="mx-auto mt-10 max-w-2xl"
        />
      )}
    </Container>
  );
}
