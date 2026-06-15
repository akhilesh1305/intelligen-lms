import type { SkillLevel } from "@prisma/client";

export const SKILL_LEVEL_LABELS: Record<SkillLevel, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

const LEVEL_RANK: Record<SkillLevel, number> = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
};

export function skillLevelRank(level: SkillLevel): number {
  return LEVEL_RANK[level];
}

export function formatSkillLevel(level: SkillLevel): string {
  return SKILL_LEVEL_LABELS[level];
}

export function maxSkillLevel(a: SkillLevel, b: SkillLevel): SkillLevel {
  return LEVEL_RANK[a] >= LEVEL_RANK[b] ? a : b;
}

export function hasSkillGap(current: SkillLevel, target: SkillLevel): boolean {
  return LEVEL_RANK[current] < LEVEL_RANK[target];
}
