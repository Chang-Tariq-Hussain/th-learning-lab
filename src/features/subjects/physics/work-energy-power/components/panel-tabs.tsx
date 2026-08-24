"use client";

export type WepPanel = "work" | "energy" | "power";

const PANELS: { id: WepPanel; label: string }[] = [
  { id: "work", label: "Work" },
  { id: "energy", label: "Energy" },
  { id: "power", label: "Power" },
];

export interface PanelTabsProps {
  active: WepPanel;
  onChange: (panel: WepPanel) => void;
}

/** Three-way tab switcher, same visual language as the rest of the
 *  lab (rounded pill group) rather than reaching for a new tab
 *  primitive — this is the only place in the simulation that needs one. */
export function PanelTabs({ active, onChange }: PanelTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Work, Energy, or Power"
      className="flex w-full max-w-md gap-1 rounded-full border border-line bg-white/70 p-1 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]"
    >
      {PANELS.map((panel) => {
        const isActive = panel.id === active;
        return (
          <button
            key={panel.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(panel.id)}
            className={`flex-1 rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
              isActive
                ? "bg-subject-physics text-white shadow-sm"
                : "text-ink-soft hover:bg-ink/[0.04] dark:text-bone-soft dark:hover:bg-bone/[0.06]"
            }`}
          >
            {panel.label}
          </button>
        );
      })}
    </div>
  );
}
