"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { STAGES } from "../data/stages";
import { ploidyLabel, stageCounts } from "../engine/counts";
import { HOMOLOG_COLOR, mix } from "../engine/palette";
import { PAIR_COUNTS, chromatidSources, sideOf, vertOf, type Bit, type MeiosisPlan, type PairCount } from "../engine/plan";

/* One drawn chromosome (two sister chromatids) or one single chromatid. */
interface Glyph {
  pair: number;
  homolog: Bit;
  /** Present for single chromatids (stage 8 and anaphase II). */
  sisters: Bit[];
}
interface CellContent {
  groups: Glyph[][];
}

/** What is inside each cell at the END of a stage, derived from the same plan the animation uses. */
export function cellContents(plan: MeiosisPlan, stage: number): CellContent[] {
  const all = plan.specs.map((_, i) => i);
  const dup = (pair: number, homolog: Bit): Glyph => ({ pair, homolog, sisters: [0, 1] });
  const single = (pair: number, homolog: Bit, s: Bit): Glyph => ({ pair, homolog, sisters: [s] });
  const homologOnSide = (pair: number, side: 0 | 1): Bit => (side === 0 ? plan.leftHomolog[pair]! : ((1 - plan.leftHomolog[pair]!) as Bit));
  if (stage <= 2) return [{ groups: [all.flatMap((p) => [dup(p, 0), dup(p, 1)])] }];
  if (stage === 3) return [{ groups: [0, 1].map((side) => all.map((p) => dup(p, homologOnSide(p, side as 0 | 1)))) }];
  if (stage <= 6) return [0, 1].map((side) => ({ groups: [all.map((p) => dup(p, homologOnSide(p, side as 0 | 1)))] }));
  if (stage === 7)
    return [0, 1].map((side) => ({
      groups: [0, 1].map((vert) =>
        all.map((p) => {
          const h = homologOnSide(p, side as 0 | 1);
          const top = plan.topSister[side as 0 | 1][p]!;
          return single(p, h, (vert === 0 ? top : 1 - top) as Bit);
        }),
      ),
    }));
  return [0, 1, 2, 3].map((cell) => ({
    groups: [
      all.map((p) => {
        const side = (cell >> 1) as 0 | 1;
        const vert = cell & 1;
        const h = homologOnSide(p, side);
        const top = plan.topSister[side][p]!;
        return single(p, h, (vert === 0 ? top : 1 - top) as Bit);
      }),
    ],
  }));
}

function Rod({ plan, g, sister, x, y, scale, crossed }: { plan: MeiosisPlan; g: Glyph; sister: Bit; x: number; y: number; scale: number; crossed: boolean }) {
  const spec = plan.specs[g.pair]!;
  const h = spec.length * scale;
  const src = crossed ? chromatidSources(plan, { pair: g.pair, homolog: g.homolog, sister }) : { top: g.homolog, bottom: g.homolog, at: null };
  const cut = src.at === null ? h : h * src.at;
  const top = HOMOLOG_COLOR[src.top];
  const bottom = HOMOLOG_COLOR[src.bottom];
  const w = 8;
  return (
    <g>
      <rect x={x - w / 2} y={y} width={w} height={h} rx={4} fill={mix(bottom, "#0A1020", 0.42)} />
      <rect x={x - w / 2 + 1} y={y + 1} width={w - 2} height={h - 2} rx={3} fill={bottom} />
      {src.top !== src.bottom || src.at !== null ? <rect x={x - w / 2 + 1} y={y + 1} width={w - 2} height={Math.max(2, cut - 1)} rx={3} fill={top} /> : null}
    </g>
  );
}

function GlyphView({ plan, g, x, y, stage, badge }: { plan: MeiosisPlan; g: Glyph; x: number; y: number; stage: number; badge: string | null }) {
  const spec = plan.specs[g.pair]!;
  const scale = 0.44;
  const crossed = stage >= 1;
  const h = spec.length * scale;
  const cy = y + spec.centromere * h;
  const dupl = g.sisters.length === 2;
  const dx = dupl ? 6 : 0;
  return (
    <g data-glyph={`${g.pair}-${g.homolog}`} data-chromatids={g.sisters.length}>
      {g.sisters.map((s, i) => (
        <Rod key={s} plan={plan} g={g} sister={s} x={x + (dupl ? (i === 0 ? -dx : dx) : 0)} y={y} scale={scale} crossed={crossed} />
      ))}
      <circle cx={x} cy={cy} r={4.2} fill="#0A1020" fillOpacity={0.75} stroke="#fff" strokeWidth={1} />
      {badge ? (
        <g>
          <circle cx={x} cy={y - 9} r={8} fill="var(--m-ink)" />
          <text x={x} y={y - 5.5} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="var(--m-halo)">
            {badge}
          </text>
        </g>
      ) : null}
    </g>
  );
}

