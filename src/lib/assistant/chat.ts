import type { LearningRoadmap } from "./roadmap";
import {
  answerCourseQuestion,
  detectGoal,
  generateRoadmap,
  wantsRoadmap,
} from "./roadmap";
import {
  buildSystemContext,
  getCourseCatalog,
  getUserLearningContext,
} from "./context";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AssistantResponse = {
  message: string;
  roadmap?: LearningRoadmap;
};

async function callOpenAI(
  messages: ChatMessage[],
  systemPrompt: string
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}

export async function handleAssistantChat(
  userMessage: string,
  history: ChatMessage[],
  userId?: string
): Promise<AssistantResponse> {
  const [catalog, userContext] = await Promise.all([
    getCourseCatalog(),
    userId ? getUserLearningContext(userId) : undefined,
  ]);

  const enrolledIds = new Set(
    userContext?.enrollments.map((e) => e.courseId) ?? []
  );

  // Roadmap request
  if (wantsRoadmap(userMessage) || detectGoal(userMessage)) {
    const roadmap = generateRoadmap(userMessage, catalog, enrolledIds);
    if (roadmap) {
      const stepText = roadmap.steps
        .map(
          (s) =>
            `**Phase ${s.order}: ${s.phase}** (${s.duration})\n${s.description}\n${s.courses.map((c) => `  → ${c.title} — ${c.reason}`).join("\n")}`
        )
        .join("\n\n");

      return {
        message: `Here's your personalized **${roadmap.goal}** learning roadmap:\n\n${roadmap.summary}\n\n${stepText}\n\nStart with Phase 1 and work through each course. I recommend enrolling in one course at a time for best results.`,
        roadmap,
      };
    }
  }

  // Rule-based course Q&A
  const directAnswer = answerCourseQuestion(userMessage, catalog, userContext);
  if (directAnswer) {
    return { message: directAnswer };
  }

  // OpenAI fallback
  const { catalogText, userText } = buildSystemContext(catalog, userContext);
  const systemPrompt = `You are IntelliGen LMS Learning Assistant. Help students with course questions, learning advice, and career guidance.

AVAILABLE COURSES (use exact titles and link as /courses/{id}):
${catalogText}

USER CONTEXT:
${userText}

RULES:
- Only recommend courses from the catalog above
- Be concise, friendly, and actionable
- For career goals, outline a phased learning path referencing specific courses
- Use markdown for formatting
- If asked for a roadmap, structure it in clear phases with course recommendations`;

  const aiReply = await callOpenAI(
    [...history.slice(-6), { role: "user", content: userMessage }],
    systemPrompt
  );

  if (aiReply) {
    // Try to attach roadmap if AI response mentions career path
    const roadmap = wantsRoadmap(userMessage)
      ? generateRoadmap(userMessage, catalog, enrolledIds) ?? undefined
      : undefined;
    return { message: aiReply, roadmap };
  }

  // Final fallback
  return {
    message: `I'm your IntelliGen learning assistant! I can help you with:

• **Course info** — "Tell me about Web Development"
• **Your progress** — "How am I doing?"
• **Recommendations** — "What course should I take?"
• **Learning roadmaps** — "Create a roadmap to become a data scientist"

What would you like to learn today?`,
  };
}
