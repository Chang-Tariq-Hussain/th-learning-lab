"use client";

export interface ForceArrowProps {
  /** Which side of the box this arrow sits on — determines which way it points. */
  side: "left" | "right";
  /** Newtons. 0 renders nothing: no force, no arrow. */
  force: number;
  /** x of the box edge this arrow starts from. */
  originX: number;
  centerY: number;
  color: string;
}

const MAX_ARROW_LENGTH = 80;
const HEAD_SIZE = 8;

/**
 * One force arrow: base at the box's edge, extending outward (away
 * from the box) by a length proportional to the force, with a small
 * triangular arrowhead at the tip — the same "base at object, tip
 * further out, arrowhead at tip" convention Newton's Laws Lab uses in
 * its free-body diagram, just horizontal-only here.
 */
export function ForceArrow({
  side,
  force,
  originX,
  centerY,
  color,
}: ForceArrowProps) {
  if (force <= 0) return null;

  const length = (force / 10) * MAX_ARROW_LENGTH;
  const tipX = side === "left" ? originX - length : originX + length;
  const headPoints =
    side === "left"
      ? `${tipX},${centerY} ${tipX + HEAD_SIZE * 1.6},${centerY - HEAD_SIZE} ${tipX + HEAD_SIZE * 1.6},${centerY + HEAD_SIZE}`
      : `${tipX},${centerY} ${tipX - HEAD_SIZE * 1.6},${centerY - HEAD_SIZE} ${tipX - HEAD_SIZE * 1.6},${centerY + HEAD_SIZE}`;

  return (
    <g aria-hidden="true">
      <line
        x1={originX}
        y1={centerY}
        x2={tipX}
        y2={centerY}
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
      />
      <polygon points={headPoints} fill={color} />
      <text
        x={tipX}
        y={centerY - 16}
        textAnchor="middle"
        fontSize={13}
        fontWeight={700}
        fill={color}
        fontFamily="ui-monospace, monospace"
      >
        {force} N
      </text>
    </g>
  );
}