export interface PloidyExplorerProps {
  plan: MeiosisPlan;
  pairs: PairCount;
  onPairs: (p: PairCount) => void;
}

const W = 600;
const H = 250;

export function PloidyExplorer({ plan, pairs, onPairs }: PloidyExplorerProps) {
  const [stage, setStage] = useState(0);
  const [count, setCount] = useState<"chromosomes" | "chromatids">("chromosomes");
  const c = stageCounts(stage, pairs);
  const cells = useMemo(() => cellContents(plan, stage), [plan, stage]);
  const n = cells.length;
  const cellW = W / n;
  const pw = pairs;
  void pw;

  const rows = STAGES.map((_, i) => ({ i, ...stageCounts(i, pairs) }));
  const maxY = Math.max(2 * pairs, 4);
  const cx = (i: number) => 40 + (i * (W - 70)) / (STAGES.length - 1);
  const cy = (v: number) => 130 - (v / maxY) * 110;

  return (
    <section aria-label="Diploid and haploid explorer" className="flex flex-col gap-5" data-testid="ploidy-explorer">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-medium text-ink dark:text-bone">Diploid vs haploid: counting chromosomes</h2>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft dark:text-bone-soft">
            A simplified starting cell with a small number of chromosomes. Chromosome number is counted by centromeres. DNA amount is counted in chromatids (copies of each chromosome). They do not always change together.
          </p>
        </div>
        <div role="radiogroup" aria-label="Starting chromosome number" className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-ink-soft dark:text-bone-soft">Starting cell</span>
          {PAIR_COUNTS.map((p) => (
            <button key={p} type="button" role="radio" aria-checked={pairs === p} data-pairs={p} onClick={() => onPairs(p)} className={cn("min-h-10 rounded-full border px-3 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink dark:focus-visible:outline-bone", pairs === p ? "border-subject-biology bg-subject-biology text-white dark:text-chalkboard" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft")}>
              2n = {2 * p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="min-w-0">
          <div role="radiogroup" aria-label="Stage" className="mb-2 flex flex-wrap gap-1">
            {STAGES.map((s, i) => (
              <button key={s.id} type="button" role="radio" aria-checked={stage === i} data-ploidy-stage={i} onClick={() => setStage(i)} className={cn("min-h-9 rounded-full border px-2.5 text-xs font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink dark:focus-visible:outline-bone", stage === i ? "border-subject-biology bg-subject-biology text-white dark:text-chalkboard" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft")}>
                {s.number}. {s.short}
              </button>
            ))}
          </div>
          <div className="meio-root rounded-2xl border border-line dark:border-line-dark" data-testid="ploidy-diagram" data-cells={n}>
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`End of ${STAGES[stage]!.label}: ${c.cells} cell${c.cells > 1 ? "s" : ""}, each with ${c.chromosomes} chromosomes and ${c.chromatids} chromatids`}>
              <defs>
                <radialGradient id="pe-cyto" cx="40%" cy="34%" r="80%">
                  <stop offset="0%" style={{ stopColor: "var(--m-cyto-a)" }} />
                  <stop offset="100%" style={{ stopColor: "var(--m-cyto-b)" }} />
                </radialGradient>
              </defs>
              {cells.map((cell, ci) => {
                const ox = ci * cellW;
                const groupW = (cellW - 16) / cell.groups.length;
                return (
                  <g key={ci} data-cell={ci}>
                    <ellipse cx={ox + cellW / 2} cy={H / 2} rx={cellW / 2 - 6} ry={H / 2 - 12} fill="url(#pe-cyto)" stroke="var(--m-membrane)" strokeWidth={3} />
                    {cell.groups.map((grp, gi) => {
                      const gx = ox + 8 + gi * groupW;
                      const step = grp[0]!.sisters.length === 2 ? 27 : 19;
                      const total = (grp.length - 1) * step;
                      const longest = Math.max(...plan.specs.map((s) => s.length)) * 0.44;
                      let k = 0;
                      return (
                        <g key={gi}>
                          {grp.map((g, i) => {
                            const x = gx + groupW / 2 - total / 2 + i * step;
                            const badge = count === "chromosomes" ? String(i + 1) : null;
                            const ch = count === "chromatids" ? g.sisters.map(() => ++k) : [];
                            return (
                              <g key={`${g.pair}-${g.homolog}-${g.sisters.join("")}`}>
                                <GlyphView plan={plan} g={g} x={x} y={H / 2 - longest / 2 + 6} stage={stage} badge={badge} />
                                {count === "chromatids"
                                  ? ch.map((num, j) => (
                                      <g key={j}>
                                        <circle cx={x + (g.sisters.length === 2 ? (j === 0 ? -6 : 6) : 0)} cy={H / 2 - longest / 2 + 6 + plan.specs[g.pair]!.length * 0.44 + 11} r={7.5} fill="var(--m-ink)" />
                                        <text x={x + (g.sisters.length === 2 ? (j === 0 ? -6 : 6) : 0)} y={H / 2 - longest / 2 + 6 + plan.specs[g.pair]!.length * 0.44 + 14.5} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="var(--m-halo)">
                                          {num}
                                        </text>
                                      </g>
                                    ))
                                  : null}
                              </g>
                            );
                          })}
                        </g>
                      );
                    })}
                    {cell.groups.length > 1 ? <line x1={ox + cellW / 2} x2={ox + cellW / 2} y1={34} y2={H - 34} stroke="var(--m-ink)" strokeOpacity={0.3} strokeDasharray="4 5" /> : null}
                  </g>
                );
              })}
            </svg>
          </div>
          <div role="radiogroup" aria-label="What to count" className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-ink-soft dark:text-bone-soft">Count</span>
            {(
              [
                ["chromosomes", "Chromosomes (one per centromere)"],
                ["chromatids", "Chromatids (copies of DNA)"],
              ] as const
            ).map(([v, label]) => (
              <button key={v} type="button" role="radio" aria-checked={count === v} data-count={v} onClick={() => setCount(v)} className={cn("min-h-9 rounded-full border px-3 text-xs font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink dark:focus-visible:outline-bone", count === v ? "border-subject-biology bg-subject-biology-soft text-subject-biology dark:bg-subject-biology/15" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft")}>
                {label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">Numbers are counted inside one half of the picture at a time: look at one cell (or one side of the dashed line). Blue = maternal, orange = paternal; two-colour rods are chromatids changed by crossing over.</p>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <h3 className="font-display text-lg font-medium text-ink dark:text-bone" data-testid="ploidy-stage-name">
            End of {STAGES[stage]!.label}
          </h3>
          <dl className="grid grid-cols-2 gap-2" data-testid="ploidy-stats">
            {[
              ["Cells", String(c.cells), "cells"],
              ["Ploidy of each cell", ploidyLabel(c.ploidy, pairs), "ploidy"],
              ["Chromosomes per cell", String(c.chromosomes), "chromosomes"],
              ["Chromatids per cell", String(c.chromatids), "chromatids"],
              ["DNA per cell", `${c.dnaC}C`, "dna"],
              ["DNA in all cells", `${c.dnaC * c.cells}C`, "total"],
            ].map(([k, v, id]) => (
              <div key={id} className="rounded-xl border border-line bg-white/70 px-3 py-2 dark:border-line-dark dark:bg-white/[0.04]">
                <dt className="text-[11px] text-ink-soft dark:text-bone-soft">{k}</dt>
                <dd className="font-display text-xl font-semibold text-ink dark:text-bone" data-stat={id}>
                  {v}
                </dd>
              </div>
            ))}
          </dl>
          <p className="text-sm leading-snug text-ink-soft dark:text-bone-soft">
            {c.note ??
              (c.chromatidsPerChromosome === 2
                ? `Each chromosome has two sister chromatids, so ${c.chromosomes} chromosomes hold ${c.chromatids} chromatids of DNA.`
                : `Each chromosome is a single chromatid, so ${c.chromosomes} chromosomes hold ${c.chromatids} chromatids of DNA.`)}
          </p>
          <p className="text-xs text-ink-soft dark:text-bone-soft">1C = the DNA of one complete haploid set (one chromatid of each pair).</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <figure className="meio-root rounded-2xl border border-line p-3 dark:border-line-dark" data-testid="ploidy-chart">
          <figcaption className="mb-1 text-sm font-medium text-ink dark:text-bone">Chromosome number and DNA per cell, stage by stage</figcaption>
          <svg viewBox="0 0 620 190" className="h-auto w-full" role="img" aria-label="Line chart of chromosomes per cell and DNA per cell across the nine stages. Chromosome number halves once; DNA per cell halves twice.">
            {Array.from({ length: maxY + 1 }, (_, v) => v).filter((v) => v % 2 === 0).map((v) => (
              <g key={v}>
                <line x1={34} x2={600} y1={cy(v)} y2={cy(v)} stroke="var(--m-ink)" strokeOpacity={0.12} />
                <text x={28} y={cy(v) + 4} textAnchor="end" fontSize={11} fill="var(--m-ink)">
                  {v}
                </text>
              </g>
            ))}
            <polyline fill="none" stroke={HOMOLOG_COLOR[0]} strokeWidth={3} points={rows.map((r) => `${cx(r.i)},${cy(r.chromosomes)}`).join(" ")} />
            <polyline fill="none" stroke={HOMOLOG_COLOR[1]} strokeWidth={3} strokeDasharray="7 5" points={rows.map((r) => `${cx(r.i)},${cy(r.dnaC * (pairs / 2) * 1)}`).join(" ")} />
            {rows.map((r) => (
              <g key={r.i}>
                <circle cx={cx(r.i)} cy={cy(r.chromosomes)} r={r.i === stage ? 6 : 4} fill={HOMOLOG_COLOR[0]} stroke="var(--m-halo)" strokeWidth={1.5} />
                <rect x={cx(r.i) - (r.i === stage ? 6 : 4)} y={cy(r.dnaC * (pairs / 2)) - (r.i === stage ? 6 : 4)} width={r.i === stage ? 12 : 8} height={r.i === stage ? 12 : 8} fill={HOMOLOG_COLOR[1]} stroke="var(--m-halo)" strokeWidth={1.5} />
                <text x={cx(r.i)} y={152} textAnchor="middle" fontSize={11} fontWeight={r.i === stage ? 700 : 500} fill="var(--m-ink)">
                  {r.i + 1}
                </text>
              </g>
            ))}
            <text x={cx(4)} y={176} textAnchor="middle" fontSize={11} fill="var(--m-ink)">
              stage number (1 = interphase … 9 = telophase II)
            </text>
          </svg>
          <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink dark:text-bone">
            <li className="flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-5" style={{ background: HOMOLOG_COLOR[0], height: 3 }} aria-hidden="true" /> Chromosomes per cell
            </li>
            <li className="flex items-center gap-1.5">
              <span className="inline-block w-5 border-t-[3px] border-dashed" style={{ borderColor: HOMOLOG_COLOR[1] }} aria-hidden="true" /> DNA per cell, scaled ({pairs / 2} per C)
            </li>
          </ul>
          <details className="mt-2 text-xs text-ink-soft dark:text-bone-soft">
            <summary className="min-h-9 cursor-pointer font-medium text-ink dark:text-bone">Show as a table</summary>
            <table className="mt-1 w-full text-left">
              <thead>
                <tr>
                  <th scope="col">Stage</th>
                  <th scope="col">Cells</th>
                  <th scope="col">Chromosomes</th>
                  <th scope="col">Chromatids</th>
                  <th scope="col">DNA</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.i} className={r.i === stage ? "font-semibold text-ink dark:text-bone" : ""}>
                    <th scope="row" className="font-normal">{STAGES[r.i]!.short}</th>
                    <td>{r.cells}</td>
                    <td>{r.chromosomes}</td>
                    <td>{r.chromatids}</td>
                    <td>{r.dnaC}C</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </figure>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" data-testid="ploidy-defs">
          {[
            ["Diploid (2n)", `Two full sets of chromosomes, one from each parent. Here 2n = ${2 * pairs}: ${pairs} pairs.`],
            ["Haploid (n)", `One full set: one chromosome from every pair. Here n = ${pairs}. Meiosis makes haploid cells.`],
            ["Homologous chromosomes", "A maternal and a paternal chromosome of the same pair: same genes in the same places, maybe different alleles. They are different chromosomes."],
            ["Sister chromatids", "The two identical copies made by DNA replication, joined at one centromere. Together they count as ONE chromosome."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-xl border border-line bg-white/70 p-3 dark:border-line-dark dark:bg-white/[0.04]">
              <p className="text-sm font-semibold text-ink dark:text-bone">{t}</p>
              <p className="mt-0.5 text-xs leading-snug text-ink-soft dark:text-bone-soft">{d}</p>
            </div>
          ))}
          <div className="rounded-xl border border-subject-biology/40 bg-subject-biology-soft/60 p-3 text-sm leading-snug text-ink dark:bg-subject-biology/10 dark:text-bone sm:col-span-2">
            <strong>Key idea:</strong> replication doubles the DNA but not the chromosome number. Meiosis I halves the chromosome number (2n to n). Meiosis II halves the DNA again without changing the chromosome number, because it separates sister chromatids.
          </div>
        </div>
      </div>
    </section>
  );
}
