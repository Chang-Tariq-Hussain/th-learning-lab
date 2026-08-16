"use client";

export interface FreeBodyForce {
  label: string;
  /** Newtons, signed: for horizontal forces positive = right; for vertical, positive = up. */
  value: number;
  direction: "up" | "down" | "left" | "right";
  color: string;
}

export interface FreeBodyDiagramProps {
  forces: FreeBodyForce[];
  className?: string;
}

const SIZE = 132;
const CENTER = SIZE / 2;
const BOX = 34;
const MAX_ARROW = 46;

function arrowGeometry(direction: FreeBodyForce["direction"], length: number) {
  const half = BOX / 2 + 4;
  switch (direction) {
    case "up":
      return {
        x1: CENTER,
        y1: CENTER - half,
        x2: CENTER,
        y2: CENTER - half - length,
      };
    case "down":
      return {
        x1: CENTER,
        y1: CENTER + half,
        x2: CENTER,
        y2: CENTER + half + length,
      };
    case "left":
      return {
        x1: CENTER - half,
        y1: CENTER,
        x2: CENTER - half - length,
        y2: CENTER,
      };
    case "right":
      return {
        x1: CENTER + half,
        y1: CENTER,
        x2: CENTER + half + length,
        y2: CENTER,
      };
  }
}

function labelPosition(direction: FreeBodyForce["direction"], length: number) {
  const half = BOX / 2 + 4;
  switch (direction) {
    case "up":
      return {
        x: CENTER + 6,
        y: CENTER - half - length,
        anchor: "start" as const,
      };
    case "down":
      return {
        x: CENTER + 6,
        y: CENTER + half + length + 4,
        anchor: "start" as const,
      };
    case "left":
      return {
        x: CENTER - half - length,
        y: CENTER - 8,
        anchor: "end" as const,
      };
    case "right":
      return {
        x: CENTER + half + length,
        y: CENTER - 8,
        anchor: "start" as const,
      };
  }
}

function arrowHeadPoints(
  direction: FreeBodyForce["direction"],
  tipX: number,
  tipY: number,
): string {
  const s = 5;
  switch (direction) {
    case "up":
      return `${tipX},${tipY} ${tipX - s},${tipY + s * 1.6} ${tipX + s},${tipY + s * 1.6}`;
    case "down":
      return `${tipX},${tipY} ${tipX - s},${tipY - s * 1.6} ${tipX + s},${tipY - s * 1.6}`;
    case "left":
      return `${tipX},${tipY} ${tipX + s * 1.6},${tipY - s} ${tipX + s * 1.6},${tipY + s}`;
    case "right":
      return `${tipX},${tipY} ${tipX - s * 1.6},${tipY - s} ${tipX - s * 1.6},${tipY + s}`;
  }
}

/**
 * A minimal free-body diagram: a box at the center, with one arrow per
 * force scaled (capped at `MAX_ARROW` px) by magnitude. Deliberately not
 * drawn on the simulation canvas itself — as a separate SVG, it stays
 * crisp at any zoom level and is trivially screen-reader describable
 * (each arrow has an accessible label via the surrounding `<figure>`).
 */
export function FreeBodyDiagram({ forces, className }: FreeBodyDiagramProps) {
  const maxMagnitude = Math.max(1, ...forces.map((f) => Math.abs(f.value)));

  return (
    <figure
      className={className}
      aria-label={`Free-body diagram: ${
        forces
          .filter((f) => Math.abs(f.value) > 0.01)
          .map((f) => `${f.label} ${f.value.toFixed(0)} newtons ${f.direction}`)
          .join(", ") || "no net forces"
      }`}
    >
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={SIZE}
        height={SIZE}
        role="img"
        aria-hidden="true"
      >
        <rect
          x={CENTER - BOX / 2}
          y={CENTER - BOX / 2}
          width={BOX}
          height={BOX}
          rx={4}
          fill="currentColor"
          className="text-ink/10 dark:text-bone/10"
          stroke="currentColor"
          strokeWidth={1.5}
        />
        {forces.map((force) => {
          if (Math.abs(force.value) < 0.05) return null;
          const length = (Math.abs(force.value) / maxMagnitude) * MAX_ARROW;
          const arrowLength = Math.max(10, length);
          const geo = arrowGeometry(force.direction, arrowLength);
          const label = labelPosition(force.direction, arrowLength);
          const head = arrowHeadPoints(force.direction, geo.x2, geo.y2);
          return (
            <g key={force.label}>
              <line
                x1={geo.x1}
                y1={geo.y1}
                x2={geo.x2}
                y2={geo.y2}
                stroke={force.color}
                strokeWidth={2.5}
                strokeLinecap="round"
              />
              <polygon points={head} fill={force.color} />
              <text
                x={label.x}
                y={label.y}
                textAnchor={label.anchor}
                fontSize={9}
                fill={force.color}
                fontFamily="ui-monospace, monospace"
              >
                {force.label}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
