"use client";

import { MAGNET_LENGTH, MAGNET_WIDTH, ROTATE_HANDLE_OFFSET, type MagnetState } from "../magnet-model";
import type { InteractionType, PoleLabel } from "../magnet-physics";

export interface MagnetProps {
  magnet: MagnetState;
  label: string;
  active: boolean;
  /** The pole currently nearest the other magnet, if any — lights up with a soft glow. */
  glowPole?: PoleLabel | null;
  /** Whether that nearest pair is attracting or repelling — picks the glow color. */
  interactionType?: InteractionType;
  onBodyPointerDown: (e: React.PointerEvent) => void;
  onHandlePointerDown: (e: React.PointerEvent) => void;
}

const HALF_LENGTH = MAGNET_LENGTH / 2;
const HALF_WIDTH = MAGNET_WIDTH / 2;

/**
 * Purely presentational bar magnet — a rounded rectangle split into a
 * red "N" half and a blue "S" half. All drag/rotate behavior lives in
 * the parent (`Playground`); this component only renders the shape at
 * `magnet.x, magnet.y, magnet.rotation` and forwards pointer-down
 * events for the two interaction zones (body = move, handle = rotate).
 */
export function Magnet({
  magnet,
  label,
  active,
  glowPole = null,
  interactionType = "none",
  onBodyPointerDown,
  onHandlePointerDown,
}: MagnetProps) {
  const northGradientId = `magnet-north-${magnet.id}`;
  const southGradientId = `magnet-south-${magnet.id}`;
  const sheenGradientId = `magnet-sheen-${magnet.id}`;
  const glowGradientId = `magnet-glow-${magnet.id}`;
  const glowColor = interactionType === "repel" ? "#F59E0B" : "#2F7D68";

  return (
    <g transform={`translate(${magnet.x} ${magnet.y}) rotate(${magnet.rotation})`}>
      <defs>
        <linearGradient id={northGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF7A6E" />
          <stop offset="100%" stopColor="#E0403A" />
        </linearGradient>
        <linearGradient id={southGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5B8CFF" />
          <stop offset="100%" stopColor="#3355D8" />
        </linearGradient>
        <linearGradient id={sheenGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
        </linearGradient>
        <radialGradient id={glowGradientId}>
          <stop offset="0%" stopColor={glowColor} stopOpacity={0.55} />
          <stop offset="100%" stopColor={glowColor} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Soft glow behind whichever pole is currently interacting */}
      {glowPole && (
        <circle
          cx={glowPole === "N" ? HALF_LENGTH : -HALF_LENGTH}
          cy={0}
          r={38}
          fill={`url(#${glowGradientId})`}
          className="pointer-events-none transition-opacity duration-300"
        />
      )}

      {/* Drop shadow */}
      <rect
        x={-HALF_LENGTH}
        y={-HALF_WIDTH + 4}
        width={MAGNET_LENGTH}
        height={MAGNET_WIDTH}
        rx={MAGNET_WIDTH / 2}
        fill="rgba(20,32,25,0.18)"
        className="pointer-events-none"
      />

      {/* Body — two halves clipped into one rounded pill so the corners stay smooth */}
      <clipPath id={`magnet-clip-${magnet.id}`}>
        <rect x={-HALF_LENGTH} y={-HALF_WIDTH} width={MAGNET_LENGTH} height={MAGNET_WIDTH} rx={MAGNET_WIDTH / 2} />
      </clipPath>
      <g
        clipPath={`url(#magnet-clip-${magnet.id})`}
        onPointerDown={onBodyPointerDown}
        className="cursor-grab active:cursor-grabbing"
      >
        <rect x={-HALF_LENGTH} y={-HALF_WIDTH} width={HALF_LENGTH} height={MAGNET_WIDTH} fill={`url(#${southGradientId})`} />
        <rect x={0} y={-HALF_WIDTH} width={HALF_LENGTH} height={MAGNET_WIDTH} fill={`url(#${northGradientId})`} />
        {/* Top sheen for a touch more dimension */}
        <rect
          x={-HALF_LENGTH}
          y={-HALF_WIDTH}
          width={MAGNET_LENGTH}
          height={MAGNET_WIDTH * 0.45}
          fill={`url(#${sheenGradientId})`}
          className="pointer-events-none"
        />
      </g>
      <rect
        x={-HALF_LENGTH}
        y={-HALF_WIDTH}
        width={MAGNET_LENGTH}
        height={MAGNET_WIDTH}
        rx={MAGNET_WIDTH / 2}
        fill="none"
        stroke={active ? "#142019" : "rgba(20,32,25,0.25)"}
        strokeWidth={active ? 2.5 : 1.5}
        className="pointer-events-none dark:stroke-bone/40"
      />

      {/* Pole labels */}
      <text x={-HALF_LENGTH / 2} y={8} textAnchor="middle" fontSize={26} fontWeight={700} fill="white" className="pointer-events-none select-none">
        S
      </text>
      <text x={HALF_LENGTH / 2} y={8} textAnchor="middle" fontSize={26} fontWeight={700} fill="white" className="pointer-events-none select-none">
        N
      </text>

      {/* Magnet name tag, centered on the body */}
      <text
        x={0}
        y={-HALF_WIDTH - 10}
        textAnchor="middle"
        fontSize={13}
        fontWeight={600}
        className="pointer-events-none select-none fill-ink-soft dark:fill-bone-soft"
      >
        {label}
      </text>

      {/* Rotate handle, just past the north tip */}
      <circle
        cx={ROTATE_HANDLE_OFFSET}
        cy={0}
        r={11}
        fill="white"
        stroke="#142019"
        strokeWidth={2}
        className="cursor-grab active:cursor-grabbing dark:stroke-bone/60"
        onPointerDown={onHandlePointerDown}
      />
      <line
        x1={HALF_LENGTH}
        y1={0}
        x2={ROTATE_HANDLE_OFFSET - 11}
        y2={0}
        stroke="rgba(20,32,25,0.3)"
        strokeWidth={2}
        className="pointer-events-none dark:stroke-bone/30"
      />
    </g>
  );
}
