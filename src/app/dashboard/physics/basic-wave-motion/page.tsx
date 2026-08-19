import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { QuizCta } from "@/components/dashboard/quiz-cta";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { getQuizById } from "@/features/quiz-engine/registry";
import { BasicWaveMotion } from "@/features/subjects/physics/basic-wave-motion";

export const metadata: Metadata = {
  title: "Basic Wave Motion",
  description:
    "Watch a transverse wave travel and discover crest, trough, amplitude, wavelength, and equilibrium by interacting with it.",
};

export default function BasicWaveMotionPage() {
  const quiz = getQuizById("physics-wave-motion");
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/physics/basic-wave-motion" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Physics", href: "/dashboard/physics" },
          { label: "Wave Motion", href: "/dashboard/physics/wave-motion" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">
          Physics · Wave Motion
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Basic Wave Motion
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Watch the wave travel, then explore its crest, trough, amplitude, wavelength, and equilibrium position.
        </p>
      </div>

      <BasicWaveMotion />

      {quiz && (
        <QuizCta href="/dashboard/physics/wave-motion-quiz" colorToken="physics" questionCount={quiz.questions.length} className="mx-auto max-w-2xl" />
      )}

      <SimulationLearnMore
        colorToken="physics"
        objectives={[
          "Label the crest, trough, and equilibrium position on a wave.",
          "Define amplitude and wavelength using the wave's shape.",
          "Explain what it means for a wave to be transverse.",
          "Describe how a wave can carry energy without carrying matter along with it.",
        ]}
        concepts={[
          {
            term: "Crest and trough",
            explanation:
              "The crest is the highest point of the wave; the trough is the lowest point. Every wave alternates between the two as it travels.",
          },
          {
            term: "Equilibrium position",
            explanation:
              "The resting position the medium would sit at if there were no wave at all — the flat middle line the wave moves above and below.",
          },
          {
            term: "Amplitude",
            explanation:
              "The distance from the equilibrium position to the crest (or to the trough). A bigger amplitude means a taller wave, which usually means it's carrying more energy.",
          },
          {
            term: "Wavelength",
            explanation:
              "The distance from one point on the wave to the same point on the next repeat — crest to crest, or trough to trough. It's measured along the direction the wave travels.",
            formula: "\\lambda",
            formulaCaption: "Symbol for wavelength",
          },
        ]}
        howToUse={[
          "Press play and watch the wave move across the screen.",
          "Pause it and try to point out the crest, the trough, and the equilibrium line.",
          "Measure the amplitude by comparing the crest's height to the equilibrium line.",
          "Measure the wavelength by finding the distance between two neighboring crests.",
        ]}
        whyItMatters="Every wave you can name — sound, light, ripples on a pond, the vibration in a guitar string — can be described using this same set of terms: amplitude, wavelength, crest, and trough. Once you can read these features off a wave, you're ready to understand how loud a sound is, how bright a light is, or how much energy an earthquake carries, since all of those come down to a wave's amplitude and wavelength."
        tryThis={[
          "Increase the amplitude and watch how the wave's height changes without changing its wavelength.",
          "Try to spot two full wavelengths on the screen at once — how many crests do you count?",
          "Predict what a wave with twice the amplitude would look like before adjusting the setting.",
        ]}
      />
    </Container>
  );
}
