import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { startChallengeQuizSession } from "@/lib/challenge-quiz-session";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const result = await startChallengeQuizSession(id, session.id);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to start quiz";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
