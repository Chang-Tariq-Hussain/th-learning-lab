"use client";

import { lerp, ramp } from "../../cellular-energy-shared/style";
import { Chip, Label } from "../../cellular-energy-shared/svg-bits";
import { CYCLE_NODES, CITRIC_PER_GLUCOSE, cycleCarbonAfter, cycleTally, glycolysisTally } from "../model";

export const SW = 960;
export const SH = 600;

const hexPts = (cx: number, cy: number, r: number) => Array.from({ length: 6 }, (_, i) => ({ x: cx + r * Math.cos((Math.PI / 3) * i + Math.PI / 6), y: cy + r * Math.sin((Math.PI / 3) * i + Math.PI / 6) }));
const triPts = (cx: number, cy: number, r: number, k = 0) => Array.from({ length: 3 }, (_, i) => ({ x: cx + r * Math.cos((2 * Math.PI * i) / 3 - Math.PI / 2 + k), y: cy + r * Math.sin((2 * Math.PI * i) / 3 - Math.PI / 2 + k) }));

function Skeleton({ pts, color = "var(--ce-fuel)", r = 11, close = true, op = 1 }: { pts: { x: number; y: number }[]; color?: string; r?: number; close?: boolean; op?: number }) {
  return (
    <g opacity={op}>
      <polyline points={[...pts, ...(close ? [pts[0]!] : [])].map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke="var(--ce-line)" strokeWidth={4} opacity={0.6} />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={r} fill={color} stroke="var(--ce-line)" strokeWidth={2} />
          <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={11} fontWeight={800} fill="#0b1f08">C</text>
        </g>
      ))}
    </g>
  );
}

function Ledger({ x, y, w, rows, title }: { x: number; y: number; w: number; rows: [string, string][]; title: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={28 + rows.length * 26} rx={12} fill="var(--ce-halo)" fillOpacity={0.7} stroke="var(--ce-line)" strokeOpacity={0.35} />
      <Label x={14} y={22} anchor="start" size={15} weight={800}>{title}</Label>
      {rows.map(([a, b], i) => (
        <g key={a}>
          <Label x={14} y={48 + i * 26} anchor="start" size={14} weight={500}>{a}</Label>
          <Label x={w - 14} y={48 + i * 26} anchor="end" size={14} weight={800}>{b}</Label>
        </g>
      ))}
    </g>
  );
}

