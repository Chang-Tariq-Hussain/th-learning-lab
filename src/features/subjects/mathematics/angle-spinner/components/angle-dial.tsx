"use client";

import { useRef, useState } from "react";
import { classifyAngle, clampAngle, shortestDelta, ANGLE_TYPES } from "../angle-model";

interface AngleDialProps {
  angle: number;
  onChange: (angle: number) => void;
  onDragEnd: () => void;
}

const SIZE = 320;
const CENTER = SIZE / 2;
const ARM_LENGTH = 118;
const HANDLE_RADIUS = 15;

function pointOnCircle(degrees: number, radius: number) {
  const rad = (degrees * Math.PI) / 180;
  return { x: CENTER + Math.cos(rad) * radius, y: CENTER - Math.sin(rad) * radius };
}

/** Builds an SVG arc path for the filled wedge from 0° to `degrees` — special-cased near 360° since a single SVG arc command can't draw a full circle. */
function wedgePath(degrees: number): string {
  if (degrees <= 0) return "";
  if (degrees >= 359.9) {
    return `M ${CENTER} ${CENTER - ARM_LENGTH} A ${ARM_LENGTH} ${ARM_LENGTH} 0 1 1 ${CENTER - 0.01} ${CENTER - ARM_LENGTH} Z`;
  }
  const end = pointOnCircle(degrees, ARM_LENGTH);
  const largeArc = degrees > 180 ? 1 : 0;
  return `M ${CENTER} ${CENTER} L ${CENTER + ARM_LENGTH} ${CENTER} A ${ARM_LENGTH} ${ARM_LENGTH} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

/** Converts a pointer event's client coordinates into an instantaneous 0–360° angle from the dial's center, measured counter-clockwise from the positive x-axis (standard math convention). */
function pointerAngle(e: React.PointerEvent, svg: SVGSVGElement): number {
  const rect = svg.getBoundingClientRect();
  const scale = SIZE / rect.width;
  const localX = (e.clientX - rect.left) * scale;
  const localY = (e.clientY - rect.top) * scale;
  const dx = localX - CENTER;
  const dy = localY - CENTER;
  let deg = (Math.atan2(-dy, dx) * 180) / Math.PI;
  if (deg < 0) deg += 360;
  return deg;
}

export function AngleDial({ angle, onChange, onDragEnd }: AngleDialProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const lastPointerAngleRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const type = classifyAngle(angle);
  const typeInfo = type ? ANGLE_TYPES[type] : null;
  const armColor = typeInfo?.color ?? "#8B95A1";

  const startDrag = (e: React.PointerEvent<SVGCircleElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    lastPointerAngleRef.current = pointerAngle(e, svgRef.current!);
    setIsDragging(true);
  };

  const duringDrag = (e: React.PointerEvent<SVGCircleElement>) => {
    if (!isDragging || !svgRef.current) return;
    const current = pointerAngle(e, svgRef.current);
    const delta = shortestDelta(lastPointerAngleRef.current, current);
    lastPointerAngleRef.current = current;
    onChange(clampAngle(angle + delta));
  };

  const endDrag = (e: React.PointerEvent<SVGCircleElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    onDragEnd();
  };

  const armTip = pointOnCircle(angle, ARM_LENGTH);
  const handlePos = pointOnCircle(angle, ARM_LENGTH);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="h-full w-full touch-none select-none"
      role="slider"
      aria-label="Angle arm"
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={Math.round(angle)}
      aria-valuetext={`${Math.round(angle)} degrees${type ? `, ${ANGLE_TYPES[type].label}` : ""}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowUp" || e.key === "ArrowRight") onChange(clampAngle(angle + 1));
        if (e.key === "ArrowDown" || e.key === "ArrowLeft") onChange(clampAngle(angle - 1));
      }}
    >
      {/* Filled wedge showing the angle */}
      {type ? <path d={wedgePath(angle)} fill={typeInfo!.softColor} stroke={typeInfo!.color} strokeWidth={2} /> : null}

      {/* Degree tick marks every 30° for a protractor feel */}
      {Array.from({ length: 12 }, (_, i) => i * 30).map((deg) => {
        const outer = pointOnCircle(deg, ARM_LENGTH + 8);
        const inner = pointOnCircle(deg, ARM_LENGTH + 2);
        return (
          <line
            key={deg}
            x1={inner.x}
            y1={inner.y}
            x2={outer.x}
            y2={outer.y}
            stroke="currentColor"
            className="text-ink/25 dark:text-bone/25"
            strokeWidth={1.5}
          />
        );
      })}

      {/* Fixed base arm (0° reference) */}
      <line x1={CENTER} y1={CENTER} x2={CENTER + ARM_LENGTH} y2={CENTER} stroke="currentColor" className="text-ink dark:text-bone" strokeWidth={4} strokeLinecap="round" />

      {/* Draggable arm */}
      <line x1={CENTER} y1={CENTER} x2={armTip.x} y2={armTip.y} stroke={armColor} strokeWidth={4} strokeLinecap="round" />

      {/* Center vertex */}
      <circle cx={CENTER} cy={CENTER} r={6} fill="currentColor" className="text-ink dark:text-bone" />

      {/* Drag handle */}
      <circle
        cx={handlePos.x}
        cy={handlePos.y}
        r={HANDLE_RADIUS}
        fill={armColor}
        stroke="white"
        strokeWidth={3}
        className="cursor-grab active:cursor-grabbing"
        style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))" }}
        onPointerDown={startDrag}
        onPointerMove={duringDrag}
        onPointerUp={endDrag}
      />
    </svg>
  );
}
