import { FormulaCard } from "@/features/simulation";

/** Reuses the project's existing FormulaCard (KaTeX) rather than building a new equation renderer. */
export function FormulaSection() {
  return (
    <FormulaCard
      caption="Cellular respiration, simplified"
      formula="\text{Glucose} + \text{O}_2 \;\rightarrow\; \text{Energy} + \text{CO}_2 + \text{H}_2\text{O}"
    />
  );
}
