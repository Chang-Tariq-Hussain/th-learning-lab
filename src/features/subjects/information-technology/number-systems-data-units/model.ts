/**
 * Pure model for the Number Systems & Data Units laboratory.
 *
 * Everything here is plain, framework-free arithmetic — no React, no
 * timers, no storage, no network. Conversions use `BigInt` (and small
 * rational numbers built on it) instead of floating point, so a result
 * like "4 GiB = 4,294.967296 MB" is exact rather than "close enough",
 * and 64-bit addresses / petabyte figures never lose precision.
 *
 * Scope note: this topic complements Binary & Data Representation. It
 * owns number *bases* and their conversions, data *units*, storage /
 * memory / transfer-rate arithmetic, and address arithmetic. How
 * characters and values are *encoded* stays in Binary & Data
 * Representation.
 */

// ---------------------------------------------------------------------------
// Levels
// ---------------------------------------------------------------------------

export type Level = "beginner" | "intermediate" | "technical";

export const LEVELS: { id: Level; label: string; blurb: string }[] = [
  { id: "beginner", label: "Beginner", blurb: "Decimal and binary, bits, bytes, basic conversions, and data units." },
  { id: "intermediate", label: "Intermediate", blurb: "Adds octal and hexadecimal, binary grouping, storage calculations, network speed, and memory addresses." },
  { id: "technical", label: "Technical", blurb: "Adds decimal vs binary units, address ranges, tag/index/offset, signed integers, two's complement, and practical IT calculations." },
];

const LEVEL_RANK: Record<Level, number> = { beginner: 0, intermediate: 1, technical: 2 };

export function levelAtLeast(level: Level, needed: Level): boolean {
  return LEVEL_RANK[level] >= LEVEL_RANK[needed];
}

// ---------------------------------------------------------------------------
// Disclaimers (shown in the UI)
// ---------------------------------------------------------------------------

export const GENERAL_DISCLAIMER =
  "Educational model. Conversions and unit arithmetic are exact, but real-world capacities, memory sizes, transfer speeds, and address spaces depend on hardware, firmware, operating-system reporting conventions, and protocol overhead. File sizes and drive sizes used here are illustrative, not brand-specific.";

export const UNITS_DISCLAIMER =
  "Prefixes: kB, MB, GB, TB, PB are decimal (SI) units — powers of 1,000. KiB, MiB, GiB, TiB, PiB are binary (IEC) units — powers of 1,024. Software and hardware do not always follow the same convention, and some tools use “KB”, “MB”, or “GB” loosely for either.";

export const CAPACITY_DISCLAIMER =
  "Advertised capacity is not the same as usable capacity. Some space is used by formatting, the file system, firmware, and reserved areas, and different tools report sizes with different conventions — so an operating system may show a smaller number than the label.";

export const TRANSFER_DISCLAIMER =
  "Idealized calculation. Real transfers are usually slower because of protocol overhead, network congestion, Wi-Fi conditions, server limits, and other system factors. Treat the result as a best-case estimate, not a guaranteed time.";

export const ADDRESS_DISCLAIMER =
  "Real addressing and usable address space depend on the architecture and system design — for example, many 64-bit processors implement fewer than 64 address bits, and memory addresses are not displayed in exactly one universal format.";

// ---------------------------------------------------------------------------
// Number bases
// ---------------------------------------------------------------------------

export type BaseId = "decimal" | "binary" | "octal" | "hex";

export interface BaseInfo {
  id: BaseId;
  label: string;
  radix: 2 | 8 | 10 | 16;
  /** Every legal digit, in order of value. */
  digits: string;
  /** Human-readable digit range, e.g. "0–9". */
  digitRange: string;
  /** Common source-code style prefix ("" for decimal). */
  prefix: string;
  /** Subscript used in textbook notation, e.g. "₂". */
  subscript: string;
  minLevel: Level;
  summary: string;
  example: string;
}

export const BASES: BaseInfo[] = [
  {
    id: "decimal",
    label: "Decimal",
    radix: 10,
    digits: "0123456789",
    digitRange: "0–9",
    prefix: "",
    subscript: "₁₀",
    minLevel: "beginner",
    summary: "Base 10 — the system people use every day. Each place is worth 10 times the place to its right.",
    example: "42",
  },
  {
    id: "binary",
    label: "Binary",
    radix: 2,
    digits: "01",
    digitRange: "0–1",
    prefix: "0b",
    subscript: "₂",
    minLevel: "beginner",
    summary: "Base 2 — two digits, matching the two states (off/on) of digital circuits. Each place is worth 2 times the place to its right.",
    example: "101010",
  },
  {
    id: "octal",
    label: "Octal",
    radix: 8,
    digits: "01234567",
    digitRange: "0–7",
    prefix: "0o",
    subscript: "₈",
    minLevel: "intermediate",
    summary: "Base 8 — each octal digit stands for exactly 3 bits, so it is a compact way to write binary.",
    example: "52",
  },
  {
    id: "hex",
    label: "Hexadecimal",
    radix: 16,
    digits: "0123456789ABCDEF",
    digitRange: "0–9, A–F",
    prefix: "0x",
    subscript: "₁₆",
    minLevel: "intermediate",
    summary: "Base 16 — sixteen digits (0–9 then A–F). Each hex digit stands for exactly 4 bits, so two hex digits describe one byte.",
    example: "2A",
  },
];

export function getBase(id: BaseId): BaseInfo {
  return BASES.find((b) => b.id === id)!;
}

/** Hex letters and the values they stand for — shown next to hex work. */
export const HEX_LETTERS: { letter: string; value: number }[] = "ABCDEF".split("").map((letter, i) => ({ letter, value: 10 + i }));

/** Largest value the laboratory converts: an unsigned 64-bit integer. */
export const MAX_BITS = 64;
export const MAX_VALUE: bigint = (BigInt(1) << BigInt(MAX_BITS)) - BigInt(1);

const SUPERSCRIPT_DIGITS: Record<string, string> = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };

export function superscript(n: number): string {
  return String(n)
    .split("")
    .map((c) => SUPERSCRIPT_DIGITS[c] ?? c)
    .join("");
}

