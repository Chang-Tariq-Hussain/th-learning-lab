import { BASE_COLORS } from "../model";

/** The spec's short, no-paragraphs info panel — a few facts plus the two pairing rules, always visible. */
export function InfoPanel() {
  return (
    <div className="flex flex-col gap-4 rounded-[1.75rem] border border-line bg-white/70 p-6 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">DNA</p>
        <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          <li>DNA stores genetic information.</li>
          <li>DNA has two strands.</li>
          <li>The bases pair in specific ways.</li>
        </ul>
      </div>

      <div className="flex flex-col gap-2 border-t border-line pt-4 dark:border-line-dark">
        <PairRow a="A" b="T" />
        <PairRow a="C" b="G" />
      </div>
    </div>
  );
}

function PairRow({ a, b }: { a: "A" | "C"; b: "T" | "G" }) {
  return (
    <div className="flex items-center justify-center gap-2 text-sm font-semibold">
      <span
        className="flex h-7 w-7 items-center justify-center rounded-full text-white"
        style={{ backgroundColor: BASE_COLORS[a] }}
      >
        {a}
      </span>
      <span className="text-ink-soft dark:text-bone-soft">&harr;</span>
      <span
        className="flex h-7 w-7 items-center justify-center rounded-full text-white"
        style={{ backgroundColor: BASE_COLORS[b] }}
      >
        {b}
      </span>
    </div>
  );
}
