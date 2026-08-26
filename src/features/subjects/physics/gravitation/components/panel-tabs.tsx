"use client";

export type GravitationPanel = "force-lab" | "orbit";

const PANELS: { id: GravitationPanel; label: string }[] = [
  { id: "force-lab", label: "Force Lab" },
  { id: "orbit", label: "Orbit" },
];

export interface PanelTabsProps {
  active: GravitationPanel;
  onChange: (panel: GravitationPanel) => void;
}

/** Two-way tab switcher, same rounded-pill visual language as `work-energy-power/components/panel-tabs.tsx` — reusing that pattern rather than introducing a new tab primitive. */
export function PanelTabs({ active, onChange }: PanelTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Force Lab or Orbit"
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
