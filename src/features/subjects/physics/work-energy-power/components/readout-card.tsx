"use client";

export interface ReadoutCardProps {
  label: string;
  value: string;
  unit: string;
  /** Small substitution line, e.g. "20 N × 5 m × cos(0°)". */
  substitution?: string;
  /** Optional accent, used by the Work panel to color positive/negative/zero. */
  tone?: "default" | "positive" | "negative";
}

const toneClasses: Record<NonNullable<ReadoutCardProps["tone"]>, string> = {
  default: "text-subject-physics",
  positive: "text-[#2E8B57]",
  negative: "text-[#E0524F]",
};

/** One big-number readout card — the same "label above, big number
 *  below, small print underneath" shape used throughout this lab's
 *  panels so Work/Energy/Power readouts feel like one family. */
export function ReadoutCard({ label, value, unit, substitution, tone = "default" }: ReadoutCardProps) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-line bg-white/70 px-5 py-4 text-center shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft dark:text-bone-soft">{label}</p>
      <p className={`font-display text-3xl font-semibold tabular-nums ${toneClasses[tone]}`}>
        {value} <span className="text-lg font-normal text-ink-soft dark:text-bone-soft">{unit}</span>
      </p>
      {substitution ? (
        <p className="font-mono text-[11px] text-ink-soft dark:text-bone-soft">{substitution}</p>
      ) : null}
    </div>
  );
}
