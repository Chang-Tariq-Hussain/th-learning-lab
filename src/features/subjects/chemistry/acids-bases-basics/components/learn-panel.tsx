import { CLASSIFICATION_COLOR } from "../acids-bases-model";

const CARDS = [
  {
    key: "acidic" as const,
    title: "Acid",
    points: ["pH below 7", "Increases H⁺ concentration in water"],
  },
  {
    key: "neutral" as const,
    title: "Neutral",
    points: ["pH around 7", "Pure water is approximately neutral at 25 °C"],
  },
  {
    key: "basic" as const,
    title: "Base",
    points: ["pH above 7", "Commonly associated with OH⁻ in aqueous solution"],
  },
];

export function LearnPanel() {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">Learn</p>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {CARDS.map((card) => (
          <div key={card.key} className="rounded-card border border-line p-3 dark:border-line-dark">
            <p className="font-display text-sm font-medium" style={{ color: CLASSIFICATION_COLOR[card.key] }}>
              {card.title}
            </p>
            <ul className="mt-2 space-y-1">
              {card.points.map((point) => (
                <li key={point} className="flex gap-2 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
                  <span aria-hidden className="mt-1 h-1 w-1 shrink-0 rounded-full bg-ink/30 dark:bg-bone/30" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink-soft/80 dark:text-bone-soft/80">
        pH is a measure related to hydrogen-ion concentration.
      </p>

      <div className="mt-4 rounded-card border border-dashed border-line p-3 dark:border-line-dark">
        <p className="font-display text-sm font-medium text-ink dark:text-bone">Strong vs. weak (a quick intro)</p>
        <p className="mt-1 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
          &ldquo;Strong&rdquo; and &ldquo;weak&rdquo; describe how completely an acid or base breaks apart into
          ions in water — a strong acid or base ionizes almost entirely, a weak one only partially. It&apos;s a
          different idea from pH: a weak acid can still have a low pH if there&apos;s a lot of it. For a deeper,
          particle-level look, try the{" "}
          <a href="/dashboard/chemistry/strong-weak-acids-bases" className="underline underline-offset-2 hover:text-ink dark:hover:text-bone">
            Strong vs Weak Acids and Bases
          </a>{" "}
          simulation.
        </p>
      </div>
    </div>
  );
}
