"use client";

import { useState } from "react";
import { ReactionChamber } from "./reaction-chamber";
import { ProgressGraph } from "./progress-graph";
import { FactorSummaryTable } from "./factor-summary-table";
import { Badge } from "@/components/ui/badge";
import type { ChamberStats } from "../types";

const NUM_A = 5;
const NUM_B = 5;
const MAX_PRODUCT = (NUM_A + NUM_B) / 2;

/** Level 8 — two chambers run side by side under different conditions, with a shared comparison graph. */
export function Level8Compare() {
  const [statsA, setStatsA] = useState<ChamberStats | null>(null);
  const [statsB, setStatsB] = useState<ChamberStats | null>(null);

  const productA = statsA?.productCount ?? 0;
  const productB = statsB?.productCount ?? 0;
  const faster = productA === productB ? null : productA > productB ? "A" : "B";

  return (
    <div className="flex flex-col gap-5">
      <p className="max-w-2xl text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Run two experiments side by side. Experiment B has a higher temperature and concentration than
        Experiment A — watch which one forms product faster.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <ReactionChamber numA={NUM_A} numB={NUM_B} tempC={35} label="Experiment A · Normal Conditions" onStats={setStatsA} />
          {faster === "A" ? (
            <Badge className="mx-auto border-[#5A9E6F]/40 text-[#3F7A54] dark:text-[#8FCBA4]">Faster Reaction</Badge>
          ) : faster === "B" ? (
            <Badge className="mx-auto">Slower Reaction</Badge>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <ReactionChamber numA={NUM_A + 3} numB={NUM_B + 3} tempC={90} label="Experiment B · Increased Temp & Concentration" onStats={setStatsB} />
          {faster === "B" ? (
            <Badge className="mx-auto border-[#5A9E6F]/40 text-[#3F7A54] dark:text-[#8FCBA4]">Faster Reaction</Badge>
          ) : faster === "A" ? (
            <Badge className="mx-auto">Slower Reaction</Badge>
          ) : null}
        </div>
      </div>

      <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03] sm:p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">Product vs Time</p>
        <div className="mt-2">
          <ProgressGraph
            data={statsA?.history ?? [{ t: 0, product: 0 }]}
            compareData={statsB?.history}
            maxProduct={Math.max(MAX_PRODUCT, (NUM_A + 3 + NUM_B + 3) / 2)}
            primaryLabel="Experiment A"
            compareLabel="Experiment B"
          />
        </div>
      </div>

      <FactorSummaryTable />
    </div>
  );
}
