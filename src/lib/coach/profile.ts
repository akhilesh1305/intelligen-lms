import { CoachExperienceLevel } from "@prisma/client";
import { db } from "@/lib/db";

export type CoachProfileData = {
  targetRole: string | null;
  careerGoal: string | null;
  department: string | null;
  experienceLevel: CoachExperienceLevel;
  focusAreas: string[];
};

const DEFAULTS: CoachProfileData = {
  targetRole: null,
  careerGoal: null,
  department: null,
  experienceLevel: "JUNIOR",
  focusAreas: [],
};

function parseFocusAreas(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((v): v is string => typeof v === "string")
      : [];
  } catch {
    return [];
  }
}

export async function getCoachProfile(userId: string): Promise<CoachProfileData> {
  const row = await db.coachProfile.findUnique({ where: { userId } });
  if (!row) return { ...DEFAULTS };

  return {
    targetRole: row.targetRole,
    careerGoal: row.careerGoal,
    department: row.department,
    experienceLevel: row.experienceLevel,
    focusAreas: parseFocusAreas(row.focusAreas),
  };
}

export async function upsertCoachProfile(
  userId: string,
  data: Partial<CoachProfileData>
) {
  const focusAreas =
    data.focusAreas !== undefined ? JSON.stringify(data.focusAreas) : undefined;

  return db.coachProfile.upsert({
    where: { userId },
    create: {
      userId,
      targetRole: data.targetRole ?? null,
      careerGoal: data.careerGoal ?? null,
      department: data.department ?? null,
      experienceLevel: data.experienceLevel ?? "JUNIOR",
      focusAreas: focusAreas ?? JSON.stringify([]),
    },
    update: {
      ...(data.targetRole !== undefined && { targetRole: data.targetRole }),
      ...(data.careerGoal !== undefined && { careerGoal: data.careerGoal }),
      ...(data.department !== undefined && { department: data.department }),
      ...(data.experienceLevel !== undefined && {
        experienceLevel: data.experienceLevel,
      }),
      ...(focusAreas !== undefined && { focusAreas }),
    },
  });
}