/* ================================================================================================ Glycolysis */
export function GlycolysisScene({ lp, showLabels }: { lp: number; showLabels: boolean }) {
  const t = glycolysisTally(Math.round(lp));
  const split = ramp(lp, 1.7, 2.6);
  const invest = ramp(lp, 0.8, 1.5) * (1 - ramp(lp, 1.6, 1.95));
  const phos = ramp(lp, 1.2, 1.6);
  const trioY = lerp(300, 210, split);
  const trioY2 = lerp(300, 390, split);
  const trioX = lerp(300, 430, split);
  const pyr = ramp(lp, 4.6, 5.2);
  const nadh = ramp(lp, 2.8, 3.5);
  const atpMade = ramp(lp, 3.8, 4.6);
  const phase = lp < 1.7 ? "invest" : lp < 3 ? "split" : "payoff";
  return (
    <g>
      <rect x={0} y={0} width={SW} height={SH} fill="var(--ce-cyto-a)" />
      <rect x={0} y={0} width={SW} height={SH} fill="var(--ce-cyto-b)" opacity={0.35} />
      <rect x={20} y={20} width={640} height={50} rx={12} fill="var(--ce-adp)" fillOpacity={phase === "invest" || lp < 1.7 ? 0.3 : 0.1} stroke="var(--ce-adp)" strokeWidth={3} />
      <Label x={340} y={52} size={19} weight={800}>Investment phase: −2 ATP (steps 1–3)</Label>
      <rect x={20} y={540} width={640} height={44} rx={12} fill="var(--ce-fuel)" fillOpacity={lp >= 2.6 ? 0.3 : 0.1} stroke="var(--ce-fuel)" strokeWidth={3} />
      <Label x={340} y={570} size={19} weight={800}>Payoff phase: +4 ATP, 2 NADH</Label>
      {showLabels ? <Label x={60} y={110} anchor="start" size={15} weight={500}>Cytosol (no oxygen needed)</Label> : null}

      {/* glucose hexagon becomes fructose-1,6-bisphosphate then splits into two three-carbon pieces */}
      {split < 0.05 ? (
        <g>
          <Skeleton pts={hexPts(300, 300, 62)} />
          {phos > 0 ? <><Chip x={300 - 90} y={250} r={14} color="var(--ce-pi)" text="P" fs={11} op={phos} /><Chip x={300 + 90} y={350} r={14} color="var(--ce-pi)" text="P" fs={11} op={phos} /></> : null}
          {showLabels ? <Label x={300} y={400} size={17}>{lp < 1.2 ? "Glucose (6 C)" : "Fructose-1,6-bisphosphate (6 C)"}</Label> : null}
        </g>
      ) : (
        <g>
          <Skeleton pts={triPts(trioX, trioY, 40)} />
          <Skeleton pts={triPts(trioX, trioY2, 40)} />
          <Chip x={trioX + 58} y={trioY - 8} r={13} color="var(--ce-pi)" text="P" fs={11} />
          <Chip x={trioX + 58} y={trioY2 - 8} r={13} color="var(--ce-pi)" text="P" fs={11} />
          {showLabels ? <Label x={trioX - 96} y={trioY + 4} size={15}>{lp >= 4.6 ? "Pyruvate (3 C)" : "G3P (3 C)"}</Label> : null}
          {showLabels ? <Label x={trioX - 96} y={trioY2 + 4} size={15}>{lp >= 4.6 ? "Pyruvate (3 C)" : "G3P (3 C)"}</Label> : null}
        </g>
      )}

      {/* ATP -> ADP in the investment phase */}
      {invest > 0 ? [0, 1].map((i) => (
        <g key={i}>
          <Chip x={lerp(130, 255 + i * 90, ramp(lp, 0.8, 1.2))} y={lerp(110, 245 + i * 110, ramp(lp, 0.8, 1.2))} r={19} color={ramp(lp, 1.2, 1.4) > 0.5 ? "var(--ce-adp)" : "var(--ce-atp)"} text={ramp(lp, 1.2, 1.4) > 0.5 ? "ADP" : "ATP"} textColor="#1a1204" fs={12} op={invest} />
        </g>
      )) : null}

      {/* NAD+ -> NADH */}
      {lp >= 2.7 ? [0, 1].map((i) => (
        <Chip key={i} x={lerp(560, 580, nadh)} y={trioY + (i === 0 ? 0 : trioY2 - trioY) - (i === 0 ? 0 : 0) + (i === 0 ? -50 : 50)} r={19} color={nadh > 0.5 ? "var(--ce-nadh)" : "var(--ce-co2)"} text={nadh > 0.5 ? "NADH" : "NAD⁺"} fs={10} op={ramp(lp, 2.7, 3)} />
      )) : null}

      {/* ATP produced */}
      {lp >= 3.7 ? [0, 1, 2, 3].map((i) => (
        <Chip key={i} x={lerp(520, 600 + (i % 2) * 44, atpMade)} y={(i < 2 ? trioY : trioY2) + (i % 2 ? 40 : -40) + (i < 2 ? -8 : 8)} r={17} color="var(--ce-atp)" text="ATP" textColor="#1a1204" fs={11} op={atpMade} />
      )) : null}

      {pyr > 0 ? <Label x={500} y={SH / 2} size={20} weight={800} op={pyr}>2 pyruvate (3 C each) → mitochondrion</Label> : null}

      <Ledger x={690} y={110} w={250} title="Running tally (per glucose)" rows={[["Carbon", t.carbonUnits.split(" ")[0] === "1" ? "6 C" : "2 × 3 C"], ["ATP spent", `−${t.atpSpent}`], ["ATP made", `+${t.atpMade}`], ["Net ATP", `${t.atpMade - t.atpSpent}`], ["NADH", `${t.nadh}`], ["Pyruvate", lp >= 4.6 ? "2" : "0"]]} />
    </g>
  );
}

