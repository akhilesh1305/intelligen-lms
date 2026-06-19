import type { CertificateHubData } from "@/lib/certificate-hub";
import { DEMO_COURSES } from "./courses";

export function getDemoCertificateHubData(): CertificateHubData {
  const ai = DEMO_COURSES.find((c) => c.id === "demo-ai-fundamentals")!;
  const leadership = DEMO_COURSES.find((c) => c.id === "demo-leadership-excellence")!;
  const analytics = DEMO_COURSES.find((c) => c.id === "demo-data-analytics-mastery")!;
  const genAi = DEMO_COURSES.find((c) => c.id === "demo-generative-ai-business")!;

  const earned = [
    {
      id: "demo-cert-1",
      certificateNo: "IGLMS-DEMO-AI-2026-0042",
      issuedAt: new Date("2026-05-18"),
      courseId: ai.id,
      courseTitle: ai.title,
      skillLevel: ai.skillLevel,
      template: "ai-professional" as const,
      organizationName: null,
    },
    {
      id: "demo-cert-2",
      certificateNo: "IGLMS-DEMO-LEAD-2026-0018",
      issuedAt: new Date("2026-04-02"),
      courseId: leadership.id,
      courseTitle: leadership.title,
      skillLevel: leadership.skillLevel,
      template: "corporate" as const,
      organizationName: null,
    },
    {
      id: "demo-cert-3",
      certificateNo: "IGLMS-DEMO-EXCEL-2026-0007",
      issuedAt: new Date("2026-03-11"),
      courseId: genAi.id,
      courseTitle: "Learning Excellence",
      skillLevel: "INTERMEDIATE",
      template: "ai-professional" as const,
      organizationName: "IntelliGen Academy",
    },
  ];

  const locked = [
    {
      courseId: analytics.id,
      courseTitle: analytics.title,
      description: analytics.description,
      progressPercent: 42,
      template: "ai-professional" as const,
      requirements: {
        lessons: { total: 26, completed: 11 },
        quizzes: { total: 4, passed: 2 },
        assignments: { total: 3, submitted: 1 },
      },
      remainingSummary: ["15 lessons remaining", "2 quizzes to pass", "2 assignments to submit"],
      estimatedCompletionLabel: "On track — keep learning",
    },
    {
      courseId: "demo-cybersecurity-essentials",
      courseTitle: "Cybersecurity Essentials",
      description: DEMO_COURSES.find((c) => c.id === "demo-cybersecurity-essentials")!.description,
      progressPercent: 18,
      template: "ai-professional" as const,
      requirements: {
        lessons: { total: 22, completed: 4 },
        quizzes: { total: 3, passed: 0 },
        assignments: { total: 2, submitted: 0 },
      },
      remainingSummary: ["18 lessons remaining", "3 quizzes to pass", "2 assignments to submit"],
      estimatedCompletionLabel: "Getting started",
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
  return 1284;
}
