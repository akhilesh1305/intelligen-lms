import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDailyInsight } from "@/lib/coach/insights";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const insight = await getDailyInsight(session.id);
  return NextResponse.json(insight);
}