/* ================================================================================================ Pyruvate oxidation */
export function PyruvateScene({ lp, showLabels }: { lp: number; showLabels: boolean }) {
  const enter = ramp(lp, 0, 0.9);
  const loss = ramp(lp, 1, 1.9);
  const coa = ramp(lp, 2, 2.8);
  const xs = [330, 470];
  return (
    <g>
      <rect width={SW} height={150} fill="var(--ce-cyto-a)" />
      <rect y={150} width={SW} height={36} fill="var(--ce-mito-b)" opacity={0.7} />
      <rect y={186} width={SW} height={410} fill="var(--ce-matrix)" />
      <line x1={0} y1={150} x2={SW} y2={150} stroke="var(--ce-membrane)" strokeWidth={5} />
      <line x1={0} y1={186} x2={SW} y2={186} stroke="var(--ce-membrane)" strokeWidth={5} />
      {showLabels ? (
        <g>
          <Label x={30} y={40} anchor="start" size={16}>Cytosol</Label>
          <Label x={30} y={172} anchor="start" size={13} weight={500}>outer membrane · intermembrane space · inner membrane</Label>
          <Label x={30} y={226} anchor="start" size={16}>Mitochondrial matrix</Label>
        </g>
      ) : null}
      {xs.map((x, i) => {
        const y = lerp(90, 340, enter);
        const carbonsLeft = loss > 0.5 ? 2 : 3;
        return (
          <g key={i}>
            <Skeleton pts={Array.from({ length: carbonsLeft }, (_, k) => ({ x: x + k * 28 - 28, y }))} close={false} r={11} />
            {loss < 0.5 ? null : null}
            {loss > 0 ? <Chip x={lerp(x + 40, x + 150 + i * 90, loss)} y={lerp(y - 28, 230 - i * 20, loss)} r={14} color="var(--ce-co2)" text="CO₂" fs={10} op={loss * (1 - ramp(lp, 2.9, 3.4) * 0.0)} /> : null}
            {loss > 0.4 ? <Chip x={x - 70} y={y + 60 + (i ? 28 : 0)} r={16} color="var(--ce-nadh)" text="NADH" fs={9} op={loss} /> : null}
            {coa > 0 ? <Chip x={x + 60} y={y + 36} r={14} color="#C58B3E" text="CoA" fs={10} op={coa} /> : null}
            {showLabels ? <Label x={x} y={y + 40} size={15}>{coa > 0.5 ? "Acetyl-CoA" : loss > 0.5 ? "Acetyl (2 C)" : "Pyruvate (3 C)"}</Label> : null}
          </g>
        );
      })}
      <ellipse cx={400} cy={430} rx={230} ry={42} fill="var(--ce-work)" fillOpacity={0.14} stroke="var(--ce-work)" strokeWidth={3} strokeDasharray="8 6" />
      <Label x={400} y={436} size={16}>Pyruvate dehydrogenase complex</Label>
      <Ledger x={690} y={220} w={250} title="Per glucose (2 pyruvate)" rows={[["Acetyl-CoA", `${lp >= 2.4 ? 2 : 0}`], ["CO₂ released", `${lp >= 1.5 ? 2 : 0}`], ["NADH made", `${lp >= 1.5 ? 2 : 0}`], ["Carbon check", lp >= 3 ? "4 + 2 = 6" : "—"]]} />
    </g>
  );
}

/* ================================================================================================ Citric acid cycle */
const CX = 330;
const CY = 320;
const CR = 190;
const nodePos = (k: number) => {
  const a = ((-90 + 45 * k) * Math.PI) / 180;
  return { x: CX + CR * Math.cos(a), y: CY + CR * Math.sin(a), a };
};

