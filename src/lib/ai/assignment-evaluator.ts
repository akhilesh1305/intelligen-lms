import { z } from "zod";
import { chatJSON } from "./client";

export type EvaluationResult = {
  grade: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  source: "openai" | "local";
};

const evalSchema = z.object({
  grade: z.number().int().min(0).max(100),
  feedback: z.string().min(20),
  strengths: z.array(z.string()).min(1),
  improvements: z.array(z.string()).min(1),
});

function evaluateLocally(
  assignmentTitle: string,
  description: string,
  submission: string
): EvaluationResult {
  const wordCount = submission.trim().split(/\s+/).length;
  let grade = 60;

  if (wordCount >= 50) grade += 15;
  if (wordCount >= 150) grade += 10;
  if (submission.toLowerCase().includes(assignmentTitle.toLowerCase().split(" ")[0])) {
    grade += 5;
  }
  grade = Math.min(grade, 85);

  return {
    grade,
    feedback: `Your submission addresses ${assignmentTitle}. ${wordCount >= 100 ? "Good depth of response." : "Consider expanding with more detail and examples."}`,
    strengths: wordCount >= 80 ? ["Adequate length", "On-topic response"] : ["Submitted on time"],
    improvements:
      wordCount < 100
        ? ["Add more specific examples", "Expand key arguments"]
        : ["Add references to course concepts", "Proofread for clarity"],
    source: "local",
  };
}

export async function evaluateAssignment(
  assignmentTitle: string,
  description: string,
  submission: string
): Promise<EvaluationResult> {
  if (!submission.trim()) {
    return {
      grade: 0,
      feedback: "No submission content to evaluate.",
      strengths: [],
      improvements: ["Provide a written response"],
      source: "local",
    };
  }

  const ai = await chatJSON(
    `You grade LMS assignment submissions fairly. Return JSON:
{"grade":0-100,"feedback":"string (2-4 sentences)","strengths":["string"],"improvements":["string"]}
Grade on relevance, clarity, effort, and alignment with the assignment prompt.`,
    `Assignment: ${assignmentTitle}\nPrompt: ${description}\n\nLearner submission:\n${submission.slice(0, 6000)}`,
    evalSchema
  );

  if (ai) {
    return { ...ai.data, source: ai.source };
  }

  return evaluateLocally(assignmentTitle, description, submission);
}
