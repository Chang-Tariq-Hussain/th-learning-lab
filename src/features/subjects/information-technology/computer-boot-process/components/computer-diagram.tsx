"use client";

import { cn } from "@/lib/utils";
import type { BootStageId } from "../model";

type Zone = "power" | "firmware" | "storage" | "memory-cpu" | "screen";

/** Which hardware zone of the simplified computer cross-section lights
 *  up for each stage. Several early stages (firmware, POST, hardware
 *  init, boot device selection) all live in the firmware zone — they're
 *  distinguished by their own text/description, not by separate art. */
const STAGE_ZONE: Record<BootStageId, Zone> = {
  "power-on": "power",
  firmware: "firmware",
  post: "firmware",
  "hardware-init": "firmware",
  "boot-device": "storage",
  bootloader: "storage",
  "os-loading": "memory-cpu",
  kernel: "memory-cpu",
  "login-desktop": "screen",
};

export function computerZoneForStage(stageId: BootStageId): Zone {
  return STAGE_ZONE[stageId];
}

export interface ComputerDiagramProps {
  activeStageId: BootStageId | null;
}

/** A lightweight 2.5D cross-section of a computer tower — flat shapes
 *  with a soft gradient and drop shadow for a sense of depth, not a 3D
 *  model. Only the zone relevant to the active stage glows, so a
 *  student always has a concrete "where in the machine is this
 *  happening" anchor alongside the more abstract stage timeline. */
export function ComputerDiagram({ activeStageId }: ComputerDiagramProps) {
  const activeZone = activeStageId ? STAGE_ZONE[activeStageId] : null;
  const isActive = (zone: Zone) => zone === activeZone;

  return (
    <svg viewBox="0 0 320 220" className="mx-auto h-56 w-full max-w-sm" role="img" aria-label="Simplified computer tower cross-section">
      <defs>
        <linearGradient id="case-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.06" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.12" />
        </linearGradient>
      </defs>

      {/* Case outline */}
      <rect x="10" y="10" width="300" height="200" rx="14" className="fill-[url(#case-gradient)] text-ink stroke-ink/25 dark:text-bone dark:stroke-bone/25" strokeWidth="2" />

      {/* Power supply */}
      <g>
        <rect
          x="24" y="24" width="70" height="40" rx="6"
          className={cn("transition-colors", isActive("power") ? "fill-subject-it stroke-subject-it" : "fill-transparent stroke-ink/30 dark:stroke-bone/30")}
          strokeWidth="2"
        />
        <text x="59" y="48" textAnchor="middle" className={cn("select-none font-mono text-[9px]", isActive("power") ? "fill-paper" : "fill-ink-soft dark:fill-bone-soft")}>PSU</text>
      </g>

      {/* Firmware chip */}
      <g>
        <rect
          x="112" y="24" width="90" height="40" rx="6"
          className={cn("transition-colors", isActive("firmware") ? "fill-subject-it stroke-subject-it" : "fill-transparent stroke-ink/30 dark:stroke-bone/30")}
          strokeWidth="2"
        />
        <text x="157" y="48" textAnchor="middle" className={cn("select-none font-mono text-[9px]", isActive("firmware") ? "fill-paper" : "fill-ink-soft dark:fill-bone-soft")}>Firmware</text>
      </g>

      {/* Screen indicator */}
      <g>
        <rect
          x="220" y="24" width="76" height="40" rx="6"
          className={cn("transition-colors", isActive("screen") ? "fill-subject-it stroke-subject-it" : "fill-transparent stroke-ink/30 dark:stroke-bone/30")}
          strokeWidth="2"
        />
        <text x="258" y="48" textAnchor="middle" className={cn("select-none font-mono text-[9px]", isActive("screen") ? "fill-paper" : "fill-ink-soft dark:fill-bone-soft")}>Display</text>
      </g>

      {/* CPU + RAM */}
      <g>
        <rect
          x="24" y="88" width="130" height="52" rx="6"
          className={cn("transition-colors", isActive("memory-cpu") ? "fill-subject-it stroke-subject-it" : "fill-transparent stroke-ink/30 dark:stroke-bone/30")}
          strokeWidth="2"
        />
        <text x="89" y="118" textAnchor="middle" className={cn("select-none font-mono text-[9px]", isActive("memory-cpu") ? "fill-paper" : "fill-ink-soft dark:fill-bone-soft")}>CPU + RAM</text>
      </g>

      {/* Storage */}
      <g>
        <rect
          x="170" y="88" width="126" height="52" rx="6"
          className={cn("transition-colors", isActive("storage") ? "fill-subject-it stroke-subject-it" : "fill-transparent stroke-ink/30 dark:stroke-bone/30")}
          strokeWidth="2"
        />
        <text x="233" y="118" textAnchor="middle" className={cn("select-none font-mono text-[9px]", isActive("storage") ? "fill-paper" : "fill-ink-soft dark:fill-bone-soft")}>Storage</text>
      </g>

      {/* Base label */}
      <text x="160" y="196" textAnchor="middle" className="select-none fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">
        simplified cross-section — not a literal internal layout
      </text>
    </svg>
  );
}
