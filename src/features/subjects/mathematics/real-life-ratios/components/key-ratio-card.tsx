import { IconChip } from "./icon-chip";
import type { ScenarioDef } from "../scenarios";

export interface KeyRatioCardProps {
  scenario: ScenarioDef;
  ratioA: number;
  ratioB: number;
}

/** Small non-interactive reference showing "for every A, use B" as a single illustrated group. */
export function KeyRatioCard({ scenario, ratioA, ratioB }: KeyRatioCardProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-ink/15 bg-ink/[0.02] px-4 py-3 dark:border-bone/20 dark:bg-bone/[0.03]">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/70 dark:text-bone-soft/70">
        Every {scenario.groupNoun} keeps this ratio
      </p>
      <div className="flex items-center gap-3">
        <ChipRow hex={scenario.unitA.hex} icon={scenario.unitA.icon} count={ratioA} />
        <span className="font-display text-lg font-medium text-ink-soft/60 dark:text-bone-soft/60">:</span>
        <ChipRow hex={scenario.unitB.hex} icon={scenario.unitB.icon} count={ratioB} />
      </div>
    </div>
  );
}

function ChipRow({ hex, icon: Icon, count }: { hex: string; icon?: ScenarioDef["unitA"]["icon"]; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex -space-x-1.5">
        {Array.from({ length: count }, (_, i) => (
          <IconChip key={i} hex={hex} icon={Icon} size="sm" />
        ))}
      </div>
      <span className="font-mono text-xs tabular-nums text-ink-soft dark:text-bone-soft">{count}</span>
    </div>
  );
}
