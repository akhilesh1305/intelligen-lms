import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { evaluateAssignment } from "@/lib/ai/assignment-evaluator";
import { addPoints } from "@/lib/gamification";
import { syncEnrollmentProgress } from "@/lib/progress";
import { createNotification } from "@/lib/notifications";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: assignmentId } = await params;
  const { content } = await request.json();

  if (!content?.trim()) {
    return NextResponse.json({ error: "Content required" }, { status: 400 });
  }

  const assignment = await db.assignment.findUnique({ where: { id: assignmentId } });
  if (!assignment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const enrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: { userId: session.id, courseId: assignment.courseId },
    },
  });

  if (!enrollment) {
    return NextResponse.json({ error: "Not enrolled" }, { status: 403 });
  }

  const submission = await db.assignmentSubmission.upsert({
    where: {
      assignmentId_userId: { assignmentId, userId: session.id },
    },
    create: { assignmentId, userId: session.id, content },
    update: { content, submittedAt: new Date() },
  });

  const evaluation = await evaluateAssignment(
    assignment.title,
    assignment.description,
    content
  );
  const feedback = `${evaluation.feedback}\n\n**Strengths:** ${evaluation.strengths.join("; ")}\n**Improvements:** ${evaluation.improvements.join("; ")}`;

  await db.assignmentSubmission.update({
    where: { id: submission.id },
    data: {
      grade: evaluation.grade,
      feedback,
      gradedAt: new Date(),
    },
  });

  await createNotification({
    userId: session.id,
    type: "ASSIGNMENT_GRADED",
    title: `AI graded your assignment: ${evaluation.grade}%`,
    message: assignment.title,
    link: `/learn/${assignment.courseId}?tab=assignments`,
  });

  await addPoints(session.id, 25);
  await syncEnrollmentProgress(session.id, assignment.courseId);

  const course = await db.course.findUnique({ where: { id: assignment.courseId } });
  if (course) {
    await createNotification({
      userId: course.instructorId,
      type: "ASSIGNMENT_GRADED",
      title: "New assignment submission",
      message: `A learner submitted ${assignment.title}`,
      link: `/instructor/courses/${course.id}`,
    });
  }

  return NextResponse.json({
    success: true,
    grade: evaluation.grade,
    feedback,
    source: evaluation.source,
  });
}
