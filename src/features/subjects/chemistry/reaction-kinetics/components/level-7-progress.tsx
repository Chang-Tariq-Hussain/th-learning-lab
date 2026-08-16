"use client";

import { useState } from "react";
import { ReactionChamber } from "./reaction-chamber";
import { ProgressGraph } from "./progress-graph";
import { COLOR_A, COLOR_PRODUCT } from "../model";
import type { ChamberStats } from "../types";

const NUM_A = 6;
const NUM_B = 6;
const MAX_PRODUCT = (NUM_A + NUM_B) / 2;

/** Level 7 — connecting particle-level behaviour to the macroscopic reactants-down / products-up picture. */
export function Level7Progress() {
  const [stats, setStats] = useState<ChamberStats | null>(null);
  const productCount = stats?.productCount ?? 0;
  const reactantFraction = 1 - productCount / MAX_PRODUCT;
  const productFraction = productCount / MAX_PRODUCT;

  return (
    <div className="flex flex-col gap-5">
      <p className="max-w-2xl text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        As the reaction proceeds, reactants are used up while products build up. The bars below track that
        macroscopic picture, driven by the same chamber you&apos;ve been watching.
      </p>

      <ReactionChamber numA={NUM_A} numB={NUM_B} tempC={55} label="Reaction Chamber" onStats={setStats} />

      <div className="flex flex-col gap-3 rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03] sm:p-5">
        <div>
          <div className="flex items-center justify-between text-xs font-medium text-ink-soft dark:text-bone-soft">
            <span>Reactants</span>
          </div>
          <div className="mt-1 h-4 w-full overflow-hidden rounded-full bg-ink/[0.06] dark:bg-bone/[0.08]">
            <div
              className="h-4 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(reactantFraction, 0) * 100}%`, background: COLOR_A }}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs font-medium text-ink-soft dark:text-bone-soft">
            <span>Products</span>
          </div>
          <div className="mt-1 h-4 w-full overflow-hidden rounded-full bg-ink/[0.06] dark:bg-bone/[0.08]">
            <div
              className="h-4 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(productFraction, 1) * 100}%`, background: COLOR_PRODUCT }}
            />
          </div>
        </div>
      </div>

      <ProgressGraph data={stats?.history ?? [{ t: 0, product: 0 }]} maxProduct={MAX_PRODUCT} />
    </div>
  );
}
