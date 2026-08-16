"use client";

import type { Mode, OrganismId } from "../types";
import { CHAIN_SEQUENCE, edgesForMode } from "../food-web-model";

interface SceneProps {
  mode: Mode;
  selectedId: OrganismId | null;
  focusIds: OrganismId[] | null;
  grasshopperRemoved: boolean;
  /** 0–1 progress of the energy particles along the chain, or null when not running. */
  flowPhase: number | null;
  onSelect: (id: OrganismId) => void;
}

const POSITIONS: Record<OrganismId, { x: number; y: number }> = {
  sun: { x: 332, y: 38 },
  hawk: { x: 298, y: 64 },
  bird: { x: 102, y: 54 },
  grass: { x: 160, y: 214 },
  grasshopper: { x: 148, y: 190 },
  rabbit: { x: 236, y: 200 },
  frog: { x: 64, y: 206 },
  snake: { x: 278, y: 214 },
  fungi: { x: 34, y: 220 },
};

function grassTuft(cx: number, baseY: number): string[] {
  return [
    `M ${cx - 8} ${baseY} Q ${cx - 10} ${baseY - 16}, ${cx - 4} ${baseY - 22}`,
    `M ${cx - 2} ${baseY} Q ${cx - 2} ${baseY - 20}, ${cx + 2} ${baseY - 26}`,
    `M ${cx + 4} ${baseY} Q ${cx + 8} ${baseY - 16}, ${cx + 8} ${baseY - 22}`,
  ];
}

function shrink(a: { x: number; y: number }, b: { x: number; y: number }, by: number) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  return {
    x1: a.x + (dx / len) * by,
    y1: a.y + (dy / len) * by,
    x2: b.x - (dx / len) * by,
    y2: b.y - (dy / len) * by,
  };
}

function ClickableGroup({
  id,
  opacity,
  label,
  onSelect,
  children,
}: {
  id: OrganismId;
  opacity: number;
  label: string;
  onSelect: (id: OrganismId) => void;
  children: React.ReactNode;
}) {
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={() => onSelect(id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(id);
        }
      }}
      className="cursor-pointer outline-none transition-opacity duration-300 focus-visible:opacity-100"
      style={{ opacity }}
    >
      {children}
    </g>
  );
}

