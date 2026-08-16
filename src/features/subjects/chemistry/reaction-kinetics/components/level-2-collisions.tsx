"use client";

import { useState } from "react";
import { ReactionChamber } from "./reaction-chamber";
import { StatReadout } from "./stat-readout";
import type { ChamberStats } from "../types";

const NUM_A = 5;
const NUM_B = 5;

/** Level 2 — collision theory, in general: reaction only happens through collisions. */
export function Level2Collisions() {
  const [stats, setStats] = useState<ChamberStats | null>(null);

  return (
    <div className="flex flex-col gap-5">
      <p className="max-w-2xl text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Before any product can form, particles have to physically collide with each other. Watch the chamber below
        — every reaction that happens starts with two particles meeting.
      </p>

      <ReactionChamber numA={NUM_A} numB={NUM_B} tempC={55} label="Watch the Collisions" onStats={setStats} />

      <StatReadout
        items={[
          { label: "Total Collisions", value: (stats?.successfulCollisions ?? 0) + (stats?.failedCollisions ?? 0) },
          { label: "Successful", value: stats?.successfulCollisions ?? 0, accent: "#5A9E6F" },
          { label: "Unsuccessful", value: stats?.failedCollisions ?? 0, accent: "#B24A3D" },
          { label: "Products So Far", value: stats?.productCount ?? 0 },
        ]}
      />

      <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03] sm:p-5">
        <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          Not every collision leads to a reaction, though — that&apos;s what the next level looks at.
        </p>
      </div>
    </div>
  );
}
