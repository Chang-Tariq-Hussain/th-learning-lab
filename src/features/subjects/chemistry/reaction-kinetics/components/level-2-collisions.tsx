"use client";

import { useState } from "react";
import { ReactionChamber } from "./reaction-chamber";
import { ChamberLayout } from "./chamber-layout";
import { StatReadout } from "./stat-readout";
import type { ChamberStats } from "../types";

const NUM_A = 5;
const NUM_B = 5;

/** Level 2 — collision theory, in general: reaction only happens through collisions. */
export function Level2Collisions() {
  const [stats, setStats] = useState<ChamberStats | null>(null);

  return (
    <ChamberLayout
      stageLabel="Collision chamber"
      chambers={
        <ReactionChamber numA={NUM_A} numB={NUM_B} tempC={55} label="Watch the Collisions" onStats={setStats} />
      }
      readouts={[{ id: "r0", label: "Total Collisions", value: String((stats?.successfulCollisions ?? 0) + (stats?.failedCollisions ?? 0)) }, { id: "r1", label: "Successful", value: String(stats?.successfulCollisions ?? 0) }, { id: "r2", label: "Unsuccessful", value: String(stats?.failedCollisions ?? 0) }, { id: "r3", label: "Products So Far", value: String(stats?.productCount ?? 0) }]}
      controls={
        <div className="flex flex-col gap-5">
      <p className="max-w-2xl text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Before any product can form, particles have to physically collide with each other. Watch the chamber below
        — every reaction that happens starts with two particles meeting.
      </p>

      <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03] sm:p-5">
        <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          Not every collision leads to a reaction, though — that&apos;s what the next level looks at.
        </p>
      </div>
        </div>
      }
    />
  );
}
