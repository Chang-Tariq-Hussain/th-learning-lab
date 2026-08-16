"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { wedgeAngles, wedgeDirection, wedgePath } from "./pizza-geometry";
import { ConfettiBurst } from "./confetti-burst";

const SIZE = 200;
const CENTER = SIZE / 2;
const CHEESE_RADIUS = 82;
const CRUST_RADIUS = 95;

const CRUST_COLOR = "#D98E4A";
const CHEESE_COLOR = "#F4C86A";
const CHEESE_SELECTED_COLOR = "#FBDD8E";
const PEPPERONI_COLOR = "#B8433A";
const SELECTED_STROKE = "#7C4FE0";

interface PepperoniSpot {
  angle: number;
  radiusFraction: number;
  sizeFraction: number;
}

/** A handful of fixed relative positions within one wedge — reused (rotated) for every wedge so pepperoni stays visually consistent as slice count changes. */
const PEPPERONI_LAYOUT: PepperoniSpot[] = [
  { angle: 0.32, radiusFraction: 0.45, sizeFraction: 1 },
  { angle: 0.68, radiusFraction: 0.62, sizeFraction: 0.85 },
  { angle: 0.5, radiusFraction: 0.8, sizeFraction: 0.7 },
];

const WHOLE_PIZZA_PEPPERONI = Array.from({ length: 8 }, (_, i) => ({
  angle: i * 45 + 15,
  radiusFraction: i % 2 === 0 ? 0.4 : 0.68,
}));

export interface PizzaProps {
  sliceCount: number;
  selected: boolean[];
  onToggleSlice: (index: number) => void;
  celebrating: boolean;
  confettiKey: number;
}

export function Pizza({
  sliceCount,
  selected,
  onToggleSlice,
  celebrating,
  confettiKey,
}: PizzaProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const selectedCount = selected.filter(Boolean).length;

  const fraction = `${selectedCount}/${sliceCount}`;
  const decimal = sliceCount > 0 ? selectedCount / sliceCount : 0;
  const percentage = Math.round(decimal * 100);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[22rem] sm:max-w-md">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="h-full w-full drop-shadow-xl"
        role="img"
        aria-label={`Pizza cut into ${sliceCount} slice${sliceCount === 1 ? "" : "s"}, ${fraction} selected`}
      >
        <circle cx={CENTER} cy={CENTER} r={CRUST_RADIUS} fill={CRUST_COLOR} />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={CRUST_RADIUS - 6}
          fill={CRUST_COLOR}
          stroke="rgba(0,0,0,0.06)"
          strokeWidth={1}
        />

        {sliceCount === 1 ? (
          <motion.g
            role="button"
            tabIndex={0}
            aria-pressed={selected[0] ?? false}
            aria-label="Whole pizza"
            onClick={() => onToggleSlice(0)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onToggleSlice(0);
              }
            }}
            onPointerEnter={() => setHovered(0)}
            onPointerLeave={() => setHovered((h) => (h === 0 ? null : h))}
            animate={{ scale: selected[0] ? 1.03 : hovered === 0 ? 1.05 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            style={{
              transformOrigin: `${CENTER}px ${CENTER}px`,
              cursor: "pointer",
              outline: "none",
            }}
          >
            <circle
              cx={CENTER}
              cy={CENTER}
              r={CHEESE_RADIUS}
              fill={selected[0] ? CHEESE_SELECTED_COLOR : CHEESE_COLOR}
              stroke={selected[0] ? SELECTED_STROKE : "transparent"}
              strokeWidth={selected[0] ? 3 : 0}
            />
            {WHOLE_PIZZA_PEPPERONI.map((spot, i) => {
              const rad = ((spot.angle - 90) * Math.PI) / 180;
              const r = CHEESE_RADIUS * spot.radiusFraction;
              return (
                <circle
                  key={i}
                  cx={CENTER + r * Math.cos(rad)}
                  cy={CENTER + r * Math.sin(rad)}
                  r={7}
                  fill={PEPPERONI_COLOR}
                  opacity={0.9}
                />
              );
            })}
          </motion.g>
        ) : (
          wedgeAngles(sliceCount).map((wedge, i) => {
            const isSelected = selected[i] ?? false;
            const isHovered = hovered === i;
            const direction = wedgeDirection(wedge.start, wedge.end);
            const pull = isSelected ? 8 : isHovered ? 4 : 0;
            const dotRadius = Math.max(2.5, 8 - sliceCount * 0.45);

            return (
              <motion.g
                key={i}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`Slice ${i + 1} of ${sliceCount}`}
                onClick={() => onToggleSlice(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onToggleSlice(i);
                  }
                }}
                onPointerEnter={() => setHovered(i)}
                onPointerLeave={() => setHovered((h) => (h === i ? null : h))}
                animate={{
                  x: direction.x * pull,
                  y: direction.y * pull,
                  scale: isSelected ? 1.06 : isHovered ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 420, damping: 20 }}
                style={{
                  transformOrigin: `${CENTER}px ${CENTER}px`,
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <path
                  d={wedgePath(
                    CENTER,
                    CENTER,
                    CHEESE_RADIUS,
                    wedge.start,
                    wedge.end,
                  )}
                  fill={isSelected ? CHEESE_SELECTED_COLOR : CHEESE_COLOR}
                  stroke={isSelected ? SELECTED_STROKE : "rgba(0,0,0,0.08)"}
                  strokeWidth={isSelected ? 2.5 : 1}
                  strokeLinejoin="round"
                />
                {PEPPERONI_LAYOUT.slice(
                  0,
                  sliceCount <= 4 ? 3 : sliceCount <= 8 ? 2 : 1,
                ).map((spot, spotIndex) => {
                  const angle =
                    wedge.start + (wedge.end - wedge.start) * spot.angle;
                  const rad = ((angle - 90) * Math.PI) / 180;
                  const r = CHEESE_RADIUS * spot.radiusFraction;
                  return (
                    <circle
                      key={spotIndex}
                      cx={CENTER + r * Math.cos(rad)}
                      cy={CENTER + r * Math.sin(rad)}
                      r={dotRadius * spot.sizeFraction}
                      fill={PEPPERONI_COLOR}
                      opacity={0.9}
                    />
                  );
                })}
              </motion.g>
            );
          })
        )}
      </svg>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className={cn(
            "flex h-20 w-20 flex-col items-center justify-center rounded-full border-4 border-white bg-white/95 text-center shadow-md transition-colors dark:border-chalkboard dark:bg-chalkboard/95 sm:h-24 sm:w-24",
          )}
        >
          <span className="font-display text-xl font-semibold text-ink dark:text-bone sm:text-2xl">
            {fraction}
          </span>
          <span className="font-mono text-[10px] text-ink-soft dark:text-bone-soft sm:text-[11px]">
            {decimal.toFixed(2)} · {percentage}%
          </span>
        </div>
      </div>

      <ConfettiBurst triggerKey={confettiKey} />
      {celebrating ? (
        <div className="pointer-events-none absolute inset-0 animate-pulse rounded-full ring-4 ring-subject-math/40" />
      ) : null}
    </div>
  );
}
