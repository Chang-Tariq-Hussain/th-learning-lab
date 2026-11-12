"use client";

import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { BEATS, STAGES, STRUCTURES, structuresAt, type StructureId } from "../data/stages";
import { beatCounts, ploidyText } from "../engine/counts";
import { HOMOLOG_COLOR, HOMOLOG_NAME } from "../../meiosis/engine/palette";
import { chromosomeTag, homologOf, pairOf, sideOf, type MitosisPlan, type PairCount } from "../engine/plan";
import type { Selection } from "../types";

export function CountChips({ beat, pairs }: { beat: number; pairs: PairCount }) {
  const c = beatCounts(beat, pairs);
  const items = [
    { k: "Cells", v: c.nuclei > 1 ? `${c.cells} (2 nuclei)` : String(c.cells) },
    { k: "Chromosomes per cell", v: `${c.chromosomes}${c.transient ? "*" : ` (${ploidyText(pairs)})`}` },
    { k: "Chromatids per cell", v: String(c.chromatids) },
    { k: "DNA per cell", v: `${c.dnaC}C` },
  ];
  return (
    <dl className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4" aria-label="Counts at this step" data-testid="count-chips">
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
          {HOMOLOG_NAME[h as 0 | 1]} chromosome ({h === 0 ? "M" : "P"})
        </li>
      ))}
      <li>Pairs 1–{pairs} differ in length</li>
      <li className="flex items-center gap-1.5">
        <span className="inline-block h-3 w-1.5 rounded-sm" style={{ background: "var(--m-kin, #D6336C)" }} aria-hidden="true" />
        kinetochore
      </li>
    </ul>
  );
}

function describeChromosome(plan: MitosisPlan, k: number, s: 0 | 1, beat: number) {
  const tag = chromosomeTag(k);
  const kind = HOMOLOG_NAME[homologOf(k)];
  const partnerTag = chromosomeTag(k ^ 1);
  const pole = sideOf(plan, { k, s }) === -1 ? "left" : "right";
  const lines: string[] = [];
  if (beat === 0) {
    lines.push(`Chromosome ${tag}: the ${kind} chromosome of pair ${pairOf(k) + 1}. Before DNA replication it is a single chromatid (one DNA molecule), spread out as thin chromatin.`);
  } else if (beat <= 7) {
    lines.push(`Chromosome ${tag}: the ${kind} chromosome of pair ${pairOf(k) + 1}. It consists of two identical sister chromatids joined at the centromere; the glowing rod is one of them and the softer ring marks its sister. Together they count as ONE chromosome.`);
    lines.push(beat >= 6 ? "It lines up on the metaphase plate on its own, with one chromatid facing each pole." : "It keeps its two sister chromatids until anaphase.");
  } else if (beat <= 9) {
    lines.push(`The centromeres have split. This chromatid is now a chromosome of its own, heading to the ${pole} pole. Its sister (the softer ring) is going to the opposite pole.`);
    lines.push("Both copies are identical, so each daughter cell will get one copy of chromosome " + tag + ".");
  } else {
    lines.push(`Chromosome ${tag} (one copy) is now inside the ${pole} daughter nucleus, decondensing back into chromatin. Its sister copy is in the other daughter cell.`);
  }
  lines.push(`The other ${HOMOLOG_NAME[(1 - homologOf(k)) as 0 | 1]} chromosome of the pair (${partnerTag}) is its homolog. In mitosis homologs do NOT pair up or exchange DNA.`);
  return { title: `Chromosome ${tag}`, lines };
}

export interface StageInfoProps {
  stageIndex: number;
  beat: number;
  pairs: PairCount;
  plan: MitosisPlan;
  selection: Selection | null;
  onSelectStructure: (id: StructureId) => void;
  selectionEnabled: boolean;
}

const EYEBROW = { prep: "Before mitosis", M: "Mitosis · nuclear division", C: "Cytokinesis · cell division" } as const;

/** Explanation for the current stage: a short beginner answer first, details on request. */
export function StageInfo({ stageIndex, beat, pairs, plan, selection, onSelectStructure, selectionEnabled }: StageInfoProps) {
  const stage = STAGES[stageIndex]!;
  const bi = BEATS[beat]!;
  const inStage = BEATS.map((b, i) => (b.stage === stageIndex ? i : -1)).filter((i) => i >= 0);
  const stepInStage = inStage.indexOf(beat) + 1;
  const structs = structuresAt(beat, plan.plant);
  const counts = beatCounts(beat, pairs);
  const sel =
    selection?.kind === "structure"
      ? { title: STRUCTURES[selection.id].name, lines: [STRUCTURES[selection.id].what, STRUCTURES[selection.id].role, structs.some((s) => s.id === selection.id) ? "" : "(Not visible at this step.)"].filter(Boolean) }
      : selection?.kind === "chromosome"
        ? describeChromosome(plan, selection.k, selection.s, beat)
        : null;

  return (
    <section aria-label="Stage explanation" className="flex flex-col gap-3" data-testid="stage-info">
      <div>
        <p className="font-mono text-label uppercase tracking-eyebrow text-subject-biology">{EYEBROW[stage.phase]}</p>
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
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-ink-soft dark:text-bone-soft">At this step</p>
        <CountChips beat={beat} pairs={pairs} />
        {counts.note ? <p className="mt-1.5 text-xs text-ink-soft dark:text-bone-soft">{counts.note}</p> : null}
        {counts.transient ? <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">* Counted by centromeres: each separated chromatid is now a chromosome.</p> : null}
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
