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
}

export function AnimalCellOrganelles({ selectedId, onSelect }: AnimalCellOrganellesProps) {
  const nucleusOuter = blobPath(NUCLEUS.cx, NUCLEUS.cy, NUCLEUS.r, { phase: 0.6, amplitude: 0.055 });
  const nucleusInner = blobPath(NUCLEUS.cx, NUCLEUS.cy, NUCLEUS.r * 0.86, { phase: 0.9, amplitude: 0.045 });
  const poreCount = 13;

  return (
    <g>
      <defs>
        <radialGradient id="organelle-nucleus-fill" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#B9A0F2" />
          <stop offset="55%" stopColor="#8A5FE0" />
          <stop offset="100%" stopColor="#5E3AAE" />
        </radialGradient>
        <radialGradient id="organelle-nucleolus-fill" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#4C2E86" />
          <stop offset="100%" stopColor="#331F5C" />
        </radialGradient>
        <linearGradient id="organelle-mito-fill" x1="20%" y1="15%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#F0857D" />
          <stop offset="55%" stopColor="#D6534A" />
          <stop offset="100%" stopColor="#A9382F" />
        </linearGradient>
        <linearGradient id="organelle-golgi-fill" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#F5B573" />
          <stop offset="100%" stopColor="#DE7F35" />
        </linearGradient>
        <linearGradient id="organelle-er-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7FCB9E" />
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

      {/* ---- Rough ER ---- */}
      <OrganelleHotspot id="roughER" label={ORGANELLE_NAMES.roughER} isSelected={selectedId === "roughER"} onSelect={onSelect}>
        <g transform={`translate(${ROUGH_ER.cx} ${ROUGH_ER.cy}) rotate(${ROUGH_ER.rotate})`} filter="url(#organelle-soft-shadow)">
          {[0, 1, 2, 3].map((i) => {
            const y = (i - 1.5) * 11;
            const d = wavyTubePath(-ROUGH_ER.width / 2, y, ROUGH_ER.width, 7.5, 5, i * 1.15);
            return <path key={i} d={d} stroke="url(#organelle-er-fill)" strokeWidth={5.5} fill="none" strokeLinecap="round" opacity={0.92} />;
          })}
          {Array.from({ length: 16 }, (_, i) => {
            const x = -ROUGH_ER.width / 2 + (i / 15) * ROUGH_ER.width;
            const rowOffset = (i % 4) - 1.5;
            const y = rowOffset * 11 + (i % 2 === 0 ? -4 : 4);
            return <circle key={i} cx={x} cy={y} r={2} fill="url(#organelle-ribosome-fill)" />;
          })}
        </g>
      </OrganelleHotspot>

      {/* ---- Golgi apparatus ---- */}
      <OrganelleHotspot id="golgi" label={ORGANELLE_NAMES.golgi} isSelected={selectedId === "golgi"} onSelect={onSelect}>
        <g filter="url(#organelle-soft-shadow)">
          {[0, 1, 2, 3, 4].map((i) => {
            const y = (i - 2) * 7;
            const shrink = i * 2.2;
            const p1 = rotatePoint(GOLGI.cx, GOLGI.cy, -GOLGI.width / 2 + shrink, y, GOLGI.rotate);
            const c = rotatePoint(GOLGI.cx, GOLGI.cy, 0, y - 10, GOLGI.rotate);
            const p2 = rotatePoint(GOLGI.cx, GOLGI.cy, GOLGI.width / 2 - shrink, y, GOLGI.rotate);
            return (
              <path
                key={i}
                d={`M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} Q ${c.x.toFixed(2)} ${c.y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`}
                stroke="url(#organelle-golgi-fill)"
                strokeWidth={5}
                strokeLinecap="round"
                fill="none"
                opacity={0.95 - i * 0.05}
              />
            );
          })}
          {[-1, 1].map((side) => {
            const p = rotatePoint(GOLGI.cx, GOLGI.cy, side * (GOLGI.width / 2 + 8), 6, GOLGI.rotate);
            return <circle key={side} cx={p.x} cy={p.y} r={4} fill="url(#organelle-golgi-fill)" stroke="#B85E1D" strokeWidth={1} />;
          })}
        </g>
      </OrganelleHotspot>

      {/* ---- Mitochondria (each instance shares the "mitochondria" id) ---- */}
      {MITOCHONDRIA.map((m, index) => {
        const path = beanPath(m.cx, m.cy, m.rx, m.ry, m.rotate);
        const cristaeCount = 3;
        return (
          <OrganelleHotspot key={index} id="mitochondria" label={ORGANELLE_NAMES.mitochondria} isSelected={selectedId === "mitochondria"} onSelect={onSelect}>
            <g filter="url(#organelle-soft-shadow)">
              <path d={path} fill="url(#organelle-mito-fill)" stroke="#8C2E26" strokeWidth={1.75} />
              {Array.from({ length: cristaeCount }, (_, i) => {
                const t = (i + 1) / (cristaeCount + 1) - 0.5;
                const localX = t * m.rx * 1.3;
                const p1 = rotatePoint(m.cx, m.cy, localX, -m.ry * 0.55, m.rotate);
                const p2 = rotatePoint(m.cx, m.cy, localX, m.ry * 0.55, m.rotate);
                return (
                  <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#5E1D17" strokeWidth={1.4} opacity={0.6} strokeLinecap="round" />
                );
              })}
            </g>
          </OrganelleHotspot>
        );
      })}

      {/* ---- Free ribosomes (each cluster shares the "ribosomes" id) ---- */}
      {FREE_RIBOSOMES.map((cluster, ci) => (
        <OrganelleHotspot key={ci} id="ribosomes" label={ORGANELLE_NAMES.ribosomes} isSelected={selectedId === "ribosomes"} onSelect={onSelect}>
          <g>
            {Array.from({ length: cluster.count }, (_, i) => {
              const angle = (i / cluster.count) * Math.PI * 2 + i;
              const radius = 13 * (0.5 + (0.5 * ((i * 53) % 7)) / 7);
              return (
                <circle
                  key={i}
                  cx={cluster.cx + Math.cos(angle) * radius}
                  cy={cluster.cy + Math.sin(angle) * radius}
                  r={2.4}
                  fill="url(#organelle-ribosome-fill)"
                  stroke="#2036B0"
                  strokeWidth={0.4}
                />
              );
            })}
          </g>
        </OrganelleHotspot>
      ))}

      {/* ---- Nucleus (drawn last so it sits clearly on top) ---- */}
      <OrganelleHotspot id="nucleus" label={ORGANELLE_NAMES.nucleus} isSelected={selectedId === "nucleus"} onSelect={onSelect}>
        <g filter="url(#organelle-soft-shadow)">
          <path d={nucleusOuter} fill="url(#organelle-nucleus-fill)" stroke="#4C2E86" strokeWidth={2.25} />
          <path d={nucleusInner} fill="none" stroke="#4C2E86" strokeWidth={1.1} opacity={0.5} />
          {Array.from({ length: poreCount }, (_, i) => {
            const theta = (i / poreCount) * Math.PI * 2;
            return (
              <circle
                key={i}
                cx={NUCLEUS.cx + Math.cos(theta) * NUCLEUS.r * 0.985}
                cy={NUCLEUS.cy + Math.sin(theta) * NUCLEUS.r * 0.985}
                r={1.8}
                fill="#F4E3C4"
                opacity={0.9}
              />
            );
          })}
          <ellipse cx={NUCLEUS.cx - NUCLEUS.r * 0.22} cy={NUCLEUS.cy - NUCLEUS.r * 0.2} rx={NUCLEUS.r * 0.32} ry={NUCLEUS.r * 0.22} fill="#FFFFFF" opacity={0.16} />
          <circle cx={NUCLEUS.cx + NUCLEUS.r * 0.24} cy={NUCLEUS.cy - NUCLEUS.r * 0.1} r={NUCLEUS.r * 0.34} fill="url(#organelle-nucleolus-fill)" />
        </g>
      </OrganelleHotspot>
    </g>
  );
}
