"use client";

import { memo, useMemo, useRef, type KeyboardEvent, type PointerEvent } from "react";
import { useStageSize } from "@/features/simulation";
import { BEATS, STAGES, type StructureId } from "../data/stages";
import { BEAT_STAGE, CX, CY, VIEW_H, VIEW_W, chIndex, sceneAt, type ChromatidState, type SceneState } from "../engine/beats";
import { buildLabels } from "../engine/labels";
import { HOMOLOG_COLOR, HOMOLOG_NAME, SELECT_COLOR, mix } from "../../meiosis/engine/palette";
import { allChromatids, chromatidKey, chromosomeTag, homologOf, pairOf, sideOf, type ChromatidId, type MitosisPlan } from "../engine/plan";
import { cellPaths, chromatidPoints, kinetochorePoint, widthOf } from "../engine/shapes";
import type { BeatClock } from "../../meiosis/hooks/use-beat-timeline";
import { useClockPos } from "../../meiosis/hooks/use-beat-timeline";
import type { Viewport } from "../hooks/use-viewport";
import type { Selection, StagePick } from "../types";

export type PickMode = "none" | "explore" | "find";

export interface LabStageProps {
  plan: MitosisPlan;
  beats: SceneState[];
  clock: BeatClock;
  view: Viewport;
  onPan: (dx: number, dy: number) => void;
  showLabels: boolean;
  showSpindle: boolean;
  selected: Selection | null;
  /** Chromatids drawn as "the one the question is about"; everything else is dimmed. */
  highlight: ReadonlySet<string> | null;
  pickMode: PickMode;
  onPick: (p: StagePick) => void;
  ariaExtra?: string;
}

export const STAGE_STYLE = `
.mito-root{--m-field-a:#F8FCFB;--m-field-b:#E2F0EC;--m-cyto-a:#F4FBF8;--m-cyto-b:#C6E8DF;--m-membrane:#0E8F80;--m-nuc-a:#F6F0FF;--m-nuc-b:#DDD0F5;--m-nuc-line:#7C5BC4;--m-ink:#12302D;--m-fiber:#56668A;--m-halo:#FFFFFF;--m-centro:#6D4AC9;--m-plate:#C0392B;--m-kin:#D6336C;--m-wall:#7A9A3A;--m-plant:#4C8B2B}
:is(.dark,.midnight,.dracula,.nord,.monokai,.one-dark) .mito-root{--m-field-a:#10201F;--m-field-b:#0A1415;--m-cyto-a:#18393B;--m-cyto-b:#10292C;--m-membrane:#3DD1C0;--m-nuc-a:#2B2449;--m-nuc-b:#1E1836;--m-nuc-line:#A28BE6;--m-ink:#E8F4F2;--m-fiber:#A3B0D6;--m-halo:#0A1415;--m-centro:#B79CFF;--m-plate:#FF8A75;--m-kin:#FF7DAA;--m-wall:#B5D46B;--m-plant:#8FD16A}
.mito-root svg text{font-family:inherit}
.mito-hit{cursor:pointer;outline:none}
.mito-hit:focus-visible{outline:3px solid var(--m-ink);outline-offset:2px}
@keyframes mito-pulse{0%,100%{opacity:.95}50%{opacity:.45}}
.mito-pulse{animation:mito-pulse 1.4s ease-in-out infinite}
@media (prefers-reduced-motion: reduce){.mito-pulse{animation:none}}
`;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export type Level = "normal" | "selected" | "sister" | "dim";

/* ----------------------------------------------------------------------------------------- chromatid */

interface ChromatidViewProps {
  plan: MitosisPlan;
  id: ChromatidId;
  st: ChromatidState;
  level: Level;
  tag: string | null;
  fontSize: number;
  interactive: boolean;
  structInteractive: boolean;
  onPick: (p: StagePick) => void;
}

const keyActivate = (fn: () => void) => (e: KeyboardEvent) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fn();
  }
};