export function CitricScene({ lp, showLabels, selected, onSelect, perGlucose }: { lp: number; showLabels: boolean; selected: string | null; onSelect: (id: string) => void; perGlucose: boolean }) {
  const b = Math.round(lp);
  const tally = cycleTally(b);
  const mult = perGlucose ? 2 : 1;
  const active = b <= 7 ? b : b === 8 ? 0 : -1;
  const enter = ramp(lp, 0.2, 1);
  const prod = (k: number, from: number, text: string, color: string, dist: number, fs = 10, r = 14) => {
    const p = nodePos(k);
    const o = ramp(lp, from - 0.2, from + 0.4);
    return o > 0 ? <Chip key={text + k + from} x={p.x + Math.cos(p.a) * (dist * (0.4 + 0.6 * o))} y={p.y + Math.sin(p.a) * (dist * (0.4 + 0.6 * o))} r={r} color={color} text={text} fs={fs} op={o} /> : null;
  };
  return (
    <g>
      <rect width={SW} height={SH} fill="var(--ce-matrix)" />
      {showLabels ? <Label x={30} y={36} anchor="start" size={16}>Mitochondrial matrix — one turn of the cycle (1 acetyl-CoA)</Label> : null}
      <circle cx={CX} cy={CY} r={CR} fill="none" stroke="var(--ce-membrane)" strokeWidth={6} className="ce-flow" opacity={0.5} />
      {/* acetyl-CoA enters at citrate */}
      <Chip x={lerp(70, nodePos(1).x - 56, enter)} y={lerp(130, nodePos(1).y - 40, enter)} r={20} color="#C58B3E" text="Ac-CoA" fs={9} op={b <= 2 ? Math.max(enter, lp < 0.2 ? 1 : 0) : 0} />
      {b <= 2 ? <Label x={70} y={170} size={13} weight={500} op={lp < 1.5 ? 1 : 0}>acetyl-CoA (2 C)</Label> : null}
      {CYCLE_NODES.map((n, k) => {
        const p = nodePos(k);
        const on = k === active;
        const sel = selected === n.id;
        const reached = b >= n.beat || b >= 8;
        return (
          <g key={n.id} className="ce-hit" role="button" tabIndex={0} aria-pressed={sel} aria-label={`${n.name}, ${n.carbons} carbons`} data-node={n.id} onClick={() => onSelect(n.id)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onSelect(n.id))}>
            <circle cx={p.x} cy={p.y} r={on ? 38 : 32} fill={on ? "var(--ce-atp)" : "var(--ce-halo)"} fillOpacity={reached ? 0.95 : 0.5} stroke={sel ? "var(--ce-sel)" : "var(--ce-line)"} strokeWidth={sel ? 6 : on ? 4 : 2.5} />
            <text x={p.x} y={p.y - 2} textAnchor="middle" fontSize={20} fontWeight={800} fill={on ? "#1a1204" : "var(--ce-ink)"}>{n.carbons}C</text>
            <text x={p.x} y={p.y + 16} textAnchor="middle" fontSize={10} fontWeight={600} fill={on ? "#1a1204" : "var(--ce-ink)"}>{n.name.length > 12 ? n.name.slice(0, 11) + "…" : n.name}</text>
          </g>
        );
      })}
      {/* products */}
      {prod(3, 3, "CO₂", "var(--ce-co2)", 78)}
      {prod(3, 3, "NADH", "var(--ce-nadh)", 54, 8, 15)}
      {prod(4, 4, "CO₂", "var(--ce-co2)", 78)}
      {prod(4, 4, "NADH", "var(--ce-nadh)", 54, 8, 15)}
      {prod(5, 5, "ATP", "var(--ce-atp)", 74, 11, 16)}
      {prod(6, 6, "FADH₂", "var(--ce-fadh)", 70, 7.5, 17)}
      {prod(0, 8, "NADH", "var(--ce-nadh)", 70, 8, 15)}
      {b === 7 ? <Chip x={nodePos(7).x - 56} y={nodePos(7).y + 10} r={14} color="var(--ce-h2o)" text="H₂O" fs={9} /> : null}
      <text x={CX} y={CY - 6} textAnchor="middle" fontSize={44} fontWeight={800} fill="var(--ce-ink)" opacity={0.85}>{b >= 9 ? "✓" : `${cycleCarbonAfter(Math.min(b, 8))} C`}</text>
      <text x={CX} y={CY + 24} textAnchor="middle" fontSize={14} fontWeight={600} fill="var(--ce-soft)">{b >= 9 ? "cycle complete" : "carbons in the intermediate"}</text>
      <Ledger x={640} y={110} w={300} title={perGlucose ? "Per glucose (2 turns)" : "Per turn of the cycle"} rows={[["CO₂", `${(b >= 9 ? 2 : tally.co2) * mult}`], ["NADH", `${(b >= 9 ? 3 : tally.nadh) * mult}`], ["FADH₂", `${(b >= 9 ? 1 : tally.fadh2) * mult}`], ["ATP (or GTP)", `${(b >= 9 ? 1 : tally.atp) * mult}`]]} />
      {b >= 9 ? <Label x={790} y={290} size={14} weight={500}>{`Per glucose: ${CITRIC_PER_GLUCOSE.co2} CO₂, ${CITRIC_PER_GLUCOSE.nadh} NADH, ${CITRIC_PER_GLUCOSE.fadh2} FADH₂, ${CITRIC_PER_GLUCOSE.atp} ATP`}</Label> : null}
      <Label x={790} y={330} size={13} weight={500}>Click an intermediate for details.</Label>
    </g>
  );
}

