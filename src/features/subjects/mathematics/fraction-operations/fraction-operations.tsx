"use client";

import { useState } from "react";
import { AddSubtractVisual } from "./components/add-subtract-visual";
import { DivideVisual } from "./components/divide-visual";
import { FractionPicker } from "./components/fraction-picker";
import { MultiplyVisual } from "./components/multiply-visual";
import { OperationTabs } from "./components/operation-tabs";
import { ResultSummary } from "./components/result-summary";
import { computeOperation, type Fraction, type Operation } from "./model";

/**
 * The Fraction Operations Lab. Two fraction pickers and an operation
 * tab strip drive a live visualization that changes shape per
 * operation, matching how each operation is actually taught:
 * addition/subtraction convert both fractions to a common
 * denominator and combine same-size pieces; multiplication is a
 * "part of a part" area model; division shows how many of the second
 * fraction's size fit into the first.
 */
export function FractionOperationsLab() {
  const [operation, setOperation] = useState<Operation>("add");
  const [a, setA] = useState<Fraction>({ num: 1, den: 2 });
  const [b, setB] = useState<Fraction>({ num: 1, den: 4 });

  const result = computeOperation(operation, a, b);

  return (
    <div className="flex flex-col items-center gap-8 py-4">
      <OperationTabs operation={operation} onChange={setOperation} />

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center sm:gap-10">
        <FractionPicker label="First fraction" value={a} onChange={setA} />
        <FractionPicker label="Second fraction" value={b} onChange={setB} />
      </div>

      <div className="w-full overflow-x-auto">
        <div className="flex min-w-fit justify-center px-2">
          {operation === "add" || operation === "subtract" ? (
            <AddSubtractVisual a={a} b={b} isSubtract={operation === "subtract"} />
          ) : operation === "multiply" ? (
            <MultiplyVisual a={a} b={b} />
          ) : (
            <DivideVisual a={a} b={b} />
          )}
        </div>
      </div>

      <ResultSummary a={a} b={b} operation={operation} result={result} />
    </div>
  );
}
