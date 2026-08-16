/**
 * Random "missing number" equations for the Equation Playground. All
 * generation is constructive (pick the answer and the known operand
 * first, then derive the result), not rejection-sampled — every kind
 * below is guaranteed to produce positive whole numbers in [1, 20] on
 * the first try, which matters since this is "Easy only" per the brief.
 */

export type Operator = "+" | "\u2212" | "\u00d7" | "\u00f7"; // +, −, ×, ÷

export interface EquationChallenge {
  id: string;
  /** The left operand, or "box" if this is the missing slot. */
  a: number | "box";
  operator: Operator;
  /** The right operand, or "box" if this is the missing slot. */
  b: number | "box";
  result: number;
  /** The correct value for whichever side is "box". */
  answer: number;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `eq-${idCounter}`;
}

type Kind =
  | "box-plus-b"
  | "a-plus-box"
  | "box-minus-b"
  | "a-minus-box"
  | "box-times-b"
  | "a-times-box"
  | "a-div-box"
  | "box-div-b";

const KINDS: Kind[] = [
  "box-plus-b",
  "a-plus-box",
  "box-minus-b",
  "a-minus-box",
  "box-times-b",
  "a-times-box",
  "a-div-box",
  "box-div-b",
];

function build(kind: Kind): EquationChallenge {
  switch (kind) {
    case "box-plus-b": {
      const answer = randomInt(1, 19);
      const b = randomInt(1, 20 - answer);
      return { id: nextId(), a: "box", operator: "+", b, result: answer + b, answer };
    }
    case "a-plus-box": {
      const answer = randomInt(1, 19);
      const a = randomInt(1, 20 - answer);
      return { id: nextId(), a, operator: "+", b: "box", result: a + answer, answer };
    }
    case "box-minus-b": {
      const b = randomInt(1, 15);
      const answer = randomInt(b + 1, 20);
      return { id: nextId(), a: "box", operator: "\u2212", b, result: answer - b, answer };
    }
    case "a-minus-box": {
      const result = randomInt(1, 19);
      const answer = randomInt(1, 20 - result);
      return { id: nextId(), a: result + answer, operator: "\u2212", b: "box", result, answer };
    }
    case "box-times-b": {
      const b = randomInt(2, 6);
      const answer = randomInt(1, Math.floor(20 / b));
      return { id: nextId(), a: "box", operator: "\u00d7", b, result: answer * b, answer };
    }
    case "a-times-box": {
      const a = randomInt(2, 6);
      const answer = randomInt(1, Math.floor(20 / a));
      return { id: nextId(), a, operator: "\u00d7", b: "box", result: a * answer, answer };
    }
    case "a-div-box": {
      // a ÷ □ = result — the box is the divisor.
      const answer = randomInt(2, 6);
      const result = randomInt(1, Math.floor(20 / answer));
      return { id: nextId(), a: result * answer, operator: "\u00f7", b: "box", result, answer };
    }
    case "box-div-b": {
      // □ ÷ b = result — the box is the dividend.
      const b = randomInt(2, 6);
      const result = randomInt(1, Math.floor(20 / b));
      return { id: nextId(), a: "box", operator: "\u00f7", b, result, answer: result * b };
    }
  }
}

/** A stable key for "was this the same question as last time" — used to avoid an immediate repeat. */
export function challengeKey(challenge: EquationChallenge): string {
  return `${challenge.a}${challenge.operator}${challenge.b}=${challenge.result}`;
}

export function nextChallenge(excludeKey?: string): EquationChallenge {
  let challenge = build(KINDS[randomInt(0, KINDS.length - 1)]!);
  let attempts = 0;
  while (challengeKey(challenge) === excludeKey && attempts < 5) {
    challenge = build(KINDS[randomInt(0, KINDS.length - 1)]!);
    attempts += 1;
  }
  return challenge;
}

/** Renders the equation as a string, substituting `boxDisplay` for whichever side is "box". */
export function formatEquation(challenge: EquationChallenge, boxDisplay: string): string {
  const left = challenge.a === "box" ? boxDisplay : String(challenge.a);
  const right = challenge.b === "box" ? boxDisplay : String(challenge.b);
  return `${left} ${challenge.operator} ${right} = ${challenge.result}`;
}

/** The one-sentence explanation shown after a correct answer, e.g. "4 + 5 = 9, so the missing number is 4." */
export function explainAnswer(challenge: EquationChallenge): string {
  return `${formatEquation(challenge, String(challenge.answer))}, so the missing number is ${challenge.answer}.`;
}