/* ================================================================================================ Electron transport chain */
export const ETC_PATH = [
  { x: 150, y: 430 }, // NADH
  { x: 150, y: 310 }, // I
  { x: 350, y: 300 }, // Q
  { x: 440, y: 310 }, // III
  { x: 545, y: 222 }, // cyt c
  { x: 635, y: 310 }, // IV
  { x: 635, y: 450 }, // O2
];
export function pointAlong(pts: { x: number; y: number }[], t: number) {
  const n = pts.length - 1;
  const s = Math.min(n - 1e-9, Math.max(0, t * n));
  const i = Math.floor(s);
  const f = s - i;
  return { x: lerp(pts[i]!.x, pts[i + 1]!.x, f), y: lerp(pts[i]!.y, pts[i + 1]!.y, f) };
}

function Complex({ x, w, y = 245, h = 130, name, sub, hot }: { x: number; w: number; y?: number; h?: number; name: string; sub?: string; hot: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={22} fill="var(--ce-work)" fillOpacity={hot ? 0.6 : 0.3} stroke={hot ? "var(--ce-sel)" : "var(--ce-work)"} strokeWidth={hot ? 5 : 3} />
      <text x={x + w / 2} y={y + h / 2 + 6} textAnchor="middle" fontSize={20} fontWeight={800} fill="var(--ce-ink)">{name}</text>
      {sub ? <text x={x + w / 2} y={y + h / 2 + 26} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--ce-ink)">{sub}</text> : null}
    </g>
  );
}

