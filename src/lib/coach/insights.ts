import { CoachInsightType } from "@prisma/client";
import { z } from "zod";
import { chatJSON } from "@/lib/ai/client";
import { db } from "@/lib/db";
import { buildCoachPromptContext, getCoachContext } from "./context";

const insightSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(20),
  actions: z.array(z.string()).min(1).max(5),
});

const actionPlanSchema = z.object({
  title: z.string().min(5),
  summary: z.string().min(20),
  weeklyFocus: z.string().min(10),
  actions: z.array(
    z.object({
      label: z.string(),
      description: z.string(),
      priority: z.enum(["high", "medium", "low"]),
      href: z.string().optional(),
    })
  ),
});

export type CoachAction = {
  label: string;
  description: string;
  priority: "high" | "medium" | "low";
  href?: string;
};

export type CoachInsightResult = {
  id: string;
  type: CoachInsightType;
  title: string;
  content: string;
  actions: string[];
  source: "openai" | "local";
};

function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function getCachedInsight(
  userId: string,
  type: CoachInsightType,
  since: Date
) {
  return db.coachInsight.findFirst({
    where: { userId, type, createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
  });
}

function buildLocalDailyTip(
  ctx: Awaited<ReturnType<typeof getCoachContext>>
): CoachInsightResult {
  const goal = ctx.profile.careerGoal ?? ctx.profile.targetRole ?? "your career";
  const topCourse = ctx.inProgress[0];

  if (topCourse) {
    return {
      id: "local",
      type: "DAILY_TIP",
      title: "Continue your momentum",
      content: `You're ${topCourse.progress}% through **${topCourse.title}**. Completing this course strengthens skills aligned with ${goal}. Block 25 minutes today to finish the next lesson.`,
      actions: [
        `Resume ${topCourse.title}`,
        "Complete one lesson before end of day",
      ],
      source: "local",
    };
  }

  const gap = ctx.gapItems[0];
  if (gap?.recommendedCourses[0]) {
    const course = gap.recommendedCourses[0];
    return {
      id: "local",
      type: "DAILY_TIP",
      title: `Close your ${gap.name} gap`,
      content: `Your competency profile shows room to grow in **${gap.name}**. Enrolling in **${course.title}** is a strong next step toward ${goal}.`,
      actions: [
        `Explore ${course.title}`,
        `Review skill assessment for ${gap.name}`,
      ],
      source: "local",
    };
  }

  return {
    id: "local",
    type: "DAILY_TIP",
    title: "Set your learning direction",
    content:
      "Define your target role and career goal in your coach profile. I'll personalize daily guidance, skill gap analysis, and course recommendations.",
    actions: [
      "Complete your coach profile",
      "Browse learning paths",
      "Take today's AI challenge",
    ],
    source: "local",
  };
}

export async function getDailyInsight(userId: string): Promise<CoachInsightResult> {
  const since = startOfDay();
  const cached = await getCachedInsight(userId, "DAILY_TIP", since);
  if (cached) {
    const metadata = cached.metadata ? JSON.parse(cached.metadata) : {};
    return {
      id: cached.id,
      type: cached.type,
      title: cached.title,
      content: cached.content,
      actions: metadata.actions ?? [],
      source: metadata.source ?? "local",
    };
  }

  const ctx = await getCoachContext(userId);
  const promptContext = buildCoachPromptContext(ctx);

  const ai = await chatJSON(
    `You are a corporate learning coach for enterprise employees. Return JSON:
{"title":"short headline","content":"2-3 sentence personalized coaching tip in markdown","actions":["action 1","action 2"]}
Be specific, actionable, and reference their actual progress and goals.`,
    promptContext,
    insightSchema
  );

  const result: CoachInsightResult = ai
    ? {
        id: "new",
        type: "DAILY_TIP",
        title: ai.data.title,
        content: ai.data.content,
        actions: ai.data.actions,
        source: ai.source,
      }
    : buildLocalDailyTip(ctx);

  const saved = await db.coachInsight.create({
    data: {
      userId,
      type: "DAILY_TIP",
      title: result.title,
      content: result.content,
      metadata: JSON.stringify({
        actions: result.actions,
        source: result.source,
      }),
    },
  });

  return { ...result, id: saved.id };
}

export async function getActionPlan(userId: string) {
  const since = startOfDay();
  const weekStart = new Date(since);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  const cached = await getCachedInsight(userId, "ACTION_PLAN", weekStart);
  if (cached) {
    return JSON.parse(cached.metadata ?? "{}") as {
      title: string;
      summary: string;
      weeklyFocus: string;
      actions: CoachAction[];
      source: string;
    };
  }

  const ctx = await getCoachContext(userId);
  const promptContext = buildCoachPromptContext(ctx);

  const ai = await chatJSON(
    `You are a corporate career coach. Create a weekly action plan. Return JSON:
{"title":"string","summary":"string","weeklyFocus":"string","actions":[{"label":"string","description":"string","priority":"high|medium|low","href":"/courses/id optional"}]}
Use real course IDs from RECOMMENDED COURSES when suggesting enrollments. Prioritize in-progress courses first.`,
    promptContext,
    actionPlanSchema,
    { maxTokens: 2000 }
  );

  const plan = ai
    ? { ...ai.data, source: ai.source }
    : buildLocalActionPlan(ctx);

  await db.coachInsight.create({
    data: {
      userId,
      type: "ACTION_PLAN",
      title: plan.title,
      content: plan.summary,
      metadata: JSON.stringify(plan),
    },
  });

  return plan;
}

function buildLocalActionPlan(ctx: Awaited<ReturnType<typeof getCoachContext>>) {
  const actions: CoachAction[] = [];

  for (const course of ctx.inProgress) {
    actions.push({
      label: `Continue ${course.title}`,
      description: `You're ${course.progress}% complete — finish the next lesson.`,
      priority: "high",
      href: `/courses/${course.courseId}`,
    });
  }

  for (const rec of ctx.recommendations.slice(0, 2)) {
    actions.push({
      label: `Enroll in ${rec.title}`,
      description: rec.matchReason,
      priority: "medium",
      href: `/courses/${rec.id}`,
    });
  }

  if (actions.length === 0) {
    actions.push({
      label: "Explore learning paths",
      description: "Find a structured path aligned with your career goal.",
      priority: "high",
      href: "/paths",
    });
  }

  actions.push({
    label: "Take today's challenge",
    description: "Earn points and maintain your learning streak.",
    priority: "low",
    href: "/challenges",
  });

  const goal = ctx.profile.careerGoal ?? "your professional growth";

  return {
    title: "Your weekly learning plan",
    summary: `A focused plan to advance toward ${goal}, based on your enrollments, skill gaps, and recommendations.`,
    weeklyFocus:
      ctx.gapItems[0]?.name
        ? `Develop ${ctx.gapItems[0].name} skills through targeted coursework.`
        : "Complete one course module and one AI challenge this week.",
    actions,
    source: "local",
  };
}
