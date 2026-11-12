"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { HOMOLOG_COLOR, mix } from "../../meiosis/engine/palette";
import { COUNT_ROWS, ploidyText, rowCounts } from "../engine/counts";
import { PAIR_COUNTS, homologOf, pairOf, type MitosisPlan, type PairCount } from "../engine/plan";
import { cellContents, type Glyph } from "../engine/cells";
import { STAGE_STYLE } from "./lab-stage";

const W = 600;
const H = 250;
const SC = 0.44;

function Rod({ plan, g, i, x, y }: { plan: MitosisPlan; g: Glyph; i: number; x: number; y: number }) {
  const spec = plan.specs[pairOf(g.k)]!;
  const h = spec.length * SC;
  const color = HOMOLOG_COLOR[homologOf(g.k)];
  const dx = g.sisters.length === 2 ? (i === 0 ? -5 : 5) : 0;
  return (
    <g>
      <rect x={x + dx - 4} y={y} width={8} height={h} rx={4} fill={mix(color, "#0A1020", 0.42)} />
      <rect x={x + dx - 3} y={y + 1} width={6} height={h - 2} rx={3} fill={color} />
    </g>
  );
}

function GlyphView({ plan, g, x, y, badge }: { plan: MitosisPlan; g: Glyph; x: number; y: number; badge: string | null }) {
  const spec = plan.specs[pairOf(g.k)]!;
  const h = spec.length * SC;
  return (
    <g data-glyph={g.k} data-chromatids={g.sisters.length}>
      {g.sisters.map((_, i) => (
        <Rod key={i} plan={plan} g={g} i={i} x={x} y={y} />
      ))}
      <circle cx={x} cy={y + spec.centromere * h} r={4.2} fill="#0A1020" fillOpacity={0.75} stroke="#fff" strokeWidth={1} />
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

export interface CountingLabProps {
  plan: MitosisPlan;
  pairs: PairCount;
  onPairs: (p: PairCount) => void;
}

/** Chromosome counting: pick a starting number, step through the cell cycle and watch chromosomes, chromatids and DNA. */
export function CountingLab({ plan, pairs, onPairs }: CountingLabProps) {
  const [row, setRow] = useState(0);
  const [count, setCount] = useState<"chromosomes" | "chromatids">("chromosomes");
  const c = rowCounts(row, pairs);
  const cells = useMemo(() => cellContents(plan, row), [plan, row]);
  const nCells = cells.length;
  const cellW = W / nCells;
  const rows = COUNT_ROWS.map((r, i) => ({ i, ...rowCounts(i, pairs) }));
  const n = 2 * pairs;
  const maxY = 2 * n;
  const cx = (i: number) => 40 + (i * (W - 70)) / (COUNT_ROWS.length - 1);
  const cy = (v: number) => 130 - (v / maxY) * 110;
  const longest = Math.max(...plan.specs.map((s) => s.length)) * SC;

  return (
    <section aria-label="Chromosome counting" className="mito-root flex flex-col gap-5" data-testid="counting-lab">
      <style>{STAGE_STYLE}</style>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-medium text-ink dark:text-bone">Counting chromosomes through mitosis</h2>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft dark:text-bone-soft">
            Chromosomes are counted by centromeres. Chromatids are copies of DNA. DNA content is measured in C (1C = one complete set of chromosomes, n). Replication changes the DNA and the chromatids, not the chromosome number.
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
            {COUNT_ROWS.map((r, i) => (
              <button key={r.id} type="button" role="radio" aria-checked={row === i} data-count-row={i} onClick={() => setRow(i)} className={cn("min-h-9 rounded-full border px-2.5 text-xs font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink dark:focus-visible:outline-bone", row === i ? "border-subject-biology bg-subject-biology text-white dark:text-chalkboard" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft")}>
                {r.short}
              </button>
            ))}
          </div>
          <div className="rounded-2xl border border-line dark:border-line-dark" data-testid="count-diagram" data-cells={nCells}>
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full rounded-2xl" role="img" aria-label={`${COUNT_ROWS[row]!.label}: ${c.cells} cell${c.cells > 1 ? "s" : ""}${c.nuclei > 1 ? " with two nuclei" : ""}, each with ${c.chromosomes} chromosomes and ${c.chromatids} chromatids`}>
              <defs>
                <radialGradient id="mito-ct-cyto" cx="40%" cy="34%" r="80%">
                  <stop offset="0%" style={{ stopColor: "var(--m-cyto-a)" }} />
                  <stop offset="100%" style={{ stopColor: "var(--m-cyto-b)" }} />
                </radialGradient>
              </defs>
              {cells.map((cell, ci) => {
                const ox = ci * cellW;
                const groupW = (cellW - 16) / cell.groups.length;
                return (
                  <g key={ci} data-cell={ci}>
                    <ellipse cx={ox + cellW / 2} cy={H / 2} rx={cellW / 2 - 6} ry={H / 2 - 12} fill="url(#mito-ct-cyto)" stroke="var(--m-membrane)" strokeWidth={3} />
                    {cell.groups.map((grp, gi) => {
                      const gx = ox + 8 + gi * groupW;
                      const step = grp[0]!.sisters.length === 2 ? 26 : 18;
                      const total = (grp.length - 1) * step;
                      let kk = 0;
                      return (
                        <g key={gi} data-group={gi}>
                          {cell.nuclei ? <ellipse cx={gx + groupW / 2} cy={H / 2} rx={Math.min(groupW / 2 - 4, total / 2 + 30)} ry={H / 2 - 40} fill="none" stroke="var(--m-nuc-line)" strokeWidth={2.5} strokeDasharray="6 5" /> : null}
                          {grp.map((g, i) => {
                            const x = gx + groupW / 2 - total / 2 + i * step;
                            const yTop = H / 2 - longest / 2 + 6;
                            const ch = count === "chromatids" ? g.sisters.map(() => ++kk) : [];
                            return (
                              <g key={`${g.k}-${g.sisters.join("")}`}>
                                <GlyphView plan={plan} g={g} x={x} y={yTop} badge={count === "chromosomes" ? String(i + 1) : null} />
                                {ch.map((num, j) => (
                                  <g key={j}>
                                    <circle cx={x + (g.sisters.length === 2 ? (j === 0 ? -5 : 5) : 0)} cy={yTop + plan.specs[pairOf(g.k)]!.length * SC + 11} r={7.5} fill="var(--m-ink)" />
                                    <text x={x + (g.sisters.length === 2 ? (j === 0 ? -5 : 5) : 0)} y={yTop + plan.specs[pairOf(g.k)]!.length * SC + 14.5} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="var(--m-halo)">
                                      {num}
                                    </text>
                                  </g>
                                ))}
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
          <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">Numbers are counted inside one cell (or, in anaphase and telophase, one side of the dashed line shows the chromosomes at one pole). Blue = maternal, orange = paternal. Each daughter cell gets one copy of every chromosome.</p>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <h3 className="font-display text-lg font-medium text-ink dark:text-bone" data-testid="count-stage-name">
            {COUNT_ROWS[row]!.label}
          </h3>
          <dl className="grid grid-cols-2 gap-2" data-testid="count-stats">
            {[
              ["Cells", String(c.cells), "cells"],
              ["Nuclei in the cell", String(c.nuclei), "nuclei"],
              ["Chromosomes per cell", `${c.chromosomes}${c.transient ? "*" : ""}`, "chromosomes"],
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
          <p className="text-sm leading-snug text-ink-soft dark:text-bone-soft" data-testid="count-note">
            {c.note ??
              (c.chromatidsPerChromosome === 2
                ? `Each chromosome has two sister chromatids, so ${c.chromosomes} chromosomes hold ${c.chromatids} chromatids of DNA.`
                : `Each chromosome is a single chromatid, so ${c.chromosomes} chromosomes hold ${c.chromatids} chromatids of DNA.`)}
          </p>
          {c.transient ? <p className="text-xs text-ink-soft dark:text-bone-soft">* Momentary count: separated chromatids are chromosomes, so the cell holds twice as many for a short time, {n} at each end. Each daughter cell ends with {n}.</p> : null}
          <p className="text-xs text-ink-soft dark:text-bone-soft">1C = the DNA of one complete haploid set. The parent here is {ploidyText(pairs)}: {n} chromosomes, 2C in G1 and 4C after replication.</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <figure className="rounded-2xl border border-line p-3 dark:border-line-dark" data-testid="count-chart">
          <figcaption className="mb-1 text-sm font-medium text-ink dark:text-bone">Chromosomes and DNA per cell, stage by stage</figcaption>
          <svg viewBox="0 0 620 190" className="h-auto w-full" role="img" aria-label="Line chart of chromosomes per cell and DNA per cell. DNA doubles in S phase but the chromosome number does not; both double momentarily in anaphase and both return to the starting value after cytokinesis.">
            {Array.from({ length: maxY + 1 }, (_, v) => v).filter((v) => v % Math.max(2, n / 2) === 0).map((v) => (
              <g key={v}>
                <line x1={34} x2={600} y1={cy(v)} y2={cy(v)} stroke="var(--m-ink)" strokeOpacity={0.12} />
                <text x={28} y={cy(v) + 4} textAnchor="end" fontSize={11} fill="var(--m-ink)">
                  {v}
                </text>
              </g>
            ))}
            <polyline fill="none" stroke={HOMOLOG_COLOR[0]} strokeWidth={3} points={rows.map((r) => `${cx(r.i)},${cy(r.chromosomes)}`).join(" ")} />
            <polyline fill="none" stroke={HOMOLOG_COLOR[1]} strokeWidth={3} strokeDasharray="7 5" points={rows.map((r) => `${cx(r.i)},${cy(r.dnaC * (n / 2))}`).join(" ")} />
            {rows.map((r) => (
              <g key={r.i}>
                <circle cx={cx(r.i)} cy={cy(r.chromosomes)} r={r.i === row ? 6 : 4} fill={HOMOLOG_COLOR[0]} stroke="var(--m-halo)" strokeWidth={1.5} />
                <rect x={cx(r.i) - (r.i === row ? 6 : 4)} y={cy(r.dnaC * (n / 2)) - (r.i === row ? 6 : 4)} width={r.i === row ? 12 : 8} height={r.i === row ? 12 : 8} fill={HOMOLOG_COLOR[1]} stroke="var(--m-halo)" strokeWidth={1.5} />
                <text x={cx(r.i)} y={152} textAnchor="middle" fontSize={11} fontWeight={r.i === row ? 700 : 500} fill="var(--m-ink)">
                  {r.i + 1}
                </text>
              </g>
            ))}
            <text x={cx(3.5)} y={176} textAnchor="middle" fontSize={11} fill="var(--m-ink)">
              step (1 = G1 … 8 = after cytokinesis)
            </text>
          </svg>
          <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink dark:text-bone">
            <li className="flex items-center gap-1.5">
              <span className="inline-block w-5" style={{ background: HOMOLOG_COLOR[0], height: 3 }} aria-hidden="true" /> Chromosomes per cell
            </li>
            <li className="flex items-center gap-1.5">
              <span className="inline-block w-5 border-t-[3px] border-dashed" style={{ borderColor: HOMOLOG_COLOR[1] }} aria-hidden="true" /> DNA per cell, scaled ({n / 2} per C)
            </li>
          </ul>
          <details className="mt-2 text-xs text-ink-soft dark:text-bone-soft">
            <summary className="min-h-9 cursor-pointer font-medium text-ink dark:text-bone">Show as a table</summary>
            <table className="mt-1 w-full text-left">
              <thead>
                <tr>
                  <th scope="col">Step</th>
                  <th scope="col">Cells</th>
                  <th scope="col">Chromosomes</th>
                  <th scope="col">Chromatids</th>
                  <th scope="col">DNA</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.i} className={r.i === row ? "font-semibold text-ink dark:text-bone" : ""}>
                    <th scope="row" className="font-normal">{COUNT_ROWS[r.i]!.short}</th>
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

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" data-testid="count-defs">
          {[
            ["Diploid (2n)", `Two sets of chromosomes, one from each parent. Here 2n = ${n}. Mitosis keeps the cell diploid.`],
            ["Chromosome", "Counted by its centromere. Before replication it is one chromatid; after replication it is two sister chromatids; after anaphase each chromatid is a chromosome."],
            ["Sister chromatids", "The two identical copies made by DNA replication, joined at one centromere. Together they are ONE chromosome until anaphase."],
            ["DNA content (C)", `Replication doubles the DNA from 2C to 4C. Cytokinesis shares it out, so each daughter has 2C again.`],
          ].map(([t, d]) => (
            <div key={t} className="rounded-xl border border-line bg-white/70 p-3 dark:border-line-dark dark:bg-white/[0.04]">
              <p className="text-sm font-semibold text-ink dark:text-bone">{t}</p>
              <p className="mt-0.5 text-xs leading-snug text-ink-soft dark:text-bone-soft">{d}</p>
            </div>
          ))}
          <div className="rounded-xl border border-subject-biology/40 bg-subject-biology-soft/60 p-3 text-sm leading-snug text-ink dark:bg-subject-biology/10 dark:text-bone sm:col-span-2">
            <strong>Key idea:</strong> replication doubles the DNA but not the chromosome number. Anaphase separates sister chromatids, so each daughter cell gets one copy of every chromosome and ends with the same number as the parent.
          </div>
        </div>
      </div>
    </section>
  );
}