export function EtcScene({ lp, showLabels }: { lp: number; showLabels: boolean }) {
  const eToken = (() => {
    if (lp < 1) return null;
    if (lp < 2) return pointAlong(ETC_PATH.slice(0, 3), ramp(lp, 1.15, 1.95));
    if (lp < 3) return pointAlong([{ x: 265, y: 430 }, { x: 265, y: 320 }, { x: 350, y: 300 }], ramp(lp, 2.15, 2.95));
    if (lp < 4) return pointAlong(ETC_PATH.slice(2, 5), ramp(lp, 3.15, 3.95));
    if (lp < 5) return pointAlong(ETC_PATH.slice(4, 6), ramp(lp, 4.15, 4.95));
    if (lp < 6) return pointAlong(ETC_PATH.slice(5, 7), ramp(lp, 5.15, 5.9));
    return null;
  })();
  const pump = (x0: number, n: number, start: number, key: string) =>
    Array.from({ length: n }, (_, i) => {
      const o = ramp(lp, start + i * 0.08, start + 0.7 + i * 0.08);
      return lp >= start ? <Chip key={`${key}${i}`} x={x0 + (i % 2) * 30 + (i > 1 ? 0 : 0)} y={lerp(380, 190 - Math.floor(i / 2) * 26, o)} r={10} color="var(--ce-h)" text="H⁺" fs={8} op={Math.min(1, (lp - start) * 3)} /> : null;
    });
  const water = ramp(lp, 5.5, 6);
  const accumulated = (lp >= 1.9 ? 4 : 0) + (lp >= 3.9 ? 4 : 0) + (lp >= 4.9 ? 2 : 0);
  return (
    <g>
      <rect width={SW} height={270} fill="var(--ce-ims)" />
      <rect y={270} width={SW} height={60} fill="var(--ce-mito-b)" opacity={0.85} />
      <rect y={330} width={SW} height={270} fill="var(--ce-matrix)" />
      <line x1={0} y1={270} x2={SW} y2={270} stroke="var(--ce-membrane)" strokeWidth={4} />
      <line x1={0} y1={330} x2={SW} y2={330} stroke="var(--ce-membrane)" strokeWidth={4} />
      {showLabels ? (
        <g>
          <Label x={30} y={36} anchor="start" size={16}>Intermembrane space (H⁺ accumulate here)</Label>
          <Label x={30} y={568} anchor="start" size={16}>Matrix (low H⁺)</Label>
          <Label x={SW - 30} y={300} anchor="end" size={14} weight={500}>inner mitochondrial membrane</Label>
        </g>
      ) : null}
      <Complex x={100} w={100} name="I" sub="pumps 4 H⁺" hot={lp >= 1 && lp < 2} />
      <Complex x={225} w={80} y={255} h={100} name="II" sub="no pumping" hot={lp >= 2 && lp < 3} />
      <Complex x={390} w={100} name="III" sub="pumps 4 H⁺" hot={lp >= 3 && lp < 4} />
      <Complex x={590} w={90} name="IV" sub="pumps 2 H⁺" hot={lp >= 4 && lp < 6} />
      {/* ATP synthase (next stage) */}
      <g opacity={0.4}>
        <rect x={790} y={250} width={70} height={90} rx={16} fill="var(--ce-atp)" fillOpacity={0.4} stroke="var(--ce-line)" strokeWidth={2} />
        <circle cx={825} cy={380} r={40} fill="var(--ce-atp)" fillOpacity={0.4} stroke="var(--ce-line)" strokeWidth={2} />
        <Label x={825} y={452} size={12} weight={500}>ATP synthase (next stage)</Label>
      </g>
      {/* mobile carriers */}
      <ellipse cx={350} cy={300} rx={26} ry={16} fill="var(--ce-fadh)" stroke="var(--ce-line)" strokeWidth={2.5} />
      <text x={350} y={305} textAnchor="middle" fontSize={13} fontWeight={800} fill="#fff">Q</text>
      <ellipse cx={545} cy={222} rx={30} ry={16} fill="var(--ce-h)" fillOpacity={0.85} stroke="var(--ce-line)" strokeWidth={2.5} />
      <text x={545} y={227} textAnchor="middle" fontSize={12} fontWeight={800} fill="#fff">cyt c</text>
      {/* electron route, drawn as a fixed guide path (electrons move only along it) */}
      <path d={`M ${ETC_PATH.slice(1, 6).map((p) => `${p.x} ${p.y}`).join(" L ")}`} fill="none" stroke="var(--ce-e)" strokeWidth={4} strokeDasharray="3 9" opacity={0.55} />
      {/* NADH / FADH2 donors */}
      <Chip x={lp >= 1.1 ? 100 : 130} y={430} r={18} color={lp >= 1.4 ? "var(--ce-co2)" : "var(--ce-nadh)"} text={lp >= 1.4 ? "NAD⁺" : "NADH"} fs={10} />
      <Chip x={lp >= 2.2 ? 225 : 255} y={430} r={18} color={lp >= 2.4 ? "var(--ce-co2)" : "var(--ce-fadh)"} text={lp >= 2.4 ? "FAD" : "FADH₂"} fs={9} />
      {/* protons */}
      {pump(130, 4, 1.2, "I")}
      {pump(405, 4, 3.2, "III")}
      {pump(610, 2, 4.2, "IV")}
      {/* O2 and water */}
      <Chip x={lerp(740, 640, ramp(lp, 4.8, 5.4))} y={lerp(520, 455, ramp(lp, 4.8, 5.4))} r={15} color="var(--ce-o2)" text="O₂" fs={11} op={lp >= 4.8 ? 1 - water : 0} />
      {water > 0 ? <Chip x={690} y={440} r={16} color="var(--ce-h2o)" text="H₂O" fs={10} op={water} /> : null}
      {/* moving electron pair */}
      {eToken ? (
        <g>
          <circle cx={eToken.x} cy={eToken.y} r={15} fill="var(--ce-e)" opacity={0.35} />
          <circle cx={eToken.x} cy={eToken.y} r={9} fill="var(--ce-e)" stroke="var(--ce-line)" strokeWidth={2} />
          <text x={eToken.x} y={eToken.y - 18} textAnchor="middle" fontSize={12} fontWeight={800} fill="var(--ce-ink)" stroke="var(--ce-halo)" strokeWidth={3} paintOrder="stroke">2 e⁻</text>
        </g>
      ) : null}
      {/* energy staircase */}
      <g transform="translate(40 470)">
        <Label x={0} y={0} anchor="start" size={13} weight={600}>Free energy of the electrons falls step by step</Label>
        {["NADH", "I", "Q", "III", "c", "IV", "O₂"].map((n, i) => (
          <g key={n}>
            <rect x={i * 38} y={12 + i * 11} width={34} height={8} rx={3} fill="var(--ce-e)" opacity={Math.floor(lp) >= i ? 0.95 : 0.3} />
            <text x={i * 38 + 17} y={40 + i * 11 + 4} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--ce-ink)">{n}</text>
          </g>
        ))}
      </g>
      <Ledger x={700} y={470 - 0} w={240} title="Protons pumped (per NADH)" rows={[["H⁺ so far", `${accumulated}`]]} />
    </g>
  );
}

