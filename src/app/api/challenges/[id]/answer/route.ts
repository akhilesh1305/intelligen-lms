import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  submitChallengeQuizAnswer,
  timeoutChallengeQuizQuestion,
} from "@/lib/challenge-quiz-session";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    sessionId?: string;
    answerIndex?: number;
    timedOut?: boolean;
  };

  if (!body.sessionId) {
    return NextResponse.json({ error: "Missing session" }, { status: 400 });
  }

  try {
    const result = body.timedOut
      ? await timeoutChallengeQuizQuestion(body.sessionId, session.id)
      : await submitChallengeQuizAnswer(
          body.sessionId,
          session.id,
          typeof body.answerIndex === "number" ? body.answerIndex : -1
        );
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to submit answer";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
