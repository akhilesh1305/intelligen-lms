import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getCourseCatalog } from "@/lib/assistant/context";
import { generatePersonalizedRoadmap } from "@/lib/ai/roadmap-generator";
import { db } from "@/lib/db";
import { aiRoadmapSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = aiRoadmapSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const [catalog, enrollments] = await Promise.all([
    getCourseCatalog(),
    db.enrollment.findMany({
      where: { userId: session.id },
      select: { courseId: true },
    }),
  ]);

  const result = await generatePersonalizedRoadmap(
    parsed.data.goal,
    catalog,
    new Set(enrollments.map((e) => e.courseId))
  );

  return NextResponse.json(result);
}
