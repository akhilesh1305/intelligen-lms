import { z } from "zod";
import type { CourseSummary } from "@/lib/assistant/context";
import type { LearningRoadmap } from "@/lib/assistant/roadmap";
import { generateRoadmap } from "@/lib/assistant/roadmap";
import { chatJSON } from "./client";

const roadmapSchema = z.object({
  goal: z.string(),
  summary: z.string(),
  steps: z.array(
    z.object({
      order: z.number(),
      phase: z.string(),
      description: z.string(),
      duration: z.string(),
      courseIds: z.array(z.string()),
    })
  ),
});

export type RoadmapResult = {
  roadmap: LearningRoadmap;
  source: "openai" | "local";
};

export async function generatePersonalizedRoadmap(
  goal: string,
  catalog: CourseSummary[],
  enrolledIds: Set<string>
): Promise<RoadmapResult> {
  const catalogText = catalog
    .map((c) => `[${c.id}] ${c.title} — ${c.level}, ${c.category}`)
    .join("\n");

  const ai = await chatJSON(
    `Create a personalized learning roadmap using ONLY courses from the catalog. Return JSON:
{"goal":"string","summary":"string","steps":[{"order":1,"phase":"string","description":"string","duration":"2-3 weeks","courseIds":["id"]}]}`,
    `Learning goal: ${goal}\n\nCATALOG:\n${catalogText}`,
    roadmapSchema,
    { maxTokens: 2000 }
  );

  if (ai) {
    const idMap = new Map(catalog.map((c) => [c.id, c]));
    const steps = ai.data.steps.map((step) => ({
      order: step.order,
      phase: step.phase,
      description: step.description,
      duration: step.duration,
      courses: step.courseIds
        .filter((id) => idMap.has(id))
        .map((id) => {
          const c = idMap.get(id)!;
          return {
            id: c.id,
            title: c.title,
            level: c.level,
            reason: step.description,
          };
        }),
    }));

    const totalCourses = steps.reduce((n, s) => n + s.courses.length, 0);

    return {
      roadmap: {
        goal: ai.data.goal,
        summary: ai.data.summary,
        steps,
        totalCourses,
      },
      source: "openai",
    };
  }

  const ruleBased = generateRoadmap(goal, catalog, enrolledIds);
  if (ruleBased) {
    return { roadmap: ruleBased, source: "local" };
  }

  return {
    roadmap: {
      goal,
      summary: `A personalized plan to work toward: ${goal}`,
      steps: [
        {
          order: 1,
          phase: "Foundation",
          description: "Start with beginner-friendly courses",
          duration: "2–4 weeks",
          courses: catalog
            .filter((c) => c.level === "Beginner")
            .slice(0, 2)
            .map((c) => ({
              id: c.id,
              title: c.title,
              level: c.level,
              reason: "Build core knowledge",
            })),
        },
        {
          order: 2,
          phase: "Advance",
          description: "Deepen skills with intermediate courses",
          duration: "3–5 weeks",
          courses: catalog
            .filter((c) => c.level !== "Beginner")
            .slice(0, 2)
            .map((c) => ({
              id: c.id,
              title: c.title,
              level: c.level,
              reason: "Level up your expertise",
            })),
        },
      ],
      totalCourses: Math.min(catalog.length, 4),
    },
    source: "local",
  };
}
