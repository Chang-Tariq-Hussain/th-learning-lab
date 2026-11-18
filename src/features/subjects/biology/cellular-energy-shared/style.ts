/**
 * One colour language for the three cellular-energy labs (Introduction to Cellular Energy, ATP & Energy Release,
 * Cellular Respiration). Every molecule, carrier and compartment keeps the same colour in every lab:
 * ATP = amber, ADP = orange, Pi = violet, NADH = blue, FADH₂ = teal, e⁻ = yellow, H⁺ = red, O₂ = sky,
 * CO₂ = grey, H₂O = cyan, glucose/carbon fuel = green. Colours are never the only cue: every token also has a text label.
 * Light and dark values are switched with the same theme classes the Mitosis / Meiosis labs use.
 */
export const CE_STYLE = `
.ce-root{--ce-field-a:#F8FCFB;--ce-field-b:#E4F1EE;--ce-cyto-a:#F6FBF3;--ce-cyto-b:#D9EDCB;--ce-mito-a:#FFF1E4;--ce-mito-b:#F7D2A8;--ce-matrix:#FCE3C6;--ce-ims:#FFF8EC;--ce-membrane:#B85C1E;--ce-line:#12302D;--ce-ink:#12302D;--ce-soft:#4B6663;--ce-halo:#FFFFFF;
--ce-atp:#D98E04;--ce-adp:#E4572E;--ce-pi:#7C4DCC;--ce-nadh:#2F6FEB;--ce-fadh:#0E9488;--ce-e:#C79A00;--ce-h:#D6336C;--ce-o2:#1C89C9;--ce-co2:#6B7280;--ce-h2o:#0AA3C2;--ce-fuel:#3F8F2E;--ce-adenine:#3B6FD4;--ce-ribose:#2E9D6B;--ce-water:#9AD1EA;--ce-sel:#F5B800;--ce-work:#6D4AC9}
:is(.dark,.midnight,.dracula,.nord,.monokai,.one-dark) .ce-root{--ce-field-a:#10201F;--ce-field-b:#0A1415;--ce-cyto-a:#17301F;--ce-cyto-b:#10231A;--ce-mito-a:#3A2616;--ce-mito-b:#2A1B0F;--ce-matrix:#4A3019;--ce-ims:#2B2016;--ce-membrane:#F0A35E;--ce-line:#E8F4F2;--ce-ink:#E8F4F2;--ce-soft:#A9C2BE;--ce-halo:#0A1415;
--ce-atp:#FFC24A;--ce-adp:#FF8A65;--ce-pi:#B79CFF;--ce-nadh:#7FA8FF;--ce-fadh:#3DD1C0;--ce-e:#FFE066;--ce-h:#FF7DAA;--ce-o2:#6CC6F5;--ce-co2:#B4BAC4;--ce-h2o:#5FDAF0;--ce-fuel:#8FD16A;--ce-adenine:#8EB0FF;--ce-ribose:#6CD9A4;--ce-water:#245A73;--ce-sel:#FFD84D;--ce-work:#B79CFF}
.ce-root svg text{font-family:inherit}
.ce-hit{cursor:pointer;outline:none}
.ce-hit:focus-visible{outline:3px solid var(--ce-ink);outline-offset:2px}
@keyframes ce-pulse{0%,100%{opacity:.95}50%{opacity:.4}}
.ce-pulse{animation:ce-pulse 1.4s ease-in-out infinite}
@keyframes ce-flow{to{stroke-dashoffset:-24}}
.ce-flow{stroke-dasharray:6 6;animation:ce-flow 1.1s linear infinite}
@media (prefers-reduced-motion: reduce){.ce-pulse,.ce-flow{animation:none}}
`;

export const card = "rounded-2xl border border-line bg-white/70 p-4 dark:border-line-dark dark:bg-white/[0.04]";
export const eyebrow = "font-mono text-label uppercase tracking-eyebrow text-subject-biology";
export const optionBase =
  "flex min-h-11 w-full items-start gap-2 rounded-xl border px-3 py-2 text-left text-sm leading-snug transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink dark:focus-visible:outline-bone";

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Smooth 0→1 ramp between two beat positions. */
export const ramp = (pos: number, from: number, to: number) => {
  const t = clamp01((pos - from) / (to - from));
  return t * t * (3 - 2 * t);
};

/** Molecule / carrier tokens used by legends in every lab. */
export const TOKEN = {
  atp: { label: "ATP", color: "var(--ce-atp)" },
  adp: { label: "ADP", color: "var(--ce-adp)" },
  pi: { label: "Pi", color: "var(--ce-pi)" },
  nadh: { label: "NADH", color: "var(--ce-nadh)" },
  fadh: { label: "FADH₂", color: "var(--ce-fadh)" },
  e: { label: "e⁻", color: "var(--ce-e)" },
  h: { label: "H⁺", color: "var(--ce-h)" },
  o2: { label: "O₂", color: "var(--ce-o2)" },
  co2: { label: "CO₂", color: "var(--ce-co2)" },
  h2o: { label: "H₂O", color: "var(--ce-h2o)" },
  fuel: { label: "Glucose / fuel", color: "var(--ce-fuel)" },
} as const;
export type TokenId = keyof typeof TOKEN;
