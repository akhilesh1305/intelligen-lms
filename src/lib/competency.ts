import type { SkillLevel } from "@prisma/client";
import { db } from "./db";
import { formatSkillLevel, hasSkillGap, maxSkillLevel, skillLevelRank } from "./skills";

export type SkillGapItem = {
  skillId: string;
  slug: string;
  name: string;
  category: string;
  assessedLevel: SkillLevel | null;
  achievedLevel: SkillLevel | null;
  targetLevel: SkillLevel;
  hasGap: boolean;
  recommendedCourses: {
    id: string;
    title: string;
    skillLevel: SkillLevel;
  }[];
};

export async function getAchievedSkillLevels(
  userId: string
): Promise<Map<string, SkillLevel>> {
  const completedEnrollments = await db.enrollment.findMany({
    where: {
      userId,
      OR: [{ completedAt: { not: null } }, { progressPercent: 100 }],
    },
    select: { courseId: true },
  });

  const courseIds = completedEnrollments.map((e) => e.courseId);
  if (courseIds.length === 0) return new Map();

  const courseSkills = await db.courseSkill.findMany({
    where: { courseId: { in: courseIds } },
    select: { skillId: true, targetLevel: true },
  });

  const achieved = new Map<string, SkillLevel>();
  for (const cs of courseSkills) {
    const current = achieved.get(cs.skillId);
    achieved.set(
      cs.skillId,
      current ? maxSkillLevel(current, cs.targetLevel) : cs.targetLevel
    );
  }

  return achieved;
}

export async function getGapAnalysis(userId: string): Promise<SkillGapItem[]> {
  const [skills, assessments, achieved, enrollments] = await Promise.all([
    db.skill.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
    db.userSkillAssessment.findMany({ where: { userId } }),
    getAchievedSkillLevels(userId),
    db.enrollment.findMany({
      where: { userId },
      select: { courseId: true, completedAt: true, progressPercent: true },
    }),
  ]);

  const completedIds = new Set(
    enrollments
      .filter((e) => e.completedAt || e.progressPercent >= 100)
      .map((e) => e.courseId)
  );

  const assessmentMap = new Map(
    assessments.map((a) => [a.skillId, a.level])
  );

  const results: SkillGapItem[] = [];

  for (const skill of skills) {
    const assessedLevel = assessmentMap.get(skill.id) ?? null;
    const achievedLevel = achieved.get(skill.id) ?? null;

    const courseSkills = await db.courseSkill.findMany({
      where: { skillId: skill.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            skillLevel: true,
            published: true,
            status: true,
          },
        },
      },
    });

    const targetLevel = courseSkills.reduce<SkillLevel>(
      (max, cs) => maxSkillLevel(max, cs.targetLevel),
      "BEGINNER"
    );

    const current = achievedLevel ?? assessedLevel ?? "BEGINNER";
    const hasGap =
      assessedLevel !== null
        ? hasSkillGap(current, assessedLevel)
        : achievedLevel === null ||
          hasSkillGap(achievedLevel, targetLevel);

    const recommendedCourses = courseSkills
      .filter(
        (cs) =>
          cs.course.published &&
          cs.course.status === "APPROVED" &&
          !completedIds.has(cs.course.id) &&
          (!achievedLevel ||
            skillLevelRank(cs.targetLevel) > skillLevelRank(achievedLevel))
      )
      .map((cs) => ({
        id: cs.course.id,
        title: cs.course.title,
        skillLevel: cs.course.skillLevel,
      }))
      .slice(0, 3);

    results.push({
      skillId: skill.id,
      slug: skill.slug,
      name: skill.name,
      category: skill.category,
      assessedLevel,
      achievedLevel,
      targetLevel,
      hasGap,
      recommendedCourses,
    });
  }

  return results;
}

export async function saveSkillAssessment(
  userId: string,
  skillId: string,
  level: SkillLevel
) {
  return db.userSkillAssessment.upsert({
    where: { userId_skillId: { userId, skillId } },
    create: { userId, skillId, level },
    update: { level, assessedAt: new Date() },
  });
}

export function summarizeGapAnalysis(items: SkillGapItem[]) {
  const gaps = items.filter((i) => i.hasGap);
  const strengths = items.filter(
    (i) => i.achievedLevel && !i.hasGap
  );
  return {
    gapCount: gaps.length,
    strengthCount: strengths.length,
    summary:
      gaps.length === 0
        ? "Great work — no major skill gaps detected based on your assessments."
        : `You have ${gaps.length} skill area${gaps.length === 1 ? "" : "s"} to develop. See recommended courses below.`,
  };
}

export { formatSkillLevel };
