import { NextResponse } from "next/server";
import { getWeeklyLeaderboard } from "@/lib/weekly-leaderboard";

export async function GET() {
  const leaders = await getWeeklyLeaderboard(20);
  return NextResponse.json({ leaders });
}
