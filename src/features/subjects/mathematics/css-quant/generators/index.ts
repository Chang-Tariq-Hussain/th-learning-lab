import { buildQuestion } from "../build-question";
import type { Difficulty, Generator, ModuleId, Question, Rng, TopicDef } from "../types";
import { int } from "../rng";
import { GEOMETRY_GENERATORS } from "./geometry";
import { RATIO_GENERATORS } from "./ratio";
import { TRIG_GENERATORS } from "./trigonometry";

export const ALL_GENERATORS: Generator[] = [...RATIO_GENERATORS, ...GEOMETRY_GENERATORS, ...TRIG_GENERATORS];

export function generatorsFor(module: ModuleId): Generator[] {
  return module === "mixed" ? ALL_GENERATORS : ALL_GENERATORS.filter((g) => g.topic.module === module);
}

export function topicsFor(module: ModuleId): TopicDef[] {
  return generatorsFor(module).map((g) => g.topic);
}

let nextId = 1;

/**
 * Build one question. `topicId` limits it to a single topic; `avoid` is the previous question's topic so the same
 * topic isn't served twice in a row when there is a choice.
 */
export function generateQuestion(module: ModuleId, difficulty: Difficulty, rng: Rng, opts: { topicId?: string | null; avoid?: string | null } = {}): Question {
  let pool = generatorsFor(module);
  if (opts.topicId) {
    const only = pool.filter((g) => g.topic.id === opts.topicId);
    if (only.length) pool = only;
  } else if (opts.avoid && pool.length > 1) {
    pool = pool.filter((g) => g.topic.id !== opts.avoid);
  }
  const gen = pool[int(rng, 0, pool.length - 1)]!;
  return buildQuestion(gen.make(rng, difficulty), gen, rng, nextId++, difficulty);
}
