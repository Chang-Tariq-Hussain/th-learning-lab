"use client";

import { useState } from "react";
import { ReactionChamber } from "./reaction-chamber";
import { StatReadout } from "./stat-readout";
import { ProgressGraph } from "./progress-graph";
import { COLOR_A, COLOR_B, COLOR_PRODUCT } from "../model";
import type { ChamberStats } from "../types";

const NUM_A = 6;
const NUM_B = 6;
const TOTAL = NUM_A + NUM_B;

/** Level 1 — the reaction chamber itself: reactants drift, collide, and some become product. */
export function Level1Rate() {
  const [stats, setStats] = useState<ChamberStats | null>(null);
  const progress = stats ? Math.round((stats.productCount / (TOTAL / 2)) * 100) : 0;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          Every reaction starts the same way: reactant particles moving around a shared space, occasionally
          bumping into each other. When a collision works out, the particles combine into something new.
        </p>
        <p className="mt-2 flex flex-wrap items-center gap-1.5 font-mono text-sm text-ink dark:text-bone">
          <span className="rounded-full px-2 py-0.5 text-white" style={{ background: COLOR_A }}>A</span>
          <span>+</span>
          <span className="rounded-full px-2 py-0.5 text-white" style={{ background: COLOR_B }}>B</span>
          <span>→</span>
          <span className="rounded-full px-2 py-0.5 text-white" style={{ background: COLOR_PRODUCT }}>AB</span>
        </p>
      </div>

      <ReactionChamber numA={NUM_A} numB={NUM_B} tempC={55} label="Reaction Chamber" onStats={setStats} />

      <StatReadout
        items={[
          { label: "Reactant Particles", value: stats?.reactantsRemaining ?? TOTAL },
          { label: "Product Particles", value: stats?.productCount ?? 0, accent: COLOR_PRODUCT },
          { label: "Successful Collisions", value: stats?.successfulCollisions ?? 0, accent: "#5A9E6F" },
          { label: "Reaction Progress", value: `${Math.min(progress, 100)}%` },
        ]}
      />

      <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03] sm:p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">Reaction rate</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          Reaction rate describes how quickly reactants are converted into products —
          conceptually, <span className="font-mono text-ink dark:text-bone">rate = change in product ÷ change in time</span>.
          The graph below tracks that conversion as it happens.
        </p>
        <div className="mt-3">
          <ProgressGraph data={stats?.history ?? [{ t: 0, product: 0 }]} maxProduct={TOTAL / 2} />
        </div>
      </div>
    </div>
  );
}
