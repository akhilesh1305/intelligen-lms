import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { createNotification } from "@/lib/notifications";
import { sendCourseApprovalEmail } from "@/lib/email";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const approved = body.approved !== false;
  const reason = body.reason as string | undefined;

  const course = await db.course.findUnique({
    where: { id },
    include: { instructor: true },
  });

  if (!course) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.course.update({
    where: { id },
    data: approved
      ? {
          status: "APPROVED",
          published: true,
          approvedAt: new Date(),
          approvedById: session.id,
          rejectionReason: null,
        }
      : {
          status: "REJECTED",
          published: false,
          rejectionReason: reason ?? "Does not meet platform guidelines",
        },
  });

  await createNotification({
    userId: course.instructorId,
    type: approved ? "COURSE_APPROVED" : "COURSE_REJECTED",
    title: approved ? "Course approved!" : "Course not approved",
    message: approved
      ? `${course.title} is now live`
      : `${course.title} needs revisions`,
    link: `/instructor/courses/${course.id}`,
  });

  await sendCourseApprovalEmail(
    course.instructor.email,
    course.instructor.name,
    course.title,
    approved,
    reason
  );

  return NextResponse.json({ success: true });
}
