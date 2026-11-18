"use client";

import type { BeatClock } from "../../meiosis/hooks/use-beat-timeline";
import { useClockPos } from "../../meiosis/hooks/use-beat-timeline";
import { lerp, ramp } from "../../cellular-energy-shared/style";
import { AtpGlyph, Chip, Label } from "../../cellular-energy-shared/svg-bits";
import type { WorkId } from "../model";

const W = 960;
const H = 540;

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={label} data-testid="work-svg">
      <defs>
        <radialGradient id="ce-work-bg" cx="50%" cy="35%" r="85%">
          <stop offset="0%" stopColor="var(--ce-field-a)" />
          <stop offset="100%" stopColor="var(--ce-field-b)" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} rx={18} fill="url(#ce-work-bg)" />
      {children}
    </svg>
  );
}

/* ----------------------------------------------------------------------------------------- Na⁺/K⁺ pump */
function Pump({ pos, labels }: { pos: number; labels: boolean }) {
  const open = ramp(pos, 1.3, 2.0) * (1 - ramp(pos, 3.8, 4.5)); // 0 = open to inside, 1 = open to outside
  const phos = ramp(pos, 1.2, 1.6) * (1 - ramp(pos, 3.2, 3.7));
  const atpIn = ramp(pos, 0.8, 1.2);
  const atpGone = ramp(pos, 1.3, 1.9);
  const naBind = ramp(pos, 0, 0.9);
  const naOut = ramp(pos, 1.9, 2.8);
  const kBind = ramp(pos, 2.8, 3.5);
  const kIn = ramp(pos, 3.9, 4.6);
  const na = [0, 1, 2].map((i) => {
    const x = 410 + i * 70 + (naBind > 0 ? 0 : 0);
    const startY = 420;
    const y = lerp(lerp(startY, 296, naBind), 150, naOut);
    return { x: lerp(300 + i * 100, x, naBind), y, op: 1 };
  });
  const k = [0, 1].map((i) => {
    const sx = 600 + i * 60;
    const y = lerp(lerp(120, 262, kBind), 430, kIn);
    return { x: lerp(sx, 445 + i * 70, kBind) + (kIn > 0 ? lerp(0, (i - 0.5) * 70, kIn) : 0), y };
  });
  return (
    <Frame label="Sodium–potassium pump: ATP phosphorylates the pump, which changes shape, moving 3 Na⁺ out and 2 K⁺ in.">
      <rect x={0} y={228} width={W} height={84} fill="var(--ce-mito-b)" fillOpacity={0.55} />
      <line x1={0} y1={228} x2={W} y2={228} stroke="var(--ce-membrane)" strokeWidth={3} />
      <line x1={0} y1={312} x2={W} y2={312} stroke="var(--ce-membrane)" strokeWidth={3} />
      <Label x={60} y={80} anchor="start" size={20} weight={800}>Outside the cell (high Na⁺)</Label>
      <Label x={60} y={500} anchor="start" size={20} weight={800}>Inside the cell (high K⁺)</Label>
      {/* pump */}
      <g>
        <path d={`M 400 212 L 400 328 L 540 328 L 540 212 Z`} fill="var(--ce-work)" fillOpacity={0.35} stroke="var(--ce-work)" strokeWidth={3.5} />
        <path d={`M 440 ${lerp(212, 250, 1 - open)} Q 470 ${lerp(300, 262, open)} 500 ${lerp(212, 250, 1 - open)}`} fill="var(--ce-halo)" fillOpacity={0.5} stroke="var(--ce-work)" strokeWidth={2} />
        <rect x={438} y={lerp(210, 262, open) - 0} width={64} height={lerp(120, 70, open) - 10} rx={22} fill="var(--ce-halo)" fillOpacity={0.55} />
        <Label x={470} y={275} size={16}>pump</Label>
        {phos > 0.05 ? <Chip x={540} y={262} r={14} color="var(--ce-pi)" text="P" op={phos} /> : null}
      </g>
      {na.map((p, i) => <Chip key={`na${i}`} x={p.x} y={p.y} r={16} color="var(--ce-nadh)" text="Na⁺" fs={12} />)}
      {k.map((p, i) => <Chip key={`k${i}`} x={p.x} y={p.y} r={16} color="var(--ce-fuel)" text="K⁺" fs={12} />)}
      {/* ATP -> ADP */}
      <g opacity={atpIn * (1 - atpGone)}>
        <AtpGlyph x={lerp(760, 590, atpIn)} y={lerp(400, 330, atpIn)} k={1} />
      </g>
      <g opacity={atpGone}>
        <AtpGlyph x={lerp(590, 760, atpGone)} y={lerp(330, 430, atpGone)} k={0.9} phosphates={2} />
        {labels ? <Label x={780} y={470} size={15}>ADP (+ Pi later)</Label> : null}
      </g>
      <g opacity={ramp(pos, 3.3, 3.8)}>
        <Chip x={lerp(540, 640, ramp(pos, 3.3, 4.2))} y={lerp(262, 380, ramp(pos, 3.3, 4.2))} r={14} color="var(--ce-pi)" text="Pi" fs={11} />
      </g>
      {labels ? <Label x={760} y={366} size={16} op={atpIn * (1 - atpGone)}>ATP</Label> : null}
    </Frame>
  );
}

