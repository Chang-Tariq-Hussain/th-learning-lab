"use client";

import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

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
}[] = [
  { key: "proton", label: "Proton", color: "#E0524F" },
  { key: "neutron", label: "Neutron", color: "#8B95A1" },
  { key: "electron", label: "Electron", color: "#3D5AFE" },
];

/** Six large, unambiguous buttons — the entire interaction surface of this toy. No sliders, no menus. */
export function ControlsPanel({
  onChange,
  protons,
  neutrons,
  electrons,
}: ControlsPanelProps) {
  const counts = { proton: protons, neutron: neutrons, electron: electrons };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
            <span className="ml-auto font-mono text-sm text-ink-soft dark:text-bone-soft">
              {counts[row.key]}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onChange(row.key, 1)}
              aria-label={`Add a ${row.label.toLowerCase()}`}
              className={cn(
                "flex h-14 items-center justify-center gap-1.5 rounded-lg text-base font-semibold text-white transition-transform active:scale-95",
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
              disabled={counts[row.key] <= 0}
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
