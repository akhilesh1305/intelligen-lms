import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { instructorApiGuard } from "@/lib/instructor";
import { logAudit } from "@/lib/audit";
import { db } from "@/lib/db";
import { saveCourseThumbnail } from "@/lib/media";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await instructorApiGuard(await getSession());
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const course = await db.course.findUnique({ where: { id } });

  if (!course || (course.instructorId !== session.id && session.role !== "ADMIN")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("thumbnail");

  if (!file || !(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { error: "Please choose a thumbnail image" },
      { status: 400 }
    );
  }

  let thumbnail: string;
  try {
    thumbnail = await saveCourseThumbnail(id, file);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid image" },
      { status: 400 }
    );
  }

  const updated = await db.course.update({
    where: { id },
    data: { thumbnail },
    select: { id: true, thumbnail: true },
  });

  await logAudit({
    action: "COURSE_UPDATED",
    userId: session.id,
    userEmail: session.email,
    userName: session.name,
    targetType: "Course",
    targetId: id,
    metadata: { updateType: "thumbnail" },
    request,
  });

  return NextResponse.json({ course: updated });
}
