import { VIEW_H, VIEW_W } from "../hooks/use-viewport";

export interface LabelSpec {
  id: string;
  text: string;
  /** Pill centre. */
  x: number;
  y: number;
  /** Where the leader line points (on the structure). Omit for no leader. */
  tx?: number;
  ty?: number;
}

/**
 * Name tag with a thin leader line. `unit` is how many CSS pixels one scene unit currently covers, so the text
 * stays about 11px on screen at any stage size (clamped so it cannot become huge on a small phone stage).
 * Never receives pointer events: a click always reaches the structure underneath.
 */
export function SceneLabel({ spec, unit, emphasis = false }: { spec: LabelSpec; unit: number; emphasis?: boolean }) {
  const font = Math.min(22, Math.max(9.5, (emphasis ? 13 : 11) / Math.max(unit, 0.2)));
  const padX = font * 0.7;
  const height = font * 1.75;
  const width = spec.text.length * font * 0.56 + padX * 2;
  const x = Math.min(VIEW_W - width / 2 - 4, Math.max(width / 2 + 4, spec.x));
  const y = Math.min(VIEW_H - height / 2 - 4, Math.max(height / 2 + 4, spec.y));
  return (
    <g pointerEvents="none" aria-hidden="true">
      {spec.tx !== undefined && spec.ty !== undefined ? (
        <>
          <line x1={x} y1={y} x2={spec.tx} y2={spec.ty} stroke="rgb(var(--color-ink))" strokeOpacity={0.7} strokeWidth={1} />
          <circle cx={spec.tx} cy={spec.ty} r={2.2} fill="rgb(var(--color-ink))" fillOpacity={0.85} />
        </>
      ) : null}
      <rect
        x={x - width / 2}
        y={y - height / 2}
        width={width}
        height={height}
        rx={height / 2}
        fill="rgb(var(--color-paper))"
        fillOpacity={0.96}
        stroke={emphasis ? "#0D9488" : "rgb(var(--color-ink))"}
        strokeOpacity={emphasis ? 1 : 0.45}
        strokeWidth={emphasis ? 2 : 1}
      />
      <text x={x} y={y + font * 0.04} textAnchor="middle" dominantBaseline="central" fontSize={font} fontWeight={600} fill="rgb(var(--color-ink))" style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
        {spec.text}
      </text>
    </g>
  );
}
