/**
 * The Plant Cell's outer structure: Cell Wall, Cell Membrane, Cytoplasm,
 * and Plasmodesmata -- each its own clickable layer (unlike the Animal
 * Cell's body, which isn't interactive; the Plant Cell task explicitly
 * asks for all of these to be selectable). Shapes come from the same
 * deterministic `blobPath` used everywhere else in this feature, not
 * hand-typed bezier coordinates -- a lower wobble frequency than the
 * organelles gives the outline a fuller, more angular silhouette
 * (closer to how plant cells are conventionally drawn) while staying
 * organic rather than a perfect shape.
 */
import { OrganelleHotspot } from "./organelle-hotspot";


/** A plant cell is drawn with a rigid, near-square rounded outline (the cell wall holds its shape), unlike the soft animal-cell blob. */
function roundedSquarePath(inset: number, radius: number): string {
  const lo = inset;
  const hi = 400 - inset;
  const r = radius;
  return `M ${lo + r} ${lo} H ${hi - r} Q ${hi} ${lo} ${hi} ${lo + r} V ${hi - r} Q ${hi} ${hi} ${hi - r} ${hi} H ${lo + r} Q ${lo} ${hi} ${lo} ${hi - r} V ${lo + r} Q ${lo} ${lo} ${lo + r} ${lo} Z`;
}

const WALL_INSET = 20;
const WALL_PATH = roundedSquarePath(WALL_INSET, 30);
const WALL_INNER_PATH = roundedSquarePath(WALL_INSET + 9, 24);
const MEMBRANE_PATH = roundedSquarePath(WALL_INSET + 14, 22);
const CYTOPLASM_PATH = roundedSquarePath(WALL_INSET + 20, 18);

const PLASMODESMATA_COUNT = 10;
const W0 = WALL_INSET;
const W1 = WALL_INSET + 10;
const PLASMODESMATA: [number, number, number, number][] = [
  ...[110, 200, 290].flatMap((t): [number, number, number, number][] => [
    [t, W0, t, W1],
    [t, 400 - W0, t, 400 - W1],
    [W0, t, W1, t],
    [400 - W0, t, 400 - W1, t],
  ]),
].slice(0, PLASMODESMATA_COUNT + 2);

export interface PlantCellBodyProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function PlantCellBody({ selectedId, onSelect }: PlantCellBodyProps) {
  return (
    <g>
      <defs>
        {/* Cell wall -- a fibrous tan/brown gradient, deliberately warmer and more matte than the membrane, per "distinct texture and color". */}
        <linearGradient
          id="plant-wall-fill"
          x1="15%"
          y1="10%"
          x2="85%"
          y2="95%"
        >
          <stop offset="0%" stopColor="#D9BE87" />
          <stop offset="55%" stopColor="#BE9A5C" />
          <stop offset="100%" stopColor="#8F6B3A" />
        </linearGradient>

        {/* Cell membrane -- pale, slightly green-tinted, thin band just inside the wall. */}
        <radialGradient id="plant-membrane-fill" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#F3F0D6" />
          <stop offset="100%" stopColor="#D9CE9C" />
        </radialGradient>

        {/* Cytoplasm -- pale green-cream, same light-source convention as the animal cell's warm cream (upper-left highlight). */}
        <radialGradient id="plant-cytoplasm-fill" cx="38%" cy="32%" r="78%">
          <stop offset="0%" stopColor="#FAFCF0" />
          <stop offset="45%" stopColor="#E8F0D2" />
          <stop offset="80%" stopColor="#D2E3B4" />
          <stop offset="100%" stopColor="#B9D194" />
        </radialGradient>
        <radialGradient id="plant-cytoplasm-shading" cx="42%" cy="36%" r="72%">
          <stop offset="55%" stopColor="#33502A" stopOpacity={0} />
          <stop offset="88%" stopColor="#33502A" stopOpacity={0.05} />
          <stop offset="100%" stopColor="#33502A" stopOpacity={0.15} />
        </radialGradient>

        <filter
          id="plant-cell-drop-shadow"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
        >
          <feDropShadow
            dx="0"
            dy="10"
            stdDeviation="10"
            floodColor="#4A3A1E"
            floodOpacity="0.22"
          />
        </filter>
      </defs>

      {/* ---- Cell Wall ---- */}
      <OrganelleHotspot
        id="cellWall"
        label="Cell Wall"
        isSelected={selectedId === "cellWall"}
        onSelect={onSelect}
      >
        <g filter="url(#plant-cell-drop-shadow)">
          <path
            d={WALL_PATH}
            fill="url(#plant-wall-fill)"
            stroke="#6B4E24"
            strokeWidth={3}
            strokeLinejoin="round"
          />
          {/* Layered fibrous texture -- a second, lighter inset outline suggesting cellulose layers rather than a flat slab. */}
          <path
            d={WALL_INNER_PATH}
            fill="none"
            stroke="#F3E3BE"
            strokeOpacity={0.4}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        </g>
      </OrganelleHotspot>

      {/* ---- Plasmodesmata: small channels crossing the wall, subtle by design ---- */}
      <OrganelleHotspot
        id="plasmodesmata"
        label="Plasmodesmata"
        isSelected={selectedId === "plasmodesmata"}
        onSelect={onSelect}
      >
        <g>
          {PLASMODESMATA.map((l, i) => (
            <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke="#F3E3BE" strokeOpacity={0.75} strokeWidth={3} strokeLinecap="round" />
          ))}
        </g>
      </OrganelleHotspot>

      {/* ---- Cell Membrane ---- */}
      <OrganelleHotspot
        id="cellMembrane"
        label="Cell Membrane"
        isSelected={selectedId === "cellMembrane"}
        onSelect={onSelect}
      >
        <path
          d={MEMBRANE_PATH}
          fill="url(#plant-membrane-fill)"
          stroke="#A99257"
          strokeWidth={2}
          strokeLinejoin="round"
        />
      </OrganelleHotspot>

      {/* ---- Cytoplasm ---- */}
      <OrganelleHotspot
        id="cytoplasm"
        label="Cytoplasm"
        isSelected={selectedId === "cytoplasm"}
        onSelect={onSelect}
      >
        <g>
          <path d={CYTOPLASM_PATH} fill="url(#plant-cytoplasm-fill)" />
          <path d={CYTOPLASM_PATH} fill="url(#plant-cytoplasm-shading)" />
          <ellipse
            cx={150}
            cy={120}
            rx={58}
            ry={38}
            fill="#FFFFFF"
            opacity={0.22}
          />
        </g>
      </OrganelleHotspot>
    </g>
  );
}
