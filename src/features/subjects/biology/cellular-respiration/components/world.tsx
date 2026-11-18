"use client";

import { memo } from "react";
import { Chip, Label } from "../../cellular-energy-shared/svg-bits";
import { STAGES, type Location } from "../model";

export type Tracer = "none" | "carbon" | "electrons" | "energy";
const key = (e: React.KeyboardEvent, f: () => void) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), f());

/* ----------------------------------------------------------------------------------------- whole cell */
export const CellLayer = memo(function CellLayer({ loc, tracer, showLabels, onZoom }: { loc: Location; tracer: Tracer; showLabels: boolean; onZoom: () => void }) {
  const cyto = loc === "cytosol";
  return (
    <g>
      <rect width={960} height={600} fill="var(--ce-field-b)" />
      <ellipse cx={480} cy={300} rx={430} ry={265} fill="var(--ce-cyto-a)" stroke="var(--ce-membrane)" strokeWidth={7} />
      <ellipse cx={480} cy={300} rx={405} ry={242} fill="var(--ce-cyto-b)" fillOpacity={0.35} stroke={cyto ? "var(--ce-sel)" : "none"} strokeWidth={6} className={cyto ? "ce-pulse" : undefined} />
      <ellipse cx={250} cy={230} rx={70} ry={55} fill="var(--ce-work)" fillOpacity={0.2} stroke="var(--ce-work)" strokeWidth={3} />
      {showLabels ? <Label x={250} y={236} size={14}>Nucleus</Label> : null}
      {showLabels ? <Label x={480} y={70} size={18}>Cell boundary (plasma membrane)</Label> : null}
      {showLabels ? <Label x={230} y={430} size={17} weight={700}>Cytoplasm: cytosol (glycolysis)</Label> : null}
      <g className="ce-hit" role="button" tabIndex={0} aria-label="Zoom in to the mitochondrion" data-testid="zoom-mito" onClick={onZoom} onKeyDown={(e) => key(e, onZoom)}>
        <rect x={500} y={250} width={240} height={120} rx={60} fill="var(--ce-mito-a)" stroke={!cyto ? "var(--ce-sel)" : "var(--ce-membrane)"} strokeWidth={!cyto ? 6 : 4} className={!cyto ? "ce-pulse" : undefined} />
        <path d="M 545 272 q 12 38 0 76 M 585 262 q 12 48 0 96 M 625 262 q 12 48 0 96 M 665 262 q 12 48 0 96 M 705 272 q 12 38 0 76" fill="none" stroke="var(--ce-membrane)" strokeWidth={3.5} opacity={0.7} />
        {showLabels ? <Label x={620} y={398} size={16}>Mitochondrion (click to zoom in)</Label> : null}
      </g>
      <Chip x={90} y={300} r={20} color="var(--ce-fuel)" text="Glc" fs={12} />
      {tracer !== "none" ? (
        <g fill="none" strokeWidth={6} className="ce-flow" opacity={0.85}>
          {tracer === "carbon" ? <path d="M 110 300 C 250 330, 400 320, 500 310 M 740 300 C 800 260, 860 220, 900 190" stroke="var(--ce-fuel)" /> : null}
          {tracer === "electrons" ? <path d="M 180 330 C 300 380, 450 390, 540 340 M 620 340 L 700 300" stroke="var(--ce-e)" /> : null}
          {tracer === "energy" ? <path d="M 300 310 C 340 250, 400 200, 470 190 M 660 250 C 560 150, 420 120, 330 160" stroke="var(--ce-atp)" /> : null}
        </g>
      ) : null}
      {showLabels && tracer === "carbon" ? <Label x={900} y={176} size={14} anchor="end">CO₂ leaves the cell</Label> : null}
    </g>
  );
});

/* ----------------------------------------------------------------------------------------- mitochondrion */
export const MitoLayer = memo(function MitoLayer({ stage, tracer, showLabels, onStage }: { stage: number; tracer: Tracer; showLabels: boolean; onStage: (s: number) => void }) {
  const badge = (s: number, x: number, y: number) => {
    const on = s === stage;
    return (
      <g key={s} className="ce-hit" role="button" tabIndex={0} aria-pressed={on} aria-label={`Stage ${s + 1}: ${STAGES[s]!.name}`} data-badge={s} onClick={() => onStage(s)} onKeyDown={(e) => key(e, () => onStage(s))}>
        <rect x={x - 88} y={y - 20} width={176} height={40} rx={20} fill={on ? "var(--ce-atp)" : "var(--ce-halo)"} fillOpacity={on ? 1 : 0.8} stroke={on ? "var(--ce-sel)" : "var(--ce-line)"} strokeWidth={on ? 5 : 2.5} />
        <text x={x} y={y + 6} textAnchor="middle" fontSize={15} fontWeight={800} fill={on ? "#1a1204" : "var(--ce-ink)"}>{s + 1} · {STAGES[s]!.short}</text>
      </g>
    );
  };
  return (
    <g>
      <rect width={960} height={600} fill="var(--ce-cyto-a)" />
      {showLabels ? <Label x={480} y={36} size={17} weight={700}>Cytosol</Label> : null}
      {/* outer membrane */}
      <rect x={70} y={110} width={820} height={400} rx={190} fill="var(--ce-ims)" stroke="var(--ce-membrane)" strokeWidth={8} />
      {/* inner membrane */}
      <rect x={110} y={150} width={740} height={320} rx={150} fill="var(--ce-matrix)" stroke="var(--ce-membrane)" strokeWidth={6} />
      {/* cristae */}
      <path d="M 330 160 q 0 80 40 80 q 40 0 40 -80 M 520 160 q 0 80 40 80 q 40 0 40 -80 M 690 160 q 0 80 40 80 q 40 0 40 -80 M 330 460 q 0 -80 40 -80 q 40 0 40 80 M 520 460 q 0 -80 40 -80 q 40 0 40 80" fill="none" stroke="var(--ce-membrane)" strokeWidth={6} />
      {showLabels ? (
        <g>
          <Label x={480} y={98} size={16} weight={700}>Outer mitochondrial membrane</Label>
          <Label x={130} y={140} size={15} anchor="start" weight={600}>Intermembrane space</Label>
          <Label x={480} y={310} size={20} weight={800}>Mitochondrial matrix</Label>
          <Label x={480} y={534} size={16} weight={700}>Inner mitochondrial membrane (folded into cristae)</Label>
        </g>
      ) : null}
      {badge(0, 160, 60)}
      {badge(1, 300, 320)}
      {badge(2, 480, 350)}
      {badge(3, 250, 125)}
      {badge(4, 760, 125)}
      {/* tracer overlays */}
      {tracer !== "none" ? (
        <g fill="none" strokeWidth={6} className="ce-flow" opacity={0.85}>
          {tracer === "carbon" ? <path d="M 160 80 C 160 200, 220 300, 300 300 M 300 340 L 480 330 M 560 330 C 700 340, 860 260, 900 60" stroke="var(--ce-fuel)" /> : null}
          {tracer === "electrons" ? <path d="M 480 380 C 420 410, 340 420, 300 380 M 300 380 L 560 240 L 760 300" stroke="var(--ce-e)" /> : null}
          {tracer === "energy" ? <path d="M 160 90 L 200 20 M 480 380 L 540 420 M 760 200 C 780 260, 820 330, 860 420" stroke="var(--ce-atp)" /> : null}
        </g>
      ) : null}
    </g>
  );
});
