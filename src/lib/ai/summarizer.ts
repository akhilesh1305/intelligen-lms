import { chatCompletion } from "./client";

export type SummaryResult = {
  summary: string;
  keyPoints: string[];
  source: "openai" | "local";
};

function summarizeLocally(title: string, content: string): SummaryResult {
  const sentences = content
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.replace(/^#+\s*/, "").trim())
    .filter((s) => s.length > 20);

  const summary = sentences.slice(0, 3).join(" ") || `Overview of ${title}.`;
  const keyPoints = sentences.slice(0, 5).map((s) => s.slice(0, 120));

  return { summary, keyPoints, source: "local" };
}

export async function summarizeLesson(
  title: string,
  content: string
): Promise<SummaryResult> {
  if (!content.trim()) {
    return {
      summary: "No content available to summarize.",
      keyPoints: [],
      source: "local",
    };
  }

  const ai = await chatCompletion(
    `Summarize LMS lesson content. Return markdown with:
## Summary
(2-3 sentences)

## Key takeaways
- bullet points (3-5 items)`,
    `Lesson: ${title}\n\n${content.slice(0, 8000)}`,
    { temperature: 0.4, maxTokens: 600 }
  );

  if (ai) {
    const bullets = ai
      .split("\n")
      .filter((line) => line.trim().startsWith("-") || line.trim().startsWith("•"))
      .map((line) => line.replace(/^[-•]\s*/, "").trim())
      .filter(Boolean);

    const summary =
      ai.split("## Key takeaways")[0]?.replace(/## Summary\s*/i, "").trim() ||
      ai.slice(0, 300);

    return {
      summary,
      keyPoints: bullets.length > 0 ? bullets : [summary.slice(0, 100)],
      source: "openai",
    };
  }

  return summarizeLocally(title, content);
}
