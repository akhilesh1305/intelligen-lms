import type { CertificateHubData } from "@/lib/certificate-hub";
import { DEMO_ORGANIZATION } from "./brand";
import { DEMO_COURSES } from "./courses";

export function getDemoCertificateHubData(): CertificateHubData {
  const ai = DEMO_COURSES.find((c) => c.id === "demo-ai-fundamentals")!;
  const leadership = DEMO_COURSES.find((c) => c.id === "demo-leadership-excellence")!;
  const cyber = DEMO_COURSES.find((c) => c.id === "demo-cybersecurity-essentials")!;
  const genAi = DEMO_COURSES.find((c) => c.id === "demo-generative-ai-business")!;

  const earned = [
    {
      id: "demo-cert-1",
      certificateNo: "ACME-IGLMS-AI-2026-0042",
      issuedAt: new Date("2026-05-18"),
      courseId: ai.id,
      courseTitle: ai.title,
      skillLevel: ai.skillLevel,
      template: "ai-professional" as const,
      organizationName: DEMO_ORGANIZATION.name,
    },
    {
      id: "demo-cert-2",
      certificateNo: "ACME-IGLMS-LEAD-2026-0018",
      issuedAt: new Date("2026-04-02"),
      courseId: leadership.id,
      courseTitle: leadership.title,
      skillLevel: leadership.skillLevel,
      template: "corporate" as const,
      organizationName: DEMO_ORGANIZATION.name,
    },
  ];

  const locked = [
    {
      courseId: cyber.id,
      courseTitle: cyber.title,
      description: cyber.description,
      progressPercent: 18,
      template: "technical-expert" as const,
      requirements: {
        lessons: { total: 22, completed: 4 },
        quizzes: { total: 3, passed: 0 },
        assignments: { total: 2, submitted: 0 },
      },
      remainingSummary: ["18 lessons remaining", "3 quizzes to pass", "2 assignments to submit"],
      estimatedCompletionLabel: "Required for Q3 compliance — in progress",
    },
    {
      courseId: genAi.id,
      courseTitle: genAi.title,
      description: genAi.description,
      progressPercent: 45,
      template: "ai-professional" as const,
      requirements: {
        lessons: { total: 20, completed: 9 },
        quizzes: { total: 3, passed: 1 },
        assignments: { total: 2, submitted: 1 },
      },
      remainingSummary: ["11 lessons remaining", "2 quizzes to pass", "1 assignment to submit"],
      estimatedCompletionLabel: "On track for Sales Enablement rollout",
    },
  ];

  return {
    earned,
    locked,
    stats: {
      earnedCount: earned.length,
      lockedCount: locked.length,
      inProgressCount: locked.filter((l) => l.progressPercent > 0).length,
    },
    latestEarned: earned[0],
    upcoming: locked[0],
  };
}

export function getDemoCertificateList() {
  return getDemoCertificateHubData().earned;
}

export function getDemoCertificateCount(): number {
  return 428;
}
