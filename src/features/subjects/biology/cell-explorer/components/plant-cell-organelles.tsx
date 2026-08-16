/**
 * The Plant Cell's interior organelles: Nucleus (+ a separately
 * clickable Nucleolus), Ribosomes, Rough ER, Smooth ER, Golgi
 * Apparatus, Mitochondria, the Large Central Vacuole, and several
 * Chloroplasts. Follows the exact same structure as
 * `animal-cell-organelles.tsx` -- shapes from `utils/organic-path.ts`,
 * each organelle wrapped in `OrganelleHotspot`, gradients defined once
 * in this component's own `<defs>` -- just with the Plant Cell's own
 * layout and the additional plant-only structures. The Animal Cell's
 * component is untouched.
 */
import {
  beanPath,
  blobPath,
  rotatePoint,
  wavyTubePath,
} from "../utils/organic-path";
import { OrganelleHotspot } from "./organelle-hotspot";

const NUCLEUS = { cx: 118, cy: 135, r: 46 };
const NUCLEOLUS = { cx: 128, cy: 124, r: 14 };
const LARGE_VACUOLE = { cx: 222, cy: 212, r: 100 };
const GOLGI = { cx: 130, cy: 208, width: 50, rotate: 15 };
const ROUGH_ER = { cx: 176, cy: 180, width: 62, rotate: -10 };
const SMOOTH_ER = { cx: 168, cy: 210, width: 52, rotate: 8 };
const MITOCHONDRIA = [
  { cx: 206, cy: 86, rx: 20, ry: 11, rotate: 10 },
  { cx: 335, cy: 178, rx: 19, ry: 10, rotate: -25 },
];
const CHLOROPLASTS = [
  { cx: 296, cy: 104, rx: 24, ry: 14, rotate: -20 },
  { cx: 320, cy: 228, rx: 23, ry: 13, rotate: 26 },
  { cx: 258, cy: 328, rx: 22, ry: 13, rotate: -35 },
  { cx: 98, cy: 288, rx: 22, ry: 13, rotate: 15 },
  { cx: 82, cy: 202, rx: 20, ry: 12, rotate: -10 },
];
const FREE_RIBOSOMES = [
  { cx: 168, cy: 84, count: 5 },
  { cx: 88, cy: 236, count: 5 },
];

