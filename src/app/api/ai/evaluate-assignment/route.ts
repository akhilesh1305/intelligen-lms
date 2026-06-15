import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { evaluateAssignment } from "@/lib/ai/assignment-evaluator";
import { db } from "@/lib/db";
import { aiEvaluateSchema } from "@/lib/validations";
import { createNotification } from "@/lib/notifications";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = aiEvaluateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const submission = await db.assignmentSubmission.findUnique({
    where: { id: parsed.data.submissionId },
    include: {
      assignment: { include: { course: true } },
      user: { select: { id: true, name: true } },
    },
  });

  if (!submission) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isInstructor =
    submission.assignment.course.instructorId === session.id ||
    session.role === "ADMIN";
  const isOwner = submission.userId === session.id;

  if (!isInstructor && !isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const evaluation = await evaluateAssignment(
    submission.assignment.title,
    submission.assignment.description,
    submission.content
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

  if (isInstructor || session.id !== submission.userId) {
    await createNotification({
      userId: submission.userId,
      type: "ASSIGNMENT_GRADED",
      title: `Assignment graded: ${evaluation.grade}%`,
      message: submission.assignment.title,
      link: `/learn/${submission.assignment.courseId}?tab=assignments`,
    });
  }

  return NextResponse.json({ ...evaluation, feedback });
}