/* ================================================================================================ ATP synthase */
export interface SynthaseProps {
  lp: number;
  showLabels: boolean;
  live: boolean;
  rot: number;
  gradient: number;
  atp: number;
  flow: number;
}

const HPOS = Array.from({ length: 28 }, (_, i) => ({ x: 70 + ((i * 97) % 820), y: 40 + ((i * 53) % 190) }));

export function SynthaseScene({ lp, showLabels, live, rot, gradient, atp, flow }: SynthaseProps) {
  const stepRot = lp < 2 ? 0 : lp < 3 ? ramp(lp, 2, 2.9) * 120 : lp < 4 ? 120 + ramp(lp, 3, 3.9) * 240 : 360 + (lp - 4) * 120;
  const r = live ? rot : stepRot;
  const g = live ? gradient : lp < 0.5 ? 0.2 + 0.7 * ramp(lp, 0, 0.5) : 0.9;
  const flowing = live ? flow > 0 && gradient > 0.03 : lp >= 1 && lp < 5;
  const nIms = Math.round(4 + g * 24);
  const nMat = 4;
  const atpShown = live ? atp : lp < 3 ? 0 : lp < 4 ? Math.floor(ramp(lp, 3, 3.9) * 3 + 0.01) : 3;
  const slot = (k: number) => {
    const a = (((r + k * 120) % 360) + 360) % 360;
    return a < 120 ? "loose" : a < 240 ? "tight" : "open";
  };
  const slotColor: Record<string, string> = { loose: "var(--ce-adp)", tight: "var(--ce-atp)", open: "var(--ce-halo)" };
  const rotorOff = ((r / 45) % 1) * 10;
  const hy = flowing ? ((Date.now() / 6) % 1) : 0;
  void hy;
  return (
    <g>
      <rect width={SW} height={270} fill="var(--ce-ims)" />
      <rect y={270} width={SW} height={60} fill="var(--ce-mito-b)" opacity={0.85} />
      <rect y={330} width={SW} height={270} fill="var(--ce-matrix)" />
      {showLabels ? (
        <g>
          <Label x={30} y={36} anchor="start" size={16}>Intermembrane space: high H⁺, positive, acidic</Label>
          <Label x={30} y={568} anchor="start" size={16}>Matrix: low H⁺, negative, more alkaline</Label>
        </g>
      ) : null}
      {HPOS.slice(0, nIms).map((p, i) => (
        <Chip key={i} x={p.x} y={p.y + (i % 3) * 4} r={10} color="var(--ce-h)" text="H⁺" fs={8} />
      ))}
      {Array.from({ length: nMat }, (_, i) => <Chip key={`m${i}`} x={110 + i * 190} y={520 - (i % 2) * 24} r={10} color="var(--ce-h)" text="H⁺" fs={8} op={0.8} />)}

      {/* ATP synthase */}
      <g transform="translate(480 0)">
        {/* stator and c-ring */}
        <rect x={60} y={246} width={46} height={100} rx={10} fill="var(--ce-work)" fillOpacity={0.45} stroke="var(--ce-work)" strokeWidth={3} />
        <rect x={-62} y={262} width={118} height={66} rx={14} fill="var(--ce-atp)" fillOpacity={0.35} stroke="var(--ce-line)" strokeWidth={3} />
        {Array.from({ length: 8 }, (_, i) => <line key={i} x1={-62 + 8 + i * 14 + rotorOff} y1={264} x2={-62 + 8 + i * 14 + rotorOff} y2={326} stroke="var(--ce-line)" strokeWidth={2} opacity={0.5} />)}
        <text x={-3} y={300} textAnchor="middle" fontSize={15} fontWeight={800} fill="var(--ce-ink)">c-ring (F₀)</text>
        {/* stalk */}
        <rect x={-10} y={328} width={14} height={50} fill="var(--ce-line)" opacity={0.7} />
        {/* F1 head */}
        <circle cx={-3} cy={440} r={74} fill="var(--ce-halo)" fillOpacity={0.6} stroke="var(--ce-line)" strokeWidth={3} />
        {[0, 1, 2].map((k) => {
          const a0 = (-90 + k * 120) * (Math.PI / 180);
          const a1 = (-90 + (k + 1) * 120) * (Math.PI / 180);
          const st = slot(k);
          return <path key={k} d={`M -3 440 L ${-3 + 72 * Math.cos(a0)} ${440 + 72 * Math.sin(a0)} A 72 72 0 0 1 ${-3 + 72 * Math.cos(a1)} ${440 + 72 * Math.sin(a1)} Z`} fill={slotColor[st]} fillOpacity={0.75} stroke="var(--ce-line)" strokeWidth={2} data-site={st} />;
        })}
        <g transform={`rotate(${r} -3 440)`}>
          <line x1={-3} y1={440} x2={-3} y2={392} stroke="var(--ce-ink)" strokeWidth={8} strokeLinecap="round" />
          <circle cx={-3} cy={440} r={10} fill="var(--ce-ink)" />
        </g>
        {showLabels ? (
          <g>
            <Label x={-3} y={540} size={15}>F₁ head (β subunits: loose · tight · open)</Label>
            <Label x={140} y={238} anchor="start" size={14} weight={500}>H⁺ channel</Label>
          </g>
        ) : null}
        {/* proton path */}
        {flowing ? (
          <g>
            <path d="M 83 215 L 83 345" stroke="var(--ce-h)" strokeWidth={5} className="ce-flow" />
            <Chip x={83} y={246 + ((r * 1.2) % 90)} r={10} color="var(--ce-h)" text="H⁺" fs={8} />
          </g>
        ) : null}
      </g>
      {/* ADP+Pi in, ATP out */}
      <Chip x={300} y={440} r={16} color="var(--ce-adp)" text="ADP" fs={9} />
      <Chip x={332} y={410} r={12} color="var(--ce-pi)" text="Pi" fs={9} />
      {atpShown > 0 ? Array.from({ length: Math.min(6, Math.ceil(atpShown)) }, (_, i) => <Chip key={i} x={690 + i * 36} y={470 + (i % 2) * 20} r={16} color="var(--ce-atp)" text="ATP" textColor="#1a1204" fs={9} />) : null}
      <Ledger x={700} y={90} w={240} title="Chemiosmosis" rows={[["Gradient", `${Math.round(g * 100)}%`], ["ATP made", live ? atp.toFixed(1) : `${atpShown}`], ["H⁺ per ATP", "≈ 4"]]} />
    </g>
  );
}
