"use client";

import { FIELD_LINES } from "../field-lines";
import type { MagnetState } from "../magnet-model";

export interface FieldLinesProps {
  magnet: MagnetState;
}

/**
 * Renders one magnet's field-line arcs inside a group that carries the
 * exact same `translate` + `rotate` transform as the magnet body — so
 * the lines track position and rotation for free, with no per-frame
 * recomputation. Purely decorative/non-interactive.
 */
export function FieldLines({ magnet }: FieldLinesProps) {
  return (
    <g
      transform={`translate(${magnet.x} ${magnet.y}) rotate(${magnet.rotation})`}
      className="pointer-events-none text-subject-physics"
    >
      {FIELD_LINES.map((line, index) => (
        <g key={index}>
          <path
            d={line.path}
            fill="none"
            stroke="currentColor"
            strokeWidth={line.strokeWidth}
            strokeOpacity={line.opacity}
            strokeLinecap="round"
          />
          <polygon
            points="-4.5,-3 4.5,0 -4.5,3"
            transform={`translate(${line.arrow.x.toFixed(1)} ${line.arrow.y.toFixed(1)}) rotate(${line.arrow.angleDeg.toFixed(1)})`}
            fill="currentColor"
            fillOpacity={Math.min(line.opacity + 0.18, 0.7)}
          />
        </g>
      ))}
    </g>
  );
}
