"use client";

import { Label } from "../../cellular-energy-shared/svg-bits";
import { FLOW_STEPS } from "../model";

/** Five connected boxes: stored energy → oxidation → transfer → ATP → work. The selected step is highlighted; every box is a button. */
export function FlowDiagram({ selected, onSelect }: { selected: number; onSelect: (i: number) => void }) {
  const w = 160;
  const gap = 28;
  return (
    <svg viewBox="0 0 960 220" className="h-auto w-full" role="group" aria-label="Energy transformation flow" data-testid="flow-svg">
      <rect width={960} height={220} rx={16} fill="var(--ce-field-a)" />
      {FLOW_STEPS.map((s, i) => {
        const x = 20 + i * (w + gap);
        const on = i === selected;
        return (
          <g key={s.id} className="ce-hit" role="button" tabIndex={0} aria-pressed={on} aria-label={s.title} data-flow={i} onClick={() => onSelect(i)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onSelect(i))}>
            <rect x={x} y={50} width={w} height={110} rx={16} fill={on ? "var(--ce-atp)" : "var(--ce-halo)"} fillOpacity={on ? 0.9 : 0.75} stroke={on ? "var(--ce-sel)" : "var(--ce-line)"} strokeWidth={on ? 5 : 2.5} />
            <text x={x + w / 2} y={44} textAnchor="middle" fontSize={15} fontWeight={800} fill="var(--ce-ink)">{i + 1}</text>
            {s.short.split(" & ").flatMap((p) => p.split(" ")).reduce<string[]>((acc, word) => {
              const last = acc[acc.length - 1];
              if (last !== undefined && (last + " " + word).length <= 14) acc[acc.length - 1] = last + " " + word;
              else acc.push(word);
              return acc;
            }, []).map((line, li) => (
              <text key={li} x={x + w / 2} y={96 + li * 22} textAnchor="middle" fontSize={17} fontWeight={700} fill={on ? "#1a1204" : "var(--ce-ink)"}>{line}</text>
            ))}
            {i < FLOW_STEPS.length - 1 ? <path d={`M ${x + w + 4} 105 h ${gap - 8}`} stroke="var(--ce-ink)" strokeWidth={4} className="ce-flow" markerEnd="url(#ce-flow-arrow)" /> : null}
          </g>
        );
      })}
      <defs>
        <marker id="ce-flow-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--ce-ink)" />
        </marker>
      </defs>
      <Label x={480} y={196} size={15} weight={500}>Energy is transformed at every step — never created or destroyed. Some ends up as heat.</Label>
    </svg>
  );
}

/** Two small free-energy diagrams: an energy-releasing (exergonic) and an energy-requiring (endergonic) reaction. */
export function FreeEnergyDiagrams({ coupled }: { coupled: boolean }) {
  return (
    <svg viewBox="0 0 640 250" className="h-auto w-full" role="img" aria-label="Free energy diagrams: exergonic reactions go down in free energy, endergonic reactions go up; coupling to ATP hydrolysis gives a net decrease." data-testid="free-energy-svg">
      <rect width={640} height={250} rx={14} fill="var(--ce-field-a)" />
      <g>
        <Label x={160} y={28} size={16} weight={800}>Releases free energy (ΔG &lt; 0)</Label>
        <line x1={50} y1={70} x2={150} y2={70} stroke="var(--ce-fuel)" strokeWidth={6} />
        <line x1={170} y1={190} x2={270} y2={190} stroke="var(--ce-fuel)" strokeWidth={6} />
        <path d="M 100 76 V 182" stroke="var(--ce-ink)" strokeWidth={3} markerEnd="url(#ce-fe-arrow)" />
        <Label x={100} y={60} size={13}>reactants</Label>
        <Label x={220} y={212} size={13}>products</Label>
        <Label x={160} y={238} size={13} weight={500}>e.g. glucose oxidation, ATP hydrolysis</Label>
      </g>
      <g>
        <Label x={480} y={28} size={16} weight={800}>{coupled ? "Coupled: net ΔG < 0" : "Needs free energy (ΔG > 0)"}</Label>
        <line x1={370} y1={190} x2={470} y2={190} stroke="var(--ce-work)" strokeWidth={6} />
        <line x1={490} y1={coupled ? 215 : 70} x2={590} y2={coupled ? 215 : 70} stroke="var(--ce-work)" strokeWidth={6} />
        <path d={coupled ? "M 420 196 V 210" : "M 420 184 V 76"} stroke="var(--ce-ink)" strokeWidth={3} markerEnd="url(#ce-fe-arrow)" />
        <Label x={420} y={176} size={13}>reactants</Label>
        <Label x={540} y={coupled ? 240 : 60} size={13}>products</Label>
        <Label x={480} y={coupled ? 160 : 238} size={13} weight={500}>{coupled ? "ATP + H₂O → ADP + Pi pays the cost" : "e.g. building a protein alone"}</Label>
      </g>
      <defs>
        <marker id="ce-fe-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--ce-ink)" />
        </marker>
      </defs>
    </svg>
  );
}
