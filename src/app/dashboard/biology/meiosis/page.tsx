import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { QuizCta } from "@/components/dashboard/quiz-cta";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { getQuizById } from "@/features/quiz-engine/registry";
import { Meiosis } from "@/features/subjects/biology/meiosis";

export const metadata: Metadata = {
  title: "Meiosis",
  description: "Watch one diploid cell divide through meiosis into four haploid cells used in sexual reproduction.",
};

export default function MeiosisPage() {
  const quiz = getQuizById("biology-meiosis");
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/biology/meiosis" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Biology", href: "/dashboard/biology" },
          { label: "Genetics", href: "/dashboard/biology/genetics" },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">Biology · Genetics</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Meiosis: How Sex Cells Are Formed
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Press Start and watch a diploid cell move through meiosis, or step through each stage one at a time.
        </p>
      </div>

      <Meiosis />

      {quiz && (
        <QuizCta href="/dashboard/biology/meiosis-quiz" colorToken="biology" questionCount={quiz.questions.length} className="mx-auto max-w-2xl" />
      )}

      <SimulationLearnMore
        colorToken="biology"
        objectives={[
          "Explain how meiosis differs from mitosis in its outcome.",
          "Define diploid and haploid, and how meiosis converts one into the other.",
          "Describe why meiosis involves two rounds of division instead of one.",
          "Explain why meiosis is essential for sexual reproduction.",
        ]}
        concepts={[
          {
            term: "Diploid vs. haploid",
            explanation:
              "A diploid cell has two full sets of chromosomes, one from each parent. A haploid cell has just one set — half the usual amount. Meiosis takes a diploid starting cell and produces haploid cells.",
          },
          {
            term: "Two rounds of division",
            explanation:
              "Meiosis I separates the two matched sets of chromosomes from each other, and meiosis II separates each chromosome's two halves — similar to a mitosis-style split. Together, one diploid cell going through both rounds ends up as four haploid cells.",
          },
          {
            term: "Genetic variation",
            explanation:
              "During meiosis, chromosomes swap segments with their matching partner and get shuffled into different combinations before splitting apart. That's part of why siblings share a family resemblance but aren't identical to each other.",
          },
          {
            term: "The result",
            explanation:
              "Meiosis produces four haploid cells, each genetically different from the others and from the original parent cell — these become the sex cells (sperm or egg) used in sexual reproduction.",
          },
        ]}
        howToUse={[
          "Press Start to watch a diploid cell move through all of meiosis automatically.",
          "Or use the step controls to move through meiosis I and meiosis II one stage at a time.",
          "Notice that the first division separates matched chromosome pairs, while the second division separates each chromosome's two halves.",
          "Count the final cells produced and compare their chromosome number to the starting cell.",
        ]}
        whyItMatters="Meiosis is the reason offspring aren't exact copies of their parents. By cutting the chromosome number in half and shuffling genetic material along the way, meiosis makes sure that when a sperm and egg combine during fertilization, the resulting cell has the normal diploid number again — while still being genetically unique from either parent."
        tryThis={[
          "Compare the number of cells and the number of chromosomes per cell at the start versus the end of meiosis.",
          "Predict what would happen to offspring if meiosis produced diploid cells instead of haploid ones.",
          "Think about why the four cells produced by meiosis aren't identical to each other, unlike the cells produced by mitosis.",
        ]}
      />
    </Container>
  );
}
