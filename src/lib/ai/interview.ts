import { z } from "zod";
import { chatJSON } from "./client";

export type InterviewQuestion = {
  question: string;
  tips: string;
  category: string;
};

export type InterviewPrepResult = {
  role: string;
  questions: InterviewQuestion[];
  source: "openai" | "local";
};

const interviewSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z.string().min(10),
        tips: z.string().min(10),
        category: z.string().min(2),
      })
    )
    .min(3),
});

const DEFAULT_QUESTIONS: InterviewQuestion[] = [
  {
    category: "Behavioral",
    question: "Tell me about a time you learned a new skill quickly.",
    tips: "Use STAR format: Situation, Task, Action, Result. Mention a course or project.",
  },
  {
    category: "Technical",
    question: "Walk me through a project you're proud of.",
    tips: "Explain the problem, your approach, tools used, and measurable outcome.",
  },
  {
    category: "Problem solving",
    question: "How do you handle being stuck on a difficult concept?",
    tips: "Show resourcefulness: documentation, peers, practice, breaking problems down.",
  },
  {
    category: "Career goals",
    question: "Where do you see yourself in 2–3 years?",
    tips: "Connect your learning path to realistic growth in your target role.",
  },
  {
    category: "Teamwork",
    question: "Describe a time you collaborated on a learning or work task.",
    tips: "Highlight communication, feedback, and shared goals.",
  },
];

export async function generateInterviewQuestions(
  role: string,
  skills: string[],
  count = 8
): Promise<InterviewPrepResult> {
  const skillList = skills.length > 0 ? skills.join(", ") : "general professional skills";

  const ai = await chatJSON(
    `Generate mock interview questions for job candidates. Return JSON: {"questions":[{"question":"string","tips":"string (how to answer)","category":"string"}]}
Mix behavioral, technical, and situational questions.`,
    `Target role: ${role}\nSkills: ${skillList}\nGenerate ${Math.min(count, 12)} interview questions.`,
    interviewSchema
  );

  if (ai) {
    return { role, questions: ai.data.questions, source: ai.source };
  }

  return {
    role,
    questions: DEFAULT_QUESTIONS.map((q) => ({
      ...q,
      question: q.question.replace("a project", `a ${role} project`),
    })),
    source: "local",
  };
}
