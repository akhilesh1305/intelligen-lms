import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { recordFlashcardReview } from "@/lib/knowledge-games/flashcard-srs";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { cardId, correct } = (await request.json()) as {
    cardId?: string;
    correct?: boolean;
  };

  if (!cardId || typeof correct !== "boolean") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const state = await recordFlashcardReview(session.id, cardId, correct);
  return NextResponse.json({
    cardId: state.cardId,
    nextReviewAt: state.nextReviewAt.toISOString(),
    intervalDays: state.intervalDays,
    repetitions: state.repetitions,
  });
}
