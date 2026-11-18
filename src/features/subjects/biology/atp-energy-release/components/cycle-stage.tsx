"use client";

import type { BeatClock } from "../../meiosis/hooks/use-beat-timeline";
import { useClockPos } from "../../meiosis/hooks/use-beat-timeline";
import { ramp } from "../../cellular-energy-shared/style";
import { AtpGlyph, Chip, Label } from "../../cellular-energy-shared/svg-bits";

const W = 960;
const H = 540;
const CX = 480;
const CY = 275;
const RX = 270;
const RY = 165;
const rad = (d: number) => (d * Math.PI) / 180;

/** Position of the travelling token around the loop for beat position `pos` (0–4). */
export function loopPoint(pos: number): { x: number; y: number } {
  const p = Math.min(4, Math.max(0, pos));
  const a = p <= 2 ? -90 - 180 * (p / 2) : 90 - 180 * ((p - 2) / 2);
  return { x: CX + RX * Math.cos(rad(a)), y: CY + RY * Math.sin(rad(a)) };
}

export function CycleStage({ clock, showLabels, supply, demand, fraction }: { clock: BeatClock; showLabels: boolean; supply: number; demand: number; fraction: number }) {
  const pos = useClockPos(clock);
  const t = loopPoint(pos);
  const atp = pos < 0.5 || pos >= 3.5;
  const workGlow = ramp(pos, 0.5, 1) * (1 - ramp(pos, 1.5, 2));
  const energyGlow = ramp(pos, 2.5, 3) * (1 - ramp(pos, 3.5, 4));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="The ATP cycle: ATP is hydrolysed to ADP and Pi releasing energy for work, and ADP and Pi are recombined using an energy input." data-testid="cycle-svg">
      <defs>
        <radialGradient id="ce-cyc-bg" cx="50%" cy="40%" r="80%">
          <stop offset="0%" stopColor="var(--ce-field-a)" />
          <stop offset="100%" stopColor="var(--ce-field-b)" />
        </radialGradient>
        <marker id="ce-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--ce-ink)" />
        </marker>
      </defs>
      <rect width={W} height={H} rx={18} fill="url(#ce-cyc-bg)" />

      {/* arcs */}
      <path d={`M ${CX - 40} ${CY - RY} A ${RX} ${RY} 0 0 0 ${CX - 40} ${CY + RY}`} fill="none" stroke="var(--ce-adp)" strokeWidth={6} className="ce-flow" markerEnd="url(#ce-arrow)" opacity={0.85} />
      <path d={`M ${CX + 40} ${CY + RY} A ${RX} ${RY} 0 0 0 ${CX + 40} ${CY - RY}`} fill="none" stroke="var(--ce-fuel)" strokeWidth={6} className="ce-flow" markerEnd="url(#ce-arrow)" opacity={0.85} />

      {/* ATP node (top) and ADP + Pi node (bottom) */}
      <g>
        <rect x={CX - 100} y={CY - RY - 40} width={200} height={80} rx={18} fill="var(--ce-halo)" fillOpacity={0.7} stroke="var(--ce-atp)" strokeWidth={3} />
        <AtpGlyph x={CX} y={CY - RY - 8} k={1.25} />
        <Label x={CX} y={CY - RY + 28} size={16}>ATP (energy-rich carrier)</Label>
        <rect x={CX - 120} y={CY + RY - 40} width={240} height={80} rx={18} fill="var(--ce-halo)" fillOpacity={0.7} stroke="var(--ce-adp)" strokeWidth={3} />
        <AtpGlyph x={CX - 36} y={CY + RY - 8} k={1.05} phosphates={2} />
        <Chip x={CX + 78} y={CY + RY - 8} r={15} color="var(--ce-pi)" text="Pi" />
        <Label x={CX} y={CY + RY + 28} size={16}>ADP + Pi (spent)</Label>
      </g>

      {/* left: work. right: energy input */}
      <g opacity={0.45 + 0.55 * workGlow}>
        <rect x={30} y={CY - 70} width={190} height={140} rx={16} fill="var(--ce-work)" fillOpacity={0.15 + 0.3 * workGlow} stroke="var(--ce-work)" strokeWidth={3} />
        <Label x={125} y={CY - 36} size={18} weight={800}>Cellular work</Label>
        <Label x={125} y={CY - 10} size={14}>pumps · muscle</Label>
        <Label x={125} y={CY + 10} size={14}>biosynthesis · movement</Label>
        <Label x={125} y={CY + 44} size={14}>ΔG &lt; 0: energy OUT</Label>
      </g>
      <g opacity={0.45 + 0.55 * energyGlow}>
        <rect x={740} y={CY - 70} width={190} height={140} rx={16} fill="var(--ce-fuel)" fillOpacity={0.15 + 0.3 * energyGlow} stroke="var(--ce-fuel)" strokeWidth={3} />
        <Label x={835} y={CY - 36} size={18} weight={800}>Energy input</Label>
        <Label x={835} y={CY - 10} size={14}>cellular respiration</Label>
        <Label x={835} y={CY + 10} size={14}>(light, in plants)</Label>
        <Label x={835} y={CY + 44} size={14}>ΔG &gt; 0: energy IN</Label>
      </g>

      {showLabels ? (
        <g>
          <Label x={CX - 170} y={CY - 100} size={17} anchor="middle">Hydrolysis</Label>
          <Label x={CX - 170} y={CY - 80} size={14} weight={500}>ATP + H₂O → ADP + Pi</Label>
          <Label x={CX + 170} y={CY + 118} size={17}>Regeneration</Label>
          <Label x={CX + 170} y={CY + 138} size={14} weight={500}>ADP + Pi → ATP + H₂O</Label>
          <Label x={CX} y={CY - 8} size={15} weight={500}>some free energy is lost as heat in every cycle</Label>
        </g>
      ) : null}

      {/* travelling token */}
      <g transform={`translate(${t.x} ${t.y})`} data-testid="cycle-token">
        {atp ? (
          <g>
            <circle r={26} fill="var(--ce-atp)" stroke="var(--ce-line)" strokeWidth={3} />
            <text y={6} textAnchor="middle" fontSize={17} fontWeight={800} fill="#1a1204">ATP</text>
          </g>
        ) : (
          <g>
            <circle cx={-14} r={22} fill="var(--ce-adp)" stroke="var(--ce-line)" strokeWidth={3} />
            <text x={-14} y={5} textAnchor="middle" fontSize={14} fontWeight={800} fill="#1a1204">ADP</text>
            <circle cx={24} cy={-8} r={13} fill="var(--ce-pi)" stroke="var(--ce-line)" strokeWidth={2} />
            <text x={24} y={-3} textAnchor="middle" fontSize={11} fontWeight={800} fill="#fff">Pi</text>
          </g>
        )}
      </g>

      {/* pool gauge */}
      <g transform="translate(40 40)">
        <Label x={0} y={0} anchor="start" size={15}>Adenine-nucleotide pool</Label>
        <rect x={0} y={10} width={220} height={20} rx={10} fill="var(--ce-adp)" fillOpacity={0.35} stroke="var(--ce-line)" strokeWidth={1.5} />
        <rect x={0} y={10} width={220 * fraction} height={20} rx={10} fill="var(--ce-atp)" stroke="var(--ce-line)" strokeWidth={1.5} data-testid="atp-bar" />
        <Label x={0} y={52} anchor="start" size={14} weight={500}>{`${Math.round(fraction * 100)}% ATP · ${100 - Math.round(fraction * 100)}% ADP + Pi (supply ${supply}, demand ${demand})`}</Label>
      </g>
    </svg>
  );
}
