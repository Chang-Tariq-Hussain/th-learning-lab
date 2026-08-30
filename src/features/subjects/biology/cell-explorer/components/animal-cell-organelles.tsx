/**
 * TASK 3 gave these five organelles (Nucleus, Mitochondria, Golgi
 * Apparatus, Rough ER, Ribosomes) their static geometry and shading --
 * none of that changes here. TASK 4 SCOPE ADDS: wrapping each one in
 * `OrganelleHotspot` so it's clickable/keyboard-focusable and shows the
 * glow + zoom "selected" feedback, plus `ORGANELLE_NAMES` so the info
 * panel has something to display. No descriptions, no fun facts, no
 * hover state -- those remain out of scope for a later task.
 *
 * Shapes are generated from `utils/organic-path.ts` (deterministic
 * math, not hand-typed bezier coordinates) so irregular outlines like
 * the nuclear envelope and the mitochondria are correct by
 * construction. Every gradient follows the same light-source
 * convention as `animal-cell-body.tsx`: highlight near the upper-left
 * (cx ~35%, cy ~30%), deepening toward the lower-right rim.
 */

import { beanPath, blobPath, rotatePoint, wavyTubePath } from "../utils/organic-path";
import { OrganelleHotspot } from "./organelle-hotspot";
import { OrganelleLabel } from "./organelle-label";

const NUCLEUS = { cx: 165, cy: 197, r: 58 };
const GOLGI = { cx: 258, cy: 168, width: 72, rotate: -20 };
const ROUGH_ER = { cx: 246, cy: 238, width: 92, rotate: 8 };
const MITOCHONDRIA = [
  { cx: 271, cy: 128, rx: 25, ry: 13, rotate: -32 },
  { cx: 288, cy: 246, rx: 23, ry: 12, rotate: 38 },
  { cx: 128, cy: 292, rx: 21, ry: 11, rotate: -14 },
];
const FREE_RIBOSOMES = [
  { cx: 98, cy: 148, count: 6 },
  { cx: 256, cy: 305, count: 5 },
];

/**
 * Hand-placed label anchors for the "Show labels" toggle — one pill per
 * distinct organelle id (not one per repeated instance, so the three
 * mitochondria and two ribosome clusters don't produce triplicate/
 * duplicate "Mitochondria"/"Ribosomes" pills). Positions are pushed
 * outward from the cell's own center (200, 200) along each organelle's
 * direction from that center, then nudged by hand to clear neighboring
 * organelles and labels at this specific layout — same "explicit
 * constants" approach the rest of this file already uses for geometry.
 */
const LABELS: { id: string; x: number; y: number; text: string }[] = [
  { id: "nucleus", x: 85, y: 190, text: "Nucleus" },
  { id: "golgi", x: 330, y: 163, text: "Golgi Apparatus" },
  { id: "roughER", x: 308, y: 289, text: "Rough ER" },
  { id: "mitochondria", x: 304, y: 93, text: "Mitochondria" },
  { id: "ribosomes", x: 65, y: 130, text: "Ribosomes" },
];

/**
 * id -> a representative center point in the 400x400 viewBox, used by
 * `useZoom` to re-center the zoomed view on whichever organelle was
 * last selected. For organelles with multiple instances (mitochondria,
 * ribosome clusters) this points at the first instance only — zooming
 * toward "a" mitochondrion is the useful behavior, not an arbitrary
 * average of all three positions.
 */
export const ANIMAL_ORGANELLE_CENTERS: Record<string, { x: number; y: number }> = {
  nucleus: { x: NUCLEUS.cx, y: NUCLEUS.cy },
  golgi: { x: GOLGI.cx, y: GOLGI.cy },
  roughER: { x: ROUGH_ER.cx, y: ROUGH_ER.cy },
  mitochondria: { x: MITOCHONDRIA[0]!.cx, y: MITOCHONDRIA[0]!.cy },
  ribosomes: { x: FREE_RIBOSOMES[0]!.cx, y: FREE_RIBOSOMES[0]!.cy },
};

/** id -> display name, for the info panel. No descriptions yet -- that's a later task. */
export const ORGANELLE_NAMES = {
  nucleus: "Nucleus",
  mitochondria: "Mitochondria",
  golgi: "Golgi Apparatus",
  roughER: "Rough Endoplasmic Reticulum",
  ribosomes: "Ribosomes",
} as const satisfies Record<string, string>;