/* ----------------------------------------------------------------------------------------- myosin cycle */
function Muscle({ pos, labels }: { pos: number; labels: boolean }) {
  const detach = ramp(pos, 0.6, 1.4) * (1 - ramp(pos, 3.0, 3.6));
  const cock = ramp(pos, 1.7, 2.4);
  const stroke = ramp(pos, 3.6, 4.4);
  const actinX = -70 * stroke;
  const ang = lerp(lerp(28, -28, cock), 28, stroke); // head angle in degrees from vertical
  const tipY = 350 - detach * 36 + (cock > 0.5 && pos < 3.0 ? -6 : 0);
  const anchor = { x: 470, y: 180 };
  const tip = { x: anchor.x + Math.sin((ang * Math.PI) / 180) * 170, y: anchor.y + Math.cos((ang * Math.PI) / 180) * 170 };
  const hy = Math.min(tipY + 6, tip.y);
  const atpOn = ramp(pos, 0.6, 1.1) * (1 - ramp(pos, 2.0, 2.6));
  return (
    <Frame label="Myosin cross-bridge cycle: ATP binding releases myosin from actin, hydrolysis re-cocks the head, Pi release triggers the power stroke.">
      <rect x={90} y={96} width={780} height={52} rx={26} fill="var(--ce-fadh)" fillOpacity={0.3} stroke="var(--ce-fadh)" strokeWidth={3} />
      <Label x={480} y={130} size={18} weight={800}>Thick filament (myosin tails)</Label>
      <g transform={`translate(${actinX} 0)`}>
        <rect x={70} y={354} width={820} height={34} rx={17} fill="var(--ce-nadh)" fillOpacity={0.3} stroke="var(--ce-nadh)" strokeWidth={3} />
        {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={110 + i * 70} cy={371} r={7} fill="var(--ce-nadh)" opacity={0.75} />)}
      </g>
      <Label x={480} y={420} size={18} weight={800}>Thin filament (actin) — moves left in the power stroke</Label>
      {/* head */}
      <line x1={anchor.x} y1={anchor.y} x2={tip.x} y2={Math.min(tip.y, hy + 6)} stroke="var(--ce-work)" strokeWidth={14} strokeLinecap="round" />
      <ellipse cx={tip.x} cy={Math.min(tip.y, hy + 6)} rx={30} ry={22} fill="var(--ce-work)" stroke="var(--ce-line)" strokeWidth={3} transform={`rotate(${-ang} ${tip.x} ${Math.min(tip.y, hy + 6)})`} />
      {labels ? <Label x={tip.x + 70} y={Math.min(tip.y, hy + 6) - 4} anchor="start" size={16}>myosin head</Label> : null}
      {/* nucleotide */}
      {atpOn > 0.05 ? <Chip x={tip.x + 30} y={Math.min(tip.y, hy + 6) - 34} r={14} color="var(--ce-atp)" text="ATP" fs={11} op={atpOn} /> : null}
      {cock > 0.8 && pos < 3.6 ? (
        <g>
          <Chip x={tip.x + 26} y={Math.min(tip.y, hy + 6) - 38} r={12} color="var(--ce-adp)" text="ADP" fs={9} />
          <Chip x={tip.x + 54} y={Math.min(tip.y, hy + 6) - 30} r={11} color="var(--ce-pi)" text="Pi" fs={9} />
        </g>
      ) : null}
      {ramp(pos, 3.3, 3.9) > 0 && pos < 4.3 ? <Chip x={lerp(tip.x + 50, tip.x + 120, ramp(pos, 3.3, 4.2))} y={lerp(Math.min(tip.y, hy + 6) - 30, 300, ramp(pos, 3.3, 4.2))} r={11} color="var(--ce-pi)" text="Pi" fs={9} op={1 - ramp(pos, 4.0, 4.4)} /> : null}
    </Frame>
  );
}

