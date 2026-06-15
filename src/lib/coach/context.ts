import { getCourseCatalog, getUserLearningContext } from "@/lib/assistant/context";
import { getGapAnalysis, summarizeGapAnalysis } from "@/lib/competency";
import { getRecommendedCourses } from "@/lib/recommendations";
import { db } from "@/lib/db";
import { getCoachProfile } from "./profile";

export async function getCoachContext(userId: string) {
  const [profile, catalog, userContext, gapItems, user, inProgress, pathProgress] =
    await Promise.all([
    getCoachProfile(userId),
    getCourseCatalog(userId),
    getUserLearningContext(userId),
    getGapAnalysis(userId),
    db.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        achievementLevel: true,
        challengePoints: true,
        challengesPassed: true,
        points: true,
      },
    }),
    db.enrollment.findMany({
      where: { userId, completedAt: null, progressPercent: { lt: 100 } },
      include: { course: { select: { id: true, title: true } } },
      orderBy: { enrolledAt: "desc" },
      take: 3,
    }),
    db.userPathProgress.findMany({
      where: { userId },
      include: { path: { select: { name: true, slug: true } } },
      take: 2,
    }),
  ]);

  const recommendations = await getRecommendedCourses(
    userId,
    user?.role ?? "STUDENT",
    4
  );

  const gapSummary = summarizeGapAnalysis(gapItems);
  const topGaps = gapItems.filter((g) => g.hasGap).slice(0, 4);

  return {
    profile,
    catalog,
    userContext,
    gapItems: topGaps,
    gapSummary,
    recommendations,
    stats: {
      achievementLevel: user?.achievementLevel ?? "BRONZE",
      challengePoints: user?.challengePoints ?? 0,
      challengesPassed: user?.challengesPassed ?? 0,
      points: user?.points ?? 0,
    },
    inProgress: inProgress.map((e) => ({
      courseId: e.courseId,
      title: e.course.title,
      progress: e.progressPercent,
    })),
    learningPaths: pathProgress.map((p) => ({
      name: p.path.name,
      slug: p.path.slug,
    })),
  };
}

export function buildCoachPromptContext(
  ctx: Awaited<ReturnType<typeof getCoachContext>>
) {
  const focusAreas = ctx.profile.focusAreas.length
    ? ctx.profile.focusAreas.join(", ")
    : "not set";

  const gaps = ctx.gapItems
    .map(
      (g) =>
        `- ${g.name}: target ${g.targetLevel}, achieved ${g.achievedLevel ?? "none"}`
    )
    .join("\n");

  const inProgress = ctx.inProgress
    .map((e) => `- ${e.title} (${e.progress}%)`)
    .join("\n");

  const recs = ctx.recommendations
    .map((c) => `- [${c.id}] ${c.title} — ${c.matchReason}`)
    .join("\n");

  return `LEARNER PROFILE:
Name: ${ctx.userContext.name ?? "Learner"}
Target role: ${ctx.profile.targetRole ?? "not set"}
Career goal: ${ctx.profile.careerGoal ?? "not set"}
Department: ${ctx.profile.department ?? "not set"}
Experience: ${ctx.profile.experienceLevel}
Focus areas: ${focusAreas}

ACHIEVEMENT: ${ctx.stats.achievementLevel} level · ${ctx.stats.points} points · ${ctx.stats.challengesPassed} challenges passed

ENROLLMENTS:
${ctx.userContext.enrollments.map((e) => `- ${e.title} (${e.progress}%)`).join("\n") || "none"}

IN PROGRESS:
${inProgress || "none"}

CERTIFICATES: ${ctx.userContext.certificates.join(", ") || "none"}

SKILL GAPS:
${gaps || "none identified"}

RECOMMENDED COURSES:
${recs || "none"}

LEARNING PATHS: ${ctx.learningPaths.map((p) => p.name).join(", ") || "none"}`;
}
