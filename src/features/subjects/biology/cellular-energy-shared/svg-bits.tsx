import type { ReactNode } from "react";

export const halo = { stroke: "var(--ce-halo)", strokeWidth: 4, paintOrder: "stroke" } as const;

/** Round molecule chip: a coloured disc with a short label. Colour comes from the shared palette, never alone — the label is always drawn. */
export function Chip({ x, y, r = 16, color, text, textColor = "#fff", fs, op = 1, sel = false }: { x: number; y: number; r?: number; color: string; text: string; textColor?: string; fs?: number; op?: number; sel?: boolean }) {
  return (
    <g opacity={op}>
      <circle cx={x} cy={y} r={r} fill={color} stroke={sel ? "var(--ce-sel)" : "var(--ce-line)"} strokeWidth={sel ? 4 : 2} />
      <text x={x} y={y + (fs ?? r * 0.7) * 0.36} textAnchor="middle" fontSize={fs ?? r * 0.7} fontWeight={800} fill={textColor}>
        {text}
      </text>
    </g>
  );
}

export function Label({ x, y, children, size = 18, anchor = "middle", op = 1, weight = 600 }: { x: number; y: number; children: ReactNode; size?: number; anchor?: "start" | "middle" | "end"; op?: number; weight?: number }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill="var(--ce-ink)" opacity={op} {...halo}>
      {children}
    </text>
  );
}

/** ATP drawn as a compact A–R–P–P–P glyph centred on (x, y). */
export function AtpGlyph({ x, y, k = 1, op = 1, phosphates = 3 }: { x: number; y: number; k?: number; op?: number; phosphates?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`} opacity={op}>
      <line x1={-50} y1={0} x2={20 + (phosphates - 2) * 16} y2={0} stroke="var(--ce-line)" strokeWidth={3} opacity={0.5} />
      <polygon points="-62,0 -54,-9 -40,-9 -32,0 -40,9 -54,9" fill="var(--ce-adenine)" stroke="var(--ce-line)" strokeWidth={1.5} />
      <polygon points="-24,-6 -12,-10 -4,0 -12,10 -24,6" fill="var(--ce-ribose)" stroke="var(--ce-line)" strokeWidth={1.5} />
      {Array.from({ length: phosphates }, (_, i) => (
        <g key={i}>
          <circle cx={6 + i * 22} cy={0} r={10} fill={phosphates === 3 ? "var(--ce-atp)" : "var(--ce-adp)"} stroke="var(--ce-line)" strokeWidth={1.5} />
          <text x={6 + i * 22} y={4} textAnchor="middle" fontSize={10} fontWeight={800} fill="#1a1204">P</text>
        </g>
      ))}
    </g>
  );
}