function pointAtChainPhase(phase: number): { x: number; y: number } {
  const points = CHAIN_SEQUENCE.map((id) => POSITIONS[id]);
  const segments = points.length - 1;
  const scaled = Math.min(phase, 0.999999) * segments;
  const seg = Math.floor(scaled);
  const t = scaled - seg;
  const a = points[seg]!;
  const b = points[Math.min(seg + 1, points.length - 1)]!;
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

export function Scene({
  mode,
  selectedId,
  focusIds,
  grasshopperRemoved,
  flowPhase,
  onSelect,
}: SceneProps) {
  const opacityFor = (id: OrganismId) => {
    let base = 1;
    if (grasshopperRemoved && id === "grasshopper") base = 0.12;
    const highlight = focusIds ? (focusIds.includes(id) ? 1 : 0.2) : 1;
    return base * highlight;
  };

  const edges = edgesForMode(mode);
  const edgeOpacity = (from: OrganismId, to: OrganismId) => {
    if (grasshopperRemoved && (from === "grasshopper" || to === "grasshopper")) return 0.08;
    if (focusIds) return focusIds.includes(from) && focusIds.includes(to) ? 0.9 : 0.1;
    return 0.7;
  };

  const particles =
    flowPhase === null
      ? []
      : [0, 1 / 3, 2 / 3].map((offset) => pointAtChainPhase((flowPhase + offset) % 1));

  return (
    <svg
      viewBox="0 0 380 260"
      className="h-full w-full"
      role="img"
      aria-label="A grassland food web scene with a sun, grass, a grasshopper, a rabbit, a frog, a bird, a snake, a hawk, and decomposer fungi"
    >
      <defs>
        <linearGradient id="fw-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EAF6FB" />
          <stop offset="100%" stopColor="#F6FBF9" />
        </linearGradient>
        <linearGradient id="fw-soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9A671" />
          <stop offset="100%" stopColor="#9C7A4C" />
        </linearGradient>
        <radialGradient id="fw-sun" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#FFF6D6" />
          <stop offset="100%" stopColor="#F5C24B" />
        </radialGradient>
        <marker
          id="fw-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 Z" className="fill-subject-biology" />
        </marker>
      </defs>

      {/* Sky */}
      <rect x={0} y={0} width={380} height={222} fill="url(#fw-sky)" />
      {/* Soil */}
      <path d="M 0 222 C 60 216, 320 216, 380 222 L 380 260 L 0 260 Z" fill="url(#fw-soil)" />

      {/* Energy-flow edges, drawn under the organisms */}
      <g>
        {edges.map((e) => {
          const a = POSITIONS[e.from];
          const b = POSITIONS[e.to];
          const { x1, y1, x2, y2 } = shrink(a, b, 16);
          return (
            <line
              key={`${e.from}-${e.to}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              className="stroke-subject-biology transition-opacity duration-300"
              strokeWidth={2}
              strokeLinecap="round"
              markerEnd="url(#fw-arrow)"
              style={{ opacity: edgeOpacity(e.from, e.to) }}
            />
          );
        })}
      </g>

      {/* Energy particles animating along the food chain */}
      {particles.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={3.5}
          className="fill-amber-400 dark:fill-amber-300"
        />
      ))}

      {/* Sun */}
      <ClickableGroup id="sun" opacity={opacityFor("sun")} label="Sun" onSelect={onSelect}>
        <g>
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1;1.04;1"
            additive="sum"
            dur="3.5s"
            repeatCount="indefinite"
          />
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i * Math.PI) / 4;
            const x1 = POSITIONS.sun.x + Math.cos(angle) * 26;
            const y1 = POSITIONS.sun.y + Math.sin(angle) * 26;
            const x2 = POSITIONS.sun.x + Math.cos(angle) * 33;
            const y2 = POSITIONS.sun.y + Math.sin(angle) * 33;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className="stroke-amber-400/70 dark:stroke-amber-300/60"
                strokeWidth={2}
                strokeLinecap="round"
              />
            );
          })}
          <circle
            cx={POSITIONS.sun.x}
            cy={POSITIONS.sun.y}
            r={18}
            fill="url(#fw-sun)"
            className="stroke-amber-500/50"
            strokeWidth={1.5}
          />
        </g>
      </ClickableGroup>

      {/* Grass */}
      <ClickableGroup id="grass" opacity={opacityFor("grass")} label="Grass" onSelect={onSelect}>
        {[130, 160, 190].map((cx) => (
          <g key={cx}>
            {grassTuft(cx, 220).map((d, j) => (
              <path
                key={j}
                d={d}
                fill="none"
                className="stroke-pine-600 dark:stroke-pine-300"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
            ))}
          </g>
        ))}
        <text
          x={160}
          y={236}
          textAnchor="middle"
          className="fill-ink/60 dark:fill-bone/70 font-mono text-[9px] uppercase tracking-wide"
        >
          Grass
        </text>
      </ClickableGroup>

      {/* Grasshopper */}
      <ClickableGroup
        id="grasshopper"
        opacity={opacityFor("grasshopper")}
        label="Grasshopper"
        onSelect={onSelect}
      >
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 -3; 0 0"
            dur="1.4s"
            repeatCount="indefinite"
          />
          <ellipse
            cx={POSITIONS.grasshopper.x}
            cy={POSITIONS.grasshopper.y}
            rx={7}
            ry={4}
            className="fill-pine-500 dark:fill-pine-300"
          />
          <path
            d={`M ${POSITIONS.grasshopper.x - 4} ${POSITIONS.grasshopper.y + 2} L ${POSITIONS.grasshopper.x - 9} ${POSITIONS.grasshopper.y + 10}`}
            className="stroke-pine-600 dark:stroke-pine-300"
            strokeWidth={1.6}
            strokeLinecap="round"
          />
          <path
            d={`M ${POSITIONS.grasshopper.x - 6} ${POSITIONS.grasshopper.y - 3} L ${POSITIONS.grasshopper.x - 10} ${POSITIONS.grasshopper.y - 8}`}
            className="stroke-ink/50 dark:stroke-bone/60"
            strokeWidth={1}
          />
        </g>
        <text
          x={POSITIONS.grasshopper.x}
          y={POSITIONS.grasshopper.y - 12}
          textAnchor="middle"
          className="fill-ink/60 dark:fill-bone/70 font-mono text-[9px] uppercase tracking-wide"
        >
          Grasshopper
        </text>
      </ClickableGroup>

      {/* Rabbit */}
      <ClickableGroup id="rabbit" opacity={opacityFor("rabbit")} label="Rabbit" onSelect={onSelect}>
        <g>
          <ellipse
            cx={POSITIONS.rabbit.x}
            cy={POSITIONS.rabbit.y}
            rx={13}
            ry={9}
            className="fill-bone dark:fill-bone/90 stroke-ink/20 dark:stroke-chalkboard/40"
            strokeWidth={1}
          />
          <circle
            cx={POSITIONS.rabbit.x + 14}
            cy={POSITIONS.rabbit.y - 6}
            r={6}
            className="fill-bone dark:fill-bone/90 stroke-ink/20 dark:stroke-chalkboard/40"
            strokeWidth={1}
          />
          <path
            d={`M ${POSITIONS.rabbit.x + 16} ${POSITIONS.rabbit.y - 11} L ${POSITIONS.rabbit.x + 14} ${POSITIONS.rabbit.y - 21} M ${POSITIONS.rabbit.x + 20} ${POSITIONS.rabbit.y - 10} L ${POSITIONS.rabbit.x + 21} ${POSITIONS.rabbit.y - 20}`}
            className="stroke-bone dark:stroke-bone/90"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <circle cx={POSITIONS.rabbit.x + 17} cy={POSITIONS.rabbit.y - 5} r={1} className="fill-ink dark:fill-chalkboard" />
        </g>
        <text
          x={POSITIONS.rabbit.x}
          y={POSITIONS.rabbit.y + 18}
          textAnchor="middle"
          className="fill-ink/60 dark:fill-bone/70 font-mono text-[9px] uppercase tracking-wide"
        >
          Rabbit
        </text>
      </ClickableGroup>

      {/* Frog */}
      <ClickableGroup id="frog" opacity={opacityFor("frog")} label="Frog" onSelect={onSelect}>
        <g>
          <ellipse
            cx={POSITIONS.frog.x}
            cy={POSITIONS.frog.y}
            rx={12}
            ry={8}
            className="fill-pine-500 dark:fill-pine-300 stroke-pine-700/40"
            strokeWidth={1}
          />
          <circle cx={POSITIONS.frog.x - 6} cy={POSITIONS.frog.y - 7} r={3.4} className="fill-pine-500 dark:fill-pine-300 stroke-pine-700/40" strokeWidth={1} />
          <circle cx={POSITIONS.frog.x + 3} cy={POSITIONS.frog.y - 8} r={3.4} className="fill-pine-500 dark:fill-pine-300 stroke-pine-700/40" strokeWidth={1} />
          <circle cx={POSITIONS.frog.x - 6} cy={POSITIONS.frog.y - 7} r={1.2} className="fill-ink dark:fill-chalkboard" />
          <circle cx={POSITIONS.frog.x + 3} cy={POSITIONS.frog.y - 8} r={1.2} className="fill-ink dark:fill-chalkboard" />
        </g>
        <text
          x={POSITIONS.frog.x}
          y={POSITIONS.frog.y + 18}
          textAnchor="middle"
          className="fill-ink/60 dark:fill-bone/70 font-mono text-[9px] uppercase tracking-wide"
        >
          Frog
        </text>
      </ClickableGroup>

      {/* Bird */}
      <ClickableGroup id="bird" opacity={opacityFor("bird")} label="Bird" onSelect={onSelect}>
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 -3; 0 0"
            dur="2.2s"
            repeatCount="indefinite"
          />
          <path
            d={`M ${POSITIONS.bird.x} ${POSITIONS.bird.y} Q ${POSITIONS.bird.x + 8} ${POSITIONS.bird.y - 6}, ${POSITIONS.bird.x + 16} ${POSITIONS.bird.y} Q ${POSITIONS.bird.x + 8} ${POSITIONS.bird.y - 2}, ${POSITIONS.bird.x} ${POSITIONS.bird.y} Z`}
            className="fill-sky-600 dark:fill-sky-400"
          />
          <path
            d={`M ${POSITIONS.bird.x} ${POSITIONS.bird.y} Q ${POSITIONS.bird.x - 8} ${POSITIONS.bird.y - 4}, ${POSITIONS.bird.x - 14} ${POSITIONS.bird.y} Q ${POSITIONS.bird.x - 8} ${POSITIONS.bird.y + 2}, ${POSITIONS.bird.x} ${POSITIONS.bird.y} Z`}
            className="fill-sky-600 dark:fill-sky-400"
          />
          <circle cx={POSITIONS.bird.x + 15} cy={POSITIONS.bird.y - 2} r={1.3} className="fill-ink dark:fill-chalkboard" />
        </g>
      </ClickableGroup>

      {/* Snake */}
      <ClickableGroup id="snake" opacity={opacityFor("snake")} label="Snake" onSelect={onSelect}>
        <g>
          <path
            d={`M ${POSITIONS.snake.x - 22} ${POSITIONS.snake.y} Q ${POSITIONS.snake.x - 12} ${POSITIONS.snake.y - 8}, ${POSITIONS.snake.x - 2} ${POSITIONS.snake.y} Q ${POSITIONS.snake.x + 8} ${POSITIONS.snake.y + 8}, ${POSITIONS.snake.x + 18} ${POSITIONS.snake.y}`}
            fill="none"
            className="stroke-amber-700 dark:stroke-amber-500"
            strokeWidth={5}
            strokeLinecap="round"
          />
          <circle cx={POSITIONS.snake.x + 19} cy={POSITIONS.snake.y - 1} r={1.2} className="fill-chalkboard dark:fill-ink" />
        </g>
        <text
          x={POSITIONS.snake.x}
          y={POSITIONS.snake.y + 16}
          textAnchor="middle"
          className="fill-ink/60 dark:fill-bone/70 font-mono text-[9px] uppercase tracking-wide"
        >
          Snake
        </text>
      </ClickableGroup>

      {/* Hawk */}
      <ClickableGroup id="hawk" opacity={opacityFor("hawk")} label="Hawk" onSelect={onSelect}>
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 -3; 0 0"
            dur="2.6s"
            repeatCount="indefinite"
          />
          <path
            d={`M ${POSITIONS.hawk.x} ${POSITIONS.hawk.y} Q ${POSITIONS.hawk.x + 12} ${POSITIONS.hawk.y - 8}, ${POSITIONS.hawk.x + 22} ${POSITIONS.hawk.y} Q ${POSITIONS.hawk.x + 12} ${POSITIONS.hawk.y - 2}, ${POSITIONS.hawk.x} ${POSITIONS.hawk.y} Z`}
            className="fill-amber-800 dark:fill-amber-600"
          />
          <path
            d={`M ${POSITIONS.hawk.x} ${POSITIONS.hawk.y} Q ${POSITIONS.hawk.x - 12} ${POSITIONS.hawk.y - 5}, ${POSITIONS.hawk.x - 20} ${POSITIONS.hawk.y} Q ${POSITIONS.hawk.x - 10} ${POSITIONS.hawk.y + 2}, ${POSITIONS.hawk.x} ${POSITIONS.hawk.y} Z`}
            className="fill-amber-800 dark:fill-amber-600"
          />
          <circle cx={POSITIONS.hawk.x + 20} cy={POSITIONS.hawk.y - 2} r={1.6} className="fill-ink dark:fill-chalkboard" />
        </g>
        <text
          x={POSITIONS.hawk.x}
          y={POSITIONS.hawk.y - 12}
          textAnchor="middle"
          className="fill-ink/60 dark:fill-bone/70 font-mono text-[9px] uppercase tracking-wide"
        >
          Hawk
        </text>
      </ClickableGroup>

      {/* Fungi / decomposers */}
      <ClickableGroup id="fungi" opacity={opacityFor("fungi")} label="Fungi" onSelect={onSelect}>
        {[
          { x: POSITIONS.fungi.x, y: POSITIONS.fungi.y },
          { x: POSITIONS.fungi.x + 12, y: POSITIONS.fungi.y + 4 },
        ].map((m, i) => (
          <g key={i}>
            <rect x={m.x - 1.5} y={m.y - 6} width={3} height={8} className="fill-bone dark:fill-bone/80" />
            <path
              d={`M ${m.x - 8} ${m.y - 6} Q ${m.x} ${m.y - 16}, ${m.x + 8} ${m.y - 6} Z`}
              className="fill-rose-300 stroke-rose-500/50 dark:fill-rose-400/80"
              strokeWidth={1}
            />
          </g>
        ))}
        <text
          x={POSITIONS.fungi.x + 6}
          y={POSITIONS.fungi.y + 20}
          textAnchor="middle"
          className="fill-ink/60 dark:fill-bone/70 font-mono text-[9px] uppercase tracking-wide"
        >
          Fungi
        </text>
      </ClickableGroup>
    </svg>
  );
}