/** "1234567" -> "1,234,567". Works on a digit string so BigInts never round-trip through Number. */
export function withCommas(digits: string): string {
  const neg = digits.startsWith("-");
  const body = neg ? digits.slice(1) : digits;
  return (neg ? "-" : "") + body.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatBig(n: bigint): string {
  return withCommas(n.toString());
}

/** Splits a digit string into groups counted from the right — "1010110" -> "101 0110". */
export function groupFromRight(s: string, size: number, sep = " "): string {
  const groups: string[] = [];
  for (let end = s.length; end > 0; end -= size) {
    groups.unshift(s.slice(Math.max(0, end - size), end));
  }
  return groups.join(sep);
}

/** Reads a most-significant-bit-first array/string of 0s and 1s as a decimal number — the small helper the bit-toggle labs use. */
export function bitsArrayToDecimal(bits: (number | string)[]): number {
  return parseInt(bits.join(""), 2) || 0;
}

export function bitLength(value: bigint): number {
  return value === BigInt(0) ? 1 : value.toString(2).length;
}

export function toBase(value: bigint, base: BaseId): string {
  return value.toString(getBase(base).radix).toUpperCase();
}

export type ConvertedValues = Record<BaseId, string>;

export function convertAll(value: bigint): ConvertedValues {
  return {
    decimal: toBase(value, "decimal"),
    binary: toBase(value, "binary"),
    octal: toBase(value, "octal"),
    hex: toBase(value, "hex"),
  };
}

// ---------------------------------------------------------------------------
// Parsing & validation (with educational error messages)
// ---------------------------------------------------------------------------

export type ParseResult = { ok: true; value: bigint; digits: string } | { ok: false; error: string };

function invalidDigitMessage(base: BaseId, ch: string): string {
  const shown = ch.toUpperCase();
  const isDecimalDigit = /[0-9]/.test(ch);
  switch (base) {
    case "binary":
      return `Binary cannot contain ${shown}. Binary is base 2, so the only digits are 0 and 1.`;
    case "octal":
      return isDecimalDigit
        ? `Octal cannot contain ${shown}. Octal is base 8, so its digits stop at 7 (a digit must be less than 8).`
        : `Octal cannot contain ${shown}. Octal uses only the digits 0–7.`;
    case "decimal":
      return `Decimal cannot contain ${shown}. Decimal uses only the digits 0–9.`;
    case "hex":
      return `Hexadecimal cannot contain ${shown}. Hexadecimal uses 0–9 and the letters A–F (A = 10 … F = 15).`;
  }
}

/**
 * Parses text as a non-negative whole number in `base`. Accepts the
 * matching prefix (0b / 0o / 0x), upper- or lower-case hex, and
 * spaces or underscores as digit separators (commas too, for decimal).
 * Never throws; a bad input returns a message written to teach.
 */
export function parseInBase(raw: string, base: BaseId): ParseResult {
  const info = getBase(base);
  let s = raw.trim();
  if (s === "") return { ok: false, error: "Type a value to convert." };

  if (base !== "decimal" && new RegExp(`^${info.prefix}`, "i").test(s)) s = s.slice(info.prefix.length);
  s = s.replace(/[\s_]/g, "");
  if (base === "decimal") s = s.replace(/,/g, "");
  if (s === "") return { ok: false, error: "Type a value to convert." };

  if (s.startsWith("-") || s.startsWith("−") || s.startsWith("+")) {
    return {
      ok: false,
      error: "This converter handles whole numbers with no sign. Negative values need a sign convention such as two's complement — see the Signed Integers tab in Technical mode.",
    };
  }
  if (s.includes(".")) {
    return { ok: false, error: "Whole numbers only — this converter has no fractional digits." };
  }

  const upper = s.toUpperCase();
  for (const ch of upper) {
    if (!info.digits.includes(ch)) return { ok: false, error: invalidDigitMessage(base, ch) };
  }

  const digits = upper.replace(/^0+(?=.)/, "");
  const value = base === "decimal" ? BigInt(digits) : BigInt(`${info.prefix}${digits}`);
  if (value > MAX_VALUE) {
    return {
      ok: false,
      error: `That value needs more than ${MAX_BITS} bits. This laboratory converts values up to ${formatBig(MAX_VALUE)} (2${superscript(MAX_BITS)} − 1).`,
    };
  }
  return { ok: true, value, digits };
}

// ---------------------------------------------------------------------------
// Place values
// ---------------------------------------------------------------------------

export interface PlaceHeader {
  power: number;
  place: bigint;
}

/** Column headers for the place-value visualizer, most significant first. */
export function placeHeaders(base: BaseId, count: number): PlaceHeader[] {
  const radix = BigInt(getBase(base).radix);
  const out: PlaceHeader[] = [];
  for (let power = count - 1; power >= 0; power--) out.push({ power, place: radix ** BigInt(power) });
  return out;
}

export interface PlaceDigit {
  char: string;
  digitValue: number;
  power: number;
  place: bigint;
  contribution: bigint;
}

/** Digit-by-digit contribution to the total value, most significant first. `digits` must already be valid for `base`. */
export function placeValueBreakdown(digits: string, base: BaseId): PlaceDigit[] {
  const info = getBase(base);
  const radix = BigInt(info.radix);
  const upper = digits.toUpperCase();
  return upper.split("").map((char, i) => {
    const power = upper.length - 1 - i;
    const digitValue = info.digits.indexOf(char);
    const place = radix ** BigInt(power);
    return { char, digitValue, power, place, contribution: BigInt(digitValue) * place };
  });
}

export function breakdownTotal(parts: PlaceDigit[]): bigint {
  return parts.reduce((sum, p) => sum + p.contribution, BigInt(0));
}

// ---------------------------------------------------------------------------
// Repeated division (decimal -> binary / octal / hex)
// ---------------------------------------------------------------------------

export interface DivisionStep {
  dividend: number;
  divisor: number;
  quotient: number;
  remainder: number;
  /** The remainder written as a digit in the target base (10 -> "A"). */
  digit: string;
}

const DIGIT_CHARS = "0123456789ABCDEF";

export function divisionSteps(n: number, radix: 2 | 8 | 16): DivisionStep[] {
  const steps: DivisionStep[] = [];
  let current = Math.max(0, Math.floor(n));
  do {
    const quotient = Math.floor(current / radix);
    const remainder = current % radix;
    steps.push({ dividend: current, divisor: radix, quotient, remainder, digit: DIGIT_CHARS[remainder]! });
    current = quotient;
  } while (current > 0);
  return steps;
}

/** The answer: remainders read from the last division back up to the first. */
export function divisionResult(steps: DivisionStep[]): string {
  return steps
    .map((s) => s.digit)
    .reverse()
    .join("");
}

export function radixToBaseId(radix: 2 | 8 | 16): BaseId {
  return radix === 2 ? "binary" : radix === 8 ? "octal" : "hex";
}

// ---------------------------------------------------------------------------
// Binary grouping (binary <-> hexadecimal, binary <-> octal)
// ---------------------------------------------------------------------------

export interface BitGroup {
  bits: string;
  digit: string;
  value: number;
}

/** Splits a binary string into groups of `size` (3 for octal, 4 for hex) from the right, left-padding with zeros. */
export function groupBits(binary: string, size: 3 | 4): BitGroup[] {
  const padded = binary.padStart(Math.ceil(binary.length / size) * size, "0");
  const groups: BitGroup[] = [];
  for (let i = 0; i < padded.length; i += size) {
    const bits = padded.slice(i, i + size);
    const value = parseInt(bits, 2);
    groups.push({ bits, digit: DIGIT_CHARS[value]!, value });
  }
  return groups;
}

/** Expands each hex (size 4) or octal (size 3) digit into its bit group. */
export function expandDigits(digits: string, size: 3 | 4): BitGroup[] {
  return digits
    .toUpperCase()
    .split("")
    .map((digit) => {
      const value = DIGIT_CHARS.indexOf(digit);
      return { bits: value.toString(2).padStart(size, "0"), digit, value };
    });
}

// ---------------------------------------------------------------------------
// Exact rational arithmetic (so unit conversions are never approximate by accident)
// ---------------------------------------------------------------------------

export interface Rat {
  n: bigint;
  d: bigint;
}

const ZERO = BigInt(0);
const ONE = BigInt(1);
const TEN = BigInt(10);

function gcd(a: bigint, b: bigint): bigint {
  let x = a < ZERO ? -a : a;
  let y = b < ZERO ? -b : b;
  while (y !== ZERO) [x, y] = [y, x % y];
  return x;
}

export function rat(n: bigint, d: bigint = ONE): Rat {
  if (d === ZERO) throw new Error("Zero denominator");
  const g = gcd(n, d) || ONE;
  const sign = d < ZERO ? -ONE : ONE;
  return { n: (n / g) * sign, d: (d / g) * sign };
}

export function ratMul(a: Rat, b: Rat): Rat {
  return rat(a.n * b.n, a.d * b.d);
}

export function ratDiv(a: Rat, b: Rat): Rat {
  return rat(a.n * b.d, a.d * b.n);
}

export function ratToNumber(r: Rat): number {
  return Number(r.n) / Number(r.d);
}

/** Parses a plain decimal such as "4", "4.5", ".25", or "1,024.5" into an exact fraction. Non-negative only. */
export function parseDecimalToRat(input: string): Rat | null {
  const s = input.trim().replace(/,/g, "");
  if (s === "" || s.length > 32 || !/^(\d+\.?\d*|\.\d+)$/.test(s)) return null;
  const [whole = "", frac = ""] = s.split(".");
  return rat(BigInt(`${whole}${frac}` || "0"), TEN ** BigInt(frac.length));
}

/** Formats a fraction as a decimal with at most `maxFrac` fractional digits (rounded half up). `exact` is false when rounding lost information. */
export function ratToDecimalString(r: Rat, maxFrac = 6): { text: string; exact: boolean } {
  const scale = TEN ** BigInt(maxFrac);
  const exact = (r.n * scale) % r.d === ZERO;
  const scaled = (r.n * scale * BigInt(2) + r.d) / (r.d * BigInt(2));
  if (scaled === ZERO && r.n > ZERO) return { text: `< ${maxFrac > 0 ? "0." + "0".repeat(maxFrac - 1) + "1" : "1"}`, exact: false };
  const whole = scaled / scale;
  const frac = (scaled % scale).toString().padStart(maxFrac, "0").replace(/0+$/, "");
  return { text: formatBig(whole) + (frac ? `.${frac}` : ""), exact };
}

// ---------------------------------------------------------------------------
// Bits and bytes
// ---------------------------------------------------------------------------

export const BITS_PER_BYTE = 8;

export interface BitsToBytesResult {
  bytes: string;
  exact: boolean;
  wholeBytes: bigint;
  leftoverBits: number;
}

export function bitsToBytes(bits: bigint): BitsToBytesResult {
  const whole = bits / BigInt(BITS_PER_BYTE);
  const leftover = Number(bits % BigInt(BITS_PER_BYTE));
  const { text, exact } = ratToDecimalString(rat(bits, BigInt(BITS_PER_BYTE)), 3);
  return { bytes: text, exact, wholeBytes: whole, leftoverBits: leftover };
}

export function bytesToBits(bytes: bigint): bigint {
  return bytes * BigInt(BITS_PER_BYTE);
}

/** Parses a whole, non-negative count (bits or bytes). */
export function parseCount(input: string, max = BigInt("1000000000000000000")): { ok: true; value: bigint } | { ok: false; error: string } {
  const s = input.trim().replace(/,/g, "");
  if (s === "") return { ok: false, error: "Type a whole number." };
  if (!/^\d+$/.test(s)) return { ok: false, error: "Use a whole, non-negative number (digits 0–9 only)." };
  const value = BigInt(s);
  if (value > max) return { ok: false, error: "That number is larger than this calculator handles." };
  return { ok: true, value };
}

/** Number of distinct values `n` bits can represent: 2ⁿ. */
export function combinations(bits: number): bigint {
  return BigInt(1) << BigInt(bits);
}

// ---------------------------------------------------------------------------
// Data units (SI decimal and IEC binary)
// ---------------------------------------------------------------------------

export type UnitFamily = "base" | "decimal" | "binary";

export interface DataUnit {
  id: string;
  symbol: string;
  name: string;
  family: UnitFamily;
  /** Exact size in bits — the common denominator that keeps every conversion exact. */
  bits: bigint;
  /** Exponent of the prefix (kilo = 1, mega = 2 ...). 0 for bit/byte. */
  power: number;
}

const B8 = BigInt(8);
const K1000 = BigInt(1000);
const K1024 = BigInt(1024);

const decimalNames = ["kilobyte", "megabyte", "gigabyte", "terabyte", "petabyte"];
const decimalSymbols = ["kB", "MB", "GB", "TB", "PB"];
const binaryNames = ["kibibyte", "mebibyte", "gibibyte", "tebibyte", "pebibyte"];
const binarySymbols = ["KiB", "MiB", "GiB", "TiB", "PiB"];

export const DATA_UNITS: DataUnit[] = [
  { id: "bit", symbol: "bit", name: "bit", family: "base", bits: ONE, power: 0 },
  { id: "B", symbol: "B", name: "byte", family: "base", bits: B8, power: 0 },
  ...decimalSymbols.map(
    (symbol, i): DataUnit => ({ id: symbol, symbol, name: decimalNames[i]!, family: "decimal", bits: B8 * K1000 ** BigInt(i + 1), power: i + 1 }),
  ),
  ...binarySymbols.map(
    (symbol, i): DataUnit => ({ id: symbol, symbol, name: binaryNames[i]!, family: "binary", bits: B8 * K1024 ** BigInt(i + 1), power: i + 1 }),
  ),
];

export function getUnit(id: string): DataUnit {
  const unit = DATA_UNITS.find((u) => u.id === id);
  if (!unit) throw new Error(`Unknown unit ${id}`);
  return unit;
}

export function unitsInFamily(family: UnitFamily): DataUnit[] {
  return DATA_UNITS.filter((u) => u.family === family);
}

/** Units offered by the converter: bit/byte plus the chosen family. */
export function converterUnits(system: "decimal" | "binary"): DataUnit[] {
  return DATA_UNITS.filter((u) => u.family === "base" || u.family === system);
}

/** How many bytes one unit holds, as text ("1,000,000" or "1/8"). */
export function bytesPerUnitText(unit: DataUnit): string {
  return unit.bits === ONE ? "1/8" : formatBig(unit.bits / B8);
}

/** The exact gap between a binary unit and its decimal twin, e.g. GiB vs GB = 7.37%. */
export function prefixGapPercent(power: number): number {
  return ((Number(K1024 ** BigInt(power)) / Number(K1000 ** BigInt(power))) - 1) * 100;
}

export type UnitConversion =
  | {
      ok: true;
      result: string;
      exact: boolean;
      /** Worked steps through bits or bytes. */
      steps: string[];
      resultRat: Rat;
    }
  | { ok: false; error: string };

/** Converts `input` (a plain decimal) from one unit to another, exactly, showing the arithmetic. */
export function convertUnits(input: string, from: DataUnit, to: DataUnit, maxFrac = 6): UnitConversion {
  const value = parseDecimalToRat(input);
  if (!value) return { ok: false, error: "Enter a non-negative number, for example 4 or 2.5." };

  const useBits = from.id === "bit" || to.id === "bit";
  const baseBits = useBits ? ONE : B8;
  const baseName = useBits ? "bits" : "bytes";
  const fromPer = from.bits / baseBits;
  const toPer = to.bits / baseBits;

  const inBase = ratMul(value, rat(fromPer));
  const resultRat = ratDiv(inBase, rat(toPer));
  const { text: result, exact } = ratToDecimalString(resultRat, maxFrac);
  const inputShown = ratToDecimalString(value, 12).text;
  const inBaseShown = ratToDecimalString(inBase, maxFrac).text;

  const steps: string[] = [];
  if (from.id === to.id) {
    steps.push(`Same unit — ${inputShown} ${from.symbol} = ${result} ${to.symbol}.`);
  } else {
    steps.push(`To ${baseName}: ${inputShown} ${from.symbol} × ${formatBig(fromPer)} ${baseName}/${from.symbol} = ${inBaseShown} ${baseName}`);
    steps.push(`To ${to.symbol}: ${inBaseShown} ${baseName} ÷ ${formatBig(toPer)} ${baseName}/${to.symbol} = ${exact ? "" : "≈ "}${result} ${to.symbol}`);
  }
  return { ok: true, result, exact, steps, resultRat };
}

/** Expresses an exact byte count in a given unit. */
export function bytesInUnit(bytes: bigint, unit: DataUnit, maxFrac = 3): { text: string; exact: boolean } {
  return ratToDecimalString(rat(bytes * B8, unit.bits), maxFrac);
}

const HUMAN_BINARY_UNITS: { symbol: string; power: number }[] = [
  { symbol: "B", power: 0 },
  { symbol: "KiB", power: 1 },
  { symbol: "MiB", power: 2 },
  { symbol: "GiB", power: 3 },
  { symbol: "TiB", power: 4 },
  { symbol: "PiB", power: 5 },
  { symbol: "EiB", power: 6 },
];

/** "4294967296" bytes -> "4 GiB". Picks the largest IEC unit that keeps the number ≥ 1. */
export function humanBinarySize(bytes: bigint): string {
  let chosen = HUMAN_BINARY_UNITS[0]!;
  for (const u of HUMAN_BINARY_UNITS) {
    if (bytes >= K1024 ** BigInt(u.power)) chosen = u;
  }
  const { text } = ratToDecimalString(rat(bytes, K1024 ** BigInt(chosen.power)), 2);
  return `${text} ${chosen.symbol}`;
}

const HUMAN_DECIMAL_UNITS = [
  { symbol: "B", power: 0 },
  { symbol: "kB", power: 1 },
  { symbol: "MB", power: 2 },
  { symbol: "GB", power: 3 },
  { symbol: "TB", power: 4 },
  { symbol: "PB", power: 5 },
];

/** Same idea for decimal (SI) units. */
export function humanDecimalSize(bytes: Rat): string {
  let chosen = HUMAN_DECIMAL_UNITS[0]!;
  for (const u of HUMAN_DECIMAL_UNITS) {
    if (bytes.n >= bytes.d * K1000 ** BigInt(u.power)) chosen = u;
  }
  const { text } = ratToDecimalString(ratDiv(bytes, rat(K1000 ** BigInt(chosen.power))), 2);
  return `${text} ${chosen.symbol}`;
}

// ---------------------------------------------------------------------------
// Memory & storage labs
// ---------------------------------------------------------------------------

export type CapacityConvention = "decimal" | "binary";

export interface CapacityView {
  bytes: bigint;
  /** The label interpreted with the other convention, for the side-by-side note. */
  decimalRows: { symbol: string; text: string; exact: boolean }[];
  binaryRows: { symbol: string; text: string; exact: boolean }[];
}

export function capacityView(bytes: bigint): CapacityView {
  const row = (u: DataUnit) => ({ symbol: u.symbol, ...bytesInUnit(bytes, u, 3) });
  return {
    bytes,
    decimalRows: ["B", "kB", "MB", "GB", "TB"].map((id) => row(getUnit(id))),
    binaryRows: ["KiB", "MiB", "GiB", "TiB"].map((id) => row(getUnit(id))),
  };
}

/** Bytes for a labelled size (e.g. 8 "GB" under the decimal convention, or 8 "GiB" under the binary one). */
export function labelToBytes(value: number, unitFamily: "GB" | "TB", convention: CapacityConvention): bigint {
  const power = unitFamily === "GB" ? 3 : 4;
  const base = convention === "decimal" ? K1000 : K1024;
  return BigInt(Math.round(value)) * base ** BigInt(power);
}

export interface StoragePreset {
  id: string;
  label: string;
  value: number;
  unit: "GB" | "TB";
  kind: "SSD" | "HDD";
}

export const STORAGE_PRESETS: StoragePreset[] = [
  { id: "ssd-256", label: "256 GB SSD", value: 256, unit: "GB", kind: "SSD" },
  { id: "ssd-512", label: "512 GB SSD", value: 512, unit: "GB", kind: "SSD" },
  { id: "ssd-1tb", label: "1 TB SSD", value: 1, unit: "TB", kind: "SSD" },
  { id: "hdd-2tb", label: "2 TB HDD", value: 2, unit: "TB", kind: "HDD" },
];

export const RAM_PRESETS = [4, 8, 16, 32];

/** How many bytes the label loses when a binary-based tool reports a decimal-labelled size, as a percentage. */
export function reportedShortfallPercent(labelBytes: bigint): number {
  // Compare the same byte count expressed in its natural decimal unit vs the binary twin's numeric value.
  const power = labelBytes >= K1000 ** BigInt(4) ? 4 : 3;
  const dec = Number(labelBytes) / Number(K1000 ** BigInt(power));
  const bin = Number(labelBytes) / Number(K1024 ** BigInt(power));
  return ((dec - bin) / dec) * 100;
}

export interface StorageScenario {
  id: string;
  label: string;
  size: string;
  unit: string;
  count: string;
  note: string;
}

/** Illustrative values only — real file sizes vary enormously. */
export const STORAGE_SCENARIOS: StorageScenario[] = [
  { id: "photos", label: "Photos", size: "3", unit: "MB", count: "2000", note: "Illustrative: photo sizes vary with resolution and compression." },
  { id: "documents", label: "Documents", size: "200", unit: "kB", count: "5000", note: "Illustrative: text documents are often small; some contain images and are much larger." },
  { id: "videos", label: "Videos", size: "1.5", unit: "GB", count: "20", note: "Illustrative: video size depends on length, resolution, and compression." },
  { id: "software", label: "Software", size: "2", unit: "GB", count: "15", note: "Illustrative: installed applications range from a few MB to many GB." },
  { id: "backups", label: "Backups", size: "50", unit: "GB", count: "12", note: "Illustrative: a backup's size depends on what is included and whether it is compressed or incremental." },
];

export type StorageTotal =
  | { ok: true; totalInUnit: string; totalBytes: Rat; human: string; steps: string[] }
  | { ok: false; error: string };

export function storageTotal(sizeInput: string, unit: DataUnit, countInput: string): StorageTotal {
  const size = parseDecimalToRat(sizeInput);
  if (!size) return { ok: false, error: "Enter a file size such as 5 or 2.5." };
  const count = parseCount(countInput, BigInt("1000000000"));
  if (!count.ok) return { ok: false, error: `Number of files: ${count.error}` };
  const total = ratMul(size, rat(count.value));
  const totalInUnit = ratToDecimalString(total, 3).text;
  const totalBytes = ratMul(total, rat(unit.bits, B8));
  const steps = [
    `${ratToDecimalString(size, 6).text} ${unit.symbol} × ${formatBig(count.value)} files = ${totalInUnit} ${unit.symbol}`,
  ];
  return { ok: true, totalInUnit: `${totalInUnit} ${unit.symbol}`, totalBytes, human: unit.family === "binary" ? humanBinarySize(totalBytes.n / totalBytes.d) : humanDecimalSize(totalBytes), steps };
}

// ---------------------------------------------------------------------------
// Data transfer rates
// ---------------------------------------------------------------------------

export interface RateUnit {
  id: string;
  symbol: string;
  name: string;
  /** Bits moved per second by one unit of this rate. */
  bitsPerSecond: bigint;
  family: "bits" | "bytes";
}

export const RATE_UNITS: RateUnit[] = [
  { id: "bps", symbol: "bps", name: "bits per second", bitsPerSecond: ONE, family: "bits" },
  { id: "kbps", symbol: "kbps", name: "kilobits per second", bitsPerSecond: K1000, family: "bits" },
  { id: "Mbps", symbol: "Mbps", name: "megabits per second", bitsPerSecond: K1000 ** BigInt(2), family: "bits" },
  { id: "Gbps", symbol: "Gbps", name: "gigabits per second", bitsPerSecond: K1000 ** BigInt(3), family: "bits" },
  { id: "Bps", symbol: "B/s", name: "bytes per second", bitsPerSecond: B8, family: "bytes" },
  { id: "kBps", symbol: "kB/s", name: "kilobytes per second", bitsPerSecond: B8 * K1000, family: "bytes" },
  { id: "MBps", symbol: "MB/s", name: "megabytes per second", bitsPerSecond: B8 * K1000 ** BigInt(2), family: "bytes" },
  { id: "GBps", symbol: "GB/s", name: "gigabytes per second", bitsPerSecond: B8 * K1000 ** BigInt(3), family: "bytes" },
];

export function getRateUnit(id: string): RateUnit {
  const unit = RATE_UNITS.find((u) => u.id === id);
  if (!unit) throw new Error(`Unknown rate unit ${id}`);
  return unit;
}

export type RateConversion = { ok: true; result: string; exact: boolean; resultRat: Rat } | { ok: false; error: string };

export function convertRate(input: string, from: RateUnit, to: RateUnit, maxFrac = 6): RateConversion {
  const value = parseDecimalToRat(input);
  if (!value) return { ok: false, error: "Enter a non-negative number, for example 100." };
  const resultRat = ratDiv(ratMul(value, rat(from.bitsPerSecond)), rat(to.bitsPerSecond));
  const { text, exact } = ratToDecimalString(resultRat, maxFrac);
  return { ok: true, result: text, exact, resultRat };
}

/** "Sun-scale" durations shown in friendly units: 40 s, 3 min 20 s, 2 h 5 min ... */
export function humanDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "—";
  if (seconds === 0) return "0 seconds";
  if (seconds < 1) return `${seconds < 0.001 ? "< 1 millisecond" : `${(seconds * 1000).toFixed(seconds < 0.01 ? 1 : 0)} milliseconds`}`;
  if (seconds < 60) {
    const rounded = Math.round(seconds * 10) / 10;
    return `${rounded} second${rounded === 1 ? "" : "s"}`;
  }
  const total = Math.round(seconds);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const parts: string[] = [];
  if (days) parts.push(`${days} d`);
  if (hours) parts.push(`${hours} h`);
  if (minutes) parts.push(`${minutes} min`);
  if (secs && !days) parts.push(`${secs} s`);
  return parts.join(" ");
}

