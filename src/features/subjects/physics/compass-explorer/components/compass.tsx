"use client";

import { COMPASS_RADIUS, NEEDLE_LENGTH, type CompassState } from "../compass-model";
import { useSmoothedAngle } from "../hooks/use-smoothed-angle";

export interface CompassProps {
  compass: CompassState;
  /** Direction the local magnetic field points here, in degrees. */
  fieldAngleDeg: number;
  /** 0–1 — how strong the field is at the compass's position, fades the direction indicator. */
  fieldStrength: number;
  active: boolean;
  onBodyPointerDown: (e: React.PointerEvent) => void;
}

/**
 * Purely presentational — a circular dial with a needle that rotates to
 * `fieldAngleDeg`. All drag behavior lives in the parent (`Playground`);
 * this component only renders the shape and forwards the body's
 * pointer-down event. The needle angle is smoothed via
 * `useSmoothedAngle` so it always turns the short way round.
 */
export function Compass({ compass, fieldAngleDeg, fieldStrength, active, onBodyPointerDown }: CompassProps) {
  const needleAngle = useSmoothedAngle(fieldAngleDeg);
  const bodyGradientId = `compass-body-${compass.id}`;
  const indicatorGradientId = `compass-indicator-${compass.id}`;

  return (
    <g transform={`translate(${compass.x} ${compass.y})`}>
      <defs>
        <radialGradient id={bodyGradientId} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#F3F5F1" />
          <stop offset="100%" stopColor="#D8DED8" />
        </radialGradient>
        <linearGradient id={indicatorGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3D5AFE" stopOpacity={0} />
          <stop offset="100%" stopColor="#3D5AFE" stopOpacity={0.4} />
        </linearGradient>
      </defs>

      {/* Subtle field-direction indicator: a soft wedge + small chevron
          outside the ring, oriented with the local field so students
          can see the compass is following something external rather
          than picking a direction on its own. */}
      <g
        transform={`rotate(${needleAngle})`}
        className="pointer-events-none transition-transform duration-200 ease-out"
        style={{ opacity: 0.2 + fieldStrength * 0.55 }}
      >
        <path
          d={`M 0 0 L ${COMPASS_RADIUS + 8} -20 A ${COMPASS_RADIUS + 34} ${COMPASS_RADIUS + 34} 0 0 1 ${COMPASS_RADIUS + 8} 20 Z`}
          fill={`url(#${indicatorGradientId})`}
        />
        <polygon
          points={`${COMPASS_RADIUS + 40},0 ${COMPASS_RADIUS + 26},-7 ${COMPASS_RADIUS + 26},7`}
          fill="#3D5AFE"
          fillOpacity={0.55}
        />
      </g>

      {/* Drop shadow */}
      <circle cx={0} cy={4} r={COMPASS_RADIUS} fill="rgba(20,32,25,0.16)" className="pointer-events-none" />

      {/* Body */}
      <circle
        cx={0}
        cy={0}
        r={COMPASS_RADIUS}
        fill={`url(#${bodyGradientId})`}
        stroke={active ? "#142019" : "rgba(20,32,25,0.25)"}
        strokeWidth={active ? 2.5 : 1.5}
        onPointerDown={onBodyPointerDown}
        className="cursor-grab active:cursor-grabbing dark:stroke-bone/40"
      />

      {/* Cardinal tick marks — purely decorative dial styling */}
      {[0, 90, 180, 270].map((tick) => (
        <line
          key={tick}
          x1={0}
          y1={-(COMPASS_RADIUS - 6)}
          x2={0}
          y2={-(COMPASS_RADIUS - 13)}
          stroke="rgba(20,32,25,0.3)"
          strokeWidth={2}
          transform={`rotate(${tick})`}
          className="pointer-events-none dark:stroke-bone/30"
        />
      ))}

      {/* Needle — rotates to follow the local field */}
      <g transform={`rotate(${needleAngle})`} className="pointer-events-none transition-transform duration-200 ease-out">
        <polygon points={`0,-4 ${NEEDLE_LENGTH},0 0,4`} fill="#E0403A" />
        <polygon points={`0,-4 ${-NEEDLE_LENGTH},0 0,4`} fill="#3355D8" />
      </g>

      {/* Pivot */}
      <circle cx={0} cy={0} r={5} fill="#142019" className="pointer-events-none dark:fill-bone" />
      <circle cx={0} cy={0} r={2} fill="white" className="pointer-events-none" />
    </g>
  );
}
