import { ORGANELLES } from "../data/organelles";
import { mix } from "../scene/palette";
import type { OrganelleId } from "../types";

/**
 * Tiny schematic of each structure for the legend, so structures are told apart by shape as well as colour.
 * Drawn on a 24 x 24 grid; purely decorative (the name next to it carries the meaning).
 */
export function OrganelleGlyph({ id, size = 22 }: { id: OrganelleId; size?: number }) {
  const base = ORGANELLES[id].color;
  const dark = mix(base, "#1F1030", 0.45);
  const light = mix(base, "#FFFFFF", 0.55);
  const common = { fill: base, stroke: dark, strokeWidth: 1.4 } as const;
  let body;
  switch (id) {
    case "cellWall":
      body = <path d="M3 3h18v18H3z M7 7v10h10V7z" fillRule="evenodd" {...common} />;
      break;
    case "plasmodesmata":
      body = (
        <>
          <path d="M2 4h6v16H2z M16 4h6v16h-6z" {...common} fill="#B7955A" />
          <path d="M8 9h8v6H8z" fill="#EAF6D4" stroke={dark} strokeWidth={1.2} />
          <path d="M8 12h8" stroke={dark} strokeWidth={1.6} />
        </>
      );
      break;
    case "cellMembrane":
      body = (
        <>
          <path d="M2 8c4-4 16-4 20 0" fill="none" stroke={dark} strokeWidth={1.2} />
          <path d="M2 16c4 4 16 4 20 0" fill="none" stroke={dark} strokeWidth={1.2} />
          {[4, 8, 12, 16, 20].map((x) => (
            <g key={x}>
              <circle cx={x} cy={x === 4 || x === 20 ? 8 : 6.5} r={1.5} fill={base} />
              <circle cx={x} cy={x === 4 || x === 20 ? 16 : 17.5} r={1.5} fill={light} stroke={dark} strokeWidth={0.6} />
            </g>
          ))}
        </>
      );
      break;
    case "cytoplasm":
      body = (
        <>
          <rect x={2} y={4} width={20} height={16} rx={6} fill="#F9D9C8" stroke="#B98672" strokeWidth={1.4} />
          {[8, 12, 16].map((x, i) => (
            <circle key={x} cx={x} cy={9 + i * 3} r={1} fill="#8A5A44" opacity={0.5} />
          ))}
        </>
      );
      break;
    case "nucleus":
      body = (
        <>
          <circle cx={12} cy={12} r={9} {...common} />
          <circle cx={14} cy={11} r={3} fill={ORGANELLES.nucleolus.color} />
        </>
      );
      break;
    case "nuclearEnvelope":
      body = (
        <>
          <circle cx={12} cy={12} r={9} fill="none" stroke={dark} strokeWidth={1.4} />
          <circle cx={12} cy={12} r={6.5} fill="none" stroke={base} strokeWidth={1.4} />
          <circle cx={21} cy={12} r={1.6} fill="#F4EEFF" stroke={dark} strokeWidth={0.8} />
          <circle cx={4} cy={15} r={1.6} fill="#F4EEFF" stroke={dark} strokeWidth={0.8} />
        </>
      );
      break;
    case "nucleolus":
      body = <circle cx={12} cy={12} r={6} {...common} />;
      break;
    case "mitochondria":
      body = (
        <>
          <ellipse cx={12} cy={12} rx={10} ry={6} {...common} />
          <path d="M7 7.5v5 M10.5 16.5v-5 M14 7.5v5 M17.5 16.5v-5" stroke={dark} strokeWidth={1.1} fill="none" />
        </>
      );
      break;
    case "chloroplast":
      body = (
        <>
          <ellipse cx={12} cy={12} rx={10} ry={6.5} {...common} />
          {[7.5, 12, 16.5].map((x) => (
            <g key={x}>
              <rect x={x - 1.6} y={8.6} width={3.2} height={1.6} rx={0.6} fill="#1F6B1A" />
              <rect x={x - 1.6} y={11.2} width={3.2} height={1.6} rx={0.6} fill="#1F6B1A" />
              <rect x={x - 1.6} y={13.8} width={3.2} height={1.6} rx={0.6} fill="#1F6B1A" />
            </g>
          ))}
        </>
      );
      break;
    case "ribosomes":
      body = (
        <>
          {[
            [7, 8],
            [14, 6],
            [17, 14],
            [9, 16],
          ].map(([x, y], i) => (
            <g key={i}>
              <ellipse cx={x} cy={y! + 1} rx={3} ry={2.5} fill={base} stroke={dark} strokeWidth={0.8} />
              <ellipse cx={x} cy={y! - 1.6} rx={2.1} ry={1.8} fill={base} stroke={dark} strokeWidth={0.8} />
            </g>
          ))}
        </>
      );
      break;
    case "roughER":
      body = (
        <>
          <path d="M3 8c4-3 6 3 9 0s6 3 9 0 M3 15c4-3 6 3 9 0s6 3 9 0" fill="none" stroke={dark} strokeWidth={4.2} strokeLinecap="round" />
          <path d="M3 8c4-3 6 3 9 0s6 3 9 0 M3 15c4-3 6 3 9 0s6 3 9 0" fill="none" stroke={base} strokeWidth={2.6} strokeLinecap="round" />
          {[5, 10, 15, 20].map((x) => (
            <circle key={x} cx={x} cy={4.2} r={1.4} fill={ORGANELLES.ribosomes.color} />
          ))}
          {[7, 12, 17].map((x) => (
            <circle key={x} cx={x} cy={19.6} r={1.4} fill={ORGANELLES.ribosomes.color} />
          ))}
        </>
      );
      break;
    case "smoothER":
      body = (
        <>
          <path d="M3 8c4-3 6 3 9 0s6 3 9 0 M3 16c4-3 6 3 9 0s6 3 9 0 M12 8v8" fill="none" stroke={dark} strokeWidth={4.2} strokeLinecap="round" />
          <path d="M3 8c4-3 6 3 9 0s6 3 9 0 M3 16c4-3 6 3 9 0s6 3 9 0 M12 8v8" fill="none" stroke={base} strokeWidth={2.6} strokeLinecap="round" />
        </>
      );
      break;
    case "golgi":
      body = (
        <>
          {[5, 8.5, 12, 15.5, 19].map((y, i) => (
            <path key={y} d={`M${4 + i * 0.8} ${y}q8 -3 ${16 - i * 1.6} 0`} fill="none" stroke={dark} strokeWidth={3.6} strokeLinecap="round" />
          ))}
          {[5, 8.5, 12, 15.5, 19].map((y, i) => (
            <path key={`b${y}`} d={`M${4 + i * 0.8} ${y}q8 -3 ${16 - i * 1.6} 0`} fill="none" stroke={base} strokeWidth={2.2} strokeLinecap="round" />
          ))}
        </>
      );
      break;
    case "vesicles":
      body = (
        <>
          <circle cx={8} cy={13} r={5} {...common} />
          <circle cx={17} cy={8} r={3.4} {...common} />
          <circle cx={17.5} cy={17} r={2.6} {...common} />
        </>
      );
      break;
    case "vacuole":
      body = <circle cx={12} cy={12} r={8} fill={base} fillOpacity={0.55} stroke={dark} strokeWidth={1.6} />;
      break;
    case "largeVacuole":
      body = (
        <>
          <rect x={2} y={3} width={20} height={18} rx={9} fill={base} fillOpacity={0.55} stroke={dark} strokeWidth={1.6} />
          <path d="M6 8c2-2 5-2 7-1" fill="none" stroke="#FFFFFF" strokeWidth={1.6} strokeLinecap="round" />
        </>
      );
      break;
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false" className="shrink-0">
      {body}
    </svg>
  );
}
