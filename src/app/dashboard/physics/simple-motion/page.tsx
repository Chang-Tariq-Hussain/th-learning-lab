import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { QuizCta } from "@/components/dashboard/quiz-cta";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
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

      <SimulationLearnMore
        colorToken="physics"
        objectives={[
          "State the relationship between speed, distance, and time.",
          "Rearrange the speed formula to solve for distance or time instead.",
          "Predict how changing speed affects how long a fixed-distance trip takes.",
          "Read and interpret the units meters per second (m/s).",
        ]}
        concepts={[
          {
            term: "Speed",
            explanation: "How fast an object covers distance — the distance traveled divided by the time it took.",
            formula: "v = \\dfrac{d}{t}",
            formulaCaption: "v = speed, d = distance, t = time",
          },
          {
            term: "Distance",
            explanation: "Rearranging the speed formula lets you find distance if you know speed and time instead.",
            formula: "d = v \\times t",
          },
          {
            term: "Time",
            explanation: "Or find time, if you know the distance and the speed.",
            formula: "t = \\dfrac{d}{v}",
          },
          {
            term: "Constant speed",
            explanation:
              "This simulation keeps speed steady throughout the trip — no speeding up or slowing down — which is what makes a single formula enough to describe the whole motion.",
          },
        ]}
        howToUse={[
          "Choose which quantity is unknown: Speed, Distance, or Time.",
          "Adjust the sliders for the two known quantities.",
          "Watch the unknown value update live, solved from the other two.",
          "Press start and watch the car move — the trip should take exactly the time shown.",
        ]}
        whyItMatters="This one relationship — speed equals distance over time — is behind everything from estimating your commute to calculating how long a road trip will take to figuring out a rocket's velocity. It's also the foundation every more advanced motion topic builds on: once an object's speed can change over time, that rate of change is acceleration, which is where kinematics goes next."
        tryThis={[
          "Set Time as the unknown, then double the speed while keeping distance fixed. What happens to the time — does it also double?",
          "Set Distance as the unknown. If you double both speed and time, what happens to the distance?",
          "Predict the trip time before pressing start, then check your prediction against what actually happens.",
        ]}
      />
    </Container>
  );
}