/* ----------------------------------------------------------------------------------------- biosynthesis */
function Biosynthesis({ pos, labels }: { pos: number; labels: boolean }) {
  const atpIn = ramp(pos, 0.8, 1.4);
  const transfer = ramp(pos, 1.3, 1.9);
  const nh4 = ramp(pos, 2.4, 3.1);
  const piOff = ramp(pos, 2.9, 3.6);
  const done = ramp(pos, 3.7, 4.2);
  const gluX = 380;
  const gluY = 330;
  return (
    <Frame label="Biosynthesis of glutamine: ATP transfers a phosphate to glutamate, making it reactive so that ammonium can be attached.">
      <ellipse cx={480} cy={330} rx={250} ry={110} fill="var(--ce-work)" fillOpacity={0.14} stroke="var(--ce-work)" strokeWidth={3} strokeDasharray="8 6" />
      <Label x={480} y={470} size={17}>enzyme (glutamine synthetase)</Label>
      <Label x={60} y={60} anchor="start" size={20} weight={800}>{pos < 0.8 ? "Glutamate + NH₄⁺ → glutamine alone: ΔG > 0, no reaction" : pos < 3.7 ? "Coupled to ATP: the combined reaction has ΔG < 0" : "Net: glutamate + NH₄⁺ + ATP → glutamine + ADP + Pi"}</Label>
      {/* glutamate */}
      <g opacity={1 - done}>
        <rect x={gluX - 54} y={gluY - 28} width={108} height={56} rx={28} fill="var(--ce-fuel)" stroke={pos > 2.0 && pos < 3.0 ? "var(--ce-sel)" : "var(--ce-line)"} strokeWidth={pos > 2.0 && pos < 3.0 ? 5 : 2.5} />
        <text x={gluX} y={gluY + 6} textAnchor="middle" fontSize={17} fontWeight={800} fill="#0b1f08">Glutamate</text>
        {transfer > 0.4 && piOff < 0.6 ? <Chip x={gluX + 58} y={gluY - 26} r={13} color="var(--ce-pi)" text="P" fs={10} /> : null}
      </g>
      {/* NH4+ */}
      <g opacity={1 - done}>
        <Chip x={lerp(680, gluX + 90, nh4)} y={lerp(250, gluY, nh4)} r={22} color="var(--ce-h2o)" text="NH₄⁺" fs={13} />
      </g>
      {/* glutamine */}
      <g opacity={done}>
        <rect x={gluX - 20} y={gluY - 28} width={220} height={56} rx={28} fill="var(--ce-fuel)" stroke="var(--ce-line)" strokeWidth={3} />
        <text x={gluX + 90} y={gluY + 6} textAnchor="middle" fontSize={18} fontWeight={800} fill="#0b1f08">Glutamine</text>
      </g>
      {/* ATP */}
      <g opacity={atpIn * (1 - transfer)}>
        <AtpGlyph x={lerp(760, 560, atpIn)} y={lerp(120, 240, atpIn)} k={1.1} />
      </g>
      <g opacity={transfer}>
        <AtpGlyph x={lerp(560, 780, transfer)} y={lerp(240, 140, transfer)} k={1} phosphates={2} />
        {labels ? <Label x={780} y={176} size={15}>ADP</Label> : null}
      </g>
      <g opacity={piOff}>
        <Chip x={lerp(gluX + 58, 640, piOff)} y={lerp(gluY - 26, 410, piOff)} r={13} color="var(--ce-pi)" text="Pi" fs={10} />
      </g>
      {pos < 0.8 ? <Label x={480} y={200} size={22} weight={800}>✕ not favourable on its own</Label> : null}
    </Frame>
  );
}

