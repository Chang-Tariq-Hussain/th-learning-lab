"use client";

import { memo, useMemo, type KeyboardEvent } from "react";
import { useStageSize } from "@/features/simulation";
import { BEATS, STAGES, STRUCTURES, type StructureId } from "../data/stages";
import { buildLabels, chromosomeTag } from "../engine/labels";
import { BEAT_STAGE, CX, CY, SIS, VIEW_H, VIEW_W, chIndex, sceneAt, type ChromatidState, type SceneState } from "../engine/beats";
import { HOMOLOG_COLOR, HOMOLOG_NAME, SELECT_COLOR, mix } from "../engine/palette";
import {
  LOCI,
  alleleAt,
  allChromatids,
  chromatidKey,
  isCrossing,
  sideOf,
  vertOf,
  type ChromatidId,
  type MeiosisPlan,
} from "../engine/plan";
import { cellCentres, cellPaths, centromereOf, rodPoints } from "../engine/shapes";
import { useClockPos, type BeatClock } from "../hooks/use-beat-timeline";
import type { Selection, StagePick } from "../types";

export type PickMode = "none" | "explore" | "chromatid" | "find";

export interface LabStageProps {
  plan: MeiosisPlan;
  beats: SceneState[];
  clock: BeatClock;
  showLabels: boolean;
  selected: Selection | null;
  /** Chromatids drawn as "the one the question is about"; everything else is dimmed. */
  highlight: ReadonlySet<string> | null;
  pickMode: PickMode;
  onPick: (p: StagePick) => void;
  /** Optional frozen beat (used by activities that show one fixed scene). */
  ariaExtra?: string;
}

export const STAGE_STYLE = `
.meio-root{--m-field-a:#F8FCFB;--m-field-b:#E2F0EC;--m-cyto-a:#F4FBF8;--m-cyto-b:#C6E8DF;--m-membrane:#0E8F80;--m-nuc-a:#F6F0FF;--m-nuc-b:#DDD0F5;--m-nuc-line:#7C5BC4;--m-ink:#12302D;--m-fiber:#56668A;--m-halo:#FFFFFF;--m-centro:#6D4AC9;--m-plate:#C0392B}
:is(.dark,.midnight,.dracula,.nord,.monokai,.one-dark) .meio-root{--m-field-a:#10201F;--m-field-b:#0A1415;--m-cyto-a:#18393B;--m-cyto-b:#10292C;--m-membrane:#3DD1C0;--m-nuc-a:#2B2449;--m-nuc-b:#1E1836;--m-nuc-line:#A28BE6;--m-ink:#E8F4F2;--m-fiber:#A3B0D6;--m-halo:#0A1415;--m-centro:#B79CFF;--m-plate:#FF8A75}
.meio-root svg text{font-family:inherit}
.meio-hit{cursor:pointer;outline:none}
.meio-hit:focus-visible{outline:3px solid var(--m-ink);outline-offset:2px}
@keyframes meio-pulse{0%,100%{opacity:.95}50%{opacity:.45}}
.meio-pulse{animation:meio-pulse 1.4s ease-in-out infinite}
@media (prefers-reduced-motion: reduce){.meio-pulse{animation:none}}
`;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/* ----------------------------------------------------------------------------------------- chromatid */

export type Level = "normal" | "selected" | "sister" | "homolog" | "dim";

interface ChromatidViewProps {
  plan: MeiosisPlan;
  id: ChromatidId;
  st: ChromatidState;
  level: Level;
  letters: boolean;
  fontSize: number;
  tag: boolean;
  interactive: boolean;
  onPick: (p: StagePick) => void;
}

