import { NextResponse } from "next/server";
import { getActiveChallenges, getOrCreatePeriodQuizzes } from "@/lib/challenges";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period");

  if (period === "daily" || period === "weekly") {
    const quizzes = await getOrCreatePeriodQuizzes(
      period === "daily" ? "DAILY" : "WEEKLY"
    );
    return NextResponse.json(quizzes);
  }

  const challenges = await getActiveChallenges();
  return NextResponse.json(challenges);
}
