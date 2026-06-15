import { z } from "zod";
import { chatJSON } from "./client";

export type GeneratedLesson = {
  title: string;
  content: string;
  summary: string;
};

export type GeneratedModule = {
  title: string;
  summary: string;
  lessons: GeneratedLesson[];
};

export type CourseOutline = {
  modules: GeneratedModule[];
  source: "openai" | "local";
};

const lessonSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(50),
  summary: z.string().min(10),
});

const moduleSchema = z.object({
  title: z.string().min(2),
  summary: z.string().min(10),
  lessons: z.array(lessonSchema).min(1),
});

const outlineSchema = z.object({
  modules: z.array(moduleSchema).min(1),
});

function buildLocalOutline(
  topic: string,
  moduleCount: number,
  lessonsPerModule: number
): GeneratedModule[] {
  const modules: GeneratedModule[] = [];

  for (let m = 1; m <= moduleCount; m++) {
    const lessons: GeneratedLesson[] = [];
    for (let l = 1; l <= lessonsPerModule; l++) {
      const title = `${topic} — Module ${m}, Lesson ${l}`;
      lessons.push({
        title,
        summary: `Key concepts for lesson ${l} in module ${m} of ${topic}.`,
        content: `Welcome to ${title}.\n\nIn this lesson you will learn essential concepts about ${topic}.\n\n## Learning objectives\n- Understand core ideas for module ${m}\n- Apply practical skills from lesson ${l}\n- Review key takeaways before moving on\n\n## Overview\nThis lesson introduces foundational material for ${topic}. Work through each section carefully and complete any practice activities.\n\n## Key points\n1. Start with the basics and build confidence\n2. Connect new ideas to what you learned earlier\n3. Summarize your understanding in your own words\n\n## Next steps\nProceed to the next lesson when you feel comfortable with these concepts.`,
      });
    }
    modules.push({
      title: `Module ${m}: ${topic} fundamentals`,
      summary: `Module ${m} covers essential ${topic} topics.`,
      lessons,
    });
  }

  return modules;
}

export async function generateCourseOutline(
  topic: string,
  description: string,
  moduleCount: number,
  lessonsPerModule: number
): Promise<CourseOutline> {
  const modules = Math.min(Math.max(moduleCount, 1), 6);
  const lessons = Math.min(Math.max(lessonsPerModule, 1), 5);

  const ai = await chatJSON(
    `You generate structured LMS course outlines. Return JSON: {"modules":[{"title":"string","summary":"string","lessons":[{"title":"string","content":"string (200-400 words, markdown)","summary":"string"}]}]}
Each lesson content must be educational, practical, and formatted with headings.`,
    `Topic: ${topic}\nDescription: ${description}\nGenerate ${modules} modules with ${lessons} lessons each.`,
    outlineSchema,
    { maxTokens: 4000 }
  );

  if (ai) {
    return { modules: ai.data.modules, source: ai.source };
  }

  return {
    modules: buildLocalOutline(topic, modules, lessons),
    source: "local",
  };
}
