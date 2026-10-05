import { shuffle } from "./rng";
import type { Difficulty, Generator, Question, RawQuestion, Rng } from "./types";

/** Numeric padding used only if a generator supplies fewer than three distinct wrong answers. */
function padWrong(answer: string, have: string[]): string[] {
  const m = answer.match(/^(.*?)(-?\d+(?:\.\d+)?)(.*)$/);
  if (!m) return have;
  const [, pre, digits, post] = m;
  const base = Number(digits);
  const out = [...have];
  for (const off of [1, -1, 2, -2, 5, 10, 0.5, 3]) {
    const candidate = `${pre}${Number((base + off).toFixed(2))}${post}`;
    if (candidate !== answer && !out.includes(candidate)) out.push(candidate);
    if (out.length >= 6) break;
  }
  return out;
}

/** Drop duplicates / the correct answer, keep three wrong options, shuffle, and locate the right one. */
export function buildQuestion(raw: RawQuestion, gen: Generator, rng: Rng, id: number, difficulty: Difficulty): Question {
  let wrong = Array.from(new Set(raw.wrong.filter((w) => w !== raw.answer)));
  if (wrong.length < 3) wrong = padWrong(raw.answer, wrong);
  const options = shuffle(rng, [raw.answer, ...wrong.slice(0, 3)]);
  return {
    id,
    module: gen.topic.module,
    topic: gen.topic.id,
    topicLabel: gen.topic.label,
    difficulty,
    prompt: raw.prompt,
    figure: raw.figure,
    options,
    correct: options.indexOf(raw.answer),
    steps: raw.steps,
    trick: raw.trick,
    trap: raw.trap,
  };
}
