"use client";

import type { BeatClock } from "../../meiosis/hooks/use-beat-timeline";
import { useClockPos } from "../../meiosis/hooks/use-beat-timeline";
import { lerp, ramp } from "../../cellular-energy-shared/style";
import { Chip, Label } from "../../cellular-energy-shared/svg-bits";

export type MetaMode = "catabolism" | "anabolism" | "compare";
const W = 960;
const H = 540;
const N = 6;

/** One panel: a chain of six units that comes apart (catabolism) or is built (anabolism), with the ATP / heat consequences. */
function Panel({ kind, x0, y0, w, pos }: { kind: "cat" | "ana"; x0: number; y0: number; w: number; pos: number }) {
  const t = ramp(pos, 0.7, 2.4); // 0 = start state, 1 = end state
  const unit = Math.min(52, (w - 60) / N);
  const cat = kind === "cat";
  const k = cat ? t : 1 - t;
  const energy = ramp(pos, 1.6, 2.6);
  return (
    <g transform={`translate(${x0} ${y0})`}>
      <rect width={w} height={400} rx={16} fill="var(--ce-halo)" fillOpacity={0.5} stroke={cat ? "var(--ce-fuel)" : "var(--ce-work)"} strokeWidth={3} />
      <Label x={w / 2} y={36} size={22} weight={800}>{cat ? "Catabolism: break down" : "Anabolism: build up"}</Label>
      <Label x={w / 2} y={62} size={15} weight={500}>{cat ? "large molecule → small molecules" : "small molecules → large molecule"}</Label>
      {Array.from({ length: N }, (_, i) => {
        const bx = 30 + (w - 60 - unit) * (i / (N - 1));
        const apartX = bx + (i - (N - 1) / 2) * 14 * k;
        const apartY = 170 + Math.sin(i * 2.1) * 36 * k;
        const joinedY = 170;
        const px = lerp(bx, apartX, k);
        const py = lerp(joinedY, apartY, k);
        return (
          <g key={i}>
            {i < N - 1 ? <line x1={px + unit / 2} y1={py + unit / 2} x2={lerp(bx, 30 + (w - 60 - unit) * ((i + 1) / (N - 1)), 1) + unit / 2} y2={joinedY + unit / 2} stroke="var(--ce-line)" strokeWidth={5} opacity={1 - k} />: null}
            <rect x={px} y={py} width={unit} height={unit} rx={10} fill={cat ? "var(--ce-fuel)" : "var(--ce-ribose)"} stroke="var(--ce-line)" strokeWidth={2.5} />
            <text x={px + unit / 2} y={py + unit / 2 + 5} textAnchor="middle" fontSize={14} fontWeight={800} fill="#0b1f08">{i + 1}</text>
          </g>
        );
      })}
      {/* energy event */}
      {cat ? (
        <g opacity={energy}>
          <Chip x={w * 0.3} y={310} r={20} color="var(--ce-atp)" text="ATP" fs={13} />
          <Label x={w * 0.3 + 34} y={316} anchor="start" size={16}>ATP made</Label>
          <Label x={w / 2} y={364} size={16} weight={500}>ΔG &lt; 0: free energy released (some captured, some lost as heat)</Label>
        </g>
      ) : (
        <g opacity={energy}>
          <Chip x={w * 0.22} y={310} r={20} color="var(--ce-atp)" text="ATP" fs={13} />
          <Label x={w * 0.22 + 30} y={316} anchor="start" size={15}>→ ADP + Pi</Label>
          <Label x={w / 2} y={364} size={16} weight={500}>ΔG &gt; 0 alone; coupled to ATP hydrolysis: allowed</Label>
        </g>
      )}
    </g>
  );
}

export function MetabolismStage({ mode, clock }: { mode: MetaMode; clock: BeatClock }) {
  const pos = useClockPos(clock);
  const single = mode !== "compare";
  const w = single ? 760 : 440;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Catabolism breaks molecules down and releases free energy; anabolism builds molecules up and needs ATP." data-testid="metabolism-svg">
      <defs>
        <radialGradient id="ce-meta-bg" cx="50%" cy="35%" r="85%">
          <stop offset="0%" stopColor="var(--ce-field-a)" />
          <stop offset="100%" stopColor="var(--ce-field-b)" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} rx={18} fill="url(#ce-meta-bg)" />
      {single ? <Panel kind={mode === "catabolism" ? "cat" : "ana"} x0={100} y0={60} w={w} pos={pos} /> : (
        <>
          <Panel kind="cat" x0={30} y0={60} w={w} pos={pos} />
          <Panel kind="ana" x0={490} y0={60} w={w} pos={pos} />
        </>
      )}
      <Label x={W / 2} y={510} size={16} weight={500}>Metabolism = catabolism + anabolism. ATP links the two.</Label>
    </svg>
  );
}
