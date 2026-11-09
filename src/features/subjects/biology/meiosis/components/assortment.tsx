"use client";

import { useState } from "react";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HOMOLOG_COLOR, HOMOLOG_NAME, HOMOLOG_TAG } from "../engine/palette";
import type { PairCount } from "../engine/plan";

/**
 * Independent assortment: for every pair the learner chooses which homolog faces the left pole. The two
 * resulting haploid sets are listed underneath. Crossing over is deliberately left out so this one idea is clear.
 */
export function AssortmentExplorer({ pairs }: { pairs: PairCount }) {
  const [orient, setOrient] = useState<number[]>(() => Array.from({ length: 4 }, () => 0));
  const o = orient.slice(0, pairs);
  const left = o.map((b, i) => `${i + 1}${HOMOLOG_TAG[b as 0 | 1]}`);
  const right = o.map((b, i) => `${i + 1}${HOMOLOG_TAG[(1 - b) as 0 | 1]}`);
  const toggle = (i: number) => setOrient((p) => p.map((v, k) => (k === i ? 1 - v : v)));
  const shuffle = () => setOrient((p) => p.map(() => (Math.random() < 0.5 ? 0 : 1)));
  const combos = 2 ** pairs;
  const chip = (t: string) => {
    const h = t.endsWith("M") ? 0 : 1;
    return (
      <span key={t} className="inline-flex min-w-9 items-center justify-center rounded-md px-1.5 py-0.5 text-xs font-bold text-white" style={{ background: HOMOLOG_COLOR[h] }}>
        {t}
      </span>
    );
  };
  return (
    <section aria-label="Independent assortment" className="rounded-2xl border border-line bg-white/70 p-4 dark:border-line-dark dark:bg-white/[0.04]" data-testid="assortment">
      <h3 className="font-display text-lg font-medium text-ink dark:text-bone">Independent assortment</h3>
      <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">
        At metaphase I each pair lines up facing the poles in a random way. Flip a pair to swap which homolog goes left and which goes right. Each pair is decided independently of the others.
      </p>
      <ul className="mt-3 flex flex-col gap-1.5">
        {o.map((b, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-14 text-xs font-medium text-ink-soft dark:text-bone-soft">Pair {i + 1}</span>
            <span className="flex w-20 justify-end">{chip(left[i]!)}</span>
            <span className="h-6 w-0.5 rounded bg-ink/40 dark:bg-bone/40" aria-hidden="true" title="metaphase plate" />
            <span className="flex w-20">{chip(right[i]!)}</span>
            <button
              type="button"
              onClick={() => toggle(i)}
              data-flip={i}
              aria-label={`Flip pair ${i + 1}: now the ${HOMOLOG_NAME[b as 0 | 1]} chromosome faces the left pole`}
              className="min-h-9 rounded-full border border-line px-3 text-xs font-medium text-ink hover:border-subject-biology focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink dark:border-line-dark dark:text-bone dark:focus-visible:outline-bone"
            >
              Flip
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        {[
          ["Left cell gets", left],
          ["Right cell gets", right],
        ].map(([label, set]) => (
          <div key={label as string} className="rounded-xl bg-subject-biology-soft/60 p-2 dark:bg-subject-biology/10">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-subject-biology">{label as string}</p>
            <div className="mt-1 flex flex-wrap gap-1" data-testid={label === "Left cell gets" ? "assort-left" : "assort-right"}>
              {(set as string[]).map(chip)}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-ink-soft dark:text-bone-soft" data-testid="assort-count">
        With {pairs} pairs there are 2<sup>{pairs}</sup> = <strong className="text-ink dark:text-bone">{combos}</strong> possible ways to split the chromosomes into two sets. Humans have 23 pairs: 2<sup>23</sup> is about 8.4 million, before crossing over is even counted.
      </p>
      <Button size="sm" variant="secondary" className="mt-2" onClick={shuffle}>
        <Shuffle className="h-4 w-4" aria-hidden="true" />
        Random orientation
      </Button>
      <p className={cn("mt-2 text-xs text-ink-soft dark:text-bone-soft")}>M = maternal chromosome, P = paternal chromosome; the number is the pair.</p>
    </section>
  );
}
