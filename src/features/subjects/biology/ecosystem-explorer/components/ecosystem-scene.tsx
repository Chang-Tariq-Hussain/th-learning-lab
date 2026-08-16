"use client";

import type { ComponentId } from "../types";

interface EcosystemSceneProps {
  selectedId: ComponentId | null;
  highlightIds: ComponentId[] | null;
  plantsRemoved: boolean;
  waterReduced: boolean;
  onSelect: (id: ComponentId) => void;
}

function opacityFor(
  id: ComponentId,
  { selectedId, highlightIds, plantsRemoved, waterReduced }: EcosystemSceneProps,
): number {
  let base = 1;
  if (plantsRemoved && (id === "tree" || id === "grass")) base = 0.15;
  if (plantsRemoved && (id === "insect" || id === "rabbit" || id === "bird")) {
    base = Math.min(base, 0.45);
  }
  if (waterReduced && id === "water") base = Math.min(base, 0.35);
  if (waterReduced && (id === "tree" || id === "grass")) base = Math.min(base, 0.55);

  let highlight = 1;
  if (selectedId) highlight = id === selectedId ? 1 : 0.22;
  else if (highlightIds) highlight = highlightIds.includes(id) ? 1 : 0.22;

  return base * highlight;
}

/** A small tuft of grass blades, hand-fitted so the base sits on the soil line. */
function grassTuft(cx: number, baseY: number): string[] {
  return [
    `M ${cx - 8} ${baseY} Q ${cx - 10} ${baseY - 16}, ${cx - 4} ${baseY - 22}`,
    `M ${cx - 2} ${baseY} Q ${cx - 2} ${baseY - 20}, ${cx + 2} ${baseY - 26}`,
    `M ${cx + 4} ${baseY} Q ${cx + 8} ${baseY - 16}, ${cx + 8} ${baseY - 22}`,
  ];
}