export interface AnimalCellOrganellesProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  showLabels?: boolean;
}

export function AnimalCellOrganelles({ selectedId, onSelect, showLabels = false }: AnimalCellOrganellesProps) {
  const nucleusOuter = blobPath(NUCLEUS.cx, NUCLEUS.cy, NUCLEUS.r, { phase: 0.6, amplitude: 0.055 });
  const nucleusInner = blobPath(NUCLEUS.cx, NUCLEUS.cy, NUCLEUS.r * 0.86, { phase: 0.9, amplitude: 0.045 });
  const poreCount = 13;

  return (
    <g>
      <defs>
        {/* Palette/detail below matches the approved BioRender reference illustrations
            (nucleus + mitochondria, Learn More design pass) — hand-tuned procedural
            shapes rather than a literal trace, since raster asset download from
            BioRender's CDN isn't reachable from this environment's network policy. */}
        <radialGradient id="organelle-nucleus-fill" cx="35%" cy="28%" r="82%">
          <stop offset="0%" stopColor="#E4DBFB" />
          <stop offset="50%" stopColor="#B7A3E8" />
          <stop offset="100%" stopColor="#8871C9" />
        </radialGradient>
        <radialGradient id="organelle-nucleolus-fill" cx="32%" cy="28%" r="85%">
          <stop offset="0%" stopColor="#8873C7" />
          <stop offset="60%" stopColor="#6552A3" />
          <stop offset="100%" stopColor="#4B3A82" />
        </radialGradient>
        <linearGradient id="organelle-mito-fill" x1="15%" y1="10%" x2="85%" y2="95%">
          <stop offset="0%" stopColor="#F7B79A" />
          <stop offset="55%" stopColor="#E8825F" />
          <stop offset="100%" stopColor="#C65A3E" />
        </linearGradient>
        <linearGradient id="organelle-golgi-fill" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#FBE1B8" />
          <stop offset="55%" stopColor="#F0A85B" />
          <stop offset="100%" stopColor="#D97D35" />
        </linearGradient>
        <linearGradient id="organelle-er-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A9DFC0" />
          <stop offset="100%" stopColor="#3E9C6C" />
        </linearGradient>
        <radialGradient id="organelle-ribosome-fill" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#6E8CFF" />
          <stop offset="100%" stopColor="#3D5AFE" />
        </radialGradient>
        <filter id="organelle-soft-shadow" x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="3" floodColor="#5A2A1F" floodOpacity="0.28" />
        </filter>
      </defs>

      {/* ---- Rough ER ----
          Each wavy fold now gets a darker outline stroke underneath its
          colored fill stroke — the same "outline + fill" double-stroke
          treatment the mitochondria cristae already use — so individual
          folds read as distinct outlined membrane sheets instead of
          flat colored lines, matching the approved BioRender ER
          reference. Ribosome dots along the ER stay simple filled
          circles rather than the two-lobed subunit shape used for the
          free-floating ribosome clusters below: at 16-per-ER and this
          small a radius, individual subunit detail would just read as
          noise: circle density is what communicates "rough" ER here. */}
      <OrganelleHotspot id="roughER" label={ORGANELLE_NAMES.roughER} isSelected={selectedId === "roughER"} onSelect={onSelect}>
        <g transform={`translate(${ROUGH_ER.cx} ${ROUGH_ER.cy}) rotate(${ROUGH_ER.rotate})`} filter="url(#organelle-soft-shadow)">
          {[0, 1, 2, 3].map((i) => {
            const y = (i - 1.5) * 11;
            const d = wavyTubePath(-ROUGH_ER.width / 2, y, ROUGH_ER.width, 7.5, 5, i * 1.15);
            return (
              <g key={i}>
                <path d={d} stroke="#2E7A52" strokeWidth={6.5} fill="none" strokeLinecap="round" opacity={0.9} />
                <path d={d} stroke="url(#organelle-er-fill)" strokeWidth={5.5} fill="none" strokeLinecap="round" opacity={0.95} />
              </g>
            );
          })}
          {Array.from({ length: 16 }, (_, i) => {
            const x = -ROUGH_ER.width / 2 + (i / 15) * ROUGH_ER.width;
            const rowOffset = (i % 4) - 1.5;
            const y = rowOffset * 11 + (i % 2 === 0 ? -4 : 4);
            return <circle key={i} cx={x} cy={y} r={2} fill="url(#organelle-ribosome-fill)" stroke="#2036B0" strokeWidth={0.3} opacity={0.95} />;
          })}
        </g>
      </OrganelleHotspot>

      {/* ---- Golgi apparatus ----
          Same outline + fill double-stroke treatment as the ER above,
          so each cisterna reads as a distinct outlined sac rather than
          a soft-edged colored line — matching how the approved
          BioRender reference clearly separates its stacked layers. */}
      <OrganelleHotspot id="golgi" label={ORGANELLE_NAMES.golgi} isSelected={selectedId === "golgi"} onSelect={onSelect}>
        <g filter="url(#organelle-soft-shadow)">
          {[0, 1, 2, 3, 4].map((i) => {
            const y = (i - 2) * 7;
            const shrink = i * 2.2;
            const p1 = rotatePoint(GOLGI.cx, GOLGI.cy, -GOLGI.width / 2 + shrink, y, GOLGI.rotate);
            const c = rotatePoint(GOLGI.cx, GOLGI.cy, 0, y - 10, GOLGI.rotate);
            const p2 = rotatePoint(GOLGI.cx, GOLGI.cy, GOLGI.width / 2 - shrink, y, GOLGI.rotate);
            const d = `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} Q ${c.x.toFixed(2)} ${c.y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
            return (
              <g key={i}>
                <path d={d} stroke="#A85F2A" strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.9 - i * 0.04} />
                <path d={d} stroke="url(#organelle-golgi-fill)" strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.97 - i * 0.04} />
              </g>
            );
          })}
          {[-1, 1].map((side) => {
            const p = rotatePoint(GOLGI.cx, GOLGI.cy, side * (GOLGI.width / 2 + 8), 6, GOLGI.rotate);
            return <circle key={side} cx={p.x} cy={p.y} r={4} fill="url(#organelle-golgi-fill)" stroke="#A85F2A" strokeWidth={1.2} />;
          })}
        </g>
      </OrganelleHotspot>

      {/* ---- Mitochondria (each instance shares the "mitochondria" id) ----
          Cristae are now a continuous folded ridge (echoing the approved
          BioRender reference's comb-like inner membrane) instead of three
          straight lines — one darker ridge path plus a lighter, slightly
          offset highlight path for the same "double outline" fold detail
          the reference shows, at a wave count that stays legible at the
          organelle's small on-screen size. */}
      {MITOCHONDRIA.map((m, index) => {
        const path = beanPath(m.cx, m.cy, m.rx, m.ry, m.rotate);
        const cristaeWidth = m.rx * 1.05;
        const cristaeAmplitude = m.ry * 0.34;
        const ridgePath = wavyTubePath(-cristaeWidth / 2, 0, cristaeWidth, cristaeAmplitude, 3, 0);
        const highlightPath = wavyTubePath(-cristaeWidth / 2, -m.ry * 0.06, cristaeWidth * 0.9, cristaeAmplitude * 0.8, 3, 0.15);
        return (
          <OrganelleHotspot key={index} id="mitochondria" label={ORGANELLE_NAMES.mitochondria} isSelected={selectedId === "mitochondria"} onSelect={onSelect}>
            <g filter="url(#organelle-soft-shadow)">
              <path d={path} fill="url(#organelle-mito-fill)" stroke="#A8432C" strokeWidth={1.75} />
              <g transform={`translate(${m.cx} ${m.cy}) rotate(${m.rotate})`}>
                <path d={ridgePath} stroke="#B94B34" strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.85} />
                <path d={highlightPath} stroke="#F7CBAA" strokeWidth={1} fill="none" strokeLinecap="round" opacity={0.6} />
              </g>
            </g>
          </OrganelleHotspot>
        );
      })}

      {/* ---- Free ribosomes (each cluster shares the "ribosomes" id) ----
          Each ribosome is now two overlapping ellipses (a larger bottom
          subunit, a smaller top subunit) instead of a single circle —
          echoing the two-subunit "snowman" shape in the approved
          BioRender reference — with a small per-instance rotation so a
          cluster doesn't look like a stamped copy-paste grid. */}
      {FREE_RIBOSOMES.map((cluster, ci) => (
        <OrganelleHotspot key={ci} id="ribosomes" label={ORGANELLE_NAMES.ribosomes} isSelected={selectedId === "ribosomes"} onSelect={onSelect}>
          <g>
            {Array.from({ length: cluster.count }, (_, i) => {
              const angle = (i / cluster.count) * Math.PI * 2 + i;
              const radius = 13 * (0.5 + (0.5 * ((i * 53) % 7)) / 7);
              const x = cluster.cx + Math.cos(angle) * radius;
              const y = cluster.cy + Math.sin(angle) * radius;
              const spin = (((i * 47) % 12) - 6) * 6;
              return (
                <g key={i} transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${spin})`}>
                  <ellipse cx={0} cy={1.05} rx={1.9} ry={1.6} fill="url(#organelle-ribosome-fill)" stroke="#2036B0" strokeWidth={0.35} />
                  <ellipse cx={0} cy={-1.25} rx={1.3} ry={1.15} fill="url(#organelle-ribosome-fill)" stroke="#2036B0" strokeWidth={0.35} />
                </g>
              );
            })}
          </g>
        </OrganelleHotspot>
      ))}

      {/* ---- Nucleus (drawn last so it sits clearly on top) ----
          Palette lightened to the pastel lavender of the reference; pores
          switched from cream dots to small violet ovals (matching how the
          reference renders nuclear pores as dark notches on the rim,
          rather than light highlights); three faint chromatin strands
          added inside using the same `wavyTubePath` helper the ER already
          uses, for the internal texture the reference shows. */}
      <OrganelleHotspot id="nucleus" label={ORGANELLE_NAMES.nucleus} isSelected={selectedId === "nucleus"} onSelect={onSelect}>
        <g filter="url(#organelle-soft-shadow)">
          <path d={nucleusOuter} fill="url(#organelle-nucleus-fill)" stroke="#5A4A94" strokeWidth={2.25} />
          <path d={nucleusInner} fill="none" stroke="#5A4A94" strokeWidth={1.1} opacity={0.5} />
          {Array.from({ length: poreCount }, (_, i) => {
            const theta = (i / poreCount) * Math.PI * 2;
            return (
              <circle
                key={i}
                cx={NUCLEUS.cx + Math.cos(theta) * NUCLEUS.r * 0.985}
                cy={NUCLEUS.cy + Math.sin(theta) * NUCLEUS.r * 0.985}
                r={2.2}
                fill="#6B5A9E"
                opacity={0.85}
              />
            );
          })}
          {[0, 1, 2].map((i) => {
            const len = NUCLEUS.r * (0.9 + i * 0.08);
            const d = wavyTubePath(-len / 2, 0, len, 5, 3, i * 1.4);
            const angle = -25 + i * 28;
            const offsetY = (i - 1) * NUCLEUS.r * 0.28;
            return (
              <path
                key={`chromatin-${i}`}
                d={d}
                transform={`translate(${NUCLEUS.cx - NUCLEUS.r * 0.08} ${NUCLEUS.cy + offsetY}) rotate(${angle})`}
                stroke="#6552A3"
                strokeWidth={1.1}
                fill="none"
                opacity={0.22}
                strokeLinecap="round"
              />
            );
          })}
          <ellipse cx={NUCLEUS.cx - NUCLEUS.r * 0.22} cy={NUCLEUS.cy - NUCLEUS.r * 0.2} rx={NUCLEUS.r * 0.32} ry={NUCLEUS.r * 0.22} fill="#FFFFFF" opacity={0.22} />
          <circle cx={NUCLEUS.cx + NUCLEUS.r * 0.24} cy={NUCLEUS.cy - NUCLEUS.r * 0.1} r={NUCLEUS.r * 0.34} fill="url(#organelle-nucleolus-fill)" />
        </g>
      </OrganelleHotspot>

      {/* ---- "Show labels" pills — drawn last so they sit above every organelle. Non-interactive (pointerEvents="none" on each pill) so they never block a click/tap meant for the shape underneath. ---- */}
      {showLabels
        ? LABELS.map((label) => <OrganelleLabel key={label.id} x={label.x} y={label.y} text={label.text} />)
        : null}
    </g>
  );
}