export type TransferCalc =
  | {
      ok: true;
      rateBitsPerSecond: Rat;
      /** The connection speed expressed as bytes per second, in MB/s. */
      rateMBps: string;
      sizeBits: Rat;
      seconds: number;
      secondsText: string;
      duration: string;
      steps: string[];
    }
  | { ok: false; error: string };

/**
 * Idealized transfer time: size ÷ rate. `efficiencyPercent` (default
 * 100) lets a student see how lower effective throughput stretches the
 * time — it is an illustration, not a prediction.
 */
export function transferTime(sizeInput: string, sizeUnit: DataUnit, rateInput: string, rateUnit: RateUnit, efficiencyPercent = 100): TransferCalc {
  const size = parseDecimalToRat(sizeInput);
  if (!size) return { ok: false, error: "Enter a file size such as 500 or 1.5." };
  const rate = parseDecimalToRat(rateInput);
  if (!rate) return { ok: false, error: "Enter a connection speed such as 100." };
  if (rate.n === ZERO) return { ok: false, error: "A connection speed of 0 never finishes — enter a speed above 0." };
  const eff = Math.min(100, Math.max(1, Math.round(efficiencyPercent)));

  const sizeBits = ratMul(size, rat(sizeUnit.bits));
  const nominalBps = ratMul(rate, rat(rateUnit.bitsPerSecond));
  const effectiveBps = ratMul(nominalBps, rat(BigInt(eff), BigInt(100)));
  const secondsRat = ratDiv(sizeBits, effectiveBps);
  const seconds = ratToNumber(secondsRat);

  const rateMBpsText = ratToDecimalString(ratDiv(effectiveBps, rat(getRateUnit("MBps").bitsPerSecond)), 6).text;
  const sizeMB = ratToDecimalString(ratDiv(sizeBits, rat(getUnit("MB").bits)), 6).text;
  const secondsText = ratToDecimalString(secondsRat, 3).text;

  const steps: string[] = [];
  if (rateUnit.family === "bits") {
    const nominalMBps = ratToDecimalString(ratDiv(nominalBps, rat(getRateUnit("MBps").bitsPerSecond)), 6).text;
    steps.push(`Bits → bytes: ${ratToDecimalString(rate, 6).text} ${rateUnit.symbol} ÷ 8 = ${nominalMBps} MB/s (there are 8 bits in a byte)`);
  } else {
    steps.push(`Rate: ${ratToDecimalString(rate, 6).text} ${rateUnit.symbol} — already in bytes per second`);
  }
  if (eff < 100) steps.push(`Real-world efficiency ${eff}% → effective speed ≈ ${rateMBpsText} MB/s`);
  steps.push(`Size: ${ratToDecimalString(size, 6).text} ${sizeUnit.symbol} = ${sizeMB} MB`);
  steps.push(`Time: ${sizeMB} MB ÷ ${rateMBpsText} MB/s ≈ ${secondsText} seconds`);

  return { ok: true, rateBitsPerSecond: effectiveBps, rateMBps: rateMBpsText, sizeBits, seconds, secondsText, duration: humanDuration(seconds), steps };
}