export const ChromatidView = memo(function ChromatidView({ plan, id, st, level, letters, fontSize, tag, interactive, onPick }: ChromatidViewProps) {
  if (st.op < 0.02) return null;
  const spec = plan.specs[id.pair]!;
  const cross = plan.cross[id.pair];
  const crossing = isCrossing(plan, id);
  const own = HOMOLOG_COLOR[id.homolog];
  const partner = HOMOLOG_COLOR[(1 - id.homolog) as 0 | 1];
  const tail = crossing ? mix(own, partner, clamp01(st.swap)) : own;
  const pts = rodPoints(spec, st, crossing && cross ? cross.at : null, id.pair * 1.7 + id.homolog * 2.3 + id.sister);
  const W = 4.5 + 10.5 * st.cond;
  const split = crossing && cross && st.swap > 0.02 ? cross.at : null;

  const top = split === null ? pts : pts.filter((p) => p.s <= split + 1e-6);
  const bottom = split === null ? [] : pts.filter((p) => p.s >= split - 1e-6);
  const d = (arr: typeof pts, dx = 0) => arr.map((p, i) => `${i === 0 ? "M" : "L"}${(p.x + dx).toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const segments: { pts: typeof pts; color: string }[] = [{ pts: top, color: own }];
  if (bottom.length) segments.push({ pts: bottom, color: tail });

  const dim = level === "dim" ? 0.4 : 1;
  const key = chromatidKey(id);
  const condVis = clamp01((st.cond - 0.5) * 2.2);
  const lead0 = pts.find((p) => p.s >= spec.centromere) ?? pts[0]!;
  const fullD = d(pts);
  const halo = level === "selected" ? { w: W + 13, c: SELECT_COLOR, o: 0.9 } : level === "sister" ? { w: W + 9, c: SELECT_COLOR, o: 0.5 } : level === "homolog" ? { w: W + 9, c: "var(--m-ink)", o: 0.28 } : null;

  const pickIt = () => onPick({ kind: "chromatid", id });
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      pickIt();
    }
  };
  const label = `Chromatid, pair ${id.pair + 1}, ${HOMOLOG_NAME[id.homolog]} chromosome, sister ${id.sister + 1}`;

  return (
    <g
      transform={`translate(${st.x.toFixed(1)} ${st.y.toFixed(1)}) rotate(${st.rot.toFixed(1)})`}
      opacity={(st.op * dim).toFixed(3)}
      data-chromatid={key}
      data-op={st.op.toFixed(2)}
      data-level={level}
    >
      {halo ? (
        <path
          d={fullD}
          fill="none"
          stroke={halo.c}
          strokeWidth={halo.w}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={halo.o}
          strokeDasharray={level === "homolog" ? "2 7" : undefined}
          className={level === "selected" ? "meio-pulse" : undefined}
        />
      ) : null}
      {segments.map((seg, i) => (
        <g key={i}>
          <path d={d(seg.pts)} fill="none" stroke={mix(seg.color, "#0A1020", 0.42)} strokeWidth={W + 3} strokeLinecap="round" strokeLinejoin="round" />
          <path d={d(seg.pts)} fill="none" stroke={seg.color} strokeWidth={W} strokeLinecap="round" strokeLinejoin="round" />
          <path d={d(seg.pts, -W * 0.2)} fill="none" stroke={mix(seg.color, "#FFFFFF", 0.55)} strokeOpacity={0.5} strokeWidth={Math.max(1.2, W * 0.28)} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
      {condVis > 0.05
        ? LOCI.map((s, k) => {
            const p = pts.reduce((best, q) => (Math.abs(q.s - s) < Math.abs(best.s - s) ? q : best), pts[0]!);
            const letter = alleleAt(plan, id, k as 0 | 1);
            const col = letter === letter.toUpperCase() ? HOMOLOG_COLOR[0] : HOMOLOG_COLOR[1];
            void col;
            // while the exchange is still in progress show the allele the chromatid carries right now
            const shown = crossing && st.swap < 0.5 && k === 1 ? (id.homolog === 0 ? spec.genes[1] : spec.genes[1].toLowerCase()) : letter;
            return (
              <g key={k} opacity={condVis}>
                <rect x={p.x - W / 2 - 1} y={p.y - 2.4} width={W + 2} height={4.8} rx={2.4} fill="#FFFFFF" fillOpacity={0.86} stroke="#0A1020" strokeOpacity={0.45} strokeWidth={0.8} />
                {letters ? (
                  <text
                    transform={`translate(${(p.x + (id.sister === 0 ? -1 : 1) * (W / 2 + fontSize * 0.55)).toFixed(1)} ${(p.y + fontSize * 0.35).toFixed(1)}) rotate(${(-st.rot).toFixed(1)})`}
                    fontSize={fontSize}
                    fontWeight={700}
                    textAnchor="middle"
                    fill="var(--m-ink)"
                    stroke="var(--m-halo)"
                    strokeWidth={fontSize * 0.28}
                    paintOrder="stroke"
                  >
                    {shown}
                  </text>
                ) : null}
              </g>
            );
          })
        : null}
      <circle cx={st.lead} cy={0} r={W * 0.62} fill={mix(own, "#0A1020", 0.3)} stroke="#FFFFFF" strokeOpacity={0.85} strokeWidth={1.4} opacity={clamp01((st.cond - 0.3) * 2)} />
      {tag && id.sister === 0 ? (
        <text
          transform={`translate(${(lead0.x - 0).toFixed(1)} ${(pts[0]!.y - 10).toFixed(1)}) rotate(${(-st.rot).toFixed(1)})`}
          fontSize={fontSize}
          fontWeight={700}
          textAnchor="middle"
          fill="var(--m-ink)"
          stroke="var(--m-halo)"
          strokeWidth={fontSize * 0.3}
          paintOrder="stroke"
          pointerEvents="none"
        >
          {chromosomeTag(id.pair, id.homolog)}
        </text>
      ) : null}
      {interactive ? (
        <path
          d={fullD}
          fill="none"
          stroke="transparent"
          strokeWidth={W + 16}
          strokeLinecap="round"
          pointerEvents="stroke"
          className="meio-hit"
          role="button"
          tabIndex={0}
          aria-label={label}
          onClick={pickIt}
          onKeyDown={onKey}
        />
      ) : null}
    </g>
  );
});

/* ----------------------------------------------------------------------------------------- centrosome */

function Centrosome({ x, y, op, selected, interactive, onPick }: { x: number; y: number; op: number; selected: boolean; interactive: boolean; onPick: (p: StagePick) => void }) {
  if (op < 0.03) return null;
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`} opacity={op}>
      {selected ? <circle r={30} fill="none" stroke={SELECT_COLOR} strokeWidth={5} className="meio-pulse" /> : null}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1={Math.cos(a) * 12} y1={Math.sin(a) * 12} x2={Math.cos(a) * 27} y2={Math.sin(a) * 27} stroke="var(--m-fiber)" strokeOpacity={0.5} strokeWidth={1.4} strokeLinecap="round" />;
      })}
      <rect x={-12} y={-3.5} width={24} height={7} rx={3.5} fill="var(--m-centro)" stroke="var(--m-halo)" strokeWidth={1.2} />
      <rect x={-3.5} y={-12} width={7} height={24} rx={3.5} fill="var(--m-centro)" stroke="var(--m-halo)" strokeWidth={1.2} transform="translate(9 -9) scale(0.7)" opacity={0.85} />
      {interactive ? (
        <circle
          r={28}
          fill="transparent"
          className="meio-hit"
          role="button"
          tabIndex={0}
          aria-label="Centrosome (spindle pole)"
          onClick={() => onPick({ kind: "structure", id: "centrosome" })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onPick({ kind: "structure", id: "centrosome" });
            }
          }}
        />
      ) : null}
    </g>
  );
}

