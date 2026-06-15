import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { submitChallengeAttempt } from "@/lib/challenges";
import { db } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const { answers } = (await request.json()) as { answers: number[] };

  if (!Array.isArray(answers)) {
    return NextResponse.json({ error: "Invalid answers" }, { status: 400 });
  }

  const quizSession = await db.challengeQuizSession.findFirst({
    where: {
      challengeId: id,
      userId: session.id,
      status: { in: ["COMPLETED", "FORFEITED"] },
    },
    orderBy: { startedAt: "desc" },
  });

  if (!quizSession) {
    return NextResponse.json(
      { error: "Start the timed quiz from the play page" },
      { status: 400 }
    );
  }

  try {
    const result = await submitChallengeAttempt(id, session.id, answers);
    if (!result) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Submit failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