export const ChromatidView = memo(function ChromatidView({ plan, id, st, level, tag, fontSize, interactive, structInteractive, onPick }: ChromatidViewProps) {
  if (st.op < 0.02) return null;
  const color = HOMOLOG_COLOR[homologOf(id.k)];
  const side = sideOf(plan, id);
  const pts = chromatidPoints(plan, id, st);
  const W = widthOf(st.cond);
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const dHi = pts.map((p, i) => `${i === 0 ? "M" : "L"}${(p.x - W * 0.2).toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const dim = level === "dim" ? 0.35 : 1;
  const halo = level === "selected" ? { w: W + 13, c: SELECT_COLOR, o: 0.9 } : level === "sister" ? { w: W + 9, c: SELECT_COLOR, o: 0.45 } : null;
  const pickIt = () => onPick({ kind: "chromatid", k: id.k, s: id.s });
  const label = `Chromatid ${id.s + 1} of chromosome ${chromosomeTag(id.k)} (pair ${pairOf(id.k) + 1}, ${HOMOLOG_NAME[homologOf(id.k)]})`;
  const kinX = side * (W / 2 + 2) * (1 - st.fold);
  const kinY = -(W / 2 + 2) * st.fold;
  const kinOp = clamp01(st.kin);
  const condVis = clamp01((st.cond - 0.4) * 2);

  return (
    <g transform={`translate(${st.x.toFixed(1)} ${st.y.toFixed(1)}) rotate(${st.rot.toFixed(1)})`} opacity={(st.op * dim).toFixed(3)} data-chromatid={chromatidKey(id)} data-op={st.op.toFixed(2)} data-level={level}>
      {halo ? <path d={d} fill="none" stroke={halo.c} strokeWidth={halo.w} strokeLinecap="round" strokeLinejoin="round" opacity={halo.o} className={level === "selected" ? "mito-pulse" : undefined} /> : null}
      <path d={d} fill="none" stroke={mix(color, "#0A1020", 0.42)} strokeWidth={W + 3} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={W} strokeLinecap="round" strokeLinejoin="round" />
      <path d={dHi} fill="none" stroke={mix(color, "#FFFFFF", 0.55)} strokeOpacity={0.5} strokeWidth={Math.max(1.1, W * 0.26)} strokeLinecap="round" strokeLinejoin="round" />
      {/* centromere: the constriction where the two sisters are joined */}
      <circle cx={0} cy={0} r={W * 0.6} fill={mix(color, "#0A1020", 0.3)} stroke="#FFFFFF" strokeOpacity={0.85} strokeWidth={1.3} opacity={clamp01((st.cond - 0.3) * 2)} data-part="centromere" />
      {kinOp > 0.03 ? (
        <g transform={`translate(${kinX.toFixed(1)} ${kinY.toFixed(1)}) rotate(${(st.fold * 90).toFixed(1)})`} opacity={kinOp} data-part="kinetochore">
          <rect x={-2.8} y={-8} width={5.6} height={16} rx={2.8} fill="var(--m-kin)" stroke="var(--m-halo)" strokeWidth={1.2} />
        </g>
      ) : null}
      {condVis > 0.05 && st.cond > 0.9 ? <circle cx={0} cy={0} r={W * 0.2} fill="#FFFFFF" fillOpacity={0.9} pointerEvents="none" /> : null}
      {interactive ? (
        <path d={d} fill="none" stroke="transparent" strokeWidth={W + 16} strokeLinecap="round" pointerEvents="stroke" className="mito-hit" role="button" tabIndex={0} aria-label={label} onClick={pickIt} onKeyDown={keyActivate(pickIt)} />
      ) : null}
      {structInteractive && st.cond > 0.5 ? (
        <>
          <circle cx={0} cy={0} r={W * 0.6 + 3} fill="transparent" className="mito-hit" aria-label="Centromere" onClick={() => onPick({ kind: "structure", id: "centromere" })} />
          {kinOp > 0.4 ? (
            <g transform={`translate(${kinX.toFixed(1)} ${kinY.toFixed(1)})`}>
              <circle r={9} fill="transparent" className="mito-hit" aria-label="Kinetochore" onClick={() => onPick({ kind: "structure", id: "kinetochore" })} />
            </g>
          ) : null}
        </>
      ) : null}
      {tag ? (
        <text
          transform={`translate(${(pts[0]!.x * 0 - 0).toFixed(1)} ${(Math.min(...pts.map((p) => p.y)) - 9).toFixed(1)}) rotate(${(-st.rot).toFixed(1)})`}
          fontSize={fontSize}
          fontWeight={700}
          textAnchor="middle"
          fill="var(--m-ink)"
          stroke="var(--m-halo)"
          strokeWidth={fontSize * 0.3}
          paintOrder="stroke"
          pointerEvents="none"
        >
          {tag}
        </text>
      ) : null}
    </g>
  );
});

/* ----------------------------------------------------------------------------------------- centrosome */

function Centrosome({ x, y, op, selected, interactive, onPick }: { x: number; y: number; op: number; selected: boolean; interactive: boolean; onPick: (p: StagePick) => void }) {
  if (op < 0.03) return null;
  const pick = () => onPick({ kind: "structure", id: "centrosome" });
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`} opacity={op} data-centrosome="true">
      {selected ? <circle r={30} fill="none" stroke={SELECT_COLOR} strokeWidth={5} className="mito-pulse" /> : null}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1={Math.cos(a) * 12} y1={Math.sin(a) * 12} x2={Math.cos(a) * 27} y2={Math.sin(a) * 27} stroke="var(--m-fiber)" strokeOpacity={0.5} strokeWidth={1.4} strokeLinecap="round" />;
      })}
      <rect x={-12} y={-3.5} width={24} height={7} rx={3.5} fill="var(--m-centro)" stroke="var(--m-halo)" strokeWidth={1.2} />
      <rect x={-3.5} y={-12} width={7} height={24} rx={3.5} fill="var(--m-centro)" stroke="var(--m-halo)" strokeWidth={1.2} transform="translate(9 -9) scale(0.7)" opacity={0.85} />
      {interactive ? <circle r={28} fill="transparent" className="mito-hit" role="button" tabIndex={0} aria-label="Centrosome (spindle pole)" onClick={pick} onKeyDown={keyActivate(pick)} /> : null}
    </g>
  );
}