function ClickableGroup({
  id,
  opacity,
  label,
  onSelect,
  children,
}: {
  id: ComponentId;
  opacity: number;
  label: string;
  onSelect: (id: ComponentId) => void;
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

export function EcosystemScene(props: EcosystemSceneProps) {
  const { onSelect } = props;
  const op = (id: ComponentId) => opacityFor(id, props);

  return (
    <svg
      viewBox="0 0 380 240"
      className="h-full w-full"
      role="img"
      aria-label="A small pond and forest ecosystem scene with a sun, air, water, soil, trees, grass, an insect, a rabbit, a bird, and fungus"
    >
      <defs>
        <linearGradient id="es-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EAF6FB" />
          <stop offset="100%" stopColor="#F6FBF9" />
        </linearGradient>
        <linearGradient id="es-soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9A671" />
          <stop offset="100%" stopColor="#9C7A4C" />
        </linearGradient>
        <radialGradient id="es-water" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#DCF3FA" />
          <stop offset="100%" stopColor="#7FC4E0" />
        </radialGradient>
        <radialGradient id="es-sun" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#FFF6D6" />
          <stop offset="100%" stopColor="#F5C24B" />
        </radialGradient>
        <radialGradient id="es-foliage" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#BFE3B0" />
          <stop offset="100%" stopColor="#5FA24B" />
        </radialGradient>
      </defs>

      {/* Air / sky */}
      <ClickableGroup id="air" opacity={op("air")} label="Air" onSelect={onSelect}>
        <rect x={0} y={0} width={380} height={192} fill="url(#es-sky)" />
        <text x={12} y={20} className="fill-ink/50 dark:fill-bone/60 font-mono text-[9px] uppercase tracking-wide">
          Air
        </text>
      </ClickableGroup>

      {/* Soil / ground */}
      <ClickableGroup id="soil" opacity={op("soil")} label="Soil" onSelect={onSelect}>
        <path d="M 0 192 C 60 186, 320 186, 380 192 L 380 240 L 0 240 Z" fill="url(#es-soil)" />
        <text x={300} y={230} textAnchor="middle" className="fill-bone/80 font-mono text-[9px] uppercase tracking-wide">
          Soil
        </text>
      </ClickableGroup>

      {/* Sun */}
      <ClickableGroup id="sun" opacity={op("sun")} label="Sun" onSelect={onSelect}>
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
            const x1 = 322 + Math.cos(angle) * 30;
            const y1 = 42 + Math.sin(angle) * 30;
            const x2 = 322 + Math.cos(angle) * 38;
            const y2 = 42 + Math.sin(angle) * 38;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className="stroke-amber-400/70 dark:stroke-amber-300/60"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
            );
          })}
          <circle cx={322} cy={42} r={22} fill="url(#es-sun)" className="stroke-amber-500/50" strokeWidth={1.5} />
        </g>
      </ClickableGroup>

      {/* Water / pond */}
      <ClickableGroup id="water" opacity={op("water")} label="Water" onSelect={onSelect}>
        <ellipse cx={68} cy={206} rx={56} ry={22} fill="url(#es-water)" className="stroke-sky-600/40" strokeWidth={1.5} />
        <path d="M 32 202 Q 50 197, 68 202 T 104 202" fill="none" className="stroke-white/70" strokeWidth={1.5} strokeLinecap="round">
          <animate attributeName="d" dur="3s" repeatCount="indefinite" values="M 32 202 Q 50 197, 68 202 T 104 202;M 32 204 Q 50 209, 68 204 T 104 204;M 32 202 Q 50 197, 68 202 T 104 202" />
        </path>
        <text x={68} y={236} textAnchor="middle" className="fill-ink/60 dark:fill-bone/70 font-mono text-[9px] uppercase tracking-wide">
          Water
        </text>
      </ClickableGroup>

      {/* Tree */}
      <ClickableGroup id="tree" opacity={op("tree")} label="Tree" onSelect={onSelect}>
        <rect x={264} y={140} width={12} height={54} rx={3} className="fill-amber-800/70 dark:fill-amber-900/60" />
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-2 270 150; 2 270 150; -2 270 150"
            dur="5s"
            repeatCount="indefinite"
          />
          <circle cx={270} cy={128} r={28} fill="url(#es-foliage)" className="stroke-pine-700/40" strokeWidth={1.5} />
          <circle cx={250} cy={140} r={20} fill="url(#es-foliage)" className="stroke-pine-700/40" strokeWidth={1.5} />
          <circle cx={292} cy={140} r={20} fill="url(#es-foliage)" className="stroke-pine-700/40" strokeWidth={1.5} />
        </g>
        <text x={270} y={202} textAnchor="middle" className="fill-ink/60 dark:fill-bone/70 font-mono text-[9px] uppercase tracking-wide">
          Tree
        </text>
      </ClickableGroup>

      {/* Grass tufts */}
      <ClickableGroup id="grass" opacity={op("grass")} label="Grass" onSelect={onSelect}>
        {[130, 165, 200].map((cx, i) => (
          <g key={cx}>
            {grassTuft(cx, 196).map((d, j) => (
              <path key={j} d={d} fill="none" className="stroke-pine-600 dark:stroke-pine-300" strokeWidth={2.5} strokeLinecap="round" />
            ))}
          </g>
        ))}
        <text x={165} y={216} textAnchor="middle" className="fill-ink/60 dark:fill-bone/70 font-mono text-[9px] uppercase tracking-wide">
          Grass
        </text>
      </ClickableGroup>

      {/* Fungus */}
      <ClickableGroup id="fungus" opacity={op("fungus")} label="Fungus" onSelect={onSelect}>
        {[{ x: 246, y: 196 }, { x: 258, y: 200 }].map((m, i) => (
          <g key={i}>
            <rect x={m.x - 1.5} y={m.y - 6} width={3} height={8} className="fill-bone dark:fill-bone/80" />
            <path
              d={`M ${m.x - 8} ${m.y - 6} Q ${m.x} ${m.y - 16}, ${m.x + 8} ${m.y - 6} Z`}
              className="fill-rose-300 stroke-rose-500/50 dark:fill-rose-400/80"
              strokeWidth={1}
            />
          </g>
        ))}
        <text x={252} y={218} textAnchor="middle" className="fill-ink/60 dark:fill-bone/70 font-mono text-[9px] uppercase tracking-wide">
          Fungus
        </text>
      </ClickableGroup>

      {/* Insect */}
      <ClickableGroup id="insect" opacity={op("insect")} label="Insect" onSelect={onSelect}>
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 -4; 0 0" dur="1.6s" repeatCount="indefinite" />
          <ellipse cx={112} cy={178} rx={5} ry={3.5} className="fill-amber-600 dark:fill-amber-400" />
          <path d="M 108 176 L 100 170 M 108 180 L 100 186" className="stroke-ink/50 dark:stroke-bone/60" strokeWidth={1} />
          <path d="M 110 174 L 104 168 M 114 174 L 116 168" className="stroke-ink/50 dark:stroke-bone/60" strokeWidth={1} strokeLinecap="round" />
        </g>
      </ClickableGroup>

      {/* Rabbit */}
      <ClickableGroup id="rabbit" opacity={op("rabbit")} label="Rabbit" onSelect={onSelect}>
        <g>
          <ellipse cx={196} cy={186} rx={13} ry={9} className="fill-bone dark:fill-bone/90 stroke-ink/20 dark:stroke-chalkboard/40" strokeWidth={1} />
          <circle cx={210} cy={180} r={6} className="fill-bone dark:fill-bone/90 stroke-ink/20 dark:stroke-chalkboard/40" strokeWidth={1} />
          <path d="M 212 175 L 210 165 M 216 176 L 217 166" className="stroke-bone dark:stroke-bone/90" strokeWidth={2.5} strokeLinecap="round" />
          <circle cx={213} cy={179} r={1} className="fill-ink dark:fill-chalkboard" />
        </g>
        <text x={200} y={202} textAnchor="middle" className="fill-ink/60 dark:fill-bone/70 font-mono text-[9px] uppercase tracking-wide">
          Rabbit
        </text>
      </ClickableGroup>

      {/* Bird */}
      <ClickableGroup id="bird" opacity={op("bird")} label="Bird" onSelect={onSelect}>
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 -3; 0 0" dur="2.4s" repeatCount="indefinite" />
          <path d="M 96 62 Q 104 56, 112 62 Q 104 60, 96 62 Z" className="fill-sky-600 dark:fill-sky-400" />
          <path d="M 96 62 Q 88 58, 82 62 Q 90 63, 96 62 Z" className="fill-sky-600 dark:fill-sky-400" />
          <circle cx={110} cy={60} r={1.4} className="fill-ink dark:fill-chalkboard" />
        </g>
      </ClickableGroup>
    </svg>
  );
}
