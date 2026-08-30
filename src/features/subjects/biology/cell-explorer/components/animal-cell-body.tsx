/**
 * TASK 2 SCOPE ONLY — the cell body (membrane + cytoplasm), no
 * organelles, no interactions. Everything below is purely visual: one
 * hand-tuned organic outline (`MEMBRANE_PATH`, a closed Catmull-Rom
 * spline through irregular-radius control points — not a circle, so it
 * reads as a real cell rather than a UI icon), a soft cytoplasm
 * gradient, a subtle inset highlight suggesting the membrane's
 * thickness, a gentle rim-shading wash for depth, and a drop shadow.
 *
 * A later task can layer organelle graphics directly inside this same
 * `<g>` — `MEMBRANE_PATH`'s coordinate space is the 400×400 viewBox
 * `CellIllustration` already establishes, centered on (200, 200).
 *
 * TASK 9 SCOPE ADDS: a slow opacity pulse on the inner membrane
 * highlight line — the "membrane breathing" ambient animation from the
 * plan, reinterpreted as opacity rather than scale. The plan's original
 * wording ("breathing scale 1.0 -> 1.005") predates the style guide's
 * later, more considered rule that ambient loops stay opacity/position
 * only, scale reserved for the selection glow. Scaling the whole
 * membrane path would also fight `OrganelleHotspot`'s own
 * `transform-box: fill-box` scale animation on this same shape once
 * it's selected, so opacity is both truer to the finalized style guide
 * and avoids two animations competing for the same transform.
 */
import { motion } from "framer-motion";

const MEMBRANE_PATH =
  "M 200.00 37.00 C 227.50 39.89 252.53 53.02 277.50 65.77 C 302.47 78.52 337.91 91.13 349.82 113.50 C 361.74 135.87 349.58 171.50 349.00 200.00 C 348.42 228.50 356.44 258.95 346.36 284.50 C 336.27 310.05 312.89 341.20 288.50 353.29 C 264.11 365.37 229.08 357.72 200.00 357.00 C 170.92 356.28 135.94 362.46 114.00 348.96 C 92.06 335.46 81.86 300.83 68.36 276.00 C 54.86 251.17 34.15 226.00 33.00 200.00 C 31.85 174.00 48.19 145.26 61.44 120.00 C 74.69 94.74 89.41 62.28 112.50 48.45 C 135.59 34.61 172.50 34.11 200.00 37.00 Z";

/** The same outline scaled ~96.5% toward its own center — a second, lighter stroke just inside the membrane, suggesting a bilayer rather than a single flat line. */
const MEMBRANE_INNER_PATH =
  "M 200.00 42.71 C 226.54 45.49 250.69 58.16 274.79 70.46 C 298.88 82.77 333.08 94.94 344.58 116.53 C 356.08 138.12 344.34 172.50 343.78 200.00 C 343.23 227.50 350.97 256.89 341.24 281.54 C 331.51 306.20 308.94 336.26 285.40 347.92 C 261.86 359.58 228.07 352.20 200.00 351.50 C 171.93 350.81 138.18 356.77 117.01 343.74 C 95.84 330.72 86.00 297.30 72.97 273.34 C 59.94 249.38 39.96 225.09 38.84 200.00 C 37.73 174.91 53.50 147.18 66.29 122.80 C 79.07 98.42 93.28 67.10 115.56 53.75 C 137.85 40.40 173.46 39.92 200.00 42.71 Z";

export function AnimalCellBody() {
  return (
    <g>
      <defs>
        {/* Warm, soft cytoplasm gradient — cream near the upper-left "light source", deepening to a dusty rose at the rim. */}
        <radialGradient id="cytoplasm-fill" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#FFFBF6" />
          <stop offset="45%" stopColor="#FDE3D7" />
          <stop offset="80%" stopColor="#F6C3B4" />
          <stop offset="100%" stopColor="#EDA997" />
        </radialGradient>

        {/* A darker wash toward the rim only, layered on top for gentle dimensional shading — not a shape, just light falloff. */}
        <radialGradient id="cytoplasm-shading" cx="42%" cy="36%" r="72%">
          <stop offset="55%" stopColor="#6B2E22" stopOpacity={0} />
          <stop offset="88%" stopColor="#6B2E22" stopOpacity={0.05} />
          <stop offset="100%" stopColor="#6B2E22" stopOpacity={0.16} />
        </radialGradient>

        <filter
          id="cell-drop-shadow"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
        >
          <feDropShadow
            dx="0"
            dy="10"
            stdDeviation="10"
            floodColor="#7A3B2C"
            floodOpacity="0.22"
          />
        </filter>
      </defs>

      {/* Membrane + cytoplasm fill, with the drop shadow applied once to the whole body */}
      <path
        d={MEMBRANE_PATH}
        fill="url(#cytoplasm-fill)"
        filter="url(#cell-drop-shadow)"
      />

      {/* Rim shading, following the exact same outline so the darkening reads as depth, not a separate object */}
      <path d={MEMBRANE_PATH} fill="url(#cytoplasm-shading)" />

      {/* Membrane outline */}
      <path
        d={MEMBRANE_PATH}
        fill="none"
        stroke="#C77A64"
        strokeWidth={3.5}
        strokeLinejoin="round"
      />

      {/* Inner highlight line, suggesting the membrane's bilayer thickness — now with a slow opacity pulse for the "breathing" ambient feel */}
      <motion.path
        d={MEMBRANE_INNER_PATH}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={1.75}
        strokeLinejoin="round"
        animate={{ strokeOpacity: [0.4, 0.62, 0.4] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* A soft highlight bloom near the upper-left, echoing the gradient's implied light source */}
      <ellipse
        cx={148}
        cy={118}
        rx={62}
        ry={40}
        fill="#FFFFFF"
        opacity={0.28}
      />
    </g>
  );
}
