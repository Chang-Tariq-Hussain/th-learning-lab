"use client";

import { memo } from "react";
import type { Figure } from "../types";

const STROKE = "stroke-ink dark:stroke-bone";
const SOFT = "stroke-ink/40 dark:stroke-bone/40";
const FILL = "fill-subject-math-soft/60 dark:fill-subject-math/15";
const TEXT = "fill-ink font-mono text-[11px] dark:fill-bone";
const ACCENT = "fill-subject-math font-mono text-[11px] font-semibold";

/** Labels made of plain numbers/units describe SIDES; labels with degrees, "x" or "ext" describe ANGLES. */
const looksLikeAngle = (s: string) => /°|x\b|^\?$|ext/.test(s) && !/^\d+(\.\d+)?$/.test(s);

function T({ x, y, children, anchor = "middle", accent }: { x: number; y: number; children: string; anchor?: "start" | "middle" | "end"; accent?: boolean }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className={accent || children === "?" ? ACCENT : TEXT}>
      {children}
    </text>
  );
}

function RightTriangle({ f }: { f: Extract<Figure, { kind: "right-triangle" }> }) {
  const A = { x: 36, y: 118 };
  const B = { x: 196, y: 118 };
  const C = { x: 196, y: 28 };
  return (
    <>
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} className={`${FILL} ${STROKE}`} strokeWidth={1.8} strokeLinejoin="round" />
      <polyline points={`${B.x - 12},${B.y} ${B.x - 12},${B.y - 12} ${B.x},${B.y - 12}`} fill="none" className={SOFT} strokeWidth={1.4} />
      {f.base && <T x={(A.x + B.x) / 2} y={B.y + 17}>{f.base}</T>}
      {f.height && <T x={B.x + 8} y={(B.y + C.y) / 2 + 4} anchor="start">{f.height}</T>}
      {f.hyp && <T x={(A.x + C.x) / 2 - 10} y={(A.y + C.y) / 2 - 8} anchor="end">{f.hyp}</T>}
      {f.angle && <T x={A.x + 38} y={A.y - 6} accent>{f.angle}</T>}
    </>
  );
}

function Triangle({ f }: { f: Extract<Figure, { kind: "triangle" }> }) {
  const P = { x: 120, y: 26 };
  const Q = { x: 32, y: 122 };
  const R = { x: 208, y: 122 };
  const angles = [f.a, f.b, f.c].some(looksLikeAngle);
  return (
    <>
      <polygon points={`${P.x},${P.y} ${Q.x},${Q.y} ${R.x},${R.y}`} className={`${FILL} ${STROKE}`} strokeWidth={1.8} strokeLinejoin="round" />
      {angles ? (
        <>
          <T x={Q.x + 26} y={Q.y - 6}>{f.a}</T>
          <T x={R.x - 26} y={R.y - 6}>{f.b}</T>
          <T x={P.x} y={P.y + 26}>{f.c}</T>
        </>
      ) : (
        <>
          <T x={(Q.x + R.x) / 2} y={Q.y + 17}>{f.a}</T>
          <T x={(P.x + R.x) / 2 + 12} y={(P.y + R.y) / 2 - 2} anchor="start">{f.b}</T>
          <T x={(P.x + Q.x) / 2 - 12} y={(P.y + Q.y) / 2 - 2} anchor="end">{f.c}</T>
        </>
      )}
    </>
  );
}

