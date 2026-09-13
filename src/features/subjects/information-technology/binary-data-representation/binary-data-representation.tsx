"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, RotateCcw, ArrowRightLeft, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { BitToggleGrid } from "./components/bit-toggle-grid";
import {
  emptyBits,
  bitsToDecimal,
  decimalToBits,
  bitsToBinaryString,
  parseBinaryString,
  toggleBit,
  CHARACTER_SET,
  randomTargetDecimal,
  randomBits,
  randomCharacterEntry,
  generateChallengeRound,
  type Bits,
  type LabMode,
  type CharacterEntry,
  type ChallengeRound,
} from "./model";
import { LAB_MODES } from "./model";

const CHALLENGE_ROUNDS = 8;

function decimalReadout(bits: Bits) {
  return bitsToDecimal(bits);
}

export function BinaryDataRepresentation() {
  const [mode, setMode] = useState<LabMode>("explore");

  return (
    <div className="flex flex-col gap-6">
      {/* Mode picker */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Binary Data Laboratory mode">
        {LAB_MODES.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={mode === m.id}
            onClick={() => setMode(m.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              mode === m.id
                ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-ink-soft dark:text-bone-soft">
        {LAB_MODES.find((m) => m.id === mode)!.blurb}
      </p>

      <div className="rounded-card border border-line bg-paper p-3 dark:border-line-dark dark:bg-chalkboard sm:p-5">
        {mode === "explore" && <ExploreMode />}
        {mode === "build" && <BuildMode />}
        {mode === "decode" && <DecodeMode />}
        {mode === "encode" && <EncodeMode />}
        {mode === "challenge" && <ChallengeMode />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Free Explore
// ---------------------------------------------------------------------------

function ExploreMode() {
  const [bits, setBits] = useState<Bits>(() => decimalToBits(37));
  const [decimalInput, setDecimalInput] = useState("37");
  const [binaryInput, setBinaryInput] = useState("00100101");

  const decimal = decimalReadout(bits);

  const applyBits = (next: Bits) => {
    setBits(next);
    setDecimalInput(String(decimalReadout(next)));
    setBinaryInput(bitsToBinaryString(next));
  };

  const handleToggle = (index: number) => applyBits(toggleBit(bits, index));

  const handleDecimalSubmit = () => {
    const parsed = Number(decimalInput);
    if (Number.isNaN(parsed)) return;
    applyBits(decimalToBits(parsed));
  };

  const handleBinarySubmit = () => {
    const parsed = parseBinaryString(binaryInput);
    if (!parsed) return;
    applyBits(parsed);
  };

  return (
    <div className="flex flex-col gap-6">
      <BitToggleGrid bits={bits} onToggle={handleToggle} />

      <div className="flex flex-wrap items-center justify-center gap-3 rounded-card bg-ink/[0.03] p-4 dark:bg-bone/[0.05]">
        <span className="font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">Binary</span>
        <span className="font-mono text-2xl font-semibold text-ink dark:text-bone">{bitsToBinaryString(bits)}</span>
        <ArrowRightLeft className="h-4 w-4 text-ink-soft dark:text-bone-soft" />
        <span className="font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">Decimal</span>
        <span className="font-display text-3xl font-semibold text-subject-it">{decimal}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="decimal-input" className="text-xs font-medium text-ink-soft dark:text-bone-soft">
            Type a decimal number (0–255) to see its binary
          </label>
          <div className="flex gap-2">
            <input
              id="decimal-input"
              type="number"
              inputMode="numeric"
              min={0}
              max={255}
              value={decimalInput}
              onChange={(e) => setDecimalInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleDecimalSubmit()}
              className="h-10 w-full rounded-lg border border-line bg-transparent px-3 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-subject-it dark:border-line-dark"
            />
            <button
              onClick={handleDecimalSubmit}
              className="h-10 shrink-0 rounded-lg border border-line px-3 text-sm font-medium hover:border-ink/40 dark:border-line-dark dark:hover:border-bone/40"
            >
              Set
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="binary-input" className="text-xs font-medium text-ink-soft dark:text-bone-soft">
            Type up to 8 bits (0s and 1s) to see its decimal value
          </label>
          <div className="flex gap-2">
            <input
              id="binary-input"
              type="text"
              inputMode="numeric"
              value={binaryInput}
              onChange={(e) => setBinaryInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBinarySubmit()}
              className="h-10 w-full rounded-lg border border-line bg-transparent px-3 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-subject-it dark:border-line-dark"
            />
            <button
              onClick={handleBinarySubmit}
              className="h-10 shrink-0 rounded-lg border border-line px-3 text-sm font-medium hover:border-ink/40 dark:border-line-dark dark:hover:border-bone/40"
            >
              Set
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Activity 1 — Build a Number
// ---------------------------------------------------------------------------

function BuildMode() {
  const [target, setTarget] = useState(() => randomTargetDecimal("easy"));
  const [bits, setBits] = useState<Bits>(emptyBits);
  const [status, setStatus] = useState<"working" | "solved">("working");

  const current = decimalReadout(bits);
  const isMatch = current === target;

  const newTarget = useCallback(() => {
    setTarget(randomTargetDecimal(Math.random() < 0.5 ? "easy" : "medium"));
    setBits(emptyBits());
    setStatus("working");
  }, []);

  const handleToggle = (index: number) => {
    if (status === "solved") return;
    setBits((prev) => toggleBit(prev, index));
  };

  const handleCheck = () => {
    if (isMatch) setStatus("solved");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-card bg-ink/[0.03] p-4 text-center dark:bg-bone/[0.05]">
        <p className="text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">Your target</p>
        <p className="font-display text-4xl font-semibold text-subject-it">{target}</p>
      </div>

      <BitToggleGrid bits={bits} onToggle={handleToggle} disabled={status === "solved"} />

      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className="font-mono text-sm text-ink-soft dark:text-bone-soft">
          Current value: <span className={cn("font-semibold", isMatch ? "text-emerald-600 dark:text-emerald-400" : "text-ink dark:text-bone")}>{current}</span>
        </span>
        {status === "working" ? (
          <button
            onClick={handleCheck}
            disabled={!isMatch}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-subject-it px-4 text-sm font-medium text-paper disabled:opacity-40"
          >
            <Check className="h-4 w-4" /> Check
          </button>
        ) : (
          <button
            onClick={newTarget}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium hover:border-ink/40 dark:border-line-dark dark:hover:border-bone/40"
          >
            <Sparkles className="h-4 w-4" /> New Target
          </button>
        )}
        <button
          onClick={() => setBits(emptyBits())}
          disabled={status === "solved"}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium hover:border-ink/40 disabled:opacity-40 dark:border-line-dark dark:hover:border-bone/40"
        >
          <RotateCcw className="h-4 w-4" /> Clear
        </button>
      </div>

      {status === "solved" && (
        <p className="text-center text-sm font-medium text-emerald-600 dark:text-emerald-400" aria-live="polite">
          Correct — {target} is built from {decimalToBits(target).filter(Boolean).length} set bit(s). Try a new target!
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Activity 2 — Decode Binary
// ---------------------------------------------------------------------------

function DecodeMode() {
  const [targetBits, setTargetBits] = useState<Bits>(() => randomBits("easy"));
  const [guess, setGuess] = useState("");
  const [revealed, setRevealed] = useState(false);

  const actual = decimalReadout(targetBits);
  const guessNumber = Number(guess);
  const isCorrect = revealed && guessNumber === actual;

  const next = () => {
    setTargetBits(randomBits(Math.random() < 0.5 ? "easy" : "medium"));
    setGuess("");
    setRevealed(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-center text-sm text-ink-soft dark:text-bone-soft">
        Study the 8-bit pattern below, predict its decimal value, then reveal to check.
      </p>

      <BitToggleGrid bits={targetBits} highlightIndices={revealed ? targetBits.map((b, i) => (b ? i : -1)).filter((i) => i >= 0) : []} />

      <div className="flex flex-wrap items-center justify-center gap-3">
        <label htmlFor="decode-guess" className="text-sm text-ink-soft dark:text-bone-soft">
          Your guess:
        </label>
        <input
          id="decode-guess"
          type="number"
          inputMode="numeric"
          value={guess}
          disabled={revealed}
          onChange={(e) => setGuess(e.target.value)}
          className="h-10 w-24 rounded-lg border border-line bg-transparent px-3 text-center font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-subject-it disabled:opacity-60 dark:border-line-dark"
        />
        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            disabled={guess.trim() === ""}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-subject-it px-4 text-sm font-medium text-paper disabled:opacity-40"
          >
            <Check className="h-4 w-4" /> Reveal &amp; Check
          </button>
        ) : (
          <button
            onClick={next}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium hover:border-ink/40 dark:border-line-dark dark:hover:border-bone/40"
          >
            <Sparkles className="h-4 w-4" /> Next Pattern
          </button>
        )}
      </div>

      {revealed && (
        <p
          className={cn(
            "text-center text-sm font-medium",
            isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400",
          )}
          aria-live="polite"
        >
          {isCorrect ? "Correct! " : `Not quite — `}The actual value is <span className="font-mono">{actual}</span>{" "}
          ({targetBits.map((b, i) => (b ? `${[128, 64, 32, 16, 8, 4, 2, 1][i]}` : null)).filter(Boolean).join(" + ") || "0"}).
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Activity 3 — Character Encoding
// ---------------------------------------------------------------------------

function EncodeMode() {
  const [direction, setDirection] = useState<"char-to-binary" | "binary-to-char">("char-to-binary");
  const [entry, setEntry] = useState<CharacterEntry>(() => randomCharacterEntry());
  const [bits, setBits] = useState<Bits>(emptyBits);
  const [choices, setChoices] = useState<CharacterEntry[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const buildChoices = useCallback((correct: CharacterEntry) => {
    const pool = CHARACTER_SET.filter((c) => c.char !== correct.char);
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
    return [...shuffled, correct].sort(() => Math.random() - 0.5);
  }, []);

  const next = useCallback(() => {
    const nextEntry = randomCharacterEntry();
    setEntry(nextEntry);
    setBits(emptyBits());
    setChoices(buildChoices(nextEntry));
    setSelectedChoice(null);
    setChecked(false);
  }, [buildChoices]);

  useEffect(() => {
    setChoices(buildChoices(entry));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction]);

  const isCorrectBits = decimalReadout(bits) === entry.code;
  const isCorrectChoice = selectedChoice === entry.char;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center gap-2">
        <button
          onClick={() => {
            setDirection("char-to-binary");
            next();
          }}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-medium",
            direction === "char-to-binary"
              ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
              : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
          )}
        >
          Character → Binary
        </button>
        <button
          onClick={() => {
            setDirection("binary-to-char");
            next();
          }}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-medium",
            direction === "binary-to-char"
              ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
              : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
          )}
        >
          Binary → Character
        </button>
      </div>

      {direction === "char-to-binary" ? (
        <>
          <div className="rounded-card bg-ink/[0.03] p-4 text-center dark:bg-bone/[0.05]">
            <p className="text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">Encode this character</p>
            <p className="font-display text-4xl font-semibold text-subject-it">&ldquo;{entry.char}&rdquo;</p>
          </div>
          <BitToggleGrid bits={bits} onToggle={(i) => !checked && setBits((prev) => toggleBit(prev, i))} disabled={checked} />
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="font-mono text-sm text-ink-soft dark:text-bone-soft">
              Your byte: <span className="font-semibold text-ink dark:text-bone">{decimalReadout(bits)}</span>
            </span>
            {!checked ? (
              <button
                onClick={() => setChecked(true)}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-subject-it px-4 text-sm font-medium text-paper"
              >
                <Check className="h-4 w-4" /> Check
              </button>
            ) : (
              <button
                onClick={next}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium hover:border-ink/40 dark:border-line-dark dark:hover:border-bone/40"
              >
                <Sparkles className="h-4 w-4" /> Next Character
              </button>
            )}
          </div>
          {checked && (
            <p
              className={cn(
                "text-center text-sm font-medium",
                isCorrectBits ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400",
              )}
              aria-live="polite"
            >
              {isCorrectBits
                ? "Correct!"
                : `Not quite — "${entry.char}" is ASCII code ${entry.code}, which is ${bitsToBinaryString(decimalToBits(entry.code))} in binary.`}
            </p>
          )}
        </>
      ) : (
        <>
          <div className="rounded-card bg-ink/[0.03] p-4 text-center dark:bg-bone/[0.05]">
            <p className="text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">Which character is this byte?</p>
          </div>
          <BitToggleGrid bits={decimalToBits(entry.code)} />
          <div className="flex flex-wrap justify-center gap-2">
            {choices.map((c) => (
              <button
                key={c.char}
                onClick={() => !checked && setSelectedChoice(c.char)}
                disabled={checked}
                className={cn(
                  "h-12 w-12 rounded-lg border-2 font-mono text-lg font-semibold",
                  selectedChoice === c.char
                    ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                    : "border-line text-ink dark:border-line-dark dark:text-bone",
                  checked && c.char === entry.char && "border-emerald-500",
                )}
              >
                {c.char}
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-3">
            {!checked ? (
              <button
                onClick={() => setChecked(true)}
                disabled={!selectedChoice}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-subject-it px-4 text-sm font-medium text-paper disabled:opacity-40"
              >
                <Check className="h-4 w-4" /> Check
              </button>
            ) : (
              <button
                onClick={next}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium hover:border-ink/40 dark:border-line-dark dark:hover:border-bone/40"
              >
                <Sparkles className="h-4 w-4" /> Next Byte
              </button>
            )}
          </div>
          {checked && (
            <p
              className={cn(
                "text-center text-sm font-medium",
                isCorrectChoice ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400",
              )}
              aria-live="polite"
            >
              {isCorrectChoice ? "Correct!" : `Not quite — ${entry.code} decodes to "${entry.char}".`}
            </p>
          )}
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Activity 4 — Challenge Mode
// ---------------------------------------------------------------------------

function ChallengeMode() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [round, setRound] = useState<ChallengeRound>(() => generateChallengeRound(0, CHALLENGE_ROUNDS));
  const [bits, setBits] = useState<Bits>(emptyBits);
  const [numericGuess, setNumericGuess] = useState("");
  const [choiceGuess, setChoiceGuess] = useState<string | null>(null);
  const [choices, setChoices] = useState<CharacterEntry[]>([]);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const buildChoices = (correct: CharacterEntry) => {
    const pool = CHARACTER_SET.filter((c) => c.char !== correct.char);
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
    return [...shuffled, correct].sort(() => Math.random() - 0.5);
  };

  const loadRound = useCallback((index: number) => {
    const r = generateChallengeRound(index, CHALLENGE_ROUNDS);
    setRound(r);
    setBits(emptyBits());
    setNumericGuess("");
    setChoiceGuess(null);
    setChecked(false);
    if (r.kind === "encode-to-char" && r.targetChar) setChoices(buildChoices(r.targetChar));
  }, []);

  const restart = () => {
    setRoundIndex(0);
    setScore(0);
    setFinished(false);
    loadRound(0);
  };

  const isCorrect = useMemo(() => {
    if (round.kind === "build") return decimalReadout(bits) === round.targetDecimal;
    if (round.kind === "decode") return Number(numericGuess) === decimalReadout(round.targetBits ?? emptyBits());
    if (round.kind === "encode-to-binary") return decimalReadout(bits) === round.targetChar?.code;
    if (round.kind === "encode-to-char") return choiceGuess === round.targetChar?.char;
    return false;
  }, [round, bits, numericGuess, choiceGuess]);

  const handleCheck = () => {
    setChecked(true);
    if (isCorrect) setScore((s) => s + 1);
  };

  const handleNext = () => {
    const next = roundIndex + 1;
    if (next >= CHALLENGE_ROUNDS) {
      setFinished(true);
      return;
    }
    setRoundIndex(next);
    loadRound(next);
  };

  if (finished) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <p className="font-display text-3xl font-semibold text-subject-it">
          {score} / {CHALLENGE_ROUNDS}
        </p>
        <p className="text-sm text-ink-soft dark:text-bone-soft">
          {score === CHALLENGE_ROUNDS
            ? "Perfect run — every conversion type, nailed."
            : "Nice work. Run it again for a fresh, tougher mix."}
        </p>
        <button
          onClick={restart}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-subject-it px-4 text-sm font-medium text-paper"
        >
          <RotateCcw className="h-4 w-4" /> Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wide text-ink-soft dark:text-bone-soft">
        <span>
          Round {roundIndex + 1} of {CHALLENGE_ROUNDS}
        </span>
        <span>Score: {score}</span>
      </div>

      {round.kind === "build" && (
        <>
          <div className="rounded-card bg-ink/[0.03] p-4 text-center dark:bg-bone/[0.05]">
            <p className="text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">Build this number</p>
            <p className="font-display text-4xl font-semibold text-subject-it">{round.targetDecimal}</p>
          </div>
          <BitToggleGrid bits={bits} onToggle={(i) => !checked && setBits((prev) => toggleBit(prev, i))} disabled={checked} />
          <p className="text-center font-mono text-sm text-ink-soft dark:text-bone-soft">Current value: {decimalReadout(bits)}</p>
        </>
      )}

      {round.kind === "decode" && (
        <>
          <p className="text-center text-sm text-ink-soft dark:text-bone-soft">What decimal value is this byte?</p>
          <BitToggleGrid bits={round.targetBits ?? emptyBits()} />
          <div className="flex justify-center">
            <input
              type="number"
              inputMode="numeric"
              value={numericGuess}
              disabled={checked}
              onChange={(e) => setNumericGuess(e.target.value)}
              className="h-10 w-24 rounded-lg border border-line bg-transparent px-3 text-center font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-subject-it disabled:opacity-60 dark:border-line-dark"
            />
          </div>
        </>
      )}

      {round.kind === "encode-to-binary" && round.targetChar && (
        <>
          <div className="rounded-card bg-ink/[0.03] p-4 text-center dark:bg-bone/[0.05]">
            <p className="text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">Encode this character</p>
            <p className="font-display text-4xl font-semibold text-subject-it">&ldquo;{round.targetChar.char}&rdquo;</p>
          </div>
          <BitToggleGrid bits={bits} onToggle={(i) => !checked && setBits((prev) => toggleBit(prev, i))} disabled={checked} />
        </>
      )}

      {round.kind === "encode-to-char" && round.targetChar && (
        <>
          <p className="text-center text-sm text-ink-soft dark:text-bone-soft">Which character does this byte represent?</p>
          <BitToggleGrid bits={decimalToBits(round.targetChar.code)} />
          <div className="flex flex-wrap justify-center gap-2">
            {choices.map((c) => (
              <button
                key={c.char}
                onClick={() => !checked && setChoiceGuess(c.char)}
                disabled={checked}
                className={cn(
                  "h-12 w-12 rounded-lg border-2 font-mono text-lg font-semibold",
                  choiceGuess === c.char
                    ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                    : "border-line text-ink dark:border-line-dark dark:text-bone",
                )}
              >
                {c.char}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        {!checked ? (
          <button
            onClick={handleCheck}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-subject-it px-4 text-sm font-medium text-paper"
          >
            <Check className="h-4 w-4" /> Check
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium hover:border-ink/40 dark:border-line-dark dark:hover:border-bone/40"
          >
            <Sparkles className="h-4 w-4" /> {roundIndex + 1 >= CHALLENGE_ROUNDS ? "Finish" : "Next Round"}
          </button>
        )}
      </div>

      {checked && (
        <p
          className={cn(
            "text-center text-sm font-medium",
            isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400",
          )}
          aria-live="polite"
        >
          {isCorrect ? "Correct!" : "Not quite — check the explanation panel above and try the next round."}
        </p>
      )}
    </div>
  );
}
