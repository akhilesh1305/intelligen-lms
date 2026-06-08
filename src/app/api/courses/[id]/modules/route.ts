import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { moduleSchema } from "@/lib/validations";
import { db } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !["INSTRUCTOR", "ADMIN"].includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: courseId } = await params;
  const course = await db.course.findUnique({ where: { id: courseId } });

  if (!course || (course.instructorId !== session.id && session.role !== "ADMIN")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = moduleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const moduleCount = await db.module.count({ where: { courseId } });

  const mod = await db.module.create({
    data: {
      title: parsed.data.title,
      order: body.order ?? moduleCount + 1,
      courseId,
    },
  });

  return NextResponse.json({ id: mod.id }, { status: 201 });
}
