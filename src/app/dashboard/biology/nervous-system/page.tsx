import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { QuizCta } from "@/components/dashboard/quiz-cta";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { getQuizById } from "@/features/quiz-engine/registry";
import { NervousSystem } from "@/features/subjects/biology/nervous-system";

export const metadata: Metadata = {
  title: "Nervous System — From Neuron to Signal Transmission",
  description:
    "Explore the parts of a neuron, watch an action potential fire, step through synaptic transmission, and see how the nervous system is organized.",
};

export default function NervousSystemPage() {
  const quiz = getQuizById("biology-nervous-system");
  return (
    <Container className="py-10">
      <SimulationBackLink
        simulationHref="/dashboard/biology/nervous-system"
        className="mb-4"
      />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Biology", href: "/dashboard/biology" },
          {
            label: "Human Physiology",
            href: "/dashboard/biology/human-physiology",
          },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
          Biology · Human Physiology
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Nervous System — From Neuron to Signal Transmission
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Explore the parts of a neuron, fire an action potential, step
          through how a synapse passes a signal to the next neuron, and see
          how the nervous system is organized.
        </p>
      </div>

      <NervousSystem />

      {quiz && (
        <QuizCta href="/dashboard/biology/nervous-system-quiz" colorToken="biology" questionCount={quiz.questions.length} className="mx-auto max-w-2xl" />
      )}

      <SimulationLearnMore
        colorToken="biology"
        objectives={[
          "Identify the main parts of a neuron and their roles.",
          "Explain what an action potential is and why it only travels one direction.",
          "Describe how a signal crosses the gap between two neurons.",
          "Explain the basic organization of the nervous system.",
        ]}
        concepts={[
          {
            term: "Parts of a neuron",
            explanation:
              "Dendrites receive signals from other neurons, the cell body processes them, and the axon carries the signal away toward the next neuron — signals move in one direction, from dendrite to axon.",
          },
          {
            term: "Action potential",
            explanation:
              "A rapid electrical signal that fires along a neuron's axon once it's triggered strongly enough. It travels as an all-or-nothing spike — either it fires at full strength, or it doesn't fire at all.",
          },
          {
            term: "Synapse",
            explanation:
              "The tiny gap between one neuron's axon and the next neuron's dendrite. Since neurons don't physically touch, the signal has to cross this gap using chemical messengers rather than continuing as electricity.",
          },
          {
            term: "Nervous system organization",
            explanation:
              "The central nervous system (brain and spinal cord) processes information, while the peripheral nervous system carries signals between the central nervous system and the rest of the body.",
          },
        ]}
        howToUse={[
          "Explore the labeled parts of the neuron — dendrites, cell body, and axon.",
          "Trigger an action potential and watch the electrical signal travel down the axon.",
          "Step through synaptic transmission and see how the signal crosses to the next neuron.",
          "Explore the nervous system diagram to see how the central and peripheral systems connect.",
        ]}
        whyItMatters="Every thought, movement, and sensation you have depends on neurons firing action potentials and passing signals across synapses, often thousands of times per second. This same basic signaling process is what lets you pull your hand away from something hot in a split second, and it's the target of many medications that treat conditions like depression, epilepsy, and chronic pain by adjusting how synapses work."
        tryThis={[
          "Trace a signal starting at a dendrite all the way to the next neuron's dendrite — list every structure it passes through.",
          "Predict what would happen if a neuron's axon were damaged partway along its length.",
          "Explain in your own words why the synapse needs chemical messengers instead of the signal just jumping the gap electrically.",
        ]}
      />
    </Container>
  );
}
