import { cn } from "@/lib/utils";

const ITEMS = [
  { id: "proton", label: "Proton", symbol: "+", charge: "charge +1", color: "#E0524F" },
  { id: "neutron", label: "Neutron", symbol: "0", charge: "no charge", color: "#8B95A1" },
  { id: "electron", label: "Electron", symbol: "−", charge: "charge −1", color: "#3D5AFE" },
] as const;

/** Colour and symbol key for the three particles. `compact` is the one-line version drawn over the stage. */
export function ParticleLegend({ compact = false, className }: { compact?: boolean; className?: string }) {
  if (compact) {
    return (
      <ul aria-label="Particle key" className={cn("flex flex-wrap items-center gap-x-3 gap-y-0.5 text-label text-ink dark:text-bone", className)}>
        {ITEMS.map((i) => (
          <li key={i.id} className="flex items-center gap-1">
            <span aria-hidden="true" className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: i.color }} />
            <span>
              {i.label} <span className="font-mono">{i.symbol}</span>
            </span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul aria-label="Particle key" className={cn("grid gap-2 sm:grid-cols-3", className)}>
      {ITEMS.map((i) => (
        <li key={i.id} className="flex items-center gap-3 rounded-lg border border-line px-3 py-2 dark:border-line-dark">
          <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold text-white" style={{ backgroundColor: i.color }}>
            {i.symbol}
          </span>
          <span className="text-sm text-ink dark:text-bone">
            <span className="font-medium">{i.label}</span>
            <span className="block text-helper text-ink-soft dark:text-bone-soft">{i.charge}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
