"use client";

import { Lightbulb } from "lucide-react";
import { BEATS, STAGES, STRUCTURES, structuresAt, type StructureId } from "../data/stages";
import { STAGE_FIRST_BEAT } from "../engine/beats";
import { stageCounts, ploidyLabel } from "../engine/counts";
import { HOMOLOG_COLOR, HOMOLOG_NAME } from "../engine/palette";
import { allelesOf, type ChromatidId, type MeiosisPlan, type PairCount } from "../engine/plan";
import type { Selection } from "../types";
import { cn } from "@/lib/utils";

export function CountChips({ stage, pairs }: { stage: number; pairs: PairCount }) {
  const c = stageCounts(stage, pairs);
  const items = [
    { k: "Cells", v: String(c.cells) },
    { k: "Chromosomes per cell", v: `${c.chromosomes} (${ploidyLabel(c.ploidy, pairs)})` },
    { k: "Chromatids per cell", v: String(c.chromatids) },
    { k: "DNA per cell", v: `${c.dnaC}C` },
  ];
  return (
    <dl className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4" aria-label="Counts at the end of this stage" data-testid="count-chips">
      {items.map((i) => (
        <div key={i.k} className="rounded-lg border border-line bg-white/60 px-2 py-1 dark:border-line-dark dark:bg-white/[0.04]">
          <dt className="truncate text-[11px] text-ink-soft dark:text-bone-soft">{i.k}</dt>
          <dd className="font-display text-base font-semibold leading-6 text-ink dark:text-bone">{i.v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Legend({ pairs }: { pairs: PairCount }) {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-ink-soft dark:text-bone-soft" aria-label="Colour key" data-testid="legend">
      {[0, 1].map((h) => (
        <li key={h} className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm" style={{ background: HOMOLOG_COLOR[h as 0 | 1] }} aria-hidden="true" />
          {HOMOLOG_NAME[h as 0 | 1]} chromosome ({h === 0 ? "M, capital letters" : "P, small letters"})
        </li>
      ))}
      <li>Pairs 1–{pairs} differ in length and genes</li>
      <li className="flex items-center gap-1.5">
        <span className="inline-block h-1.5 w-3 rounded-sm border border-ink/40 bg-white" aria-hidden="true" />
        gene marker
      </li>
    </ul>
  );
}

function describeChromatid(plan: MeiosisPlan, id: ChromatidId, beat: number) {
  const spec = plan.specs[id.pair]!;
  const [a, b] = allelesOf(plan, id);
  const exchanged = plan.cross[id.pair] !== null && beat >= 5;
  const duplicated = beat >= 1;
  return {
    title: `Chromatid · pair ${id.pair + 1}, ${HOMOLOG_NAME[id.homolog]}`,
    lines: [
      duplicated
        ? `This is one of the two sister chromatids of the ${HOMOLOG_NAME[id.homolog]} chromosome of pair ${id.pair + 1}. Its sister (the ring around the other chromatid) is an identical copy, joined at the centromere.`
        : `Before replication this chromosome is a single chromatid.`,
      `Its homologous partner is the ${HOMOLOG_NAME[(1 - id.homolog) as 0 | 1]} chromosome of pair ${id.pair + 1} (dotted ring): same length and genes, but not necessarily the same alleles.`,
      beat >= 1 ? `Alleles carried at genes ${spec.genes[0]} and ${spec.genes[1]}: ${a}, ${b}${exchanged && plan.cross[id.pair] ? (a.toLowerCase() === a ? "" : "") : ""}.` : "",
      exchanged && plan.cross[id.pair] ? "This pair crossed over in prophase I, so some of its chromatids carry segments from the other homolog." : plan.cross[id.pair] === null && beat >= 5 ? "This pair did not cross over in this particular meiosis (it can happen)." : "",
    ].filter(Boolean),
  };
}

export interface StageInfoProps {
  stageIndex: number;
  beat: number;
  pairs: PairCount;
  plan: MeiosisPlan;
  selection: Selection | null;
  onSelectStructure: (id: StructureId) => void;
  selectionEnabled: boolean;
}

/** Compact explanation for the current stage: a short beginner answer first, details on request. */
export function StageInfo({ stageIndex, beat, pairs, plan, selection, onSelectStructure, selectionEnabled }: StageInfoProps) {
  const stage = STAGES[stageIndex]!;
  const bi = BEATS[beat]!;
  const inStage = BEATS.map((b, i) => (b.stage === stageIndex ? i : -1)).filter((i) => i >= 0);
  const stepInStage = inStage.indexOf(beat) + 1;
  const structs = structuresAt(beat);
  const sel =
    selection?.kind === "structure"
      ? { title: STRUCTURES[selection.id].name, lines: [STRUCTURES[selection.id].what, STRUCTURES[selection.id].role, structs.some((s) => s.id === selection.id) ? "" : "(Not visible at this step.)"].filter(Boolean) }
      : selection?.kind === "chromatid"
        ? describeChromatid(plan, selection.id, beat)
        : null;

  return (
    <section aria-label="Stage explanation" className="flex flex-col gap-3" data-testid="stage-info">
      <div>
        <p className="font-mono text-label uppercase tracking-eyebrow text-subject-biology">
          {stage.phase === "prep" ? "Before meiosis" : `Meiosis ${stage.phase} · ${stage.phase === "I" ? "reduction division" : "equational division"}`}
        </p>
        <h2 className="font-display text-xl font-medium text-ink dark:text-bone" data-testid="stage-name">
          {stage.label}
        </h2>
        <p className="mt-0.5 text-xs text-ink-soft dark:text-bone-soft" data-testid="beat-title">
          Step {stepInStage} of {inStage.length}: <strong className="font-semibold text-ink dark:text-bone">{bi.title}</strong>
        </p>
      </div>

      <p className="text-sm leading-relaxed text-ink dark:text-bone">{stage.whatHappening}</p>

      <dl className="grid gap-2 text-sm">
        {[
          ["What moves", stage.moving],
          ["Why it matters", stage.whyMatters],
          ["Result", stage.result],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-subject-biology-soft/60 px-3 py-2 dark:bg-subject-biology/10">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-subject-biology">{k}</dt>
            <dd className="mt-0.5 leading-snug text-ink-soft dark:text-bone-soft">{v}</dd>
          </div>
        ))}
      </dl>

      {stage.keyConcept ? (
        <p className="flex items-start gap-2 rounded-xl border border-subject-biology/30 bg-subject-biology-soft px-3 py-2 text-sm font-medium text-subject-biology dark:bg-subject-biology/10">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
          {stage.keyConcept}
        </p>
      ) : null}

      <details className="rounded-xl border border-line px-3 py-2 text-sm text-ink-soft dark:border-line-dark dark:text-bone-soft">
        <summary className="min-h-9 cursor-pointer font-medium text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink dark:text-bone dark:focus-visible:outline-bone">Go deeper</summary>
        <p className="mt-1 leading-relaxed">{stage.deeper}</p>
      </details>

      <div>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-ink-soft dark:text-bone-soft">At the end of this stage</p>
        <CountChips stage={stageIndex} pairs={pairs} />
        {stageCounts(stageIndex, pairs).note ? <p className="mt-1.5 text-xs text-ink-soft dark:text-bone-soft">{stageCounts(stageIndex, pairs).note}</p> : null}
      </div>

      {selectionEnabled ? (
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-ink-soft dark:text-bone-soft">Structures in this step</p>
          <div className="flex flex-wrap gap-1.5">
            {structs.map((s) => {
              const on = selection?.kind === "structure" && selection.id === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={on}
                  data-structure-btn={s.id}
                  onClick={() => onSelectStructure(s.id)}
                  className={cn(
                    "min-h-9 rounded-full border px-3 text-xs font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink dark:focus-visible:outline-bone",
                    on ? "border-subject-biology bg-subject-biology text-white dark:text-chalkboard" : "border-line text-ink-soft hover:text-ink dark:border-line-dark dark:text-bone-soft dark:hover:text-bone",
                  )}
                >
                  {s.name.replace(/ \(.*\)/, "")}
                </button>
              );
            })}
          </div>
          <p className="mt-1.5 text-xs text-ink-soft dark:text-bone-soft">Or click a chromosome, spindle fiber, centrosome or cell part in the picture.</p>
        </div>
      ) : null}

      {sel ? (
        <div className="rounded-xl border border-subject-biology/40 bg-white/70 px-3 py-2 dark:bg-white/[0.04]" data-testid="selection-card" aria-live="polite">
          <p className="text-sm font-semibold text-ink dark:text-bone" data-testid="selection-title">
            {sel.title}
          </p>
          {sel.lines.map((l, i) => (
            <p key={i} className="mt-1 text-sm leading-snug text-ink-soft dark:text-bone-soft">
              {l}
            </p>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export { STAGE_FIRST_BEAT };
