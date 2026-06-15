import type { GameScenario, ScenarioOption } from "@/lib/corporate-game-types";

/** @deprecated Legacy single-question shape */
export type LegacyGameScenario = {
  id: string;
  phase: string;
  prompt: string;
  context?: string;
  options: ScenarioOption[];
};

const FOLLOW_UP_BY_PHASE: Record<
  string,
  { prompt: string; options: ScenarioOption[] }
> = {
  default: {
    prompt:
      "After reviewing the full situation, what documentation or escalation step is most important before you move on?",
    options: [
      {
        text: "Log the incident in the official channel and notify the responsible team",
        points: 10,
        feedback: "Audit trails and timely escalation protect you and the organisation.",
      },
      {
        text: "Mention it informally to your manager when you next see them",
        points: 4,
        feedback: "Informal mentions are easy to miss. Use documented channels.",
      },
      {
        text: "Take no further action if the immediate issue seems resolved",
        points: 0,
        feedback: "Unresolved or unrecorded issues often resurface with greater impact.",
      },
    ],
  },
};

function followUpForPhase(phase: string) {
  return FOLLOW_UP_BY_PHASE[phase] ?? FOLLOW_UP_BY_PHASE.default;
}

/** Expand legacy one-liner scenarios into paragraph + multi-question format. */
export function normalizeLegacyScenario(legacy: LegacyGameScenario): GameScenario {
  const contextBlock = legacy.context
    ? legacy.context.replace(/\n/g, " ").trim()
    : "";

  const narrativeParts = [
    contextBlock,
    `You are handling a ${phaseToLabel(legacy.phase)} situation during a normal work week at your company.`,
    `Leadership has stressed that employees must think through legal, security, and reputational impact before acting quickly.`,
    `Several teammates are indirectly affected, and your response may set the tone for how similar cases are handled in the future.`,
    `Read the details carefully — the questions that follow will refer back to this scenario.`,
    legacy.prompt.replace(/\?+$/, "") + ".",
  ].filter(Boolean);

  const narrative = narrativeParts.join(" ");

  const followUp = followUpForPhase(legacy.phase);

  return {
    id: legacy.id,
    phase: legacy.phase,
    narrative,
    questions: [
      {
        id: `${legacy.id}-q1`,
        prompt: legacy.prompt,
        options: legacy.options,
      },
      {
        id: `${legacy.id}-q2`,
        prompt: followUp.prompt,
        options: followUp.options,
      },
    ],
  };
}

function phaseToLabel(phase: string): string {
  return phase.toLowerCase();
}

export function normalizeScenarioSet(
  sets: LegacyGameScenario[][]
): GameScenario[][] {
  return sets.map((set) => set.map(normalizeLegacyScenario));
}

export function isLegacyScenario(
  value: GameScenario | LegacyGameScenario
): value is LegacyGameScenario {
  return !("questions" in value && Array.isArray(value.questions));
}

export function ensureGameScenario(
  value: GameScenario | LegacyGameScenario
): GameScenario {
  return isLegacyScenario(value) ? normalizeLegacyScenario(value) : value;
}