// ---------------------------------------------------------------------------
// Practical IT calculators (Technical)
// ---------------------------------------------------------------------------

/** How many whole files of `fileBytes` fit in `capacityBytes` (ignores file-system overhead). */
export function filesThatFit(capacityBytes: Rat, fileBytes: Rat): bigint {
  const q = ratDiv(capacityBytes, fileBytes);
  return q.n / q.d;
}

/** Fewest address bits needed to give every byte in `bytes` its own address (byte-addressable memory). */
export function addressBitsNeeded(bytes: bigint): number {
  if (bytes <= ONE) return 0;
  return (bytes - ONE).toString(2).length;
}

/** Size of a stream of `mbps` megabits/second lasting `minutes`, in decimal bytes. */
export function streamBytes(mbps: Rat, minutes: Rat): Rat {
  const bits = ratMul(ratMul(mbps, rat(K1000 ** BigInt(2))), ratMul(minutes, rat(BigInt(60))));
  return ratDiv(bits, rat(B8));
}

// ---------------------------------------------------------------------------
// Memory addresses
// ---------------------------------------------------------------------------

export const ADDRESS_WIDTHS = [8, 16, 32, 64] as const;
export type AddressWidth = (typeof ADDRESS_WIDTHS)[number];

export function formatHexAddress(value: bigint, widthBits: number): string {
  return `0x${value.toString(16).toUpperCase().padStart(Math.ceil(widthBits / 4), "0")}`;
}

