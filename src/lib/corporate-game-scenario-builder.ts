import type { GameScenario, ScenarioOption } from "@/lib/corporate-game-types";

const P = 10;
const P4 = 4;

export function q(
  prompt: string,
  best: string,
  bestFb: string,
  ok: string,
  okFb: string,
  bad: string,
  badFb: string
): { prompt: string; options: ScenarioOption[] } {
  return {
    prompt,
    options: [
      { text: best, points: P, feedback: bestFb },
      { text: ok, points: P4, feedback: okFb },
      { text: bad, points: 0, feedback: badFb },
    ],
  };
}

export function scenario(
  id: string,
  phase: string,
  narrative: string,
  questions: ReturnType<typeof q>[]
): GameScenario {
  return {
    id,
    phase,
    narrative,
    questions: questions.map((item, i) => ({
      id: `${id}-q${i + 1}`,
      prompt: item.prompt,
      options: item.options,
    })),
  };
}
