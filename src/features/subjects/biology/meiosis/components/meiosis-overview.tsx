import { cn } from "@/lib/utils";
import type { StageInfo } from "../model";

export interface MeiosisOverviewProps {
  stage: StageInfo;
}

/** The spec's "MEIOSIS I → MEIOSIS II → 4 HAPLOID CELLS" strip, plus the 2n → n chromosome-number reminder. Always visible, current phase highlighted. */
export function MeiosisOverview({ stage }: MeiosisOverviewProps) {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-3 rounded-[1.75rem] border border-line bg-white/70 px-5 py-4 text-center shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
      <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink-soft/60 dark:text-bone-soft/50">
        Simplified model — chromosomes are shown in small numbers for easier understanding.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-semibold">
        <PhasePill label="Meiosis I" active={stage.phase === "I"} />
        <Arrow />
        <PhasePill label="Meiosis II" active={stage.phase === "II"} />
        <Arrow />
        <PhasePill label="4 Haploid Cells" active={false} />
      </div>

      <div className="flex items-center gap-3 text-xs text-ink-soft dark:text-bone-soft">
        <span>
          Starting cell: <strong className="text-ink dark:text-bone">2n</strong>
        </span>
        <span className="text-ink-soft/40">→</span>
        <span>
          Final cells: <strong className="text-ink dark:text-bone">n</strong>
        </span>
        <span className="hidden text-ink-soft/70 sm:inline">— meiosis reduces the chromosome number by half.</span>
      </div>
    </div>
  );
}

function PhasePill({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 transition-colors",
        active ? "bg-subject-biology text-white" : "bg-ink/[0.06] text-ink-soft/70 dark:bg-bone/[0.08] dark:text-bone-soft/60",
      )}
    >
      {label}
    </span>
  );
}

function Arrow() {
  return <span className="text-ink-soft/40 dark:text-bone-soft/30">&rarr;</span>;
}
