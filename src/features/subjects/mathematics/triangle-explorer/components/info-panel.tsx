import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  classifyByAngles,
  classifyBySides,
  formatDegrees,
  formatLength,
  type TriangleAngles,
  type TriangleSides,
} from "../model";

interface InfoPanelProps {
  sides: TriangleSides;
  angleValues: TriangleAngles;
  perimeter: number;
  area: number;
}

const SIDE_LABELS: { key: keyof TriangleSides; caption: string }[] = [
  { key: "a", caption: "opposite A" },
  { key: "b", caption: "opposite B" },
  { key: "c", caption: "opposite C" },
];

const ANGLE_LABELS: (keyof TriangleAngles)[] = ["A", "B", "C"];

/**
 * Live readout beneath the canvas: side lengths, angle measures,
 * perimeter, area, and both classification badges (by sides and by
 * angles). Pure presentation — every number is computed by
 * `model.ts` and passed in already-derived.
 */
export function InfoPanel({ sides, angleValues, perimeter, area }: InfoPanelProps) {
  const sideClass = classifyBySides(sides);
  const angleClass = classifyByAngles(angleValues);
  const angleSum = angleValues.A + angleValues.B + angleValues.C;

  return (
    <div className="grid gap-4 rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03] sm:grid-cols-2">
      <div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Sides</p>
        <div className="flex flex-col gap-1">
          {SIDE_LABELS.map(({ key, caption }) => (
            <div key={key} className="flex items-baseline justify-between text-sm">
              <span className="text-ink-soft dark:text-bone-soft">
                {key} <span className="text-xs">({caption})</span>
              </span>
              <span className="font-mono font-semibold text-ink dark:text-bone">{formatLength(sides[key])}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Angles</p>
        <div className="flex flex-col gap-1">
          {ANGLE_LABELS.map((key) => (
            <div key={key} className="flex items-baseline justify-between text-sm">
              <span className="text-ink-soft dark:text-bone-soft">Angle {key}</span>
              <span className="font-mono font-semibold text-ink dark:text-bone">{formatDegrees(angleValues[key])}</span>
            </div>
          ))}
          <div className="mt-1 flex items-baseline justify-between border-t border-dashed border-line pt-1 text-xs dark:border-line-dark">
            <span className="text-ink-soft/80 dark:text-bone-soft/80">Sum</span>
            <span className="font-mono text-ink-soft dark:text-bone-soft">{formatDegrees(angleSum)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-baseline justify-between text-sm sm:col-span-1">
        <span className="text-ink-soft dark:text-bone-soft">Perimeter</span>
        <span className="font-mono font-semibold text-ink dark:text-bone">{formatLength(perimeter)}</span>
      </div>
      <div className="flex items-baseline justify-between text-sm sm:col-span-1">
        <span className="text-ink-soft dark:text-bone-soft">Area</span>
        <span className="font-mono font-semibold text-ink dark:text-bone">{formatLength(area)}</span>
      </div>

      <div className="flex flex-wrap gap-2 sm:col-span-2">
        <Badge className={cn(classificationTone(sideClass))}>{sideClass}</Badge>
        <Badge className={cn(classificationTone(angleClass))}>{angleClass}</Badge>
      </div>
    </div>
  );
}

function classificationTone(label: string): string {
  const tones: Record<string, string> = {
    equilateral: "border-pine-500/30 text-pine-700 dark:text-pine-300",
    isosceles: "border-amber-500/30 text-amber-700 dark:text-amber-400",
    scalene: "border-ink/15 text-ink-soft dark:border-bone/20 dark:text-bone-soft",
    right: "border-subject-math/30 text-subject-math",
    acute: "border-pine-500/30 text-pine-700 dark:text-pine-300",
    obtuse: "border-amber-500/30 text-amber-700 dark:text-amber-400",
  };
  return tones[label] ?? "";
}
