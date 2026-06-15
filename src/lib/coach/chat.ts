import type { LearningRoadmap } from "@/lib/assistant/roadmap";
import { generateRoadmap, wantsRoadmap } from "@/lib/assistant/roadmap";
import { generatePersonalizedRoadmap } from "@/lib/ai/roadmap-generator";
import { getCareerAdvice } from "@/lib/ai/career-advisor";
import { chatCompletion } from "@/lib/ai/client";
import { buildCoachPromptContext, getCoachContext } from "./context";

export type CoachChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type CoachChatResponse = {
  message: string;
  roadmap?: LearningRoadmap;
};

export async function handleCoachChat(
  userMessage: string,
  history: CoachChatMessage[],
  userId: string
): Promise<CoachChatResponse> {
  const ctx = await getCoachContext(userId);
  const enrolledIds = new Set(
    ctx.userContext.enrollments.map((e) => e.courseId)
  );
  const goal =
    ctx.profile.careerGoal ??
    ctx.profile.targetRole ??
    userMessage;

  if (wantsRoadmap(userMessage)) {
    const { roadmap } = await generatePersonalizedRoadmap(
      goal,
      ctx.catalog,
      enrolledIds
    );
    const stepText = roadmap.steps
      .map(
        (s) =>
          `**${s.phase}** (${s.duration}): ${s.description}\n${s.courses.map((c) => `→ [${c.title}](/courses/${c.id})`).join("\n")}`
      )
      .join("\n\n");

    return {
      message: `Here's your corporate learning roadmap for **${roadmap.goal}**:\n\n${roadmap.summary}\n\n${stepText}`,
      roadmap,
    };
  }

  if (/career|promotion|role|path|advice/i.test(userMessage) && ctx.profile.careerGoal) {
    const completedIds = ctx.userContext.enrollments
      .filter((e) => e.progress >= 100)
      .map((e) => {
        const match = ctx.catalog.find((c) => c.title === e.title);
        return match?.id ?? "";
      })
      .filter(Boolean);

    const advice = await getCareerAdvice(
      ctx.profile.careerGoal,
      ctx.catalog,
      completedIds,
      ctx.gapItems.map((g) => g.name)
    );

    const courses = advice.recommendedCourses
      .map((c) => `→ [${c.title}](/courses/${c.id}) — ${c.reason}`)
      .join("\n");

    return {
      message: `${advice.summary}\n\n**Skills to develop:** ${advice.suggestedSkills.join(", ")}\n\n**Recommended courses:**\n${courses}\n\n**Career paths:** ${advice.careerPaths.join(" · ")}`,
    };
  }

  const promptContext = buildCoachPromptContext(ctx);
  const systemPrompt = `You are IntelliGen Corporate Coach — an AI-powered enterprise learning and career mentor.

Your role:
- Provide personalized, professional coaching for workplace learning and career growth
- Reference the learner's actual progress, skill gaps, and goals
- Recommend specific courses from the catalog using markdown links: [Title](/courses/{id})
- Be concise, encouraging, and action-oriented (corporate tone, not casual)

LEARNER DATA:
${promptContext}

CATALOG (id → title):
${ctx.catalog.map((c) => `[${c.id}] ${c.title}`).join("\n")}`;

  const aiReply = await chatCompletion(
    systemPrompt,
    [...history.slice(-8), { role: "user", content: userMessage }]
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n\n"),
    { maxTokens: 900 }
  );

  if (aiReply) {
    const roadmap = wantsRoadmap(userMessage)
      ? generateRoadmap(userMessage, ctx.catalog, enrolledIds) ?? undefined
      : undefined;
    return { message: aiReply, roadmap };
  }

  const fallbackRoadmap = generateRoadmap(goal, ctx.catalog, enrolledIds);
  if (fallbackRoadmap) {
    return {
      message: `I can help you grow toward **${goal}**. Here's a starting roadmap — ask me to refine it for your role or timeline.`,
      roadmap: fallbackRoadmap,
    };
  }

  return {
    message: `I'm your **Corporate Coach**. I personalize guidance using your profile, skill gaps, and learning history.

Try asking:
- "What should I focus on this week?"
- "Create a roadmap to become a team lead"
- "Which skills am I missing for my target role?"
- "How can I accelerate my progress?"`,
  };
}
