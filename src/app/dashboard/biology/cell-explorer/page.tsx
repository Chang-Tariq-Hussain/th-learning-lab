import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { QuizCta } from "@/components/dashboard/quiz-cta";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { getQuizById } from "@/features/quiz-engine/registry";
import { CellExplorer } from "@/features/subjects/biology/cell-explorer";

export const metadata: Metadata = {
  title: "Interactive Cell Explorer",
  description: "Click around an animal or plant cell to learn what each organelle does, one part at a time.",
};

export default function CellExplorerPage() {
  const quiz = getQuizById("biology-cell-explorer");
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/biology/cell-explorer" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Biology", href: "/dashboard/biology" },
          { label: "Cell Structure", href: "/dashboard/biology/cell-structure" },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
          Biology · Cell Structure
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Interactive Cell Explorer
        </h1>
      </div>

      <CellExplorer />

      {quiz && (
        <QuizCta href="/dashboard/biology/cell-explorer-quiz" colorToken="biology" questionCount={quiz.questions.length} className="mx-auto max-w-2xl" />
      )}

      <SimulationLearnMore
        colorToken="biology"
        objectives={[
          "Name the major organelles found in animal and plant cells.",
          "Describe the main function of each organelle.",
          "Identify the structures that appear in plant cells but not animal cells, and explain why.",
          "Explain how a cell's organelles work together to keep it alive.",
        ]}
        concepts={[
          {
            term: "Nucleus",
            explanation: "Stores the cell's DNA and directs all of its activities — often called the cell's control center.",
          },
          {
            term: "Mitochondria",
            explanation: "Produces energy for the cell, which is why it's nicknamed the \"powerhouse of the cell.\"",
          },
          {
            term: "Endoplasmic reticulum & Golgi apparatus",
            explanation:
              "The rough ER (studded with ribosomes) builds proteins; the smooth ER handles other jobs like making lipids. The Golgi apparatus then packages and ships those proteins wherever they're needed.",
          },
          {
            term: "Cell membrane & cytoplasm",
            explanation:
              "The cell membrane controls what enters and leaves the cell. The cytoplasm is the gel-like fluid filling the cell, where most organelles sit.",
          },
          {
            term: "Plant-only structures",
            explanation:
              "Plant cells add a rigid cell wall (structural support), a large central vacuole (storage and water pressure), chloroplasts (photosynthesis), and plasmodesmata (channels connecting neighboring cells) — features animal cells don't need.",
          },
        ]}
        howToUse={[
          "Switch between the Animal Cell and Plant Cell views.",
          "Click any organelle to open its info panel.",
          "Read the description and the memorable fact for each one.",
          "Compare the two cell types to see which structures are shared and which are unique to plants.",
        ]}
        whyItMatters="Every living thing you can see is made of cells like these — and the organelles inside them explain real biology you've probably already heard of. Mitochondrial problems are linked to fatigue and certain diseases. Chloroplasts are the reason plants (and the oxygen we breathe) exist at all. Understanding what's inside a single cell is the starting point for understanding everything from how your body heals a cut to how antibiotics target bacteria without harming your own cells."
        tryThis={[
          "Find three organelles that appear in both the animal and plant cell views.",
          "Find one organelle only in the plant cell and explain why an animal cell doesn't need it.",
          "Pick any organelle and explain, in one sentence, what would go wrong for the cell if it stopped working.",
        ]}
      />
    </Container>
  );
}
