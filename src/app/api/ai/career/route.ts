import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getCourseCatalog } from "@/lib/assistant/context";
import { getCareerAdvice } from "@/lib/ai/career-advisor";
import { db } from "@/lib/db";
import { aiCareerSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = aiCareerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const [catalog, enrollments, assessments] = await Promise.all([
    getCourseCatalog(),
    db.enrollment.findMany({
      where: { userId: session.id, completedAt: { not: null } },
      select: { courseId: true },
    }),
    db.userSkillAssessment.findMany({
      where: { userId: session.id },
      include: { skill: { select: { name: true } } },
    }),
  ]);

  const advice = await getCareerAdvice(
    parsed.data.goal,
    catalog,
    enrollments.map((e) => e.courseId),
    assessments.map((a) => a.skill.name)
  );

  return NextResponse.json(advice);
}
