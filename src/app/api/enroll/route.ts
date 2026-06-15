import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isFreeCourse } from "@/lib/currency";
import { db } from "@/lib/db";
import { sendEnrollmentEmail } from "@/lib/email";
import { createNotification } from "@/lib/notifications";
import { canUserViewCourse } from "@/lib/organizations";
import { assertPrerequisitesMet } from "@/lib/prerequisites";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await request.json();
  if (!courseId) {
    return NextResponse.json({ error: "Course ID required" }, { status: 400 });
  }

  const course = await db.course.findUnique({ where: { id: courseId } });
  if (!course || !course.published || course.status !== "APPROVED") {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const mayView = await canUserViewCourse(
    { id: session.id, role: session.role },
    course
  );
  if (!mayView) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  if (!isFreeCourse(course.pricePaise)) {
    return NextResponse.json(
      { error: "This course requires payment. Use Buy this course." },
      { status: 402 }
    );
  }

  const existing = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.id, courseId } },
  });

  if (existing) {
    return NextResponse.json({ error: "Already enrolled" }, { status: 409 });
  }

  const prereqError = await assertPrerequisitesMet(session.id, courseId);
  if (prereqError) {
    return NextResponse.json({ error: prereqError }, { status: 403 });
  }

  await db.enrollment.create({
    data: { userId: session.id, courseId },
  });

  const user = await db.user.findUnique({ where: { id: session.id } });
  if (user) {
    await sendEnrollmentEmail(user.email, user.name, course.title);
    await createNotification({
      userId: session.id,
      type: "ENROLLMENT",
      title: "Enrollment confirmed",
      message: `You're enrolled in ${course.title}`,
      link: `/learn/${courseId}`,
    });
  }

  return NextResponse.json({ success: true });
}