/* ----------------------------------------------------------------------------------------- kinesin */
function Motor({ pos, labels }: { pos: number; labels: boolean }) {
  const swing = ramp(pos, 1.0, 2.2);
  const lift = ramp(pos, 3.6, 4.4);
  const rear = { x: 360, y: 350 };
  const front = { x: 420, y: 350 };
  // head A starts at the rear and swings to the front; head B starts at the front, stays, and is then the rear
  const a = { x: lerp(rear.x, front.x + 60, swing), y: rear.y - Math.sin(swing * Math.PI) * 60 };
  const b = { x: front.x, y: front.y - lift * 16 };
  const bodyX = (a.x + b.x) / 2;
  const atpOn = ramp(pos, 1.0, 1.5) * (1 - ramp(pos, 2.9, 3.2));
  return (
    <Frame label="Kinesin walking on a microtubule: ATP binding swings one head forward, hydrolysis weakens the other head's grip, and the cycle repeats.">
      <rect x={60} y={366} width={840} height={40} rx={20} fill="var(--ce-nadh)" fillOpacity={0.28} stroke="var(--ce-nadh)" strokeWidth={3} />
      {Array.from({ length: 14 }, (_, i) => <line key={i} x1={100 + i * 56} y1={372} x2={100 + i * 56} y2={400} stroke="var(--ce-nadh)" strokeWidth={2} opacity={0.6} />)}
      <Label x={480} y={440} size={18} weight={800}>Microtubule (track)</Label>
      {/* cargo */}
      <circle cx={bodyX} cy={160} r={58} fill="var(--ce-h2o)" fillOpacity={0.3} stroke="var(--ce-h2o)" strokeWidth={3} />
      <Label x={bodyX} y={166} size={16}>vesicle</Label>
      <line x1={bodyX} y1={218} x2={bodyX} y2={262} stroke="var(--ce-work)" strokeWidth={8} />
      <line x1={bodyX} y1={262} x2={a.x} y2={a.y - 10} stroke="var(--ce-work)" strokeWidth={8} strokeLinecap="round" />
      <line x1={bodyX} y1={262} x2={b.x} y2={b.y - 10} stroke="var(--ce-work)" strokeWidth={8} strokeLinecap="round" />
      <ellipse cx={a.x} cy={a.y} rx={28} ry={20} fill="var(--ce-work)" stroke={pos > 1.0 && pos < 2.4 ? "var(--ce-sel)" : "var(--ce-line)"} strokeWidth={pos > 1.0 && pos < 2.4 ? 5 : 3} />
      <ellipse cx={b.x} cy={b.y} rx={28} ry={20} fill="var(--ce-work)" fillOpacity={0.85} stroke="var(--ce-line)" strokeWidth={3} />
      {labels ? <Label x={bodyX + 90} y={290} anchor="start" size={16}>motor heads</Label> : null}
      {atpOn > 0.05 ? <Chip x={a.x + 4} y={a.y - 44} r={14} color="var(--ce-atp)" text="ATP" fs={11} op={atpOn} /> : null}
      {ramp(pos, 3.0, 3.5) > 0 ? <Chip x={lerp(b.x + 6, b.x + 70, ramp(pos, 3.2, 4.2))} y={lerp(b.y - 44, 250, ramp(pos, 3.2, 4.2))} r={12} color="var(--ce-pi)" text="Pi" fs={10} op={ramp(pos, 3.0, 3.5) * (1 - ramp(pos, 4.0, 4.5))} /> : null}
    </Frame>
  );
}

export function WorkStage({ id, clock, showLabels }: { id: WorkId; clock: BeatClock; showLabels: boolean }) {
  const pos = useClockPos(clock);
  if (id === "pump") return <Pump pos={pos} labels={showLabels} />;
  if (id === "muscle") return <Muscle pos={pos} labels={showLabels} />;
  if (id === "biosynthesis") return <Biosynthesis pos={pos} labels={showLabels} />;
  return <Motor pos={pos} labels={showLabels} />;
}
