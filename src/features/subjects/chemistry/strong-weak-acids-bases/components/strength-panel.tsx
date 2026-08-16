import { ParticleScene } from "./particle-scene";
import type { StrengthExample } from "../model";
import type { Species } from "../types";

interface StrengthPanelProps {
  species: Species;
  example: StrengthExample;
  ionized: boolean;
}

export function StrengthPanel({ species, example, ionized }: StrengthPanelProps) {
  return (
    <div className="flex flex-col gap-3 rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03] sm:p-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">{example.label}</p>
        <p className="mt-1 font-mono text-sm text-ink-soft dark:text-bone-soft">{example.formula}</p>
      </div>

      <ParticleScene species={species} example={example} ionized={ionized} />

      <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{example.explanation}</p>
    </div>
  );
}
