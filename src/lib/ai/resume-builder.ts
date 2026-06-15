import { chatCompletion } from "./client";

export type ResumeInput = {
  name: string;
  email: string;
  skills: string[];
  completedCourses: string[];
  certificates: string[];
  careerGoal?: string;
};

export type ResumeResult = {
  resume: string;
  source: "openai" | "local";
};

function buildLocalResume(input: ResumeInput): string {
  const skills =
    input.skills.length > 0
      ? input.skills.join(" · ")
      : "Communication · Problem solving · Continuous learning";

  const courses =
    input.completedCourses.length > 0
      ? input.completedCourses.map((c) => `- ${c}`).join("\n")
      : "- Coursework in progress";

  const certs =
    input.certificates.length > 0
      ? input.certificates.map((c) => `- ${c}`).join("\n")
      : "";

  return `# ${input.name}
${input.email}

## Professional summary
Motivated learner${input.careerGoal ? ` pursuing a career as a ${input.careerGoal}` : ""} with hands-on training through IntelliGen LMS.

## Skills
${skills}

## Education & training
${courses}

${certs ? `## Certifications\n${certs}\n` : ""}## Projects
- Applied course concepts through practical assignments and quizzes
- Built portfolio-ready skills through structured learning paths`;
}

export async function generateResume(input: ResumeInput): Promise<ResumeResult> {
  const ai = await chatCompletion(
    `You write professional resumes in clean markdown. Include: name/contact, summary, skills, education/training, certifications, projects. Be concise and ATS-friendly. No fake employers — focus on learning achievements.`,
    `Name: ${input.name}
Email: ${input.email}
Career goal: ${input.careerGoal ?? "Not specified"}
Skills: ${input.skills.join(", ") || "none listed"}
Completed courses: ${input.completedCourses.join(", ") || "none"}
Certificates: ${input.certificates.join(", ") || "none"}`,
    { maxTokens: 1200 }
  );

  if (ai) {
    return { resume: ai, source: "openai" };
  }

  return { resume: buildLocalResume(input), source: "local" };
}