/* ----------------------------------------------------------------------------------------- the stage */

export function LabStage(props: LabStageProps) {
  const { plan, beats, clock, view, onPan, showLabels, showSpindle, selected, highlight, pickMode, onPick } = props;
  const pos = useClockPos(clock);
  const { width } = useStageSize();
  const scale = ((width || 760) / VIEW_W) * view.z;
  const fs = Math.min(30, Math.max(15, 13 / scale));
  const st = useMemo(() => sceneAt(beats, pos), [beats, pos]);
  const beat = Math.min(beats.length - 1, Math.max(0, Math.round(pos)));
  const stage = STAGES[BEAT_STAGE[beat]!]!;
  const s = st.s;
  const ids = useMemo(() => allChromatids(plan), [plan]);
  const paths = cellPaths(s, plan.plant);
  const structureSel = selected?.kind === "structure" ? selected.id : null;
  const chromSel = selected?.kind === "chromosome" ? selected : null;
  const plant = plan.plant;

  const interactiveChrom = pickMode !== "none";
  const interactiveStruct = pickMode === "explore" || pickMode === "find";
  const fiberPick = pickMode === "find";

  const levelOf = (id: ChromatidId): Level => {
    if (highlight) return highlight.has(chromatidKey(id)) ? "selected" : "dim";
    if (!chromSel) return "normal";
    if (id.k === chromSel.k && id.s === chromSel.s) return "selected";
    if (id.k === chromSel.k) return "sister";
    return "dim";
  };

  /* ---- viewBox (zoom and pan) */
  const vw = VIEW_W / view.z;
  const vh = VIEW_H / view.z;
  const vx = CX + view.px - vw / 2;
  const vy = CY + view.py - vh / 2;

  /* ---- kinetochore fibers: one per chromatid, from its own pole */
  const fibers: { key: string; x1: number; y1: number; x2: number; y2: number; op: number }[] = [];
  if (showSpindle) {
    for (const id of ids) {
      const c = st.ch[chIndex(id)]!;
      if (c.op < 0.5 || c.fib < 0.02) continue;
      const side = sideOf(plan, id);
      const [kx, ky] = kinetochorePoint(c, side);
      const px = side === -1 ? s.cLx : s.cRx;
      const py = side === -1 ? s.cLy : s.cRy;
      fibers.push({ key: chromatidKey(id), x1: px, y1: py, x2: px + (kx - px) * c.fib, y2: py + (ky - py) * c.fib, op: Math.min(1, s.sp + 0.2) });
    }
  }
  const polar: string[] = [];
  if (showSpindle && s.sp > 0.02) {
    for (const k of [-3, -1.5, 0, 1.5, 3]) {
      const bulge = k * 0.2 * s.b * 0.55;
      polar.push(`M${s.cLx.toFixed(1)} ${s.cLy.toFixed(1)} Q${CX} ${(CY + bulge * 2).toFixed(1)} ${s.cRx.toFixed(1)} ${s.cRy.toFixed(1)}`);
    }
  }

  /* ---- labels in the margins of the current view */
  const labels = showLabels ? buildLabels(plan, st, beat) : [];
  const left = labels.filter((l) => l.ax < CX).sort((a, b) => a.ay - b.ay);
  const right = labels.filter((l) => l.ax >= CX).sort((a, b) => a.ay - b.ay);
  const place = (list: typeof labels, side: "l" | "r") => list.map((l, i) => ({ ...l, tx: side === "l" ? vx + 14 / view.z : vx + vw - 14 / view.z, ty: vy + 30 / view.z + i * fs * 2.1, anchor: (side === "l" ? "start" : "end") as "start" | "end" }));
  const placed = [...place(left, "l"), ...place(right, "r")];

  const showTags = showLabels && beat >= 3 && beat <= 10;
  const tagFor = (id: ChromatidId): string | null => {
    if (!showTags) return null;
    if (beat < 8) return id.s === 0 ? chromosomeTag(id.k) : null;
    return plan.n <= 6 ? chromosomeTag(id.k) : null;
  };

  /* ---- panning by dragging the picture */
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const onDown = (e: PointerEvent<SVGSVGElement>) => {
    if (view.z <= 1.001) return;
    drag.current = { x: e.clientX, y: e.clientY, moved: false };
  };
  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < 5) return;
    if (!d.moved) {
      d.moved = true;
      e.currentTarget.setPointerCapture?.(e.pointerId);
    }
    d.x = e.clientX;
    d.y = e.clientY;
    onPan(-dx / scale, -dy / scale);
  };
  const onUp = () => {
    drag.current = null;
  };

  const sel = (id: StructureId) => structureSel === id;
  const strokeMembrane = sel("membrane") ? SELECT_COLOR : "var(--m-membrane)";
  const pinchY = s.b * (1 - 0.985 * s.fur);
  const nucleusPick = interactiveStruct ? () => onPick({ kind: "structure", id: "nucleus" }) : undefined;

  return (
    <div className="mito-root h-full w-full select-none" data-testid="mitosis-stage" data-beat={beat} data-stage={BEAT_STAGE[beat]} data-pos={pos.toFixed(3)} data-zoom={view.z.toFixed(2)} data-cell={plant ? "plant" : "animal"}>
      <style>{STAGE_STYLE}</style>
      <svg
        viewBox={`${vx.toFixed(1)} ${vy.toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`}
        className="h-full w-full"
        style={{ touchAction: view.z > 1.001 ? "none" : "pan-y", cursor: view.z > 1.001 ? "grab" : undefined }}
        role="img"
        aria-label={`Mitosis in ${plant ? "a plant" : "an animal"} cell, ${stage.label}. ${BEATS[beat]!.caption} The starting cell has ${plan.n} chromosomes. ${props.ariaExtra ?? ""}`}
        preserveAspectRatio="xMidYMid meet"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <defs>
          <radialGradient id="mito-field" cx="50%" cy="45%" r="75%">
            <stop offset="0%" style={{ stopColor: "var(--m-field-a)" }} />
            <stop offset="100%" style={{ stopColor: "var(--m-field-b)" }} />
          </radialGradient>
          <radialGradient id="mito-cyto" cx="40%" cy="34%" r="80%">
            <stop offset="0%" style={{ stopColor: "var(--m-cyto-a)" }} />
            <stop offset="100%" style={{ stopColor: "var(--m-cyto-b)" }} />
          </radialGradient>
          <radialGradient id="mito-nuc" cx="40%" cy="35%" r="80%">
            <stop offset="0%" style={{ stopColor: "var(--m-nuc-a)" }} />
            <stop offset="100%" style={{ stopColor: "var(--m-nuc-b)" }} />
          </radialGradient>
        </defs>
        <rect width={VIEW_W} height={VIEW_H} rx={18} fill="url(#mito-field)" />

        {/* cell wall (plant) and membrane */}
        <g data-part="membrane">
          {plant
            ? paths.map((d, i) => <path key={`w${i}`} d={d} fill="none" stroke="var(--m-wall)" strokeWidth={10} strokeLinejoin="round" opacity={0.9} />)
            : null}
          {paths.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="url(#mito-cyto)"
              stroke={strokeMembrane}
              strokeWidth={sel("membrane") ? 7 : 4}
              strokeLinejoin="round"
              className={interactiveStruct ? "mito-hit" : undefined}
              onClick={interactiveStruct ? () => onPick({ kind: "structure", id: "membrane" }) : undefined}
              tabIndex={interactiveStruct ? 0 : undefined}
              role={interactiveStruct ? "button" : undefined}
              aria-label={interactiveStruct ? "Cell membrane" : undefined}
              onKeyDown={interactiveStruct ? keyActivate(() => onPick({ kind: "structure", id: "membrane" })) : undefined}
            />
          ))}
        </g>

        {/* parent nucleus */}
        {s.nuc > 0.02 ? (
          <g data-part="nucleus" opacity={s.nuc}>
            <ellipse
              cx={CX}
              cy={CY}
              rx={s.nrx}
              ry={s.nry}
              fill="url(#mito-nuc)"
              stroke={sel("nucleus") ? SELECT_COLOR : "var(--m-nuc-line)"}
              strokeWidth={sel("nucleus") ? 6 : 3}
              strokeDasharray={s.frag > 0.05 ? `${(16 - 9 * s.frag).toFixed(1)} ${(4 + 24 * s.frag).toFixed(1)}` : undefined}
              className={interactiveStruct ? "mito-hit" : undefined}
              onClick={nucleusPick}
            />
            <circle cx={CX + 52} cy={CY - 14} r={20} fill="var(--m-nuc-line)" fillOpacity={0.28 * (1 - s.frag)} pointerEvents="none" />
          </g>
        ) : null}
        {/* daughter nuclei */}
        {s.nucQ > 0.02
          ? [-1, 1].map((side) => (
              <ellipse
                key={side}
                data-part="nucleus"
                cx={CX + side * s.nqx}
                cy={CY}
                rx={s.nqrx}
                ry={s.nqry}
                opacity={s.nucQ}
                fill="url(#mito-nuc)"
                stroke={sel("nucleus") ? SELECT_COLOR : "var(--m-nuc-line)"}
                strokeWidth={sel("nucleus") ? 6 : 3}
                strokeDasharray={s.nucQ < 0.95 ? "9 7" : undefined}
                className={interactiveStruct ? "mito-hit" : undefined}
                onClick={nucleusPick}
              />
            ))
          : null}

        {/* metaphase plate guide */}
        {s.plate > 0.02 ? (
          <g data-part="plate" opacity={s.plate * 0.85}>
            <line x1={CX} x2={CX} y1={CY - s.b + 14} y2={CY + s.b - 14} stroke={sel("plate") ? SELECT_COLOR : "var(--m-plate)"} strokeWidth={sel("plate") ? 5 : 2} strokeDasharray="8 8" pointerEvents="none" />
            {interactiveStruct ? <line x1={CX} x2={CX} y1={CY - s.b + 14} y2={CY + s.b - 14} stroke="transparent" strokeWidth={22} pointerEvents="stroke" className="mito-hit" role="button" aria-label="Metaphase plate" onClick={() => onPick({ kind: "structure", id: "plate" })} /> : null}
          </g>
        ) : null}

        {/* spindle */}
        <g data-part="spindle" stroke={sel("spindle") ? SELECT_COLOR : "var(--m-fiber)"} fill="none" strokeLinecap="round">
          {polar.map((d, i) => (
            <path key={`p${i}`} d={d} strokeWidth={sel("spindle") ? 3 : 1.3} opacity={s.sp * (sel("spindle") ? 1 : 0.4)} pointerEvents="none" />
          ))}
          {fibers.map((f) => (
            <g key={f.key} data-fiber="true">
              <line x1={f.x1} y1={f.y1} x2={f.x2} y2={f.y2} strokeWidth={sel("spindle") ? 3.2 : 1.8} opacity={f.op * 0.85} />
              {interactiveStruct || fiberPick ? (
                <line
                  x1={f.x1}
                  y1={f.y1}
                  x2={f.x2}
                  y2={f.y2}
                  stroke="transparent"
                  strokeWidth={16}
                  pointerEvents="stroke"
                  className="mito-hit"
                  onClick={() => onPick(fiberPick ? { kind: "fiber" } : { kind: "structure", id: "spindle" })}
                  role="button"
                  tabIndex={-1}
                  aria-label="Spindle fiber"
                />
              ) : null}
            </g>
          ))}
        </g>

        {/* centrosomes (animal) or pole caps (plant) */}
        <g data-part="centrosome">
          {plant ? (
            s.sp > 0.2 && s.sp * 1 > 0.2 && beat >= 3 && beat <= 10 ? (
              <>
                <ellipse cx={s.cLx} cy={s.cLy} rx={16} ry={44} fill="var(--m-fiber)" opacity={0.22 * s.sp} />
                <ellipse cx={s.cRx} cy={s.cRy} rx={16} ry={44} fill="var(--m-fiber)" opacity={0.22 * s.sp} />
              </>
            ) : null
          ) : (
            <>
              <Centrosome x={s.cLx} y={s.cLy} op={s.cL} selected={sel("centrosome")} interactive={interactiveStruct} onPick={onPick} />
              <Centrosome x={s.cRx} y={s.cRy} op={s.cR} selected={sel("centrosome")} interactive={interactiveStruct} onPick={onPick} />
            </>
          )}
        </g>

        {/* chromosomes */}
        <g data-part="chromosomes">
          {ids.map((id) => (
            <ChromatidView
              key={chromatidKey(id)}
              plan={plan}
              id={id}
              st={st.ch[chIndex(id)]!}
              level={levelOf(id)}
              tag={tagFor(id)}
              fontSize={fs * 0.85}
              interactive={interactiveChrom}
              structInteractive={interactiveStruct}
              onPick={onPick}
            />
          ))}
        </g>

        {/* highlight rings for a selected centromere / kinetochore structure */}
        {structureSel === "centromere" || structureSel === "kinetochore"
          ? ids.map((id) => {
              const c = st.ch[chIndex(id)]!;
              if (c.op < 0.3 || c.cond < 0.5) return null;
              const [x, y] = structureSel === "centromere" ? [c.x, c.y] : kinetochorePoint(c, sideOf(plan, id));
              if (structureSel === "kinetochore" && c.kin < 0.3) return null;
              return <circle key={chromatidKey(id)} cx={x} cy={y} r={structureSel === "centromere" ? 17 : 13} fill="none" stroke={SELECT_COLOR} strokeWidth={4} className="mito-pulse" pointerEvents="none" />;
            })
          : null}

        {/* cleavage furrow / contractile ring (animal) */}
        {!plant && s.ring > 0.03 && s.fur > 0.02 && s.sep < 0.5
          ? [-1, 1].map((side) => (
              <g key={side} data-part="furrow" opacity={Math.max(s.ring, sel("furrow") ? 1 : 0)}>
                <ellipse cx={CX} cy={CY + side * pinchY} rx={13} ry={8} fill="var(--m-plate)" fillOpacity={0.9} stroke="var(--m-halo)" strokeWidth={1.5} className={sel("furrow") ? "mito-pulse" : undefined} />
                {interactiveStruct ? <circle cx={CX} cy={CY + side * pinchY} r={26} fill="transparent" className="mito-hit" role="button" tabIndex={0} aria-label="Cleavage furrow" onClick={() => onPick({ kind: "structure", id: "furrow" })} onKeyDown={keyActivate(() => onPick({ kind: "structure", id: "furrow" }))} /> : null}
              </g>
            ))
          : null}

        {/* cell plate (plant) */}
        {plant && s.ring > 0.03 ? (
          <g data-part="cellplate">
            {(() => {
              const len = (s.b - 6) * s.ring;
              return (
                <>
                  <line x1={CX} x2={CX} y1={CY - len} y2={CY + len} stroke={sel("cellplate") ? SELECT_COLOR : "var(--m-plant)"} strokeWidth={s.ring > 0.97 ? 9 : 7} strokeDasharray={s.ring > 0.97 ? undefined : "2 7"} strokeLinecap="round" />
                  {interactiveStruct ? <line x1={CX} x2={CX} y1={CY - len} y2={CY + len} stroke="transparent" strokeWidth={24} pointerEvents="stroke" className="mito-hit" role="button" tabIndex={0} aria-label="Cell plate" onClick={() => onPick({ kind: "structure", id: "cellplate" })} onKeyDown={keyActivate(() => onPick({ kind: "structure", id: "cellplate" }))} /> : null}
                </>
              );
            })()}
          </g>
        ) : null}

        {/* labels */}
        <g pointerEvents="none" fontSize={fs} fontWeight={600}>
          {placed.map((l) => (
            <g key={l.id} data-label={l.id}>
              <polyline points={`${l.anchor === "start" ? l.tx + l.text.length * fs * 0.52 : l.tx - l.text.length * fs * 0.52},${l.ty - fs * 0.3} ${l.ax},${l.ay}`} fill="none" stroke="var(--m-ink)" strokeOpacity={0.7} strokeWidth={1.6 / Math.sqrt(view.z)} />
              <circle cx={l.ax} cy={l.ay} r={3.6} fill="var(--m-ink)" />
              <text x={l.tx} y={l.ty} textAnchor={l.anchor} fill="var(--m-ink)" stroke="var(--m-halo)" strokeWidth={fs * 0.3} paintOrder="stroke">
                {l.text}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

export type { StructureId };
