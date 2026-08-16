"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { ReactionChamber } from "./reaction-chamber";
import { StatReadout } from "./stat-readout";
import type { ChamberStats } from "../types";

const NUM_A = 5;
const NUM_B = 5;

/** Level 3 — the ✓/✗ distinction between successful and unsuccessful collisions. */
export function Level3Successful() {
  const [stats, setStats] = useState<ChamberStats | null>(null);
  const total = (stats?.successfulCollisions ?? 0) + (stats?.failedCollisions ?? 0);
  const successPct = total > 0 ? Math.round(((stats?.successfulCollisions ?? 0) / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-5">
      <p className="max-w-2xl text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Particles must collide in a suitable way and with enough energy for a reaction to occur. Watch for the{" "}
        <Check className="inline h-4 w-4 -translate-y-0.5 text-[#5A9E6F]" strokeWidth={2.5} /> and{" "}
        <X className="inline h-4 w-4 -translate-y-0.5 text-[#B24A3D]" strokeWidth={2.5} /> marks appearing on collisions below.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-start gap-3 rounded-card border border-[#5A9E6F]/30 bg-[#5A9E6F]/10 p-4">
          <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#5A9E6F]" strokeWidth={2} />
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#3F7A54]">Successful collision</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
              Enough energy and the right orientation — the particles combine into product.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-card border border-[#B24A3D]/30 bg-[#B24A3D]/10 p-4">
          <X className="mt-0.5 h-5 w-5 shrink-0 text-[#B24A3D]" strokeWidth={2} />
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#B24A3D]">Unsuccessful collision</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
              Not enough energy, or a poor orientation — the particles simply bounce apart.
            </p>
          </div>
        </div>
      </div>

      <ReactionChamber numA={NUM_A} numB={NUM_B} tempC={55} label="Live Chamber" onStats={setStats} />

      <StatReadout
        items={[
          { label: "Successful", value: stats?.successfulCollisions ?? 0, accent: "#5A9E6F" },
          { label: "Unsuccessful", value: stats?.failedCollisions ?? 0, accent: "#B24A3D" },
          { label: "Success Rate", value: `${successPct}%` },
          { label: "Products Formed", value: stats?.productCount ?? 0 },
        ]}
      />
    </div>
  );
}