export function formatBinaryAddress(value: bigint, widthBits: number): string {
  return groupFromRight(value.toString(2).padStart(widthBits, "0"), 4);
}

export function addressSequence(base: bigint, stride: number, count: number): bigint[] {
  return Array.from({ length: count }, (_, i) => base + BigInt(stride * i));
}

export interface AddressRange {
  count: bigint;
  highest: bigint;
  highestHex: string;
  /** Memory size if every address names one byte. */
  byteAddressable: string;
}

export function addressRange(addressBits: number): AddressRange {
  const count = combinations(addressBits);
  const highest = count - ONE;
  return {
    count,
    highest,
    highestHex: `0x${highest.toString(16).toUpperCase()}`,
    byteAddressable: humanBinarySize(count),
  };
}

export interface AddressSplit {
  tag: string;
  index: string;
  offset: string;
  tagBits: number;
  indexBits: number;
  offsetBits: number;
}

export function isPowerOfTwo(n: number): boolean {
  return Number.isInteger(n) && n > 0 && (n & (n - 1)) === 0;
}

export function log2Exact(n: number): number {
  return Math.round(Math.log2(n));
}

/** Splits an address into tag | index | offset for a cache with power-of-two line size and set count. */
export function splitAddress(value: bigint, totalBits: number, lineSizeBytes: number, setCount: number): AddressSplit {
  const offsetBits = log2Exact(lineSizeBytes);
  const indexBits = log2Exact(setCount);
  const tagBits = Math.max(0, totalBits - indexBits - offsetBits);
  const binary = value.toString(2).padStart(totalBits, "0");
  return {
    tag: binary.slice(0, tagBits),
    index: binary.slice(tagBits, tagBits + indexBits),
    offset: binary.slice(tagBits + indexBits),
    tagBits,
    indexBits,
    offsetBits,
  };
}

