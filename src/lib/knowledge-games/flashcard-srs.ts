import { db } from "@/lib/db";

/** Simplified SM-2 style update after a review. */
export async function recordFlashcardReview(
  userId: string,
  cardId: string,
  correct: boolean
) {
  const now = new Date();
  const existing = await db.flashcardReviewState.findUnique({
    where: { userId_cardId: { userId, cardId } },
  });

  if (!correct) {
    const nextReviewAt = new Date(now.getTime() + 60 * 60 * 1000);
    return db.flashcardReviewState.upsert({
      where: { userId_cardId: { userId, cardId } },
      create: {
        userId,
        cardId,
        easeFactor: 2.3,
        intervalDays: 0,
        repetitions: 0,
        nextReviewAt,
        lastReviewAt: now,
      },
      update: {
        easeFactor: Math.max(1.3, (existing?.easeFactor ?? 2.5) - 0.2),
        intervalDays: 0,
        repetitions: 0,
        nextReviewAt,
        lastReviewAt: now,
      },
    });
  }

  const repetitions = (existing?.repetitions ?? 0) + 1;
  const easeFactor = Math.min(3, (existing?.easeFactor ?? 2.5) + 0.1);
  const intervalDays =
    repetitions === 1 ? 1 : repetitions === 2 ? 3 : Math.round((existing?.intervalDays ?? 1) * easeFactor);
  const nextReviewAt = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);

  return db.flashcardReviewState.upsert({
    where: { userId_cardId: { userId, cardId } },
    create: {
      userId,
      cardId,
      easeFactor,
      intervalDays,
      repetitions,
      nextReviewAt,
      lastReviewAt: now,
    },
    update: {
      easeFactor,
      intervalDays,
      repetitions,
      nextReviewAt,
      lastReviewAt: now,
    },
  });
}

export async function getDueFlashcardIds(userId: string, allCardIds: string[]) {
  const states = await db.flashcardReviewState.findMany({
    where: { userId, cardId: { in: allCardIds } },
  });
  const now = Date.now();
  const stateMap = new Map(states.map((s) => [s.cardId, s]));

  const due = allCardIds.filter((id) => {
    const state = stateMap.get(id);
    return !state || state.nextReviewAt.getTime() <= now;
  });

  return due.length > 0 ? due : allCardIds;
}
