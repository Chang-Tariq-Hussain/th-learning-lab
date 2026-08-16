"use client";

import { Button } from "@/components/ui/button";

interface AlveoliViewProps {
  exchanging: boolean;
  done: boolean;
  onExchange: () => void;
}

// Grape-like cluster of alveolar sacs, roughly centered here.
const CLUSTER_CENTER = { cx: 68, cy: 70 };
const ALVEOLUS_BUBBLES = [
  { dx: -18, dy: -14, r: 22 },
  { dx: 16, dy: -18, r: 20 },
  { dx: -20, dy: 16, r: 20 },
  { dx: 14, dy: 18, r: 22 },
  { dx: -2, dy: 0, r: 16 },
];
const CAPILLARY_X = 160;

export function AlveoliView({ exchanging, done, onExchange }: AlveoliViewProps) {
  const shifted = exchanging || done;

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">Alveoli — Gas Exchange</p>

      <svg
        viewBox="0 0 220 140"
        className="mx-auto mt-3 h-40 w-full max-w-xs"
        role="img"
        aria-label="A zoomed-in view of a cluster of alveolar air sacs next to a capillary, with oxygen and carbon dioxide moving between them"
      >
        <defs>
          <radialGradient id="av-alveolus" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#EAFBF8" />
            <stop offset="100%" stopColor="#BFE8E1" />
          </radialGradient>
        </defs>

        {/* Alveolar sac cluster (grape-like) */}
        <g className="stroke-subject-biology/60 dark:stroke-subject-biology/50" strokeWidth={2}>
          {ALVEOLUS_BUBBLES.map((b, i) => (
            <circle
              key={i}
              cx={CLUSTER_CENTER.cx + b.dx}
              cy={CLUSTER_CENTER.cy + b.dy}
              r={b.r}
              fill="url(#av-alveolus)"
            />
          ))}
        </g>
        <text x={CLUSTER_CENTER.cx} y={118} textAnchor="middle" className="fill-ink/60 dark:fill-bone/60 font-mono text-[9px] uppercase tracking-wide">
          Alveoli
        </text>

        {/* Capillary — a curved vessel wrapping alongside the cluster */}
        <path
          d={`M ${CAPILLARY_X} 14 C ${CAPILLARY_X + 22} 30, ${CAPILLARY_X + 22} 110, ${CAPILLARY_X} 126`}
          fill="none"
          className="stroke-rose-500/60 dark:stroke-rose-400/50"
          strokeWidth={16}
          strokeLinecap="round"
        />
        <path
          d={`M ${CAPILLARY_X} 14 C ${CAPILLARY_X + 22} 30, ${CAPILLARY_X + 22} 110, ${CAPILLARY_X} 126`}
          fill="none"
          className="stroke-rose-300/70 dark:stroke-rose-300/40"
          strokeWidth={9}
          strokeLinecap="round"
        />
        <text x={CAPILLARY_X + 8} y={136} textAnchor="middle" className="fill-ink/60 dark:fill-bone/60 font-mono text-[9px] uppercase tracking-wide">
          Capillary
        </text>

        {/* O2: alveolus -> blood */}
        <circle
          cx={shifted ? CAPILLARY_X : CLUSTER_CENTER.cx + 14}
          cy={54}
          r={5}
          className="fill-rose-500 stroke-rose-700 dark:fill-rose-400 dark:stroke-rose-600 transition-[cx] duration-[1400ms] ease-in-out"
          strokeWidth={1.5}
        />
        <text x={shifted ? CAPILLARY_X : CLUSTER_CENTER.cx + 14} y={40} textAnchor="middle" className="fill-rose-600 dark:fill-rose-300 font-mono text-[8px] font-semibold transition-[x] duration-[1400ms] ease-in-out">
          O₂
        </text>

        {/* CO2: blood -> alveolus */}
        <circle
          cx={shifted ? CLUSTER_CENTER.cx - 14 : CAPILLARY_X}
          cy={88}
          r={5}
          className="fill-sky-500 stroke-sky-700 dark:fill-sky-400 dark:stroke-sky-600 transition-[cx] duration-[1400ms] ease-in-out"
          strokeWidth={1.5}
        />
        <text x={shifted ? CLUSTER_CENTER.cx - 14 : CAPILLARY_X} y={104} textAnchor="middle" className="fill-sky-600 dark:fill-sky-300 font-mono text-[8px] font-semibold transition-[x] duration-[1400ms] ease-in-out">
          CO₂
        </text>
      </svg>

      <div className="mt-2 flex justify-center">
        <Button variant="primary" size="sm" onClick={onExchange} disabled={exchanging}>
          Gas Exchange
        </Button>
      </div>

      <p className="mt-3 min-h-[2.5rem] text-center text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
        {done
          ? "Oxygen-rich blood leaves the lungs. Carbon dioxide leaves the body through exhalation."
          : "Alveoli have thin walls and are surrounded by tiny blood vessels, letting oxygen and carbon dioxide move between the air and the blood."}
      </p>
    </div>
  );
}
