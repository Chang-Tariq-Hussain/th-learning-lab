export interface OrganelleLabelProps {
  x: number;
  y: number;
  text: string;
}

/**
 * TASK 6 SCOPE — a small pill label for the "Show labels" toggle,
 * anchored at a hand-placed (x, y) per organelle (see `LABELS` in
 * `animal-cell-organelles.tsx`), matching the font-mono uppercase
 * tracking treatment used elsewhere in the app. `pointerEvents="none"`
 * so the pill never steals a click meant for the organelle underneath
 * it. Width is estimated from character count since SVG can't
 * auto-size a `<rect>` around `<text>` without a live DOM measurement.
 */
export function OrganelleLabel({ x, y, text }: OrganelleLabelProps) {
  const charWidth = 5.4;
  const paddingX = 7;
  const width = text.length * charWidth + paddingX * 2;
  const height = 15;

  return (
    <g pointerEvents="none">
      <rect
        x={x - width / 2}
        y={y - height / 2}
        width={width}
        height={height}
        rx={height / 2}
        fill="rgba(255,255,255,0.94)"
        stroke="rgba(76,46,134,0.28)"
        strokeWidth={1}
      />
      <text
        x={x}
        y={y + 0.5}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize={7}
        letterSpacing="0.5"
        fontWeight={600}
        fill="#4C2E86"
        style={{ textTransform: "uppercase" }}
      >
        {text}
      </text>
    </g>
  );
}
