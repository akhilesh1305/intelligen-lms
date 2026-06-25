import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { reportChallengeQuizViolation } from "@/lib/challenge-quiz-session";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId } = (await request.json()) as { sessionId?: string };

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session" }, { status: 400 });
  }

  try {
    const result = await reportChallengeQuizViolation(sessionId, session.id);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to record violation";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