// ---------------------------------------------------------------------------
// Signed integers & two's complement
// ---------------------------------------------------------------------------

export const SIGNED_WIDTHS = [4, 8, 16] as const;
export type SignedWidth = (typeof SIGNED_WIDTHS)[number];

export function signedRange(bits: number): { min: bigint; max: bigint } {
  const half = BigInt(1) << BigInt(bits - 1);
  return { min: -half, max: half - ONE };
}

/** Value of an N-bit two's-complement pattern: the top bit is worth −2^(N−1). */
export function fromTwosComplement(pattern: string): bigint {
  const bits = pattern.length;
  const unsigned = BigInt(`0b${pattern}`);
  return pattern[0] === "1" ? unsigned - (BigInt(1) << BigInt(bits)) : unsigned;
}

export type TwosResult = { ok: true; pattern: string; steps: string[] } | { ok: false; error: string };

export function toTwosComplement(value: bigint, bits: number): TwosResult {
  const { min, max } = signedRange(bits);
  if (value < min || value > max) {
    return { ok: false, error: `${value} does not fit in ${bits} signed bits. The ${bits}-bit range is ${min} to +${max}.` };
  }
  const modulus = BigInt(1) << BigInt(bits);
  const pattern = (value < ZERO ? value + modulus : value).toString(2).padStart(bits, "0");
  const steps: string[] = [];
  if (value >= ZERO) {
    steps.push(`Positive (or zero): write ${value} as ${bits}-bit binary → ${pattern}. The leftmost (sign) bit is 0.`);
  } else {
    const magnitude = (-value).toString(2).padStart(bits, "0");
    const inverted = magnitude
      .split("")
      .map((c) => (c === "0" ? "1" : "0"))
      .join("");
    steps.push(`Write the magnitude ${-value} as ${bits}-bit binary → ${magnitude}`);
    steps.push(`Invert every bit (0 ↔ 1) → ${inverted}`);
    steps.push(`Add 1 → ${pattern}`);
    const signBitValue = BigInt(1) << BigInt(bits - 1);
    steps.push(`Check: the sign bit is 1 (worth −${signBitValue}) and the remaining bits add up so the total is ${value}.`);
  }
  return { ok: true, pattern, steps };
}

