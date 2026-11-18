"use client";

import type { BeatClock } from "../../meiosis/hooks/use-beat-timeline";
import { useClockPos } from "../../meiosis/hooks/use-beat-timeline";
import { lerp, ramp } from "../../cellular-energy-shared/style";

const W = 960;
const H = 540;
const lbl = { fontSize: 20, fontWeight: 600, fill: "var(--ce-ink)", stroke: "var(--ce-halo)", strokeWidth: 4, paintOrder: "stroke" } as const;

function Phosphate({ x, y, r = 24, fill = "var(--ce-atp)", text = "P", sel = false }: { x: number; y: number; r?: number; fill?: string; text?: string; sel?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={fill} stroke={sel ? "var(--ce-sel)" : "var(--ce-line)"} strokeWidth={sel ? 5 : 2.5} />
      <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.26} fill="#fff" opacity={0.35} />
      <text x={x} y={y + 7} textAnchor="middle" fontSize={20} fontWeight={700} fill={text === "Pi" ? "#fff" : "#1a1204"}>{text}</text>
    </g>
  );
}

/** Hydrolysis animation, driven by the fractional beat position `pos` (0–6). */
export function HydrolysisStage({ clock, showLabels }: { clock: BeatClock; showLabels: boolean }) {
  const pos = useClockPos(clock);

  const BY = 215;
  const hexC = { x: 92, y: BY };
  const ribC = { x: 172, y: BY };
  const pa = { x: 248, y: BY };
  const pb = { x: 318, y: BY };
  const split = ramp(pos, 2.2, 3.4);
  const pg = { x: lerp(388, 482, split), y: lerp(BY, BY + 150, split) + Math.sin(pos * 3) * 3 * split };
  const bondFade = 1 - ramp(pos, 2.0, 2.8);
  const enzymeOp = ramp(pos, 0.4, 1) * (1 - ramp(pos, 3.5, 4.1));
  const water = ramp(pos, 0.5, 1.9);
  const waterPos = { x: lerp(560, 410, water) - split * 28, y: lerp(95, BY - 52, water) + split * 130 };
  const hAway = ramp(pos, 2.6, 3.8);
  const chargeOp = (1 - ramp(pos, 2.2, 3)) * 0.95;
  const energyOp = ramp(pos, 3.7, 4.3) * (1 - ramp(pos, 4.6, 5.1));
  const coupleOp = ramp(pos, 4.8, 5.4);
  const lever = ramp(pos, 5.5, 6) * 34;
  const piLeave = ramp(pos, 5.7, 6);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animation of ATP hydrolysis: water splits the terminal phosphate from ATP, giving ADP and inorganic phosphate, releasing free energy that is coupled to work." data-testid="hydrolysis-svg">
      <defs>
        <radialGradient id="ce-hyd-bg" cx="50%" cy="35%" r="80%">
          <stop offset="0%" stopColor="var(--ce-field-a)" />
          <stop offset="100%" stopColor="var(--ce-field-b)" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} rx={18} fill="url(#ce-hyd-bg)" />
      <text x={40} y={46} fontSize={22} fontWeight={700} fill="var(--ce-ink)">ATP + H₂O → ADP + Pi</text>

      {/* ATPase */}
      <ellipse cx={350} cy={BY + 8} rx={150} ry={84} fill="var(--ce-work)" fillOpacity={0.12 * enzymeOp} stroke="var(--ce-work)" strokeWidth={2.5} strokeDasharray="8 6" opacity={enzymeOp} />
      {showLabels ? <text x={350} y={BY - 108} textAnchor="middle" {...lbl} opacity={enzymeOp}>ATPase enzyme</text> : null}

      {/* adenosine (adenine + ribose) */}
      <g>
        <line x1={hexC.x} y1={BY} x2={pb.x} y2={BY} stroke="var(--ce-line)" strokeWidth={5} opacity={0.5} />
        <line x1={pb.x} y1={BY} x2={pg.x} y2={pg.y} stroke="var(--ce-atp)" strokeWidth={6} opacity={0.9 * bondFade} strokeDasharray={pos > 1.9 && pos < 2.8 ? "6 5" : undefined} />
        <polygon points={Array.from({ length: 6 }, (_, i) => `${hexC.x + 34 * Math.cos((i * Math.PI) / 3)},${hexC.y + 34 * Math.sin((i * Math.PI) / 3)}`).join(" ")} fill="var(--ce-adenine)" fillOpacity={0.8} stroke="var(--ce-line)" strokeWidth={2.5} />
        <polygon points={Array.from({ length: 5 }, (_, i) => `${ribC.x + 28 * Math.cos(-Math.PI / 2 + (i * 2 * Math.PI) / 5)},${ribC.y + 28 * Math.sin(-Math.PI / 2 + (i * 2 * Math.PI) / 5)}`).join(" ")} fill="var(--ce-ribose)" fillOpacity={0.85} stroke="var(--ce-line)" strokeWidth={2.5} />
        <Phosphate x={pa.x} y={pa.y} />
        <Phosphate x={pb.x} y={pb.y} sel={pos >= 2 && pos < 3.4} />
        <Phosphate x={pg.x} y={pg.y} fill={split > 0.5 ? "var(--ce-pi)" : "var(--ce-atp)"} text={split > 0.6 ? "Pi" : "P"} sel={pos >= 1.6 && split < 0.9} />
        {/* negative charges */}
        {[pa, pb].map((p, i) => (
          <text key={i} x={p.x + 20} y={p.y - 26} fontSize={22} fontWeight={800} fill="var(--ce-h)" opacity={chargeOp} textAnchor="middle">−</text>
        ))}
        <text x={pg.x + 20} y={pg.y - 26} fontSize={22} fontWeight={800} fill="var(--ce-h)" opacity={split > 0.5 ? 0.5 : chargeOp} textAnchor="middle">−</text>
      </g>

      {showLabels ? (
        <g>
          <text x={hexC.x} y={BY + 66} textAnchor="middle" {...lbl}>Adenine</text>
          <text x={ribC.x} y={BY + 66} textAnchor="middle" {...lbl}>Ribose</text>
          <text x={(pa.x + pb.x) / 2} y={BY + 66} textAnchor="middle" {...lbl} opacity={ramp(pos, 3.2, 3.8)}>ADP</text>
          <text x={pg.x} y={pg.y + 44} textAnchor="middle" {...lbl} opacity={ramp(pos, 3.2, 3.8)}>Pi</text>
          <text x={pa.x} y={BY - 52} textAnchor="middle" fontSize={18} fontWeight={600} fill="var(--ce-ink)" stroke="var(--ce-halo)" strokeWidth={4} paintOrder="stroke" opacity={1 - ramp(pos, 2, 3)}>3 phosphates: crowded negative charges</text>
        </g>
      ) : null}

      {/* water */}
      <g opacity={ramp(pos, 0.4, 0.8)}>
        <circle cx={waterPos.x} cy={waterPos.y} r={18} fill="var(--ce-h2o)" stroke="var(--ce-line)" strokeWidth={2} />
        <text x={waterPos.x} y={waterPos.y + 6} textAnchor="middle" fontSize={15} fontWeight={800} fill="#fff">O</text>
        <circle cx={waterPos.x - 22} cy={waterPos.y + 16} r={9} fill="var(--ce-water)" stroke="var(--ce-line)" strokeWidth={1.5} opacity={1 - hAway} />
        <circle cx={waterPos.x + 22 + hAway * 90} cy={waterPos.y + 16 - hAway * 50} r={9} fill="var(--ce-h)" stroke="var(--ce-line)" strokeWidth={1.5} />
        {showLabels ? <text x={waterPos.x} y={waterPos.y - 28} textAnchor="middle" {...lbl}>{hAway > 0.5 ? "H⁺" : "H₂O"}</text> : null}
      </g>

      {/* free-energy diagram */}
      <g opacity={energyOp} aria-hidden={energyOp < 0.1}>
        <rect x={540} y={74} width={390} height={410} rx={14} fill="var(--ce-halo)" fillOpacity={0.55} stroke="var(--ce-line)" strokeOpacity={0.3} />
        <text x={735} y={104} textAnchor="middle" fontSize={20} fontWeight={700} fill="var(--ce-ink)">Free energy (G)</text>
        <line x1={565} y1={130} x2={565} y2={455} stroke="var(--ce-line)" strokeWidth={2} />
        <line x1={580} y1={170} x2={760} y2={170} stroke="var(--ce-atp)" strokeWidth={6} />
        <text x={670} y={156} textAnchor="middle" fontSize={18} fontWeight={700} fill="var(--ce-ink)">ATP + H₂O</text>
        <line x1={760} y1={390} x2={920} y2={390} stroke="var(--ce-adp)" strokeWidth={6} />
        <text x={840} y={425} textAnchor="middle" fontSize={18} fontWeight={700} fill="var(--ce-ink)">ADP + Pi</text>
        <path d="M 760 170 C 780 120, 800 110, 820 150 S 780 300, 760 390" fill="none" stroke="var(--ce-soft)" strokeWidth={2} strokeDasharray="6 5" opacity={0.0} />
        <line x1={790} y1={176} x2={790} y2={380} stroke="var(--ce-fuel)" strokeWidth={5} />
        <polygon points="790,390 778,366 802,366" fill="var(--ce-fuel)" />
        <text x={805} y={270} fontSize={18} fontWeight={800} fill="var(--ce-ink)">ΔG &lt; 0</text>
        <text x={805} y={294} fontSize={15} fill="var(--ce-ink)">−30.5 kJ/mol (standard)</text>
        <text x={805} y={314} fontSize={15} fill="var(--ce-ink)">−50 to −65 in cells</text>
        <text x={735} y={470} textAnchor="middle" fontSize={14} fill="var(--ce-soft)">Products are more stable overall.</text>
      </g>

      {/* coupling diagram */}
      <g opacity={coupleOp}>
        <rect x={540} y={74} width={390} height={410} rx={14} fill="var(--ce-halo)" fillOpacity={0.55} stroke="var(--ce-line)" strokeOpacity={0.3} />
        <text x={735} y={104} textAnchor="middle" fontSize={20} fontWeight={700} fill="var(--ce-ink)">Energy coupling</text>
        {/* protein */}
        <g transform="translate(735 215)">
          <rect x={-120} y={-40} width={150} height={96} rx={24} fill="var(--ce-work)" fillOpacity={0.35} stroke="var(--ce-work)" strokeWidth={3} />
          <g transform={`rotate(${lever} 30 8)`}>
            <rect x={30} y={-6} width={92} height={28} rx={14} fill="var(--ce-work)" fillOpacity={0.85} stroke="var(--ce-line)" strokeWidth={2} />
          </g>
          <text x={-45} y={14} textAnchor="middle" fontSize={16} fontWeight={700} fill="var(--ce-ink)">protein</text>
          <g opacity={1 - piLeave}>
            <circle cx={-82} cy={-52} r={13} fill="var(--ce-pi)" stroke="var(--ce-line)" strokeWidth={2} />
            <text x={-82} y={-47} textAnchor="middle" fontSize={11} fontWeight={800} fill="#fff">P</text>
          </g>
          <g transform={`translate(${-82 - piLeave * 40} ${-52 - piLeave * 60})`} opacity={piLeave}>
            <circle r={13} fill="var(--ce-pi)" stroke="var(--ce-line)" strokeWidth={2} />
            <text y={5} textAnchor="middle" fontSize={11} fontWeight={800} fill="#fff">Pi</text>
          </g>
        </g>
        <g fontSize={16} fill="var(--ce-ink)">
          <text x={570} y={330}>Work alone (endergonic): ΔG &gt; 0 ▲</text>
          <text x={570} y={358}>ATP hydrolysis: ΔG = −30.5 kJ/mol ▼</text>
          <text x={570} y={392} fontWeight={800}>Coupled total: ΔG &lt; 0 ▼ → proceeds</text>
        </g>
        <text x={735} y={440} textAnchor="middle" fontSize={14} fill="var(--ce-soft)">Phosphate transfer changes the protein&apos;s shape.</text>
      </g>
    </svg>
  );
}
