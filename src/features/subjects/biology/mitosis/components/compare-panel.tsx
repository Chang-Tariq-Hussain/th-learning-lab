"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Row {
  id: string;
  label: string;
  mitosis: string;
  meiosis: string;
  detail: string;
}

const ROWS: Row[] = [
  { id: "divisions", label: "Number of divisions", mitosis: "1 nuclear division", meiosis: "2 divisions (meiosis I and II)", detail: "DNA is copied once before either process. Mitosis shares it out in one division; meiosis shares it out in two, which is why it can make four cells." },
  { id: "cells", label: "Daughter cells", mitosis: "2", meiosis: "4 (standard model)", detail: "One mitosis gives two cells. One complete meiosis gives four haploid cells in the standard model (egg formation in many animals divides unevenly)." },
  { id: "number", label: "Chromosome number in daughter cells", mitosis: "Same as parent (2n to 2n)", meiosis: "Half of the parent (2n to n)", detail: "Mitosis does not normally change the chromosome number. Meiosis I halves it, so fertilization can restore 2n." },
  { id: "separate", label: "What is separated", mitosis: "Sister chromatids", meiosis: "Meiosis I: homologous chromosomes. Meiosis II: sister chromatids", detail: "Anaphase of mitosis separates sister chromatids. Meiosis I separates homologous chromosomes (each still two chromatids); meiosis II separates sister chromatids, like mitosis." },
  { id: "pairing", label: "Homologous chromosomes", mitosis: "Do not pair; each chromosome lines up on its own", meiosis: "Pair up (synapsis) and cross over in prophase I", detail: "In mitosis the maternal and paternal chromosomes are both present, but they act independently. In meiosis they pair into tetrads and exchange segments." },
  { id: "genetics", label: "Genetic similarity", mitosis: "Daughters are genetically identical to the parent", meiosis: "Four genetically different cells", detail: "Crossing over and independent assortment shuffle alleles in meiosis. Mitosis makes identical copies (apart from rare mutations)." },
  { id: "purpose", label: "Biological purpose", mitosis: "Growth, repair, replacement; asexual reproduction in some organisms", meiosis: "Making gametes (sex cells) for sexual reproduction", detail: "Mitosis makes more body cells. Meiosis makes the haploid cells that combine at fertilization." },
];

/** Compact Mitosis vs Meiosis comparison. It links to the Meiosis lab instead of repeating it. */
export function ComparePanel() {
  const [sel, setSel] = useState("separate");
  const row = ROWS.find((r) => r.id === sel)!;
  return (
    <section aria-label="Mitosis compared with meiosis" className="flex flex-col gap-5" data-testid="compare-panel">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-medium text-ink dark:text-bone">Mitosis vs meiosis</h2>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft dark:text-bone-soft">Both start with a replicated cell (every chromosome has two sister chromatids). Choose a row to see the difference explained.</p>
        </div>
        <Link href="/dashboard/biology/meiosis" data-testid="open-meiosis" className="flex min-h-11 items-center gap-1.5 rounded-full border border-subject-biology px-4 text-sm font-medium text-subject-biology transition-colors hover:bg-subject-biology-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink dark:focus-visible:outline-bone">
          Open the Meiosis simulation
          <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="overflow-x-auto rounded-2xl border border-line dark:border-line-dark">
          <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-subject-biology-soft/60 text-xs uppercase tracking-wide text-ink-soft dark:bg-subject-biology/10 dark:text-bone-soft">
                <th scope="col" className="px-3 py-2 font-semibold">Feature</th>
                <th scope="col" className="px-3 py-2 font-semibold text-ink dark:text-bone">Mitosis</th>
                <th scope="col" className="px-3 py-2 font-semibold text-subject-biology">Meiosis</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.id} className={cn("border-t border-line dark:border-line-dark", sel === r.id && "bg-subject-biology-soft/40 dark:bg-subject-biology/10")}>
                  <th scope="row" className="px-3 py-2 font-medium text-ink dark:text-bone">
                    <button type="button" aria-pressed={sel === r.id} data-compare-row={r.id} onClick={() => setSel(r.id)} className="min-h-9 text-left underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink dark:focus-visible:outline-bone">
                      {r.label}
                    </button>
                  </th>
                  <td className="px-3 py-2 text-ink-soft dark:text-bone-soft">{r.mitosis}</td>
                  <td className="px-3 py-2 text-ink dark:text-bone">{r.meiosis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-subject-biology/40 bg-white/70 p-4 dark:bg-white/[0.04]" aria-live="polite" data-testid="compare-detail">
            <p className="font-mono text-label uppercase tracking-eyebrow text-subject-biology">{row.label}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink dark:text-bone">{row.detail}</p>
          </div>
          <figure className="rounded-2xl border border-line p-3 dark:border-line-dark" data-testid="compare-flow">
            <figcaption className="mb-2 text-sm font-medium text-ink dark:text-bone">Starting from one diploid cell (2n)</figcaption>
            <ul className="flex flex-col gap-2 text-xs">
              {[
                ["Mitosis", ["1 cell, 2n", "DNA copied", "1 division (sister chromatids separate)", "2 cells, 2n each"]],
                ["Meiosis", ["1 cell, 2n", "DNA copied", "Meiosis I (homologs separate)", "2 cells, n each", "Meiosis II (sister chromatids separate)", "4 cells, n each"]],
              ].map(([name, steps]) => (
                <li key={name as string}>
                  <p className="mb-1 font-semibold text-ink dark:text-bone">{name as string}</p>
                  <div className="flex flex-wrap items-center gap-1">
                    {(steps as string[]).map((s, i, a) => (
                      <span key={s} className="flex items-center gap-1">
                        <span className="rounded-full bg-subject-biology-soft px-2 py-0.5 font-medium text-subject-biology dark:bg-subject-biology/15">{s}</span>
                        {i < a.length - 1 ? <span aria-hidden="true" className="text-subject-biology/60">&rarr;</span> : null}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </figure>
          <p className="text-xs text-ink-soft dark:text-bone-soft">The Meiosis simulation shows pairing, crossing over and the two divisions in detail. It is not repeated here.</p>
        </div>
      </div>
    </section>
  );
}
