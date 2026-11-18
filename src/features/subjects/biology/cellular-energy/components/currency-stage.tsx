"use client";

import { AtpGlyph, Chip, Label } from "../../cellular-energy-shared/svg-bits";

export const CURRENCY_STEPS = [
  { short: "Production", title: "ATP production (earning)", text: "Catabolism releases free energy from fuel. Part of it is used to join ADP and Pi into ATP (mostly by ATP synthase in mitochondria). This step needs energy input." },
  { short: "Hydrolysis", title: "ATP hydrolysis (spending)", text: "ATP + H₂O → ADP + Pi. The reaction has a negative ΔG and can be coupled to an energy-requiring process." },
  { short: "Recycling", title: "ADP recycling", text: "ADP and Pi are not used up: they return to the production step and are recharged. A cell turns its small ATP pool over many times a minute." },
  { short: "Coupling", title: "Energy coupling", text: "Hydrolysis alone only warms the cell. Coupling uses a shared intermediate (usually a phosphate transferred to a protein or substrate) so the free energy does work." },
] as const;

/** Compact currency diagram: earn (catabolism) → ATP ⇄ ADP + Pi → spend (work). The active step is outlined. */
export function CurrencyStage({ step }: { step: number }) {
  const on = (i: number) => (step === i ? { stroke: "var(--ce-sel)", strokeWidth: 7 } : { stroke: "var(--ce-line)", strokeWidth: 3 });
  return (
    <svg viewBox="0 0 960 540" className="h-full w-full" role="img" aria-label="ATP as an energy currency: catabolism earns ATP, cellular work spends it, and ADP plus Pi are recycled." data-testid="currency-svg">
      <defs>
        <radialGradient id="ce-cur-bg" cx="50%" cy="35%" r="85%">
          <stop offset="0%" stopColor="var(--ce-field-a)" />
          <stop offset="100%" stopColor="var(--ce-field-b)" />
        </radialGradient>
        <marker id="ce-cur-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--ce-ink)" />
        </marker>
      </defs>
      <rect width={960} height={540} rx={18} fill="url(#ce-cur-bg)" />

      <g>
        <rect x={40} y={170} width={230} height={200} rx={18} fill="var(--ce-fuel)" fillOpacity={0.22} {...on(0)} />
        <Label x={155} y={206} size={20} weight={800}>Catabolism</Label>
        <Label x={155} y={232} size={15} weight={500}>fuel + O₂ → CO₂ + H₂O</Label>
        <Label x={155} y={262} size={15} weight={500}>releases free energy</Label>
        <Chip x={155} y={312} r={28} color="var(--ce-fuel)" text="Fuel" fs={15} />
      </g>
      <g>
        <rect x={690} y={170} width={230} height={200} rx={18} fill="var(--ce-work)" fillOpacity={0.22} {...on(1)} />
        <Label x={805} y={206} size={20} weight={800}>Cellular work</Label>
        <Label x={805} y={232} size={15} weight={500}>transport · movement</Label>
        <Label x={805} y={254} size={15} weight={500}>biosynthesis</Label>
        <Label x={805} y={290} size={15} weight={500}>requires free energy</Label>
      </g>

      {/* ATP and ADP+Pi */}
      <g {...{}}>
        <rect x={355} y={110} width={250} height={90} rx={18} fill="var(--ce-halo)" fillOpacity={0.7} {...on(3)} />
        <AtpGlyph x={480} y={148} k={1.3} />
        <Label x={480} y={190} size={16}>ATP</Label>
      </g>
      <g>
        <rect x={335} y={340} width={290} height={90} rx={18} fill="var(--ce-halo)" fillOpacity={0.7} {...on(2)} />
        <AtpGlyph x={440} y={378} k={1.1} phosphates={2} />
        <Chip x={548} y={378} r={16} color="var(--ce-pi)" text="Pi" />
        <Label x={480} y={420} size={16}>ADP + Pi</Label>
      </g>

      {/* arrows */}
      <path d="M 270 300 C 330 330, 340 350, 360 372" fill="none" stroke="var(--ce-fuel)" strokeWidth={6} className="ce-flow" markerEnd="url(#ce-cur-arrow)" opacity={step === 0 ? 1 : 0.55} />
      <path d="M 400 340 C 370 280, 370 240, 400 202" fill="none" stroke="var(--ce-fuel)" strokeWidth={6} markerEnd="url(#ce-cur-arrow)" opacity={step === 0 || step === 2 ? 1 : 0.55} />
      <path d="M 560 202 C 600 240, 640 250, 690 262" fill="none" stroke="var(--ce-adp)" strokeWidth={6} className="ce-flow" markerEnd="url(#ce-cur-arrow)" opacity={step === 1 || step === 3 ? 1 : 0.55} />
      <path d="M 700 330 C 650 380, 640 390, 628 392" fill="none" stroke="var(--ce-adp)" strokeWidth={6} markerEnd="url(#ce-cur-arrow)" opacity={step === 1 || step === 2 ? 1 : 0.55} />
      <Label x={270} y={450} size={15} weight={500}>energy IN: ADP + Pi → ATP</Label>
      <Label x={700} y={450} size={15} weight={500}>energy OUT: ATP → ADP + Pi</Label>
      <Label x={480} y={500} size={16} weight={600}>A cell earns ATP in catabolism and spends it on work; the ADP and Pi are recycled.</Label>
    </svg>
  );
}
