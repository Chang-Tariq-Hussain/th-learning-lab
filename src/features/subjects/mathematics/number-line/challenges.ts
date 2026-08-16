export interface Challenge {
  id: number;
  prompt: string;
  target: number;
}

let idCounter = 0;

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

type Template = () => Omit<Challenge, "id">;

const templates: Template[] = [
  () => {
    const n = randomInt(1, 20);
    return { prompt: `Move to +${n}`, target: n };
  },
  () => {
    const n = randomInt(1, 20);
    return { prompt: `Find ${-n}`, target: -n };
  },
  () => ({ prompt: "Go to Zero", target: 0 }),
  () => ({ prompt: "Find the largest negative number", target: -1 }),
];

/** Picks a random challenge, retrying a few times to avoid repeating `excludeTarget`
 *  (e.g. the number the student is already standing on, or the previous challenge). */
export function nextChallenge(excludeTarget?: number): Challenge {
  let draft = templates[randomInt(0, templates.length - 1)]!();
  let attempts = 0;
  while (draft.target === excludeTarget && attempts < 6) {
    draft = templates[randomInt(0, templates.length - 1)]!();
    attempts++;
  }
  return { id: ++idCounter, ...draft };
}
