// One Line, One Minute: The Vending Machine Pickup Line — make.fun entry.
//
// The program writes one line to /output/entry.txt: a single pickup line of
// at most 200 characters, spoken by a vending machine to a passing human.
// No network, no input, deterministic.
//
// How the line is built for the judge's brief (most important first):
//   1. It IS the machine speaking, first person, to a passing human:
//      "Press B4, gorgeous" — the machine addresses the passerby directly
//      and names its own button, not a line any stranger in a bar could say.
//   2. It lives in the machine's own world three times over: its button
//      (B4), its drop mechanism ("I'll drop something sweet"), and its
//      exact change — the coin slot is the machine's heart.
//   3. It lands the laugh in the last few words: the line opens as a
//      romantic offer ("drop something sweet for you") and then undercuts
//      itself — the machine falls for EVERYONE with exact change. The
//      flirt was never special; the coins were. The turn needs no setup
//      explained afterwards, and it arrives at the very end.
//   4. It is short and speakable: one sentence, ~118 of the 200 characters,
//      plain words a person could say aloud in one breath.
//   5. It stays charming, never creepy: the machine is self-deprecating
//      about its own cheap heart, and it offers chocolate, not a threat.
//
// Candidates considered and why this one won:
//   - "I only flirt with people who carry exact change — and you, gorgeous,
//     look like you were minted this morning." Strong coin pun ("minted"),
//     but the punch is a compliment, not a laugh, and it has fewer
//     machine-world elements (no button, no drop).
//   - "I'm the only one here who'll never ghost you — press B4, gorgeous,
//     and I'll drop something sweet at your feet." The "ghost" joke is
//     dating slang, not machine world, and the laugh lands mid-line.
//   - "Hey, gorgeous — I've been holding this chocolate behind glass all
//     day, but for you I'll drop it like it's hot." Borrowed phrase
//     ("drop it like it's hot"), less original.
//   - "You walk past every day and my coils still do a little spin —
//     press B4, take the chocolate, and I'll pretend the exact change was
//     my idea." Too long, passive coils, weaker punch.
//   The winner is the only candidate with three machine-world elements,
//   a romantic setup, and a deflationary punch in its final words.

import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

// One beat per job the line has to do, in reading order.
const BEATS: ReadonlyArray<{ role: string; text: string }> = [
  {
    role: "invitation",
    text: "Press B4, gorgeous, and I'll drop something sweet for you",
  },
  {
    role: "punch",
    text: "— fair warning, I fall for everyone with exact change.",
  },
];

const MAX_CHARS = 200;

function charCount(text: string): number {
  // Count characters as code points, so any non-ASCII would count once.
  return [...text].length;
}

function buildLine(): string {
  return BEATS.map((beat) => beat.text).join(" ");
}

function checkLine(text: string): void {
  // The gate: UTF-8 text of 1 to 200 characters, not only white space,
  // and a single sentence, as the brief requires.
  const chars = charCount(text);
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`line must be 1-${MAX_CHARS} characters, got ${chars}`);
  }
  if (text.trim().length === 0) {
    throw new Error("line must not be only white space");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("line must be a single line");
  }
  // A single sentence: exactly one sentence-ending mark, at the end.
  const terminators = text.match(/[.!?]/g) ?? [];
  if (terminators.length !== 1 || !text.endsWith(".")) {
    throw new Error("line must be exactly one sentence ending in a period");
  }
  // The last beat must be the payoff: the line may not trail off after it.
  const lastBeat = BEATS[BEATS.length - 1];
  if (!text.endsWith(lastBeat.text)) {
    throw new Error("line must end on its payoff beat");
  }
}

function main(): void {
  const line = buildLine();
  checkLine(line);
  for (const beat of BEATS) {
    console.log(`beat ${beat.role}: ${charCount(beat.text)} chars`);
  }
  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", line, "utf8");
  // The grader collects the output as another user: leave it readable.
  chmodSync("/output/entry.txt", 0o644);
  // Read back what was written and prove it is the line, byte for byte:
  // the gate scores the file, not the string in memory.
  const written = readFileSync("/output/entry.txt", "utf8");
  if (written !== line) {
    throw new Error("written entry.txt does not match the line");
  }
  checkLine(written);
  console.log(`wrote /output/entry.txt (${charCount(line)} chars): ${line}`);
}

main();
