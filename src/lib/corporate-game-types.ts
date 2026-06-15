export type CorporateGameSlug =
  | "cybersecurity-escape"
  | "compliance-detective"
  | "customer-service"
  | "sales-negotiation"
  | "leadership-challenge"
  | "project-management";

export type ScenarioOption = {
  text: string;
  points: number;
  feedback: string;
};

export type ScenarioQuestion = {
  id: string;
  prompt: string;
  options: ScenarioOption[];
};

export type GameScenario = {
  id: string;
  phase: string;
  /** Detailed 5–6 sentence scenario the player reads before answering questions. */
  narrative: string;
  questions: ScenarioQuestion[];
};

export type FlatScenarioQuestion = {
  scenarioId: string;
  scenarioPhase: string;
  narrative: string;
  question: ScenarioQuestion;
  questionIndex: number;
  scenarioIndex: number;
};

export function flattenScenarioQuestions(
  scenarios: GameScenario[]
): FlatScenarioQuestion[] {
  const flat: FlatScenarioQuestion[] = [];
  scenarios.forEach((scenario, scenarioIndex) => {
    scenario.questions.forEach((question, questionIndex) => {
      flat.push({
        scenarioId: scenario.id,
        scenarioPhase: scenario.phase,
        narrative: scenario.narrative,
        question,
        questionIndex,
        scenarioIndex,
      });
    });
  });
  return flat;
}

export function getScenarioQuestionCount(scenarios: GameScenario[]): number {
  return scenarios.reduce((sum, s) => sum + s.questions.length, 0);
}
