"use client";

import { cn } from "@/lib/utils";
import { lcm, type Fraction } from "../model";

/**
 * Division as "how many B-size chunks fit into A": both fractions are
 * converted to the same common-denominator-size cell (same move as
 * addition/subtraction) so a single row of small cells represents A,
 * with a thicker divider drawn every `scaledB` cells marking off one
 * "chunk" — the number of complete chunks (plus a partial one, if
 * any) is exactly the division's answer.
 */
export function DivideVisual({ a, b }: { a: Fraction; b: Fraction }) {
  if (a.num === 0 && b.num === 0) return null;
  if (b.num === 0) {
    return (
      <p className="max-w-sm text-center text-sm text-ink-soft dark:text-bone-soft">
        Dividing by zero isn&apos;t defined — increase the second fraction&apos;s numerator above 0 to see this
        visualization.
      </p>
    );
  }

  const commonDen = lcm(a.den, b.den);
  const scaledA = a.num * (commonDen / a.den);
  const scaledB = b.num * (commonDen / b.den);

  if (scaledA === 0) {
    return (
      <p className="max-w-sm text-center text-sm text-ink-soft dark:text-bone-soft">
        With a numerator of 0, there&apos;s nothing to divide up yet — increase the first fraction&apos;s numerator
        above.
      </p>
    );
  }

  const fullChunks = Math.floor(scaledA / scaledB);
  const remainder = scaledA % scaledB;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-[3px]" role="img" aria-label={`${a.num}/${a.den} divided into chunks of ${b.num}/${b.den}`}>
        {Array.from({ length: scaledA }, (_, i) => {
          const chunkIndex = Math.floor(i / scaledB);
          const isNewChunkStart = i % scaledB === 0 && i !== 0;
          const isEven = chunkIndex % 2 === 0;
          return (
            <div
              key={i}
              className={cn(
                "h-8 w-6 rounded-sm sm:h-9 sm:w-7",
                isNewChunkStart && "ml-2",
                isEven ? "bg-subject-math" : "bg-subject-math/50",
              )}
            />
          );
        })}
      </div>
      <p className="text-sm text-ink-soft dark:text-bone-soft">
        {fullChunks} complete chunk{fullChunks === 1 ? "" : "s"} of {b.num}/{b.den}
        {remainder > 0 ? `, plus ${remainder}/${scaledB} of one more chunk` : ""} fit into {a.num}/{a.den}.
      </p>
    </div>
  );
}