/** Adds or subtracts 1 with wrap-around — a two-line demo of why the range has edges, not a CPU emulator. */
export function wrapStep(pattern: string, delta: 1 | -1): string {
  const bits = pattern.length;
  const modulus = BigInt(1) << BigInt(bits);
  const unsigned = BigInt(`0b${pattern}`);
  const next = (((unsigned + BigInt(delta)) % modulus) + modulus) % modulus;
  return next.toString(2).padStart(bits, "0");
}

/** Signed-decimal parse used by the two's-complement input and practice answers. */
export function parseSignedDecimal(raw: string): { ok: true; value: bigint } | { ok: false; error: string } {
  const s = raw.trim().replace(/[\s,_]/g, "").replace("−", "-");
  if (s === "") return { ok: false, error: "Type a whole number, for example -5." };
  if (!/^[+-]?\d+$/.test(s)) return { ok: false, error: "Use a whole number with an optional minus sign, for example -5 or 90." };
  if (s.replace(/^[+-]/, "").length > 6) return { ok: false, error: "That number is too large for this section — try a smaller one." };
  return { ok: true, value: BigInt(s.replace(/^\+/, "")) };
}

// ---------------------------------------------------------------------------
// Practice problem generator
// ---------------------------------------------------------------------------

export type ProblemKind = "dec2bin" | "bin2dec" | "hex2dec" | "bin2hex" | "bin2oct" | "dec2hex" | "oct2dec" | "dec2twos" | "twos2dec";

export interface Problem {
  id: string;
  kind: ProblemKind;
  /** Question text, e.g. "Convert 37₁₀ to binary." */
  question: string;
  /** Base the learner types their answer in ("signed" for a signed decimal). */
  answerIn: BaseId | "twos" | "signed";
  /** The canonical answer, as text. */
  answer: string;
  steps: string[];
  minLevel: Level;
}

type Rng = () => number;

