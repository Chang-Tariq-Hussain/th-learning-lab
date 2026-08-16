import { FormulaCard } from "@/features/simulation";

/** Reuses the project's existing FormulaCard (KaTeX) rather than building a new equation renderer. */
export function FormulaSection() {
  return (
    <FormulaCard
      caption="Photosynthesis, simplified"
      formula="\text{CO}_2 + \text{H}_2\text{O} + \text{Light Energy} \;\rightarrow\; \text{Glucose} + \text{O}_2"
    />
  );
}
