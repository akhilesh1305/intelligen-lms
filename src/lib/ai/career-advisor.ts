import { z } from "zod";
import type { CourseSummary } from "@/lib/assistant/context";
import { chatJSON } from "./client";

export type CareerAdvice = {
  summary: string;
  suggestedSkills: string[];
  recommendedCourses: { id: string; title: string; reason: string }[];
  careerPaths: string[];
  source: "openai" | "local";
};

const adviceSchema = z.object({
  summary: z.string().min(20),
  suggestedSkills: z.array(z.string()).min(2),
  recommendedCourseIds: z.array(z.string()).optional(),
  careerPaths: z.array(z.string()).min(1),
});

export async function getCareerAdvice(
  goal: string,
  catalog: CourseSummary[],
  completedCourseIds: string[],
  assessedSkills: string[]
): Promise<CareerAdvice> {
  const catalogText = catalog
    .map((c) => `[${c.id}] ${c.title} (${c.level}, ${c.category})`)
    .join("\n");

  const ai = await chatJSON(
    `You are a career advisor for an LMS. Return JSON:
{"summary":"string","suggestedSkills":["string"],"recommendedCourseIds":["id from catalog"],"careerPaths":["string"]}
Only recommend course IDs from the provided catalog.`,
    `Career goal: ${goal}
Completed courses: ${completedCourseIds.join(", ") || "none"}
Self-assessed skills: ${assessedSkills.join(", ") || "none"}

CATALOG:
${catalogText}`,
    adviceSchema
  );

  if (ai) {
    const idSet = new Set(catalog.map((c) => c.id));
    const courses = (ai.data.recommendedCourseIds ?? [])
      .filter((id) => idSet.has(id))
      .map((id) => {
        const course = catalog.find((c) => c.id === id)!;
        return {
          id,
          title: course.title,
          reason: `Recommended for your goal: ${goal}`,
        };
      });

  if (courses.length === 0) {
      const fallback = catalog
        .filter((c) => !completedCourseIds.includes(c.id))
        .slice(0, 3)
        .map((c) => ({
          id: c.id,
          title: c.title,
          reason: `Build ${c.category} skills for ${goal}`,
        }));
      return {
        summary: ai.data.summary,
        suggestedSkills: ai.data.suggestedSkills,
        recommendedCourses: fallback,
        careerPaths: ai.data.careerPaths,
        source: ai.source,
      };
    }

    return {
      summary: ai.data.summary,
      suggestedSkills: ai.data.suggestedSkills,
      recommendedCourses: courses,
      careerPaths: ai.data.careerPaths,
      source: ai.source,
    };
  }

  const available = catalog.filter((c) => !completedCourseIds.includes(c.id));
  const keyword = goal.toLowerCase();
  const matched = available.filter(
    (c) =>
      c.title.toLowerCase().includes(keyword.split(" ")[0]) ||
      c.category.toLowerCase().includes(keyword.split(" ")[0])
  );

  const picks = (matched.length > 0 ? matched : available).slice(0, 3);

  return {
    summary: `Based on your goal to become a ${goal}, focus on building foundational skills and completing structured courses.`,
    suggestedSkills: assessedSkills.length > 0 ? assessedSkills : ["Communication", "Problem solving", "Technical literacy"],
    recommendedCourses: picks.map((c) => ({
      id: c.id,
      title: c.title,
      reason: `${c.level} level · ${c.category}`,
    })),
    careerPaths: [goal, "Specialist track", "Team lead track"],
    source: "local",
  };
}