/* ----------------------------------------------------------------------------------------- the stage */

export function LabStage(props: LabStageProps) {
  const { plan, beats, clock, showLabels, selected, highlight, pickMode, onPick } = props;
  const pos = useClockPos(clock);
  const { width } = useStageSize();
  const scale = (width || 760) / VIEW_W;
  const fs = Math.min(28, Math.max(15, 13 / scale));
  const st = useMemo(() => sceneAt(beats, pos), [beats, pos]);
  const beat = Math.min(beats.length - 1, Math.max(0, Math.round(pos)));
  const stage = STAGES[BEAT_STAGE[beat]!]!;
  const sc = st.s;
  const ids = useMemo(() => allChromatids(plan), [plan]);
  const paths = cellPaths(sc);
  const centres = cellCentres(sc);
  const structureSel = selected?.kind === "structure" ? selected.id : null;
  const chromSel = selected?.kind === "chromatid" ? selected.id : null;

  const interactiveChrom = pickMode === "explore" || pickMode === "chromatid" || pickMode === "find";
  const interactiveStruct = pickMode === "explore" || pickMode === "find";
  const fiberPick = pickMode === "find";

  const levelOf = (id: ChromatidId): Level => {
    if (highlight) return highlight.has(chromatidKey(id)) ? "selected" : "dim";
    if (structureSel === "tetrad") return "sister";
    if (structureSel === "centromere" || structureSel === "chiasma") return "normal";
    if (!chromSel) return "normal";
    if (id.pair === chromSel.pair && id.homolog === chromSel.homolog && id.sister === chromSel.sister) return "selected";
    if (id.pair === chromSel.pair && id.homolog === chromSel.homolog) return "sister";
    if (id.pair === chromSel.pair) return "homolog";
    return "dim";
  };

  /* ---- fibers: one per chromatid, to its own pole */
  const fibers: { key: string; x1: number; y1: number; x2: number; y2: number; op: number }[] = [];
  for (const id of ids) {
    const c = st.ch[chIndex(id)]!;
    if (c.op < 0.5) continue;
    const [kx, ky] = centromereOf(c);
    const side = sideOf(plan, id.pair, id.homolog);
    if (sc.sp1 > 0.02) {
      const px = side === 0 ? sc.cLx : sc.cRx;
      const py = side === 0 ? sc.cLy : sc.cRy;
      fibers.push({ key: `a-${chromatidKey(id)}`, x1: px, y1: py, x2: px + (kx - px) * sc.fib1, y2: py + (ky - py) * sc.fib1, op: sc.sp1 });
    }
    if (sc.sp2 > 0.02) {
      const vert = vertOf(plan, id);
      const i = (side * 2 + vert) * 2;
      const px = sc.c2[i]!;
      const py = sc.c2[i + 1]!;
      fibers.push({ key: `b-${chromatidKey(id)}`, x1: px, y1: py, x2: px + (kx - px) * sc.fib2, y2: py + (ky - py) * sc.fib2, op: sc.sp2 });
    }
  }

  const polar: string[] = [];
  if (sc.sp1 > 0.02) {
    for (const k of [-3, -1.5, 0, 1.5, 3]) {
      const bulge = k * 0.2 * sc.ry1 * 0.55;
      polar.push(`M${sc.cLx.toFixed(1)} ${sc.cLy.toFixed(1)} Q${CX} ${(CY + bulge * 2).toFixed(1)} ${sc.cRx.toFixed(1)} ${sc.cRy.toFixed(1)}`);
    }
  }
  const polar2: string[] = [];
  if (sc.sp2 > 0.02) {
    for (const side of [0, 1]) {
      const cx = CX + (side === 0 ? -226 : 226);
      for (const k of [-2, 0, 2]) {
        const bulge = k * 0.2 * sc.r1 * 0.9;
        polar2.push(`M${sc.c2[side * 4]!.toFixed(1)} ${sc.c2[side * 4 + 1]!.toFixed(1)} Q${(cx + bulge * 2).toFixed(1)} ${CY} ${sc.c2[side * 4 + 2]!.toFixed(1)} ${sc.c2[side * 4 + 3]!.toFixed(1)}`);
      }
    }
  }

  /* ---- crossing rings (chiasma) */
  const chiasmata: { key: string; x: number; y: number; op: number }[] = [];
  plan.cross.forEach((c, pair) => {
    if (!c) return;
    const spec = plan.specs[pair]!;
    const idm: ChromatidId = { pair, homolog: 0, sister: c.mSister };
    const idp: ChromatidId = { pair, homolog: 1, sister: c.pSister };
    const a = st.ch[chIndex(idm)]!;
    const b = st.ch[chIndex(idp)]!;
    const y = (a.y + b.y) / 2 + (c.at - spec.centromere) * spec.length;
    const x = (a.x + b.x) / 2;
    const op = clamp01(a.chi !== 0 || b.chi !== 0 ? Math.abs(a.chi) / 24 : 0) * clamp01(1 - Math.abs(a.rot) / 20);
    const keep = beat >= 4 && beat <= 6 ? 0.55 : 0;
    chiasmata.push({ key: `x${pair}`, x, y, op: Math.max(op, keep * clamp01(1 - Math.abs(pos - 5) / 1.6)) });
  });

  const labels = showLabels ? buildLabels(plan, st, beat) : [];
  // place label text in two margins, stacked top-down
  const leftLabels = labels.filter((l) => l.ax < CX).sort((a, b) => a.ay - b.ay);
  const rightLabels = labels.filter((l) => l.ax >= CX).sort((a, b) => a.ay - b.ay);
  const placeCol = (list: typeof labels, side: "l" | "r") =>
    list.map((l, i) => ({ ...l, tx: side === "l" ? 16 : VIEW_W - 16, ty: 34 + i * (fs * 2.1), anchor: (side === "l" ? "start" : "end") as "start" | "end" }));
  const placed = [...placeCol(leftLabels, "l"), ...placeCol(rightLabels, "r")];

  const showTags = showLabels && beat <= 14;
  const nucQ = centres.length === 4 ? centres : [];

  return (
    <div className="meio-root h-full w-full select-none" data-testid="meiosis-stage" data-beat={beat} data-stage={BEAT_STAGE[beat]} data-pos={pos.toFixed(3)}>
      <style>{STAGE_STYLE}</style>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="h-full w-full"
        role="img"
        aria-label={`Meiosis, ${stage.label}. ${BEATS[beat]!.caption} Cell with ${plan.pairs * 2} chromosomes in the starting cell. ${props.ariaExtra ?? ""}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="meio-field" cx="50%" cy="45%" r="75%">
            <stop offset="0%" style={{ stopColor: "var(--m-field-a)" }} />
            <stop offset="100%" style={{ stopColor: "var(--m-field-b)" }} />
          </radialGradient>
          <radialGradient id="meio-cyto" cx="40%" cy="34%" r="80%">
            <stop offset="0%" style={{ stopColor: "var(--m-cyto-a)" }} />
            <stop offset="100%" style={{ stopColor: "var(--m-cyto-b)" }} />
          </radialGradient>
          <radialGradient id="meio-nuc" cx="40%" cy="35%" r="80%">
            <stop offset="0%" style={{ stopColor: "var(--m-nuc-a)" }} />
            <stop offset="100%" style={{ stopColor: "var(--m-nuc-b)" }} />
          </radialGradient>
        </defs>
        <rect width={VIEW_W} height={VIEW_H} rx={18} fill="url(#meio-field)" />

        {/* cell membrane(s) */}
        <g data-part="membrane">
          {paths.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="url(#meio-cyto)"
              stroke={structureSel === "membrane" ? SELECT_COLOR : "var(--m-membrane)"}
              strokeWidth={structureSel === "membrane" ? 7 : 4}
              strokeLinejoin="round"
              className={interactiveStruct ? "meio-hit" : undefined}
              onClick={interactiveStruct ? () => onPick({ kind: "structure", id: "membrane" }) : undefined}
              tabIndex={interactiveStruct ? 0 : undefined}
              role={interactiveStruct ? "button" : undefined}
              aria-label={interactiveStruct ? "Cell membrane" : undefined}
              onKeyDown={
                interactiveStruct
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onPick({ kind: "structure", id: "membrane" });
                      }
                    }
                  : undefined
              }
            />
          ))}
        </g>

        {/* nucleus */}
        {sc.nuc > 0.02 ? (
          <g data-part="nucleus" opacity={sc.nuc}>
            <ellipse
              cx={CX}
              cy={CY}
              rx={sc.nrx}
              ry={sc.nry}
              fill="url(#meio-nuc)"
              stroke={structureSel === "nucleus" ? SELECT_COLOR : "var(--m-nuc-line)"}
              strokeWidth={structureSel === "nucleus" ? 6 : 3}
              className={interactiveStruct ? "meio-hit" : undefined}
              onClick={interactiveStruct ? () => onPick({ kind: "structure", id: "nucleus" }) : undefined}
            />
            <ellipse cx={CX} cy={CY} rx={sc.nrx - 7} ry={sc.nry - 7} fill="none" stroke="var(--m-nuc-line)" strokeOpacity={0.5} strokeDasharray="4 6" strokeWidth={2} pointerEvents="none" />
            <circle cx={CX + 40} cy={CY - 6} r={20} fill="var(--m-nuc-line)" fillOpacity={0.28} pointerEvents="none" />
          </g>
        ) : null}
        {sc.nucQ > 0.02
          ? nucQ.map((c, i) => (
              <ellipse
                key={i}
                data-part="nucleus"
                cx={c.x}
                cy={c.y}
                rx={c.rx * 0.64}
                ry={c.ry * 0.62}
                opacity={sc.nucQ}
                fill="url(#meio-nuc)"
                stroke={structureSel === "nucleus" ? SELECT_COLOR : "var(--m-nuc-line)"}
                strokeWidth={structureSel === "nucleus" ? 5 : 2.5}
                onClick={interactiveStruct ? () => onPick({ kind: "structure", id: "nucleus" }) : undefined}
                className={interactiveStruct ? "meio-hit" : undefined}
              />
            ))
          : null}

        {/* metaphase plate guides */}
        {sc.plate1 > 0.02 ? (
          <line x1={CX} x2={CX} y1={CY - sc.ry1 + 14} y2={CY + sc.ry1 - 14} stroke={structureSel === "plate" ? SELECT_COLOR : "var(--m-plate)"} strokeWidth={structureSel === "plate" ? 5 : 2} strokeDasharray="8 8" opacity={sc.plate1 * 0.8} pointerEvents="none" data-part="plate" />
        ) : null}
        {sc.plate2 > 0.02
          ? [-226, 226].map((dx) => (
              <line key={dx} x1={CX + dx - sc.r1 + 14} x2={CX + dx + sc.r1 - 14} y1={CY} y2={CY} stroke={structureSel === "plate" ? SELECT_COLOR : "var(--m-plate)"} strokeWidth={structureSel === "plate" ? 5 : 2} strokeDasharray="8 8" opacity={sc.plate2 * 0.8} pointerEvents="none" data-part="plate" />
            ))
          : null}

        {/* spindle */}
        <g data-part="spindle" stroke={structureSel === "spindle" ? SELECT_COLOR : "var(--m-fiber)"} fill="none" strokeLinecap="round">
          {polar.map((d, i) => (
            <path key={`p1${i}`} d={d} strokeWidth={structureSel === "spindle" ? 3 : 1.3} opacity={sc.sp1 * sc.fib1 * (structureSel === "spindle" ? 1 : 0.4)} pointerEvents="none" />
          ))}
          {polar2.map((d, i) => (
            <path key={`p2${i}`} d={d} strokeWidth={structureSel === "spindle" ? 3 : 1.3} opacity={sc.sp2 * sc.fib2 * (structureSel === "spindle" ? 1 : 0.4)} pointerEvents="none" />
          ))}
          {fibers.map((f) => (
            <g key={f.key} data-fiber="true">
              <line x1={f.x1} y1={f.y1} x2={f.x2} y2={f.y2} strokeWidth={structureSel === "spindle" ? 3.2 : 1.8} opacity={f.op * 0.85} />
              {interactiveStruct || fiberPick ? (
                <line
                  x1={f.x1}
                  y1={f.y1}
                  x2={f.x2}
                  y2={f.y2}
                  stroke="transparent"
                  strokeWidth={16}
                  pointerEvents="stroke"
                  className="meio-hit"
                  onClick={() => onPick(fiberPick ? { kind: "fiber" } : { kind: "structure", id: "spindle" })}
                  role="button"
                  tabIndex={0}
                  aria-label="Spindle fiber"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onPick(fiberPick ? { kind: "fiber" } : { kind: "structure", id: "spindle" });
                    }
                  }}
                />
              ) : null}
            </g>
          ))}
        </g>

        {/* centrosomes */}
        <g data-part="centrosome">
          <Centrosome x={sc.cLx} y={sc.cLy} op={sc.cI} selected={structureSel === "centrosome"} interactive={interactiveStruct} onPick={onPick} />
          <Centrosome x={sc.cRx} y={sc.cRy} op={sc.cI} selected={structureSel === "centrosome"} interactive={interactiveStruct} onPick={onPick} />
          {[0, 1, 2, 3].map((i) => (
            <Centrosome key={i} x={sc.c2[i * 2]!} y={sc.c2[i * 2 + 1]!} op={sc.cII} selected={structureSel === "centrosome"} interactive={interactiveStruct} onPick={onPick} />
          ))}
        </g>

        {/* sister cohesion (the joined centromere region) */}
        <g pointerEvents="none">
          {Array.from({ length: plan.pairs * 2 }, (_, k) => {
            const pair = k >> 1;
            const homolog = (k & 1) as 0 | 1;
            const a = st.ch[chIndex({ pair, homolog, sister: 0 })]!;
            const b = st.ch[chIndex({ pair, homolog, sister: 1 })]!;
            const [ax, ay] = centromereOf(a);
            const [bx, by] = centromereOf(b);
            const d = Math.hypot(ax - bx, ay - by);
            const op = Math.min(a.op, b.op) * clamp01(1 - (d - SIS - 6) / 40);
            if (op < 0.03) return null;
            const W = 4.5 + 10.5 * a.cond;
            return <line key={k} x1={ax} y1={ay} x2={bx} y2={by} stroke={mix(HOMOLOG_COLOR[homolog], "#0A1020", 0.3)} strokeWidth={W * 0.85} strokeLinecap="round" opacity={op} />;
          })}
        </g>

        {/* chromatids */}
        <g data-part="chromosomes">
          {ids.map((id) => (
            <ChromatidView
              key={chromatidKey(id)}
              plan={plan}
              id={id}
              st={st.ch[chIndex(id)]!}
              level={levelOf(id)}
              letters={showLabels && beat >= 1 && beat <= 15}
              fontSize={fs * 0.85}
              tag={showTags}
              interactive={interactiveChrom}
              onPick={onPick}
            />
          ))}
        </g>

        {/* chiasma / crossover rings */}
        {chiasmata.map((c) =>
          c.op > 0.03 ? (
            <g key={c.key} data-part="chiasma" opacity={Math.max(c.op, structureSel === "chiasma" ? 1 : 0)}>
              <circle cx={c.x} cy={c.y} r={32} fill="none" stroke={structureSel === "chiasma" ? SELECT_COLOR : "var(--m-ink)"} strokeWidth={structureSel === "chiasma" ? 5 : 2.2} strokeDasharray="5 5" className={structureSel === "chiasma" ? "meio-pulse" : undefined} pointerEvents="none" />
            </g>
          ) : null,
        )}
        {structureSel === "centromere"
          ? ids.map((id) => {
              const c = st.ch[chIndex(id)]!;
              if (c.op < 0.3) return null;
              const [x, y] = centromereOf(c);
              return <circle key={chromatidKey(id)} cx={x} cy={y} r={16} fill="none" stroke={SELECT_COLOR} strokeWidth={4} className="meio-pulse" pointerEvents="none" />;
            })
          : null}

        {/* labels */}
        <g pointerEvents="none" fontSize={fs} fontWeight={600}>
          {placed.map((l) => (
            <g key={l.id} data-label={l.id}>
              <polyline points={`${l.anchor === "start" ? l.tx + l.text.length * fs * 0.52 : l.tx - l.text.length * fs * 0.52},${l.ty - fs * 0.3} ${l.ax},${l.ay}`} fill="none" stroke="var(--m-ink)" strokeOpacity={0.7} strokeWidth={1.6} />
              <circle cx={l.ax} cy={l.ay} r={3.6} fill="var(--m-ink)" />
              <text x={l.tx} y={l.ty} textAnchor={l.anchor} fill="var(--m-ink)" stroke="var(--m-halo)" strokeWidth={fs * 0.3} paintOrder="stroke">
                {l.text}
              </text>
            </g>
          ))}
        </g>
        {void STRUCTURES as unknown as null}
      </svg>
    </div>
  );
}

export type { StructureId };
