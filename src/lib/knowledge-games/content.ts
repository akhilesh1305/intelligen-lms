export type FlashcardItem = {
  id: string;
  term: string;
  definition: string;
};

export type MatchPair = {
  id: string;
  left: string;
  right: string;
};

export type ScrambleWord = {
  id: string;
  word: string;
  hint: string;
};

export type CrosswordClue = {
  id: string;
  number: number;
  direction: "across" | "down";
  clue: string;
  answer: string;
  row: number;
  col: number;
};

export const FLASHCARD_DECK: FlashcardItem[] = [
  { id: "fc1", term: "Paris", definition: "Capital city of France, known for the Eiffel Tower" },
  { id: "fc2", term: "Pacific Ocean", definition: "The largest and deepest ocean on Earth" },
  { id: "fc3", term: "Photosynthesis", definition: "Process plants use to turn sunlight into energy" },
  { id: "fc4", term: "Shakespeare", definition: "English playwright who wrote Romeo and Juliet and Hamlet" },
  { id: "fc5", term: "Mount Everest", definition: "Earth's highest mountain, in the Himalayas" },
  { id: "fc6", term: "Gold", definition: "Chemical element Au — a precious metal used in jewelry" },
  { id: "fc7", term: "Nile River", definition: "Longest river in Africa, flowing north through Egypt" },
  { id: "fc8", term: "Mars", definition: "The fourth planet from the Sun, known as the Red Planet" },
  { id: "fc9", term: "Democracy", definition: "Government system where citizens vote for leaders" },
  { id: "fc10", term: "Antarctica", definition: "Coldest continent — mostly covered in ice" },
];

export const MATCH_PAIRS: MatchPair[] = [
  { id: "m1", left: "Japan", right: "Tokyo" },
  { id: "m2", left: "Australia", right: "Canberra" },
  { id: "m3", left: "Brazil", right: "Brasília" },
  { id: "m4", left: "Egypt", right: "Cairo" },
  { id: "m5", left: "Canada", right: "Ottawa" },
  { id: "m6", left: "Italy", right: "Rome" },
];

export const MEMORY_PAIRS: MatchPair[] = [
  { id: "mem1", left: "🗼", right: "Paris" },
  { id: "mem2", left: "🗽", right: "New York" },
  { id: "mem3", left: "🕌", right: "Istanbul" },
  { id: "mem4", left: "🌋", right: "Volcano" },
  { id: "mem5", left: "🐘", right: "Elephant" },
  { id: "mem6", left: "🌙", right: "Moon" },
];

export const SCRAMBLE_WORDS: ScrambleWord[] = [
  { id: "s1", word: "TIGER", hint: "Large striped big cat" },
  { id: "s2", word: "OCEAN", hint: "Vast body of salt water" },
  { id: "s3", word: "PARIS", hint: "Capital of France" },
  { id: "s4", word: "INDIA", hint: "Country in South Asia" },
  { id: "s5", word: "EAGLE", hint: "Bird of prey" },
];

/** 5×5 grid; `.` = blocked cell */
export const CROSSWORD_GRID = [
  "TIGER",
  "..A..",
  "..G..",
  "..L..",
  "..E..",
] as const;

export const CROSSWORD_CLUES: CrosswordClue[] = [
  { id: "c1", number: 1, direction: "across", clue: "Large striped big cat (5)", answer: "TIGER", row: 0, col: 0 },
  { id: "c2", number: 2, direction: "down", clue: "Bird of prey (5)", answer: "EAGLE", row: 0, col: 3 },
];

export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function scrambleLetters(word: string): string {
  const letters = word.split("");
  let scrambled = shuffle(letters).join("");
  let attempts = 0;
  while (scrambled === word && attempts < 10) {
    scrambled = shuffle(letters).join("");
    attempts++;
  }
  return scrambled;
}
