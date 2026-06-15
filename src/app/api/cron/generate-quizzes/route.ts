import { NextResponse } from "next/server";
import { getOrCreatePeriodQuizzes } from "@/lib/challenges";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");

  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [daily, weekly] = await Promise.all([
    getOrCreatePeriodQuizzes("DAILY"),
    getOrCreatePeriodQuizzes("WEEKLY"),
  ]);

  return NextResponse.json({
    ok: true,
    dailyCount: daily.length,
    weeklyCount: weekly.length,
  });
}
