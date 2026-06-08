import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { addPoints, checkAndAwardBadges } from "@/lib/gamification";
import { syncEnrollmentProgress } from "@/lib/progress";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: quizId } = await params;
  const { answers } = await request.json() as { answers: number[] };

  const quiz = await db.quiz.findUnique({
    where: { id: quizId },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.id, courseId: quiz.courseId } },
  });

  if (!enrollment) {
    return NextResponse.json({ error: "Not enrolled" }, { status: 403 });
  }

  let correct = 0;
  quiz.questions.forEach((q, i) => {
    if (answers[i] === q.correctIndex) correct++;
  });

  const score =
    quiz.questions.length > 0
      ? Math.round((correct / quiz.questions.length) * 100)
      : 0;
  const passed = score >= quiz.passingScore;

  await db.quizAttempt.upsert({
    where: { quizId_userId: { quizId, userId: session.id } },
    create: {
      quizId,
      userId: session.id,
      score,
      passed,
      answers: JSON.stringify(answers),
    },
    update: { score, passed, answers: JSON.stringify(answers) },
  });

  if (passed) {
    await addPoints(session.id, 50);
    await syncEnrollmentProgress(session.id, quiz.courseId);
    await checkAndAwardBadges(session.id);
  }

  return NextResponse.json({ score, passed, passingScore: quiz.passingScore });
}