function Circle({ f }: { f: Extract<Figure, { kind: "circle" }> }) {
  const c = { x: 120, y: 70 };
  const r = 52;
  return (
    <>
      <circle cx={c.x} cy={c.y} r={r} className={`${FILL} ${STROKE}`} strokeWidth={1.8} />
      <circle cx={c.x} cy={c.y} r={2.5} className="fill-ink dark:fill-bone" />
      {f.radius && (
        <>
          <line x1={c.x} y1={c.y} x2={c.x + r} y2={c.y} className={STROKE} strokeWidth={1.6} />
          <T x={c.x + r / 2} y={c.y - 7}>{f.radius}</T>
        </>
      )}
      {f.angle && !f.radius && <T x={c.x} y={c.y - 6} accent>{f.angle}</T>}
      {f.angle && f.radius && (
        <>
          <line x1={c.x} y1={c.y} x2={c.x + r * Math.cos(-0.9)} y2={c.y + r * Math.sin(-0.9)} className={STROKE} strokeWidth={1.6} />
          <T x={c.x + 30} y={c.y - 14} accent>{f.angle}</T>
        </>
      )}
      {f.label && <T x={120} y={142} accent>{f.label}</T>}
    </>
  );
}

function Rectangle({ f }: { f: Extract<Figure, { kind: "rectangle" }> }) {
  const x = 52;
  const y = 30;
  const w = 136;
  const h = 78;
  return (
    <>
      <rect x={x} y={y} width={w} height={h} className={`${FILL} ${STROKE}`} strokeWidth={1.8} />
      {f.diagonal && (
        <>
          <line x1={x} y1={y} x2={x + w} y2={y + h} className={SOFT} strokeWidth={1.4} strokeDasharray="4 3" />
          <line x1={x + w} y1={y} x2={x} y2={y + h} className={SOFT} strokeWidth={1.4} strokeDasharray="4 3" />
        </>
      )}
      <T x={x + w / 2} y={y + h + 18}>{f.w}</T>
      <T x={x + w + 8} y={y + h / 2 + 4} anchor="start">{f.h}</T>
    </>
  );
}

function Elevation({ f }: { f: Extract<Figure, { kind: "elevation" }> }) {
  const obs = { x: 40, y: 118 };
  const foot = { x: 196, y: 118 };
  const top = { x: 196, y: 30 };
  return (
    <>
      <line x1={14} y1={foot.y} x2={228} y2={foot.y} className={STROKE} strokeWidth={1.6} />
      <line x1={foot.x} y1={foot.y} x2={top.x} y2={top.y} className={STROKE} strokeWidth={3} strokeLinecap="round" />
      <line x1={obs.x} y1={obs.y} x2={top.x} y2={top.y} className={SOFT} strokeWidth={1.6} strokeDasharray="5 3" />
      <circle cx={obs.x} cy={obs.y} r={3.5} className="fill-subject-math" />
      <T x={obs.x + 46} y={obs.y - 6} accent>{f.angle}</T>
      <T x={foot.x - 8} y={(foot.y + top.y) / 2 + 4} anchor="end">{f.height}</T>
      <T x={(obs.x + foot.x) / 2} y={foot.y + 17}>{f.distance}</T>
    </>
  );
}

function Similar({ f }: { f: Extract<Figure, { kind: "similar" }> }) {
  return (
    <>
      <polygon points="30,122 120,122 30,62" className={`${FILL} ${STROKE}`} strokeWidth={1.8} strokeLinejoin="round" />
      <polygon points="132,122 222,122 222,26" className={`${FILL} ${STROKE}`} strokeWidth={1.8} strokeLinejoin="round" />
      <T x={75} y={139}>{f.small}</T>
      <T x={177} y={139}>{f.large}</T>
    </>
  );
}

/** Small diagram shown beside a question; purely decorative data, so it is hidden from screen readers (the prompt carries the facts). */
export const FigureView = memo(function FigureView({ figure }: { figure: Figure }) {
  return (
    <svg viewBox="0 0 240 150" className="mx-auto h-auto w-full max-w-[260px]" role="img" aria-label="Diagram for the question">
      {figure.kind === "right-triangle" && <RightTriangle f={figure} />}
      {figure.kind === "triangle" && <Triangle f={figure} />}
      {figure.kind === "circle" && <Circle f={figure} />}
      {figure.kind === "rectangle" && <Rectangle f={figure} />}
      {figure.kind === "elevation" && <Elevation f={figure} />}
      {figure.kind === "similar" && <Similar f={figure} />}
    </svg>
  );
});
