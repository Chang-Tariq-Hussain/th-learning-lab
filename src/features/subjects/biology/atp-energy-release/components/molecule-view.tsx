"use client";

import { useRef, type KeyboardEvent, type PointerEvent } from "react";
import { useStageSize } from "@/features/simulation";
import { CENTRES, PARTS, PHOSPHATE_R, project, ringPoints, type MoleculeKind, type P3, type PartId } from "../model";

export interface MoleculeViewProps {
  kinds: MoleculeKind[];
  ry: number;
  rx: number;
  zoom: number;
  selected: PartId | null;
  highlightPhosphates: boolean;
  showLabels: boolean;
  /** Parts drawn as faded (used by Identify mode so only the clicked part reveals its name). */
  hideNames?: boolean;
  onPick: (id: PartId) => void;
  onRotate: (dy: number, dx: number) => void;
}

type Item = { z: number; key: string; node: React.ReactNode };

const poly = (pts: { x: number; y: number }[]) => pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

/** Pseudo-3D ATP / ADP model drawn as SVG: every part is a real 3D shape projected with perspective, so dragging truly rotates it. */
export function MoleculeView({ kinds, ry, rx, zoom, selected, highlightPhosphates, showLabels, hideNames, onPick, onRotate }: MoleculeViewProps) {
  const { width, height } = useStageSize();
  const drag = useRef<{ x: number; y: number } | null>(null);
  const W = 960;
  const H = kinds.length === 2 ? 640 : 420;

  const down = (e: PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
  };
  const move = (e: PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    drag.current = { x: e.clientX, y: e.clientY };
    onRotate(dx * 0.012, dy * 0.012);
  };
  const up = () => (drag.current = null);
  const key = (e: KeyboardEvent) => {
    const step = 0.12;
    if (e.key === "ArrowLeft") (e.preventDefault(), onRotate(-step, 0));
    else if (e.key === "ArrowRight") (e.preventDefault(), onRotate(step, 0));
    else if (e.key === "ArrowUp") (e.preventDefault(), onRotate(0, -step));
    else if (e.key === "ArrowDown") (e.preventDefault(), onRotate(0, step));
  };

  const draw = (kind: MoleculeKind, oy: number, scale: number) => {
    const items: Item[] = [];
    const P = (p: P3) => project(p, ry, rx);
    const sel = (id: PartId) => selected === id;
    const phosphateIds: PartId[] = kind === "ATP" ? ["pAlpha", "pBeta", "pGamma"] : ["pAlpha", "pBeta"];

    /* bonds first (they are always drawn beneath, but depth-sorted with their parts via z of midpoint) */
    const chain: Exclude<PartId, "pi">[] = ["adenine", "ribose", ...(phosphateIds as Exclude<PartId, "pi">[])];
    for (let i = 0; i < chain.length - 1; i++) {
      const a = P(CENTRES[chain[i]!]);
      const b = P(CENTRES[chain[i + 1]!]);
      const hot = kind === "ATP" && chain[i + 1] === "pGamma" && highlightPhosphates;
      items.push({
        z: Math.min(a.z, b.z) - 1,
        key: `bond-${kind}-${i}`,
        node: <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={hot ? "var(--ce-atp)" : "var(--ce-line)"} strokeWidth={hot ? 7 : 5} strokeLinecap="round" opacity={hot ? 0.9 : 0.55} />,
      });
    }

    /* rings */
    (["adenine", "ribose"] as const).forEach((id) => {
      const r = ringPoints(id);
      const c = P(CENTRES[id]);
      const color = id === "adenine" ? "var(--ce-adenine)" : "var(--ce-ribose)";
      const on = sel(id);
      const hexP = r.hex?.map(P);
      const pentP = r.pent.map(P);
      items.push({
        z: c.z,
        key: `${kind}-${id}`,
        node: (
          <g className="ce-hit" role="button" tabIndex={0} aria-label={`${PARTS[id].name}${on ? ", selected" : ""}`} aria-pressed={on} data-part={id} onClick={() => onPick(id)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onPick(id))}>
            {hexP ? <polygon points={poly(hexP)} fill={color} fillOpacity={0.78} stroke={on ? "var(--ce-sel)" : "var(--ce-line)"} strokeWidth={on ? 5 : 2.5} strokeLinejoin="round" /> : null}
            <polygon points={poly(pentP)} fill={color} fillOpacity={id === "adenine" ? 0.55 : 0.8} stroke={on ? "var(--ce-sel)" : "var(--ce-line)"} strokeWidth={on ? 5 : 2.5} strokeLinejoin="round" />
            {id === "adenine" && hexP ? hexP.filter((_, i) => i % 2 === 0).map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={5 * c.s} fill="var(--ce-halo)" stroke="var(--ce-line)" strokeWidth={1.5} />) : null}
          </g>
        ),
      });
      if (showLabels && !hideNames) {
        items.push({ z: 999, key: `${kind}-${id}-l`, node: <text x={c.x} y={c.y + 76 * c.s} textAnchor="middle" fontSize={20} fontWeight={600} fill="var(--ce-ink)" stroke="var(--ce-halo)" strokeWidth={4} paintOrder="stroke">{PARTS[id].name}</text> });
      }
    });

    /* phosphates */
    phosphateIds.forEach((id, i) => {
      const c = P(CENTRES[id as Exclude<PartId, "pi">]);
      const r = PHOSPHATE_R * c.s;
      const on = sel(id);
      const hot = highlightPhosphates;
      const fill = hot ? "var(--ce-atp)" : "var(--ce-atp)";
      items.push({
        z: c.z,
        key: `${kind}-${id}`,
        node: (
          <g className="ce-hit" role="button" tabIndex={0} aria-label={`${PARTS[id].name}${on ? ", selected" : ""}`} aria-pressed={on} data-part={id} onClick={() => onPick(id)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onPick(id))}>
            {hot ? <circle cx={c.x} cy={c.y} r={r + 11} fill="none" stroke="var(--ce-atp)" strokeWidth={3} strokeDasharray="5 5" className="ce-pulse" /> : null}
            <circle cx={c.x} cy={c.y} r={r} fill={fill} fillOpacity={kind === "ADP" ? 0.8 : 1} stroke={on ? "var(--ce-sel)" : "var(--ce-line)"} strokeWidth={on ? 6 : 2.5} />
            <circle cx={c.x - r * 0.3} cy={c.y - r * 0.3} r={r * 0.28} fill="#fff" opacity={0.35} />
            <text x={c.x} y={c.y + 7 * c.s} textAnchor="middle" fontSize={20 * c.s} fontWeight={700} fill="#1a1204">P</text>
            <text x={c.x + r * 0.72} y={c.y - r * 0.55} textAnchor="middle" fontSize={17 * c.s} fontWeight={700} fill="var(--ce-ink)" stroke="var(--ce-halo)" strokeWidth={3} paintOrder="stroke">−</text>
          </g>
        ),
      });
      if (showLabels && !hideNames) {
        const greek = id === "pAlpha" ? "α" : id === "pBeta" ? "β" : "γ";
        items.push({ z: 999, key: `${kind}-${id}-l`, node: <text x={c.x} y={c.y + (r + 24)} textAnchor="middle" fontSize={20} fontWeight={600} fill="var(--ce-ink)" stroke="var(--ce-halo)" strokeWidth={4} paintOrder="stroke">{greek}-phosphate{kind === "ATP" && i === 2 ? " (terminal)" : kind === "ADP" && i === 1 ? " (terminal)" : ""}</text> });
      }
    });

    items.sort((a, b) => a.z - b.z);
    return (
      <g transform={`translate(${W / 2} ${oy}) scale(${scale * zoom})`} key={kind}>
        {items.map((it) => (
          <g key={it.key}>{it.node}</g>
        ))}
        <text x={0} y={-150} textAnchor="middle" fontSize={34} fontWeight={800} fill="var(--ce-ink)" stroke="var(--ce-halo)" strokeWidth={5} paintOrder="stroke">
          {kind === "ATP" ? "ATP — adenosine triphosphate" : "ADP — adenosine diphosphate"}
        </text>
      </g>
    );
  };

  const two = kinds.length === 2;
  void width;
  void height;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-full w-full touch-none select-none"
      role="group"
      aria-label={`Interactive model of ${kinds.join(" and ")}. Drag or use arrow keys to rotate. Select a part to learn about it.`}
      tabIndex={0}
      onKeyDown={key}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      data-testid="molecule-svg"
    >
      <defs>
        <radialGradient id="ce-mol-bg" cx="50%" cy="40%" r="75%">
          <stop offset="0%" stopColor="var(--ce-field-a)" />
          <stop offset="100%" stopColor="var(--ce-field-b)" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#ce-mol-bg)" rx={18} />
      {two ? (
        <>
          {draw("ATP", 190, 0.78)}
          {draw("ADP", 470, 0.78)}
          {/* Pi released from ATP, shown beside ADP for comparison */}
          <g transform={`translate(${W - 120} 470)`}>
            <circle r={26} fill="var(--ce-pi)" stroke="var(--ce-line)" strokeWidth={2.5} />
            <text y={7} textAnchor="middle" fontSize={20} fontWeight={700} fill="#fff">Pi</text>
            <text y={52} textAnchor="middle" fontSize={16} fontWeight={600} fill="var(--ce-ink)" stroke="var(--ce-halo)" strokeWidth={4} paintOrder="stroke">released Pi</text>
          </g>
          <text x={W - 120} y={420} textAnchor="middle" fontSize={26} fontWeight={800} fill="var(--ce-ink)">+</text>
        </>
      ) : (
        draw(kinds[0]!, H / 2 + 20, 1)
      )}
    </svg>
  );
}
