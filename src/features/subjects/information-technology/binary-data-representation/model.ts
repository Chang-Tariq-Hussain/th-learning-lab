/**
 * Conceptual + numeric model for the Binary & Data Representation
 * simulation (the "Binary Data Laboratory").
 *
 * Everything here is plain arithmetic on an 8-bit value — no physics
 * engine needed, same reasoning as
 * `information-technology/cpu-ram-storage-data-flow/model.ts` for why
 * this doesn't use the shared `@/features/simulation` canvas engine.
 *
 * `Bits` is always exactly 8 entries, most-significant bit first
 * (index 0 = place value 128, index 7 = place value 1) — the same
 * left-to-right order the diagram and every activity display it in.
 */

export const BIT_COUNT = 8;

/** Place value of each of the 8 bit positions, most significant first. */
export const PLACE_VALUES: readonly number[] = [128, 64, 32, 16, 8, 4, 2, 1];

export type Bits = number[]; // length 8, each entry 0 or 1

export function emptyBits(): Bits {
  return new Array(BIT_COUNT).fill(0);
}

export function clampByte(n: number): number {
  return Math.max(0, Math.min(255, Math.floor(n)));
}

/** Sum of the place values of every set bit — the byte's decimal value. */
export function bitsToDecimal(bits: Bits): number {
  return bits.reduce((sum, bit, i) => sum + (bit ? PLACE_VALUES[i]! : 0), 0);
}

/** Standard "does this place value fit?" greedy conversion — the same
 *  process the Learn section walks through step by step. */
export function decimalToBits(n: number): Bits {
  let remaining = clampByte(n);
  return PLACE_VALUES.map((place) => {
    if (remaining >= place) {
      remaining -= place;
      return 1;
    }
    return 0;
  });
}

export function bitsToBinaryString(bits: Bits): string {
  return bits.join("");
}

/** Parses a typed binary string into `Bits`, tolerant of leading
 *  whitespace and short strings (left-padded with zeros). Returns
 *  `null` for anything that isn't 1-8 characters of only 0s and 1s. */
export function parseBinaryString(input: string): Bits | null {
  const cleaned = input.trim();
  if (!/^[01]{1,8}$/.test(cleaned)) return null;
  const padded = cleaned.padStart(BIT_COUNT, "0");
  return padded.split("").map((c) => Number(c));
}

export function toggleBit(bits: Bits, index: number): Bits {
  const next = [...bits];
  next[index] = next[index] ? 0 : 1;
  return next;
}

// ---------------------------------------------------------------------------
// Character encoding — a small, curated, beginner-friendly character set.
// Real ASCII is a 7-bit standard (0-127); every code below fits inside a
// single 8-bit byte with its top bit always 0, which is exactly what the
// Learn section explains rather than glossing over.
// ---------------------------------------------------------------------------

export interface CharacterEntry {
  char: string;
  code: number;
}

function makeRange(chars: string): CharacterEntry[] {
  return chars.split("").map((char) => ({ char, code: char.charCodeAt(0) }));
}

export const CHARACTER_SET: CharacterEntry[] = [
  ...makeRange("ABCDEFGHIJKLMNOPQRSTUVWXYZ"),
  ...makeRange("abcdefghijklmnopqrstuvwxyz"),
  ...makeRange("0123456789"),
  { char: " ", code: 32 },
  { char: "!", code: 33 },
  { char: ".", code: 46 },
  { char: "?", code: 63 },
];

export function findCharacterEntry(char: string): CharacterEntry | undefined {
  return CHARACTER_SET.find((c) => c.char === char);
}

export function findEntryByCode(code: number): CharacterEntry | undefined {
  return CHARACTER_SET.find((c) => c.code === code);
}

// ---------------------------------------------------------------------------
// Activities — each is a small generator of a random task plus a checker.
// A tier only controls which pool of target values a task is drawn from,
// not a different mechanic, so "harder" always means "a less friendly
// number/pattern," never a new kind of question.
// ---------------------------------------------------------------------------

export type LabMode = "explore" | "build" | "decode" | "encode" | "challenge";

export const LAB_MODES: { id: LabMode; label: string; blurb: string }[] = [
  { id: "explore", label: "Free Explore", blurb: "Toggle any bit and watch the decimal value update instantly." },
  { id: "build", label: "Build a Number", blurb: "You're given a decimal target — toggle bits until you match it." },
  { id: "decode", label: "Decode Binary", blurb: "You're given a binary pattern — predict its decimal value before checking." },
  { id: "encode", label: "Character Encoding", blurb: "Convert a character to its binary byte, or a byte back into a character." },
  { id: "challenge", label: "Challenge Mode", blurb: "A mixed, progressively harder run through all three skills." },
];

/** Random integer in [min, max], inclusive. */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export type Difficulty = "easy" | "medium" | "hard";

/** "Easy" targets stay under 32 (need at most a couple of bits toggled
 *  from zero), "medium" spans the full byte, "hard" favors awkward
 *  values (odd numbers, values needing most bits set) that don't fall
 *  out of round binary patterns. */
export function randomTargetDecimal(difficulty: Difficulty): number {
  if (difficulty === "easy") return randomInt(1, 31);
  if (difficulty === "medium") return randomInt(1, 254);
  // hard: bias toward values with 4+ bits set, which tend to feel least
  // intuitive to build (e.g. 173 = 10101101).
  for (let attempt = 0; attempt < 20; attempt++) {
    const n = randomInt(1, 254);
    const bitsSet = decimalToBits(n).filter(Boolean).length;
    if (bitsSet >= 4) return n;
  }
  return 173;
}

export function randomBits(difficulty: Difficulty): Bits {
  return decimalToBits(randomTargetDecimal(difficulty));
}

export function randomCharacterEntry(): CharacterEntry {
  return CHARACTER_SET[randomInt(0, CHARACTER_SET.length - 1)]!;
}

/** A single Challenge Mode round — one of the three underlying skills,
 *  generated fresh each round so the mode never repeats verbatim. */
export type ChallengeKind = "build" | "decode" | "encode-to-binary" | "encode-to-char";

export interface ChallengeRound {
  kind: ChallengeKind;
  targetDecimal?: number;
  targetBits?: Bits;
  targetChar?: CharacterEntry;
}

export function generateChallengeRound(roundIndex: number, totalRounds: number): ChallengeRound {
  const progress = roundIndex / Math.max(1, totalRounds - 1); // 0 -> 1
  const difficulty: Difficulty = progress < 0.34 ? "easy" : progress < 0.7 ? "medium" : "hard";
  const kinds: ChallengeKind[] = ["build", "decode", "encode-to-binary", "encode-to-char"];
  const kind = kinds[roundIndex % kinds.length]!;

  if (kind === "build") {
    return { kind, targetDecimal: randomTargetDecimal(difficulty) };
  }
  if (kind === "decode") {
    return { kind, targetBits: randomBits(difficulty) };
  }
  // Both encode kinds work from the same random character; the UI decides
  // whether the student types/toggles the binary or picks the character.
  return { kind, targetChar: randomCharacterEntry() };
}