export interface PlantCellOrganellesProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function PlantCellOrganelles({
  selectedId,
  onSelect,
}: PlantCellOrganellesProps) {
  const nucleusOuter = blobPath(NUCLEUS.cx, NUCLEUS.cy, NUCLEUS.r, {
    phase: 1.2,
    amplitude: 0.055,
  });
  const nucleusInner = blobPath(NUCLEUS.cx, NUCLEUS.cy, NUCLEUS.r * 0.86, {
    phase: 1.5,
    amplitude: 0.045,
  });
  const poreCount = 11;
  const vacuolePath = blobPath(
    LARGE_VACUOLE.cx,
    LARGE_VACUOLE.cy,
    LARGE_VACUOLE.r,
    { phase: 0.4, amplitude: 0.05, frequency: 4 },
  );

  return (
    <g>
      <defs>
        <radialGradient id="plant-nucleus-fill" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#B9A0F2" />
          <stop offset="55%" stopColor="#8A5FE0" />
          <stop offset="100%" stopColor="#5E3AAE" />
        </radialGradient>
        <radialGradient id="plant-nucleolus-fill" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#4C2E86" />
          <stop offset="100%" stopColor="#331F5C" />
        </radialGradient>
        <linearGradient
          id="plant-mito-fill"
          x1="20%"
          y1="15%"
          x2="85%"
          y2="90%"
        >
          <stop offset="0%" stopColor="#F0857D" />
          <stop offset="55%" stopColor="#D6534A" />
          <stop offset="100%" stopColor="#A9382F" />
        </linearGradient>
        <linearGradient
          id="plant-golgi-fill"
          x1="10%"
          y1="0%"
          x2="90%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#F5B573" />
          <stop offset="100%" stopColor="#DE7F35" />
        </linearGradient>
        <linearGradient
          id="plant-roughER-fill"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#7FCB9E" />
          <stop offset="100%" stopColor="#3E9C6C" />
        </linearGradient>
        <linearGradient
          id="plant-smoothER-fill"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#A9E0BF" />
          <stop offset="100%" stopColor="#6FBE94" />
        </linearGradient>
        <radialGradient id="plant-ribosome-fill" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#6E8CFF" />
          <stop offset="100%" stopColor="#3D5AFE" />
        </radialGradient>
        <linearGradient
          id="plant-chloroplast-fill"
          x1="15%"
          y1="10%"
          x2="85%"
          y2="95%"
        >
          <stop offset="0%" stopColor="#5FBE84" />
          <stop offset="55%" stopColor="#2D8659" />
          <stop offset="100%" stopColor="#1E6440" />
        </linearGradient>
        <radialGradient id="plant-vacuole-fill" cx="38%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#EAF7FB" stopOpacity={0.85} />
          <stop offset="55%" stopColor="#BFE7F0" stopOpacity={0.7} />
          <stop offset="100%" stopColor="#8FCFE2" stopOpacity={0.55} />
        </radialGradient>
        <filter
          id="plant-organelle-soft-shadow"
          x="-60%"
          y="-60%"
          width="220%"
          height="220%"
        >
          <feDropShadow
            dx="0"
            dy="2.5"
            stdDeviation="3"
            floodColor="#2E4A22"
            floodOpacity="0.25"
          />
        </filter>
      </defs>

      {/* ---- Large Central Vacuole: drawn first so everything else layers on top of it ---- */}
      <OrganelleHotspot
        id="largeVacuole"
        label="Large Central Vacuole"
        isSelected={selectedId === "largeVacuole"}
        onSelect={onSelect}
      >
        <g>
          <path
            d={vacuolePath}
            fill="url(#plant-vacuole-fill)"
            stroke="#6FB8D6"
            strokeWidth={1.5}
            strokeOpacity={0.6}
          />
          <ellipse
            cx={LARGE_VACUOLE.cx - LARGE_VACUOLE.r * 0.28}
            cy={LARGE_VACUOLE.cy - LARGE_VACUOLE.r * 0.3}
            rx={LARGE_VACUOLE.r * 0.34}
            ry={LARGE_VACUOLE.r * 0.2}
            fill="#FFFFFF"
            opacity={0.3}
          />
        </g>
      </OrganelleHotspot>

      {/* ---- Rough ER ---- */}
      <OrganelleHotspot
        id="roughER"
        label="Rough Endoplasmic Reticulum"
        isSelected={selectedId === "roughER"}
        onSelect={onSelect}
      >
        <g
          transform={`translate(${ROUGH_ER.cx} ${ROUGH_ER.cy}) rotate(${ROUGH_ER.rotate})`}
          filter="url(#plant-organelle-soft-shadow)"
        >
          {[0, 1, 2, 3].map((i) => {
            const y = (i - 1.5) * 10;
            const d = wavyTubePath(
              -ROUGH_ER.width / 2,
              y,
              ROUGH_ER.width,
              6.5,
              4,
              i * 1.15,
            );
            return (
              <path
                key={i}
                d={d}
                stroke="url(#plant-roughER-fill)"
                strokeWidth={5}
                fill="none"
                strokeLinecap="round"
                opacity={0.92}
              />
            );
          })}
          {Array.from({ length: 12 }, (_, i) => {
            const x = -ROUGH_ER.width / 2 + (i / 11) * ROUGH_ER.width;
            const rowOffset = (i % 4) - 1.5;
            const y = rowOffset * 10 + (i % 2 === 0 ? -4 : 4);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={1.8}
                fill="url(#plant-ribosome-fill)"
              />
            );
          })}
        </g>
      </OrganelleHotspot>

      {/* ---- Smooth ER: same tube technique, no ribosome dots ---- */}
      <OrganelleHotspot
        id="smoothER"
        label="Smooth Endoplasmic Reticulum"
        isSelected={selectedId === "smoothER"}
        onSelect={onSelect}
      >
        <g
          transform={`translate(${SMOOTH_ER.cx} ${SMOOTH_ER.cy}) rotate(${SMOOTH_ER.rotate})`}
          filter="url(#plant-organelle-soft-shadow)"
        >
          {[0, 1, 2].map((i) => {
            const y = (i - 1) * 10;
            const d = wavyTubePath(
              -SMOOTH_ER.width / 2,
              y,
              SMOOTH_ER.width,
              6,
              4,
              i * 1.4,
            );
            return (
              <path
                key={i}
                d={d}
                stroke="url(#plant-smoothER-fill)"
                strokeWidth={4.5}
                fill="none"
                strokeLinecap="round"
                opacity={0.9}
              />
            );
          })}
        </g>
      </OrganelleHotspot>

      {/* ---- Golgi apparatus ---- */}
      <OrganelleHotspot
        id="golgi"
        label="Golgi Apparatus"
        isSelected={selectedId === "golgi"}
        onSelect={onSelect}
      >
        <g filter="url(#plant-organelle-soft-shadow)">
          {[0, 1, 2, 3, 4].map((i) => {
            const y = (i - 2) * 6.5;
            const shrink = i * 2;
            const p1 = rotatePoint(
              GOLGI.cx,
              GOLGI.cy,
              -GOLGI.width / 2 + shrink,
              y,
              GOLGI.rotate,
            );
            const c = rotatePoint(GOLGI.cx, GOLGI.cy, 0, y - 9, GOLGI.rotate);
            const p2 = rotatePoint(
              GOLGI.cx,
              GOLGI.cy,
              GOLGI.width / 2 - shrink,
              y,
              GOLGI.rotate,
            );
            return (
              <path
                key={i}
                d={`M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} Q ${c.x.toFixed(2)} ${c.y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`}
                stroke="url(#plant-golgi-fill)"
                strokeWidth={4.5}
                strokeLinecap="round"
                fill="none"
                opacity={0.95 - i * 0.05}
              />
            );
          })}
          {[-1, 1].map((side) => {
            const p = rotatePoint(
              GOLGI.cx,
              GOLGI.cy,
              side * (GOLGI.width / 2 + 7),
              5,
              GOLGI.rotate,
            );
            return (
              <circle
                key={side}
                cx={p.x}
                cy={p.y}
                r={3.6}
                fill="url(#plant-golgi-fill)"
                stroke="#B85E1D"
                strokeWidth={1}
              />
            );
          })}
        </g>
      </OrganelleHotspot>

      {/* ---- Mitochondria ---- */}
      {MITOCHONDRIA.map((m, index) => {
        const path = beanPath(m.cx, m.cy, m.rx, m.ry, m.rotate);
        const cristaeCount = 3;
        return (
          <OrganelleHotspot
            key={index}
            id="mitochondria"
            label="Mitochondria"
            isSelected={selectedId === "mitochondria"}
            onSelect={onSelect}
          >
            <g filter="url(#plant-organelle-soft-shadow)">
              <path
                d={path}
                fill="url(#plant-mito-fill)"
                stroke="#8C2E26"
                strokeWidth={1.6}
              />
              {Array.from({ length: cristaeCount }, (_, i) => {
                const t = (i + 1) / (cristaeCount + 1) - 0.5;
                const localX = t * m.rx * 1.3;
                const p1 = rotatePoint(
                  m.cx,
                  m.cy,
                  localX,
                  -m.ry * 0.55,
                  m.rotate,
                );
                const p2 = rotatePoint(
                  m.cx,
                  m.cy,
                  localX,
                  m.ry * 0.55,
                  m.rotate,
                );
                return (
                  <line
                    key={i}
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke="#5E1D17"
                    strokeWidth={1.3}
                    opacity={0.6}
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
          </OrganelleHotspot>
        );
      })}

      {/* ---- Chloroplasts: green ovals with visible grana stacks, each independently rotated ---- */}
      {CHLOROPLASTS.map((c, index) => {
        const path = blobPath(c.cx, c.cy, c.rx, {
          ry: c.ry,
          phase: index * 0.8,
          amplitude: 0.04,
        });
        const granaCount = 3;
        return (
          <OrganelleHotspot
            key={index}
            id="chloroplast"
            label="Chloroplast"
            isSelected={selectedId === "chloroplast"}
            onSelect={onSelect}
          >
            <g filter="url(#plant-organelle-soft-shadow)">
              <path
                d={path}
                fill="url(#plant-chloroplast-fill)"
                stroke="#194F30"
                strokeWidth={1.6}
                transform={`rotate(${c.rotate} ${c.cx} ${c.cy})`}
              />
              {Array.from({ length: granaCount }, (_, i) => {
                const localX = (i - (granaCount - 1) / 2) * (c.rx * 0.7);
                return Array.from({ length: 3 }, (_, j) => {
                  const localY = (j - 1) * 2.8;
                  const p1 = rotatePoint(
                    c.cx,
                    c.cy,
                    localX - 3.5,
                    localY,
                    c.rotate,
                  );
                  const p2 = rotatePoint(
                    c.cx,
                    c.cy,
                    localX + 3.5,
                    localY,
                    c.rotate,
                  );
                  return (
                    <line
                      key={`${i}-${j}`}
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke="#0F3320"
                      strokeWidth={1.6}
                      strokeLinecap="round"
                      opacity={0.65}
                    />
                  );
                });
              })}
            </g>
          </OrganelleHotspot>
        );
      })}

      {/* ---- Free ribosomes ---- */}
      {FREE_RIBOSOMES.map((cluster, ci) => (
        <OrganelleHotspot
          key={ci}
          id="ribosomes"
          label="Ribosomes"
          isSelected={selectedId === "ribosomes"}
          onSelect={onSelect}
        >
          <g>
            {Array.from({ length: cluster.count }, (_, i) => {
              const angle = (i / cluster.count) * Math.PI * 2 + i;
              const radius = 12 * (0.5 + (0.5 * ((i * 53) % 7)) / 7);
              return (
                <circle
                  key={i}
                  cx={cluster.cx + Math.cos(angle) * radius}
                  cy={cluster.cy + Math.sin(angle) * radius}
                  r={2.2}
                  fill="url(#plant-ribosome-fill)"
                  stroke="#2036B0"
                  strokeWidth={0.4}
                />
              );
            })}
          </g>
        </OrganelleHotspot>
      ))}

      {/* ---- Nucleus (drawn last among the core organelles so it sits clearly on top) ---- */}
      <OrganelleHotspot
        id="nucleus"
        label="Nucleus"
        isSelected={selectedId === "nucleus"}
        onSelect={onSelect}
      >
        <g filter="url(#plant-organelle-soft-shadow)">
          <path
            d={nucleusOuter}
            fill="url(#plant-nucleus-fill)"
            stroke="#4C2E86"
            strokeWidth={2.1}
          />
          <path
            d={nucleusInner}
            fill="none"
            stroke="#4C2E86"
            strokeWidth={1}
            opacity={0.5}
          />
          {Array.from({ length: poreCount }, (_, i) => {
            const theta = (i / poreCount) * Math.PI * 2;
            return (
              <circle
                key={i}
                cx={NUCLEUS.cx + Math.cos(theta) * NUCLEUS.r * 0.985}
                cy={NUCLEUS.cy + Math.sin(theta) * NUCLEUS.r * 0.985}
                r={1.6}
                fill="#F4E3C4"
                opacity={0.9}
              />
            );
          })}
          <ellipse
            cx={NUCLEUS.cx - NUCLEUS.r * 0.22}
            cy={NUCLEUS.cy - NUCLEUS.r * 0.2}
            rx={NUCLEUS.r * 0.3}
            ry={NUCLEUS.r * 0.2}
            fill="#FFFFFF"
            opacity={0.16}
          />
        </g>
      </OrganelleHotspot>

      {/* ---- Nucleolus: its own clickable structure, nested visually inside the nucleus ---- */}
      <OrganelleHotspot
        id="nucleolus"
        label="Nucleolus"
        isSelected={selectedId === "nucleolus"}
        onSelect={onSelect}
      >
        <circle
          cx={NUCLEOLUS.cx}
          cy={NUCLEOLUS.cy}
          r={NUCLEOLUS.r}
          fill="url(#plant-nucleolus-fill)"
        />
      </OrganelleHotspot>
    </g>
  );
}
