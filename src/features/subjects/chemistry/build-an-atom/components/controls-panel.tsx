"use client";

import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { LIMITS, canChange, type ParticleKey } from "../atom-model";

interface ControlsPanelProps {
  onChange: (
    particle: "proton" | "neutron" | "electron",
    delta: 1 | -1,
  ) => void;
  protons: number;
  neutrons: number;
  electrons: number;
}

const rows: {
  key: "proton" | "neutron" | "electron";
  label: string;
  color: string;
  limitKey: ParticleKey;
}[] = [
  { key: "proton", label: "Proton", color: "#E0524F", limitKey: "protons" },
  { key: "neutron", label: "Neutron", color: "#8B95A1", limitKey: "neutrons" },
  { key: "electron", label: "Electron", color: "#3D5AFE", limitKey: "electrons" },
];

/** Six large, unambiguous buttons: add or remove each particle. They disable at the limits, so no count can go out of range. */
export function ControlsPanel({
  onChange,
  protons,
  neutrons,
  electrons,
}: ControlsPanelProps) {
  const counts = { proton: protons, neutron: neutrons, electron: electrons };
  const atom = { protons, neutrons, electrons };

  return (
    <div role="group" aria-label="Particle counts" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {rows.map((row) => (
        <div
          key={row.key}
          className="flex flex-col gap-2 rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]"
        >
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: row.color }}
            />
            <span className="font-display text-sm font-medium text-ink dark:text-bone">
              {row.label}s
            </span>
            <span className="ml-auto font-mono text-sm text-ink dark:text-bone" aria-live="polite" aria-label={`${counts[row.key]} ${row.label.toLowerCase()}s`}>
              {counts[row.key]}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onChange(row.key, 1)}
              disabled={!canChange(atom, row.limitKey, 1)}
              title={canChange(atom, row.limitKey, 1) ? `Add a ${row.label.toLowerCase()}` : `Maximum ${LIMITS[row.limitKey].max} ${row.label.toLowerCase()}s in this lab`}
              aria-label={`Add a ${row.label.toLowerCase()}`}
              className={cn(
                "flex h-14 items-center justify-center gap-1.5 rounded-lg text-base font-semibold text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-30",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:focus-visible:ring-offset-chalkboard",
              )}
              style={{ backgroundColor: row.color }}
            >
              <Plus className="h-5 w-5" strokeWidth={2.5} />
              {/* {row.label} */}
            </button>
            <button
              type="button"
              onClick={() => onChange(row.key, -1)}
              disabled={!canChange(atom, row.limitKey, -1)}
              title={canChange(atom, row.limitKey, -1) ? `Remove a ${row.label.toLowerCase()}` : row.key === "proton" ? "An atom needs at least one proton" : `No ${row.label.toLowerCase()}s left to remove`}
              aria-label={`Remove a ${row.label.toLowerCase()}`}
              className="flex h-14 items-center justify-center gap-1.5 rounded-lg border-2 text-base font-semibold transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:focus-visible:ring-offset-chalkboard"
              style={{ borderColor: row.color, color: row.color }}
            >
              <Minus className="h-5 w-5" strokeWidth={2.5} />
              {/* {row.label} */}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
