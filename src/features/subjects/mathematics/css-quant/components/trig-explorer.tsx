"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Panel } from "./panel";

const SPECIAL: Array<{ deg: number; sin: string; cos: string; tan: string }> = [
  { deg: 0, sin: "0", cos: "1", tan: "0" },
  { deg: 30, sin: "1/2", cos: "√3/2", tan: "1/√3" },
  { deg: 45, sin: "1/√2", cos: "1/√2", tan: "1" },
  { deg: 60, sin: "√3/2", cos: "1/2", tan: "√3" },
  { deg: 90, sin: "1", cos: "0", tan: "undefined" },
];

/** Drag the angle and watch sin, cos and tan change on a right triangle with hypotenuse 1. */
export function TrigExplorer() {
  const [deg, setDeg] = useState(30);
  const rad = (deg * Math.PI) / 180;
  const s = Math.sin(rad);
  const c = Math.cos(rad);
  const tan = deg === 90 ? NaN : Math.tan(rad);
  const R = 120;
  const ox = 30;
  const oy = 130;
  const px = ox + R * c;
  const py = oy - R * s;
  const special = SPECIAL.find((x) => x.deg === deg);
  const f = (v: number) => (Number.isFinite(v) ? v.toFixed(3) : "undefined");

  return (
    <Panel title="Trig explorer — see where the exact values come from">
      <div className="grid gap-4 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)] md:items-center">
        <svg viewBox="0 0 170 150" className="mx-auto h-auto w-full max-w-[260px] rounded-xl border border-line bg-white/60 dark:border-line-dark dark:bg-white/[0.03]" role="img" aria-label={`Right triangle with a ${deg} degree angle; sine ${f(s)}, cosine ${f(c)}`}>
          <line x1={ox} y1={oy} x2={ox + R} y2={oy} className="stroke-ink/30 dark:stroke-bone/30" strokeWidth={1} strokeDasharray="3 3" />
          <polygon points={`${ox},${oy} ${px},${oy} ${px},${py}`} className="fill-subject-math-soft/60 stroke-ink dark:fill-subject-math/15 dark:stroke-bone" strokeWidth={1.6} strokeLinejoin="round" />
          <line x1={ox} y1={oy} x2={px} y2={py} className="stroke-subject-math" strokeWidth={2.4} />
          <text x={ox + 26} y={oy - 5} className="fill-subject-math font-mono text-[9px] font-semibold">{deg}°</text>
          <text x={(ox + px) / 2} y={oy + 12} textAnchor="middle" className="fill-ink font-mono text-[8px] dark:fill-bone">cos = {f(c)}</text>
          <text x={px + 4} y={(oy + py) / 2 + 3} className="fill-ink font-mono text-[8px] dark:fill-bone">sin = {f(s)}</text>
          <text x={(ox + px) / 2 - 6} y={(oy + py) / 2 - 6} textAnchor="end" className="fill-ink-soft font-mono text-[8px] dark:fill-bone-soft">1</text>
        </svg>

        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-xs text-ink-soft dark:text-bone-soft">
            Angle: <span className="font-mono text-sm font-semibold text-ink dark:text-bone">{deg}°</span>
            <input type="range" min={0} max={90} step={1} value={deg} onChange={(e) => setDeg(Number(e.target.value))} className="w-full accent-subject-math" aria-label="Angle in degrees" />
          </label>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Jump to a special angle">
            {SPECIAL.map((x) => (
              <button
                key={x.deg}
                type="button"
                onClick={() => setDeg(x.deg)}
                aria-pressed={deg === x.deg}
                className={cn("min-h-[40px] min-w-[52px] rounded-full border px-3 py-1.5 font-mono text-xs transition-colors", deg === x.deg ? "border-subject-math bg-subject-math text-paper" : "border-line text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone")}
              >
                {x.deg}°
              </button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[300px] text-left text-xs">
              <thead>
                <tr className="border-b border-line font-mono text-[10px] uppercase text-ink-soft dark:border-line-dark dark:text-bone-soft">
                  <th className="py-1.5 pr-3 font-medium">θ</th>
                  <th className="py-1.5 pr-3 font-medium">sin</th>
                  <th className="py-1.5 pr-3 font-medium">cos</th>
                  <th className="py-1.5 font-medium">tan</th>
                </tr>
              </thead>
              <tbody>
                {SPECIAL.map((x) => (
                  <tr key={x.deg} className={cn("border-b border-line/60 font-mono dark:border-line-dark/60", deg === x.deg && "bg-subject-math-soft/60 dark:bg-subject-math/15")}>
                    <td className="py-1.5 pr-3 text-ink dark:text-bone">{x.deg}°</td>
                    <td className="py-1.5 pr-3 text-ink dark:text-bone">{x.sin}</td>
                    <td className="py-1.5 pr-3 text-ink dark:text-bone">{x.cos}</td>
                    <td className="py-1.5 text-ink dark:text-bone">{x.tan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-ink-soft dark:text-bone-soft">
            {special ? `At ${deg}° the exact values are sin = ${special.sin}, cos = ${special.cos}, tan = ${special.tan}.` : `Decimal values: sin ${f(s)}, cos ${f(c)}, tan ${f(tan)}. Slide to a highlighted angle to see its exact value.`} Note sin² + cos² = {(s * s + c * c).toFixed(3)} for every angle.
          </p>
        </div>
      </div>
    </Panel>
  );
}