function randInt(rng: Rng, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function pick<T>(rng: Rng, items: T[]): T {
  return items[Math.floor(rng() * items.length)]!;
}

const PROBLEM_KINDS: { kind: ProblemKind; minLevel: Level }[] = [
  { kind: "dec2bin", minLevel: "beginner" },
  { kind: "bin2dec", minLevel: "beginner" },
  { kind: "hex2dec", minLevel: "intermediate" },
  { kind: "bin2hex", minLevel: "intermediate" },
  { kind: "bin2oct", minLevel: "intermediate" },
  { kind: "dec2hex", minLevel: "intermediate" },
  { kind: "oct2dec", minLevel: "intermediate" },
  { kind: "dec2twos", minLevel: "technical" },
  { kind: "twos2dec", minLevel: "technical" },
];

export function problemKindsFor(level: Level): ProblemKind[] {
  return PROBLEM_KINDS.filter((k) => levelAtLeast(level, k.minLevel)).map((k) => k.kind);
}

function binaryExpansionSteps(bin: string): string[] {
  const parts = placeValueBreakdown(bin, "binary");
  const shown = parts.map((p) => `${p.char}×${formatBig(p.place)}`).join(" + ");
  const sum = parts.filter((p) => p.contribution > ZERO).map((p) => formatBig(p.contribution)).join(" + ");
  return [`Multiply each bit by its place value: ${shown}`, `Add the contributions: ${sum || "0"} = ${formatBig(breakdownTotal(parts))}`];
}

function divisionText(n: number, radix: 2 | 8 | 16): string[] {
  const steps = divisionSteps(n, radix);
  return [
    ...steps.map((s) => `${s.dividend} ÷ ${s.divisor} = ${s.quotient} remainder ${s.remainder}${s.remainder > 9 ? ` (${s.digit})` : ""}`),
    `Read the remainders from the bottom up: ${divisionResult(steps)}`,
  ];
}

/** Builds one fresh, exact problem appropriate to `level`. `rng` is injectable so tests are deterministic. */
export function generateProblem(level: Level, rng: Rng = Math.random, avoid?: ProblemKind): Problem {
  const kinds = problemKindsFor(level);
  const candidates = avoid && kinds.length > 1 ? kinds.filter((k) => k !== avoid) : kinds;
  const kind = pick(rng, candidates);
  const stamp = Math.floor(rng() * 1e9).toString(36);
  const technical = level === "technical";
  const meta = PROBLEM_KINDS.find((k) => k.kind === kind)!;

  switch (kind) {
    case "dec2bin": {
      const n = randInt(rng, 5, technical ? 255 : level === "intermediate" ? 127 : 63);
      const bin = n.toString(2);
      return { id: `dec2bin-${n}-${stamp}`, kind, question: `Convert ${n}₁₀ to binary.`, answerIn: "binary", answer: bin, steps: divisionText(n, 2), minLevel: meta.minLevel };
    }
    case "bin2dec": {
      const bits = level === "beginner" ? randInt(rng, 4, 6) : randInt(rng, 6, technical ? 10 : 8);
      const n = randInt(rng, 1 << (bits - 1), (1 << bits) - 1);
      const bin = n.toString(2);
      return { id: `bin2dec-${bin}-${stamp}`, kind, question: `Convert ${bin}₂ to decimal.`, answerIn: "decimal", answer: String(n), steps: binaryExpansionSteps(bin), minLevel: meta.minLevel };
    }
    case "hex2dec": {
      const n = randInt(rng, 16, technical ? 4095 : 255);
      const hex = n.toString(16).toUpperCase();
      const parts = placeValueBreakdown(hex, "hex");
      const expr = parts.map((p) => `${p.digitValue} × 16${superscript(p.power)}`).join(" + ");
      const nums = parts.map((p) => formatBig(p.contribution)).join(" + ");
      return {
        id: `hex2dec-${hex}-${stamp}`,
        kind,
        question: `Convert ${hex}₁₆ to decimal.`,
        answerIn: "decimal",
        answer: String(n),
        steps: [`Convert each hex digit to a number (A = 10, B = 11, … F = 15): ${parts.map((p) => `${p.char} = ${p.digitValue}`).join(", ")}`, `Multiply by place values: ${expr}`, `Add: ${nums} = ${n}`],
        minLevel: meta.minLevel,
      };
    }
    case "bin2hex": {
      const n = randInt(rng, 16, technical ? 65535 : 255);
      const bin = n.toString(2).padStart(n > 255 ? 16 : 8, "0");
      const groups = groupBits(bin, 4);
      return {
        id: `bin2hex-${bin}-${stamp}`,
        kind,
        question: `Convert ${groupFromRight(bin, 4)}₂ to hexadecimal.`,
        answerIn: "hex",
        answer: n.toString(16).toUpperCase().padStart(bin.length / 4, "0"),
        steps: [`Group the bits in fours: ${groups.map((g) => g.bits).join(" ")}`, ...groups.map((g) => `${g.bits} = ${g.value} = ${g.digit}`), `Join the digits: ${groups.map((g) => g.digit).join("")}`],
        minLevel: meta.minLevel,
      };
    }
    case "bin2oct": {
      const n = randInt(rng, 8, technical ? 4095 : 511);
      const bin = n.toString(2).padStart(Math.ceil(n.toString(2).length / 3) * 3, "0");
      const groups = groupBits(bin, 3);
      return {
        id: `bin2oct-${bin}-${stamp}`,
        kind,
        question: `Convert ${groupFromRight(bin, 3)}₂ to octal.`,
        answerIn: "octal",
        answer: n.toString(8),
        steps: [`Group the bits in threes: ${groups.map((g) => g.bits).join(" ")}`, ...groups.map((g) => `${g.bits} = ${g.digit}`), `Join the digits: ${groups.map((g) => g.digit).join("")}`],
        minLevel: meta.minLevel,
      };
    }
    case "dec2hex": {
      const n = randInt(rng, 16, technical ? 4095 : 255);
      return { id: `dec2hex-${n}-${stamp}`, kind, question: `Convert ${n}₁₀ to hexadecimal.`, answerIn: "hex", answer: n.toString(16).toUpperCase(), steps: divisionText(n, 16), minLevel: meta.minLevel };
    }
    case "oct2dec": {
      const n = randInt(rng, 8, technical ? 4095 : 511);
      const oct = n.toString(8);
      const parts = placeValueBreakdown(oct, "octal");
      return {
        id: `oct2dec-${oct}-${stamp}`,
        kind,
        question: `Convert ${oct}₈ to decimal.`,
        answerIn: "decimal",
        answer: String(n),
        steps: [`Multiply by place values: ${parts.map((p) => `${p.digitValue} × 8${superscript(p.power)}`).join(" + ")}`, `Add: ${parts.map((p) => formatBig(p.contribution)).join(" + ")} = ${n}`],
        minLevel: meta.minLevel,
      };
    }
    case "dec2twos": {
      const n = -randInt(rng, 1, 127);
      const t = toTwosComplement(BigInt(n), 8);
      return {
        id: `dec2twos-${n}-${stamp}`,
        kind,
        question: `Write ${n} as an 8-bit two's-complement pattern.`,
        answerIn: "twos",
        answer: t.ok ? t.pattern : "",
        steps: t.ok ? t.steps : [],
        minLevel: meta.minLevel,
      };
    }
    case "twos2dec": {
      const n = randInt(rng, 128, 255); // leading 1 → negative
      const pattern = n.toString(2);
      const value = fromTwosComplement(pattern);
      return {
        id: `twos2dec-${pattern}-${stamp}`,
        kind,
        question: `What signed decimal value does the 8-bit two's-complement pattern ${pattern} represent?`,
        answerIn: "signed",
        answer: value.toString(),
        steps: [
          `The sign bit (leftmost) is 1, so the value is negative. The sign bit is worth −128.`,
          `Add the other bits' place values: ${pattern
            .slice(1)
            .split("")
            .map((b, i) => (b === "1" ? String(64 >> i) : null))
            .filter(Boolean)
            .join(" + ") || "0"} = ${n - 128}`,
          `−128 + ${n - 128} = ${value}`,
        ],
        minLevel: meta.minLevel,
      };
    }
  }
}

export type AnswerCheck = { correct: true } | { correct: false; message: string };

/** Checks a typed answer exactly. Bad input returns the same educational message the converter would. */
export function checkProblemAnswer(problem: Problem, input: string): AnswerCheck {
  if (problem.answerIn === "signed") {
    const parsed = parseSignedDecimal(input);
    if (!parsed.ok) return { correct: false, message: parsed.error };
    return parsed.value.toString() === problem.answer ? { correct: true } : { correct: false, message: "Not quite — check the sign and each place value." };
  }
  if (problem.answerIn === "twos") {
    const cleaned = input.trim().replace(/[\s_]/g, "").replace(/^0b/i, "");
    if (cleaned === "") return { correct: false, message: "Type the 8-bit pattern." };
    const bad = cleaned.split("").find((c) => c !== "0" && c !== "1");
    if (bad) return { correct: false, message: invalidDigitMessage("binary", bad) };
    if (cleaned.length !== 8) return { correct: false, message: `A two's-complement answer here uses exactly 8 bits — you gave ${cleaned.length}.` };
    return cleaned === problem.answer ? { correct: true } : { correct: false, message: "Not quite — try: magnitude in binary, invert every bit, then add 1." };
  }
  const parsed = parseInBase(input, problem.answerIn);
  if (!parsed.ok) return { correct: false, message: parsed.error };
  const expected = parseInBase(problem.answer, problem.answerIn);
  if (expected.ok && parsed.value === expected.value) return { correct: true };
  return { correct: false, message: "Not quite — re-check your working, or press “Show steps”." };
}
