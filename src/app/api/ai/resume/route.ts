import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { generateResume } from "@/lib/ai/resume-builder";
import { db } from "@/lib/db";
import { aiResumeSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = aiResumeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const [user, enrollments, certificates, assessments] = await Promise.all([
    db.user.findUnique({ where: { id: session.id } }),
    db.enrollment.findMany({
      where: { userId: session.id, completedAt: { not: null } },
      include: { course: { select: { title: true } } },
    }),
    db.certificate.findMany({
      where: { userId: session.id },
      include: { course: { select: { title: true } } },
    }),
    db.userSkillAssessment.findMany({
      where: { userId: session.id },
      include: { skill: { select: { name: true } } },
    }),
  ]);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const result = await generateResume({
    name: user.name,
    email: user.email,
    skills: assessments.map((a) => a.skill.name),
    completedCourses: enrollments.map((e) => e.course.title),
    certificates: certificates.map((c) => c.course.title),
    careerGoal: parsed.data.careerGoal,
  });

  return NextResponse.json(result);
}
