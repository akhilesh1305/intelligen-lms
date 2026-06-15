import { ALT_SCENARIO_POOLS as LEGACY_ALT_SCENARIO_POOLS } from "@/lib/corporate-game-scenario-pools";
import { BASE_SCENARIOS } from "@/lib/corporate-base-scenarios";
import { ensureGameScenario, normalizeScenarioSet } from "@/lib/corporate-scenario-normalize";

export type {
  CorporateGameSlug,
  GameScenario,
  ScenarioOption,
  ScenarioQuestion,
  FlatScenarioQuestion,
} from "@/lib/corporate-game-types";

export {
  flattenScenarioQuestions,
  getScenarioQuestionCount,
} from "@/lib/corporate-game-types";

import type { CorporateGameSlug, GameScenario } from "@/lib/corporate-game-types";

/** Number of scenario stories served per game session. */
export const CORPORATE_SCENARIOS_PER_GAME = 4;

const NORMALIZED_ALT_POOLS = Object.fromEntries(
  Object.entries(LEGACY_ALT_SCENARIO_POOLS).map(([slug, sets]) => [
    slug,
    normalizeScenarioSet(sets),
  ])
) as Record<CorporateGameSlug, GameScenario[][]>;

const SCENARIO_SETS: Record<CorporateGameSlug, GameScenario[][]> = {
  "cybersecurity-escape": [
    BASE_SCENARIOS["cybersecurity-escape"],
    ...NORMALIZED_ALT_POOLS["cybersecurity-escape"],
  ],
  "compliance-detective": [
    BASE_SCENARIOS["compliance-detective"],
    ...NORMALIZED_ALT_POOLS["compliance-detective"],
  ],
  "customer-service": [
    BASE_SCENARIOS["customer-service"],
    ...NORMALIZED_ALT_POOLS["customer-service"],
  ],
  "sales-negotiation": [
    BASE_SCENARIOS["sales-negotiation"],
    ...NORMALIZED_ALT_POOLS["sales-negotiation"],
  ],
  "leadership-challenge": [
    BASE_SCENARIOS["leadership-challenge"],
    ...NORMALIZED_ALT_POOLS["leadership-challenge"],
  ],
  "project-management": [
    BASE_SCENARIOS["project-management"],
    ...NORMALIZED_ALT_POOLS["project-management"],
  ],
};

const ALL_SCENARIOS: Record<CorporateGameSlug, GameScenario[]> = Object.fromEntries(
  Object.entries(SCENARIO_SETS).map(([slug, sets]) => {
    const seen = new Set<string>();
    const scenarios: GameScenario[] = [];
    for (const set of sets) {
      for (const scenario of set) {
        const normalized = ensureGameScenario(scenario);
        if (seen.has(normalized.id)) continue;
        seen.add(normalized.id);
        scenarios.push(normalized);
      }
    }
    return [slug, scenarios];
  })
) as Record<CorporateGameSlug, GameScenario[]>;

function hashString(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function deterministicShuffle<T>(items: T[], seed: string): T[] {
  const arr = [...items];
  let state = hashString(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const j = state % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getCurrentDaySlug(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function getDayLabel(date = new Date()): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function getCorporateGameScenarioCatalogSize(
  slug: CorporateGameSlug
): number {
  return ALL_SCENARIOS[slug].length;
}

/** @deprecated Use getCorporateGameScenarioCatalogSize */
export function getCorporateGameScenarioPoolSize(
  slug: CorporateGameSlug
): number {
  return getCorporateGameScenarioCatalogSize(slug);
}

export function getCorporateGameScenarios(
  slug: CorporateGameSlug,
  date = new Date()
): GameScenario[] {
  const catalog = ALL_SCENARIOS[slug];
  const daySlug = getCurrentDaySlug(date);
  const shuffled = deterministicShuffle(
    catalog,
    `${daySlug}:${slug}:daily-scenarios`
  );
  const count = Math.min(CORPORATE_SCENARIOS_PER_GAME, shuffled.length);
  return shuffled.slice(0, count);
}

/** Stable fingerprint for the day's scenario lineup (stored on attempts). */
export function getDailyScenarioSetIndex(
  slug: CorporateGameSlug,
  date = new Date()
): number {
  const scenarios = getCorporateGameScenarios(slug, date);
  const lineup = scenarios.map((scenario) => scenario.id).join("|");
  return hashString(`${getCurrentDaySlug(date)}:${slug}:${lineup}`);
}

export function getCorporateGameScenarioMeta(
  slug: CorporateGameSlug,
  date = new Date()
) {
  const scenarios = getCorporateGameScenarios(slug, date);
  return {
    setIndex: getDailyScenarioSetIndex(slug, date),
    daySlug: getCurrentDaySlug(date),
    poolSize: getCorporateGameScenarioCatalogSize(slug),
    scenarioIds: scenarios.map((scenario) => scenario.id),
    scenarioCount: scenarios.length,
  };
}
