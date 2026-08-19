import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { BloodCirculation } from "@/features/subjects/biology/blood-circulation";

export const metadata: Metadata = {
  title: "Blood Circulation",
  description:
    "Watch blood flow between the body, heart, and lungs, and explore pulmonary and systemic circulation, the four heart chambers, and how blood picks up oxygen.",
};

export default function BloodCirculationPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/biology/blood-circulation" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Biology", href: "/dashboard/biology" },
          { label: "Human Physiology", href: "/dashboard/biology/human-physiology" },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
          Biology · Human Physiology
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Blood Circulation
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Watch blood travel from the body to the heart, out to the lungs, and back again — press Trace Blood for a
          guided walk through one full circulation.
        </p>
      </div>

      <BloodCirculation />

      <SimulationLearnMore
        colorToken="biology"
        objectives={[
          "Distinguish pulmonary circulation from systemic circulation.",
          "Name the four chambers of the heart in the order blood passes through them.",
          "Explain where blood picks up oxygen and where it delivers it.",
          "Trace one full loop of blood through the body, heart, and lungs.",
        ]}
        concepts={[
          {
            term: "Pulmonary circulation",
            explanation:
              "The short loop between the heart and the lungs. Blood low in oxygen is pumped to the lungs, picks up fresh oxygen, and returns to the heart ready to be sent out to the body.",
          },
          {
            term: "Systemic circulation",
            explanation:
              "The long loop between the heart and the rest of the body. Oxygen-rich blood is pumped out to every organ and tissue, drops off oxygen, and returns to the heart low in oxygen.",
          },
          {
            term: "The four chambers",
            explanation:
              "Blood enters the right atrium, moves to the right ventricle, gets pumped to the lungs, returns to the left atrium, moves to the left ventricle, and finally gets pumped out to the body — two atria for receiving blood, two ventricles for pushing it back out.",
          },
          {
            term: "Gas exchange",
            explanation:
              "In the lungs, blood releases carbon dioxide and picks up oxygen. In the body's tissues, that same blood releases oxygen and picks up carbon dioxide instead — the two exchanges mirror each other in opposite locations.",
          },
        ]}
        howToUse={[
          "Press Trace Blood to follow one continuous path through the body, heart, and lungs.",
          "Watch which side of the heart handles blood heading to the lungs versus blood heading to the body.",
          "Notice the color change as blood picks up oxygen in the lungs and drops it off in the body.",
          "Pause at each heart chamber and identify whether it's an atrium or a ventricle.",
        ]}
        whyItMatters="This dual-loop system is what lets your body deliver fresh oxygen to every cell while constantly clearing out carbon dioxide, all in a single heartbeat cycle. Understanding pulmonary versus systemic circulation is also the foundation for making sense of heart conditions, blood pressure readings, and why a resting heart rate matters as a basic health indicator."
        tryThis={[
          "Trace one drop of blood starting in the right atrium — list every stop it makes before it gets back to the right atrium again.",
          "Predict which side of the heart has to pump harder: the side sending blood to the lungs, or the side sending blood to the whole body.",
          "Explain in your own words why blood needs to visit the lungs before it can be useful to the rest of the body.",
        ]}
      />
    </Container>
  );
}
