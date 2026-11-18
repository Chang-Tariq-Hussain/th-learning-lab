"use client";

import type { BeatClock } from "../../meiosis/hooks/use-beat-timeline";
import { useClockPos } from "../../meiosis/hooks/use-beat-timeline";
import { lerp, ramp } from "../../cellular-energy-shared/style";
import { AtpGlyph, Chip, Label } from "../../cellular-energy-shared/svg-bits";

export type SystemPart = "nutrient" | "cytoplasm" | "mitochondrion" | "atp" | "work" | "heat";
const W = 960;
const H = 540;

/** Large cell overview: nutrients in, mitochondrion, ATP made and spent, heat lost. Driven by the 5-beat clock; parts are selectable. */
export function EnergySystemStage({ clock, showLabels, selected, onPick }: { clock: BeatClock; showLabels: boolean; selected: SystemPart | null; onPick: (p: SystemPart) => void }) {
  const pos = useClockPos(clock);
  const enter = ramp(pos, 0.5, 1.3);
  const split = ramp(pos, 1.3, 1.8);
  const toMito = ramp(pos, 1.8, 2.5);
  const co2 = ramp(pos, 2.3, 3.0);
  const o2 = ramp(pos, 1.9, 2.6);
  const carriers = ramp(pos, 2.4, 3.0) * (1 - ramp(pos, 3.6, 4.0));
  const atpMade = ramp(pos, 3.0, 3.7);
  const atpOut = ramp(pos, 3.7, 4.5);
  const heat = ramp(pos, 2.2, 4.4);
  const pulse = pos >= 2 && pos <= 4 ? 1 : 0;
  const hit = (id: SystemPart) => ({
    className: "ce-hit",
    role: "button" as const,
    tabIndex: 0,
    "aria-pressed": selected === id,
    "data-part": id,
    onClick: () => onPick(id),
    onKeyDown: (e: React.KeyboardEvent) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onPick(id)),
  });
  const ring = (id: SystemPart) => (selected === id ? { stroke: "var(--ce-sel)", strokeWidth: 6 } : { stroke: "var(--ce-line)", strokeWidth: 3 });

  const work = [
    { id: "pump", x: 300, y: 465, label: "Active transport" },
    { id: "move", x: 520, y: 98, label: "Movement" },
    { id: "synth", x: 790, y: 440, label: "Biosynthesis" },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="group" aria-label="The cellular energy system: nutrients enter the cell, mitochondria transform their energy into ATP, and ATP powers work while some energy is lost as heat." data-testid="system-svg">
      <defs>
        <radialGradient id="ce-sys-bg" cx="50%" cy="40%" r="85%">
          <stop offset="0%" stopColor="var(--ce-field-a)" />
          <stop offset="100%" stopColor="var(--ce-field-b)" />
        </radialGradient>
        <radialGradient id="ce-sys-cyto" cx="45%" cy="40%" r="75%">
          <stop offset="0%" stopColor="var(--ce-cyto-a)" />
          <stop offset="100%" stopColor="var(--ce-cyto-b)" />
        </radialGradient>
        <linearGradient id="ce-sys-mito" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--ce-mito-a)" />
          <stop offset="100%" stopColor="var(--ce-mito-b)" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} rx={18} fill="url(#ce-sys-bg)" />

      {/* cell */}
      <g {...hit("cytoplasm")}>
        <ellipse cx={500} cy={285} rx={405} ry={215} fill="url(#ce-sys-cyto)" {...ring("cytoplasm")} />
      </g>
      {showLabels ? <Label x={230} y={160} size={17}>Cytoplasm</Label> : null}

      {/* nutrient outside */}
      <g {...hit("nutrient")} opacity={1 - ramp(pos, 3.4, 3.9) * 0.0}>
        <g transform={`translate(${lerp(52, 250, enter)} ${lerp(110, 255, enter)})`} opacity={1 - split}>
          <polygon points="-24,0 -12,-21 12,-21 24,0 12,21 -12,21" fill="var(--ce-fuel)" {...ring("nutrient")} />
          <text y={5} textAnchor="middle" fontSize={13} fontWeight={800} fill="#0b1f08">Glucose</text>
        </g>
      </g>
      {pos < 0.5 && showLabels ? <Label x={120} y={170} size={15}>nutrients: stored chemical energy</Label> : null}
      {/* pyruvate */}
      {split > 0 ? [0, 1].map((i) => <Chip key={i} x={lerp(250, 470, toMito)} y={lerp(255, 290, toMito) + (i - 0.5) * 36 * (1 - toMito * 0.4)} r={15} color="var(--ce-fuel)" text="Pyr" fs={11} op={split * (1 - ramp(pos, 2.4, 2.8))} />) : null}

      {/* mitochondrion */}
      <g {...hit("mitochondrion")}>
        <rect x={470} y={210} width={260} height={150} rx={75} fill="url(#ce-sys-mito)" {...ring("mitochondrion")} className={pulse ? "ce-pulse" : undefined} />
        <path d="M 520 235 q 14 40 0 80 M 560 222 q 14 54 0 110 M 600 232 q 14 44 0 90 M 640 222 q 14 54 0 110 M 680 235 q 14 40 0 80" fill="none" stroke="var(--ce-membrane)" strokeWidth={4} strokeLinecap="round" opacity={0.7} />
      </g>
      {showLabels ? <Label x={600} y={392} size={17}>Mitochondrion</Label> : null}

      {/* O2 in, CO2 out */}
      <Chip x={lerp(620, 600, o2)} y={lerp(525, 340, o2)} r={14} color="var(--ce-o2)" text="O₂" fs={11} op={ramp(pos, 1.9, 2.2) * (1 - ramp(pos, 2.7, 3.0))} />
      {[0, 1].map((i) => <Chip key={i} x={lerp(660 + i * 30, 880 + i * 20, co2)} y={lerp(270, 190 - i * 30, co2)} r={14} color="var(--ce-co2)" text="CO₂" fs={10} op={co2 * (1 - ramp(pos, 4.2, 4.6))} />)}

      {/* electron carriers */}
      {carriers > 0 ? [0, 1, 2].map((i) => <Chip key={i} x={560 + i * 46} y={286 + (i % 2 ? 22 : -22)} r={13} color="var(--ce-nadh)" text="NADH" fs={7.5} op={carriers} />) : null}

      {/* ATP made / used */}
      {atpMade > 0 ? [0, 1, 2].map((i) => {
        const w = work[i]!;
        const sx = 600 + i * 40;
        const sy = 300;
        return (
          <g key={i} transform={`translate(${lerp(sx, w.x, atpOut)} ${lerp(sy, w.y, atpOut)})`} opacity={atpMade * (1 - ramp(pos, 4.6, 4.95) * 0.0)} {...(i === 0 ? hit("atp") : {})}>
            <circle r={19} fill="var(--ce-atp)" {...ring("atp")} />
            <text y={5} textAnchor="middle" fontSize={13} fontWeight={800} fill="#1a1204">ATP</text>
          </g>
        );
      }) : null}

      {/* work stations */}
      {work.map((w) => (
        <g key={w.id} {...hit("work")} opacity={0.55 + 0.45 * atpOut}>
          <rect x={w.x - 70} y={w.y - 24} width={140} height={48} rx={14} fill="var(--ce-work)" fillOpacity={0.22 + 0.3 * atpOut} {...ring("work")} />
          <text x={w.x} y={w.y + 6} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--ce-ink)">{w.label}</text>
        </g>
      ))}
      {/* ADP back */}
      {atpOut > 0.6 ? <Chip x={680} y={380} r={14} color="var(--ce-adp)" text="ADP" fs={10} op={(atpOut - 0.6) / 0.4} /> : null}

      {/* heat */}
      <g {...hit("heat")} opacity={heat}>
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${760 + i * 26} 215 q 10 -14 0 -28 q -10 -14 0 -28`} fill="none" stroke="var(--ce-adp)" strokeWidth={5} strokeLinecap="round" className="ce-flow" />)}
        {showLabels ? <Label x={810} y={150} size={17}>Heat (some energy lost)</Label> : null}
      </g>

      {/* energy-flow arrows */}
      <path d="M 285 262 C 360 262, 400 272, 462 285" fill="none" stroke="var(--ce-fuel)" strokeWidth={5} className="ce-flow" opacity={0.45 + 0.4 * ramp(pos, 1.5, 2.5)} />
      <path d={`M 680 300 C 720 360, 800 400, 735 ${430}`} fill="none" stroke="var(--ce-atp)" strokeWidth={5} className="ce-flow" opacity={atpMade * 0.7} />
      {showLabels ? (
        <g>
          <Label x={480} y={522} size={16} weight={500}>fuel energy → ATP → work (and heat)</Label>
          <Label x={atpOut > 0.3 ? 560 : 600} y={196} size={16} op={atpMade * 0.9}>ATP (usable energy)</Label>
        </g>
      ) : null}
      <g opacity={ramp(pos, 3.9, 4.5)}>
        <AtpGlyph x={160} y={510} k={0.9} />
        <Label x={160} y={534} size={13} weight={500}>ATP → ADP + Pi at the work site</Label>
      </g>
    </svg>
  );
}
